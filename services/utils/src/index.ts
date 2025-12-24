import app from "./app.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { PORT, STORAGE } from "./config/index.js";
import { StorageProvider } from "./types.js";

(STORAGE === StorageProvider.cloudinary) && configureCloudinary();

app.listen(PORT, () => {
    console.log(`Utils service running on ${PORT} port`)
});