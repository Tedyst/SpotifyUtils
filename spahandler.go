package main

import (
	"net/http"
	"os"
	"strings"

	securejoin "github.com/cyphar/filepath-securejoin"
)

type spaHandler struct {
	buildPath string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path, err := securejoin.SecureJoin(h.buildPath, r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
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
