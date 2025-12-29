import amqplib, { Channel, ChannelModel } from "amqplib";
import MessageBrokerStrategy from "./messageBroker.js";
import { RABBITMQ_URL } from "../config/index.js";

/* task queue implementation where the event is published in the queue and consumed */

export class RabbitMQBroker extends MessageBrokerStrategy<string> {
    private conn: ChannelModel | null = null;
    private channel: Channel | null = null;

    async connect() {
        if(this.conn) return;

        try {
            this.conn = await amqplib.connect(RABBITMQ_URL!);
            this.channel = await this.conn?.createChannel();
        }
        catch(error) {
            console.error("Failed to connect message broker.");
            process.exit(1);
        }
    }

    async publish(destination: string, message: string) {
        if(!this.channel) throw new Error("Failed to create message channel.");

        try {
            await this.channel.assertQueue(destination, { durable: true });
            this.channel.sendToQueue(destination, Buffer.from(message), { persistent: true });
        }
        catch(error) {
            console.error("Failed to publish message into queue");
        }
    }

    async consume(destination: string, handler: (msg: any) => Promise<void>) {
        if(!this.channel) throw new Error("Failed to create message channel.");
        
        try {
            await this.channel.assertQueue(destination, { durable: true });
            
            this.channel.consume(destination, async (message) => {
                if(!message) return;

                try {
                    const payload = JSON.parse(message.content.toString());
                    await handler(payload);
                    this.channel?.ack(message);
                }
                catch(error) {
                    console.error("Failed to consume the message.");
                    this.channel?.nack(message, false, false);
                }
            });
        }
        catch(error) {
            console.error("Failed to process the consumption of the message.");
        }
    }
}