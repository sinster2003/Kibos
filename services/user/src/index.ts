import messageBroker from "@kibos/messaging";
import app from "./app.js";
import { PORT } from "./config/index.js";
import startUserConsumer from "./utils/consumer.js";

const startUserService = async () => {
    try {
        await messageBroker?.connect();
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