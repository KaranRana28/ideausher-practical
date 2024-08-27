const redis = require("redis");

const redisConnect = async () => {
    return new Promise((resolve) => {
        rClient = redis.createClient(process.env.REDIS_CONNECTION_URL);

        rClient.on("error", function (error) {
            console.error("Redis Client error : ", error);
        });

        rClient.on("ready", function () {
            console.log("Redis Client connected ", new Date());
            resolve();
        });
    });
}

module.exports = {
    redisConnect: redisConnect
}