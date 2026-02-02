package routes

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func UpdateQueue(c *gin.Context) {

	message := c.Query("message")
	fmt.Println(message)

	c.JSON(200, gin.H{
		"message": "message is sent to the queue",
	})
}
