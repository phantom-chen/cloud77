package routes

import (
	"fmt"

	"example.com/factory/databases"
	"github.com/gin-gonic/gin"
)

func GetUser(c *gin.Context) {
	// query: email or username
	email := c.Query("email")
	fmt.Println(email)

	user, err := databases.GetUser(email)
	if err != nil {
		c.JSON(200, gin.H{})
	} else {
		fmt.Println(user.Email)
		fmt.Println(user.Name)
		fmt.Println(user.Confirmed)
		fmt.Println(user.Profile)
		c.JSON(200, gin.H{
			"email":    email,
			"existing": true,
		})
	}
}
