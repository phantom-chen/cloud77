package middlewares

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func Logging() gin.HandlerFunc {
	return func(c *gin.Context) {

		t := time.Now()
		fmt.Println("logging middleware works")
		fmt.Println(t)

		c.Next()
	}
}
