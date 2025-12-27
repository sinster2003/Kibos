import express from "express";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// centralized error handling middleware
app.use(errorHandler);

export default app;