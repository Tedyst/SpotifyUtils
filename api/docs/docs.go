// Documentation of SpotifyUtils's API
//
//     Schemes: http, https
//     BasePath: /api
//
//     Consumes:
//     - application/json
//
//     Produces:
//     - application/json
//
//	   Security:
//     - CSRFToken: []
// swagger:meta
package docs

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/go-openapi/loads"
	"github.com/sirupsen/logrus"
	"github.com/tedyst/spotifyutils/config"
)

// go:generate swagger generate spec -o swagger.yaml --scan-models
var handler http.Handler
var b []byte

func init() {
	if !*config.ServeSwagger {
		return
	}
	if _, err := os.Stat("swagger.yaml"); err != nil {
		*config.ServeSwagger = false
		logrus.Warn("swagger.yaml not found! Disabling Swagger UI")
		return
	}
	handler = SwaggerUI(SwaggerUIOpts{
		BasePath:        "",
		Path:            "/api",
		Title:           "SpotifyUtils",
		SpecURL:         "api/swagger.json",
		CSRFTokenHeader: "X-CSRF-Token",
	}, nil)
	var err error
	specDoc, err := loads.Spec("swagger.yaml")
	if err != nil {
		logrus.Errorln(err)
	}
	b, err = json.MarshalIndent(specDoc.Spec(), "", "  ")
	if err != nil {
		logrus.Errorln(err)
	}
}

func DocsHandler(res http.ResponseWriter, req *http.Request) {
	if !*config.ServeSwagger {
		return
	}
	handler.ServeHTTP(res, req)
}

func SwaggerJSONHandler(res http.ResponseWriter, req *http.Request) {
	if !*config.ServeSwagger {
		return
	}
	res.Header().Set("Content-Type", "application/json")
	res.Write(b)
}
