/**
 * All API and DB related helpers
 */

import { asc, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "../db/db";
import { categories, categoryPlatform, platforms, tools } from "../db/schema";

export const getPaginationParams = (
	query: any, // eg : req.query
	validSortFields: string[] = ["createdAt", "name"] // default sort fields
) => {
	const sortBy = validSortFields.includes(query.sortBy as string)
		? query.sortBy
		: "createdAt"; // default sort field
	const order = query.order === "asc" ? "asc" : "desc"; // default order
	const page = Number(query.page) || 1; // default page
	const limit = Number(query.limit) || 10; // default limit
	const offset = (page - 1) * limit; // default offset

	// Must body content
	//  sortBy: createdAt, name
	//  order: asc, desc
	//  page: 1, 2, 3
	//  limit: 10, 20, 30

	return { sortBy, order, page, limit, offset };
};

// Returns the drizzle order function based on the order string
// export const getSortingDirection = (order: keyof typeof categories) => {
// 	return order.toString() === "asc" ? asc : desc; //
// };
// Updated
export const getSortingDirection = (order: string) => {
	return order === "asc" ? asc : desc;
	// eg: asc(categories.name)
};

// Constructs pagination metadata for the API responses
export const getPaginationMetadata = (
	totalItems: number,
	page: number,
	limit: number,
	sortBy: string,
	order: string
) => {
	const totalPages = Math.ceil(totalItems / limit);
	return {
		total: totalItems,
		page,
		limit,
		totalPages,
		nextPage: page + 1 > totalPages ? null : page + 1,
		previousPage: page - 1 < 1 ? null : page - 1,
		hasNextPage: page + 1 <= totalPages,
		hasPreviousPage: page - 1 >= 1,
		isFirstPage: page === 1,
		isLastPage: page === totalPages,
		sortBy,
		order,
		timestamp: Date.now(),
	};
};

// Create a reusable error response function
export const createApiErrorResponse = (error: unknown) => {
	return {
		success: false,
		message: "Internal Server Error",
		data: [],
		error: {
			code: 500,
			message: (error as Error).message,
			details: (error as Error).stack,
		},
	};
};

// All does exits
export const doesPlatformExists = async (platformId: string) => {
	const platform = await db
		.select()
		.from(platforms)
		.where(eq(platforms.id, platformId));
	return platform.length > 0;
};

export const doesCategoryExists = async (categoryId: string) => {
	const category = await db
		.select()
		.from(categories)
		.where(eq(categories.id, categoryId));
	return category.length > 0;
};

export const doesCategoryExistsByName = async (name: string) => {
	const category = await db
		.select()
		.from(categories)
		.where(eq(categories.name, name));
	console.log(category);
	return category.length > 0;
};

export const doesToolExists = async (toolId: string) => {
	const tool = await db.select().from(tools).where(eq(tools.id, toolId));
	return tool.length > 0;
};

// Get name of the things from given ids

/**
 * Usecases:
 * 1. Get name of the platform from id
 * 2. Get name of the category from id
 * 3. Get name of the tool from id
 * 4. When we fetch categories for a platform, we get id, we need to get name
 */
export const getNameFromId = async (id: string, table: any) => {
	const name = await db.select().from(table).where(eq(table.id, id));
	return name[0].name;
};

export const getNamesFromIds = async (ids: string[], table: any) => {
	const names = await db.select().from(table).where(inArray(table.id, ids));
	return names.map((name) => name.name);
};

export const getCategoryFromPlatform = async (platformId: string) => {
	const category = await db
		.select()
		.from(categories)
		.where(eq(categoryPlatform.platformId, platformId));
	return category;
};

// TOOL : Get tool from category

// Check if table exists
export const checkTableExistsPromiseWithId = async (table: any, id: string) => {
	return db.select().from(table).where(eq(table.id, id));
};

export const checkTableExistsPromiseWithName = async (
	table: any,
	name: string
) => {
	return db
		.select()
		.from(table)
		.where(ilike(table.name, `%${name}%`));
};
