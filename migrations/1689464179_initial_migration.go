package migrations

import (
	"github.com/joho/godotenv"
	_ "github.com/joho/godotenv"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/models/schema"
	"github.com/pocketbase/pocketbase/tools/types"
	"log"
	"os"
	"strconv"
)

func init() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}

	fileSizeLimit, err := strconv.Atoi(os.Getenv("VITE_UPLOAD_BYTE_SIZE_LIMIT")) // In bytes
	if err != nil {
		log.Fatal(err)
	}

	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		// App settings
		settings, _ := dao.FindSettings()
		settings.Meta.AppName = "File Portal"
		settings.Smtp.Enabled = false
		settings.Logs.MaxDays = 7
		if err := dao.SaveSettings(settings); err != nil {
			return err
		}

		// Remove default Users collection
		userCollection, err := dao.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		if err := dao.DeleteCollection(userCollection); err != nil {
			return err
		}

		/*
			API Rules
			nil - action only performed by an authorised admin
			empty string - anyone can perform the action
			non-empty string - anyone that satisfy the rule filter can perform the action
		*/

		// Create Sessions collection
		sessionsCollection := &models.Collection{
			Name:       "sessions",
			Type:       models.CollectionTypeBase,
			ListRule:   nil,
			ViewRule:   types.Pointer(""),
			CreateRule: types.Pointer(""),
			UpdateRule: nil,
			DeleteRule: nil,
			Schema: schema.NewSchema(
				&schema.SchemaField{
					Name: "expired",
					Type: schema.FieldTypeDate,
				},
				&schema.SchemaField{
					Name: "lastFileChanged",
					Type: schema.FieldTypeDate,
				},
			),
		}

		if err := dao.SaveCollection(sessionsCollection); err != nil {
			return err
		}

		// Create Files collection
		filesCollection := &models.Collection{
			Name:       "files",
			Type:       models.CollectionTypeBase,
			ListRule:   nil,
			ViewRule:   types.Pointer(""),
			CreateRule: types.Pointer(""),
			UpdateRule: nil,
			DeleteRule: types.Pointer("@request.query.sessionId = session"),
			Schema: schema.NewSchema(
				&schema.SchemaField{
					Name:     "session",
					Type:     schema.FieldTypeRelation,
					Required: true,
					Options: &schema.RelationOptions{
						MaxSelect:     types.Pointer(1),
						CollectionId:  sessionsCollection.Id,
						CascadeDelete: true,
					},
				},
				&schema.SchemaField{
					Name: "expired",
					Type: schema.FieldTypeDate,
				},
				&schema.SchemaField{
					Name:     "file",
					Type:     schema.FieldTypeFile,
					Required: true,
					Options: &schema.FileOptions{
						MaxSize:   fileSizeLimit,
						MaxSelect: 1,
					},
				},
				&schema.SchemaField{
					Name: "size",
					Type: schema.FieldTypeNumber,
				},
				&schema.SchemaField{
					Name:     "baseName",
					Type:     schema.FieldTypeText,
					Required: true,
				},
				&schema.SchemaField{
					Name: "iv",
					Type: schema.FieldTypeText,
				},
			),
		}

		if err := dao.SaveCollection(filesCollection); err != nil {
			return err
		}

		return nil
	}, func(db dbx.Builder) error {
		// Down migration not needed
		return nil
	})
}
