// https://stackoverflow.com/questions/40931373/how-to-gc-a-map-of-mutexes-in-go
// Package mapofmu provides locking per-key.
// For example, you can acquire a lock for a specific user ID and all other requests for that user ID
// will block until that entry is unlocked (effectively your work load will be run serially per-user ID),
// and yet have work for separate user IDs happen concurrently.
package mapofmutex

import (
	"fmt"
	"sync"
)

// M wraps a map of mutexes.  Each key locks separately.
type M struct {
	ml sync.Mutex              // lock for entry map
	ma map[interface{}]*mentry // entry map
}

type mentry struct {
	m   *M          // point back to M, so we can synchronize removing this mentry when cnt==0
	el  sync.Mutex  // entry-specific lock
	cnt int         // reference count
	key interface{} // key in ma
}

// Unlocker provides an Unlock method to release the lock.
type Unlocker interface {
	Unlock()
}

// New returns an initalized M.
func New() *M {
	return &M{ma: make(map[interface{}]*mentry)}
}

// Lock acquires a lock corresponding to this key.
// This method will never return nil and Unlock() must be called
// to release the lock when done.
func (m *M) Lock(key interface{}) Unlocker {

	// read or create entry for this key atomically
	m.ml.Lock()
	e, ok := m.ma[key]
	if !ok {
		e = &mentry{m: m, key: key}
		m.ma[key] = e
	}
	e.cnt++ // ref count
	m.ml.Unlock()

	// acquire lock, will block here until e.cnt==1
	e.el.Lock()

	return e
}

// Unlock releases the lock for this entry.
func (me *mentry) Unlock() {

	m := me.m

	// decrement and if needed remove entry atomically
	m.ml.Lock()
	e, ok := m.ma[me.key]
	if !ok { // entry must exist
		m.ml.Unlock()
		panic(fmt.Errorf("Unlock requested for key=%v but no entry found", me.key))
	}
	e.cnt--        // ref count
	if e.cnt < 1 { // if it hits zero then we own it and remove from map
		delete(m.ma, me.key)
	}
	m.ml.Unlock()

	// now that map stuff is handled, we unlock and let
	// anything else waiting on this key through
	e.el.Unlock()

}
