import express from "express";
import utilsRouter from "./routes/utils.js";

const app = express();

app.use(express.json({ limit: "50mb" })); // recieving buffer
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/utils", utilsRouter);

export default app;