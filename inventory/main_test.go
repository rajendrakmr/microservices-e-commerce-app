package main

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestReserve(t *testing.T) {
	rr := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/reserve", strings.NewReader(`{"productId":"1","qty":2}`))
	newMux().ServeHTTP(rr, req)
	if rr.Code != 200 {
		t.Fatalf("expected 200, got %d", rr.Code)
	}
}
