import { Router } from 'express';
import { db } from '../db/db';
import { createApiErrorResponse, doesPlatformExists, getNameFromId, getPaginationMetadata, getPaginationParams, getSortingDirection } from '../utils/apiHelpers';
import { categories, platforms, NewCategoryType } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AnyColumn } from 'drizzle-orm';
import { ApiMetadata } from '../type';
import { ApiResponse } from '../type';
import { createCategoryForPlatform, getCategoriesForPlatform } from '../controllers/categories.controller';

export const categoriesRouter = Router();

categoriesRouter.get( '/', async ( req, res ) => {


  const { page, limit, offset, sortBy, order } = getPaginationParams( req.query, [ 'name', 'createdAt', 'updatedAt' ] );
  const orderBy = getSortingDirection( order );
  try {
    const totalItems = await db.$count( categories );
    const categoriesList = await db.select().from( categories ).orderBy( orderBy( categories[ sortBy as keyof typeof categories ] as AnyColumn ) ).limit( limit ).offset( offset );

    const metadata = getPaginationMetadata( totalItems, page, limit, sortBy, order );

    // Construct response using `ApiResponse`
    const response: ApiResponse<typeof categoriesList[ number ]> = {
      success: true,
      message: 'Categories fetched successfully',
      data: categoriesList,
      metadata: metadata as ApiMetadata,
    };

    res.status( 200 ).json( response );


  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }

} );

// All categories under a parent platform
categoriesRouter.get( "/platform/:platformId", async ( req, res ) => {
  const { platformId } = req.params;
  const { page, limit, offset, sortBy, order } = getPaginationParams( req.query, [ 'name', 'createdAt', 'updatedAt' ] );
  const orderBy = getSortingDirection( order );
  try {

    // Check parent platform exists
    if ( !await doesPlatformExists( platformId ) ) {
      throw new Error( 'Parent platform not found' );
    }

    const platformName = await getNameFromId( platformId, platforms );

    const { categories: categoriesList, totalItems } = await getCategoriesForPlatform( platformId );

    const metadata = getPaginationMetadata( totalItems, page, limit, sortBy, order );


    const response: ApiResponse<typeof categoriesList[ number ]> = {
      success: true,
      message: `Categories fetched successfully for platform ${ platformName }`,
      data: categoriesList,
      metadata: metadata as ApiMetadata,
    };

    res.status( 200 ).json( response );

  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );


// By category id
categoriesRouter.get( "/:id", async ( req, res ) => {
  const { id } = req.params;
  try {
    const category = await db.select().from( categories ).where( eq( categories.id, id ) );
    if ( category.length === 0 ) {
      throw new Error( 'Category not found' );
    }
    const response: ApiResponse<typeof category[ number ]> = {
      success: true,
      message: 'Category fetched successfully',
      data: category,
    };
    res.status( 200 ).json( response );
  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );


// Create a category under a parent platform
// TODO : Only admin and moderator can create a category
categoriesRouter.post( "/platform/:platformId", async ( req, res ) => {
  const { platformId } = req.params;
  const { name, description, imageUrl } = req.body as typeof NewCategoryType;
  try {
    // Check parent platform exists
    if ( !await doesPlatformExists( platformId ) ) {
      throw new Error( 'Parent platform not found' );
    }
    const platformName = await getNameFromId( platformId, platforms );

    const { category } = await createCategoryForPlatform( platformId, req.body );


    const response: ApiResponse<typeof category[ number ]> = {
      success: true,
      message: `Category created successfully for platform ${ platformName }`,
      data: category,
    };
    res.status( 200 ).json( response );
  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );
/**
 * APIs
 * 1. GET ALL -> ALL DONE
 * 2. GET ALL from a parent category -> ALL DONE
 * 3. GET BY ID -> ALL  DONE
 * 4. GET BY NAME -> ALL
 * 5. CREATE -> ADMIN | MODERATOR DONE
 * 6. UPDATE BY ID -> ADMIN | MODERATOR
 * 7. DELETE BY ID -> ADMIN | MODERATOR
 * // TODO : Mix of Category and Platform
 * 8. GET ALL CATEGORIES under a platform -> ALL
 * 9. GET ALL PLATFORMS under a category -> ALL
 */
