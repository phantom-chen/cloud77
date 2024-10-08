package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type License struct {
	Template   string             `bson:"Template"`
	State      string             `bson:"State"`
	Region     string             `bson:"Region"`
	Scope      string             `bson:"Scope"`
	Option1    int                `bson:"Option1"`
	Option2    int                `bson:"Option2"`
	Option3    string             `bson:"Option3"`
	SubmitDate primitive.DateTime `bson:"SubmitDate"`
}

type Profile struct {
	Surname     string `json:"surname" bson:"Surname"`
	GivenName   string `bson:"GivenName" json:"givenName"`
	Company     string `bson:"Company"`
	CompanyType string `bson:"CompanyType"`
	Title       string `bson:"Title"`
	Phone       string `bson:"Phone"`
	Fax         string `bson:"Fax"`
	City        string `bson:"City"`
	Address     string `bson:"Address"`
	Post        string `bson:"Post"`
	Supplier    string `bson:"Supplier"`
	Contact     string `bson:"Contact"`
}

type Device struct {
	Machine string `bson:"Machine"`
	Install string `bson:"Install"`
}

type User struct {
	Id        primitive.ObjectID `bson:"_id"`
	Email     string             `bson:"Email"`
	Password  string             `bson:"Password"`
	Role      string             `bson:"Role"`
	Name      string             `bson:"Name"`
	Confirmed bool               `bson:"Confirmed"`
	Profile   Profile            `bson:"Profile"`
}

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
