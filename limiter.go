package main

import (
	"net/http"
	"strings"

	"github.com/tedyst/spotifyutils/api/utils"
	"github.com/tedyst/spotifyutils/config"
	"github.com/tedyst/spotifyutils/mapofmutex"
)

var limiters *mapofmutex.MapOfLimiter

func init() {
	limiters = mapofmutex.NewMapOfLimiter()
}

func limitAPIRequests(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get the IP address for the current user.
		ipAddress := r.RemoteAddr
		fwdAddress := r.Header.Get("X-Forwarded-For")
		if fwdAddress != "" {
			ipAddress = fwdAddress
			ips := strings.Split(fwdAddress, ", ")
			if len(ips) > 1 {
				ipAddress = ips[0]
			}
		}

		if !limiters.Allow(ipAddress) && !*config.MockExternalCalls {
			utils.ErrorString(w, r, "Too many requests")
			w.WriteHeader(http.StatusTooManyRequests)
			return
		}

		next.ServeHTTP(w, r)
	})
}
