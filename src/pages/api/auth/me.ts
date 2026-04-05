import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { UserResponse } from '../../../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: 'admin' | 'user';
    };

    const userResponse: UserResponse = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    res.status(200).json({ user: userResponse });
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
}
