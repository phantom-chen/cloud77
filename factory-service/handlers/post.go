package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func PostsHandler(c *gin.Context) {
	// posts, err := models.GetPosts("posts.json")

	// if err != nil {
	// 	c.JSON(404, gin.H{
	// 		"message": err,
	// 	})
	// } else {
	// 	c.JSON(200, posts)
	// }
	c.JSON(http.StatusOK, gin.H{})
}
