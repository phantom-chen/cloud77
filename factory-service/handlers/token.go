package handlers

import (
	"factory/controllers"
	"factory/models"
	"fmt"

	"github.com/gin-gonic/gin"
)

func IssueJwtToken(c *gin.Context) {
	// var account models.Account
	// data, err := io.ReadAll(c.Request.Body)

	// if err != nil {
	// 	log.Println("fail to get request body")
	// 	c.JSON(500, gin.H{
	// 		"message": "fail to sign token for you",
	// 	})
	// } else {
	// json.Unmarshal(data, &account)
	// log.Println(account.Email)
	// log.Println(account.Password)

	email := c.Query("email")
	password := c.Query("password")
	fmt.Println(password)
	user, err := controllers.GetUser(email)

	if err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
	}

	fmt.Println(models.IssueToken(user))

	c.JSON(200, gin.H{
		"email":         email,
		"value":         models.IssueToken(user),
		"refreshToken":  "xxx",
		"issueAt":       "xxx",
		"expireInHours": 1,
	})
}
