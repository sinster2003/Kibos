import { MESSAGE_BROKER_PROVIDER } from "./config/index.js";
import messageBrokerFactory from "./lib/messageBrokerFactory.js";

const messageBroker = messageBrokerFactory(MESSAGE_BROKER_PROVIDER || "");

export default messageBroker;