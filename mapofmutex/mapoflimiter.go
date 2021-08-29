package mapofmutex

import (
	"sync"
	"time"

	"golang.org/x/time/rate"
)

type MapOfLimiter struct {
	M             *sync.Map
	CleanupThread *chan struct{}
}

type limiterEntry struct {
	el       *rate.Limiter
	lastSeen time.Time
}

func NewMapOfLimiter() *MapOfLimiter {
	var ma sync.Map
	result := MapOfLimiter{
		M:             &ma,
		CleanupThread: nil,
	}
	ticker := time.NewTicker(time.Minute * 3)
	quit := make(chan struct{})
	result.CleanupThread = &quit
	go func(m *MapOfLimiter) {
		for {
			select {
			case <-ticker.C:
				ma.Range(func(key, value interface{}) bool {
					elem := value.(*limiterEntry)
					if time.Since(elem.lastSeen) > time.Minute*3 {
						m.M.Delete(key)
					}
					return true
				})
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}(&result)
	return &result
}

func (m *MapOfLimiter) Allow(key interface{}) bool {
	e, _ := m.M.LoadOrStore(key, &limiterEntry{
		el:       rate.NewLimiter(1, 10),
		lastSeen: time.Now(),
	})

	elem := e.(*limiterEntry)

	elem.lastSeen = time.Now()

	return elem.el.Allow()
}
