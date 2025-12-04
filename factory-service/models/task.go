package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserTask struct {
	Title       string `bson:"Title" json:"title"`
	Description string `bson:"Description" json:"description"`
	State       int    `bson:"State" json:"state"`
}

type Task struct {
	Email       string `bson:"Email" json:"email"`
	Title       string `bson:"Title" json:"title"`
	Description string `bson:"Description" json:"description"`
	State       int    `bson:"State" json:"state"`
}

type TaskEntity struct {
	Id          primitive.ObjectID `bson:"_id" json:"id"`
	Email       string             `bson:"Email" json:"email"`
	Title       string             `bson:"Title" json:"title"`
	Description string             `bson:"Description" json:"description"`
	State       int                `bson:"State" json:"state"`
}

type UserTasks struct {
	Email string     `json:"email"`
	Index int        `json:"index"`
	Size  int        `json:"size"`
	Total int        `json:"total"`
	Query string     `json:"query"`
	Data  []UserTask `json:"data"`
}
