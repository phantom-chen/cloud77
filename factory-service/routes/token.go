package routes

import (
	"encoding/json"
	"io"
	"log"

	"example.com/factory/databases"
	"example.com/factory/models"
	"github.com/gin-gonic/gin"
)

func GenerateToken(c *gin.Context) {
	var account models.Account
	data, err := io.ReadAll(c.Request.Body)

	if err != nil {
		log.Println("fail to get request body")
		c.JSON(500, gin.H{
			"message": "fail to sign token for you",
		})
	} else {
		json.Unmarshal(data, &account)
		log.Println(account.Email)
		log.Println(account.Password)

		// validate password
		user, err := databases.GetUser(account.Email)
		if err != nil {
			c.JSON(500, gin.H{
				"message": err.Error(),
			})
		}

		c.JSON(200, gin.H{
			"email":         account.Email,
			"value":         models.GenerateToken(models.GetSecret(), 24, user),
			"refreshToken":  "xxx",
			"issueAt":       "xxx",
			"expireInHours": 24,
		})
	}
}
