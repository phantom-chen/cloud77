package routes

import (
	"net/http"

	"example.com/factory/models"
	"github.com/gin-gonic/gin"
)

func GetPosts(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{})
}

func GetPost(c *gin.Context) {
	id := c.Param("id")
	post, err := models.GetPost(id)

	if err != nil {
		c.JSON(404, gin.H{
			"message": err,
		})
	} else {
		c.JSON(200, post)
	}
}
