import { pgEnum, pgTable, serial, text, timestamp, varchar, integer, primaryKey } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["jobseeker", "recruiter"]);

// users table
export const users = pgTable("users", {
    userId: serial("user_id").primaryKey(),
    name: varchar({ length: 255 }),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }),
    phoneNo: varchar("phone_no", { length: 20 }).unique(),
    role: roleEnum(),
    bio: text(),
    resume: varchar({ length: 255 }),
    resumePublicId: varchar("resume_public_id", { length: 255 }),
    profilePic: varchar("profile_pic", { length: 255 }),
    profilePicId: varchar("profile_pic_id", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    subscription: timestamp()
});

// skills table
export const skills = pgTable("skills", {
    skillId: serial("skill_id").primaryKey(),
    name: varchar({ length: 255 })
});

// users_skills table
export const usersSkills = pgTable(
    "users_skills", 
    {
        userId: integer("user_id").notNull().references(() => users.userId, { onDelete: "cascade" }),
        skillId: integer("skill_id").notNull().references(() => skills.skillId, { onDelete: "cascade" })
    },
    (usersSkillsTable) => [primaryKey({ columns: [usersSkillsTable.userId, usersSkillsTable.skillId] })],
);