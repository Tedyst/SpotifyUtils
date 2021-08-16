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
RUN go mod download
COPY . .
RUN go build -o /app/build

FROM debian:10.10-slim

WORKDIR /app
EXPOSE 5000
EXPOSE 5001

RUN ["mkdir", "/frontend"]
COPY --from=backend /app/build /app/build
COPY --from=frontend /app/frontend/build /app/frontend/build

RUN apt update && apt install -y ca-certificates

ENTRYPOINT [ "/app/build" ]