package models

type Book struct {
	Id    string  `json:"id"`
	Name  string  `json:"name"`
	Price float32 `json:"price"`
}
