package logging

import (
	"fmt"
	"log"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/tedyst/spotifyutils/api/metrics"
)

func ReportError(location string, err error) {
	metrics.ErrorCount.With(prometheus.Labels{"error": fmt.Sprint(err), "source": location}).Inc()
	log.Printf("Error in %s: %s", location, err)
}
