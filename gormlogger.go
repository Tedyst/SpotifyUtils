package main

import (
	"context"
	"fmt"
	"time"

	log "github.com/sirupsen/logrus"
	gormlogger "gorm.io/gorm/logger"
	"gorm.io/gorm/utils"
)

// GormLogger struct
type GormLogger struct{}

// This is set to 5 seconds because I have a Raspberry Pi as the host
const slowThreshold = 5000 * time.Millisecond

func (*GormLogger) Info(ctx context.Context, msg string, data ...interface{}) {
	log.WithFields(log.Fields{"type": "gorm", "msg": msg}).Info(
		append([]interface{}{utils.FileWithLineNum()}, data...)...)
}
func (*GormLogger) Error(ctx context.Context, msg string, data ...interface{}) {
	log.WithFields(log.Fields{"type": "gorm", "msg": msg}).Error(
		append([]interface{}{utils.FileWithLineNum()}, data...)...)
}
func (*GormLogger) Warn(ctx context.Context, msg string, data ...interface{}) {
	log.WithFields(log.Fields{"type": "gorm", "msg": msg}).Warn(
		append([]interface{}{utils.FileWithLineNum()}, data...)...)
}
func (*GormLogger) Trace(ctx context.Context, begin time.Time, fc func() (string, int64), err error) {
	elapsed := time.Since(begin)
	switch {
	case err != nil:
		sql, rows := fc()
		if err.Error() == "record not found" {
			log.WithFields(log.Fields{
				"type":     "gorm",
				"rows":     rows,
				"sql":      sql,
				"time":     float64(elapsed.Nanoseconds()) / 1e6,
				"error":    err,
				"origfile": utils.FileWithLineNum(),
			}).Debug("")
		} else {
			log.WithFields(log.Fields{
				"type":     "gorm",
				"rows":     rows,
				"sql":      sql,
				"time":     float64(elapsed.Nanoseconds()) / 1e6,
				"error":    err,
				"origfile": utils.FileWithLineNum(),
			}).Error("")
		}
	case elapsed > slowThreshold:
		sql, rows := fc()
		slowLog := fmt.Sprintf("SLOW SQL >= %v", slowThreshold)
		log.WithFields(log.Fields{
			"type":     "gorm",
			"rows":     rows,
			"sql":      sql,
			"time":     float64(elapsed.Nanoseconds()) / 1e6,
			"error":    err,
			"origfile": utils.FileWithLineNum(),
		}).Warn(slowLog)
	default:
		sql, rows := fc()
		log.WithFields(log.Fields{
			"type":     "gorm",
			"rows":     rows,
			"sql":      sql,
			"time":     float64(elapsed.Nanoseconds()) / 1e6,
			"error":    err,
			"origfile": utils.FileWithLineNum(),
		}).Trace("")
	}
}
func (g *GormLogger) LogMode(LogLevel gormlogger.LogLevel) gormlogger.Interface {
	newlogger := *g
	return &newlogger
}
