import bcrypt from 'bcrypt';
import { Request } from 'express';

const SALT = 10;

export const hashPassword = async ( password: string ): Promise<string> => {
  return await bcrypt.hash( password, SALT );
};

export const verifyPassword = async ( password: string, hashedPassword: string ): Promise<boolean> => {
  return await bcrypt.compare( password, hashedPassword );
};

// required Fields
export const requiredFieldsCheck = ( {
  fields,
  body,
}: {
  fields: string[];
  body: Request[ 'body' ];
} ): Error | null => {
  for ( const field of fields ) {
    if ( !body || !( field in body ) ) {
      return new Error( `${ field } is required` );
    }
  }
  return null; // Ensures function always returns a value
};


// generate authtokens

import jwt from 'jsonwebtoken';
export const generateAccessToken = ( user: {
  id: string;
  role: string;
} ) => {
  return jwt.sign( user, process.env.JWT_SECRET as string, { expiresIn: '15s' } );
};

export const generateRefreshToken = ( user: {
  id: string;
  role: string;
} ) => {
  return jwt.sign( user, process.env.JWT_SECRET as string, );
};
