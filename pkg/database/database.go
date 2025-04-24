package database

import (
	"fmt"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var Instance *gorm.DB

func Initialize(connectionString string) error {
	newInstance, err := gorm.Open(sqlite.Open(connectionString), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("error opening db connection: %w", err)
	}
	Instance = newInstance

	Instance.AutoMigrate(&User{})

	err = initNonGormResources()
	if err != nil {
		return fmt.Errorf("error initializing non-GORM resources: %w", err)
	}

	return nil
}
