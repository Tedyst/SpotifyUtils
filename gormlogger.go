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

const slowThreshold = 200 * time.Millisecond

func (*GormLogger) Info(ctx context.Context, msg string, data ...interface{}) {
	log.WithFields(log.Fields{"module": "gorm", "msg": msg}).Info(
		append([]interface{}{utils.FileWithLineNum()}, data...)...)
}
func (*GormLogger) Error(ctx context.Context, msg string, data ...interface{}) {
	log.WithFields(log.Fields{"module": "gorm", "msg": msg}).Error(
		append([]interface{}{utils.FileWithLineNum()}, data...)...)
}
func (*GormLogger) Warn(ctx context.Context, msg string, data ...interface{}) {
	log.WithFields(log.Fields{"module": "gorm", "msg": msg}).Warn(
		append([]interface{}{utils.FileWithLineNum()}, data...)...)
}
func (*GormLogger) Trace(ctx context.Context, begin time.Time, fc func() (string, int64), err error) {
	elapsed := time.Since(begin)
	switch {
	case err != nil:
		sql, rows := fc()
		log.WithFields(log.Fields{
			"module": "gorm",
			"rows":   rows,
			"sql":    sql,
			"time":   float64(elapsed.Nanoseconds()) / 1e6,
			"error":  err,
		}).Error("")
	case elapsed > slowThreshold:
		sql, rows := fc()
		slowLog := fmt.Sprintf("SLOW SQL >= %v", slowThreshold)
		log.WithFields(log.Fields{
			"module": "gorm",
			"rows":   rows,
			"sql":    sql,
			"time":   float64(elapsed.Nanoseconds()) / 1e6,
			"error":  err,
		}).Warn(slowLog)
	default:
		sql, rows := fc()
		log.WithFields(log.Fields{
			"module": "gorm",
			"rows":   rows,
			"sql":    sql,
			"time":   float64(elapsed.Nanoseconds()) / 1e6,
			"error":  err,
		}).Trace("")
	}
}
func (g *GormLogger) LogMode(LogLevel gormlogger.LogLevel) gormlogger.Interface {
	newlogger := *g
	return &newlogger
}
