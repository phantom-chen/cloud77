package routes

import (
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetGitHubUser(c *gin.Context) {
	name := c.Query("username")

	fmt.Printf("query name is %s\n", name)
	url := fmt.Sprintf("https://api.github.com/users/%s", name)
	res, err := http.Get(url)
	if err != nil {
		print(err)
		c.JSON(200, gin.H{
			"message": "not found github user",
		})

		return
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		print(err)
		c.JSON(200, gin.H{
			"message": "not found github user",
		})

		return
	}

	c.Writer.Header().Set("content-type", "application/json")
	c.Writer.Write(body)
}
