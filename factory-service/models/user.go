package models

import "go.mongodb.org/mongo-driver/bson/primitive"

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

type User struct {
	Id        primitive.ObjectID `bson:"_id"`
	Email     string             `bson:"Email"`
	Password  string             `bson:"Password"`
	Role      string             `bson:"Role"`
	Name      string             `bson:"Name"`
	Confirmed bool               `bson:"Confirmed"`
	Profile   Profile            `bson:"Profile"`
}
