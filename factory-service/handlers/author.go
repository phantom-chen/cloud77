package handlers

import (
	"github.com/gin-gonic/gin"
)

func GetAuthors(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "todo",
	})
}
