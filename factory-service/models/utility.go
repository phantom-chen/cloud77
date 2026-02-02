package models

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path"
	"runtime"
	"strings"
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

func GetVersion() string {
	version := ""
	f, err := os.Open("version")
	if err != nil {
		version = "0.0.0"
	}
	data, err := io.ReadAll(f)
	if err != nil {
		version = "0.0.0"
	}

	defer f.Close()

	version = string(data)
	return version
}

func Array2string(tags []string, seporator string) string {
	if len(tags) > 0 {
		return strings.Join(tags, seporator)
	} else {
		return ""
	}
}

func ServiceTags(tags string) []string {
	return strings.Split(tags, ",")
}

func GetDataFolderPath() string {
	// Windows
	if runtime.GOOS == "windows" {
		return "C:\\ProgramData\\MyServices"
	}

	// Linux
	dir, err := os.Getwd()
	if err != nil {
		return ""
	}

	return path.Join(dir, "data")
}

func GetMessageQueueUrl() string {
	user := os.Getenv("MQ_USERNAME")
	password := os.Getenv("MQ_PASSWORD")
	host := os.Getenv("MQ_HOST")
	return fmt.Sprintf("amqp://%s:%s@%s:%d/", user, password, host, 5672)
}

/*
Less than zero, t1 is earlier.
*/
func TokenExpired(expiration int64) bool {
	return expiration < time.Now().Local().Unix()
}

func ValidateToken(secret string, token string) (err error) {

	jwtToken, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("error exists in parsing")
		}
		return []byte(secret), nil
	})

	if jwtToken == nil {
		fmt.Println("invalid token")
		return errors.New("invalid token")
	}

	fmt.Println(jwtToken.Claims)
	err = jwtToken.Claims.Valid()
	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println("token is valid")
	}

	claims, ok := jwtToken.Claims.(jwt.MapClaims)
	if !ok {
		fmt.Println("fail to parse claims")
		return errors.New("fail to parse claims")
	}
	fmt.Println(claims["role"])
	fmt.Println(claims["email"])
	exp := claims["exp"].(int64)
	if TokenExpired(exp) {
		fmt.Println("token expired")
		return errors.New("token expired")
	}
	return
}

func GenerateToken(secret string, expiration int16, user User) string {
	jwtToken := jwt.New(jwt.SigningMethodHS256)
	claims := jwtToken.Claims.(jwt.MapClaims)

	claims["email"] = user.Email
	claims["role"] = user.Role
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(expiration)).Unix()

	token, err := jwtToken.SignedString([]byte(secret))

	if err != nil {
		return ""
	} else {
		return token
	}
}
