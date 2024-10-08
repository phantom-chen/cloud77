import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import fileUpload from "express-fileupload";
import http from "http";
import route from '../routes';

export async function createAppServer(options: {
    port: string
}): Promise<http.Server> {
    const app = express();
    const server = http.createServer(app);

    // const settings = await getSocketSettings();
    // const io = new Server(server, {
    //     path: settings.path,
    //     cors: {
    //         origin: settings.origin
    //     }
    // });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.use(bodyParser.raw());
    // app.use(cors());
    // app.use(favicon(path.join(__dirname,'www','Ferrari.ico')))
    // app.use(express.static(__dirname + "/www/"))
    app.use(fileUpload());

    // app.use(demoMiddleware);
    // app.use((req, res, next) => {
    //     next();
    // });

    // app.use('/api', (req, res, next) => {
    //     next();
    // });

    app.use("/api", route);
    // app.use("/api", AuthCheck, route);
    app.use('/', (req, res) => {
        // res.sendFile(path.join(__dirname, 'www', "/index.html"));
        res.send('<p>cantenn app</p>')
    });
    // global error middleware
    app.use((req, res, next) => {
        try {
            next();
        } catch (error) {
            res.status(500).send({
                code: 'internal-server-error',
                id: '',
                message: (error as Error).message
            })        
        }
    })

    server.keepAliveTimeout = 60000
    server.timeout = 60000
    server.headersTimeout = 60000
    server.requestTimeout = 60000
    server.on('connection', (socket) => {
        const start = Date.now();
        
        socket.on('close', () => {
            console.log(`[socket-closed] socket closed`, {
                spend_time: Date.now() - start,
            });
        });
    
        socket.once('error', err => {
            console.log(`[socket-error], ${err.message}`, {
                error: err,
            });
        });
    });
    
    server.on('clientError', (err, socket) => {
        console.log(`[client-error] ${err.message}`, {
            error: err,
        });
    });
    return server;
}
