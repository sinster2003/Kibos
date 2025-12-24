import { NextFunction, Request, Response } from "express";

interface UploadPayload {
    file: string | Buffer;
    previousAssetId?: string;
}

interface UploadResult {
    url: string;
    assetId: string;
}

enum StorageProvider {
    cloudinary = "cloudinary",
}

type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export {
    UploadPayload,
    UploadResult,
    StorageProvider,
    ControllerType
}