package main

import (
	"database/sql"
	"flag"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/NYTimes/gziphandler"
	"github.com/tedyst/spotifyutils/api/playlistview"
	"github.com/weaveworks/promrus"

	log "github.com/sirupsen/logrus"

	"github.com/Tedyst/gormstore"

	"github.com/tedyst/spotifyutils/api/compare"
	"github.com/tedyst/spotifyutils/api/recenttracks"
	"github.com/tedyst/spotifyutils/api/settings"
	"github.com/tedyst/spotifyutils/api/trackapi"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/tedyst/spotifyutils/api/top"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/tedyst/spotifyutils/api/status"

	"github.com/gorilla/csrf"
	"github.com/gorilla/mux"

	"github.com/tedyst/spotifyutils/auth"
	"github.com/tedyst/spotifyutils/config"
)

func checkErr(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

type statusRecorder struct {
	http.ResponseWriter
	statusCode int
}

func (rec *statusRecorder) WriteHeader(statusCode int) {
	rec.statusCode = statusCode
	rec.ResponseWriter.WriteHeader(statusCode)
}

func getRoutePattern(next *mux.Router, r *http.Request) string {
	var match mux.RouteMatch
	routeExists := next.Match(r, &match)
	if routeExists {
		str, err := match.Route.GetPathTemplate()
		if err == nil {
			return str
		}
	}

	return "/"
}

func routerMiddleware(next *mux.Router) http.Handler {
	buckets := []float64{.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10}

	responseTimeHistogram := prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Namespace: "spotifyutils",
		Name:      "request_duration_seconds",
		Help:      "Histogram of response time for handler in seconds",
		Buckets:   buckets,
	}, []string{"route", "method", "status_code"})

	prometheus.MustRegister(responseTimeHistogram)

	opts := []csrf.Option{}
	if *config.Debug {
		opts = append(opts, csrf.Secure(false))
	}
	opts = append(opts, csrf.Path("/"))
	CSRF := csrf.Protect(config.Secret, opts...)

	return CSRF(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		w.Header().Set("Referrer-Policy", "same-origin")
		w.Header().Set("Permissions-Policy", "geolocation=(), microphone=()")
		w.Header().Set("Content-Security-Policy", "default-src 'none'; manifest-src 'self'; connect-src 'self' https://sentry-relay.stoicatedy.ovh https://sentry.io; img-src *; script-src https://sentry-relay.stoicatedy.ovh https://sentry.io https://storage.googleapis.com 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; base-uri 'self'; report-uri https://sentry-relay.stoicatedy.ovh/api/5689078/security/?sentry_key=a38da28ff45041828f3ee7f714af0527;")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Expect-CT", "max-age=86400, enforce, report-uri=\"https://github.com/Tedyst/SpotifyUtils\"")

		token := csrf.Token(r)
		w.Header().Set("X-CSRF-Token", token)
		start := time.Now()
		rec := statusRecorder{w, 200}

		next.ServeHTTP(&rec, r)

		duration := time.Since(start)
		statusCode := strconv.Itoa(rec.statusCode)
		route := getRoutePattern(next, r)
		responseTimeHistogram.WithLabelValues(route, r.Method, statusCode).Observe(duration.Seconds())

		ipAddress := r.RemoteAddr
		fwdAddress := r.Header.Get("X-Forwarded-For")
		if fwdAddress != "" {
			ipAddress = fwdAddress
			ips := strings.Split(fwdAddress, ", ")
			if len(ips) > 1 {
				ipAddress = ips[0]
			}
		}

		if !(strings.Contains(ipAddress, "localhost") || strings.Contains(ipAddress, "127.0.0.1")) {
			w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		}

		log.WithFields(log.Fields{
			"method":   r.Method,
			"request":  route,
			"code":     statusCode,
			"duration": duration.Seconds(),
			"ip":       ipAddress,
		}).Debug()
	}))
}

func createDB() {
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

func main() {
	flag.Parse()
	if !(*config.MockExternalCalls) {
		config.SpotifyAPI.SetAuthInfo(*config.SpotifyClientID, *config.SpotifyClientSecret)
	}

	if *config.Debug {
		log.SetLevel(log.DebugLevel)
		csrf.Secure(false)
	}

	createDB()

	datab, err := gorm.Open(mysql.Open(fmt.Sprintf("%s?charset=utf8mb4&parseTime=True&loc=Local", *config.Database)), &gorm.Config{
		Logger: &GormLogger{},
	})
	checkErr(err)
	db, err := datab.DB()
	checkErr(err)
	db.Exec("PRAGMA journal_mode=WAL;")
	db.Exec("SET NAMES utf8mb4;")
	db.SetConnMaxLifetime(time.Minute * 4)

	config.DB = datab

	log.SetReportCaller(true)
	initDB(config.DB)

	sessionOptions := gormstore.Options{
		TableName: "sessions",
	}
	config.SessionStore = gormstore.NewOptions(config.DB, sessionOptions, config.Secret)

	m := mux.NewRouter()

	api := m.PathPrefix("/api").Subrouter()
	api.HandleFunc("/auth", auth.Auth)
	api.HandleFunc("/auth-url", auth.AuthURL)
	api.HandleFunc("/status", status.StatusHandler)
	api.HandleFunc("/playlist/{playlist}", playlistview.Handler)
	api.HandleFunc("/top", top.TopHandler)
	api.HandleFunc("/top/old/{unixdate}", top.TopHandlerSince)
	api.HandleFunc("/compare", compare.HandlerNoUsername)
	api.HandleFunc("/recent", recenttracks.Handler)
	api.HandleFunc("/track/{track}", trackapi.Handler)
	api.HandleFunc("/compare/{code}", compare.HandlerUsername)
	api.HandleFunc("/logout", auth.Logout)
	api.HandleFunc("/settings", settings.Handler)

	spa := spaHandler{
		buildPath: *config.BuildPath,
	}
	m.HandleFunc("/logout", auth.Logout)
	m.PathPrefix("/").Handler(spa)

	if *config.Metrics {
		hook := promrus.MustNewPrometheusHook()
		log.AddHook(hook)
		go func() {
			http.Handle("/metrics", promhttp.Handler())
			http.ListenAndServe(":5001", nil)
		}()
	}

	log.Infof("Starting server on address http://%s", *config.Address)
	m.Use(gziphandler.GzipHandler)
	err = http.ListenAndServe(*config.Address, routerMiddleware(m))
	checkErr(err)
}
