import { inArray } from "drizzle-orm";
import { db } from "./db/db";
import { categories, categoryPlatform, platforms } from "./db/schema";
import { platform } from "os";

const getAllCategoriesForPlatforms_Promise = async (
	// queries: any,
	// orderDirection: any,
	platformIds: string[]
) => {
	console.log("Fetching from categoryPlatform..... ");
	const categoryPlatformData = await db
		.select()
		.from(categoryPlatform)
		.where(inArray(categoryPlatform.platformId, platformIds));

	console.log("Fetched from categoryPlatform ✅ ", categoryPlatformData);

	const categoriesIds = categoryPlatformData.map((res) => res.categoryId);

	console.log("Fetching from category data..... ");

	const categoriesData = await db
		.select()
		.from(categories)
		.where(inArray(categories.id, categoriesIds));
	console.log("Fetched from categories ✅ ");

	// const platformsData = await db
	// 	.select()
	// 	.from(platforms)
	// 	.where(inArray(platforms.id, platformIds));
	// console.log("Fetched from platforms ✅ ");

	return categoriesData;
};
console.log(
	getAllCategoriesForPlatforms_Promise([
		"00000000-0000-0000-0000-000000000001",
		"00000000-0000-0000-0000-000000000003",
	])
);
