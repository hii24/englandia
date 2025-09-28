import type { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'guest';
  firstName?: string;
  lastName?: string;
  iat?: number;
  exp?: number;
}

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'static-secret-key-for-development';
};

export function getTokenFromHeader(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || typeof authHeader !== 'string') return null;
  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

export function getAuthUser(req: NextApiRequest): JwtPayload | null {
  const token = getTokenFromHeader(req);
  if (!token) return null;
  return verifyToken(token);
}

export function isAdmin(req: NextApiRequest): boolean {
  const user = getAuthUser(req);
  return !!user && user.role === 'admin';
}


