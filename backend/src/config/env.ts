import { config } from "dotenv";
import path from "path";

config( {
  path: path.resolve( __dirname, `../../.env.${ process.env.NODE_ENV || "development" }` ),
} );


const env: Env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
  PORT: process.env.PORT!,
  AUTH_PORT: process.env.AUTH_PORT!,
  API_URL: process.env.API_URL!,
};

export default env;

// export types
export type Env = {
  DATABASE_URL: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  PORT: string;
  AUTH_PORT: string;
  API_URL: string;
};
