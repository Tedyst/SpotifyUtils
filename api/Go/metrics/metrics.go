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
)
