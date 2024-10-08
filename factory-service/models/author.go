package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type AuthorEntity struct {
	Id        primitive.ObjectID `bson:"_id"`
	Name      string             `bson:"name"`
	Title     string             `bson:"title"`
	Region    string             `bson:"region"`
	Address   string             `bson:"address"`
	CreatedAt string             `bson:"createdAt"`
	Timestamp string             `bson:"timestamp"`
}
