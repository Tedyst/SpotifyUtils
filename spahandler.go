package main

import (
	"net/http"
	"os"
	"path/filepath"
)

type spaHandler struct {
	buildPath string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Cache-Control", "max-age=31536000")

	path = filepath.Join(h.buildPath, path)

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
