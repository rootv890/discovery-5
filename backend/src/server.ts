import express from 'express';

import { db } from './db';
import { Router } from 'express';
import 'dotenv/config';
import { authenticateToken } from './middlewares/auth';
const app = express();



app.use( express.json() );

// Auth Routers
app.get( `${ process.env.API_URl }/hi`, ( req, reply ) => {
  reply.send( {
    message: "Hello World",
  } );
} );





// Test protecd router
app.get( `${ process.env.API_URl }/protected`, authenticateToken, ( req, reply ) => {
  reply.send( {
    message: "Protected route",
    data: req.body.user ?? null,
  } );
} );

// Server
app.listen( 3000, () => {
  console.log( "Server is running on port 3000" );
} );
