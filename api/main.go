package main

import (
	"flag"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/tedyst/spotifyutils/api/api/playlistview"
	"github.com/weaveworks/promrus"

	log "github.com/sirupsen/logrus"

	"github.com/Tedyst/gormstore"

	"github.com/tedyst/spotifyutils/api/api/compare"
	"github.com/tedyst/spotifyutils/api/api/recenttracks"
	"github.com/tedyst/spotifyutils/api/api/trackapi"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/tedyst/spotifyutils/api/api/top"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
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

func middleware(next *mux.Router) http.Handler {
	buckets := []float64{.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10}

	responseTimeHistogram := prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Namespace: "spotifyutils",
		Name:      "request_duration_seconds",
		Help:      "Histogram of response time for handler in seconds",
		Buckets:   buckets,
	}, []string{"route", "method", "status_code"})

	prometheus.MustRegister(responseTimeHistogram)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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

		log.WithFields(log.Fields{
			"method":   r.Method,
			"request":  route,
			"code":     statusCode,
			"duration": duration.Seconds(),
			"ip":       ipAddress,
		}).Debug()
	})
}

func main() {
	config.SpotifyAPI.SetAuthInfo(*config.SpotifyClientID, *config.SpotifyClientSecret)
	flag.Parse()

	datab, err := gorm.Open(mysql.Open("root:parola@tcp(127.0.0.1:3306)/spotifyutils?charset=utf8mb4&parseTime=True&loc=Local"), &gorm.Config{
		Logger: &GormLogger{},
	})
	db, err := datab.DB()
	checkErr(err)
	db.Exec("PRAGMA journal_mode=WAL;")

	config.DB = datab

	if *config.Debug {
		log.SetLevel(log.DebugLevel)
	}

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
	api.HandleFunc("/top/old", top.TopHandlerSince)
	api.HandleFunc("/compare", compare.HandlerNoUsername)
	api.HandleFunc("/recent", recenttracks.Handler)
	api.HandleFunc("/track/{track}", trackapi.Handler)
	api.HandleFunc("/compare/{code}", compare.HandlerUsername)

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
	err = http.ListenAndServe(*config.Address, middleware(m))
	checkErr(err)
}
