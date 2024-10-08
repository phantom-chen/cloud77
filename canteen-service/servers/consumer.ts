import amqp from 'amqplib';
import md5 from 'md5';
import { getQueueConnection } from "../models/settings";
import { addCache } from '../controllers/cache';
import { updateUserName, updateUserPassword } from '../database/user';

export const queues = {
    'home': "canteen_default_queue",
    'username': 'canteen_username_queue',
    'password': 'canteen_password_queue'
};

const connectionString = getQueueConnection();

export async function connectQueue(connectionString: string): Promise<amqp.Channel> {
    const connection = await amqp.connect(connectionString);
    const channel = await connection.createChannel();
    await channel.assertQueue(queues.home);
    await channel.assertQueue(queues.username);
    await channel.assertQueue(queues.password);
    return channel;
}

export async function consumeMessages(): Promise<void> {
    const channel = await connectQueue(connectionString);
    channel.consume(queues.home, async (message) => {
        if (message) {
            console.log(`receive your message: ${message.content.toString()} [${Date.now().toString()}]`);
            addCache({key:queues.home, value:message.content.toString(), expireInHour: 1 });
            channel.ack(message);
        }
    }, { noAck: false });
    
    channel.consume(queues.username, async (message) => {
        if (message?.content) {
            console.log(message?.content.toString());
            const { email, name } = JSON.parse(message.content.toString());
            console.log(email);
            console.log(name);
            await updateUserName(email, name);
            channel.ack(message);
        }
    }, { noAck: false });

    
    channel.consume(queues.password, async (message) => {
        if (message?.content) {
            console.log(message?.content.toString());
            const { email, password } = JSON.parse(message.content.toString());
            console.log(email);
            console.log(password);
            
            await updateUserPassword(email, md5(password).toUpperCase());
            channel.ack(message);
        }
    }, { noAck: false });
}