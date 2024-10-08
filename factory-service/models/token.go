package models

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type Account struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AccessToken struct {
	Token string `json:"token"`
}

/*
Less than zero, t1 is earlier.
*/
func TokenExpired(expiration int64) bool {
	return expiration < time.Now().Local().Unix()
}

func IssueToken(user User) string {
	secret, exp := GetJwtSettings()
	jwtToken := jwt.New(jwt.SigningMethodHS256)
	claims := jwtToken.Claims.(jwt.MapClaims)

	claims["email"] = user.Email
	claims["role"] = user.Role
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(exp)).Unix()

	token, err := jwtToken.SignedString([]byte(secret))

	if err != nil {
		return ""
	} else {
		return token
	}
}

func ValidateToken(token string) (bool, string) {
	bytes := []byte(token)

	secret, _ := GetJwtSettings()
	fmt.Println(string(bytes))
	fmt.Println(secret)

	jwtToken, err := jwt.Parse(string(bytes), func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("error exists in parsing")
		}
		return []byte(secret), nil
	})

	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println(jwtToken.Claims)
		err = jwtToken.Claims.Valid()
		if err != nil {
			fmt.Println(err.Error())
		} else {
			fmt.Println("token is valid")
		}

		claims, ok := jwtToken.Claims.(jwt.MapClaims)
		if !ok {
			fmt.Println("")
		} else {
			fmt.Println(claims["role"])
			fmt.Println(claims["email"])
			if !TokenExpired(int64(claims["exp"].(float64))) {
				fmt.Println("token is valid")
			}
		}
	}

	return true, ""
}
