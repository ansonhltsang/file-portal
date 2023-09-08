package main

import (
	"log"
	"os"
	"strings"
	"time"

	_ "github.com/ansonhltsang/file-portal/migrations"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	app := pocketbase.New()

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
	})

	dateFormatString := "2006-01-02 15:04:05.000Z"

	app.OnRecordBeforeCreateRequest("sessions").Add(func(e *core.RecordCreateEvent) error {
		defaultSessionDuration := 30 // in minutes
		expiredTime := time.Now().Add(time.Minute * time.Duration(defaultSessionDuration))
		e.Record.Set("expired", expiredTime.Format(dateFormatString))

		return nil
	})

	app.OnRecordAfterCreateRequest("files").Add(func(e *core.RecordCreateEvent) error {
		defaultSessionDuration := 30 // in minutes
		expiredTime := time.Now().Add(time.Minute * time.Duration(defaultSessionDuration))
		e.Record.Set("expired", expiredTime.Format(dateFormatString))

		filePath := e.Record.BaseFilesPath() + "/" + e.Record.GetString("file")

		fsys, err := app.NewFilesystem()
		if err != nil {
			return err
		}
		defer fsys.Close()

		file, err := fsys.GetFile(filePath)
		if err != nil {
			return err
		}
		defer file.Close()

		e.Record.Set("size", file.Size())

		if err := app.Dao().SaveRecord(e.Record); err != nil {
			return err
		}

		sessionId := e.Record.GetString("session")

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
		sessionId := e.Record.GetString("session")

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
