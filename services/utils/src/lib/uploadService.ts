// strategy for uploading assets

import cloudinary from "../config/cloudinary.js";
import { UploadPayload, UploadResult } from "../types.js";

export abstract class UploadServiceStrategy {
    abstract upload(payload: UploadPayload): Promise<UploadResult>;
}

export class CloudinaryUploader extends UploadServiceStrategy {
    async upload({ file, previousAssetId }: UploadPayload): Promise<UploadResult> {
        // upload the asset
        const { secure_url, public_id } = await cloudinary.uploader.upload(file as string);
        
        // if an older asset is present in cloudinary delete the older asset
        if(previousAssetId) {
            await cloudinary.uploader.destroy(previousAssetId);
        }

        return {
            url: secure_url,
            assetId: public_id
        };
    }
}

/*
class S3Uploader extends UploadServiceStrategy {

}
*/