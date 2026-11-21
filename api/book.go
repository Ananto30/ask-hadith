/*
Package handler provides the HTTP handlers for the serverless API.
This file contains the handler for the /book endpoint.
*/
package handler

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"regexp"
	"sort"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetHadithByBookRefNo returns a hadith by its collection ID, book number and
// book reference number. These are all required query parameters.
func GetHadithByBookRefNo(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	collectionID := r.URL.Query().Get("collection_id")
	book := r.URL.Query().Get("book")
	refNo := r.URL.Query().Get("ref_no")
	if reason, ok := validateGetHadithByBookRefNoQueryParams(collectionID, book, refNo); !ok {
		sendBadRequestResp(w, reason)
		return
	}

	client, err := getMongoClient()
	if err != nil {
		sendServerErrorResp(w, err)
		return
	}
	collection := client.Database("hadith").Collection("hadiths")

	var resp BookResponse
	if err := collection.FindOne(
		ctx,
		bson.M{
			"collection_id": collectionID,
			"book_no":       book,
			"book_ref_no":   refNo,
		},
	).
		Decode(&resp); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			http.Error(w, "hadith not found", http.StatusNotFound)
			return
		}
		sendServerErrorResp(w, err)
		return
	}

	resp.Base64 = hadithToBase64(*resp.HadithResponse)
	// Neighbours only feed prev/next links, so a failure must not fail the page.
	resp.Prev, resp.Next = bookNeighbours(ctx, collection, collectionID, book, refNo)

	w.Header().Set("Cache-Control", "public, s-maxage=86400")

	sendResp(w, resp)
}

func validateGetHadithByBookRefNoQueryParams(collectionID, book, refNo string) (string, bool) {
	if reason, ok := validateCollectionID(collectionID); !ok {
		return reason, false
	}
	if reason, ok := validateBook(book); !ok {
		return reason, false
	}
	if reason, ok := validateRefNo(refNo); !ok {
		return reason, false
	}

	return "", true
}

func validateCollectionID(collectionID string) (string, bool) {
	if collectionID == "" {
		return "collection_id is required", false
	}
	if !contains(shortNames, collectionID) {
		return fmt.Sprintf("collection_id must be one of %s", strings.Join(shortNames, ", ")), false
	}

	return "", true
}

var bookKeyRegex = regexp.MustCompile(`^[0-9]+[a-z]?$`)

func validateBook(book string) (string, bool) {
	if book == "" {
		return "book is required", false
	}
	if !bookKeyRegex.MatchString(book) {
		return "book must be a number or a numeric book key (e.g. 35b)", false
	}

	return "", true
}

func validateRefNo(refNo string) (string, bool) {
	if refNo == "" {
		return "ref_no is required", false
	}
	if !isNumber(refNo) {
		return "ref_no must be a number", false
	}

	return "", true
}

type BookResponse struct {
	*HadithResponse `bson:",inline" json:",inline"`
	Base64          string `json:"base64"`
	Prev            string `json:"prev,omitempty"`
	Next            string `json:"next,omitempty"`
}

// bookNeighbours returns the ref numbers before and after refNo within the same book.
func bookNeighbours(ctx context.Context, col *mongo.Collection, collectionID, book, refNo string) (prev, next string) {
	cursor, err := col.Find(
		ctx,
		bson.M{"collection_id": collectionID, "book_no": book},
		options.Find().SetProjection(bson.M{"book_ref_no": 1, "_id": 0}),
	)
	if err != nil {
		return "", ""
	}
	var refs []HadithRef
	if err := cursor.All(ctx, &refs); err != nil {
		return "", ""
	}
	sort.Slice(refs, func(i, j int) bool { return numLess(refs[i].BookRefNo, refs[j].BookRefNo) })

	for i, r := range refs {
		if r.BookRefNo != refNo {
			continue
		}
		if i > 0 {
			prev = refs[i-1].BookRefNo
		}
		if i < len(refs)-1 {
			next = refs[i+1].BookRefNo
		}
		break
	}
	return prev, next
}
