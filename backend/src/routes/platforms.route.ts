import { AnyColumn, eq, ilike } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db/db";
import { categories, categoryPlatform, platforms } from "../db/schema";
import { ApiMetadata, ApiResponse } from "../type";
import {
	checkTableExistsPromiseWithId,
	checkTableExistsPromiseWithName,
	createApiErrorResponse,
	getPaginationMetadata,
	getPaginationParams,
	getSortingDirection,
} from "../utils/apiHelpers";

export const PlatformsRouter = Router();
PlatformsRouter.get("/", async (req, res) => {
	try {
		//  use apiHelpers
		const { sortBy, order, page, limit, offset } = getPaginationParams(
			req.query,
			["createdAt", "name"]
		);
		const orderDirection = getSortingDirection(order as "asc" | "desc");
		// Fetch total count

		// First fetch platforms
		const rawPlatforms = await db
			.select()
			.from(platforms)
			.orderBy(
				orderDirection(platforms[sortBy as keyof typeof platforms] as AnyColumn)
			)
			.limit(limit)
			.offset(offset);

		const platformsWithCategories = await Promise.all(
			rawPlatforms.map(async (platform) => {
				const allCategories = await fetchAllCategoriesUnderPlatform(
					platform.id
				);

				// TODO : Fetch tools
				return {
					...platform,
					categories: allCategories,
					// ToDO : Fetch tools
				};
			})
		);

		const metadata: ApiMetadata = await getPaginationMetadata(
			page,
			limit,
			sortBy,
			order as "asc" | "desc",
			platforms
		);

		// Construct response using `ApiResponse`
		const response: ApiResponse<(typeof platformsWithCategories)[number]> = {
			success: true,
			message: "Platforms fetched successfully",
			data: platformsWithCategories,
			metadata: metadata as ApiMetadata,
		};
		console.log("Successfully fetched platforms ✅");
		res.status(200).json(response);
	} catch (error) {
		const errorResponse: ApiResponse<null> = {
			success: false,
			message: "Internal Server Error",
			data: [],
			error: {
				code: 500,
				message: (error as Error).message,
				details: (error as Error).stack,
			},
		};
		console.log("Error fetching platforms ❌", errorResponse);
		res.status(500).json(errorResponse);
	}
});

// Get platform by id (FOLLOW THE RULES)
PlatformsRouter.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const platform = await db
			.select()
			.from(platforms)
			.where(eq(platforms.id, id));

		if (platform.length === 0) {
			throw new Error("Platform not found");
		}

		const response: ApiResponse<(typeof platform)[number]> = {
			success: true,
			message: "Platform fetched successfully",
			data: platform,
		};
		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		res.status(500).json(errorResponse);
	}
});

// Get platform by name
PlatformsRouter.get("/name/:name", async (req, res) => {
	try {
		const { name } = req.params;

		const platform = await db
			.select()
			.from(platforms)
			.where(ilike(platforms.name, `%${name}%`))
			.limit(1);

		if (platform.length === 0) {
			throw new Error("Platform not found");
		}

		const response: ApiResponse<(typeof platform)[number]> = {
			success: true,
			message: "Platform fetched successfully",
			data: platform,
		};
		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		res.status(500).json(errorResponse);
	}
});

// Create a platform
PlatformsRouter.post("/", async (req, res) => {
	try {
		// TODO : Batch Based  insertion [ { name, description, imageUrl } ]
		const { name, description, imageUrl } = req.body;
		const returnData = await db
			.insert(platforms)
			.values({ name, description, imageUrl })
			.returning();

		const response = {
			success: true,
			message: "Platform created successfully",
			data: returnData,
		};
		res.status(201).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		res.status(500).json(errorResponse);
	}
});

// Update a platform
PlatformsRouter.patch("/name/:platformName", async (req, res) => {
	try {
		const { platformName } = req.params;
		const { name, description, imageUrl } = req.body;

		const checkPlatformExists = await checkTableExistsPromiseWithName(
			platforms,
			platformName
		);

		if (checkPlatformExists.length === 0) {
			throw new Error("Platform not found");
		}

		const updatedPlatform = await db
			.update(platforms)
			.set({ name, description, imageUrl })
			.where(ilike(platforms.name, `%${platformName}%`)) // iLike is used to match the platform name with the given name
			.returning();

		const response: ApiResponse<(typeof updatedPlatform)[number]> = {
			success: true,
			message: "Platform updated successfully",
			data: updatedPlatform,
		};
		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		res.status(500).json(errorResponse);
	}
});

// Update a platform
PlatformsRouter.patch("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, imageUrl } = req.body;

		const checkPlatformExists = await checkTableExistsPromiseWithId(
			platforms,
			id
		);

		if (checkPlatformExists.length === 0) {
			throw new Error("Platform not found");
		}

		const updatedPlatform = await db
			.update(platforms)
			.set({ name, description, imageUrl })
			.where(eq(platforms.id, id))
			.returning();

		const response: ApiResponse<(typeof updatedPlatform)[number]> = {
			success: true,
			message: "Platform updated successfully",
			data: updatedPlatform,
		};
		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		res.status(500).json(errorResponse);
	}
});

// Delete a platform
// TODO : Only by admin
PlatformsRouter.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const deletedPlatform = await db
			.delete(platforms)
			.where(eq(platforms.id, id))
			.returning({ id: platforms.id });
		const response: ApiResponse<(typeof deletedPlatform)[number]> = {
			success: true,
			message: "Platform deleted successfully",
			data: deletedPlatform,
			metadata: {
				total: deletedPlatform.length,
			},
		};
		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		res.status(500).json(errorResponse);
	}
});

// TODOS : All categories under platform
// TODDO : All tools under platform and categories

// API Helpers
const fetchAllCategoriesUnderPlatform = async (platformId: string) => {
	const allCategories = await db
		.select(
			// @ts-ignore
			{
				...categories,
				// categoryPlatform: categoryPlatform,
			}
		)
		.from(categoryPlatform)
		.leftJoin(categories, eq(categoryPlatform.categoryId, categories.id))
		.where(eq(categoryPlatform.platformId, platformId));
	return allCategories;
};

// TODO : Fetch all tools under platform and categories
