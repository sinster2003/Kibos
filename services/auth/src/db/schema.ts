import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["jobseeker", "recruiter"]);

// auth_users table
export const auth_users = pgTable("auth_users", {
    userId: uuid("user_id").primaryKey(),
    name: varchar({ length: 255 }),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }),
    role: roleEnum().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});