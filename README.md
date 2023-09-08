# File Portal

First, set up the `.env` file following the `.env.example `template

## Frontend
To run the frontend locally: `npm run dev`

## Backend
To run pocketbase locally: `go run main.go serve --dir="./test_pb_data --http=127.0.0.1:8090`

To build the application: `CGO_ENABLED=0 go build`