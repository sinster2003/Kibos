// strategy for uploading assets

import cloudinary from "../config/cloudinary.js";
import { UploadPayload, UploadResult } from "../types.js";
import CustomError from "./customError.js";

export abstract class UploadServiceStrategy {
    abstract upload(payload: UploadPayload): Promise<UploadResult>;
}

export class CloudinaryUploader extends UploadServiceStrategy {
    async upload({ file, previousAssetId }: UploadPayload): Promise<UploadResult> {                
        // buffer of the file sent from the service
        const result = await new Promise<{ url: string, assetId: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { 
                    folder: "kibos"
                },
                (error, result) => {
                    if(error) {
                        reject(new CustomError(500, error.message));
                    }

                    resolve({
                        url: result?.secure_url || "",
                        assetId: result?.public_id || ""
                    });
                }
            );

            stream.end(file);
        });
        
        // if an older asset is present in cloudinary delete the older asset
        if(previousAssetId) {
            await cloudinary.uploader.destroy(previousAssetId);
        }

        return result;
    }
}

/*
class S3Uploader extends UploadServiceStrategy {

}
*/