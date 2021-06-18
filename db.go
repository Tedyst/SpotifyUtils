package main

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/tracks"
	"github.com/tedyst/spotifyutils/userutils"
	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const spreadStartupUsers = 30 * time.Minute // 30 minutes

func initDB() {
	var datab *gorm.DB
	if strings.HasPrefix(*config.Database, "mysql://") {
		config.IsMySQL = true
		*config.Database = strings.TrimPrefix(*config.Database, "mysql://")
		createMySQLDB()
		var err error
		datab, err = gorm.Open(mysql.Open(fmt.Sprintf("%s?charset=utf8mb4&parseTime=True&loc=Local", *config.Database)), &gorm.Config{
			Logger: &GormLogger{},
		})
		if err != nil {
			log.Fatalln(err)
		}
	} else if strings.HasPrefix(*config.Database, "sqlite://") {
		config.IsMySQL = false
		*config.Database = strings.TrimPrefix(*config.Database, "sqlite://")
		var err error
		datab, err = gorm.Open(sqlite.Open(fmt.Sprintf("%s?charset=utf8mb4&parseTime=True&loc=Local", *config.Database)), &gorm.Config{
			Logger: &GormLogger{},
		})
		if err != nil {
			log.Fatalln(err)
		}
	} else {
		log.Panic("Invalid Database URL")
	}

	db, err := datab.DB()
	if err != nil {
		log.Fatalln(err)
	}
	db.Exec("PRAGMA journal_mode=WAL;")
	db.Exec("SET NAMES utf8mb4;")
	db.SetConnMaxLifetime(time.Minute * 4)

	config.DB = datab

	datab.AutoMigrate(&tracks.Artist{})
	datab.AutoMigrate(&tracks.Track{})
	datab.AutoMigrate(&userutils.User{})
	datab.AutoMigrate(&userutils.RecentTracks{})

	if !*config.Debug {
		go func() {
			var usercount int64
			config.DB.Model(&userutils.User{}).Count(&usercount)

			var users []userutils.User
			config.DB.Model(&userutils.User{}).Where("settings_recent_tracks = ?", 1).Find(&users)

			if usercount == 0 {
				// Divide by 0 in the next line, you know the drill
				usercount = 1
			}
			sleep := time.Duration(int64(spreadStartupUsers) / usercount)
			for _, s := range users {
				s.StartRecentTracksUpdater()
				time.Sleep(sleep)
			}
		}()
	}

	userutils.UpdateUserCount()
}

func createMySQLDB() {
	uri := strings.Split(*config.Database, "/")
	if len(uri) != 2 {
		return
	}
	databaseuri := uri[0] + "/"
	name := uri[1]

	db, err := sql.Open("mysql", databaseuri)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// This should create the DB with utf8, the second one is just to be sure because SQLite
	db.Exec("CREATE DATABASE " + name + "DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci")
	db.Exec("CREATE DATABASE " + name)
}
