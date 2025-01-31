CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'USER', 'CURATOR');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'USER';