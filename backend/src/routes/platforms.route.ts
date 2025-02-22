import { Router } from 'express';
import { db } from '../db/db';
import { ApiMetadata, ApiResponse } from '../type';
import { platforms } from '../db/schema';
import { AnyColumn, asc, desc, eq, ilike, like, sql, SQLWrapper } from 'drizzle-orm';
import { createApiErrorResponse, getPaginationMetadata, getPaginationParams, getSortingDirection } from '../utils/apiHelpers';

export const PlatformsRouter = Router();
PlatformsRouter.get( '/', async ( req, res ) => {
  try {
    //  use apiHelpers
    const { sortBy, order, page, limit, offset } = getPaginationParams( req.query, [ 'createdAt', 'name' ] );
    const orderDirection = getSortingDirection( order );
    // Fetch total count
    const totalItems = await db.$count( platforms );

    // Fetch paginated data
    const platformsList = await db.select()
      .from( platforms )
      .orderBy( orderDirection( platforms[ sortBy as keyof typeof platforms ] as AnyColumn ) )
      .limit( limit )
      .offset( offset );

    // const totalPages = Math.ceil( totalItems / limit );
    const metadata = getPaginationMetadata( totalItems, page, limit, sortBy, order );
    // console.log( metadata );


    // Construct response using `ApiResponse`
    const response: ApiResponse<typeof platformsList[ number ]> = {
      success: true,
      message: 'Platforms fetched successfully',
      data: platformsList,
      metadata: metadata as ApiMetadata,
    };
    res.status( 200 ).json( response );
  } catch ( error ) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      message: 'Internal Server Error',
      data: [],
      error: {
        code: 500,
        message: ( error as Error ).message,
        details: ( error as Error ).stack,
      },
    };
    res.status( 500 ).json( errorResponse );
  }
} );


// Get platform by id (FOLLOW THE RULES)
PlatformsRouter.get( '/:id', async ( req, res ) => {

  try {

    const { id } = req.params;

    const platform = await db.select().from( platforms ).where( eq( platforms.id, id ) );

    if ( platform.length === 0 ) {
      throw new Error( 'Platform not found' );
    }

    const response: ApiResponse<typeof platform[ number ]> = {
      success: true,
      message: 'Platform fetched successfully',
      data: platform,
    };
    res.status( 200 ).json( response );
  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );

// Get platform by name
PlatformsRouter.get( '/name/:name', async ( req, res ) => {
  try {
    const { name } = req.params;

    const platform = await db.select().from( platforms ).where( ilike( platforms.name, `%${ name }%` ) ).limit( 1 );

    if ( platform.length === 0 ) {
      throw new Error( 'Platform not found' );
    }

    const response: ApiResponse<typeof platform[ number ]> = {
      success: true,
      message: 'Platform fetched successfully',
      data: platform,
    };
    res.status( 200 ).json( response );
  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );

// Create a platform
PlatformsRouter.post( '/', async ( req, res ) => {
  try {
    // TODO : Batch Based  insertion [ { name, description, imageUrl } ]
    const { name, description, imageUrl } = req.body;
    const returnData = await db.insert( platforms ).values( { name, description, imageUrl } ).returning();

    const response = {
      success: true,
      message: 'Platform created successfully',
      data: returnData,
    };
    res.status( 201 ).json( response );
  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );


// Update a platform
PlatformsRouter.put( '/:id', async ( req, res ) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl } = req.body;

    // Validate the data
    //  if name is same as existing platform name then throw error
    const existingPlatform = await db.select().from( platforms ).where( eq( platforms.name, name ) );
    if ( existingPlatform.length > 0 ) {
      throw new Error( 'Platform name already exists' );
    }

    const updatedPlatformData = await db.update( platforms ).set( { name, description, imageUrl } ).where( eq( platforms.id, id ) ).returning();
    const response: ApiResponse<typeof updatedPlatformData[ number ]> = {
      success: true,
      message: 'Platform updated successfully',
      data: updatedPlatformData,
    };
    res.status( 200 ).json( response );
  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );


// Delete a platform
// TODO : Only by admin
PlatformsRouter.delete( '/:id', async ( req, res ) => {
  try {
    const { id } = req.params;
    const deletedPlatform = await db.delete( platforms ).where( eq( platforms.id, id ) ).returning(
      { id: platforms.id }
    );
    const response: ApiResponse<typeof deletedPlatform[ number ]> = {
      success: true,
      message: 'Platform deleted successfully',
      data: deletedPlatform,
      metadata: {
        total: deletedPlatform.length,
      },
    };
    res.status( 200 ).json( response );
  } catch ( error ) {
    const errorResponse = createApiErrorResponse( error );
    res.status( 500 ).json( errorResponse );
  }
} );



// TODOS : All categories under platform
// TODDO : All tools under platform and categories


// RULES For Status
// 200 - > Get OK
// 201 - > Post Created
// 204 - > Put No Content
// 400 - > Bad Request
// 401 - > Unauthorized
// 403 - > Forbidden
// 404 - > Not Found


// RULES FOR RES.SEND
// {
//   "success": true,
//   "message": "Platforms fetched successfully",
//   "data": [ ... ],
//   "metadata": { ... }
// }
