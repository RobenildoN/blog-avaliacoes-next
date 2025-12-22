import { NextApiRequest, NextApiResponse } from 'next';
import '../../../models/index';
import Category from '../../../models/Category';
import { connectDB } from '../../../lib/database';
import { Category as CategoryType } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CategoryType[] | { message: string; error?: string } | { message: string; category?: CategoryType }>
) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      return await getAllCategories(req, res);
    case 'POST':
      return await createCategory(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getAllCategories(req: NextApiRequest, res: NextApiResponse<CategoryType[]>) {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json(categories.map(cat => cat.toJSON()) as CategoryType[]);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json([]);
  }
}

async function createCategory(req: NextApiRequest, res: NextApiResponse<{ message: string; category?: CategoryType } | { message: string; error?: string }>) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Nome da categoria é obrigatório'
      });
    }

    // Verificar se a categoria já existe
    const existingCategory = await Category.findOne({
      where: { name: name.trim() }
    });

    if (existingCategory) {
      return res.status(400).json({
        message: 'Categoria já existe'
      });
    }

    const newCategory = await Category.create({
      name: name.trim()
    });

    res.status(201).json({
      message: 'Categoria criada com sucesso!',
      category: newCategory.toJSON() as CategoryType
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({
      message: 'Erro ao criar categoria',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
