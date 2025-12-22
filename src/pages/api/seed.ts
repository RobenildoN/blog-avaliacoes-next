import { NextApiRequest, NextApiResponse } from 'next';
import Category from '../../models/Category';
import Post from '../../models/Post';
import { connectDB } from '../../lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; error?: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectDB();

  try {
    // Criar categorias de exemplo
    const categoriesData = [
      { name: 'Mangas' },
      { name: 'Livros' },
      { name: 'Filmes' },
      { name: 'Séries' },
      { name: 'Cursos' }
    ];

    const categories = [];
    for (const catData of categoriesData) {
      const category = await Category.create(catData);
      categories.push(category);
    }

    // Criar posts de exemplo
    const postsData = [
      {
        titulo: 'One Piece - Volume 1',
        resumo: 'A história começa quando Monkey D. Luffy, um jovem que sonha em se tornar o Rei dos Piratas, come uma fruta do diabo que o transforma em um homem de borracha.',
        avaliacao: 5,
        categoryId: categories[0].id,
        lido_ate: 'Capítulo 10'
      },
      {
        titulo: 'O Senhor dos Anéis',
        resumo: 'Uma aventura épica na Terra Média onde um jovem hobbit precisa destruir um anel poderoso para salvar o mundo das trevas.',
        avaliacao: 5,
        categoryId: categories[1].id,
        lido_ate: 'Página 150'
      },
      {
        titulo: 'Matrix',
        resumo: 'Um hacker descobre que o mundo em que vive é uma simulação criada por máquinas para controlar a humanidade.',
        avaliacao: 4.5,
        categoryId: categories[2].id,
        lido_ate: '1h 30min'
      },
      {
        titulo: 'Breaking Bad',
        resumo: 'Um professor de química descobre que tem câncer e decide fabricar metanfetamina para garantir o futuro financeiro de sua família.',
        avaliacao: 5,
        categoryId: categories[3].id,
        lido_ate: 'Temporada 2'
      },
      {
        titulo: 'Curso de React Avançado',
        resumo: 'Aprenda técnicas avançadas de React, incluindo hooks personalizados, context API e otimização de performance.',
        avaliacao: 4,
        categoryId: categories[4].id,
        lido_ate: 'Módulo 5'
      }
    ];

    for (const postData of postsData) {
      await Post.create(postData);
    }

    res.status(200).json({
      message: 'Banco de dados populado com dados de exemplo!'
    });
  } catch (error) {
    console.error('Erro ao popular banco:', error);
    res.status(500).json({
      message: 'Erro ao popular banco de dados',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}