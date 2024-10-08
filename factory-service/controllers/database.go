package controllers

import (
	"context"
	"factory/models"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// func GetDatabases() {

// }

// func GetCollections(database string) {

// }

var client *mongo.Client

func GetClient() *mongo.Client {
	if client != nil {
		fmt.Println("client is already inited")
		return client
	} else {
		uri := models.GetMongodbConnectionString()
		clientOptions := options.Client().ApplyURI(uri)
		c, err := mongo.Connect(context.TODO(), clientOptions)
		if err != nil {
			log.Fatal(err)
			return client
		} else {
			client = c
			return client
		}
	}
}

func Ping(client mongo.Client) {
	err := client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}
}

func GetSize(client mongo.Client) int64 {
	databases, err := client.ListDatabases(context.TODO(), bson.M{})
	if err != nil {
		return 0
	} else {
		return databases.TotalSize / 1024 / 1024 / 1024
	}
}

func GetDatabaseNames(client mongo.Client) []string {
	names, err := client.ListDatabaseNames(context.TODO(), bson.M{})
	if err != nil {
		return nil
	} else {
		return names
	}
}

func GetCollectionNames(client mongo.Client, dbName string) []string {
	database := client.Database(dbName)
	collections, err := database.ListCollectionNames(context.TODO(), bson.M{})
	if err != nil {
		return nil
	} else {
		return collections
	}
}

func DocumentCount(database mongo.Database, collection string) int64 {
	col := database.Collection(collection)
	count, err := col.EstimatedDocumentCount(context.TODO())

	if err != nil {
		return 0
	} else {
		return count
	}
}
