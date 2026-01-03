import amqplib, { Channel, ChannelModel } from "amqplib";
import MessageBrokerStrategy from "./messageBroker.js";
import { RABBITMQ_URL } from "../config/index.js";

/* task queue implementation where the event is published in the queue and consumed */

export class RabbitMQBroker extends MessageBrokerStrategy<string> {
    /* 
        in future separate channel for publishing and consuming can be created 
        when a service will be do both the actions - currently auth only publishes and utils only consumes
    */
   
    private conn: ChannelModel | null = null;
    private channel: Channel | null = null;
    private MAX_RETRIES: number = 5;

    async connect() {
        if(this.conn) return;

        try {
            this.conn = await amqplib.connect(RABBITMQ_URL!);
            this.channel = await this.conn?.createChannel();
        }
        catch(error) {
            console.log(error);
            console.error("Failed to connect message broker.");
            process.exit(1);
        }
    }

    async publish(destination: string, message: string) {
        if(!this.channel) throw new Error("Failed to create message channel.");

        try {
            this.channel.sendToQueue(destination, Buffer.from(message), { persistent: true });
        }
        catch(error) {
            console.log(error);
            console.error("Failed to publish message into queue");
        }
    }

    async consume(destination: string, handler: (msg: any) => Promise<void>, retryEnabled: boolean = false) {
        if(!this.channel) throw new Error("Failed to create message channel.");
        
        try {
            retryEnabled && await this.setUpFailureMechanism(destination);

            // delivering one unacked message at a time to the consumer
            await this.channel.prefetch(1);

            await this.channel.assertQueue(destination,
                {
                    durable: true,
                    arguments: retryEnabled ? {
                        "x-dead-letter-exchange": `${destination}.dead_letter_exchange`,
                        "x-dead-letter-routing-key": "retry"
                    } : {}
                }
            );
            
            this.channel.consume(destination, async (message) => {
                if(!message) return;

                try {
                    const payload = JSON.parse(message.content.toString());
                    await handler(payload);
                    this.channel?.ack(message);
                }
                catch(error) {
                    if(!retryEnabled) {
                        this.channel?.ack(message); // intentional for no retries needed events
                        return;
                    }

                    // risk of losing messages when user_created event or retry needed events - so retries are must
                    // retry must be limited to certain attempts with base delay

                    const xDeaths = message.properties.headers?.["x-death"] || [];
                    const rejectsCount = xDeaths?.find(d => d.queue === destination && d.reason === "rejected")?.count || 0;

                    if(rejectsCount >= this.MAX_RETRIES) {
                        // send it to dead letter queue
                        this.channel?.publish(`${destination}.dead_letter_exchange`, "dead", message.content, {
                            persistent: true,
                            headers: message.properties.headers
                        });
                        this.channel?.ack(message);
                        return;
                    }

                    console.log(error);

                    console.error(
                        `Message sent to DLX after ${rejectsCount} retries`,
                        message.content.toString()
                    );

                    this.channel?.nack(message, false, false);
                }
            });
        }
        catch(error) {
            console.log(error);
            console.error("Failed to process the consumption of the message.");
        }
    }

    private async setUpFailureMechanism(queue: string) {
        const DLX = `${queue}.dead_letter_exchange`;
        const retryQueue = `${queue}.retry_queue`;
        const DLQ = `${queue}.dead_letter_queue`;

        await this.channel?.assertExchange(DLX, "direct", { durable: true });

        /* 
            the message in the retry queue after expiry of 10s
            it moves into original queue for retry based on routing key (destination)
        */

        await this.channel?.assertQueue(retryQueue, {
            durable: true,
            arguments: {
                "x-dead-letter-exchange": "",
                "x-dead-letter-routing-key": queue,
                "x-message-ttl": 10000
            }
        });

        await this.channel?.assertQueue(DLQ, {
            durable: true
        });
        
        await this.channel?.bindQueue(retryQueue, DLX, "retry");
        await this.channel?.bindQueue(DLQ, DLX, "dead");
    }
}