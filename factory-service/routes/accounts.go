package routes

import "github.com/gin-gonic/gin"

func GetRole(c *gin.Context) {
	// auth := c.MustGet("authorized").(string)
	// fmt.Println(auth)
	// if auth != "true" {
	// 	c.JSON(401, gin.H{
	// 		"message": "unauthorized",
	// 	})

	// 	return
	// }

	c.JSON(200, gin.H{
		"message": "wip",
	})
}

func GetAccount() {

}

func GetAccounts() {

}
