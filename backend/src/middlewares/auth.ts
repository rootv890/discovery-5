import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';



/**
 * Authenticate Token - Middleware
 * Simple function to check if the token is valid and if it is, it will return the user object
 */
export const authenticateToken = async ( req: Request, res: Response, next: NextFunction ) => {

  const authToken = req.headers[ 'authorization' ];
  const token = authToken && typeof authToken === 'string' ? authToken.split( ' ' )[ 1 ] : null;

  if ( token == null ) {
    return res.status( 401 ).send( { message: 'Unauthorized' } );
  }

  // TODO token expiration

  // Verify
  jwt.verify( token, process.env.JWT_SECRET as string, ( err, user ) => {
    if ( err ) {
      return res.status( 403 ).send( { message: 'Forbidden', error: err } );
    }

    req.body.user = user;
    next();
  } );
};
