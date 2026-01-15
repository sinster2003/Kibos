import multer, { memoryStorage } from "multer";
import CustomError from "../utils/customError.js";

const upload = (allowedMimeTypes: string[]) => {
    return multer({
        storage: memoryStorage(),
        limits: {
            fileSize: 1 * 1024 * 1024
        },
        fileFilter: (req, file, cb) => {
            if(!allowedMimeTypes.includes(file.mimetype)) {
                return cb(new CustomError(400, "Invalid file type."));
            }

            cb(null, true);
        }
    });
}

export default upload;