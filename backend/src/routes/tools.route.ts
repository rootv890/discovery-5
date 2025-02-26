import { raw, Router } from "express"
import {
	createApiErrorResponse,
	getPaginationMetadata,
	getPaginationParams,
	getSortingDirection,
} from "@/utils/apiHelpers"
import { db } from "@/db/db"
import {
	categories,
	categoryPlatform,
	platforms,
	toolCategoryPlatform,
	tools,
} from "@/db/schema"
import { and, desc, eq, inArray, isNull, or } from "drizzle-orm"
import { ApiMetadata, ApiResponse } from "@/type"
import { checkMissingFields } from "@/utils/apiUtils"

/* Routes */
export const ToolsRouter = Router()
/**
 * Tools API Endpoints 🛠️
 * Comprehensive set of routes for tool management and discovery
 */

// Basic CRUD Operations 📋
// GET Endpoints
// - Retrieve Tools
//  	✅ Get all tools
//  	✅ Get tool by specific ID
//  	✅ Get all tools with category and platform (one of them can be optional)
//    ✅ Filter tools by category
//    Filter tools by platform
//    Retrieve tools from user's collection
//    Fetch deleted tools from user's tool bin
//    List banned tools

// Modification Endpoints 🔧
// - Tool Management
//   ✅ Create new tool
//   ✅ Update existing tool
//   ✅ Delete tool
//   ✅ Ban tool
//   ✅ Unban tool

/**
 * Phase 2 Enhancements 🚀
 * Advanced Discovery Features
 */
// Discovery Endpoints
//   🔥 Top tools ranking
//   📈 Trending tools
//   🆕 Newest tools
//   👍 Most liked tools
//   💬 Most commented tools
//   👀 Most viewed tools

/*
 * Development Roadmap 🗺️
 * TODO: Migrate controllers and helpers to dedicated folders after success
 */

ToolsRouter.get("/c/:categoryId", async (req, res) => {
	const { categoryId } = req.params
	const { sortBy, order, page, limit, offset } = getPaginationParams(
		req.query,
		[
			"createdAt",
			"name",
			"votes",
			"comments",
			"views",
			"isNew",
			"isFeatured",
			"isTrending",
			"isPopular",
			"isRecent",
		]
	)

	const orderDirection = getSortingDirection(order)

	// One of them can be optional
	if (!categoryId) {
		res.status(400).json({
			success: false,
			message: "Category ID is required",
		})
	}
	try {
		const toolsData = await db
			.selectDistinct({
				tool: tools,
				category: {
					id: categories.id,
					name: categories.name,
				},
				platform: {
					id: platforms.id,
					name: platforms.name,
				},
			})
			.from(tools)
			.leftJoin(toolCategoryPlatform, eq(tools.id, toolCategoryPlatform.toolId))
			.leftJoin(
				categoryPlatform,
				eq(toolCategoryPlatform.categoryPlatformId, categoryPlatform.id)
			)
			.leftJoin(categories, eq(categoryPlatform.categoryId, categories.id))
			.leftJoin(platforms, eq(categoryPlatform.platformId, platforms.id))
			.where(eq(categories.id, categoryId))
			.offset(offset)
			.limit(limit)
			.orderBy(
				orderDirection[sortBy as keyof typeof orderDirection] ??
					desc(tools.createdAt)
			)

		console.log("Tools Data", toolsData)

		const response: ApiResponse<(typeof toolsData)[number]> = {
			success: true,
			message: "Successfully fetched tools",
			data: toolsData,
		}

		const metadata: ApiMetadata = await getPaginationMetadata(
			page,
			limit,
			sortBy,
			order,
			tools
		)

		res.status(200).json({
			...response,
			metadata,
		})
	} catch (error) {
		const errorResponse = createApiErrorResponse(error)
		console.log(
			"Error fetching tools by category and platform ❌",
			errorResponse
		)
		res.status(500).json(errorResponse)
	}
})
/* TODO : */

ToolsRouter.get("/:id", async (req, res) => {
	try {
		const { id } = req.params
		if (!id) {
			res.status(400).json({
				success: false,
				message: "Tool ID is required",
			})
		}

		const rawTool = await db.select().from(tools).where(eq(tools.id, id))
		if (!rawTool) {
			res.status(404).json({
				success: false,
				message: "Tool not found",
			})
		}

		// Append its categories and platforms
		const toolCategoryPlatformData = await Promise.all(
			rawTool.map(async (tool) => {
				const toolCategoryPlatformList = await db
					.select({
						category: categories,
						platform: platforms,
					})
					.from(toolCategoryPlatform)
					.leftJoin(
						categoryPlatform,
						eq(toolCategoryPlatform.categoryPlatformId, categoryPlatform.id)
					)
					.leftJoin(categories, eq(categoryPlatform.categoryId, categories.id))
					.leftJoin(platforms, eq(categoryPlatform.platformId, platforms.id))
					.where(eq(toolCategoryPlatform.toolId, tool.id))

				return {
					...tool,
					toolCategoryPlatformList,
				}
			})
		)

		res.status(200).json({
			success: true,
			message: "Tool fetched successfully",
			data: toolCategoryPlatformData,
		})
	} catch (error) {
		const errorResponse = createApiErrorResponse(error)
		console.log("Error fetching tool ❌", errorResponse)
		res.status(500).json(errorResponse)
	}
})

// Get all tools

ToolsRouter.get("/", async (req, res) => {
	try {
		const { sortBy, order, page, limit, offset } = getPaginationParams(
			req.query,
			[
				"createdAt",
				"name",
				"votes",
				"comments",
				"views",
				"isNew",
				"isFeatured",
				"isTrending",
				"isPopular",
				"isRecent",
			]
		)

		const orderDirection = getSortingDirection(order)

		const toolsData = await getAllTools({})

		const response: ApiResponse<(typeof toolsData)[number]> = {
			success: true,
			message: "Successfully fetched tools",
			data: toolsData,
		}

		const metadata: ApiMetadata = await getPaginationMetadata(
			page,
			limit,
			sortBy,
			order,
			tools
		)

		console.log("Metadata", metadata)
		res.status(200).json({
			...response,
			metadata,
		})
	} catch (error) {
		const errorResponse = createApiErrorResponse(error)
		console.log("Error fetching tools ❌", errorResponse)
		res.status(500).json(errorResponse)
	}
})

// API HELPERS
interface getAllToolsProps {
	toolId?: string
}
const getAllTools = async ({ toolId }: getAllToolsProps) => {
	let rawTools
	if (toolId) {
		rawTools = await db.select().from(tools).where(eq(tools.id, toolId))
	} else {
		rawTools = await db.select().from(tools)
	}

	console.log("Raw Tools", rawTools)

	if (!rawTools) {
		return []
	}

	const toolCategoryPlatformData = await Promise.all(
		rawTools.map(async (tool) => {
			const toolCategoryPlatformList = await db
				.selectDistinct({
					category: {
						id: categories.id,
						name: categories.name,
					},
					platform: {
						id: platforms.id,
						name: platforms.name,
					},
				})
				.from(toolCategoryPlatform)
				.leftJoin(
					categoryPlatform,
					eq(toolCategoryPlatform.categoryPlatformId, categoryPlatform.id)
				)
				.leftJoin(categories, eq(categoryPlatform.categoryId, categories.id))
				.leftJoin(platforms, eq(categoryPlatform.platformId, platforms.id))
				.where(eq(toolCategoryPlatform.toolId, tool.id))

			return {
				...tool,
				categoriesAndPlatforms: toolCategoryPlatformList,
			}
		})
	)
	return toolCategoryPlatformData
}

// Filter tools by platformId
ToolsRouter.get("/p/:platformId", async (req, res) => {
	const { platformId } = req.params
	const { sortBy, order, page, limit, offset } = getPaginationParams(
		req.query,
		[
			"createdAt",
			"name",
			"votes",
			"comments",
			"views",
			"isNew",
			"isFeatured",
			"isTrending",
		]
	)

	const orderDirection = getSortingDirection(order)

	try {
		// FROM tools -> LJ toolCategoryPlatform -> LJ categoryPlatform -> LJ platforms
		const toolsData = await db
			.selectDistinct({
				tool: tools,

				platform: {
					id: platforms.id,
					name: platforms.name,
				},
			})
			.from(tools)
			.leftJoin(toolCategoryPlatform, eq(tools.id, toolCategoryPlatform.toolId))
			.leftJoin(
				categoryPlatform,
				eq(toolCategoryPlatform.categoryPlatformId, categoryPlatform.id)
			)
			.leftJoin(platforms, eq(categoryPlatform.platformId, platforms.id))
			.where(eq(platforms.id, platformId))
			.orderBy(
				orderDirection[sortBy as keyof typeof orderDirection] ??
					desc(tools.createdAt)
			)
			.offset(offset)
			.limit(limit)

		res.json({
			success: true,
			message: "Successfully fetched tools",
			data: toolsData,
		})
	} catch (error) {
		const errorResponse = createApiErrorResponse(error)
		console.log("Error fetching tools by platformId ❌", errorResponse)
		res.status(500).json(errorResponse)
	}
})
