package handlers

import (
	"factory/models"
	"log"

	"github.com/streadway/amqp"
)

type Options struct {
	queue   string
	message string
}

func ProduceMessage(options Options) {
	url := models.GetRabbitmqURL()
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
		options.queue,
		true,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Fatal(err)
	}

	err = ch.Publish(
		"",
		q.Name,
		false,
		false,
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(options.message),
		},
	)
	if err != nil {
		log.Fatal(err)
	}

}
