package handlers

import (
	"factory/controllers"
	"factory/models"
	"fmt"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	consul "github.com/hashicorp/consul/api"
)

func ServiceHandler(c *gin.Context) {
	version := models.GetVersion()
	h, _ := os.Hostname()

	data := models.ServiceApp{
		Name:     models.ServiceName(),
		Tags:     models.ServiceTags(),
		Version:  version,
		IP:       controllers.GetIPAddress(),
		Hostname: h,
	}
	c.JSON(200, data)
}

func ServiceRegister(port int) {
	settings, err := models.GetAppSettings()
	if err != nil {
		return
	} else {
		if settings.Consul.Enable {
			client := createConsulClient(fmt.Sprintf("http://%s:%s", settings.Consul.Host, settings.Consul.Port))
			uid, _ := uuid.NewRandom()
			deregisterService(client, uid.String())
			registerService(client, uid.String(), settings.Service, settings.Tags, port)
		}
	}
}

func createConsulClient(address string) *consul.Client {
	config := consul.DefaultConfig()
	config.Address = address
	client, err := consul.NewClient(config)
	if err != nil {
		return nil
	} else {
		return client
	}
}

func registerService(client *consul.Client, id, service, tags string, port int) bool {
	if client == nil {
		return false
	}

	reg := new(consul.AgentServiceRegistration)
	reg.ID = id
	reg.Name = service
	reg.Port = port
	reg.Tags = strings.Split(tags, ",")

	hostname, _ := os.Hostname()
	reg.Tags = append(reg.Tags, hostname)
	reg.Tags = append(reg.Tags, "v"+models.GetVersion())

	reg.Address = controllers.GetIPAddress()

	check := new(consul.AgentServiceCheck)
	check.HTTP = fmt.Sprintf("http://%s:%d/api/health", reg.Address, port)
	check.Timeout = "5s"
	check.Interval = "5s"
	check.DeregisterCriticalServiceAfter = "20s"

	reg.Check = check

	err := client.Agent().ServiceRegister(reg)
	if err != nil {
		return false
	} else {
		return true
	}

}

func deregisterService(client *consul.Client, id string) bool {
	err := client.Agent().ServiceDeregister(id)
	if err != nil {
		return false
	} else {
		return true
	}
}
