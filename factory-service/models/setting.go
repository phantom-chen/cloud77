package models

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
)

type ConsulSettings struct {
	Host   string `json:"host"`
	Port   string `json:"port"`
	Enable bool   `json:"enable"`
}

type JwtSettings struct {
	Secret        string `json:"secret"`
	ExpiresInHour int    `json:"expiresInHour"`
}

type MysqlSettings struct {
	Host     string `json:"host"`
	Database string `json:"database"`
	User     string `json:"user"`
	Password string `json:"password"`
}

type MongodbSettings struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
	Database string `json:"database"`
}

type RedisSettings struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	Password string `json:"password"`
	DB       int    `json:"db"`
}

type RabbitmqSettings struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
}

type AppSettings struct {
	Service  string           `json:"service"`
	Tags     string           `json:"tags"`
	Consul   ConsulSettings   `json:"consul"`
	Jwt      JwtSettings      `json:"jwt"`
	Mysql    MysqlSettings    `json:"mysql"`
	Redis    RedisSettings    `json:"redis"`
	Cluster  string           `json:"cluster"`
	Mongodb  MongodbSettings  `json:"mongodb"`
	Rabbitmq RabbitmqSettings `json:"rabbitmq"`
}

func GetVersion() string {
	// GetContent("version")
	version := ""
	f, err := os.Open("version")
	if err != nil {
		version = "0.0.0"
	}
	data, err := io.ReadAll(f)
	if err != nil {
		version = "0.0.0"
	}

	defer f.Close()

	version = string(data)

	fmt.Println(version)
	return version
}

var appsettings *AppSettings

func GetAppSettings() (AppSettings, error) {
	var settings AppSettings
	if appsettings != nil {
		settings = *appsettings
		return settings, nil
	} else {
		data, err := GetContent("appsettings.json")
		json.Unmarshal(data, &settings)

		if err != nil {
			return settings, err
		} else {
			appsettings = &settings
			return settings, nil
		}
	}
}

func GetConsulAddress() string {
	var host string
	host = appsettings.Consul.Host
	return fmt.Sprintf("%s:%s", host, appsettings.Consul.Port)
}

func GetMysqlConnectionString() string {
	settings, err := GetAppSettings()
	if err != nil {
		return ""
	} else {
		return fmt.Sprintf("%s:%s@tcp(%s)/%s", settings.Mysql.User, settings.Mysql.Password, settings.Mysql.Host, settings.Mysql.Database)
	}
}

func GetRedisSettings() (addr string, password string, db int) {
	settings, err := GetAppSettings()
	if err != nil {
		return "", "", 0
	} else {
		return fmt.Sprintf("%s:%s", settings.Redis.Host, settings.Redis.Port), settings.Redis.Password, settings.Redis.DB
	}
}

func GetMongodbConnectionString() string {
	settings, err := GetAppSettings()
	if err != nil {
		return ""
	} else {
		return settings.Cluster
		// return fmt.Sprintf("mongodb://%s:%s@%s:%s", settings.Mongodb.User, settings.Mongodb.Password, settings.Mongodb.Host, settings.Mongodb.Port)
	}
}

func DatabaseName() string {
	settings, err := GetAppSettings()
	if err != nil {
		return ""
	} else {
		return settings.Mongodb.Database
	}
}

func GetRabbitmqURL() string {
	var host string
	host = appsettings.Rabbitmq.Host
	settings := appsettings.Rabbitmq
	return fmt.Sprintf("amqp://%s:%s@%s:%s/", settings.User, settings.Password, host, settings.Port)
}

func GetJwtSettings() (secret string, expiredInHour int) {
	settings := appsettings.Jwt
	return settings.Secret, settings.ExpiresInHour
}

func ServiceName() string {
	return appsettings.Service
}

func ServiceTags() []string {
	return strings.Split(appsettings.Tags, ",")
}
