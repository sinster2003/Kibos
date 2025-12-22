import { Pool } from "pg";
import { DATABASE_URL } from "../config/index.js";

const pool = new Pool({
    connectionString: DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 10000,
});

export default pool;