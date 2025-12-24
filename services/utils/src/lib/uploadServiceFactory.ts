import { StorageProvider } from "../types.js";
import { CloudinaryUploader, UploadServiceStrategy } from "./uploadService.js";

function getUploadService(provider: string): UploadServiceStrategy | null {
    switch(provider) {
        case StorageProvider.cloudinary:
            return new CloudinaryUploader();
        default:
            return null;
    }
}

export default getUploadService;