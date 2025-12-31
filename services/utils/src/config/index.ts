import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const STORAGE = process.env.STORAGE;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const GOOGLE_GMAIL_ID = process.env.GOOGLE_GMAIL_ID;
const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD;

export {
    PORT,
    STORAGE,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    FRONTEND_URL,
    GOOGLE_GMAIL_ID,
    GOOGLE_APP_PASSWORD
}