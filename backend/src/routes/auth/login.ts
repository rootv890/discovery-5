
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, Router } from 'express';
import { generateAccessToken, generateRefreshToken, requiredFieldsCheck } from '../../utils/utils';
import { db } from '../../db';
import 'dotenv/config';

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

  return res.status( 200 ).json( { message: 'User logged in successfully', accessToken, refreshToken } );

} );
