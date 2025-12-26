import { pgEnum, pgTable, timestamp, uuid, varchar, text } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["jobseeker", "recruiter"]);

// auth_users table
export const authUsers = pgTable("auth_users", {
    userId: uuid("user_id").primaryKey(),
    name: varchar({ length: 255 }),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }),
    role: roleEnum().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// refresh_tokens table
export const refreshTokens = pgTable("refresh_tokens", {
    id: uuid().primaryKey(),
    userId: uuid("user_id").notNull().references(() => authUsers.userId),
    tokenHash: text("token").notNull().unique(),
    revokedAt: timestamp("revoked_at"),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});