import { Request } from 'express';

export const extractTokenFormCookie = (
  req: Request,
  cookieName: string,
): string | null => {
  return req.cookies[cookieName] ?? null;
};
