import { DatabaseError } from "pg";
import { RefreshToken } from "../../utils/types.js";
import pool from "../client.js";
import CustomError from "../../utils/customError.js";

export const storeRefreshToken = async ({ id, userId, tokenHash, expiresAt }: RefreshToken) => {
    try {
        console.log(id, userId, tokenHash, expiresAt);
        
        const { rows } = await pool.query(`
           INSERT INTO refresh_tokens (id, user_id, token, expires_at)
           VALUES ($1, $2, $3, $4) RETURNING
           id, token, expires_at
        `, [id, userId, tokenHash, expiresAt]);

        return rows[0] ?? null;
    }
    catch(error) {
        console.log(error);

        if(error instanceof DatabaseError) {
            // foreign key constraint violation error code
            if(error.code === "23503") {
                throw new CustomError(400, "Foreign key constraint violated. Ensure valid userId inserted.");
            }

            // not null and check constraint error code
            if(error.code === "23502" || error.code === "23514") {
                throw new CustomError(400, "Invalid token data. Ensure no missing fields.");
            }
        }

        throw new CustomError(500, "Failed to create refresh token in database.")
    }
}