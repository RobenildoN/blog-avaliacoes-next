import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import '../../../models/index';
import Post from '../../../models/Post';
import Category from '../../../models/Category';
import { connectDB } from '../../../lib/database';
import { Post as PostType } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostType | { message: string; error?: string } | { message: string }>
) {
  await connectDB();

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  switch (req.method) {
    case 'GET':
      return await getPostById(req, res, parseInt(id));
    case 'PUT':
      return await updatePost(req, res, parseInt(id));
    case 'DELETE':
      return await deletePost(req, res, parseInt(id));
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getPostById(req: NextApiRequest, res: NextApiResponse<PostType | { message: string }>, id: number) {
  try {
    const post = await Post.findByPk(id, {
      include: [{
        model: Category,
        as: 'Category'
      }]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    res.status(200).json(post.toJSON() as PostType);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({
      message: 'Erro ao buscar post',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

async function updatePost(req: NextApiRequest, res: NextApiResponse<PostType | { message: string; error?: string }>, id: number) {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const storage = multer.diskStorage({
      destination: function (_req, _file, cb) {
        try {
          fs.mkdirSync(uploadDir, { recursive: true });
        } catch {}
        cb(null, uploadDir);
      },
      filename: function (_req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-z0-9\-]/gi, '_');
        const unique = `${base}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, unique);
      }
    });
    const upload = multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Tipo de arquivo inválido'));
      }
    });
    const runMiddleware = (
      req: NextApiRequest,
      res: NextApiResponse,
      middleware: (req: NextApiRequest, res: NextApiResponse, next: (err?: unknown) => void) => void
    ) => new Promise<void>((resolve, reject) => {
      middleware(req, res, (result: unknown) => {
        if (result instanceof Error) return reject(result);
        return resolve();
      });
    });
    await runMiddleware(req, res, upload.single('imagem'));

    const body = (req as unknown as { body: Record<string, unknown> }).body;
    const file = (req as unknown as { file?: { filename: string } }).file;
    const titulo = String(body?.titulo ?? '');
    const resumo = String(body?.resumo ?? '');
    const avaliacao = Number(body?.avaliacao ?? 0);
    const lido_ate = body?.lido_ate !== undefined ? String(body.lido_ate) : undefined;
    const categoryId = Number(body?.categoryId ?? 0);
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    // Validações básicas
    if (!titulo || !resumo || !avaliacao || !categoryId) {
      return res.status(400).json({
        message: 'Campos obrigatórios: titulo, resumo, avaliacao, categoryId'
      });
    }

    if (avaliacao < 1 || avaliacao > 5) {
      return res.status(400).json({
        message: 'Avaliação deve ser entre 1 e 5'
      });
    }

    // Verificar se a categoria existe
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({
        message: 'Categoria não encontrada'
      });
    }

    await post.update({
      titulo,
      resumo,
      avaliacao,
      lido_ate,
      categoryId,
      imagem: file ? `/uploads/${file.filename}` : post.imagem
    });

    // Buscar o post atualizado com a categoria incluída
    const updatedPost = await Post.findByPk(id, {
      include: [{
        model: Category,
        as: 'Category'
      }]
    });

    res.status(200).json(updatedPost!.toJSON() as PostType);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({
      message: 'Erro ao atualizar post',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};

async function deletePost(req: NextApiRequest, res: NextApiResponse<{ message: string }>, id: number) {
  try {
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    await post.destroy();
    res.status(200).json({ message: 'Post deletado' });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({
      message: 'Erro ao deletar post',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
