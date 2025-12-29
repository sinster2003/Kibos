import dotenv from "dotenv";

dotenv.config();

const MESSAGE_BROKER_PROVIDER = process.env.MESSAGE_BROKER_PROVIDER;
const RABBITMQ_URL = process.env.RABBITMQ_URL;

export {
    MESSAGE_BROKER_PROVIDER,
    RABBITMQ_URL
}