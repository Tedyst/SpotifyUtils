package main

import (
	"database/sql"
	"log"
	"net/http"

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

func main() {
	datab, err := sql.Open("sqlite3", "./data.db")
	config.DB = datab
	checkErr(err)

	initDB(config.DB)

	config.SessionStore, err = sqlitestore.NewSqliteStoreFromConnection(config.DB, "sessions", "/", 3600, config.Secret)
	checkErr(err)

	config.SpotifyAPI.SetAuthInfo(config.SpotifyClientID, config.SpotifyClientSecret)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/auth", auth.Auth)
	mux.HandleFunc("/api/auth-url", auth.AuthURL)
	mux.HandleFunc("/api/status", status.Status)

	log.Printf("Starting server on address http://%s", config.Address)
	err = http.ListenAndServe(config.Address, mux)
	checkErr(err)
}
