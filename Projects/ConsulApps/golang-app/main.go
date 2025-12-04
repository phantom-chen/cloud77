package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
	consul "github.com/hashicorp/consul/api"
	godotenv "github.com/joho/godotenv"
)

// A simple controller function that handles requests
func valuesController(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello from the values controller!")
}

func healthController(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Healthy!")
}

func main() {
	println("Hello, World!")
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}
	// Get the IP address of the machine
	// println(GetAddress())

	println(GetOS())

	println(os.Hostname())

	// id = golang-app-id
	uid, _ := uuid.NewRandom()
	println(uid.String())
	u := uid.String()
	serviceId := strings.Replace(u[0:8], "-", "", -1) // Take first 8 chars of UUID and remove hyphens
	println(serviceId)

	now := time.Now()
	timeString := now.Format("150405") // hhmmss
	println(timeString)

	consulHost := os.Getenv("CONSUL_HOST")
	println(consulHost)

	config := consul.DefaultConfig()
	config.Address = fmt.Sprintf("http://%s:%d", consulHost, 8500)
	client, err := consul.NewClient(config)
	if err != nil {

	} else {
		// register service
		println("register service")
		DeregisterService(client, "golang-app-001")
		time.Sleep(time.Second * 5)
		RegisterService(client, "golang-app-001", 8080)
	}
	// Register the controller to handle requests at the /values route
	http.HandleFunc("/values", valuesController)
	http.HandleFunc("/api/health", healthController)

	// Start the HTTP server on port 8080
	fmt.Println("Starting server at port 8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
