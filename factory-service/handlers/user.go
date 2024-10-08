package handlers

import (
	"factory/controllers"
	"factory/models"
	"fmt"

	"github.com/gin-gonic/gin"
)

func UsersHandler(c *gin.Context) {
	email := c.Param("email")
	fmt.Println(email)
	user, err := controllers.GetUser(email)
	existing := false
	if err == nil {
		existing = true
		fmt.Println(user.Email)
		fmt.Println(user.Name)
		fmt.Println(user.Confirmed)
		fmt.Println(user.Profile)
	}

	c.JSON(200, gin.H{
		"email":    email,
		"existing": existing,
	})
}

func GetUserRole(c *gin.Context) {
	// auth := c.MustGet("authorized").(string)
	// fmt.Println(auth)
	// if auth != "true" {
	// 	c.JSON(401, gin.H{
	// 		"message": "unauthorized",
	// 	})

	// 	return
	// }
	models.ValidateToken("")
	c.JSON(200, gin.H{
		"message": "wip",
	})
}
