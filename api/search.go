/*
Package handler provides the HTTP handlers for the serverless API.
This file contains the handler for the /search endpoint.
*/
package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	lru "github.com/hashicorp/golang-lru"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	pageSize = 50
)

var (
	mongoClient *mongo.Client
	cache       *lru.Cache

	shortNames         = []string{"bukhari", "abudawud", "nasai", "tirmidhi", "ibnmajah", "muslim"}
	simpleEnglishRegex = regexp.MustCompile(`^[a-zA-Z0-9\s]+$`)
)

// SearchHadith returns a list of hadiths that match the search query.
func SearchHadith(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	query := r.URL.Query().Get("search")
	if reason, ok := validateQuery(query); !ok {
		sendBadRequestResp(w, reason)
		return
	}
	query = sanitizeQuery(query)

	cache, err := getCache()
	if err != nil {
		sendServerErrorResp(w, err)
		return
	}

	if val, ok := cache.Get(query); ok {
		hadiths := val.([]bson.M)
		sendHadithsResp(w, hadiths)
		return
	}

	words := strings.Fields(query)
	if isSpecificHadith(words) {
		hadith, err := getHadith(ctx, strings.ToLower(words[0]), words[1])
		if err != nil {
			sendServerErrorResp(w, err)
			return
		}

		cache.Add(query, hadith)
		sendHadithsResp(w, hadith)
		return
	}

	hadiths, err := searchHadith(ctx, query)
	if err != nil {
		sendServerErrorResp(w, err)
		return
	}

	cache.Add(query, hadiths)
	sendHadithsResp(w, hadiths)
}

func searchHadith(ctx context.Context, query string) ([]bson.M, error) {
	client, err := getMongoClient()
	if err != nil {
		return nil, err
	}
	collection := client.Database("hadith").Collection("hadiths")

	pipeline := []bson.M{
		{
			"$search": bson.M{
				"compound": bson.M{
					// "must": bson.A{
					// 	bson.M{
					// 		"text": bson.M{
					// 			"query": query,
					// 			"path":  bson.A{"body_en", "chapter_en"},
					// 			"fuzzy": bson.M{"maxEdits": 1, "maxExpansions": 10},
					// 		},
					// 	},
					// },
					"should": bson.A{
						bson.M{
							"phrase": bson.M{
								"query": query,
								"path":  bson.A{"body_en", "chapter_en"},
								"slop":  5,
							},
						},
					},
				},
				"highlight": bson.M{
					"path": bson.A{"body_en", "chapter_en"},
				},
			},
		},
		{
			"$limit": pageSize,
		},
		{
			"$project": bson.M{
				"_id":           0,
				"collection_id": 1,
				"collection":    1,
				"hadith_no":     1,
				"book_no":       1,
				"book_en":       1,
				"chapter_no":    1,
				"chapter_en":    1,
				"narrator_en":   1,
				"body_en":       1,
				"book_ref_no":   1,
				"hadith_grade":  1,
				"score":         bson.M{"$meta": "searchScore"},
				"highlights":    bson.M{"$meta": "searchHighlights"},
			},
		},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}

	var results []bson.M
	err = cursor.All(ctx, &results)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func getHadith(ctx context.Context, hadithName, hadithNo string) ([]bson.M, error) {
	client, err := getMongoClient()
	if err != nil {
		return nil, err
	}
	collection := client.Database("hadith").Collection("hadiths")

	cursor, err := collection.Find(
		ctx,
		bson.M{
			"collection_id": hadithName,
			"hadith_no":     hadithNo,
		},
	)
	if err != nil {
		return nil, err
	}

	var results []bson.M
	err = cursor.All(ctx, &results)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func validateQuery(query string) (string, bool) {
	if len(query) < 3 {
		return "Query must be at least 3 characters", false
	}

	if !simpleEnglishRegex.MatchString(query) {
		return "Query must be in simple English and numbers", false
	}

	return "", true
}

func sanitizeQuery(query string) string {
	return strings.ToLower(strings.ReplaceAll(query, "'", ""))
}

func isSpecificHadith(words []string) bool {
	if len(words) == 2 &&
		contains(shortNames, words[0]) &&
		isNumber(words[1]) {
		return true
	}
	return false
}

func sendHadithsResp(w http.ResponseWriter, hadiths []bson.M) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(hadiths)
}

func sendBadRequestResp(w http.ResponseWriter, reason string) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte(reason))
}

func sendServerErrorResp(w http.ResponseWriter, err error) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte(err.Error()))
}

func getMongoClient() (*mongo.Client, error) {
	if mongoClient != nil {
		return mongoClient, nil
	}

	client, err := mongo.NewClient(options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		return nil, err
	}

	mongoClient = client
	return mongoClient, nil
}

func getCache() (*lru.Cache, error) {
	if cache != nil {
		return cache, nil
	}

	c, err := lru.New(1000)
	if err != nil {
		return nil, err
	}

	cache = c
	return cache, nil
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func isNumber(s string) bool {
	_, err := strconv.Atoi(s)
	return err == nil
}

// SearchResult is the result of a search
// represents the mongo document
type SearchResult struct {
	CollectionID string  `bson:"collection_id" json:"collection_id"`
	Collection   string  `bson:"collection" json:"collection"`
	HadithNo     string  `bson:"hadith_no" json:"hadith_no"`
	BookNo       string  `bson:"book_no" json:"book_no"`
	BookEn       string  `bson:"book_en" json:"book_en"`
	ChapterNo    string  `bson:"chapter_no" json:"chapter_no"`
	ChapterEn    string  `bson:"chapter_en" json:"chapter_en"`
	NarratorEn   string  `bson:"narrator_en" json:"narrator_en"`
	BodyEn       string  `bson:"body_en" json:"body_en"`
	BookRefNo    string  `bson:"book_ref_no" json:"book_ref_no"`
	HadithGrade  string  `bson:"hadith_grade" json:"hadith_grade"`
	Score        float64 `bson:"score" json:"score"`
	Highlights   []struct {
		Path  string  `bson:"path" json:"path"`
		Score float64 `bson:"score" json:"score"`
		Texts []struct {
			Type  string `bson:"type" json:"type"`
			Value string `bson:"value" json:"value"`
		} `bson:"texts" json:"texts"`
	} `bson:"highlights" json:"highlights"`
}
