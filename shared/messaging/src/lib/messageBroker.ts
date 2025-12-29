// strategy design pattern

abstract class MessageBrokerStrategy<T> {
    abstract connect(): Promise<void>;
    abstract publish(destination: string, message: T): Promise<void>;
    abstract consume(destination: string, handler: (msg: any) => Promise<void>): Promise<void>;
}

export default MessageBrokerStrategy;

/*
    RabbitMQBroker extends MessageBrokerStrategy
    KafkaBroker extends MessageBrokerStrategy
*/