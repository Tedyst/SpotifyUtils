package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/cznic/ql/driver"
	_ "github.com/mattn/go-sqlite3"
	"github.com/michaeljs1990/sqlitestore"
	"github.com/zmb3/spotify"
)

var (
	users        = [1]string{"vq0u2761le51p2idib6f89y78"}
	scope        = "user-library-read playlist-read-private playlist-read-collaborative user-top-read user-read-recently-played user-read-private playlist-modify-private playlist-modify-public user-follow-modify"
	admin        = "vq0u2761le51p2idib6f89y78"
	redirectURL  = "http://127.0.0.1"
	clientID     = "d4dc2e6f181346f49ef1a1214b4732b3"
	clientSecret = "d50a2fe6f9b6401faa267a2d258f84d7"
	address      = "0.0.0.0:5000"
	secret       = []byte("ePAPW9vJv7gHoftvQTyNj5VkWB52mlza")
	spotifyAPI   = spotify.NewAuthenticator(redirectURL, scope)
	db           *sql.DB
)

func checkErr(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

func main() {
	datab, err := sql.Open("sqlite3", "./data.db")
	db = datab
	checkErr(err)

	initDB(db)

	sessionStore, err = sqlitestore.NewSqliteStoreFromConnection(db, "sessions", "/", 3600, secret)
	checkErr(err)

	spotifyAPI.SetAuthInfo(clientID, clientSecret)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/auth", authAPI)
	mux.HandleFunc("/api/auth-url", authURLAPI)
	mux.HandleFunc("/api/status", statusAPI)

	log.Printf("Starting server on address http://%s", address)
	err = http.ListenAndServe(address, mux)
	checkErr(err)
}
