import { DatabaseError } from "pg";
import CustomError from "../../utils/customError.js";
import { UserSkillPayload } from "../../utils/types.js";
import pool from "../client.js"
import { v4 as uuidv4 } from "uuid";

export const addSkillToUser = async({ userId, skill }: Omit<UserSkillPayload, "skillId">) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // EXCLUDED in postgresql represents the existing row which conflicts due to same skill_name
        const { rows } = await client.query(`
            INSERT INTO skills (skill_id, skill_name)
            VALUES ($1, $2)
            ON CONFLICT (skill_name)
            DO UPDATE
            SET skill_name = EXCLUDED.skill_name
            RETURNING skill_id
        `, [uuidv4(), skill]);

        const skillId = rows[0]?.skill_id;

        if (!skillId) {
            throw new CustomError(500, "Failed to create or retrieve skill.");
        }

        await client.query(`
            INSERT INTO users_skills (user_id, skill_id)
            VALUES ($1, $2)
        `, [userId, skillId]);

        await client.query("COMMIT");
    }
    catch(error) {
        console.log(error);

        await client.query("ROLLBACK");

        if(error instanceof DatabaseError) {
            // unique constraint violation error code
            if(error.code === "23505") {
                throw new CustomError(409, "User mapped with this skill record already exists.");
            }

            // foreign constraint violation error code
            if(error.code === "23503") {
                throw new CustomError(400, "Attempt to insert invalid user id or skill id.");
            }
            
            // not null and check constraint error code
            if(error.code === "23502" || error.code === "23514") {
                throw new CustomError(400, "Invalid user data. Please verify all required fields.");
            }
        }

        throw new CustomError(500, "Failed to store the skill in the database");
    }
    finally {
        client.release();
    }
}

export const deleteUserSkillMapping = async ({ userId, skillId }: Omit<UserSkillPayload, "skill">): Promise<Boolean> => {
    try {
        const { rowCount } = await pool.query(`
            DELETE FROM users_skills
            WHERE user_id = $1 AND skill_id = $2
        `, [userId, skillId]);

        return rowCount === 1;
    }
    catch(error) {
        console.log(error);

        if(error instanceof DatabaseError) {
            // foreign constraint violation error code
            if(error.code === "23503") {
                throw new CustomError(400, "Attempt to delete invalid user id or skill id.");
            }
            
            // not null and check constraint error code
            if(error.code === "23502" || error.code === "23514") {
                throw new CustomError(400, "Invalid user data. Please verify all required fields.");
            }
        }

        throw new CustomError(500, "Failed to store the skill in the database");
    }
}