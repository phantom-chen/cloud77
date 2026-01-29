import * as dotenv from 'dotenv';
import { getFiles } from './models/files';
import { formatDateTimeWithLocalTimeZone, formatDateTimeCustomTimeZone, formatDateTimeWithTimeZone } from './models/date';
dotenv.config();
import { randomUUID } from 'crypto';
import { generate } from 'randomstring';
import { generateID } from './models/guid';

import amqp from 'amqplib';

let isServer = false;
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
    if (!isServer && val === 'server') {
        isServer = true;
    }
});

const run = async (email: string) => {
    console.log(email);
    const items = await getFiles('dist');
    items.forEach(i => console.log(i));
    console.log(items.length);

    console.log(randomUUID());
    console.log(generate(7));
    console.log(generateID(6));

    // Examples of date time with time zone formatting
    console.log('Current date time with time zone examples:');
    console.log('ISO format:', formatDateTimeWithTimeZone());
    console.log('Local time zone:', formatDateTimeWithLocalTimeZone());
    console.log('Custom time zone (NY):', formatDateTimeCustomTimeZone(new Date(), 'America/New_York'));
    console.log('Custom time zone (Tokyo):', formatDateTimeCustomTimeZone(new Date(), 'Asia/Tokyo'));
    console.log('Custom time zone (London):', formatDateTimeCustomTimeZone(new Date(), 'Europe/London'));
}

run(process.env.EMAIL || '')
    .then(() => {
        console.log(process.env.MQ_HOST);
        console.log(process.env.MQ_USERNAME);
        console.log(process.env.MQ_PASSWORD);
        const connection = `amqp://${process.env.MQ_USERNAME}:${process.env.MQ_PASSWORD}@${process.env.MQ_HOST}`;
        console.log(`MQ Connection: ${connection}`);

        if (isServer) {
            console.log("Running as server...");
            // listen to some events
            amqp.connect(connection)
                .then(conn => {
                    console.log("Connected to MQ server");
                    return conn.createChannel();
                })
                .then(channel => {
                    const queue = 'test_queue';
                    channel.assertQueue(queue, { durable: false });
                    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);
                    channel.consume(queue, msg => {
                        if (msg !== null) {
                            console.log(`Received message: ${msg.content.toString()} ` + new Date().toISOString());
                            channel.ack(msg);
                        }
                    }, { noAck: false });
                })
                .catch(err => {
                    console.error("Failed to connect to MQ server:", err);
                });
        } else {
            console.log("Running as client...");
            amqp.connect(connection)
                .then(conn => {
                    console.log("Connected to MQ server");
                    return conn.createChannel();
                })
                .then(channel => {
                    const queue = 'test_queue';
                    channel.sendToQueue(queue, Buffer.from('Hello World'));
                    channel.close();
                })
                .catch(err => {
                    console.error("Failed to connect to MQ server:", err);
                });
        }

        console.log("done");
    });