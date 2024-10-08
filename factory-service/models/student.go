package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Student struct {
	Id   primitive.ObjectID `bson:"_id"`
	Name string             `bson:"name"`
	Age  int                `bson:"age"`
}

type StudentData struct {
	Name string
	Age  int
}
