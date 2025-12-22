import express from "express";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

// centralized error handling middleware
app.use(errorHandler);

export default app;