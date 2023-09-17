FROM golang:1.21.1-alpine3.18 AS BuildStage

WORKDIR /app

COPY go.mod go.sum ./

COPY *.go ./
COPY ./migrations ./migrations

RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o /file-portal-pb

FROM alpine:latest AS Production

WORKDIR /

COPY --from=BuildStage /file-portal-pb .

VOLUME /pb_data
EXPOSE 8090

CMD ["/file-portal-pb", "serve", "--http=0.0.0.0:8090", "--dir=./pb_data"]