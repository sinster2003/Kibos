import { createClient } from "redis";
import { REDIS_URL } from "../config/index.js";

export const redisClient = createClient({
    url: REDIS_URL
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    }
    catch(error) {
        console.log(error);
        throw new Error("Failed to connect to redis server");
    }
}

export default connectRedis;