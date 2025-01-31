import bcrypt from 'bcrypt';
import { FastifyRequest } from 'fastify';

const SALT = 10;

export const hashPassword = async ( password: string ): Promise<string> => {
  return await bcrypt.hash( password, SALT );
};

export const verifyPassword = async ( password: string, hashedPassword: string ): Promise<boolean> => {
  return await bcrypt.compare( password, hashedPassword );
};



// required Fields
export const requiredFieldsCheck = ( { fields, body }: { fields: Array<string>; body: FastifyRequest[ 'body' ]; } ): void => {
  const requiredFields = fields;
  requiredFields.forEach( ( field ) => {
    if ( !body || !( field in ( body as Record<string, unknown> ) ) ) {
      throw new Error( `${ field } is required` );
    }
    else {
      return;
    }
  } );
};
