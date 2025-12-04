package models

import (
	"fmt"
	"log"
	"time"

	"github.com/streadway/amqp"
)

func ConsumeMessage(url string, queue string) {
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
		queue,
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
			timestamp := time.Now().Format("2006-01-02 11:11:11")
			value := fmt.Sprintf("receive message: %s at %s", string(d.Body), timestamp)
			fmt.Println(value)
			// add key/value to redis
			AppendCache(queue, value)
		}
	}()

	<-forever
}
