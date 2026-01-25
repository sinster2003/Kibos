import { Request, Response } from "express";
import { STORAGE } from "../config/index.js";
import catchAsync from "../lib/catchAsync.js";
import CustomError from "../lib/customError.js";
import getUploadService from "../lib/uploadServiceFactory.js";
import { ControllerType } from "../types.js";

const uploadController: ControllerType = async (req: Request, res: Response) => {
    const file = req.file;

    if(!file) {
        throw new CustomError(404, "File not found.");
    }

    const previousAssetId = req.headers["x-previous-asset-id"] as string;

    const fileMimetype = JSON.parse(req.headers["x-file-mimetype"] as string);

    if(!fileMimetype.includes(file.mimetype)) {
        throw new CustomError(400, "Invalid File Type.");
    }

    const uploadServiceProvider = getUploadService(STORAGE ?? "");

    if(!uploadServiceProvider) {
        throw new CustomError(500, "Invalid Storage Provider");
    }

    const { url, assetId } = await uploadServiceProvider.upload({ file: file.buffer, previousAssetId });

    res.status(200).json({
        url,
        assetId,
        message: "Uploaded asset successfully"
    });
}

export default {
    uploadController: catchAsync(uploadController)
}