ALTER TYPE "public"."role" RENAME TO "user_role";--> statement-breakpoint
ALTER TABLE "users_skills" DROP CONSTRAINT "users_skills_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "users_skills" DROP CONSTRAINT "users_skills_skill_id_skills_skill_id_fk";
--> statement-breakpoint
ALTER TABLE "users_skills" ADD CONSTRAINT "users_skills_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_skills" ADD CONSTRAINT "users_skills_skill_id_skills_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("skill_id") ON DELETE cascade ON UPDATE no action;