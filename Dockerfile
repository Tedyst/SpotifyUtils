FROM --platform=${BUILDPLATFORM} node:latest as frontend
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json /app/frontend/
RUN ["npm", "install"]
COPY frontend .
RUN ["npm", "run", "build"]


FROM golang:buster as backend
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /app/build

FROM alpine:latest

WORKDIR /app
EXPOSE 5000
EXPOSE 5001

RUN ["mkdir", "/frontend"]
COPY --from=backend /app/build /app/build
COPY --from=frontend /app/frontend/build /app/frontend/build

ENTRYPOINT [ "/app/build" ]