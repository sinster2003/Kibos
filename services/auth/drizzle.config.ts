// configuration for migration tooling

import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/config/index.js";

export default defineConfig({
    out: "./migrations",
    schema: "./src/db/schema",
    dialect: "postgresql",
    dbCredentials: {
        url: DATABASE_URL!
    }
});