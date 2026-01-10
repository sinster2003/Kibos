import { pgEnum, pgTable, primaryKey, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["jobseeker", "recruiter"]);

export const usersTable = pgTable("users", {
    userId: uuid("user_id").primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: roleEnum().notNull(),
    phoneNo: varchar("phone_no", { length: 20 }).unique(),
    bio: text(),
    resume: varchar({ length: 255 }),
    resumeId: varchar("resume_id", { length: 255 }),
    profilePic: varchar("profile_pic", { length: 255 }),
    profilePicId: varchar("profile_pic_id", { length: 255 }),
    subscription: timestamp()
});

export const skillsTable = pgTable("skills", {
    skillId: uuid("skill_id").primaryKey(),
    skillName: varchar("skill_name", { length: 255 }).notNull().unique(),
});

// junction table to map many to many relationship between users and roles
export const usersSkillsTable = pgTable(
    "users_skills", 
    {
        userId: uuid("user_id").notNull().references(() => usersTable.userId),
        skillId: uuid("skill_id").notNull().references(() => skillsTable.skillId)
    },
    (usersSkillsTable) => [primaryKey({ columns: [usersSkillsTable.userId, usersSkillsTable.skillId] })]
);