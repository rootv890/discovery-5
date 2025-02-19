/**
 * API related utils  like validation, error handling, etc.
 */


export const checkMissingFields = ( requiredFields: string[], body: any ) => {
  const missingFields = requiredFields.filter( ( field ) => !body[ field ] ); // Filter out the missing fields
  if ( missingFields.length > 0 ) {
    // throw new Error( `Missing fields: ${ missingFields.join( ", " ) }` );
    // send to response
    throw new Error( `Missing fields: ${ missingFields.join( ", " ) }` );
  }
  return true;
};


export const isValidUUID = ( uuid: string ) => {
  return uuid.match( /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/ );
};
