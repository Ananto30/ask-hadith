package handler

import (
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
)

func GetHadithByBookRefNo(w http.ResponseWriter, r *http.Request) {
	collectionID := r.URL.Query().Get("collection_id")
	if collectionID == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	book := r.URL.Query().Get("book")
	if book == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	refNo := r.URL.Query().Get("ref_no")
	if refNo == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	client := getMongoClient()
	collection := client.Database("hadith").Collection("hadiths")

	var result bson.M
	if err := collection.FindOne(r.Context(),
		bson.M{
			"collection_id": collectionID,
			"book_no":       book,
			"book_ref_no":   refNo,
		},
	).Decode(&result); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(result)
}
