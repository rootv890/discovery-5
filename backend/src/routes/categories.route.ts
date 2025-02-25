import { db } from "@/db/db";
import { categories, categoryPlatform } from "@/db/schema";
import { ApiMetadata, ApiResponse } from "@/type";
import {
	checkTableExistsPromiseWithId,
	createApiErrorResponse,
	getPaginationMetadata,
	getPaginationParams,
	getSortingDirection,
} from "@/utils/apiHelpers";
import { and, eq, inArray } from "drizzle-orm";
import { query, Router } from "express";
import { platforms } from "@/db/schema";

export const CategoriesRouter = Router();

// Get all categories
CategoriesRouter.get("/", async (req, res) => {
	try {
		// queries
		const { page, limit, sortBy, order, offset } = getPaginationParams(
			req.query,
			["createdAt", "name", "updatedAt"]
		);

		const orderDirection = getSortingDirection(order);

		const rawCategories = await getAllCategories_Promise(
			{ page, limit, sortBy, order, offset },
			orderDirection
		);

		// Get all categories with platforms
		const categoriesWithPlatforms = await Promise.all(
			rawCategories.map(async (category) => {
				const platformsData = await db
					.select(
						// @ts-ignore
						{ ...platforms }
					)
					.from(categoryPlatform)
					.leftJoin(platforms, eq(categoryPlatform.platformId, platforms.id))
					.where(eq(categoryPlatform.categoryId, category.id));
				return { ...category, platforms: platformsData };
			})
		);

		const metadata = getPaginationMetadata(
			categoriesWithPlatforms.length,
			page,
			limit,
			sortBy,
			order
		) as ApiMetadata;

		const response: ApiResponse<(typeof categoriesWithPlatforms)[number]> = {
			success: true,
			message: "Categories fetched successfully",
			data: categoriesWithPlatforms,
			metadata,
		};

		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		res.status(errorResponse.error.code).json(errorResponse);
	}
});

// Get all categories under particular platform
CategoriesRouter.get("/all/:platformId", async (req, res) => {
	try {
		const { platformId } = req.params;
		const { page, limit, sortBy, order, offset } = getPaginationParams(
			req.query,
			["createdAt", "name", "updatedAt"]
		);
		const orderDirection = getSortingDirection(order);

		const categoriesList = await getAllCategoriesForPlatforms(
			{ page, limit, sortBy, order, offset },
			orderDirection,
			[platformId]
		);

		const metadata = getPaginationMetadata(
			categoriesList.length,
			page,
			limit,
			sortBy,
			order
		) as ApiMetadata;

		const response: ApiResponse<(typeof categoriesList)[number]> = {
			success: true,
			message: "Categories fetched successfully",
			data: categoriesList,
			metadata,
		};

		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		res.status(errorResponse.error.code).json(errorResponse);
	}
});

// Get category under particular platform
CategoriesRouter.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const categoriesData = await db
			.select()
			.from(categories)
			.where(eq(categories.id, id))
			.leftJoin(
				categoryPlatform,
				eq(categories.id, categoryPlatform.categoryId)
			)
			.leftJoin(platforms, eq(categoryPlatform.platformId, platforms.id));
		console.log("Category with platforms ✅ ", categoriesData);

		const response: ApiResponse<(typeof categoriesData)[number]> = {
			success: true,
			message: "Category fetched successfully",
			data: categoriesData,
		};
		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		res.status(errorResponse.error.code).json(errorResponse);
	}
});
// Create category under particular platforms
CategoriesRouter.post("/", async (req, res) => {
	const {
		name,
		description,
		platformIds = [],
		imageUrl,
		platformConstraint,
	} = req.body;

	// Validate required platformIds
	if (platformIds.length === 0) {
		res.status(400).json({
			success: false,
			error: {
				code: 400,
				message: "At least one platform ID is required",
			},
		});
	}

	try {
		// First verify all platformIds exist
		const existingPlatforms = await db
			.select()
			.from(platforms)
			.where(inArray(platforms.id, platformIds));

		if (existingPlatforms.length !== platformIds.length) {
			res.status(400).json({
				success: false,
				error: {
					code: 400,
					message: "One or more platform IDs do not exist",
				},
			});
		}

		// Create category
		const categoryData = await db
			.insert(categories)
			.values({
				name,
				description,
				imageUrl,
				platformConstraint,
			})
			.returning();

		// Add category-platform relationships
		const categoryPlatformData = await db
			.insert(categoryPlatform)
			.values(
				platformIds.map((platformId: string) => ({
					categoryId: categoryData[0].id,
					platformId,
				}))
			)
			.returning();
		console.log("Added to categoryPlatform ✅", categoryPlatformData);

		const response: ApiResponse<(typeof categoryData)[number]> = {
			success: true,
			message: "Category created successfully",
			data: categoryData,
		};
		res.status(201).json(response);
	} catch (error) {
		console.log("Error @", error);
		const errorResponse = createApiErrorResponse(error);
		res.status(errorResponse.error.code).json(errorResponse);
	}
});

CategoriesRouter.patch("/:id", async (req, res) => {
	const { id } = req.params;
	const { name, description, imageUrl, platformConstraint } = req.body;

	try {
		// Check existencee
		const tableExists = await checkTableExistsPromiseWithId(categories, id);
		if (!tableExists) {
			res.status(404).json({
				success: false,
				error: { code: 404, message: "Category not found" },
			});
		}

		// Update category
		console.log("Updating category....");
		const categoryData = await db
			.update(categories)
			.set({ name, description, imageUrl, platformConstraint })
			.where(eq(categories.id, id))
			.returning();

		const response: ApiResponse<(typeof categoryData)[number]> = {
			success: true,
			message: "Category updated successfully",
			data: categoryData,
		};
		console.log("Update category ✅ ", categoryData);
		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		console.log("Error: ", errorResponse);
		res.status(errorResponse.error.code).json(errorResponse);
	}
});

// Delete category under particular platforms
CategoriesRouter.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { platformIds } = req.body as {
			platformIds: string[];
		};

		if (platformIds.length === 0) {
			res.status(400).json({
				success: false,
				error: { code: 400, message: "At least one platform ID is required" },
			});
		}

		// Check existence
		const tableExists = await checkTableExistsPromiseWithId(categories, id);
		if (!tableExists) {
			res.status(404).json({
				success: false,
				error: { code: 404, message: "Category not found" },
			});
		}

		// Delete category-platform relationships
		await db
			.delete(categoryPlatform)
			.where(
				and(
					eq(categoryPlatform.categoryId, id),
					inArray(categoryPlatform.platformId, platformIds)
				)
			);
		console.log("Deleted from categoryPlatform ✅ ");

		// Delete category
		await db.delete(categories).where(eq(categories.id, id));
		console.log("Deleted from categories ✅ ");
		const response: ApiResponse<void> = {
			success: true,
			message: "Category deleted successfully",
			data: [],
		};
		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		console.log("Error: ", errorResponse);
		res.status(errorResponse.error.code).json(errorResponse);
	}
});

// Delete all categories
CategoriesRouter.delete("/all/:platformId", async (req, res) => {
	const { platformId } = req.params;
	const { categoryIds } = req.body as {
		categoryIds: string[];
	};

	if (categoryIds.length === 0) {
		res.status(400).json({
			success: false,
			error: { code: 400, message: "At least one category ID is required" },
		});
	}

	try {
		// Check existence
		const tableExists = await checkTableExistsPromiseWithId(
			platforms,
			platformId
		);
		if (!tableExists) {
			res.status(404).json({
				success: false,
				error: { code: 404, message: "Platform not found" },
			});
		}

		// Delete category-platform relationships
		await db
			.delete(categoryPlatform)
			.where(
				and(
					eq(categoryPlatform.platformId, platformId),
					inArray(categoryPlatform.categoryId, categoryIds)
				)
			);
		console.log("Deleted from categoryPlatform ✅ ");

		// Delete categories
		await db.delete(categories).where(inArray(categories.id, categoryIds));
		console.log("Deleted from categories ✅ ");

		const response: ApiResponse<void> = {
			success: true,
			message: "Categories deleted successfully",
			data: [],
		};
		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		console.log("Error: ", errorResponse);
		res.status(errorResponse.error.code).json(errorResponse);
	}
});

// API Helpers with beautiful and understandable names all queries will be promise

export const getAllCategories_Promise = async (
	queries: any,
	orderDirection: any
) => {
	const { page, limit, sortBy, order } = queries;
	const offset = (page - 1) * limit;
	console.log(limit, offset);
	return db
		.select()
		.from(categories)
		.orderBy(orderDirection(sortBy)) // example desc(categories.createdAt)
		.limit(limit)
		.offset(offset);
};

const getAllCategoriesForPlatforms = async (
	queries: any,
	orderDirection: any,
	platformIds: string[]
) => {
	const { page, limit, sortBy, order } = queries;
	const offset = (page - 1) * limit;
	console.log(limit, offset);
	console.log("Fetching from categoryPlatform..... ");

	const categoryPlatformData = await db
		.select()
		.from(categoryPlatform)
		.where(inArray(categoryPlatform.platformId, platformIds));

	console.log("Fetched from categoryPlatform ✅ ", categoryPlatformData);

	const categoriesIds = categoryPlatformData.map((res) => res.categoryId);

	console.log("Fetching from categories..... ");

	if (categoriesIds.length === 0) {
		return [];
	}

	const categoriesData = await db
		.select(
			// @ts-ignore
			{ ...categories, platforms: platforms }
		)
		.from(categories)
		.where(inArray(categories.id, categoriesIds as string[]))
		.orderBy(orderDirection(sortBy))
		.limit(limit)
		.offset(offset)
		.leftJoin(categoryPlatform, eq(categories.id, categoryPlatform.categoryId))
		.leftJoin(platforms, eq(categoryPlatform.platformId, platforms.id));

	console.log("Fetched from categories ✅ ", categoriesData);

	return categoriesData;
};
