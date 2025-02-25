# API GUIDELINES

## 1. API Response Structure

```ts
// Successful Response
const response: ApiResponse<(typeof platformsList)[number]> = {
	success: true,
	message: "Platforms fetched successfully",
	data: platformsList,
	metadata: metadata as ApiMetadata,
};
res.status(200).json(response);

// Error Response
const errorResponse: ApiResponse<null> = {
	success: false,
	message: "Internal Server Error",
	data: [], // or null, if no data to return on error
	error: {
		code: 500,
		message: (error as Error).message,
		details: (error as Error).stack,
	},
};
res.status(500).json(errorResponse);
```

## 2. Modular Pagination and Sorting Logic (Helper Functions)

```ts
// ... (getPaginationParams, getSortingDirection, getPaginationMetadata functions as you provided) ...

// Usage in endpoint:
const { sortBy, order, page, limit, offset } = getPaginationParams(req.query, [
	"createdAt",
	"name",
]);
const orderDirection = getSortingDirection(order);
// ... (Drizzle query using sortBy, orderDirection, limit, offset) ...
const metadata = getPaginationMetadata(totalItems, page, limit, sortBy, order);
```

## 3. Descriptive Error Handling and Status Codes

```ts
try {
	// ... endpoint logic ...
} catch (error) {
	const errorResponse: ApiResponse<null> = {
		success: false,
		message: "Internal Server Error", // User-friendly message
		data: [],
		error: {
			code: 500, // HTTP status code
			message: (error as Error).message, // Technical error message for debugging
			details: (error as Error).stack, // Error stack trace (consider logging only, not sending to client in production for security)
		},
	};
	res.status(500).json(errorResponse);
}
```

## 4. Input Validation and Sanitization

```ts
// In getPaginationParams or within endpoint handler:
const rawPage = req.query.page;
const page = Number(rawPage);
if (isNaN(page) || page < 1) {
    // Handle invalid page - return error response
    return res.status(400).json({ ... /* ApiResponse error */ });
}

// For string inputs (search, category, platform, tag filters):
const searchQuery = (req.query.search as string)?.trim(); // Sanitize - trim whitespace
// ... more validation and sanitization as needed ...
```

# Hierachy of API Fetching

/\*
Guidelines for Hierarchical Data Queries:

1. Base Entity First

   - Always fetch the main/parent entity first with its pagination/sorting
   - Keep the initial query focused on the primary table
     Example:
     const platforms = await db.select().from(platforms);

2. Related Data as Nested Properties

   - Fetch related data in a separate query using the parent IDs
   - Use meaningful property names for nested data
   - Consider using Promise.all for parallel fetching
     Example:
     const platformWithRelations = await Promise.all(
     platforms.map(async platform => ({
     ...platform,
     categories: await fetchCategories(platform.id),
     tools: await fetchTools(platform.id)
     }))
     );

3. Reusable Query Functions

   - Create helper functions for commonly used relation queries
   - Keep the logic for fetching related data consistent
     Example:
     async function fetchPlatformCategories(platformId: string) {
     return db
     .select({
     categoryId: categories.id,
     categoryName: categories.name
     })
     .from(categoryPlatform)
     .leftJoin(categories, eq(categoryPlatform.categoryId, categories.id))
     .where(eq(categoryPlatform.platformId, platformId));
     }

4. Response Structure
   {
   success: true,
   data: [{
   id: "platform-id",
   name: "Platform Name",
   categories: [{...}], // Nested related data
   tools: [{...}] // Nested related data
   }],
   metadata: {...}
   }

5. Error Handling
   - Maintain consistent error structure across nested queries
   - Use try-catch blocks effectively for nested operations
     \*/

```ts
// Helper functions for reusable queries
async function fetchPlatformCategories(platformId: string) {
	return db
		.select({
			categoryId: categories.id,
			categoryName: categories.name,
			categoryDescription: categories.description,
		})
		.from(categoryPlatform)
		.leftJoin(categories, eq(categoryPlatform.categoryId, categories.id))
		.where(eq(categoryPlatform.platformId, platformId));
}

async function fetchPlatformTools(platformId: string) {
	return db
		.select({
			toolId: tools.id,
			toolName: tools.name,
			// ... other tool fields
		})
		.from(platformTools)
		.leftJoin(tools, eq(platformTools.toolId, tools.id))
		.where(eq(platformTools.platformId, platformId));
}

// Example endpoint using the guidelines
PlatformsRouter.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// 1. Fetch base entity
		const platform = await db
			.select()
			.from(platforms)
			.where(eq(platforms.id, id))
			.limit(1);

		if (platform.length === 0) {
			throw new Error("Platform not found");
		}

		// 2. Fetch related data
		const [categories, tools] = await Promise.all([
			fetchPlatformCategories(id),
			fetchPlatformTools(id),
		]);

		// 3. Construct hierarchical response
		const enrichedPlatform = {
			...platform[0],
			categories,
			tools,
		};

		const response: ApiResponse<typeof enrichedPlatform> = {
			success: true,
			message: "Platform fetched successfully",
			data: enrichedPlatform,
		};

		res.status(200).json(response);
	} catch (error) {
		const errorResponse = createApiErrorResponse(error);
		res.status(500).json(errorResponse);
	}
});
```
