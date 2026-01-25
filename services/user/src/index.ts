import messageBroker from "@kibos/messaging";
import app from "./app.js";
import { PORT } from "./config/index.js";
import startUserConsumer from "./utils/consumer.js";
import CustomError from "./utils/customError.js";

const startUserService = async () => {
    try {
        if(!messageBroker) { throw new CustomError(500, "Invalid message broker provider"); }

        await messageBroker.connect(); // connect to the message broker - creates a channel

        await startUserConsumer(); // user service consumes the user creation events

        app.listen(PORT, () => {
            console.log(`User service running at port ${PORT}`);
        });
    }
    catch(error) {
        console.log(error);
        console.log(`Failed to start the user service at PORT ${PORT}`);
        process.exit(1);
    }
}

startUserService();