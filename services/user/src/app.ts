import express from "express";
import userRoutes from "./routes/user.js";
import errorHandler from "./middleware/errorHandler.js"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);

app.use(errorHandler);

export default app;