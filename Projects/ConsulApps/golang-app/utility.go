package main

import (
	"fmt"
	"net"
	"runtime"

	consul "github.com/hashicorp/consul/api"
)

func GetAddress() string {
	addr := ""
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		println(err)
	} else {

		for _, v := range addrs {
			ipnet, ok := v.(*net.IPNet)
			if ok && !ipnet.IP.IsLoopback() && ipnet.IP.To4() != nil && ipnet.IP.IsPrivate() {
				println(ipnet.IP.IsGlobalUnicast())
				println(ipnet.Network())
				println(ipnet.String())
				println(ipnet.IP.String())
				if addr == "" {
					addr = ipnet.IP.String()
				}
			}
		}
	}
	return addr
}

func GetOS() string {
	switch runtime.GOOS {
	case "windows":
		return "Windows"
	case "linux":
		return "Linux"
	default:
		return "Other"
	}
}

func DeregisterService(client *consul.Client, id string) bool {
	err := client.Agent().ServiceDeregister(id)
	if err != nil {
		return false
	} else {
		return true
	}
}

func RegisterService(client *consul.Client, id string, port int) bool {
	// id
	// name
	reg := new(consul.AgentServiceRegistration)
	reg.ID = id
	reg.Name = "golang-app"
	reg.Port = port
	reg.Tags = []string{"tag1", "tag2", "tag3"}
	address := GetAddress()
	reg.Address = address

	check := new(consul.AgentServiceCheck)
	a1 := fmt.Sprintf("http://%s:%d/api/health", address, port)
	fmt.Println(a1)
	check.HTTP = a1
	check.Timeout = "5s"
	check.Interval = "5s"
	check.DeregisterCriticalServiceAfter = "20s"
	reg.Check = check

	err := client.Agent().ServiceRegister(reg)
	if err != nil {
		println(err.Error())
		println("fail to register service")
		return false
	} else {
		return true
	}
}
