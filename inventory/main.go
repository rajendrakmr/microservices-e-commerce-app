package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
)

var (
	mu    sync.Mutex
	stock = map[string]int{"1": 50, "2": 20, "3": 5}
	reqs  int
)

func newMux() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"status":"ok"}`))
	})
	mux.HandleFunc("/metrics", func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		defer mu.Unlock()
		fmt.Fprintf(w, "# TYPE inventory_requests_total counter\ninventory_requests_total %d\n", reqs)
	})
	mux.HandleFunc("/stock/", func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		defer mu.Unlock()
		reqs++
		id := strings.TrimPrefix(r.URL.Path, "/stock/")
		q, ok := stock[id]
		if !ok {
			http.Error(w, `{"error":"unknown product"}`, 404)
			return
		}
		json.NewEncoder(w).Encode(map[string]any{"productId": id, "stock": q})
	})
	mux.HandleFunc("/reserve", func(w http.ResponseWriter, r *http.Request) {
		var in struct {
			ProductID string `json:"productId"`
			Qty       int    `json:"qty"`
		}
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil || in.Qty <= 0 {
			http.Error(w, `{"error":"bad request"}`, 400)
			return
		}
		mu.Lock()
		defer mu.Unlock()
		reqs++
		if stock[in.ProductID] < in.Qty {
			http.Error(w, `{"error":"insufficient stock"}`, 409)
			return
		}
		stock[in.ProductID] -= in.Qty
		json.NewEncoder(w).Encode(map[string]any{"reserved": in.Qty, "remaining": stock[in.ProductID]})
	})
	return mux
}

func main() {
	fmt.Println("inventory :8082")
	http.ListenAndServe(":8082", newMux())
}
