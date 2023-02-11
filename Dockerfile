FROM --platform=${BUILDPLATFORM} node:latest as frontend
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json /app/frontend/
RUN ["npm", "install"]
COPY frontend .
ENV DISABLE_ESLINT_PLUGIN=true
RUN ["npm", "run", "build"]


FROM golang:buster as backend
WORKDIR /app

COPY go.mod go.sum ./
# Prebuilding go-sqlite because it is VERY slow to build
RUN go mod download && go get github.com/mattn/go-sqlite3@v2.0.3
# This is to not interfere with the frontend build
COPY api api
COPY auth auth
COPY config config
COPY mapofmutex mapofmutex
COPY metrics metrics
COPY playlist playlist
COPY spotifywrapper spotifywrapper
COPY tracks tracks
COPY userutils userutils
COPY utils utils
COPY *.go .
RUN go generate ./...
RUN go build -o /app/build

FROM debian:buster-20230202-slim

WORKDIR /app
EXPOSE 5000
EXPOSE 5001

RUN ["mkdir", "/frontend"]
COPY --from=backend /app/build /app/build
COPY swagger.yaml /app/swagger.yaml
COPY --from=frontend /app/frontend/build /app/frontend/build

RUN apt update && apt install -y ca-certificates

ENTRYPOINT [ "/app/build" ]