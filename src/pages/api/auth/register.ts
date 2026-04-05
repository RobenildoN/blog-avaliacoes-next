import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../lib/database';
import { initModels } from '../../../models';
import { AuthResponse, RegisterData } from '../../../types';

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
    const { email, password, name }: RegisterData = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso!',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
