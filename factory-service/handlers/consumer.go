package handlers

import (
	"factory/models"
	"fmt"
	"log"
	"time"

	"github.com/streadway/amqp"
)

func ConsumeMessage(url string) {

	conn, err := amqp.Dial(url)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	ch, err := conn.Channel()

	if err != nil {
		log.Fatal(err)
	}

	defer ch.Close()

	q, err := ch.QueueDeclare(
		"cloud77_factory_queue",
		true,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Fatal(err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)

	var forever chan struct{}

	go func() {
		for d := range msgs {
			models.AddCache("cloud77_factory_queue", fmt.Sprintf("receive message: %s at %s", string(d.Body), time.Now().Format("2006-01-02 11:11:11")))
		}
	}()

	<-forever
}
