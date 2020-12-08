package main

import (
	"log"
	"net/http"

	"github.com/Tedyst/gormstore"

	"github.com/tedyst/spotifyutils/api/api/compare"
	"github.com/tedyst/spotifyutils/api/api/recenttracks"
	"github.com/tedyst/spotifyutils/api/api/trackapi"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/tedyst/spotifyutils/api/api/top"

	"github.com/tedyst/spotifyutils/api/metrics"

	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/tedyst/spotifyutils/api/api/admin"
	"github.com/tedyst/spotifyutils/api/api/status"

	"github.com/gorilla/mux"

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

// 1 month
const maxAge = 86400 * 30

func main() {
	config.SpotifyAPI.SetAuthInfo(*config.SpotifyClientID, *config.SpotifyClientSecret)

	datab, err := gorm.Open(sqlite.Open("data.db"), &gorm.Config{})

	config.DB = datab
	checkErr(err)

	initDB(config.DB)

	sessionOptions := gormstore.Options{
		TableName: "sessions",
	}
	config.SessionStore = gormstore.NewOptions(config.DB, sessionOptions, config.Secret)

	m := mux.NewRouter()
	m.HandleFunc("/api/auth", auth.Auth)
	m.HandleFunc("/api/auth-url", auth.AuthURL)
	m.HandleFunc("/api/status", status.StatusHandler)
	m.HandleFunc("/api/top", top.TopHandler)
	m.HandleFunc("/api/compare", compare.HandlerNoUsername)
	m.HandleFunc("/api/recent", recenttracks.Handler)
	m.HandleFunc("/api/track/{track}", trackapi.Handler)
	m.HandleFunc("/api/compare/{code}", compare.HandlerUsername)
	m.HandleFunc("/admin", admin.Admin)
	m.HandleFunc("/admin/delete-all-tokens", admin.DeleteAllUserTokens)

	if *config.Metrics {
		go func() {
			http.Handle("/metrics", promhttp.Handler())
			http.ListenAndServe(":5001", nil)
		}()
	}

	log.Printf("Starting server on address http://%s", *config.Address)
	err = http.ListenAndServe(*config.Address, middleware(m))
	checkErr(err)
}
