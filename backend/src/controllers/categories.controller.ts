import { and, eq, inArray } from "drizzle-orm";
import { db } from "../db/db";
import { categories, toolCategoryPlatform, NewCategoryType, categoryPlatform } from "../db/schema";
import { doesCategoryExists, doesCategoryExistsByName, doesPlatformExists } from "../utils/apiHelpers";
import { isValidUUID } from "../utils/apiUtils";
import { devConsole } from "../utils/utils";
import { ApiResponse } from "../type";

// export async function getCategoriesForPlatform ( platformId: string ) {
//   // TODO:  select only category related data
//   try {

//     const categoriesForPlatform = await db
//       .select()
//       .from( categoryPlatform )
//       .innerJoin( categories,
//         eq( categories.id, categoryPlatform.categoryId )
//       )
//       .where( eq( categoryPlatform.platformId, platformId ) );

//     // Total items from the categoriesForPlatform
//     const totalItems = categoriesForPlatform.length;

//     return {
//       categories: categoriesForPlatform,
//       totalItems,
//     };

//   } catch ( error ) {
//     throw new Error( 'Failed to get categories for platform' );
//   }
// }


/**
 * Workflow:
 * 1. Create a category
 * 2. Create a category platform
 * 3. Return the category
 */


export async function createCategory ( category: typeof NewCategoryType, platformId?: string ) {

  try {
    const newCategory = await db.insert( categories ).values( category ).returning();

    if ( category.platformConstraint === "SINGLE" && platformId ) {
      await db.insert( categoryPlatform ).values( {
        categoryId: newCategory[ 0 ].id,
        platformId,
      } );
    }
    return newCategory;
  } catch ( error ) {
    // send to response
    throw error;
  }
}


// Get all categories for a platform


export const getAllCatsFromPlatform = async ( platformId: String ) => {
  //  cats == categories
  try {
    // Validate platformId
    if ( !isValidUUID( platformId as string ) ) {
      throw new Error( "Invalid platformId" );
    }

    // Platform Check
    if ( !await doesPlatformExists( platformId as string ) ) {
      throw new Error( "Platform not found" );
    }

    const allCats = await db.select().from( categoryPlatform ).where( eq( categoryPlatform.platformId, platformId as string ) );

    const allCatsId = allCats.map( cat => cat.categoryId );
    console.table( allCatsId );

    const allCatsDetails = await db.select().from( categories ).where( inArray( categories.id, allCatsId ) );
    console.log( "allCatsDetails", allCatsDetails );
    return allCatsDetails;
  } catch ( error ) {
    throw error;
  }
};



export const addCatToMultiplePlatForms = async ( { catId, platformIds }: { catId: string, platformIds: string[]; } ) => {
  try {

    platformIds = platformIds.map( id => id.trim() );
    // Validate catId and platformIds
    if ( !isValidUUID( catId ) ) {
      throw new Error( "Invalid catId" );
    }

    if ( platformIds.some( id => !isValidUUID( id ) ) ) {
      throw new Error( "Invalid platformIds" );
    }
    // Cat Exists
    const catExists = await db.select().from( categories ).where( eq( categories.id, catId ) );

    // IF SINGLE and platformIds.length > 1, throw error
    if ( !catExists ) {
      throw new Error( "Category not found" );
    }
    devConsole( 'info', 'catExists', catExists );
    if ( catExists[ 0 ].platformConstraint === "SINGLE" && platformIds.length > 1 ) {
      throw new Error( "Category is single platform and adding to multiple platforms is Illegal" );
    }
    // Platforms Exists
    const platformsExists = await Promise.all( platformIds.map( async ( id ) => await doesPlatformExists( id ) ) );

    if ( platformsExists.some( exists => !exists ) ) {
      throw new Error( "Platform not found" );
    }

    // Check if cat is already in the platforms
    const catInPlatforms = await db.select().from( categoryPlatform ).where( inArray( categoryPlatform.categoryId, [ catId ] ) );
    devConsole( 'table', 'catInPlatforms', catInPlatforms );

    // Check for duplications same cat and plat
    const duplications = platformIds.filter( id => catInPlatforms.some( cat => cat.platformId === id ) );

    // Skip duplications
    const uniquePlatformIds = platformIds.filter( id => {
      devConsole( "info", `Skipping ${ id } because it already exists` );
      return !duplications.includes( id );
    } );

    devConsole( "info", 'uniquePlatformIds', uniquePlatformIds );
    // Add cat to platforms
    const addCatToPlatforms = await db.insert( categoryPlatform ).values( uniquePlatformIds.map( id => ( { categoryId: catId, platformId: id } ) ) ).returning();
    return addCatToPlatforms;

  } catch ( error ) {
    devConsole( 'error', 'Error in addCatToMultiplePlatForms', error );
    throw error;
  }
};


export const removeCatFromPlatforms = async ( { catId, platformIds }: { catId: string, platformIds: string[]; } ) => {
  try {

    // Sanitize platformIds
    platformIds = platformIds.map( id => id.trim() );

    // Validate catId and platformIds
    if ( !isValidUUID( catId ) ) {
      throw new Error( "Invalid catId" );
    }

    if ( platformIds.some( id => !isValidUUID( id ) ) ) {
      throw new Error( "Invalid platformIds" );
    }

    // Cat Exists
    const catExists = await db.select().from( categories ).where( eq( categories.id, catId.trim() ) );
    if ( !catExists ) {
      throw new Error( "Category not found" );
    }

    // Platforms Exists
    const platformsExists = await Promise.all( platformIds.map( async ( id ) => await doesPlatformExists( id ) ) );
    if ( platformsExists.some( exists => !exists ) ) {
      throw new Error( "Platform not found" );
    }

    // Check if cat is in the platforms
    const catInPlatforms = await db.select().from( categoryPlatform ).where( and( eq( categoryPlatform.categoryId, catId ), inArray( categoryPlatform.platformId, platformIds ) ) );
    if ( catInPlatforms.length === 0 ) {
      throw new Error( "Category not found in platforms" );
    }

    // 🚀 Bulk delete
    const deleted = await db.delete( categoryPlatform )
      .where(
        and(
          eq( categoryPlatform.categoryId, catId ),
          inArray( categoryPlatform.platformId, platformIds )
        )
      );

    const response: ApiResponse<typeof deleted> = {
      success: true,
      message: `Category ${ catId } removed from platforms ${ platformIds.join( ', ' ) }`,
      data: deleted as any,
    };

    return response;

  } catch ( error ) {
    devConsole( 'error', 'Error in removeCatFromPlatforms', error );
    throw error;
  }
};

export const deleteCategory = async ( catId: string ) => {
  try {

    const deleted = await db.delete( categories ).where( eq( categories.id, catId ) ).returning( {
      id: categories.id,
      name: categories.name,
    } );
    const response: ApiResponse<typeof deleted> = {
      success: true,
      message: `Category ${ catId } - ${ deleted[ 0 ].name } deleted`,
      data: deleted as any,
    };
    return response;
  } catch ( error ) {
    devConsole( 'error', 'Error in deleteCategory', error );
    throw error;
  }
};
