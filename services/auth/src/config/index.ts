import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const NODE_ENV = process.env.NODE_ENV;

export {
    PORT,
    DATABASE_URL,
    JWT_PRIVATE_KEY,
    NODE_ENV
};