package middlewares

import (
	"errors"
	"factory/models"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func AuthenticationMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		t := time.Now()
		fmt.Println("hello middleware works")
		fmt.Println(t)

		err := validateToken(ctx.Writer, ctx.Request)
		if err != nil {
			fmt.Println(err.Error())
			ctx.Set("authorized", "false")
		} else {
			ctx.Set("authorized", "true")
		}

		ctx.Next()
	}
}

func validateToken(w http.ResponseWriter, r *http.Request) (err error) {
	secret, _ := models.GetJwtSettings()
	if r.Header["Authorization"] == nil {
		fmt.Println("fail to get Authorization header")
		return errors.New("fail to get Authorization header")
	}

	tokenString := strings.Trim(strings.SplitN(r.Header["Authorization"][0], " ", 2)[1], " ")
	fmt.Println(tokenString)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("error exists in parsing")
		}
		return []byte(secret), nil
	})

	if token == nil {
		fmt.Println("invalid token")
		return errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		fmt.Println("fail to parse claims")
		return errors.New("fail to parse claims")
	}
	exp := claims["exp"].(int64)
	if models.TokenExpired(exp) {
		fmt.Println("token expired")
		return errors.New("token expired")
	}
	return
}
