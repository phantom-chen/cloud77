package models

import (
	"encoding/json"
	"fmt"
)

type Book struct {
	Id    string  `json:"id"`
	Name  string  `json:"name"`
	Price float32 `json:"price"`
}

func CreateBook(book Book) {
	dir := GetDataFolderPath()
	bs, _ := json.MarshalIndent(book, "", "\t")
	name := fmt.Sprintf("%s/factory/books/%s.json", dir, book.Id)
	fmt.Println(name)
	WriteFile(name, string(bs))
}

func GetBooks() []Book {
	book1 := Book{Id: "001", Name: "Golang Tutorial", Price: 10.0}
	book2 := Book{Id: "002", Name: "Nodejs Reference", Price: 20.0}
	books := []Book{book1, book2}

	return books
}
