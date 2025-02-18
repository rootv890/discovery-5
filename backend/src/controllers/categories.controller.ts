import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { categories, toolCategoryPlatform as categoruPlatform, NewCategoryType, categoryPlatform } from "../db/schema";
import { doesCategoryExists, doesCategoryExistsByName } from "../utils/apiHelpers";

export async function getCategoriesForPlatform ( platformId: string ) {
  // TODO:  select only category related data
  try {

    const categoriesForPlatform = await db
      .select()
      .from( categoryPlatform )
      .innerJoin( categories,
        eq( categories.id, categoryPlatform.categoryId )
      )
      .where( eq( categoryPlatform.platformId, platformId ) );

    // Total items from the categoriesForPlatform
    const totalItems = categoriesForPlatform.length;

    return {
      categories: categoriesForPlatform,
      totalItems,
    };

  } catch ( error ) {
    throw new Error( 'Failed to get categories for platform' );
  }
}


/**
 * Workflow:
 * 1. Create a category
 * 2. Create a category platform
 * 3. Return the category
 */


export async function createCategoryForPlatform ( platformId: string, category: typeof NewCategoryType ) {

  try {

    // 1. Create a category

    //  Check if category already exists

    if ( await doesCategoryExistsByName( category.name ) ) {
      console.log( first );

      throw new Error( 'Category already exists' );
    }

    // MANY TO MANY RELATIONSHIP between category and platform
    const createCategory = await db.insert( categories ).values( {
      id: category.id,
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
    } ).returning();

    // 2. Create a category platform
    const createCategoryPlatform = await db.insert( categoryPlatform ).values( {
      categoryId: category.id,
      platformId,
    } ).returning();

    // 3. Return the category
    return {
      category: createCategory,
      categoryPlatform: createCategoryPlatform,
    };

  } catch ( error ) {
    console.log( error );
    throw new Error( 'Failed to create category for platform' );
  }
}
