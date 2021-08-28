package main

import (
	"flag"
	"net/http"

	"github.com/NYTimes/gziphandler"
	"github.com/tedyst/spotifyutils/api/playlistview"
	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/weaveworks/promrus"
	"gorm.io/plugin/prometheus"

	log "github.com/sirupsen/logrus"

	"github.com/wader/gormstore/v2"

	"github.com/tedyst/spotifyutils/api/compare"
	"github.com/tedyst/spotifyutils/api/recenttracks"
	"github.com/tedyst/spotifyutils/api/settings"
	"github.com/tedyst/spotifyutils/api/trackapi"

	"github.com/tedyst/spotifyutils/api/top"

	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/tedyst/spotifyutils/api/status"

	"github.com/gorilla/csrf"
	"github.com/gorilla/mux"

	"github.com/tedyst/spotifyutils/auth"
	"github.com/tedyst/spotifyutils/config"
)

func main() {
	// Flag parsing
	flag.Parse()
	if !(*config.MockExternalCalls) {
		config.SpotifyAPI.SetAuthInfo(*config.SpotifyClientID, *config.SpotifyClientSecret)
	} else {
		log.Warn("MockExternalCalls is enabled! No external service will be used!")
		if *config.MockUser == "" {
			log.Warn("MockUser is not set! You will not be able to login!")
		}
	}

	if *config.Debug {
		log.SetLevel(log.DebugLevel)
		csrf.Secure(false)
	}
	log.SetReportCaller(true)

	initCache()
	initDB()

	// Setup session store
	sessionOptions := gormstore.Options{
		TableName: "sessions",
	}
	config.SessionStore = gormstore.NewOptions(config.DB, sessionOptions, config.Secret)

	m := mux.NewRouter()
	m.HandleFunc("/logout", auth.Logout)

	api := m.PathPrefix("/api").Subrouter()
	api.Use(limitAPIRequests)
	api.HandleFunc("/auth", auth.Auth)
	api.HandleFunc("/auth-url", auth.AuthURL)
	api.HandleFunc("/logout", auth.Logout)
	api.HandleFunc("/status", status.StatusHandler)
	api.Handle("/playlist/{playlist}", utils.LoggedIn(playlistview.Handler))
	api.Handle("/top", utils.LoggedIn(top.Handler))
	api.Handle("/top/old/{unixdate}", utils.LoggedIn(top.HandlerSince))
	api.Handle("/compare", utils.LoggedIn(compare.HandlerNoUsername))
	api.Handle("/recent", utils.LoggedIn(recenttracks.Handler))
	api.Handle("/track/{track}", utils.LoggedIn(trackapi.Handler))
	api.Handle("/compare/{code}", utils.LoggedIn(compare.HandlerUsername))
	api.Handle("/settings", utils.LoggedIn(settings.Handler))

	// Serve react app
	spa := spaHandler{
		buildPath: *config.BuildPath,
	}
	m.PathPrefix("/").Handler(spa)

	// Setup CSRF protection
	opts := []csrf.Option{}
	if *config.Debug {
		opts = append(opts, csrf.Secure(false))
	}
	opts = append(opts, csrf.Path("/"))
	CSRF := csrf.Protect(config.Secret, opts...)

	// Setup metrics
	if *config.Metrics {
		hook := promrus.MustNewPrometheusHook()
		log.AddHook(hook)

		if config.IsMySQL {
			config.DB.Use(prometheus.New(prometheus.Config{
				DBName:      "spotifyutils",
				StartServer: false,
				MetricsCollector: []prometheus.MetricsCollector{
					&prometheus.MySQL{VariableNames: []string{"threads_running"}},
				},
			}))
		} else {
			config.DB.Use(prometheus.New(prometheus.Config{
				DBName:      "spotifyutils",
				StartServer: false,
			}))
		}

		go func() {
			// http.Handle("/metrics", promhttp.Handler())
			http.ListenAndServe(":5001", promhttp.Handler())
		}()
	}

	log.Infof("Starting server on address http://%s", *config.Address)

	m.Use(CSRF)
	m.Use(securityHeaders)
	m.Use(gziphandler.GzipHandler)
	if err := http.ListenAndServe(*config.Address, timingMiddleware(m)); err != nil {
		log.Fatal(err)
	}
}
