import { DatabaseError } from "pg";
import CustomError from "../../utils/customError.js";
import pool from "../client.js";
import { UserCreatedPayload } from "../../utils/types.js";

export const persistUserInDatabase = async (payload: UserCreatedPayload): Promise<Boolean> => {
    try {
        const { userId, name, email, role } = payload;

        const { rowCount } = await pool.query(`
            INSERT INTO users (user_id, name, email, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
        `, [userId, name, email, role]);
        
        return rowCount === 1 || rowCount === 0; // when rowCount is 0 it means conflict occurred and user exists - idempotent
    }
    catch(error) {
        console.log(error);

        if(error instanceof DatabaseError) {
            // unique constraint violation error code
            if(error.code === "23505") {
                throw new CustomError(409, "A user with the provided email already exists.");
            }
            
            // not null and check constraint error code
            if(error.code === "23502" || error.code === "23514") {
                throw new CustomError(400, "Invalid user data. Please verify all required fields.");
            }
        }

        throw new CustomError(500, "Failed to create user in users database.");
    }
}