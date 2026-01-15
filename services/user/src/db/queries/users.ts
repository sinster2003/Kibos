import { DatabaseError } from "pg";
import CustomError from "../../utils/customError.js";
import pool from "../client.js";
import { RetrievedUserFromDatabase, UserCreatedPayload } from "../../utils/types.js";

export const fetchUserById = async (userId: string): Promise<RetrievedUserFromDatabase | null> => {
    try {
        const { rows } = await pool.query(`
            SELECT * FROM users
            WHERE user_id = $1
        `, [userId]);

        return rows[0] ?? null;
    }
    catch(error) {
        console.log(error);
        throw new CustomError(500, "Failed to retrieve user from database");
    }
}

export const fetchResumeIdByUserId = async (userId: string): Promise<{ resume_id: string } | null> => {
    try {
        const { rows } = await pool.query(`
            SELECT resume_id FROM users
            WHERE user_id = $1
        `, [userId]);

        return rows[0] ?? null;
    }
    catch(error) {
        console.log(error);
        throw new CustomError(500, "Failed to retrieve resume id from database");
    }
}

export const fetchAvatarIdByUserId = async (userId: string): Promise<{ profile_pic_id: string } | null> => {
    try {
        const { rows } = await pool.query(`
            SELECT profile_pic_id FROM users
            WHERE user_id = $1
        `, [userId]);

        return rows[0] ?? null;
    }
    catch(error) {
        console.log(error);
        throw new CustomError(500, "Failed to retrieve avatar id from database");
    }
}

export const updateUserByUserId = async (userId: string, query: string, dataToUpdate: string[]): Promise<Boolean> => {
    try {
        const { rowCount } = await pool.query(`
            UPDATE users
            SET ${query}
            WHERE user_id = $1
        `, [userId, ...dataToUpdate]);

        return rowCount === 1;
    }
    catch(error) {
        console.log(error);

        if(error instanceof DatabaseError) {
            // unique constraint violation error code
            if(error.code === "23505") {
                throw new CustomError(409, "Invalid duplicate entry.");
            }
            
            // not null and check constraint error code
            if(error.code === "23502" || error.code === "23514") {
                throw new CustomError(400, "Invalid user data. Please verify all required fields.");
            }
        }

        throw new CustomError(500, "Failed to update user profile in database.");
    }
}

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