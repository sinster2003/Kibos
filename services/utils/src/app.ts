import express from "express";
import utilsRouter from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json({ limit: "50mb" })); // recieving buffer
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/utils", utilsRouter);

// centralizing the error handling
app.use(errorHandler);

export default app;