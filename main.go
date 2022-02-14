package main

import (
	"flag"
	"net/http"
	_ "net/http/pprof"

	"github.com/NYTimes/gziphandler"
	"github.com/tedyst/spotifyutils/api/playlistview"
	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/weaveworks/promrus"
	"gorm.io/plugin/prometheus"

	log "github.com/sirupsen/logrus"

	"github.com/wader/gormstore/v2"

	"github.com/tedyst/spotifyutils/api/compare"
	"github.com/tedyst/spotifyutils/api/comparenousername"
	"github.com/tedyst/spotifyutils/api/docs"
	"github.com/tedyst/spotifyutils/api/recenttracks"
	"github.com/tedyst/spotifyutils/api/settings"
	"github.com/tedyst/spotifyutils/api/trackapi"

	"github.com/tedyst/spotifyutils/api/top"
	"github.com/tedyst/spotifyutils/api/topsince"

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
	config.SessionStore.SessionOpts.Secure = true
	config.SessionStore.SessionOpts.SameSite = http.SameSiteStrictMode
	config.SessionStore.SessionOpts.HttpOnly = true

	m := mux.NewRouter()
	m.HandleFunc("/logout", auth.Logout)

	api := m.PathPrefix("/api").Subrouter()
	api.Use(limitAPIRequests)
	api.HandleFunc("", docs.DocsHandler)
	api.HandleFunc("/swagger.json", docs.SwaggerJSONHandler)

	api.HandleFunc("/auth", auth.Auth)
	api.HandleFunc("/auth-url", auth.AuthURL)
	api.HandleFunc("/logout", auth.Logout)
	api.HandleFunc("/status", status.StatusHandler)

	loggedin := api.NewRoute().Subrouter()
	loggedin.Use(auth.Middleware)
	loggedin.HandleFunc("/top", top.Handler)
	loggedin.HandleFunc("/playlist/{playlist}", playlistview.Handler)
	loggedin.HandleFunc("/top/old/{unixdate}", topsince.Handler)
	loggedin.HandleFunc("/compare", comparenousername.Handler)
	loggedin.HandleFunc("/recent", recenttracks.Handler)
	loggedin.HandleFunc("/track/{track}", trackapi.Handler)
	loggedin.HandleFunc("/compare/{code}", compare.Handler)
	loggedin.HandleFunc("/settings", settings.Handler)

	// Serve react app
	spa := spaHandler{
		buildPath: *config.BuildPath,
	}
	m.PathPrefix("/").Handler(spa)

	// Setup CSRF protection
	opts := []csrf.Option{}
	opts = append(opts, csrf.ErrorHandler(http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			utils.ErrorString(w, r, "CSRF token mismatch")
		},
	)))
	if *config.Debug {
		opts = append(opts, csrf.Secure(false))
	}
	opts = append(opts, csrf.Path("/"))
	opts = append(opts, csrf.SameSite(csrf.SameSiteStrictMode))
	CSRF := csrf.Protect(config.Secret, opts...)

	// Enable pprof
	if *config.Debug {
		go func() {
			log.Println(http.ListenAndServe(":6060", nil))
		}()
	}

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
