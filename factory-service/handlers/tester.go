package handlers

import (
	"factory/controllers"
	"fmt"

	"github.com/gin-gonic/gin"
)

func GetTesters(c *gin.Context) {
	testers, err := controllers.GetTesters()
	if err == nil {
		for _, v := range testers {
			fmt.Println(v.Email)
		}
	}
	c.JSON(200, testers)
}
