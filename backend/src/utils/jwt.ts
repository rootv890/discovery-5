
// generate authtokens

import jwt from 'jsonwebtoken';
export const generateAccessToken = ( user: {
  id: string;
  role: string;
} ) => {
  return jwt.sign( user, process.env.JWT_SECRET as string, { expiresIn: '2m' } );
};

export const generateRefreshToken = ( user: {
  id: string;
  role: string;
} ) => {
  return jwt.sign( user, process.env.JWT_REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' } );
};
