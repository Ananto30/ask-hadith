/*
Package handler provides the HTTP handlers for the serverless API.
This file contains the handler for the /book endpoint.
*/
package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
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

	var result bson.M
	if err := collection.FindOne(
		ctx,
		bson.M{
			"collection_id": collectionID,
			"book_no":       book,
			"book_ref_no":   refNo,
		},
	).
		Decode(&result); err != nil {
		sendServerErrorResp(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(result)
}

func validateGetHadithByBookRefNoQueryParams(collectionID, book, refNo string) (string, bool) {
	if collectionID == "" {
		return "collection_id is required", false
	}
	if !contains(shortNames, collectionID) {
		return fmt.Sprintf("collection_id must be one of %s", strings.Join(shortNames, ", ")), false
	}

	if book == "" {
		return "book is required", false
	}
	if !isNumber(book) {
		return "book must be a number", false
	}

	if refNo == "" {
		return "ref_no is required", false
	}
	if !isNumber(refNo) {
		return "ref_no must be a number", false
	}

	return "", true
}
