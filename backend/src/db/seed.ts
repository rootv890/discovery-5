import { db } from "@/db/db";
import {
	categories,
	platforms,
	categoryPlatform,
	toolCategoryPlatform,
	tools,
} from "@/db/schema";

async function seed() {
	try {
		// Clean up existing data
		await db.delete(toolCategoryPlatform);
		await db.delete(tools);
		await db.delete(categoryPlatform);
		await db.delete(categories);
		await db.delete(platforms);
		console.log("🧹 Cleaned up existing data");

		// Sample platforms with explicit IDs
		const samplePlatforms = [
			{
				id: "00000000-0000-0000-0000-000000000001",
				name: "Web",
				description: "Browser-based tools",
				imageUrl: "/images/platforms/web.svg",
			},
			{
				id: "00000000-0000-0000-0000-000000000002",
				name: "iOS",
				description: "Tools for iOS devices",
				imageUrl: "/images/platforms/ios.svg",
			},
			{
				id: "00000000-0000-0000-0000-000000000003",
				name: "Android",
				description: "Tools for Android devices",
				imageUrl: "/images/platforms/android.svg",
			},
			{
				id: "00000000-0000-0000-0000-000000000004",
				name: "Windows",
				description: "Tools for Windows OS",
				imageUrl: "/images/platforms/windows.svg",
			},
			{
				id: "00000000-0000-0000-0000-000000000005",
				name: "macOS",
				description: "Tools for macOS",
				imageUrl: "/images/platforms/macos.svg",
			},
			{
				id: "00000000-0000-0000-0000-000000000006",
				name: "Linux",
				description: "Tools for Linux OS",
				imageUrl: "/images/platforms/linux.svg",
			},
		];

		// Sample categories with explicit IDs
		const sampleCategories = [
			{
				id: "00000000-0000-0000-0000-000000000101",
				name: "UI Design",
				description: "Tools for user interface design",
				imageUrl: "/images/categories/ui-design.svg",
				platformConstraint: "NONE",
			},
			{
				id: "00000000-0000-0000-0000-000000000102",
				name: "3D Modeling",
				description: "Tools for 3D design and modeling",
				imageUrl: "/images/categories/3d-modeling.svg",
				platformConstraint: "SINGLE",
			},
			{
				id: "00000000-0000-0000-0000-000000000103",
				name: "Prototyping",
				description: "Tools for creating interactive prototypes",
				imageUrl: "/images/categories/prototyping.svg",
				platformConstraint: "NONE",
			},
			{
				id: "00000000-0000-0000-0000-000000000104",
				name: "Icon Design",
				description: "Tools for creating icons",
				imageUrl: "/images/categories/icon-design.svg",
				platformConstraint: "SINGLE",
			},
			{
				id: "00000000-0000-0000-0000-000000000105",
				name: "Animation",
				description: "Tools for creating animations",
				imageUrl: "/images/categories/animation.svg",
				platformConstraint: "NONE",
			},
		];

		// Category-Platform relationships with explicit IDs
		const categoryPlatformRelations = [
			// UI Design (works on all platforms)
			{
				id: "00000000-0000-0000-0000-000000000201",
				categoryId: "00000000-0000-0000-0000-000000000101",
				platformId: "00000000-0000-0000-0000-000000000001", // Web
			},
			{
				id: "00000000-0000-0000-0000-000000000202",
				categoryId: "00000000-0000-0000-0000-000000000101",
				platformId: "00000000-0000-0000-0000-000000000005", // macOS
			},
			// 3D Modeling (platform specific)
			{
				id: "00000000-0000-0000-0000-000000000203",
				categoryId: "00000000-0000-0000-0000-000000000102",
				platformId: "00000000-0000-0000-0000-000000000004", // Windows
			},
			// Prototyping (multi-platform)
			{
				id: "00000000-0000-0000-0000-000000000204",
				categoryId: "00000000-0000-0000-0000-000000000103",
				platformId: "00000000-0000-0000-0000-000000000001", // Web
			},
			{
				id: "00000000-0000-0000-0000-000000000205",
				categoryId: "00000000-0000-0000-0000-000000000103",
				platformId: "00000000-0000-0000-0000-000000000002", // iOS
			},
			// Icon Design (platform specific)
			{
				id: "00000000-0000-0000-0000-000000000206",
				categoryId: "00000000-0000-0000-0000-000000000104",
				platformId: "00000000-0000-0000-0000-000000000005", // macOS
			},
			// Animation (multi-platform)
			{
				id: "00000000-0000-0000-0000-000000000207",
				categoryId: "00000000-0000-0000-0000-000000000105",
				platformId: "00000000-0000-0000-0000-000000000001", // Web
			},
			{
				id: "00000000-0000-0000-0000-000000000208",
				categoryId: "00000000-0000-0000-0000-000000000105",
				platformId: "00000000-0000-0000-0000-000000000003", // Android
			},
		];

		// Sample tools with explicit IDs
		const sampleTools = [
			{
				id: "00000000-0000-0000-0000-000000000301",
				name: "Figma",
				description: "Professional collaborative interface design tool",
				imageUrl: "/images/tools/figma.jpg",
				thumbnailUrls: {
					small: "/images/tools/figma-sm.jpg",
					medium: "/images/tools/figma-md.jpg",
					large: "/images/tools/figma-lg.jpg",
				},
				approvalStatus: "APPROVED",
				isNew: false,
			},
			{
				id: "00000000-0000-0000-0000-000000000302",
				name: "Blender",
				description: "Free and open-source 3D creation suite",
				imageUrl: "/images/tools/blender.jpg",
				thumbnailUrls: {
					small: "/images/tools/blender-sm.jpg",
					medium: "/images/tools/blender-md.jpg",
					large: "/images/tools/blender-lg.jpg",
				},
				approvalStatus: "APPROVED",
				isNew: false,
			},
			{
				id: "00000000-0000-0000-0000-000000000303",
				name: "Principle",
				description: "Create animated and interactive user interface designs",
				imageUrl: "/images/tools/principle.jpg",
				thumbnailUrls: {
					small: "/images/tools/principle-sm.jpg",
					medium: "/images/tools/principle-md.jpg",
					large: "/images/tools/principle-lg.jpg",
				},
				approvalStatus: "APPROVED",
				isNew: true,
			},
			{
				id: "00000000-0000-0000-0000-000000000304",
				name: "IconJar",
				description: "Icon organization and management tool",
				imageUrl: "/images/tools/iconjar.jpg",
				thumbnailUrls: {
					small: "/images/tools/iconjar-sm.jpg",
					medium: "/images/tools/iconjar-md.jpg",
					large: "/images/tools/iconjar-lg.jpg",
				},
				approvalStatus: "APPROVED",
				isNew: false,
			},
			{
				id: "00000000-0000-0000-0000-000000000305",
				name: "Lottie",
				description: "Lightweight animation tool for web and mobile",
				imageUrl: "/images/tools/lottie.jpg",
				thumbnailUrls: {
					small: "/images/tools/lottie-sm.jpg",
					medium: "/images/tools/lottie-md.jpg",
					large: "/images/tools/lottie-lg.jpg",
				},
				approvalStatus: "APPROVED",
				isNew: true,
			},
		];

		// Tool-CategoryPlatform relationships with explicit IDs
		const toolCategoryPlatformRelations = [
			// Figma: UI Design on Web and macOS
			{
				id: "00000000-0000-0000-0000-000000000401",
				toolId: "00000000-0000-0000-0000-000000000301",
				categoryPlatformId: "00000000-0000-0000-0000-000000000201", // UI Design + Web
			},
			{
				id: "00000000-0000-0000-0000-000000000402",
				toolId: "00000000-0000-0000-0000-000000000301",
				categoryPlatformId: "00000000-0000-0000-0000-000000000202", // UI Design + macOS
			},
			// Blender: 3D Modeling on Windows
			{
				id: "00000000-0000-0000-0000-000000000403",
				toolId: "00000000-0000-0000-0000-000000000302",
				categoryPlatformId: "00000000-0000-0000-0000-000000000203", // 3D Modeling + Windows
			},
			// Principle: Prototyping on Web and iOS
			{
				id: "00000000-0000-0000-0000-000000000404",
				toolId: "00000000-0000-0000-0000-000000000303",
				categoryPlatformId: "00000000-0000-0000-0000-000000000204", // Prototyping + Web
			},
			{
				id: "00000000-0000-0000-0000-000000000405",
				toolId: "00000000-0000-0000-0000-000000000303",
				categoryPlatformId: "00000000-0000-0000-0000-000000000205", // Prototyping + iOS
			},
			// IconJar: Icon Design on macOS
			{
				id: "00000000-0000-0000-0000-000000000406",
				toolId: "00000000-0000-0000-0000-000000000304",
				categoryPlatformId: "00000000-0000-0000-0000-000000000206", // Icon Design + macOS
			},
			// Lottie: Animation on Web and Android
			{
				id: "00000000-0000-0000-0000-000000000407",
				toolId: "00000000-0000-0000-0000-000000000305",
				categoryPlatformId: "00000000-0000-0000-0000-000000000207", // Animation + Web
			},
			{
				id: "00000000-0000-0000-0000-000000000408",
				toolId: "00000000-0000-0000-0000-000000000305",
				categoryPlatformId: "00000000-0000-0000-0000-000000000208", // Animation + Android
			},
		];

		// Insert all data in sequence
		await db.insert(platforms).values(samplePlatforms);
		console.log("✅ Platforms seeded");

		await db.insert(categories).values(sampleCategories);
		console.log("✅ Categories seeded");

		await db.insert(categoryPlatform).values(categoryPlatformRelations);
		console.log("✅ Category-Platform relationships seeded");

		await db.insert(tools).values(sampleTools);
		console.log("✅ Tools seeded");

		await db.insert(toolCategoryPlatform).values(toolCategoryPlatformRelations);
		console.log("✅ Tool-Category-Platform relationships seeded");

		console.log("🌱 Seeding completed successfully");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		throw error;
	}
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => {
		process.exit(0);
	});
