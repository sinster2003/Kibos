import { DatabaseError } from "pg";
import CustomError from "../../utils/customError.js";
import { NewUser, User } from "../../utils/types.js";
import pool from "../client.js"

export const findExistingUserByEmail = async (email: string): Promise<boolean> => {
    try {
        const { rowCount } = await pool.query(
            `SELECT 1 FROM users WHERE email=$1`,
            [email]
        );

        return rowCount ? rowCount > 0 : false;
    }
    catch(error) {
        console.log(error);
        throw new CustomError(500, "Failed to retrieve user from database.");
    }
}

export const createUser = async ({ name, email, password, phoneNo, role }: NewUser): Promise<Omit<User, "password"> | null> => {
    try {
        const { rows } = await pool.query(
            `INSERT INTO users (name, email, password, phone_no, role) 
            VALUES ($1, $2, $3, $4, $5) RETURNING
            user_id, name, email, phone_no, role, created_at`,
            [name, email, password, phoneNo, role]
        );
        
        return rows[0] ?? null;
    }
    catch(error) {
        console.log(error);

        if(error instanceof DatabaseError) {
            if(error.code === "23505") {
                throw new CustomError(409, "A user with the provided email or phone number already exists.");
            }

            if(error.code === "23502" || error.code === "23514") {
                throw new CustomError(400, "Invalid user data. Please verify all required fields.");
            }
        }

        throw new CustomError(500, "Failed to create user in database.");
    }
}