import { relations } from "drizzle-orm";
import { boolean, jsonb, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const waitlistUserRolesEnum = pgEnum( "waitlist_user_roles", [
  "designer",
  "developer",
  "both",
  "other",
] );

// Waitlist Table
export const waitlistUserTable = pgTable( "waitlist", {
  id: uuid( "id" ).primaryKey().defaultRandom().notNull(),
  email: varchar( "email", { length: 64 } ).notNull(), // Increased email length
  name: varchar( "name", { length: 32 } ).notNull(),
  role: waitlistUserRolesEnum( "role" ).notNull(),
  createdAt: timestamp( "created_at" ).notNull().defaultNow(),
  updatedAt: timestamp( "updated_at" ).notNull().defaultNow(),
} );

// Newsletter Preference Table
export const newsletterPreference = pgTable( "newsletter_preference", {
  id: serial( "id" ).primaryKey(),
  userId: uuid( "user_id" ) // Changed from integer to uuid
    .references( () => waitlistUserTable.id, { onDelete: "cascade" } )
    .notNull(),
  newsletter: boolean( "newsletter" ).default( false ),
} );

// Relations
export const waitlistUserRelations = relations( waitlistUserTable, ( { one } ) => {
  return {
    newsletterPreference: one( newsletterPreference, {
      fields: [ waitlistUserTable.id ],
      references: [ newsletterPreference.userId ],
    } ),
  };
} );

// Types
export type insertWaitlistUser = typeof waitlistUserTable.$inferInsert;
export type selectWaitlistUser = typeof waitlistUserTable.$inferSelect;
export type WaitlistUserRoleType = ( typeof waitlistUserRolesEnum.enumValues )[ number ];

// Main Tables

/* enums */
export const genders = pgEnum( "gender", [
  "male",
  "female",
  "other",
  "prefer_not_to_say"
] );

// Users Table
export const users = pgTable( "users", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  name: varchar( "name", { length: 256 } ).notNull(),
  username: varchar( "username", { length: 256 } ).notNull().unique(),
  email: varchar( "email", { length: 256 } ).notNull().unique(),
  avatarUrl: text( "avatar_url" ),
  bio: text( "bio" ),
  gender: genders( "gender" ).default( 'prefer_not_to_say' ),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
} );

// Platforms table
export const platforms = pgTable( "platforms", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  name: varchar( "name", { length: 256 } ).notNull().unique(),
  description: text( "description" ),
  imageUrl: text( "image_url" ),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
} );


// Categories table
export const categories = pgTable( "categories", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  name: varchar( "name", { length: 256 } ).notNull().unique(),
  description: text( "description" ),
  imageUrl: text( "image_url" ).notNull(),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
} );


// Tool table
export const tools = pgTable( "tools", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  name: varchar( "name", { length: 256 } ).notNull().unique(),
  description: text( "description" ),
  imageUrl: text( "image_url" ).notNull(),
  thumbnailUrls: jsonb( "thumbnail_urls" ),
  isApproved: boolean( "is_approved" ).default( false ),
  isNew: boolean( "is_new" ).default( false ),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
} );


// Custom user Tool Collection
export const collections = pgTable( "collections", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  name: varchar( "name", { length: 256 } ).notNull().unique(),
  userId: uuid( "user_id" )
    .references( () => users.id, { onDelete: "cascade" } )
    .notNull(),
  description: text( "description" ),
  images: jsonb( "images" ),
  isPublic: boolean( "is_public" ).default( false ),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
} );

// Votes Table
export const voteTypeEnum = pgEnum( "vote_type", [
  "UPVOTE",
  "DOWNVOTE",
  "NONE"
] );


export const votes = pgTable( "votes", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  userId: uuid( "user_id" )
    .references( () => users.id, { onDelete: "no action" } )
    .notNull(),
  toolId: uuid( "tool_id" )
    .references( () => tools.id, { onDelete: "cascade" } )
    .notNull(),
  voteType: voteTypeEnum( "vote_type" ).default( "NONE" ),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
},
  ( t ) => {
    return [
      uniqueIndex( "user_tool_vote" ).on( t.userId, t.toolId ), // One vote per user per tool
    ];
  }
);

export const comments = pgTable( "comment", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  userId: uuid( "user_id" )
    .references( () => users.id, { onDelete: "cascade" } )
    .notNull(),
  toolId: uuid( "tool_id" )
    .references( () => tools.id, { onDelete: "cascade" } )
    .notNull(),
  content: text( "content" ).notNull(),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
} );


export const tags = pgTable( "tags", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  name: varchar( "name", { length: 256 } ).notNull().unique(),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
} );

// Tool-Tags -> Many-to-Many
export const toolTags = pgTable( "tool_tags", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  toolId: uuid( "tool_id" )
    .references( () => tools.id, { onDelete: "cascade" } )
    .notNull(),
  tagId: uuid( "tag_id" ).references( () => tags.id, { onDelete: "cascade" } ),
  createdAt: timestamp( 'created_at' ).defaultNow(),
  updatedAt: timestamp( 'updated_at' ).defaultNow(),
}, ( t ) => [
  /**
  * - ✅ Tool1 + TagA
    - ✅ Tool1 + TagB
    - ✅ Tool2 + TagA
    - ❌ Tool1 + TagA (duplicate - will be rejected by database)
  */
  uniqueIndex( 'tool_tag_unique' ).on( t.toolId, t.tagId ),
]
);
// CollectionTools  -> Many-to-Many
export const collectionTools = pgTable( 'collection_tools', {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  collectionId: uuid( 'collection_id' ).references( () => collections.id, { onDelete: 'cascade' } ),
  toolId: uuid( "tool_id" )
    .references( () => tools.id, { onDelete: "cascade" } )
    .notNull(),
  createdAt: timestamp( 'created_at' ).defaultNow(),
  updatedAt: timestamp( 'updated_at' ).defaultNow(),

}, ( t ) => [
  uniqueIndex( "collectionTools" ).on( t.collectionId, t.toolId )
] );


/**
 * ToolCategoryPlatform (Bridge Tools -> Categories -> Platforms)
 * id (UUID, PK) - Unique ID
 * tool_id (UUID, FK) - References Tools
 * platform_id (UUID, FK) - References Platforms
 * category_id (UUID, FK) - References Categories
 */

export const toolCategoryPlatform = pgTable( 'tool_category_platform', {
  id: uuid( "id" ).primaryKey().defaultRandom(),

  toolId: uuid( "tool_id" )
    .references( () => tools.id, { onDelete: "cascade" } )
    .notNull(),

  categoryId: uuid( "category_id" )
    .references( () => categories.id, { onDelete: "cascade" } )
    .notNull(),

  platformId: uuid( "platform_id" )
    .references( () => platforms.id, { onDelete: "cascade" } )
    .notNull(),
  createdAt: timestamp( 'created_at' ).defaultNow(),
  updatedAt: timestamp( 'updated_at' ).defaultNow(),
},
  /**
    ✅ Figma (Tool) + UI Design (Category) + Web (Platform)
    ✅ Figma (Tool) + UI Design (Category) + Mobile (Platform)
    ✅ Figma (Tool) + Prototyping (Category) + Web (Platform)
    ❌ Figma (Tool) + UI Design (Category) + Web (Platform)  // Duplicate - reject
   */
  ( t ) => [
    uniqueIndex( 'tool_category_platform_unique' ).on( t.toolId, t.categoryId, t.platformId )
  ]
);
