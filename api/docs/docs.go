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
//     SecurityDefinitions:
//       CSRFToken:
//         type: apiKey
//         name: x-csrf-token
//         in: header
//
//	   Security:
//     - CSRFToken: []
// swagger:meta
package docs

import (
	"encoding/json"
	"net/http"

	"github.com/go-openapi/loads"
	"github.com/go-openapi/runtime/middleware"
	"github.com/sirupsen/logrus"
)

// go:generate swagger generate spec -o swagger.yaml --scan-models
var handler = middleware.SwaggerUI(middleware.SwaggerUIOpts{
	BasePath: "",
	Path:     "/api",
	Title:    "SpotifyUtils",
	SpecURL:  "api/swagger.json",
}, nil)
var b []byte

func init() {
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
	handler.ServeHTTP(res, req)
}

func SwaggerJSONHandler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	res.Write(b)
}
