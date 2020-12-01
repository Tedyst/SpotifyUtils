package main

import (
	"database/sql"
	"log"
)

func initDB(db *sql.DB) {
	var err error
	tx, err := db.Begin()
	if err != nil {
		log.Fatalln(err)
	}
	_, err = tx.Exec(`CREATE TABLE IF NOT EXISTS "listened" (
		"id" INTEGER PRIMARY KEY AUTOINCREMENT,
		"user" VARCHAR(25) NULL,
        "song" VARCHAR(25) NULL,
        "time" INTEGER NULL
	);`)
	if err != nil {
		tx.Rollback()
		log.Fatalln(err)
	}
	_, err = tx.Exec(`CREATE TABLE IF NOT EXISTS "users" (
		"ID" VARCHAR(25) UNIQUE,
        "Token" VARCHAR(25) NULL,
        "RefreshToken" VARCHAR(25) NULL
	);`)
	if err != nil {
		tx.Rollback()
		log.Fatalln(err)
	}
	defer tx.Commit()
}
