package main

import (
	"factory/handlers"
	"factory/models"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func runAPI(port int) {
	handlers.ServiceRegister(port)

	r := gin.Default()
	// r.Use(middlewares.AuthenticationMiddleware())

	r.GET("/", handlers.DefaultHandler)
	r.GET("/api/health", handlers.HealthHandler)
	r.GET("/api/service", handlers.ServiceHandler)

	r.GET("/api/users/:email", handlers.UsersHandler)
	r.GET("/api/users/tokens", handlers.IssueJwtToken)
	// api/users/roles

	// accounts

	r.GET("/api/tasks/:email", handlers.GetTasks)
	r.POST("/api/tasks", handlers.AddTask)

	r.GET("/api/caches", handlers.PingCache)
	r.GET("/api/caches/:key", handlers.GetCache)
	r.POST("/api/caches", handlers.AddCache)

	r.GET("/api/authors", handlers.GetAuthors)

	// bookmarks

	// settings

	// queue

	r.GET("/api/books/:id", handlers.BookHandler)
	r.GET("/api/books", handlers.BooksHandler)
	r.GET("/api/posts", handlers.PostsHandler)

	r.POST("/api/students", handlers.AddStudents)
	r.PUT("/api/students", handlers.UpdateStudents)
	r.DELETE("/api/students", handlers.DeleteStudents)

	r.GET("/api/testers", handlers.GetTesters)
	r.GET("/api/github-users", handlers.GetGithubUser)

	url := models.GetRabbitmqURL()
	go handlers.ConsumeMessage(url)
	log.Printf("service is running at %d", port)
	r.Run(fmt.Sprintf(":%d", port))
}

func main() {
	port := 80
	if gin.Mode() == "debug" {
		port = 5971
	}
	fmt.Println(port)
	runAPI(port)

	// post, err := controllers.GetPost(3)
	// if err != nil {
	// 	fmt.Println(post)
	// } else {
	// 	fmt.Println(post)
	// }
	// author := models.PostAuthor{
	// 	Id:   2,
	// 	Name: "phantom",
	// }
	// newPost := models.Post{
	// 	Id:      3,
	// 	Content: "hello",
	// 	Author:  author,
	// }
	// bs, _ := json.MarshalIndent(newPost, "", "\t")
	// os.WriteFile("hello.json", bs, 0666)
	// controllers.CreateBook(models.Book{Id: "123", Name: "golang get started", Price: 9.9})
}
