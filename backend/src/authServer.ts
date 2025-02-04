/**
 * Only for authentication
 * Login
 * Logout
 * Refresh token
 */

import express from 'express';
import 'dotenv/config';
const port = process.env.AUTH_PORT || 3030;
import { loginRouter } from './routes/auth/login';
import { generateAccessToken } from './utils/utils';
import jwt from 'jsonwebtoken';

const app = express();
app.use( express.json() );

app.get( '/auth', ( req, res ) => {
  res.send( 'Hello World!' );
} );

app.post( `/auth/token`, ( req, res ) => {
  const refreshTokensArray: Array<string> = [];
  const refreshToken = req.body.token;

  console.log( "Refresh token", refreshToken );


  if ( refreshToken === null ) res.sendStatus( 401 ).
    send( {
      message: "Refresh token is required",
    } );

  if ( !refreshTokensArray.includes( refreshToken ) ) {
    res.sendStatus( 403 ).send( {
      message: "Invalid refresh token",
    } );
  }

  // Verify and Generate new access token
  jwt.verify( refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET as string, ( err: any, user: any ) => {
    if ( err ) {
      return res.sendStatus( 403 );
    }
    const accessToken = generateAccessToken( { id: user.id, role: user.role } );
    res.json( { accessToken: accessToken } );
  } );
} );



// http://localhost:3000/api/v1/auth/login
app.use( `/auth`, loginRouter );

app.listen( port, () => {
  console.log( `Server running on port http://localhost:${ port } ` );
} );
