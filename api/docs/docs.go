// Documentation of SpotifyUtils
//
//     Schemes: http
//     BasePath: /api
//     Version: 1.0.0
//     Host: localhost:5000
//
//     Consumes:
//     - application/json
//
//     Produces:
//     - application/json
//
//     Security:
//     - key
//
//    SecurityDefinitions:
//    key:
//      type: key
//
// swagger:meta
package docs

import (
	"encoding/json"
	"net/http"

	"github.com/go-openapi/loads"
	"github.com/go-openapi/runtime/middleware"
	"github.com/sirupsen/logrus"
)

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
