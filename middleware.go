package main

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/csrf"
	"github.com/gorilla/mux"
	servertiming "github.com/mitchellh/go-server-timing"
	"github.com/prometheus/client_golang/prometheus"
	log "github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/utils"
)

type statusRecorder struct {
	http.ResponseWriter
	statusCode int
}

func (rec *statusRecorder) WriteHeader(statusCode int) {
	rec.statusCode = statusCode
	rec.ResponseWriter.WriteHeader(statusCode)
}

func securityHeaders(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := csrf.Token(r)
		w.Header().Set("X-CSRF-Token", token)

		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		w.Header().Set("Referrer-Policy", "same-origin")
		w.Header().Set("Permissions-Policy", "geolocation=(), microphone=()")
		w.Header().Set("Service-Worker-Allowed", "/")
		if !(*config.Debug) {
			w.Header().Set("Content-Security-Policy", "default-src 'none'; manifest-src 'self'; connect-src 'self' https://o557174.ingest.sentry.io https://sentry.io; img-src *; script-src https://o557174.ingest.sentry.io https://sentry.io https://storage.googleapis.com 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; base-uri 'self'; report-uri https://o557174.ingest.sentry.io/api/5689078/security/?sentry_key=a38da28ff45041828f3ee7f714af0527; font-src https://fonts.gstatic.com https://use.typekit.net; worker-src https://testing.stoicatedy.ovh https://spotify.stoicatedy.ovh;")
		}
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Expect-CT", "max-age=86400, enforce, report-uri=\"https://github.com/Tedyst/SpotifyUtils\"")
		h.ServeHTTP(w, r)
	})
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

func timingMiddleware(next *mux.Router) http.Handler {
	buckets := []float64{.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10}

	responseTimeHistogram := prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Namespace: "spotifyutils",
		Name:      "request_duration_seconds",
		Help:      "Histogram of response time for handler in seconds",
		Buckets:   buckets,
	}, []string{"route", "method", "status_code"})

	prometheus.MustRegister(responseTimeHistogram)

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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

		var username string
		session, _ := config.SessionStore.Get(r, "username")
		if username_sess, ok := session.Values["username"]; ok {
			username = username_sess.(string)
		}

		var routeStr = route
		if routeStr == "/" {
			routeStr = r.RequestURI
		}
		if username != "" {
			log.WithFields(log.Fields{
				"type":     "request",
				"method":   r.Method,
				"request":  utils.StringSanitize(routeStr),
				"code":     statusCode,
				"duration": duration.Seconds(),
				"ip":       utils.StringSanitize(ipAddress),
				"user":     utils.StringSanitize(username),
			}).Debug()
		} else {
			log.WithFields(log.Fields{
				"type":     "request",
				"method":   r.Method,
				"request":  utils.StringSanitize(routeStr),
				"code":     statusCode,
				"duration": duration.Seconds(),
				"ip":       utils.StringSanitize(ipAddress),
			}).Debug()
		}
	})

	if *config.Debug {
		return servertiming.Middleware(handler, nil)
	}
	return handler
}
