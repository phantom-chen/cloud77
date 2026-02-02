package databases

import (
	"context"
	"fmt"

	"example.com/factory/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetTasks(email string) []models.UserTask {
	database := GetClient().Database(models.GetDatabaseName())
	collection := database.Collection("Tasks")
	cursor, _ := collection.Find(ctx, bson.D{})
	var entities []models.TaskEntity
	cursor.All(context.TODO(), &entities)
	size := len(entities)
	fmt.Println(size)
	var tasks []models.UserTask = make([]models.UserTask, size)
	for i, v := range entities {
		tasks[i] = models.UserTask{Title: v.Title, Description: v.Description, State: v.State}
	}
	return tasks
}

func AddTask(task models.TaskEntity) interface{} {
	database := GetClient().Database(models.GetDatabaseName())
	collection := database.Collection("Tasks")

	entity := models.Task{}
	entity.Email = task.Email
	entity.Description = task.Description
	entity.Title = task.Title
	entity.State = 0
	fmt.Println(entity)

	result, _ := collection.InsertOne(context.TODO(), entity)
	return result.InsertedID
}

func AddTasks(tasks []interface{}) []interface{} {
	database := GetClient().Database(models.GetDatabaseName())
	collection := database.Collection("Tasks")
	result, _ := collection.InsertMany(context.TODO(), tasks)
	return result.InsertedIDs
}

func DeleteTask(id string) {
	database := GetClient().Database(models.GetDatabaseName())
	collection := database.Collection("Tasks")
	idobj, _ := primitive.ObjectIDFromHex(id)
	r, e := collection.DeleteOne(context.TODO(), bson.D{{Key: "_id", Value: idobj}})
	if e != nil {
		fmt.Println(e.Error())
	} else {
		fmt.Println(r.DeletedCount)
	}
}
