import { NextApiRequest, NextApiResponse } from 'next';
import { Op, WhereOptions } from 'sequelize';
import { connectDB } from '../../../lib/database';
import { initModels } from '../../../models';
import { PostsResponse } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostsResponse | { message: string }>
) {
  await connectDB();
  const { Post, Category } = initModels();

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const searchTerm = req.query.q as string || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 16;
    const offset = (page - 1) * limit;

    let whereCondition: WhereOptions = {};
    if (searchTerm.trim()) {
      whereCondition = {
        [Op.or]: [
          { titulo: { [Op.like]: `%${searchTerm}%` } },
          { resumo: { [Op.like]: `%${searchTerm}%` } }
        ]
      };
    }

    const totalPosts = await Post.count({ where: whereCondition });

    const posts = await Post.findAll({
      where: whereCondition,
      include: [{
        model: Category,
        as: 'Category'
      }],
      order: [['data_post', 'DESC']],
      limit: limit,
      offset: offset
    });

    const totalPages = Math.ceil(totalPosts / limit);

    const response: PostsResponse = {
      posts: posts.map((post: any) => post.toJSON()),
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalPosts: totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        searchTerm: searchTerm
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({
      posts: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    });
  }
}
