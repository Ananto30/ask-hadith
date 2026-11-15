package handler

import (
	"sort"
	"testing"
)

func TestNumLess(t *testing.T) {
	got := []string{"10", "2", "1", "33"}
	sort.Slice(got, func(i, j int) bool { return numLess(got[i], got[j]) })
	want := []string{"1", "2", "10", "33"}
	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("got %v, want %v", got, want)
		}
	}
}

func TestClipWords(t *testing.T) {
	tests := []struct {
		in   string
		n    int
		want string
	}{
		{"short", 10, "short"},
		{"hello big world", 12, "hello big…"},
		{"ééééééééé", 5, "éé…"},
	}
	for _, tt := range tests {
		if got := clipWords(tt.in, tt.n); got != tt.want {
			t.Errorf("clipWords(%q, %d) = %q; want %q", tt.in, tt.n, got, tt.want)
		}
	}
}
