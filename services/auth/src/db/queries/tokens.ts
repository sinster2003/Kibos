import { DatabaseError } from "pg";
import { RefreshToken, RetrievedRefreshToken } from "../../utils/types.js";
import pool from "../client.js";
import CustomError from "../../utils/customError.js";

export const storeRefreshToken = async ({ id, userId, tokenHash, expiresAt }: RefreshToken) => {
    try {
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

export const getRefreshToken = async (tokenHash: string): Promise<RetrievedRefreshToken & { role: "jobseeker" | "recruiter" } | null> => {
    try {
        const { rows } = await pool.query(
            `
                SELECT refresh_tokens.*, auth_users.role
                FROM refresh_tokens 
                JOIN auth_users ON
                refresh_tokens.user_id = auth_users.user_id
                WHERE token = $1
            `
        , [tokenHash]);

        return rows[0] ?? null;
    }
    catch(error) {
        console.log(error);
        throw new CustomError(500, "Failed to retrieve the refresh token from database.");
    }
}

export const revokeRefreshToken = async (tokenHash: string): Promise<boolean> => {
    try {
        // revoke the older refresh token
        const { rowCount } = await pool.query(
            `
                UPDATE refresh_tokens
                SET revoked_at = $1
                WHERE token = $2
            `
        , [new Date(), tokenHash]);

        return rowCount === 1;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}

export const rotateRefreshToken = async ({ id, userId, rotatedRefreshTokenHash, expiresAt, tokenHash}: RefreshToken & { rotatedRefreshTokenHash: string }) => {
    const client = await pool.connect();
    
    try {
        await client.query("BEGIN");
        
        await client.query(
            `
                UPDATE refresh_tokens
                SET revoked_at = $1
                WHERE token = $2
            `
        , [new Date(), tokenHash]);

        const { rows } = await client.query(`
           INSERT INTO refresh_tokens (id, user_id, token, expires_at)
           VALUES ($1, $2, $3, $4) RETURNING
           id, token, expires_at
        `, [id, userId, rotatedRefreshTokenHash, expiresAt]);

        await client.query("COMMIT");

        return rows[0] ?? null;
    }
    catch(error) {
        console.log(error);
        await client.query("ROLLBACK");
        throw new CustomError(500, "Failed to rotate refresh token.");
    }
    finally {
        client.release();
    }
}