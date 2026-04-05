import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../lib/database';
import { initModels } from '../../../models';
import { AuthResponse, LoginCredentials, UserResponse } from '../../../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await connectDB();
  const { User } = initModels();

  try {
    const { email, password }: LoginCredentials = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.setHeader('Set-Cookie', [
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
      `auth_user=${JSON.stringify(userResponse)}; Path=/; Max-Age=86400; SameSite=Strict`
    ]);

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
