package models

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
)

type PostAuthor struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Post struct {
	Id      int                    `json:"id"`
	Content string                 `json:"content"`
	Author  PostAuthor             `json:"author"`
	Comment []Comment              `json:"comments"`
	More    map[string]interface{} `json:"more"`
}

type Comment struct {
	Id      int    `json:"id"`
	Content string `json:"content"`
	Author  string `json:"author"`
}

// {root}/factory/posts/xxx.json

func GetPost(id string) (Post, error) {
	var post Post
	dir := GetDataFolderPath()
	if dir == "" {
		return post, errors.New("xxx")
	}

	file := fmt.Sprintf("%s/factory/posts/%s.json", dir, id)
	data, err := GetContent(file)
	if err != nil {
		fmt.Println("error to read posts.json")
		return Post{}, err
	} else {
		json.Unmarshal(data, &post)
		return post, nil
	}
}

func GenerateNewPostId() int {
	dir := GetDataFolderPath()
	index := 0
	for next := true; next; next = FileExisting(fmt.Sprintf("%s/factory/posts/%d.json", dir, index)) {
		index++
	}
	fmt.Println(index)
	return index
}

func CreatePost(post Post) {
	dir := GetDataFolderPath()
	bs, _ := json.MarshalIndent(post, "", "\t")
	path := fmt.Sprintf("%s/factory/posts/%d.json", dir, post.Id)
	os.WriteFile(path, bs, 0666)
}
