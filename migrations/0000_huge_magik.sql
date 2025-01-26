CREATE TYPE "public"."waitlist_user_roles" AS ENUM('designer', 'developer', 'both', 'other');--> statement-breakpoint
CREATE TABLE "newsletter_preference" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"newsletter" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(32) NOT NULL,
	"name" varchar(32) NOT NULL,
	"role" "waitlist_user_roles" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "newsletter_preference" ADD CONSTRAINT "newsletter_preference_user_id_waitlist_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."waitlist"("id") ON DELETE cascade ON UPDATE no action;