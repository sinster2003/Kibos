import { Router } from "express";
import utilsControllers from "../controllers/utils.js";

const utilsRouter = Router();

const { uploadController } = utilsControllers;

utilsRouter.post("/upload", uploadController);

export default utilsRouter;