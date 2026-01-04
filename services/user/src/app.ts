import express from "express";
import userRoutes from "./routes/user.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);

app.use(errorHandler);

export default app;