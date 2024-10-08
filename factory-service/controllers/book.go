package controllers

import (
	"encoding/json"
	"factory/models"
	"fmt"
	"os"
)

func writeFile(name string, content string) {
	os.WriteFile(name, []byte(content), 0666)
}

func CreateBook(book models.Book) {
	bs, _ := json.MarshalIndent(book, "", "\t")
	name := fmt.Sprintf("data/books/%s.json", book.Id)
	fmt.Println(name)
	writeFile(name, string(bs))
}
