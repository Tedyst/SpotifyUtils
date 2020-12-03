package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	RequestsServed = promauto.NewCounter(prometheus.CounterOpts{
		Name: "spotifyutils_requests_served",
		Help: "The total number of requests served",
	})

	ErrorCount = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "spotifyutils_error_count",
		Help: "The total number of errors returned to user",
	}, []string{"error", "source"})
)
