# API GUIDELINES

## 1. API Response Structure

```ts
// Successful Response
const response: ApiResponse<(typeof platformsList)[number]> = {
  success: true,
  message: "Platforms fetched successfully",
  data: platformsList,
  metadata: metadata as ApiMetadata,
}
res.status(200).json(response)

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
}
res.status(500).json(errorResponse)
```

## 2. Modular Pagination and Sorting Logic (Helper Functions)

```ts
// ... (getPaginationParams, getSortingDirection, getPaginationMetadata functions as you provided) ...

// Usage in endpoint:
const { sortBy, order, page, limit, offset } = getPaginationParams(req.query, [
  "createdAt",
  "name",
])
const orderDirection = getSortingDirection(order)
// ... (Drizzle query using sortBy, orderDirection, limit, offset) ...
const metadata = generatePaginationMetadata(
  totalItems,
  page,
  limit,
  sortBy,
  order
)
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
  }
  res.status(500).json(errorResponse)
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
