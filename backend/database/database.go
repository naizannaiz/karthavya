package database

import (
	"log"

	"karthavya/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func StartPostgres() *gorm.DB {
	dbUser := "postgres"
	dbPassword := "yourpassword"
	dbName := "karthavya"
	dbHost := "localhost"
	dbPort := "5432"
	dbUrl := "postgres://" + dbUser + ":" + dbPassword + "@" + dbHost + ":" + dbPort + "/" + dbName

	db, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect to the database:", err)
	}
	model.Migrate(db)
	return db
}
