/*
Package handler provides the HTTP handlers for the serverless API.
This file contains the handler for the /browse endpoint.
*/
package handler

import (
	"context"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"unicode/utf8"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const snippetLen = 220

// BookSummary is one book of a collection with its hadith count.
type BookSummary struct {
	BookNo     string `bson:"_id" json:"book_no"`
	BookEn     string `bson:"book_en" json:"book_en"`
	Collection string `bson:"collection" json:"collection"`
	Count      int    `bson:"count" json:"count"`
}

// HadithSnippet is a short preview of a hadith for listing pages.
type HadithSnippet struct {
	BookRefNo  string `bson:"book_ref_no" json:"book_ref_no"`
	HadithNo   string `bson:"hadith_no" json:"hadith_no"`
	NarratorEn string `bson:"narrator_en" json:"narrator_en"`
	BodyEn     string `bson:"body_en" json:"snippet"`
	ChapterEn  string `bson:"chapter_en" json:"chapter_en"`
	BookEn     string `bson:"book_en" json:"-"`
	Collection string `bson:"collection" json:"-"`
}

// BrowseResponse lists the books of a collection, or the hadiths of a book.
type BrowseResponse struct {
	Collection string          `json:"collection"`
	BookNo     string          `json:"book_no,omitempty"`
	BookEn     string          `json:"book_en,omitempty"`
	Books      []BookSummary   `json:"books,omitempty"`
	Hadiths    []HadithSnippet `json:"hadiths,omitempty"`
}

// BrowseHadiths returns the books of a collection (collection_id only) or the
// hadith snippets of one book (collection_id and book). Feeds crawlable
// listing pages.
func BrowseHadiths(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	collectionID := r.URL.Query().Get("collection_id")
	book := r.URL.Query().Get("book")
	if reason, ok := validateCollectionID(collectionID); !ok {
		sendBadRequestResp(w, reason)
		return
	}
	if book != "" {
		if reason, ok := validateBook(book); !ok {
			sendBadRequestResp(w, reason)
			return
		}
	}

	client, err := getMongoClient()
	if err != nil {
		sendServerErrorResp(w, err)
		return
	}
	col := client.Database("hadith").Collection("hadiths")

	var resp BrowseResponse
	if book == "" {
		resp, err = browseBooks(ctx, col, collectionID)
	} else {
		resp, err = browseBook(ctx, col, collectionID, book)
	}
	if err != nil {
		sendServerErrorResp(w, err)
		return
	}
	if len(resp.Books) == 0 && len(resp.Hadiths) == 0 {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	// The corpus is static, so let the CDN absorb repeat crawler hits.
	w.Header().Set("Cache-Control", "public, s-maxage=86400")
	sendResp(w, resp)
}

func browseBooks(ctx context.Context, col *mongo.Collection, collectionID string) (BrowseResponse, error) {
	cursor, err := col.Aggregate(ctx, []bson.M{
		{"$match": bson.M{"collection_id": collectionID}},
		{"$group": bson.M{
			"_id":        "$book_no",
			"book_en":    bson.M{"$first": "$book_en"},
			"collection": bson.M{"$first": "$collection"},
			"count":      bson.M{"$sum": 1},
		}},
	})
	if err != nil {
		return BrowseResponse{}, err
	}

	books := make([]BookSummary, 0)
	if err := cursor.All(ctx, &books); err != nil {
		return BrowseResponse{}, err
	}
	// book_no is a string in Mongo, so sort numerically here.
	sort.Slice(books, func(i, j int) bool { return numLess(books[i].BookNo, books[j].BookNo) })

	resp := BrowseResponse{Books: books}
	if len(books) > 0 {
		resp.Collection = books[0].Collection
	}
	return resp, nil
}

func browseBook(ctx context.Context, col *mongo.Collection, collectionID, book string) (BrowseResponse, error) {
	cursor, err := col.Find(
		ctx,
		bson.M{"collection_id": collectionID, "book_no": book},
		options.Find().SetProjection(bson.M{
			"book_ref_no": 1, "hadith_no": 1, "narrator_en": 1, "body_en": 1,
			"chapter_en": 1, "book_en": 1, "collection": 1, "_id": 0,
		}),
	)
	if err != nil {
		return BrowseResponse{}, err
	}

	hadiths := make([]HadithSnippet, 0)
	if err := cursor.All(ctx, &hadiths); err != nil {
		return BrowseResponse{}, err
	}
	sort.Slice(hadiths, func(i, j int) bool { return numLess(hadiths[i].BookRefNo, hadiths[j].BookRefNo) })

	resp := BrowseResponse{BookNo: book}
	if len(hadiths) > 0 {
		resp.Collection = hadiths[0].Collection
		resp.BookEn = hadiths[0].BookEn
	}
	for i := range hadiths {
		hadiths[i].BodyEn = clipWords(hadiths[i].BodyEn, snippetLen)
	}
	resp.Hadiths = hadiths
	return resp, nil
}

// numLess orders numeric strings by value; non-numeric ones fall back to string order.
func numLess(a, b string) bool {
	x, errA := strconv.Atoi(a)
	y, errB := strconv.Atoi(b)
	if errA != nil || errB != nil {
		return a < b
	}
	return x < y
}

// clipWords cuts s to at most n bytes on a word boundary without splitting a rune.
func clipWords(s string, n int) string {
	if len(s) <= n {
		return s
	}
	for n > 0 && !utf8.RuneStart(s[n]) {
		n--
	}
	cut := s[:n]
	if i := strings.LastIndexByte(cut, ' '); i > 0 {
		cut = cut[:i]
	}
	return strings.TrimRight(cut, " ,;:.") + "…"
}
