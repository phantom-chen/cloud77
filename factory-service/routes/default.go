package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func DefaultHandler(c *gin.Context) {
	c.String(http.StatusOK, "Factory Service is running")
}
