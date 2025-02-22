import { Router } from 'express';
import { db } from '../db/db';
import { createApiErrorResponse, doesCategoryExistsByName, doesPlatformExists, getNameFromId, getPaginationMetadata, getPaginationParams, getSortingDirection, getCategoryFromPlatform } from '../utils/apiHelpers';
import { categories, platforms, NewCategoryType, categoryPlatform } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AnyColumn } from 'drizzle-orm';
import { ApiMetadata } from '../type';
import { ApiResponse } from '../type';
import { addCatToMultiplePlatForms, createCategory, deleteCategory, getAllCatsFromPlatform, removeCatFromPlatforms } from '../controllers/categories.controller';
import { isValidUUID, checkMissingFields } from '../utils/apiUtils';

export const CategoriesRouter = Router();

CategoriesRouter.get( '/', async ( req, res ) => {


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
CategoriesRouter.get( "/platform/:platformId", async ( req, res ) => {
  const { platformId } = req.params;

  const { page, limit, offset, sortBy, order } = getPaginationParams( req.query, [ 'name', 'createdAt', 'updatedAt' ] );
  const orderBy = getSortingDirection( order );

  try {

    const platformName = await getNameFromId( platformId, platforms );

    const categoriesList = await getAllCatsFromPlatform( platformId ); // performs platform check, uuid check and returns all categories under a platform

    const metadata = getPaginationMetadata( categoriesList.length, page, limit, sortBy, order );

    const response: ApiResponse<typeof categoriesList[ number ]> = {
      success: true,
      message: `All categories fetched successfully from platform ${ platformName }`,
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
CategoriesRouter.get( "/:id", async ( req, res ) => {
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
// POST  /categories
CategoriesRouter.post( "/", async ( req, res ) => {
  const { name, description, imageUrl, platformConstraint, platformIds } = req.body as typeof NewCategoryType & {
    platformIds: string[];
  };

  // Validate the required fields
  const missingFields = checkMissingFields( [ "name", "description", "imageUrl", "platformConstraint", "platformIds" ], req.body );
  if ( missingFields ) {
    res.status( 400 ).json( {
      success: false,
      message: missingFields,
    } );
  }
  try {

    if ( platformConstraint === "SINGLE" ) {
      if ( platformIds.length !== 1 ) {
        throw new Error( "Single platform constraint requires exactly one platformId" );
      }
    } else if ( platformConstraint === "NONE" ) {
      if ( platformIds.length < 1 ) {
        throw new Error( "None platform constraint requires at least one platformId" );
      }
    } else {
      throw new Error( "Invalid platform constraint" );
    }



    // Create the category
    const category = await createCategory( {
      name,
      description,
      imageUrl,
      platformConstraint,
    } );


    const categoryAddedToPlatforms = await addCatToMultiplePlatForms( {
      catId: category[ 0 ].id,
      platformIds: platformIds, // only one id if SINGLE, all ids if NONE
    } );

    const response: ApiResponse<typeof NewCategoryType> = {
      success: true,
      message: "Category created successfully",
      data: [ category[ 0 ], ...categoryAddedToPlatforms ],
      metadata: undefined,
    };

    res.status( 200 ).json( response );






  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );


// Add a category to multiple platforms
// POST  /categories/:id/platforms
CategoriesRouter.post( "/:id/platforms", async ( req, res ) => {
  const { id } = req.params;
  const { platformIds } = req.body as { platformIds: string[]; };

  // Validate the required fields
  const missingFields = checkMissingFields( [ "platformIds" ], req.body );
  if ( missingFields ) {
    res.status( 400 ).json( {
      success: false,
      message: missingFields,
    } );
  }
  try {
    const category = await db.select().from( categories ).where( eq( categories.id, id ) );
    if ( category.length === 0 ) {
      throw new Error( 'Category not found' );
    }

    const addCatToMP = await addCatToMultiplePlatForms( {
      catId: id,
      platformIds,
    } );

    const reponse: ApiResponse<typeof addCatToMP[ number ]> = {
      success: true,
      message: `Category ${ category[ 0 ].name } added to multiple platforms successfully`,
      data: addCatToMP,
    };
    res.status( 200 ).json( reponse );

  }
  catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );


// Update a category
// PUT  /categories/:id
CategoriesRouter.patch( "/:id", async ( req, res ) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, platformConstraint } = req.body as typeof NewCategoryType;

    // category check
    const category = await db.select().from( categories ).where( eq( categories.id, id ) );
    if ( category.length === 0 ) {
      throw new Error( 'Category not found' );
    }

    // prepare update data
    const updateData: Partial<typeof NewCategoryType> = {};
    if ( name ) updateData.name = name;
    if ( description ) updateData.description = description;
    if ( imageUrl ) updateData.imageUrl = imageUrl;
    if ( platformConstraint ) updateData.platformConstraint = platformConstraint;

    // Track No Changes
    const noChanges = {
      name: category[ 0 ].name === name, // true if name is same
      description: category[ 0 ].description === description,
      imageUrl: category[ 0 ].imageUrl === imageUrl,
      platformConstraint: category[ 0 ].platformConstraint === platformConstraint,
    };

    // if all the above are true, then there is no changes
    if ( noChanges.name && noChanges.description && noChanges.imageUrl && noChanges.platformConstraint ) {
      const response: ApiResponse<typeof category[ number ]> = {
        success: true,
        message: `Category data is already up-to-date for the requested fields. No changes were applied.`,
        data: category,
      };
      res.status( 200 ).json( response );
    }
    // check if there is any data to update
    if ( Object.keys( updateData ).length === 0 ) {
      throw new Error( 'No changes to update' );
    }
    // update

    const updatedCategory = await db.update( categories ).set( updateData ).where( eq( categories.id, id ) ).returning();

    const response: ApiResponse<typeof updatedCategory[ number ]> = {
      success: true,
      message: `Category ${ name } updated successfully`,
      data: updatedCategory,
    };
    res.status( 200 ).json( response );

  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );


// Delete a category
// DELETE  /categories/:id
CategoriesRouter.delete( "/:id", async ( req, res ) => {
  const { id } = req.params;
  try {
    // Respnse and error handled inside the controller
    const deleted = await deleteCategory( id );
    res.status( 200 ).json( deleted );
  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );


// Remove a category from multiple platforms
// DELETE  /categories/:id/platforms
CategoriesRouter.delete( "/:id/remove-platforms", async ( req, res ) => {
  const { id } = req.params;
  const { platformIds } = req.body as { platformIds: string[]; };

  console.log( platformIds );

  // Validate the required fields
  const missingFields = checkMissingFields( [ "platformIds" ], req.body );
  if ( missingFields ) {
    res.status( 400 ).json( {
      success: false,
      message: missingFields,
    } );
  }
  try {
    // Respnse and error handled inside the controller
    const deleted = await removeCatFromPlatforms( { catId: id, platformIds } );
    res.status( 200 ).json( deleted );
  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );
