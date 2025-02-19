import { platform } from "os";
import { isValidUUID } from "./utils/apiUtils";
import { doesPlatformExists } from "./utils/apiHelpers";
import { db } from "./db/db";
import { categories, categoryPlatform } from "./db/schema";
import { eq, inArray } from "drizzle-orm";
import { removeCatFromPlatforms } from "./controllers/categories.controller";

// TO TEST :  DB queries
console.log( "first" );


// Get all cats from a platform
// 1. Check platformId
// 2. Get all cats from a platfrom from categoryPlatform table
// 3. Make sure categoryPlatform returns all cats id in Array
// 4. Loop through the array and get the cat details from categories table
// 5. Return the cat details [ { id, name, description, imageUrl, platformId } ]


const getAllCatsFromPlatform = async ( platformId: String ) => {

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
  // console.table( allCatsDetails );
  return allCatsDetails;
};

// getAllCatsFromPlatform( "f270e38c-d6f8-4d57-894b-366621460477" );

const addCatToMultiplePlatForms = async ( { catId, platformIds }: { catId: string, platformIds: string[]; } ) => {
  try {
    // Validate catId and platformIds
    if ( !isValidUUID( catId ) ) {
      throw new Error( "Invalid catId" );
    }

    if ( platformIds.some( id => !isValidUUID( id ) ) ) {
      throw new Error( "Invalid platformIds" );
    }
    // Cat Exists
    const catExists = await db.select().from( categories ).where( eq( categories.id, catId ) );

    // Check if categroy's platformConstraint is NONE or SINGLE
    // IF SINGLE and platformIds.length > 1, throw error
    if ( !catExists ) {
      throw new Error( "Cat not found" );
    }
    console.log( 'catExists', catExists );
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
    console.log( 'catInPlatforms', catInPlatforms );

    if ( catInPlatforms.length > 0 ) {
      throw new Error( "Current Category is already in the platforms" );
    }
    // Add cat to platforms
    const addCatToPlatforms = await db.insert( categoryPlatform ).values( platformIds.map( id => ( { categoryId: catId, platformId: id } ) ) );
    return addCatToPlatforms;
  } catch ( error ) {
    console.log( 'error', error );
    throw error;
  }
};

// addCatToMultiplePlatForms( {
//   catId: "7e877b0a-f7e3-4566-9e6d-c4fb3764282d", // COLOR
//   platformIds: [ "9202db17-fa78-45f9-9d8c-a65ec1430bcc", "ca8209fc-7422-475d-954e-3d5b74fafa6b" ],

// } );
// addCatToMultiplePlatForms( {
//   catId: "ad28cfe2-5234-4e42-bc47-08e0491fb9af", // developer books
//   platformIds: [ "f270e38c-d6f8-4d57-894b-366621460477",  /* Book */"ca8209fc-7422-475d-954e-3d5b74fafa6b" ],

// } );


console.log( "removeCatFromPlatforms", removeCatFromPlatforms( {
  catId: "7e877b0a-f7e3-4566-9e6d-c4fb3764282d",
  platformIds: [
    "ca8209fc-7422-475d-954e-3d5b74fafa6b",
    "9202db17-fa78-45f9-9d8c-a65ec1430bcc",
    "9202db17-fa78-45f9-9d8c-a65ec1430bcc"
  ]
} )
);
