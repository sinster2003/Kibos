import http from "http";
import { UPLOAD_SERVICE_HOSTNAME, UPLOAD_SERVICE_PORT } from "../config/index.js";
import { Request } from "express";
import { UploadResult } from "./types.js";
import CustomError from "./customError.js";

const uploadProxy = (
    req: Request,
    allowedMimeTypes: string[],
    previousAssetId: string
): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
        const uploadReq = http.request({
            hostname: UPLOAD_SERVICE_HOSTNAME!,
            port: UPLOAD_SERVICE_PORT!,
            path: "/api/utils/upload",
            method: "POST",
            headers: {
                ...req.headers,
                "x-file-mimetype": JSON.stringify(allowedMimeTypes),
                "x-previous-asset-id": previousAssetId
            }
        }, 
        (uploadRes) => {
            let body = "";

            uploadRes.on("data", (chunk) => {
                body += chunk.toString();
            });

            uploadRes.on("end", async () => {
                try {
                    const parsedBody = JSON.parse(body); // { url, assetId }

                    if(uploadRes.statusCode && uploadRes.statusCode >= 400) {
                        reject(new CustomError(uploadRes.statusCode, parsedBody.message ?? "Invalid File Type."));
                    }

                    resolve(parsedBody);
                }
                catch(error) {
                    reject(new CustomError(500, "Failed to upload the file."));
                }
            });
        });

        uploadReq.on("error", (error: CustomError) => {
            reject(new CustomError(error.statusCode ?? 500, error.message));
        });

        req.pipe(uploadReq);
    });
}

export default uploadProxy;