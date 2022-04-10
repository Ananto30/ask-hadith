package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/hashicorp/golang-lru"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const PAGE_SIZE = 50

var mongoClient *mongo.Client

var cache *lru.Cache

func SearchHadith(w http.ResponseWriter, r *http.Request) {
	var err error

	if cache == nil {
		cache, err = lru.New(512)
		if err != nil {
			log.Fatal(err)
		}
	}

	query := r.URL.Query().Get("search")
	if query == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var news *[]bson.M

	if val, ok := cache.Get(query); ok {
		news = val.(*[]bson.M)
	} else {
		news, err = searchHadith(query)
		if err != nil {
			log.Fatal(err)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(news)
}

func searchHadith(query string) (*[]bson.M, error) {
	client := getMongoClient()
	collection := client.Database("hadith").Collection("hadiths")

	pipeline := []bson.M{
		{
			"$search": bson.M{
				"compound": bson.M{
					"must": bson.A{
						bson.M{
							"text": bson.M{
								"query": query,
								"path":  bson.A{"body_en", "chapter_en"},
								"fuzzy": bson.M{"maxEdits": 1, "maxExpansions": 10},
							},
						},
					},
					"should": bson.A{
						bson.M{
							"phrase": bson.M{
								"query": query,
								"path":  "body_en",
								"slop":  2,
							},
						},
					},
				},
			},
		},
		{
			"$limit": PAGE_SIZE,
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

	cursor, err := collection.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return nil, err
	}

	var results []bson.M
	err = cursor.All(context.TODO(), &results)
	if err != nil {
		return nil, err
	}

	return &results, nil
}

func getMongoClient() *mongo.Client {
	if mongoClient != nil {
		return mongoClient
	}
	client, err := mongo.NewClient(options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	mongoClient = client
	return mongoClient
}
