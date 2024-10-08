import bodyParser from 'body-parser';
import express from 'express';
import { Request, Response } from "express";
import * as dotenv from 'dotenv';
import { connectQueue, consumeMessages, queues } from './servers/consumer';
import { getQueueConnection } from './models/settings';

dotenv.config();

let isServer = false;

process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
    if (!isServer && val === 'server') {
        isServer = true;
    }
});

function getHome(req: Request, res: Response) {
    res.send('Hello Express!');
}

if (isServer) {
    // server
    const app = express();
    const PORT = process.env.PORT || 8000;
    app.use(bodyParser.json());
    app.use('', getHome);
    app.listen(PORT, async () => {
        console.log(__dirname);
        console.log(`message queue server works, running at ${PORT}`);        
        await consumeMessages();
    })
} else {
    // client
    console.log("message queue client works");
    // connectQueue(connectionString).then(channel => {
    //     channel.sendToQueue(queues.home, Buffer.from('hello'));
    // });
    // connectQueue(connectionString).then(channel => {
    //     const payload = {'email':'164151808@qq.com','name':'test003'}
    //     channel.sendToQueue(queues.username, Buffer.from(JSON.stringify(payload)));
    // });
    const connectionString = getQueueConnection();
    connectQueue(connectionString).then(channel => {
        const payload = {'email':'164151808@qq.com','password':'123456'}
        channel.sendToQueue(queues.password, Buffer.from(JSON.stringify(payload)));
        channel.close();
    });
}