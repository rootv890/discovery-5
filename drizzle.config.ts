import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

config( { path: '.env' } );

export default defineConfig( {
  schema: "./src/drizzle/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.VITE_NEON_DB_URL!,
  },
} );
