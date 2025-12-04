package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"example.com/factory/databases"
	"example.com/factory/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func GetStudents(c *gin.Context) {
	client := databases.GetClient()
	database := client.Database(models.GetDatabaseName())
	count := databases.DocumentCount(*database, "Students")
	if count == 0 {
		// insert some students
		stu1 := models.StudentData{Name: "student1", Age: 10}
		stu2 := models.StudentData{Name: "student2", Age: 12}
		students := []interface{}{stu1, stu2}
		collection := database.Collection("Students")
		result2, _ := collection.InsertMany(context.TODO(), students)
		fmt.Println(result2.InsertedIDs...)
	}

	c.JSON(200, gin.H{
		"message": "wip",
	})
}

func AddStudent(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(400, gin.H{
			"message": "please put your body",
		})
	}
	fmt.Println(string(body))
	var data models.StudentData
	err = json.Unmarshal(body, &data)
	if err != nil {
		c.JSON(400, gin.H{
			"message": "fail to parse body",
		})
	}

	client := databases.GetClient()
	database := client.Database(models.GetDatabaseName())

	collection := database.Collection("Students")
	result, _ := collection.InsertOne(context.TODO(), data)
	fmt.Println(result.InsertedID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "wip",
	})
}

func UpdateStudent(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(400, gin.H{
			"message": "please put your body",
		})
	}
	fmt.Println(string(body))
	var data models.StudentData
	err = json.Unmarshal(body, &data)
	if err != nil {
		c.JSON(400, gin.H{
			"message": "fail to parse body",
		})
	}

	client := databases.GetClient()
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "age", Value: data.Age}}}}
	collection := client.Database(models.GetDatabaseName()).Collection("Students")
	result, _ := collection.UpdateMany(context.TODO(), bson.D{{Key: "name", Value: data.Name}}, update)

	fmt.Println(result.ModifiedCount)
	c.JSON(http.StatusAccepted, gin.H{
		"count": result.ModifiedCount,
	})
}

func DeleteStudent(c *gin.Context) {
	name := c.Param("name")
	fmt.Println(name)

	client := databases.GetClient()
	collection := client.Database(models.GetDatabaseName()).Collection("Students")

	result, _ := collection.DeleteMany(context.TODO(), bson.D{{Key: "name", Value: name}})
	r, _ := collection.DeleteOne(context.TODO(), bson.D{})
	fmt.Println(r.DeletedCount)

	c.JSON(http.StatusAccepted, gin.H{
		"count":  result.DeletedCount,
		"count1": r.DeletedCount,
	})
}
