package main

import (
	"fmt"
	"io/fs"
	"os"
	"path"

	"example.com/factory/middlewares"
	"example.com/factory/models"
	"example.com/factory/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	dataFolder := models.GetDataFolderPath()
	fmt.Println(dataFolder)
	post, _ := models.GetPost("1")
	fmt.Println(post.Content)
	fmt.Println("Hello, World!")
	port := 80

	fmt.Println("Mode", gin.Mode())
	if gin.Mode() == gin.DebugMode {
		port = 8080
	}
	fmt.Println("Listening on port", port)
	fmt.Println(models.GenerateNewPostId())
	r := gin.Default()

	r.Use(middlewares.Logging())
	r.Use(middlewares.Authentication())

	r.GET("/", routes.DefaultHandler)
	// r.GET("/api/health", routes.HealthHandler)
	// r.GET("/api/agent", routes.GetAgent)
	// r.GET("/api/github-users", routes.GetGitHubUser)

	// r.GET("/api/books", routes.DefaultHandler)
	// r.GET("/api/books/:id", routes.DefaultHandler)

	// api/database
	// api/database/collections

	r.GET("/api/posts", routes.GetPosts)
	r.GET("/api/posts/:id", routes.GetPost)

	r.GET("/api/users", routes.GetUser)

	// consume messages
	url := models.GetMessageQueueUrl()
	go models.ConsumeMessage(url, "factory_service_default_queue")

	defer r.Run(":" + fmt.Sprint(port))

	fmt.Println(os.Getenv("FACTORY_SERVICE_PORT"))
	fmt.Println(os.Getenv("DB_CONNECTION"))
	fmt.Println(models.Array2string([]string{"tag1", "tag2", "tag3"}, ","))
	fmt.Println(models.GetDatabaseName())

	if !models.FolderExisting(dataFolder) {
		os.Mkdir(dataFolder, fs.ModeDir)
		// os.MkdirAll("data/posts", os.ModePerm)
	}
	if !models.FolderExisting(path.Join(dataFolder, "factory")) {
		os.Mkdir(path.Join(dataFolder, "factory"), fs.ModeDir)
	}
	if !models.FolderExisting(path.Join(dataFolder, "factory", "posts")) {
		os.Mkdir(path.Join(dataFolder, "factory", "posts"), fs.ModeDir)
	}
	if !models.FolderExisting(path.Join(dataFolder, "factory", "books")) {
		os.Mkdir(path.Join(dataFolder, "factory", "books"), fs.ModeDir)
	}

	_, err := os.Stat(path.Join(dataFolder, "factory", "posts", "1.json"))
	fmt.Println(err.Error())
	if os.IsNotExist(err) {
		fmt.Println("false")
	} else {
		fmt.Println("true")
	}

	models.CreateBook(models.Book{
		Id:    "003",
		Name:  "golang get started",
		Price: 9.9,
	})
}
