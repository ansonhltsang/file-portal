package main

import (
    "log"
	"strings"
	"os"
    "net/http"

    "github.com/labstack/echo/v5"
    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/apis"
    "github.com/pocketbase/pocketbase/core"
	// "github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

    _ "github.com/ansonhltsang/file-portal/migrations"
)

func main() {
    app := pocketbase.New()

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, &migratecmd.Options{
        // enable auto creation of migration files when making collection changes
        // (the isGoRun check is to enable it only during development)
        Automigrate: isGoRun,
    })

    app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
        e.Router.AddRoute(echo.Route{
            Method: http.MethodGet,
            Path:   "/api/sessions/",
            Handler: func(c echo.Context) error {
                return c.String(200, "Hello world!")
            },
            Middlewares: []echo.MiddlewareFunc{
                apis.ActivityLogger(app),
            },
        })

        return nil
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
