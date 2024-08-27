const { Server } = require("socket.io");
const socketAPIService = require("../services/socket");
const { createAdapter } = require("@socket.io/redis-adapter");
const jwt = require('jsonwebtoken');
const User = require("../model/user");
const ioRedis = require("ioredis");
const url = require("url");

module.exports = (server) => {

    io = new Server(server, {
        transports: ["websocket", "polling", "xhr-polling", "flashsocket"],
        pingInterval: 25000,
        pingTimeout: 30000,
        reconnection: true,
        cors: true,
        origins: ["*"],
    });

    const { hostname = "", auth = "", port = "", dbNumber = 0 } = url.parse(process.env.REDIS_CONNECTION_URL);

    const pubsub = {
        host: hostname ?? "",
        port: port ?? 6379,
        password: auth ?? "",
        db: dbNumber ?? 0
    }

    let pubClient = new ioRedis(pubsub)
    let subClient = new ioRedis(pubsub)

    io.adapter(createAdapter(pubClient, subClient))

    io.on("connection", async (client) => {
        try {
            console.log("socket connection started :::: ")
            socketConnected = true;
            client.connectedType = "SOCKET";

            if (client.handshake.auth?.token || client.handshake.headers?.token) {

                let token = client.handshake?.auth?.token ? client.handshake?.auth?.token : client.handshake?.headers?.token;

                jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
                    if (err) { return new Error("Socket Authentication error"); }
                    client.user = decoded;
                });

                await User.findOneAndUpdate({ _id: client?.user?.id }, { $set: { socketId: client?.id } })
                client.join(client?.user?.id?.toString());
            }

            console.log("Socket Client Connected Successfully: ", client.id);

            let socketInfo = getSocketInfo(client);
            client.ip = socketInfo.ip;
            client.lastActiveAt = new Date();
            client.userAgent = socketInfo.agent;

        }
        catch (error) {
            console.log("Socket connection error :::: ", JSON.stringify(error));
            return new Error("Socket connection error", JSON.stringify(error));
        }

        client.on("request", async (message) => {
            try {
                await socketAPIService("SOCKET", message, client);
            } catch (error) {
                console.log("Error in request event:", error);
            }
        });

        client.on("error", function (error) {
            socketConnected = false;
            console.log("Socket Client error:", error);
        });

        client.on("disconnect", async (reason) => {
            rClient.srem(`USERID:${client?.user?.id}`, client?.id);
            console.log("Client disconnected:", reason)
            console.log("Socket Client Connected Successfully: ", client.id);
        });
    });
}

function getSocketInfo(socket) {
    try {

        let reqHeaders = socket.request && socket.request.headers ? socket.request.headers : {};
        let forwardedIP = reqHeaders['x-forwarded-for'] ? reqHeaders['x-forwarded-for'] : '';
        let handshakeIP = socket.handshake && socket.handshake.address ? socket.handshake.address : ''
        forwardedIP = forwardedIP ? forwardedIP.replace("::ffff:", "") : forwardedIP;
        handshakeIP = handshakeIP ? handshakeIP.replace("::ffff:", "") : handshakeIP;

        let agent = reqHeaders['user-agent'] ? reqHeaders['user-agent'] : '';

        let ip = forwardedIP ? forwardedIP : handshakeIP ? handshakeIP : ''

        return { forwardedIP, handshakeIP, agent, ip }
    } catch (e) {
        console.log("getSocketInfo : excepion : ", e);
        return { forwardedIP: '', handshakeIP: '', agent: '', ip: '' }
    }
}