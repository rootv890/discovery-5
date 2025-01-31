import { eq, or } from "drizzle-orm";
import { db } from "../../db";
import { users, NewUserType, UserRoleEnumType } from "../../db/schema";
import { hashPassword, requiredFieldsCheck } from "../../utils/utils";
import { FastifyInstance } from "fastify";


export async function signUpRoute ( fastify: FastifyInstance ) {

  // Signup
  fastify.post( '/auth/signup', async ( req, reply ) => {
    const { email, username, name, password, role } = req.body as {
      email: string,
      username: string,
      name: string,
      password: string;
      role?: UserRoleEnumType;
    };

    // Validations
    const requiredFields = [ 'email', 'username', 'name', 'password' ];
    requiredFieldsCheck( { fields: requiredFields, body: req.body } );

    const userExist = await db.select().from( users ).where(
      or(
        eq( users.username, username ),
        eq( users.email, email )
      )
    );

    if ( userExist.length > 0 ) {
      return reply.status( 400 ).send( {
        message: 'User already exists',
      } );
    }

    // hashing
    const passwordHash = await hashPassword( password );

    // Insert into db
    const newUser: typeof NewUserType = {
      email,
      username,
      name,
      passwordHash: passwordHash,
      role: role || 'USER',
    };

    try {
      const [ user ] = await db.insert( users ).values( newUser ).returning();

      // TODO session
      return reply.send( { message: 'User created successfully', data: user } );
    } catch ( error ) {
      console.log( error );
      return reply.status( 500 ).send( { message: 'Internal server error' } );
    }
  } );

  /* TODOS */
  // Sign up with OAuth providers
  fastify.post( '/auth/signup/google', async ( req, reply ) => {
    // Implementation for Google OAuth signup
    // This would handle Google OAuth token verification and user creation
  } );

  fastify.post( '/auth/signup/github', async ( req, reply ) => {
    // Implementation for GitHub OAuth signup
    // This would handle GitHub OAuth token verification and user creation
  } );

  // Sign up with phone number
  fastify.post( '/auth/signup/phone', async ( req, reply ) => {
    // Implementation for phone number based signup
    // This would handle phone verification and user creation
  } );
};
