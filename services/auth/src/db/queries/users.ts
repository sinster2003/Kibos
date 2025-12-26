import { DatabaseError } from "pg";
import CustomError from "../../utils/customError.js";
import { NewUser, ExistingUser, UserWithPassword } from "../../utils/types.js";
import pool from "../client.js"

export const isExistingUserByEmail = async (email: string): Promise<boolean> => {
    try {
        const { rowCount } = await pool.query(
            `SELECT 1 FROM auth_users WHERE email=$1`,
            [email]
        );

        return rowCount ? rowCount > 0 : false;
    }
    catch(error) {
        console.log(error);
        throw new CustomError(500, "Failed to retrieve user from database.");
    }
}

export const findUserByEmail = async (email: string): Promise<UserWithPassword | null> => {
    try {
        const { rows } = await pool.query(
            `SELECT user_id, email, password, role FROM auth_users WHERE email=$1`,
            [email]
        );

        return rows[0] ?? null;
    }
    catch(error) {
        console.log(error);
        throw new CustomError(500, "Failed to retrieve user from database.");
    }
}

export const createUser = async ({ userId, name, email, password, role }: NewUser): Promise<ExistingUser | null> => {
    try {
        const { rows } = await pool.query(
            `INSERT INTO auth_users (user_id, name, email, password, role) 
            VALUES ($1, $2, $3, $4, $5) RETURNING
            user_id, name, email, role, created_at`,
            [userId, name, email, password, role]
        );
        
        return rows[0] ?? null;
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

        throw new CustomError(500, "Failed to create user in database.");
    }
}