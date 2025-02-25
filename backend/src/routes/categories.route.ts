import { Router } from "express";

export const CategoriesRouter = Router();

// Get all categories
CategoriesRouter.get("/", (req, res) => {
	res.send("Hello World");
});

// Get all categories under all platforms
CategoriesRouter.get("/all", (req, res) => {
	res.send("Hello World");
});

// Get all categories under particular platform
CategoriesRouter.get("/all/:platformId", (req, res) => {
	res.send("Hello World");
});

// Get category under particular platform
CategoriesRouter.get("/:platformId/:categoryId", (req, res) => {
	res.send("Hello World");
});

// Create category under particular platforms
CategoriesRouter.post("/:platformIds", (req, res) => {
	res.send("create category ");
});

// Update category under particular platformIds and categoryId
CategoriesRouter.put("/:platformIds/:categoryId", (req, res) => {
	res.send("update category");
});

// Delete category under particular platforms
CategoriesRouter.delete("/:platformIds/:categoryId", (req, res) => {
	res.send("delete category");
});

// Delete all categories
CategoriesRouter.delete("/all/:id", (req, res) => {
	res.send("delete all categories");
});
