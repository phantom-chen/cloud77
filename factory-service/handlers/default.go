package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func DefaultHandler(c *gin.Context) {
	c.String(http.StatusOK, "Factory App is running")
}

func HealthHandler(c *gin.Context) {
	c.String(http.StatusOK, "Healthy")
}
