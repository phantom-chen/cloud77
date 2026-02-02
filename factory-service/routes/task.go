package routes

import (
	"encoding/json"
	"fmt"
	"io"

	"example.com/factory/databases"
	"example.com/factory/models"
	"github.com/gin-gonic/gin"
)

func GetTasks(c *gin.Context) {
	email := c.Param("email")
	data := databases.GetTasks(email)
	tasks := models.UserTasks{
		Email: email,
		Index: 0,
		Size:  5,
		Total: 0,
		Query: "",
		Data:  data,
	}
	c.JSON(200, tasks)
}

func AddTask(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(400, gin.H{
			"message": "please put your body",
		})
	} else {
		fmt.Println(string(body))
		var data models.TaskEntity
		err = json.Unmarshal(body, &data)
		if err != nil {
			c.JSON(400, gin.H{
				"message": "fail to parse body",
			})
		}
		fmt.Println(data.Email)
		fmt.Println(data.Title)
		fmt.Println(data.Description)
		re := databases.AddTask(models.TaskEntity{Title: data.Title, Email: data.Email, Description: data.Description})
		fmt.Println(re)
		c.JSON(200, gin.H{})
	}
}
