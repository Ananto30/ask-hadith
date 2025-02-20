package handler

import (
	"testing"
)

func TestValidateQuery(t *testing.T) {
	tests := []struct {
		query      string
		expectedOk bool
	}{
		{"valid query", true},
		{"", false},
		{"ab", false},
		{"invalid_query!", false},
	}

	for _, test := range tests {
		_, ok := validateQuery(test.query)
		if ok != test.expectedOk {
			t.Errorf("validateQuery(%s) = %v; want %v", test.query, ok, test.expectedOk)
		}
	}
}

func TestSanitizeQuery(t *testing.T) {
	tests := []struct {
		query    string
		expected string
	}{
		{"Valid Query", "valid query"},
		{"O'Reilly", "oreilly"},
	}

	for _, test := range tests {
		result := sanitizeQuery(test.query)
		if result != test.expected {
			t.Errorf("sanitizeQuery(%s) = %v; want %v", test.query, result, test.expected)
		}
	}
}

func TestIsSpecificHadith(t *testing.T) {
	tests := []struct {
		words    []string
		expected bool
	}{
		{[]string{"bukhari", "1"}, true},
		{[]string{"bukhari", "invalid"}, false},
		{[]string{"invalid", "1"}, false},
		{[]string{"bukhari"}, false},
	}

	for _, test := range tests {
		result := isSpecificHadith(test.words)
		if result != test.expected {
			t.Errorf("isSpecificHadith(%v) = %v; want %v", test.words, result, test.expected)
		}
	}
}
