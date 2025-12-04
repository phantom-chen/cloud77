package databases

import (
	"context"
	"fmt"

	"example.com/factory/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ctx = context.Background()

func GetUser(email string) (models.User, error) {
	dbname := models.GetDatabaseName()
	fmt.Printf("connected database name is %s\n", dbname)
	client := GetClient()
	collection := client.Database(dbname).Collection("Users")
	filter := bson.D{{Key: "Email", Value: email}}
	result := collection.FindOne(ctx, filter)
	var user models.User
	err := result.Decode(&user)
	return user, err
}

func GetUsers(size int64) {
	dbname := models.GetDatabaseName()
	client := GetClient()
	database := client.Database(dbname)
	collection := database.Collection("Users")
	ops := options.Find().SetLimit(size)
	cursor, _ := collection.Find(ctx, bson.D{}, ops)
	var users []models.User
	err := cursor.All(context.TODO(), &users)
	if err != nil {
		fmt.Println(err.Error())
	}
	fmt.Println(users)
}

func CountUsers() {
	client := GetClient()
	database := client.Database(models.GetDatabaseName())
	fmt.Println(DocumentCount(*database, "Users"))
}
