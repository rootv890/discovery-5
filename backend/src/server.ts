import express from 'express';
import env from './config/env';

import { authenticateToken } from './middlewares/auth';

const app = express();
app.use( express.json() );

// Auth Routers

app.get( '/', ( req, res ) => {
  res.send( 'Hello World' );
} );




app.get( `${ env.API_URL }/hi`, ( req, reply ) => {
  reply.send( {
    message: "Hello World",
  } );
} );


// Test protecd router
app.get( `/${ env.API_URL }/protected`, authenticateToken, ( req, reply ) => {
  reply.send( {
    message: "Protected route",
    data: req.body.user ?? null,
  } );
} );

// Server
app.listen( env.PORT, () => {
  console.log( `Server started @ http://localhost:${ env.PORT }` );
} );


export default app;
