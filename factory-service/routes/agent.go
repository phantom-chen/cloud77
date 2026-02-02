package routes

import (
	"fmt"

	"example.com/factory/models"
	"github.com/gin-gonic/gin"
)

func GetAgent(c *gin.Context) {

	agent := models.ServiceAgent{
		Version: "1.0.0",
	}

	fmt.Println(agent)

	c.JSON(200, gin.H{
		"version":     "1.0.0.0",
		"hostname":    "xxx",
		"machine":     "xxx",
		"ip":          "0.0.0.0",
		"service":     "agent",
		"tags":        []string{"tag1", "tag2", "tag3"},
		"environment": "dev",
		"logging":     "txt",
	})
}
