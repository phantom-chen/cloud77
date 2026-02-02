import express, { NextFunction } from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import cors from 'cors';

const app = express();

app.use(favicon(path.join(__dirname,'www','favicon.ico')))
app.use(express.static(__dirname + "/www/"))

app.use(cors());

// app.use(demoMiddleware);

app.use((req, res, next) => {
    next();
});

app.use('/api', (req, res, next) => {
    next();
});

app.use('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'www', "/index.html"));
    res.send('<p>express service app</p>')
});