import { NextApiRequest, NextApiResponse } from 'next';
import '../../../models/index';
import Category from '../../../models/Category';
import { connectDB } from '../../../lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; created: string[]; existing: string[] }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed', created: [], existing: [] });
  }

  await connectDB();

  try {
    const names = ['Mangas', 'Livros', 'Filmes', 'Séries', 'Cursos', 'Outras'];
    const created: string[] = [];
    const existing: string[] = [];

    for (const name of names) {
      const found = await Category.findOne({ where: { name } });
      if (found) {
        existing.push(name);
      } else {
        await Category.create({ name });
        created.push(name);
      }
    }

    res.status(200).json({ message: 'Categorias verificadas/criadas', created, existing });
  } catch (error) {
    console.error('Erro ao garantir categorias:', error);
    res.status(500).json({ message: 'Erro ao garantir categorias', created: [], existing: [] });
  }
}
