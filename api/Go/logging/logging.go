package logging

import (
	log "github.com/sirupsen/logrus"
)

func ReportError(location string, err error) {
	log.Errorf("Error in %s: %s", location, err)
}
