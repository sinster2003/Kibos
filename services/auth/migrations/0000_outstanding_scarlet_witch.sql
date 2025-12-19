CREATE TYPE "public"."role" AS ENUM('jobseeker', 'recruiter');--> statement-breakpoint
CREATE TABLE "skills" (
	"skill_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"phone_no" varchar(20),
	"role" "role",
	"bio" text,
	"resume" varchar(255),
	"resume_public_id" varchar(255),
	"profile_pic" varchar(255),
	"profile_pic_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"subscription" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_no_unique" UNIQUE("phone_no")
);
--> statement-breakpoint
CREATE TABLE "users_skills" (
	"user_id" integer NOT NULL,
	"skill_id" integer NOT NULL,
	CONSTRAINT "users_skills_user_id_skill_id_pk" PRIMARY KEY("user_id","skill_id")
);
--> statement-breakpoint
ALTER TABLE "users_skills" ADD CONSTRAINT "users_skills_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_skills" ADD CONSTRAINT "users_skills_skill_id_skills_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("skill_id") ON DELETE no action ON UPDATE no action;