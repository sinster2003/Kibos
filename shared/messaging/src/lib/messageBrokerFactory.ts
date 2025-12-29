import MessageBrokerStrategy from "./messageBroker.js";
import { RabbitMQBroker } from "./rabbitMQBroker.js";

const messageBrokerFactory = (broker: string): MessageBrokerStrategy<any> | null => {
    switch(broker) {
        case "rabbitmq":
            return new RabbitMQBroker();
        default:
            return null;
    }
}

export default messageBrokerFactory;