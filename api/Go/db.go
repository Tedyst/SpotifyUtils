package main

import (
	"database/sql"
	"log"

	"github.com/tedyst/spotifyutils/api/userutils"
)

func initDB(db *sql.DB) {
	var err error
	tx, err := db.Begin()
	if err != nil {
		log.Fatalln(err)
	}
	_, err = tx.Exec(`CREATE TABLE IF NOT EXISTS "listened" (
		"ID" INTEGER PRIMARY KEY AUTOINCREMENT,
		"UserID" VARCHAR(25) NULL,
        "SongID" VARCHAR(25) NULL,
        "Time" INTEGER NULL
	);`)
	if err != nil {
		tx.Rollback()
		log.Fatalln(err)
	}
	_, err = tx.Exec(`CREATE TABLE IF NOT EXISTS "users" (
		"ID" VARCHAR(25) UNIQUE,
		"RefreshToken" VARCHAR(25) NULL,
		"CompareCode" VARCHAR(25) NULL,
		"Expiration" INTEGER NULL
	);`)
	if err != nil {
		tx.Rollback()
		log.Fatalln(err)
	}
	_, err = tx.Exec(`CREATE TABLE IF NOT EXISTS "friends" (
		"ID" VARCHAR(25) NULL,
		"FriendID" VARCHAR(25) NULL
	);`)
	if err != nil {
		tx.Rollback()
		log.Fatalln(err)
	}
	defer tx.Commit()
	rows, err := tx.Query(`SELECT ID from users`)
	if err != nil {
		log.Println(err)
	}
	for rows.Next() {
		var uid string
		err := rows.Scan(&uid)
		if err != nil {
			log.Println(err)
		}
		u := userutils.GetUser(uid)
		u.StartRecentTracksUpdater()
	}
}
