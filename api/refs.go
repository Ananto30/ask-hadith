/*
Package handler provides the HTTP handlers for the serverless API.
This file contains the handler for the /refs endpoint.
*/
package handler

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// HadithRef identifies a hadith page, enough to build its /book URL.
type HadithRef struct {
	CollectionID string `bson:"collection_id" json:"collection_id"`
	BookNo       string `bson:"book_no" json:"book_no"`
	BookRefNo    string `bson:"book_ref_no" json:"book_ref_no"`
}

// ListHadithRefs returns every hadith reference, used to build the sitemap.
func ListHadithRefs(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	client, err := getMongoClient()
	if err != nil {
		sendServerErrorResp(w, err)
		return
	}

	cursor, err := client.Database("hadith").Collection("hadiths").Find(
		ctx,
		bson.M{},
		options.Find().SetProjection(bson.M{"collection_id": 1, "book_no": 1, "book_ref_no": 1, "_id": 0}),
	)
	if err != nil {
		sendServerErrorResp(w, err)
		return
	}

	refs := make([]HadithRef, 0)
	if err := cursor.All(ctx, &refs); err != nil {
		sendServerErrorResp(w, err)
		return
	}

	// The corpus is static, so let the CDN absorb repeat crawler hits.
	w.Header().Set("Cache-Control", "public, s-maxage=86400")
	sendResp(w, refs)
}
