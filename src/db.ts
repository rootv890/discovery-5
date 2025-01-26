import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./drizzle/schema";



function getEnv () {
  const url = import.meta.env.VITE_NEON_DB_URL;

  if ( !url ) {
    throw new Error(
      "Please define the VITE_NEON_DB_URL environment variable inside .env"
    );
  }
  else {
    return url;
  }
}

export const client = neon( getEnv() );
export const db = drizzle( { client, schema, logger: true } );
