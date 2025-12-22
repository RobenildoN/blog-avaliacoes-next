import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: number;
  email: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: { headers: { authorization?: string } }): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function isAuthenticated(token: string | null): boolean {
  if (!token) return false;
  const payload = verifyToken(token);
  return payload !== null;
}

export function getUserFromToken(token: string): JWTPayload | null {
  return verifyToken(token);
}