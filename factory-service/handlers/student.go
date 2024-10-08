package handlers

import (
	"context"
	"factory/controllers"
	"factory/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func AddStudents(c *gin.Context) {
	// stu2 := models.StudentData{Name: "student2", Age: 15}
	// stu3 := models.StudentData{Name: "student3", Age: 20}
	// students := []interface{}{stu2, stu3}
	// result2, _ := collection.InsertMany(context.TODO(), students)
	// fmt.Println(result2.InsertedIDs...)

	c.JSON(http.StatusCreated, gin.H{
		"ids": "123",
	})
}

func UpdateStudents(c *gin.Context) {
	client := controllers.GetClient()
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "name", Value: "student111"}}}}
	collection := client.Database(models.DatabaseName()).Collection("Students")
	result, _ := collection.UpdateMany(context.TODO(), bson.D{{Key: "age", Value: 10}}, update)

	fmt.Println(result.ModifiedCount)
	c.JSON(http.StatusAccepted, gin.H{
		"count": result.ModifiedCount,
	})
}

func DeleteStudents(c *gin.Context) {
	client := controllers.GetClient()
	collection := client.Database(models.DatabaseName()).Collection("Students")

	result, _ := collection.DeleteMany(context.TODO(), bson.D{{Key: "name", Value: "student111"}})
	r, _ := collection.DeleteOne(context.TODO(), bson.D{})
	fmt.Println(r.DeletedCount)

	c.JSON(http.StatusAccepted, gin.H{
		"count":  result.DeletedCount,
		"count1": r.DeletedCount,
	})
}
