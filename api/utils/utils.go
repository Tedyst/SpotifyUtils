package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// swagger:response Error
type _ struct {
	// in: body
	Body responseError
}

type responseError struct {
	// The state of the response
	// example: false
	Success bool
	// The error message
	// example: Error
	Error string
}

func ErrorString(res http.ResponseWriter, req *http.Request, err string) {
	res.WriteHeader(http.StatusBadRequest)
	response := &responseError{}
	response.Success = false
	response.Error = err
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}

func ErrorErr(res http.ResponseWriter, req *http.Request, err error) {
	res.WriteHeader(http.StatusBadRequest)
	response := &responseError{}
	response.Success = false
	response.Error = fmt.Sprint(err)
	respJSON, _ := json.Marshal(response)
	fmt.Fprint(res, string(respJSON))
}
