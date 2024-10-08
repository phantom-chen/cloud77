package controllers

import (
	"encoding/json"
	"factory/models"
	"fmt"
	"io/fs"
	"os"
)

func GetPost(id int) (models.Post, error) {
	if !models.FolderExisting("data") {
		os.Mkdir("data", fs.ModeDir)
		// os.MkdirAll("data/data/data", os.ModePerm)
	}
	file := fmt.Sprintf("data/posts/%d.json", id)
	fmt.Println(file)
	data, err := models.GetContent(file)
	if err != nil {
		fmt.Println("error to read posts.json")
		return models.Post{}, err
	} else {
		var post models.Post
		json.Unmarshal(data, &post)
		return post, nil
	}
}

func CreatePostId() int {
	index := 0
	for next := true; next; next = models.FileExisting(fmt.Sprintf("data/posts/%d.json", index)) {
		index++
	}
	fmt.Println(index)
	return index
}

func CreatePost() {

}

func DeletePost() {

}

func UpdatePost() {

}
