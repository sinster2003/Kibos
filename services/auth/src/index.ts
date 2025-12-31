import messageBroker from "@kibos/messaging";
import app from "./app.js";
import { PORT } from "./config/index.js";
import CustomError from "./utils/customError.js";
import connectRedis from "./utils/connectRedis.js";

async function startAuthService() {
    try {
        if(!messageBroker) { throw new CustomError(500, "Invalid message broker provider"); }

        await messageBroker.connect(); // connect to the message broker - creates a channel
        await connectRedis();

        app.listen(PORT, () => {
            console.log(`Auth service running on ${PORT} port`)
        });
    }
    catch(error) {
        console.log(error);
        console.error("Failed to start up the auth service.");
        process.exit(1);
    }
}

startAuthService();
