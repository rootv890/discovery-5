import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { verifyPassword, requiredFieldsCheck } from "../../utils/utils";
import { FastifyInstance } from "fastify";

export const signInRoutes = async ( fastify: FastifyInstance ) => {
  fastify.post( "/auth/login", async ( req, reply ) => {
    const { email, password, username } = req.body as {
      email?: string;
      password: string;
      username?: string;
    };

    if ( !email && !username ) {
      return reply.status( 400 ).send( { message: "Email or username is required" } );
    }

    requiredFieldsCheck( { fields: [ "password" ], body: req.body } );

    // Find user dynamically based on provided identifier
    const user = await db
      .select()
      .from( users )
      .where( email ? eq( users.email, email ) : eq( users.username, username! ) )
      .limit( 1 );

    if ( !user[ 0 ] ) {
      return reply.status( 400 ).send( { message: "Invalid credentials" } );
    }

    const passwordMatch = await verifyPassword( password, user[ 0 ].passwordHash );

    if ( !passwordMatch ) {
      return reply.status( 400 ).send( { message: "Invalid credentials" } );
    }

    // TODO: Implement session or JWT token
    const token = fastify.jwt.sign(
      {
        id: user[ 0 ].id,
        role: user[ 0 ].role,
      }
    );

    return reply.status( 200 ).send( {
      message: "Login successful",
      token
    } );
  } );
};
