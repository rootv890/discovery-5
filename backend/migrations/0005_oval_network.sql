CREATE TYPE "public"."entity_type" AS ENUM('tool', 'collection', 'user', 'platform', 'category', 'vote', 'comment', 'recycle_bin', 'user_tool_bin', 'user_collection_bin');--> statement-breakpoint
CREATE TYPE "public"."tool_approval_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'DRAFT');--> statement-breakpoint
CREATE TABLE "banned_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"banned_at" timestamp DEFAULT now(),
	"banned_reason" text,
	"banned_by" uuid,
	"banned_until" timestamp
);
--> statement-breakpoint
CREATE TABLE "recycle_bin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"entity_id" uuid,
	"deleted_by" uuid,
	"deleted_at" timestamp DEFAULT now(),
	"deleted_reason" text
);
--> statement-breakpoint
CREATE TABLE "user_collection_bin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"collection_id" uuid,
	"deleted_at" timestamp DEFAULT now(),
	"deleted_reason" text
);
--> statement-breakpoint
CREATE TABLE "user_tool_bin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"tool_id" uuid,
	"deleted_at" timestamp DEFAULT now(),
	"deleted_reason" text
);
--> statement-breakpoint
ALTER TABLE "comment" RENAME TO "comments";--> statement-breakpoint
ALTER TABLE "tools" RENAME COLUMN "is_approved" TO "approval_status";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comment_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comment_tool_id_tools_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "votes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "votes_tool_id_tools_id_fk";
--> statement-breakpoint
DROP INDEX "idx_collection_user_id";--> statement-breakpoint
DROP INDEX "idx_tools_name";--> statement-breakpoint
DROP INDEX "idx_tools_approved";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "email" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "banned_users" ADD CONSTRAINT "banned_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banned_users" ADD CONSTRAINT "banned_users_banned_by_users_id_fk" FOREIGN KEY ("banned_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recycle_bin" ADD CONSTRAINT "recycle_bin_entity_id_tools_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recycle_bin" ADD CONSTRAINT "recycle_bin_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_collection_bin" ADD CONSTRAINT "user_collection_bin_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_collection_bin" ADD CONSTRAINT "user_collection_bin_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tool_bin" ADD CONSTRAINT "user_tool_bin_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tool_bin" ADD CONSTRAINT "user_tool_bin_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_collection_user_user_id_name" ON "collections" USING btree ("user_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_tools_approved" ON "tools" USING btree ("approval_status") WHERE "tools"."approval_status" = $1;