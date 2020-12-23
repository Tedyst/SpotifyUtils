FROM golang:rc-alpine
WORKDIR /app

COPY go.mod go.sum ./
RUN ["go", "mod", "download"]
COPY . .
RUN ["go", "build", "-o", "/app/build"]

FROM alpine:latest

WORKDIR /app
EXPOSE 5000
EXPOSE 5001

RUN ["mkdir", "/frontend"]
COPY --from=0 /app/build /app/build
ADD frontend/build /app/frontend/build

ENTRYPOINT [ "/app/build" ]