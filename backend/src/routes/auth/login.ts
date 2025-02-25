
import bcrypt from 'bcrypt';

import { Router } from 'express';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { requiredFieldsCheck } from '../../utils/utils';
import { db } from '../../db/db';
import 'dotenv/config';
import app from '../../server';

const SALT = 10;

export const loginRouter = Router();


// Login Router
loginRouter.post( '/login', async ( req, res ): Promise<any> => {
  const { email, password, username } = req.body;

  const error = requiredFieldsCheck( {
    body: req.body,
    fields: [ 'password', email ? 'email' : 'username' ],
  } );

  if ( error ) {
    return res.status( 400 ).json( { message: error.message } );
  }

  // Check users existen
  const user = await db.query.users.findMany( {
    where: ( users, { or, eq } ) => or( eq( users.email, email ), eq( users.username, username ) )
  } );

  if ( user.length === 0 ) {
    return res.status( 400 ).json( { message: 'User with creditonals not found' } );
  }

  const hashedPassword = await bcrypt.hash( password, SALT );
  // Check password
  const isPasswordValid = await bcrypt.compare( password, hashedPassword );

  console.log( password, hashedPassword, isPasswordValid );


  if ( !isPasswordValid ) {
    return res.status( 400 ).json( { message: 'Invalid password' } );
  }

  const accessToken = generateAccessToken( {
    id: user[ 0 ].id,
    role: user[ 0 ].role || 'USER',
  } );

  const refreshToken = generateRefreshToken( {
    id: user[ 0 ].id,
    role: user[ 0 ].role || 'USER',
  } );

  // HTTP Only Cookie
  res.cookie( 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  } );

  return res.status( 200 ).json( { message: 'User logged in successfully', accessToken, refreshToken } );

} );


loginRouter.post( '/logout', ( req, res ) => {
  res.clearCookie( 'refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: '/',
  } );
  res.json( { message: "Logged out successfully" } );
} );


app.get;
