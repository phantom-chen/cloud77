package controllers

import (
	"factory/models"
	"fmt"

	"github.com/jmoiron/sqlx"
)

var db *sqlx.DB

func GetTesters() ([]models.TesterEntity, error) {
	conn := models.GetMysqlConnectionString()
	database, err := sqlx.Open("mysql", conn)
	if err != nil {
		fmt.Println("error to connect to sql")
		fmt.Println(err.Error())
		return nil, err
	}

	db = database

	var testers []models.TesterEntity

	err1 := db.Select(&testers, "select Id, Name, Email, Region from Testers limit ?;", 5)

	if err1 != nil {
		fmt.Println("error to query users data")
		return nil, err
	}

	defer db.Close()
	return testers, nil
}
