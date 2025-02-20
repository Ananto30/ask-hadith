package handler

import (
	"testing"
)

func TestValidateGetHadithByBookRefNoQueryParams(t *testing.T) {
	tests := []struct {
		collectionID string
		book         string
		refNo        string
		expectedOk   bool
	}{
		{"bukhari", "1", "1", true},
		{"", "1", "1", false},
		{"bukhari", "", "1", false},
		{"bukhari", "1", "", false},
		{"invalid", "1", "1", false},
		{"bukhari", "invalid", "1", false},
		{"bukhari", "1", "invalid", false},
	}

	for _, test := range tests {
		_, ok := validateGetHadithByBookRefNoQueryParams(test.collectionID, test.book, test.refNo)
		if ok != test.expectedOk {
			t.Errorf("validateGetHadithByBookRefNoQueryParams(%s, %s, %s) = %v; want %v", test.collectionID, test.book, test.refNo, ok, test.expectedOk)
		}
	}
}

func TestValidateCollectionID(t *testing.T) {
	tests := []struct {
		collectionID string
		expectedOk   bool
	}{
		{"bukhari", true},
		{"", false},
		{"invalid", false},
	}

	for _, test := range tests {
		_, ok := validateCollectionID(test.collectionID)
		if ok != test.expectedOk {
			t.Errorf("validateCollectionID(%s) = %v; want %v", test.collectionID, ok, test.expectedOk)
		}
	}
}

func TestValidateBook(t *testing.T) {
	tests := []struct {
		book       string
		expectedOk bool
	}{
		{"1", true},
		{"", false},
		{"invalid", false},
	}

	for _, test := range tests {
		_, ok := validateBook(test.book)
		if ok != test.expectedOk {
			t.Errorf("validateBook(%s) = %v; want %v", test.book, ok, test.expectedOk)
		}
	}
}

func TestValidateRefNo(t *testing.T) {
	tests := []struct {
		refNo      string
		expectedOk bool
	}{
		{"1", true},
		{"", false},
		{"invalid", false},
	}

	for _, test := range tests {
		_, ok := validateRefNo(test.refNo)
		if ok != test.expectedOk {
			t.Errorf("validateRefNo(%s) = %v; want %v", test.refNo, ok, test.expectedOk)
		}
	}
}
