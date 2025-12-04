package models

import (
	_ "github.com/go-sql-driver/mysql"
)

type TesterEntity struct {
	Id     int    `db:"Id" json:"id"`
	Name   string `db:"Name" json:"name"`
	Email  string `db:"Email" json:"email"`
	Region int    `db:"Region" json:"region"`
}
