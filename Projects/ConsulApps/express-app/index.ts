import http from "http";
import express from "express";
import bodyParser from "body-parser";
import Consul from "consul";
import * as dotenv from "dotenv";
import { deregisterService, getIPAddress, getServices, registerService } from "./model";
import { hostname, type } from "os";

dotenv.config();
console.log("express app starts");
console.log(process.env.PORT);

const app = express();
const server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());
app.use("/health", (req, res) => {
  res.send('Healthy');
});

server.keepAliveTimeout = 60000;
server.timeout = 60000;
server.headersTimeout = 60000;
server.requestTimeout = 60000;

server.listen(process.env.PORT || 80, async() => {
  console.log(`Server is running on port ${process.env.PORT}`);
  const consul = new Consul({
    host: process.env.CONSUL_HOST,
    port: "8500",
    secure: false,
    promisify: true,
  });
  console.log(process.env.CONSUL_HOST);
  const version = '1.0.0'
  const tags = ['tag1', 'tag2', 'tag3'];
  console.log(type());
  console.log(hostname());
  console.log(getIPAddress());

  await registerService(consul, 'express-app', version, tags, Number(process.env.PORT))
    .then(() => {
      console.log("Service registered");
    })
    .catch((err) => {
      console.log(err);
    });
});
