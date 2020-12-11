package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	RequestsServed = promauto.NewCounter(prometheus.CounterOpts{
		Namespace: "spotifyutils",
		Name:      "requests_served",
		Help:      "The total number of requests served",
	})
)
