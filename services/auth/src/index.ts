import app from "./app.js";
import { PORT } from "./config/index.js";

app.listen(PORT, () => {
    console.log(`Auth service running on ${PORT} port`)
});