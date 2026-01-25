import multer, { memoryStorage } from "multer";

const upload = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: 1 * 1024 * 1024 // 1 MB is max
    }
});

export default upload;