/**
 * Only for authentication
 * Login
 * Logout
 * Refresh token
 */

import express, { Request, Response } from 'express';
import 'dotenv/config';
const port = env.AUTH_PORT;
import { loginRouter } from './routes/auth/login';
import { generateAccessToken } from './utils/jwt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import env from './config/env';

const authApp = express();
authApp.use( express.json() );


authApp.use( cookieParser() );
authApp.get( '/auth', ( req, res ) => {
  res.send( 'Hello World!' );
} );

authApp.post( "/auth/refresh-token", ( req: Request, res: Response ) => {
  const refreshToken = req.cookies.refreshToken;
  console.log( refreshToken );

  if ( !refreshToken ) return res.status( 401 ).json( { message: "Unauthorized" } );

  jwt.verify( refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET as string, ( err: any, user: any ) => {
    if ( err ) return res.status( 403 ).json( { message: "Invalid refresh token", error: err } );

    const accessToken = generateAccessToken( { id: user.id, role: user.role } );
    res.json( { accessToken } );
  } );
} );


// http://localhost:3000/api/v1/auth/login
authApp.use( `/auth`, loginRouter );

authApp.listen( 1345, () => {
  console.log( `Auth Server running on port http://localhost:${ port } ` );
} );
