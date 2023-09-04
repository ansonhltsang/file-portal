package main

import (
	"bytes"
	"net/http"
	"testing"

	"github.com/pocketbase/pocketbase/tests"
	"github.com/pocketbase/pocketbase/tokens"
)

const testDataDir = "./test_pb_data"

func TestInitialMigration(t *testing.T) {
	// recordToken, err := generateRecordToken("users", "test@example.com")
    // if err != nil {
    //     t.Fatal(err)
    // }

    // //testadmin@email.com
    // //testadminpw
    // adminToken, err := generateAdminToken("testadmin@email.com")
    // if err != nil {
    //     t.Fatal(err)
    // }

    setupTestApp := func() (*tests.TestApp, error) {
        testApp, err := tests.NewTestApp(testDataDir)
        if err != nil {
            return nil, err
        }
        return testApp, nil
    }

	scenarios := []tests.ApiScenario{
        {
            Name:            "try POST session",
            Method:          http.MethodPost,
            Url:             "/api/collections/sessions/records",
            Body: bytes.NewReader([]byte(`{"expired":"2023-07-19 23:25:33"}`)),
            ExpectedStatus:  200,
            ExpectedContent: []string{"\"data\":{}"},
            TestAppFactory:  setupTestApp,
        },
        {
            Name:   "try GET session",
            Method: http.MethodGet,
            Url:    "/api/collections/sessions/records/4c5o5lkjwcj8yfy",
            ExpectedStatus:  200,
            ExpectedContent: []string{"\"data\":{}"},
            TestAppFactory:  setupTestApp,
        },
    }

	for _, scenario := range scenarios {
        scenario.Test(t)
    }
}

func generateAdminToken(email string) (string, error) {
    app, err := tests.NewTestApp(testDataDir)
    if err != nil {
        return "", err
    }
    defer app.Cleanup()

    admin, err := app.Dao().FindAdminByEmail(email)
    if err != nil {
        return "", err
    }

    return tokens.NewAdminAuthToken(app, admin)
}

func generateRecordToken(collectionNameOrId string, email string) (string, error) {
    app, err := tests.NewTestApp(testDataDir)
    if err != nil {
        return "", err
    }
    defer app.Cleanup()

    record, err := app.Dao().FindAuthRecordByEmail(collectionNameOrId, email)
    if err != nil {
        return "", err
    }

    return tokens.NewRecordAuthToken(app, record)
}
