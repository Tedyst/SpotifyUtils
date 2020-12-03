package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/tedyst/spotifyutils/api/metrics"

	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/tedyst/spotifyutils/api/api/admin"

	"github.com/tedyst/spotifyutils/api/api/status"

	_ "github.com/cznic/ql/driver"
	_ "github.com/mattn/go-sqlite3"
	"github.com/michaeljs1990/sqlitestore"
	"github.com/tedyst/spotifyutils/api/auth"
	"github.com/tedyst/spotifyutils/api/config"
)

func checkErr(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

func middleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		metrics.RequestsServed.Inc()
		h.ServeHTTP(w, r)
	})
}

// 10 days
const maxAge = 864000

func main() {
	config.SpotifyAPI.SetAuthInfo(*config.SpotifyClientID, *config.SpotifyClientSecret)

	datab, err := sql.Open("sqlite3", "./data.db")
	config.DB = datab
	checkErr(err)

	initDB(config.DB)

	config.SessionStore, err = sqlitestore.NewSqliteStoreFromConnection(config.DB, "sessions", "/", maxAge, config.Secret)
	checkErr(err)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/auth", auth.Auth)
	mux.HandleFunc("/api/auth-url", auth.AuthURL)
	mux.HandleFunc("/api/status", status.Status)
	mux.HandleFunc("/admin", admin.Admin)
	mux.HandleFunc("/admin/delete-all-tokens", admin.DeleteAllUserTokens)

	if *config.Metrics {
		go func() {
			http.Handle("/metrics", promhttp.Handler())
			http.ListenAndServe(":5001", nil)
		}()
	}

	log.Printf("Starting server on address http://%s", *config.Address)
	err = http.ListenAndServe(*config.Address, middleware(mux))
	checkErr(err)
}
