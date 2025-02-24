/**
 * Non API related utils
 */


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


export function devConsole ( type: 'log' | 'table' | 'error' | 'info' = 'log', ...args: any[] ) {
  if ( process.env.NODE_ENV === 'development' ) {
    if ( type === 'log' ) {
      console.log( ...args );
    }
    if ( type === 'table' ) {
      console.table( ...args );
    }
    if ( type === 'error' ) {
      console.error( ...args );
    }
    if ( type === 'info' ) {
      console.info( ...args );
    }
  }
}
