import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// Enum
export const WaitlistUserRoles = pgEnum( "waitlist_user_roles", [
  "designer",
  "developer",
  "both",
  "other",
] );

// Waitlist Table
export const WaitlistUserTable = pgTable( "waitlist", {
  id: uuid( "id" ).primaryKey().defaultRandom().notNull(),
  email: varchar( "email", { length: 64 } ).notNull(), // Increased email length
  name: varchar( "name", { length: 32 } ).notNull(),
  role: WaitlistUserRoles( "role" ).notNull(),
  createdAt: timestamp( "created_at" ).notNull().defaultNow(),
  updatedAt: timestamp( "updated_at" ).notNull().defaultNow(),
} );

// Newsletter Preference Table
export const NewsletterPreference = pgTable( "newsletter_preference", {
  id: serial( "id" ).primaryKey(),
  userId: uuid( "user_id" ) // Changed from integer to uuid
    .references( () => WaitlistUserTable.id, { onDelete: "cascade" } )
    .notNull(),
  newsletter: boolean( "newsletter" ).default( false ),
} );

// Relations
export const WaitlistUserRelations = relations( WaitlistUserTable, ( { one } ) => {
  return {
    newsletterPreference: one( NewsletterPreference, {
      fields: [ WaitlistUserTable.id ],
      references: [ NewsletterPreference.userId ],
    } ),
  };
} );

// Types
export type insertWaitlistUser = typeof WaitlistUserTable.$inferInsert;
export type selectWaitlistUser = typeof WaitlistUserTable.$inferSelect;
export type WaitlistUserRoleType = ( typeof WaitlistUserRoles.enumValues )[ number ];
