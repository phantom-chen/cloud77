package routes

import (
	"fmt"
	"time"

	"example.com/factory/models"
	"github.com/gin-gonic/gin"
)

func GetBooks(c *gin.Context) {
	fmt.Println(c.Request.URL.RawQuery)
	fmt.Println(c.Request.URL.RawPath)
	fmt.Println(c.Request.URL)
	fmt.Println(c.Request.URL.Path)
	fmt.Println(c.Request.Method)

	price := c.DefaultQuery("price", "100")
	fmt.Println(price)

	name := c.DefaultQuery("name", "unknown")
	fmt.Println(name)

	c.Writer.Header().Set("X-Response-Custom", time.Now().Format("2006-01-02 11:11:11"))
	c.Writer.Header().Set("foo", "bar")

	books := models.GetBooks()
	c.JSON(200, books)
}

func GetBook(c *gin.Context) {
	id := c.Param("id")
	fmt.Printf("book id is %s\n", id)

	c.JSON(200, gin.H{
		"id":     "001",
		"name":   "golang tutorial",
		"price":  999,
		"rating": 4.5,
		"stars":  9999,
	})
}
