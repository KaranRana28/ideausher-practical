const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs')
const corsOptions = { origin: process.env.ALLOW_ORIGIN, };
require('dotenv').config();

app.use(cors(corsOptions));

/** Template engine */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

/** API Routes */
const routes = require('./routes/index');
const { redisConnect } = require('./config/redisConnection');
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/** Track time taken by rest api to complete request */
function trackRequestTime(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const elapsed = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${elapsed}ms`);
    });
    next();
}

app.use(trackRequestTime);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', true);
app.use('/api', routes);

app.get('/test', async (req, res) => {
    res.status(200).send("Server running....")
});

let server;
if (process.env.CERT && process.env.KEY) {
    const key = fs.readFileSync(process.env.KEY);
    const cert = fs.readFileSync(process.env.CERT);
    server = https.createServer({ key: key, cert: cert }, app);
} else {
    server = http.createServer(app);
}

/** DB connections are handled here */
require('./config/dbConnection')();

/* Socket events & connections are handled here */
require('./config/socketConnection')(server);

/** Redis connections are handled here */
redisConnect();

server.listen(process.env.PORT, () => {
    console.log("**************************************************");
    console.log(`Server running on port: ${process.env.PORT}`);
    console.log("Environment: ", process.env.ENV);
});