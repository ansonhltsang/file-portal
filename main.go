package main

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/pocketbase/pocketbase"
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

    dateFormatString := "2006-01-02 15:04:05.000Z"

    app.OnRecordBeforeCreateRequest("sessions").Add(func(e *core.RecordCreateEvent) error {
        defaultSessionDuration := 30; // in minutes
        expiredTime := time.Now().Add(time.Minute * time.Duration(defaultSessionDuration))
        e.Record.Set("expired", expiredTime.Format(dateFormatString))

        return nil
    })

    app.OnRecordBeforeCreateRequest("files").Add(func(e *core.RecordCreateEvent) error {
        defaultSessionDuration := 30; // in minutes
        expiredTime := time.Now().Add(time.Minute * time.Duration(defaultSessionDuration))
        e.Record.Set("expired", expiredTime.Format(dateFormatString))

        sessionId := e.Record.GetString("session");

        session, err := app.Dao().FindRecordById("sessions", sessionId)
        if err != nil {
            return err
        }

        session.Set("lastFileChanged", time.Now().Format(dateFormatString))
        session.Set("expired", expiredTime.Format(dateFormatString))

        if err := app.Dao().SaveRecord(session); err != nil {
            return err
        }

        return nil
    })

    app.OnRecordBeforeDeleteRequest("files").Add(func(e *core.RecordDeleteEvent) error {
        sessionId := e.Record.GetString("session");

        session, err := app.Dao().FindRecordById("sessions", sessionId)
        if err != nil {
            return err
        }

        session.Set("lastFileChanged", time.Now().Format(dateFormatString))

        if err := app.Dao().SaveRecord(session); err != nil {
            return err
        }

        return nil
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
