// configuration for migration tooling

import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/config/index";

console.log(DATABASE_URL);

export default defineConfig({
    out: "./migrations",
    schema: "./src/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: DATABASE_URL!
    }
});