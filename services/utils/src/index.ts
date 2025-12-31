import app from "./app.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { PORT, STORAGE } from "./config/index.js";
import { StorageProvider } from "./types.js";
import messageBroker from "@kibos/messaging";
import CustomError from "./lib/customError.js";
import startSendMailConsumer from "./lib/consumer.js";

(STORAGE === StorageProvider.cloudinary) && configureCloudinary();

async function startUtilsService() {
    try {
        if(!messageBroker) { throw new CustomError(500, "Invalid message broker provider"); }

        await messageBroker.connect(); // connect to the message broker

        startSendMailConsumer(); // register the consumer

        app.listen(PORT, () => {
            console.log(`Utils service running on ${PORT} port`);
        });
    }
    catch(error) {
        console.log(error);
        (error instanceof CustomError) && console.error(error.message);
        console.error("Failed to connect with the message broker.");
        process.exit(1);
    }
}

startUtilsService();