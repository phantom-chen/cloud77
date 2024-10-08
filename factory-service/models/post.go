package models

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
