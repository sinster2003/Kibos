import { Router } from "express";
import utilsControllers from "../controllers/index.js";
import upload from "../lib/upload.js";

const utilsRouter = Router();

const { uploadController } = utilsControllers;

utilsRouter.post("/upload", upload.single("file"), uploadController);

export default utilsRouter;