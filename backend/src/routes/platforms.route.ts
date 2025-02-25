import { AnyColumn, eq, ilike } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db/db";
import { platforms } from "../db/schema";
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
		const orderDirection = getSortingDirection(order);
		// Fetch total count
		const totalItems = await db.$count(platforms);

		// Fetch paginated data
		const platformsList = await db
			.select()
			.from(platforms)
			.orderBy(
				orderDirection(platforms[sortBy as keyof typeof platforms] as AnyColumn)
			)
			.limit(limit)
			.offset(offset);

		// const totalPages = Math.ceil( totalItems / limit );
		const metadata = getPaginationMetadata(
			totalItems,
			page,
			limit,
			sortBy,
			order
		);
		// console.log( metadata );

		// Construct response using `ApiResponse`
		const response: ApiResponse<(typeof platformsList)[number]> = {
			success: true,
			message: "Platforms fetched successfully",
			data: platformsList,
			metadata: metadata as ApiMetadata,
		};
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
