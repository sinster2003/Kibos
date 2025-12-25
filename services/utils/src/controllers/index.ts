import { Request, Response } from "express";
import { STORAGE } from "../config/index.js";
import catchAsync from "../lib/catchAsync.js";
import CustomError from "../lib/customError.js";
import getUploadService from "../lib/uploadServiceFactory.js";

const uploadController = async (req: Request, res: Response) => {
    const { file, previousAssetId } = req.body;

    const uploadServiceProvider = getUploadService(STORAGE ?? "");

    if(!uploadServiceProvider) {
        throw new CustomError(500, "Invalid Storage Provider");
    }

    const { url, assetId } = await uploadServiceProvider.upload({ file, previousAssetId });

    res.status(200).json({
        url,
        assetId,
        message: "Uploaded asset successfully"
    });
}

export default {
    uploadController: catchAsync(uploadController)
}