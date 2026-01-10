import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

export {
    PORT,
    DATABASE_URL,
    JWT_PUBLIC_KEY
}