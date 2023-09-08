FROM golang:latest

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go ./
COPY ./migrations ./migrations

RUN CGO_ENABLED=0 GOOS=linux go build -o /file-portal-pb

VOLUME /pb_data
EXPOSE 8080


CMD ["/file-portal-pb", "serve", "--http=0.0.0.0:8090", "--dir=./pb_data"]