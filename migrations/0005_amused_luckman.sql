ALTER TABLE "comment" DROP CONSTRAINT "comment_parent_id_comment_id_fk";
--> statement-breakpoint
ALTER TABLE "comment" DROP COLUMN "parent_id";