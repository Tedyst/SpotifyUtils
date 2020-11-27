package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/blevesearch/bleve"
	_ "github.com/mattn/go-sqlite3"
)

func initSQL(db *sql.DB) {
	mapping := bleve.NewIndexMapping()
	index, err := bleve.New("test.bleve", mapping)

	rows, err := db.Query("SELECT id, lyrics FROM songs WHERE lyrics IS NOT NULL")
	if err != nil {
		log.Panicln(err)
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		var lyrics string
		err = rows.Scan(&id, &lyrics)
		if err != nil {
			log.Fatal(err)
		}
		err = index.Index(fmt.Sprint(id), lyrics)
		if err != nil {
			log.Println(err)
		}
	}
	defer index.Close()
}

func useSQL() bleve.Index {
	index, err := bleve.Open("test.bleve")
	if err != nil {
		log.Panicln(err)
	}
	return index
}

func main() {
	db, err := sql.Open("sqlite3", "data.db")
	if err != nil {
		log.Panicln(err)
	}
	defer db.Close()

	if _, err := os.Stat("test.bleve"); os.IsNotExist(err) {
		initSQL(db)
	}

	index := useSQL()
	query := bleve.NewMatchQuery("a cple hundred")
	query.
	search := bleve.NewSearchRequest(query)
	searchResults, err := index.Search(search)
	str, err := json.Marshal(searchResults)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(str))
}
