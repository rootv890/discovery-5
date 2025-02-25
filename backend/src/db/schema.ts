import { eq, relations } from "drizzle-orm";
import {
	boolean,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

/**
 * Enums
 */
export const waitlistUserRolesEnum = pgEnum("waitlist_user_roles", [
	"designer",
	"developer",
	"both",
	"other",
]);

export const genderEnum = pgEnum("gender", [
	"male",
	"female",
	"other",
	"prefer_not_to_say",
]);

export const voteTypeEnum = pgEnum("vote_type", ["UPVOTE", "DOWNVOTE", "NONE"]);

export const userRolesEnum = pgEnum("user_role", ["ADMIN", "USER", "CURATOR"]);

export const entityTypeEnum = pgEnum("entity_type", [
	"tool",
	"collection",
	"user",
	"platform",
	"category",
	"vote",
	"comment",
	"recycle_bin",
	"user_tool_bin",
	"user_collection_bin",
]);

export const platformConstraintEnum = pgEnum("platform_constraint", [
	"NONE", // Platform-agnostic : No constraint None or Multiple
	"SINGLE", // Platform-specific : Single platform
]);

export const toolApprovalStatusEnum = pgEnum("tool_approval_status", [
	"PENDING", // Submitted and waiting for approval
	"APPROVED", // Approved and published
	"REJECTED", // Rejected and not published
	"DRAFT", // DEFAULT: Submitted but not yet approved
]);
/**
 * Tables
 */

// 1️⃣  Waitlist related Tables  ----------

export const waitlistUserTable = pgTable("waitlist", {
	id: uuid("id").primaryKey().defaultRandom().notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	role: waitlistUserRolesEnum("role").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name").notNull(),
		username: varchar("username").notNull().unique(),
		email: varchar("email").notNull().unique(),
		passwordHash: varchar("password_hash").notNull(),
		role: userRolesEnum("role").default("USER"),
		avatarUrl: text("avatar_url"),
		bio: text("bio"),
		gender: genderEnum("gender").default("prefer_not_to_say"),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(t) => [
		uniqueIndex("idx_user_username").on(t.username),
		uniqueIndex("idx_user_email").on(t.email),
	]
);

export const sessions = pgTable("sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	expiresAt: timestamp("expires_at").notNull(),
});

export const platforms = pgTable("platforms", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 256 }).notNull().unique(),
	description: text("description"),
	imageUrl: text("image_url"), // Recommended: SVG
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 256 }).notNull().unique(),
	description: text("description"),
	imageUrl: text("image_url").notNull(), // Recommended: SVG
	platformConstraint: platformConstraintEnum("platform_constraint")
		.default("NONE")
		.notNull(), // NONE = For Platform-agnostic tools (No constraint) and SINGLE = For Platform-specific tools (Single platform)
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const categoryPlatform = pgTable(
	// use this as reference for adding new Tool,
	"category_platform",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		categoryId: uuid("category_id")
			.references(() => categories.id, { onDelete: "cascade" })
			.notNull(),
		platformId: uuid("platform_id")
			.references(() => platforms.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	}, // Must have unqiue categoryId and platformId
	(t) => [uniqueIndex("idx_category_platform").on(t.categoryId, t.platformId)]
);

export const tools = pgTable("tools", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 256 }).notNull().unique(),
	description: text("description"),
	imageUrl: text("image_url").notNull(), // Recommended : JPG or PNG
	thumbnailUrls: jsonb("thumbnail_urls").$type<{
		// 📱 Small: For mobile devices
		small?: string; //  320-480px wide
		// 💻 Medium: For tablets and smaller screens
		medium?: string; //  768-1024px wide
		// 🖥️ Large: For desktop and high-resolution displays
		large?: string; //  1200px and above
	}>(),
	approvalStatus: toolApprovalStatusEnum("approval_status").default("PENDING"),
	isNew: boolean("is_new").default(false),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const tags = pgTable("tags", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 256 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// Tool-Tags -> Many-to-Many
export const toolTags = pgTable(
	"tool_tags",
	{
		id: uuid("id").defaultRandom(),
		toolId: uuid("tool_id")
			.references(() => tools.id, { onDelete: "cascade" })
			.notNull(),
		tagId: uuid("tag_id")
			.references(() => tags.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(t) => [
		/**
  * - ✅ Tool1 + TagA
    - ✅ Tool1 + TagB
    - ✅ Tool2 + TagA
    - ❌ Tool1 + TagA (duplicate - will be rejected by the database)
  */
		primaryKey({ columns: [t.toolId, t.tagId] }),
	]
);

export const collections = pgTable(
	"collections",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 256 }).notNull().unique(),
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		description: text("description"),
		// Images -> Array of URLs
		images: jsonb("images").$type<
			{
				url: {
					small: string;
					medium: string;
					large: string;
				};
				alt: string;
			}[]
		>(),
		isPublic: boolean("is_public").default(false),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(t) => [uniqueIndex("idx_collection_user_user_id_name").on(t.userId, t.name)]
);

// CollectionTools  -> Many-to-Many
export const collectionTools = pgTable(
	"collection_tools",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		collectionId: uuid("collection_id").references(() => collections.id, {
			onDelete: "cascade",
		}),
		toolId: uuid("tool_id")
			.references(() => tools.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(t) => [uniqueIndex("collectionTools").on(t.collectionId, t.toolId)]
);

export const toolCategoryPlatform = pgTable(
	"tool_category_platform",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		toolId: uuid("tool_id")
			.references(() => tools.id, { onDelete: "cascade" })
			.notNull(),
		categoryPlatformId: uuid("category_platform_id")
			.references(() => categoryPlatform.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},

	/**
    ✅ Figma (Tool) + UI Design (Category) + Web (Platform)
    ✅ Figma (Tool) + UI Design (Category) + Mobile (Platform)
    ✅ Figma (Tool) + Prototyping (Category) + Web (Platform)
    ❌ Figma (Tool) + UI Design (Category) + Web (Platform)  // Duplicate - reject
   */
	(t) => [
		uniqueIndex("idx_tool_category_platform").on(
			t.toolId,
			t.categoryPlatformId
		),
	]
);

export const votes = pgTable(
	"votes",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "no action" }) // So that if user is deleted, vote is not deleted
			.notNull(),
		toolId: uuid("tool_id")
			.references(() => tools.id, { onDelete: "no action" }) // So that if tool is deleted, vote is not deleted
			.notNull(),
		voteType: voteTypeEnum("vote_type").default("NONE"),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(t) => {
		return [
			uniqueIndex("user_tool_vote").on(t.userId, t.toolId), // One vote per user per tool
		];
	}
);

export const comments = pgTable("comments", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	// parentId: uuid( "parent_id" )
	// .references( (): AnyPgColumn => comments.id, { onDelete: "cascade" } ),
	toolId: uuid("tool_id")
		.references(() => tools.id, { onDelete: "cascade" })
		.notNull(),

	content: text("content").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Relations ⊰
 */

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
export const userRelations = relations(users, ({ many, one }) => ({
	votes: many(votes),
	comments: many(comments),
	collections: many(collections),
}));
export const collectionRelations = relations(collections, ({ many, one }) => ({
	user: one(
		users,
		// Add Constraints
		{ fields: [collections.userId], references: [users.id] }
	),
	collectionTools: many(collectionTools),
}));

/**
 * Tool and Tag
 * One tool can have multiple tags
 * One Tag can have mutliple tools
 * so M:N relation
 */

export const toolRelations = relations(tools, ({ many }) => ({
	toolCategoryPlatform: many(toolCategoryPlatform),
	votes: many(votes),
	comments: many(comments),
	collectionTools: many(collectionTools),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
	toolCategoryPlatform: many(toolCategoryPlatform),
}));

export const platformRelations = relations(platforms, ({ many }) => ({
	toolCategoryPlatform: many(toolCategoryPlatform),
}));

export const tagRelations = relations(tags, ({ many }) => {
	return {
		tool: many(toolTags), // avoid direct contact with tags
	};
});

export const toolTagRelations = relations(toolTags, ({ one }) => {
	return {
		tool: one(tools, {
			fields: [toolTags.toolId], //FK
			references: [tools.id],
		}),
		tag: one(tags, {
			fields: [toolTags.tagId], //FK
			references: [tags.id],
		}),
	};
});

/**
 * Collection Tools
 * One Collection has many tools
 * One Tool can belong to multiple collections
 * so M:N relation
 */

export const collectionToolsRelations = relations(
	collectionTools,
	({ one }) => {
		return {
			collection: one(collections, {
				fields: [collectionTools.collectionId],
				references: [collections.id],
			}),
			tool: one(tools, {
				fields: [collectionTools.toolId],
				references: [tools.id],
			}),
		};
	}
);

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

export const toolCategoryPlatformRelations = relations(
	toolCategoryPlatform,
	({ one }) => ({
		// toolCategoryPlatform will have one tool
		tool: one(tools, {
			fields: [toolCategoryPlatform.toolId],
			references: [tools.id],
		}),
		// toolCategoryPlatform will have one categoryPlatform
		categoryPlatform: one(categoryPlatform, {
			fields: [toolCategoryPlatform.categoryPlatformId],
			references: [categoryPlatform.id],
		}),
	})
);

export const voteRelations = relations(votes, ({ one }) => {
	return {
		user: one(users, {
			fields: [votes.userId],
			references: [users.id],
		}),
		tool: one(tools, {
			fields: [votes.toolId],
			references: [tools.id],
		}),
	};
});

export const commentRelations = relations(comments, ({ one, many }) => ({
	user: one(users, { fields: [comments.userId], references: [users.id] }),
	tool: one(tools, { fields: [comments.toolId], references: [tools.id] }),
	// parentComment: one( comments, { fields: [ comments.parentId ], references: [ comments.id ] } ), // ✅ Parent-Child Relation
	childComments: many(comments), // ✅ Replies
}));

// Recycle Bins -> Soft Delete
// Only Admin or Curator can delete the tool or collection
export const recycleBin = pgTable("recycle_bin", {
	id: uuid("id").primaryKey().defaultRandom(),
	entityType: entityTypeEnum("entity_type").notNull(),
	entityId: uuid("entity_id").references(() => tools.id, {
		onDelete: "cascade",
	}),
	deletedBy: uuid("deleted_by").references(() => users.id, {
		onDelete: "cascade",
	}),
	deletedAt: timestamp("deleted_at").defaultNow(),
	deletedReason: text("deleted_reason"),
});

// Personal user Tool Bin
export const userToolBin = pgTable("user_tool_bin", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
	toolId: uuid("tool_id").references(() => tools.id, { onDelete: "cascade" }),
	deletedAt: timestamp("deleted_at").defaultNow(),
	deletedReason: text("deleted_reason"),
});

export const userCollectionBin = pgTable("user_collection_bin", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
	collectionId: uuid("collection_id").references(() => collections.id, {
		onDelete: "cascade",
	}),
	deletedAt: timestamp("deleted_at").defaultNow(),
	deletedReason: text("deleted_reason"),
});

// Banned Users
export const bannedUsers = pgTable("banned_users", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
	bannedAt: timestamp("banned_at").defaultNow(),
	bannedReason: text("banned_reason"),
	bannedBy: uuid("banned_by").references(() => users.id, {
		onDelete: "cascade",
	}),
	bannedUntil: timestamp("banned_until"),
});

/**
 * Types
 */

// ( typeof waitlistUserRolesEnum.enumValues )[ number ];
export type GenderEnumType = (typeof genderEnum.enumValues)[number];
export type VoteTypeEnumType = (typeof voteTypeEnum.enumValues)[number];
export type UserRoleEnumType = (typeof userRolesEnum.enumValues)[number];
export type ToolApprovalStatusEnumType =
	(typeof toolApprovalStatusEnum.enumValues)[number];

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

// Waitlist User Types
export type insertWaitlistUser = typeof waitlistUserTable.$inferInsert;
export type selectWaitlistUser = typeof waitlistUserTable.$inferSelect;
export type WaitlistUserRoleType =
	(typeof waitlistUserRolesEnum.enumValues)[number];

// Newsletter Preference Types
export type insertNewsletterPreference =
	typeof newsletterPreference.$inferInsert;
export type selectNewsletterPreference =
	typeof newsletterPreference.$inferSelect;
