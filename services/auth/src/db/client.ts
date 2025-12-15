import { Pool } from "pg";
import { DATABASE_URL } from "../config/index.js";

const pool = new Pool({
    connectionString: DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 2000,
});

export default pool;