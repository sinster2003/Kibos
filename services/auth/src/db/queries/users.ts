import { NewUser, User } from "../../utils/types.js";
import pool from "../client.js"

export const existingUser = async (email: string): Promise<Omit<User, "password"> | null> => {
    try {
        const { rows } = await pool.query(
            `SELECT name, email, phone_no, role FROM users 
            WHERE email=$1`,
            [email]
        );
        return rows[0] ?? null;
    }
    catch(error) {
        console.log(error);
        return null;
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
        return null;
    }
}