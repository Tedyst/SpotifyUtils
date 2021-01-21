package main

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type spaHandler struct {
	buildPath string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	p, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	path := filepath.Join(h.buildPath, p)
	if !(strings.Contains(path, "service-worker") || strings.Contains(path, "manifest")) {
		w.Header().Set("Cache-Control", "max-age=31536000")
	}
	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		http.ServeFile(w, r, h.buildPath+"/index.html")
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.FileServer(http.Dir(h.buildPath)).ServeHTTP(w, r)
}
