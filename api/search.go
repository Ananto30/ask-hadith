/*
Package handler provides the HTTP handlers for the serverless API.
This file contains the handler for the /search endpoint.
*/
package handler

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
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
	pageSize = 500
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
		fmt.Println("cache hit")
		sendResp(w, val)
		return
	}

	colResps, err := searchInMongo(ctx, query)
	if err != nil {
		sendServerErrorResp(w, err)
		return
	}
	searchResp := colRespToSearchResp(colResps)

	cache.Add(query, searchResp)
	fmt.Println("cache added")

	sendResp(w, searchResp)
}

func searchInMongo(ctx context.Context, query string) ([]CollectionResponse, error) {
	result := make([]CollectionResponse, 0)

	words := strings.Fields(query)
	if isSpecificHadith(words) {
		hadith, err := getHadith(ctx, strings.ToLower(words[0]), words[1])
		if err != nil {
			return result, err
		}

		cache.Add(query, hadith)
		result = append(result, hadith...)
		return result, nil
	}

	hadithGroups, err := compoundSearch(ctx, query)
	if err != nil {
		return result, err
	}

	for _, group := range hadithGroups {
		result = append(result, mongoResultToColResp(group))
	}

	cache.Add(query, result)
	return result, nil
}

func compoundSearch(ctx context.Context, query string) ([]MongoGroupByResult, error) {
	client, err := getMongoClient()
	if err != nil {
		return nil, err
	}
	collection := client.Database("hadith").Collection("hadiths")

	pipeline := pipelineQueryGroupByCollection(query)
	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}

	var results []MongoGroupByResult
	err = cursor.All(ctx, &results)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func pipelineQueryGroupByCollection(query string) []bson.M {
	return []bson.M{
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
			"$group": bson.M{
				"_id": "$collection_id",
				"collection": bson.M{
					"$first": "$collection",
				},
				"count": bson.M{
					"$sum": 1,
				},
				"hadiths": bson.M{
					"$push": bson.M{
						"collection_id": "$collection_id",
						"collection":    "$collection",
						"hadith_no":     "$hadith_no",
						"book_no":       "$book_no",
						"book_en":       "$book_en",
						"chapter_no":    "$chapter_no",
						"chapter_en":    "$chapter_en",
						"narrator_en":   "$narrator_en",
						"body_en":       "$body_en",
						"book_ref_no":   "$book_ref_no",
						"hadith_grade":  "$hadith_grade",
						"score":         bson.M{"$meta": "searchScore"},
						"highlights":    bson.M{"$meta": "searchHighlights"},
					},
				},
			},
		},
		{
			"$limit": pageSize,
		},
		{
			"$sort": bson.M{
				"hadiths.score": -1,
			},
		},
	}
}

func getHadith(ctx context.Context, hadithName, hadithNo string) ([]CollectionResponse, error) {
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

	var results []MongoHadith
	err = cursor.All(ctx, &results)
	if err != nil {
		return nil, err
	}

	// usually there is only one hadith
	res := make([]CollectionResponse, 0)
	if len(results) == 0 {
		return res, nil
	}

	first := CollectionResponse{}
	first.GroupByResult = &GroupByResult{}
	first.ID = results[0].CollectionID
	first.Collection = results[0].Collection
	first.Count = 1
	first.Hadiths = make([]HadithResponse, 0)
	first.Hadiths = append(first.Hadiths, mongoHadithToResp(results[0]))
	res = append(res, first)

	return res, nil
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

func sendResp(w http.ResponseWriter, r interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(r)
}

func sendBadRequestResp(w http.ResponseWriter, reason string) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte(reason))
}

func sendServerErrorResp(w http.ResponseWriter, err error) {
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

type Hadith struct {
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
}

type MongoHadith struct {
	*Hadith    `bson:",inline" json:",inline"`
	Highlights []MongoHighlight `bson:"highlights" json:"highlights"`
}

type HadithResponse struct {
	*Hadith    `bson:",inline" json:",inline"`
	Highlights []string `json:"highlights"`
}

type MongoHighlight struct {
	Path  string      `bson:"path" json:"path"`
	Score float64     `bson:"score" json:"score"`
	Texts []MongoText `bson:"texts" json:"texts"`
}

type MongoText struct {
	Type  string `bson:"type" json:"type"`
	Value string `bson:"value" json:"value"`
}

type GroupByResult struct {
	ID         string `bson:"_id" json:"_id"`
	Count      int    `bson:"count" json:"count"`
	Collection string `bson:"collection" json:"collection"`
}

type MongoGroupByResult struct {
	*GroupByResult `bson:",inline" json:",inline"`
	Hadiths        []MongoHadith `bson:"hadiths" json:"hadiths"`
}

type CollectionResponse struct {
	*GroupByResult `bson:",inline" json:",inline"`
	Hadiths        []HadithResponse `bson:"hadiths" json:"hadiths"`
}

type SearchResponse struct {
	Data              []CollectionResponse `json:"data"`
	FirstHadithBase64 string               `json:"first_hadith_base64"`
}

func mongoHighlightToSimpleHighlight(highlight MongoHighlight) []string {
	var res []string
	for _, text := range highlight.Texts {
		if text.Type == "hit" {
			res = append(res, text.Value)
		}
	}
	return res
}

func mongoHadithToResp(hadith MongoHadith) HadithResponse {
	highlights := NewSet()
	for _, highlight := range hadith.Highlights {
		highlights.AddMulti(mongoHighlightToSimpleHighlight(highlight))
	}
	return HadithResponse{hadith.Hadith, highlights.ToSlice()}
}

func mongoResultToColResp(group MongoGroupByResult) CollectionResponse {
	var res []HadithResponse
	for i := range group.Hadiths {
		hadith := group.Hadiths[i]
		res = append(res, mongoHadithToResp(hadith))
	}
	return CollectionResponse{group.GroupByResult, res}
}

func colRespToSearchResp(colResps []CollectionResponse) SearchResponse {
	var firstHadithBase64 string
	if len(colResps) > 0 && len(colResps[0].Hadiths) > 0 {
		firstHadithBase64 = hadithToBase64(colResps[0].Hadiths[0])
	}
	return SearchResponse{colResps, firstHadithBase64}
}

func hadithToBase64(hadith HadithResponse) string {
	bytes, err := json.Marshal(hadith)
	if err != nil {
		return ""
	}
	return base64.URLEncoding.EncodeToString(bytes)
}

type Set map[string]struct{}

func NewSet() Set {
	return make(map[string]struct{})
}

func (s Set) Add(v string) {
	s[v] = struct{}{}
}

func (s Set) AddMulti(v []string) {
	for _, vv := range v {
		s.Add(vv)
	}
}

func (s Set) ToSlice() []string {
	var result []string
	for k := range s {
		result = append(result, k)
	}
	return result
}
