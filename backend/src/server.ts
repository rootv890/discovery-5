import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { db } from "./db";
import { signUpRoute } from "./routes/auth/sign-up";
import { signInRoutes } from "./routes/auth/sign-in";
import jwt from '@fastify/jwt';
import 'dotenv/config';

const app = Fastify( { logger: false } );

//  Register JWT
app.register( jwt, {
  secret: process.env.JWT_SECRET as string, // Secret key for signing tokens
} );

// ✅ Middleware to verify JWT
app.decorate( "authenticate", async ( req: FastifyRequest, reply: FastifyReply ) => {
  try {
    await req.jwtVerify();
  } catch ( error ) {
    return reply.status( 401 ).send( { message: "Unauthorized" } );
  }
} );

async function main () {
  const prefix = 'api/v1';

  // Register routes
  await app.register( signUpRoute, { prefix } );
  await app.register( signInRoutes, { prefix } );

  // Protected route example
  app.get( '/api/v1/protected', {
    preHandler: [ ( app as any ).authenticate ]
  }, async ( req, reply ) => {
    return { message: 'This is a protected route' };
  } );

  // ✅ Start server
  app.listen( { port: 3000 }, ( err, address ) => {
    if ( err ) {
      console.error( err );
      process.exit( 1 );
    }
    console.log( `Server listening at ${ address }` );
  } );
}

main();
