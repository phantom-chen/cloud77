package databases

import (
	"fmt"
	"os"

	"example.com/factory/models"
	"github.com/jmoiron/sqlx"
)

var db *sqlx.DB

func GetTesters() ([]models.TesterEntity, error) {

	var testers []models.TesterEntity
	conn := fmt.Sprintf("%s:%s@tcp(%s)/%s", os.Getenv("MYSQL_USER"), os.Getenv("MYSQL_PASSWORD"), os.Getenv("MYSQL_HOST"), os.Getenv("MYSQL_DB"))
	database, err := sqlx.Open("mysql", conn)
	if err != nil {
		fmt.Println("error to connect to sql")
		fmt.Println(err.Error())
		return testers, err
	}

	db = database

	err1 := db.Select(&testers, "select Id, Name, Email, Region from Testers limit ?;", 5)

	if err1 != nil {
		fmt.Println("error to query users data")
		return testers, err
	}

	defer db.Close()
	return testers, nil
}
