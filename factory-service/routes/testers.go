package routes

import (
	"fmt"

	"example.com/factory/databases"
	"github.com/gin-gonic/gin"
)

func GetTesters(c *gin.Context) {
	testers, err := databases.GetTesters()
	if err == nil {
		for _, v := range testers {
			fmt.Println(v.Email)
		}
	}
	c.JSON(200, testers)
}
