package middlewares

import (
	"fmt"
	"strings"

	"example.com/factory/models"
	"github.com/gin-gonic/gin"
)

func Authentication() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		header := ctx.Request.Header["Authorization"]
		if header == nil {
			fmt.Println("fail to get Authorization header")
			// errors.New("fail to get Authorization header")
		} else {
			tokenString := strings.Trim(strings.SplitN(header[0], " ", 2)[1], " ")
			fmt.Println(tokenString)

			secret := models.GetSecret()
			err := models.ValidateToken(secret, tokenString)
			if err != nil {
				fmt.Println(err.Error())
				ctx.Set("authorized", "false")
			} else {
				ctx.Set("authorized", "true")
			}
		}

		ctx.Next()
	}
}
