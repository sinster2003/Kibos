import messageBroker from "@kibos/messaging";
import CustomError from "./customError.js";
import { persistUserInDatabase } from "../db/queries/users.js";
import { UserCreatedEvent } from "./types.js";

const startUserConsumer = async () => {
    try {
        const userHandler = async (message: UserCreatedEvent) => {
            if(!message) {
                throw new CustomError(500, "Failed to retrieve the payload in the consumer user service.");
            }

            const { payload } = message;

            if(!payload || !payload.userId || !payload.email || !payload.name || !payload.role) {
                throw new CustomError(500, "Invalid message received from the producer auth service.");
            }

            const isUserPersisted = await persistUserInDatabase(payload);

            if(!isUserPersisted) {
                throw new CustomError(500, "Failed to create user in the users service database");
            }

            console.log("User persisted successfully in the database");
        }

        messageBroker?.consume("auth.user_created", userHandler, true);
    }
    catch(error) {
        console.log(error);
        console.log("Failed to consume the message in the user service");
    }
}

export default startUserConsumer;