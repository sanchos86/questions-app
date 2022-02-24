import { Request } from 'express';

import { parseAuthHeader } from './parseAuthHeader';

const AUTH_HEADER = 'authorization';
const AUTH_TYPE = 'bearer';

export const extractBearerTokenFromAuthorizationHeader = (
  req: Request,
): string | null => {
  let token = null;
  if (req.headers[AUTH_HEADER]) {
    const payload = parseAuthHeader(req.headers[AUTH_HEADER]);
    if (payload && AUTH_TYPE === payload.schema.toLowerCase()) {
      token = payload.value;
    }
  }
  return token;
};
