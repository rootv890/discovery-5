import { relations, sql } from "drizzle-orm";
import { boolean, jsonb, pgEnum, pgTable, primaryKey, serial, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Enums
 */
export const waitlistUserRolesEnum = pgEnum( "waitlist_user_roles", [
  "designer",
  "developer",
  "both",
  "other",
] );

export const genderEnum = pgEnum( "gender", [
  "male",
  "female",
  "other",
  "prefer_not_to_say"
] );

export const voteTypeEnum = pgEnum( "vote_type", [
  "UPVOTE",
  "DOWNVOTE",
  "NONE"
] );


/**
 * Tables
 */

// 1️⃣  Waitlist related Tables  ----------
export const waitlistUserTable = pgTable( "waitlist", {
  id: uuid( "id" ).primaryKey().defaultRandom().notNull(),
  email: varchar( "email", { length: 64 } ).notNull(), // Increased email length
  name: varchar( "name", { length: 32 } ).notNull(),
  role: waitlistUserRolesEnum( "role" ).notNull(),
  createdAt: timestamp( "created_at" ).notNull().defaultNow(),
  updatedAt: timestamp( "updated_at" ).notNull().defaultNow(),
} );

export const newsletterPreference = pgTable( "newsletter_preference", {
  id: serial( "id" ).primaryKey(),
  userId: uuid( "user_id" ) // Changed from integer to uuid
    .references( () => waitlistUserTable.id, { onDelete: "cascade" } )
    .notNull(),
  newsletter: boolean( "newsletter" ).default( false ).notNull(),
} );

// Types
export type insertWaitlistUser = typeof waitlistUserTable.$inferInsert;
export type selectWaitlistUser = typeof waitlistUserTable.$inferSelect;
export type WaitlistUserRoleType = ( typeof waitlistUserRolesEnum.enumValues )[ number ];




// 2️⃣ Main Project  related Tables ----------

export const users = pgTable( "users", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  name: varchar( "name", { length: 256 } ).notNull(),
  username: varchar( "username", { length: 256 } ).notNull().unique(),
  email: varchar( "email", { length: 256 } ).notNull().unique(),
  avatarUrl: text( "avatar_url" ),
  bio: text( "bio" ),
  gender: genderEnum( "gender" ).default( 'prefer_not_to_say' ),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
}, ( t ) => [
  uniqueIndex( 'idx_user_name' ).on( t.name ),
  uniqueIndex( 'idx_user_username' ).on( t.username ),
  uniqueIndex( 'idx_user_email' ).on( t.email )
] );

export const platforms = pgTable( "platforms", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  name: varchar( "name", { length: 256 } ).notNull().unique(),
  description: text( "description" ),
  imageUrl: text( "image_url" ),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
} );

export const categories = pgTable( "categories", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  name: varchar( "name", { length: 256 } ).notNull().unique(),
  description: text( "description" ),
  imageUrl: text( "image_url" ).notNull(),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
} );


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
},

  ( t ) => [
    uniqueIndex( 'idx_tools_name' ).on( t.name ), uniqueIndex( "idx_tools_approved" ).on( t.isApproved ).where( sql`is_approved = TRUE` ),
    // uniqueIndex( "idx_tools_description" ).on( t.description )

  ]

);

export const tags = pgTable( "tags", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  name: varchar( "name", { length: 256 } ).notNull().unique(),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
} );


// Tool-Tags -> Many-to-Many
export const toolTags = pgTable( "tool_tags", {
  id: uuid( "id" ).defaultRandom(),
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
  primaryKey( { columns: [ t.toolId, t.tagId ] } )
]
);


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
},
  ( t ) => [
    uniqueIndex( 'idx_collection_user_id' ).on( t.userId )
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
    uniqueIndex( "idx_tool_category_platform" ).on( t.toolId, t.categoryId, t.platformId ),
  ]
);

export const votes = pgTable( "votes", {
  id: uuid( "id" ).primaryKey().defaultRandom(),
  userId: uuid( "user_id" )
    .references( () => users.id, { onDelete: "set null" } )
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
  // parentId: uuid( "parent_id" )
  // .references( (): AnyPgColumn => comments.id, { onDelete: "cascade" } ),
  toolId: uuid( "tool_id" )
    .references( () => tools.id, { onDelete: "cascade" } )
    .notNull(),

  content: text( "content" ).notNull(),
  createdAt: timestamp( "created_at" ).defaultNow(),
  updatedAt: timestamp( "updated_at" ).defaultNow(),
} );


/**
 * Relations ⊰
 */
// 1️⃣  Waitlist related relations  ----------
export const waitlistUserRelations = relations( waitlistUserTable, ( { one } ) => {
  return {
    newsletterPreference: one( newsletterPreference, {
      fields: [ waitlistUserTable.id ],
      references: [ newsletterPreference.userId ],
    } ),
  };
} );

// 2️⃣  Main Project related relations  ----------
/* blueprint
export const entityRelations = relations(EntityTable, ({ one, many }) => ({
  singleRelatedEntity: one(RelatedTable, {
    fields: [EntityTable.foreignKey],
    references: [RelatedTable.primaryKey],
  }),

  multipleRelatedEntities: many(AnotherRelatedTable),
}));
*/

/**
 * User and Collection
 * One User can multiple collections
 * but one collection can have only one user
 * so its a One (User) to Many (Collections)
 */
export const userRelations = relations( users, ( { many } ) => ( {
  votes: many( votes ),
  comments: many( comments ),
  collections: many( collections ),
  newsletterPreference: many( newsletterPreference ),
} ) );
export const collectionRelations = relations( collections, ( { many, one } ) => ( {
  user: one( users, { fields: [ collections.userId ], references: [ users.id ] } ),
  collectionTools: many( collectionTools ),
} ) );


/**
 * Tool and Tag
 * One tool can have multiple tags
 * One Tag can have mutliple tools
 * so M:N relation
 */

export const toolRelations = relations( tools, ( { many } ) => ( {
  toolCategoryPlatform: many( toolCategoryPlatform ),
  votes: many( votes ),
  comments: many( comments ),
  collectionTools: many( collectionTools ),
} ) );


export const categoryRelations = relations( categories, ( { many } ) => ( {
  toolCategoryPlatform: many( toolCategoryPlatform ),
} ) );

export const platformRelations = relations( platforms, ( { many } ) => ( {
  toolCategoryPlatform: many( toolCategoryPlatform ),
} ) );


export const tagRelations = relations( tags, ( { many } ) => {
  return {
    tool: many( toolTags ) // avoid direct contact with tags
  };
} );

export const toolTagRelations = relations( toolTags, ( { one } ) => {
  return {
    tool: one( tools, {
      fields: [ toolTags.toolId ],//FK
      references: [ tools.id ]
    } ),
    tag: one( tags, {
      fields: [ toolTags.tagId ],//FK
      references: [ tags.id ]
    } )
  };
} );



/**
 * Collection Tools
 * One Collection has many tools
 * One Tool can belong to multiple collections
 * so M:N relation
 */

export const collectionToolsRelations = relations( collectionTools, ( { one } ) => {
  return {
    collection: one( collections, {
      fields: [ collectionTools.collectionId ],
      references: [ collections.id ]
    } ),
    tool: one( tools, {
      fields: [ collectionTools.toolId ],
      references: [ tools.id ]
    } )
  };
} );


/**
 * Tool Category Platform relations
 * One Tool Many Catogery
 * One Tool Many Platofrms
 *
 * One Category Many Tools
 * One Category Many Platforms
 *
 * One Platform Many tools
 * One Platform Many Categories
 * M:N:O relations
 */

export const toolCategoryPlatformRelations = relations( toolCategoryPlatform, ( { one } ) => ( {
  tool: one( tools, {
    fields: [ toolCategoryPlatform.toolId ],
    references: [ tools.id ]
  } ),
  category: one( categories, {
    fields: [ toolCategoryPlatform.categoryId ],
    references: [ categories.id ]
  } ),
  platform: one( platforms, {
    fields: [ toolCategoryPlatform.platformId ],
    references: [ platforms.id ]
  } ),
} ) );


export const voteRelations = relations( votes, ( { one } ) => {
  return {
    user: one( users, {
      fields: [ votes.userId ],
      references: [ users.id ]
    } ),
    tool: one( tools, {
      fields: [ votes.toolId ],
      references: [ tools.id
      ]
    } )
  };
} );


export const commentRelations = relations( comments, ( { one, many } ) => ( {
  user: one( users, { fields: [ comments.userId ], references: [ users.id ] } ),
  tool: one( tools, { fields: [ comments.toolId ], references: [ tools.id ] } ),
  // parentComment: one( comments, { fields: [ comments.parentId ], references: [ comments.id ] } ), // ✅ Parent-Child Relation
  childComments: many( comments ), // ✅ Replies
} ) );



/**
 * Types
 */

// All Enums
// ( typeof waitlistUserRolesEnum.enumValues )[ number ];
export type GenderEnumType = ( typeof genderEnum.enumValues )[ number ];
export type VoteTypeEnumType = ( typeof voteTypeEnum.enumValues )[ number ];

// Users
export const NewUserType = users.$inferInsert;
export const SelectUserType = users.$inferSelect;

// Tools
export const NewToolType = tools.$inferInsert;
export const SelectToolType = tools.$inferSelect;

// Categories
export const NewCategoryType = categories.$inferInsert;
export const SelectCategoryType = categories.$inferSelect;

// Categories
export const NewPlatformType = platforms.$inferInsert;
export const SelectPlatformType = platforms.$inferSelect;

// Tags
export const NewTagType = tags.$inferInsert;
export const SelectTagType = tags.$inferSelect;

// Comments
export const NewCommentType = comments.$inferInsert;
export const SelectCommentType = comments.$inferSelect;

// Votes
export const NewVoteType = votes.$inferInsert;
export const SelectVoteType = votes.$inferSelect;
