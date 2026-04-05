import { NextApiRequest, NextApiResponse } from "next";
import { Op, WhereOptions } from "sequelize";
import path from "path";
import fs from "fs";
import multer from "multer";
import { connectDB } from "../../../lib/database";
import { initModels } from "../../../models";
import { PostsResponse, Post as PostType } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | PostsResponse
    | { message: string; error?: string }
    | { message: string; post?: PostType }
  >
) {
  await connectDB();
  const { Post, Category } = initModels();

  switch (req.method) {
    case "GET":
      return await getAllPosts(req, res);
    case "POST":
      return await createPost(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getAllPosts(
  req: NextApiRequest,
  res: NextApiResponse<PostsResponse>
) {
  try {
    const { Post, Category } = initModels();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 16;
    const offset = (page - 1) * limit;
    const categoryIdParam = req.query.categoryId
      ? parseInt(req.query.categoryId as string)
      : undefined;
    const categoryNameParam = (req.query.categoryName as string) || undefined;
    const others = (req.query.others as string) === "true";

    let whereClause: WhereOptions = {};
    if (others) {
      const targetNames = [
        "Mangas",
        "Livros",
        "Filmes",
        "Séries",
        "Cursos",
        "Outras",
      ];
      const targetCategories = await Category.findAll({
        where: { name: targetNames },
      });
      const targetIds = targetCategories.map((c: any) => c.id);
      whereClause = {
        categoryId: { [Op.notIn]: targetIds.length ? targetIds : [-1] },
      };
    } else if (categoryIdParam) {
      whereClause = { categoryId: categoryIdParam };
    } else if (categoryNameParam) {
      const cat = await Category.findOne({
        where: { name: categoryNameParam },
      });
      whereClause = cat ? { categoryId: cat.id } : { categoryId: -1 };
    }

    const totalPosts = await Post.count({ where: whereClause });

    const posts = await Post.findAll({
      include: [
        {
          model: Category,
          as: "Category",
        },
      ],
      where: whereClause,
      order: [["data_post", "DESC"]],
      limit: limit,
      offset: offset,
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
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      posts: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  }
}

async function createPost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { Post, Category } = initModels();
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const storage = multer.diskStorage({
      destination: function (_req, _file, cb) {
        try {
          fs.mkdirSync(uploadDir, { recursive: true });
        } catch {}
        cb(null, uploadDir);
      },
      filename: function (_req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path
          .basename(file.originalname, ext)
          .replace(/[^a-z0-9\-]/gi, "_");
        const unique = `${base}-${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${ext}`;
        cb(null, unique);
      },
    });
    const upload = multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Tipo de arquivo inválido"));
      },
    });
    const runMiddleware = (
      req: NextApiRequest,
      res: NextApiResponse,
      middleware: (
        req: NextApiRequest,
        res: NextApiResponse,
        next: (err?: unknown) => void
      ) => void
    ) =>
      new Promise<void>((resolve, reject) => {
        middleware(req, res, (result: unknown) => {
          if (result instanceof Error) return reject(result);
          return resolve();
        });
      });
    await runMiddleware(
      req,
      res,
      upload.single("imagem") as unknown as (
        req: NextApiRequest,
        res: NextApiResponse,
        next: (err?: unknown) => void
      ) => void
    );

    const body = (req as unknown as { body: Record<string, unknown> }).body;
    const file = (req as unknown as { file?: { filename: string } }).file;
    const titulo = String(body?.titulo ?? "");
    const resumo = String(body?.resumo ?? "");
    const avaliacao = Number(body?.avaliacao ?? 0);
    const lido_ate =
      body?.lido_ate !== undefined ? String(body.lido_ate) : undefined;
    const categoryId = Number(body?.categoryId ?? 0);

    if (!titulo || !resumo || !avaliacao || !categoryId) {
      return res.status(400).json({
        message: "Campos obrigatórios: titulo, resumo, avaliacao, categoryId",
      });
    }

    if (avaliacao < 1 || avaliacao > 5) {
      return res.status(400).json({
        message: "Avaliação deve ser entre 1 e 5",
      });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({
        message: "Categoria não encontrada",
      });
    }

    const newPost = await Post.create({
      titulo,
      resumo,
      avaliacao,
      lido_ate,
      categoryId,
      imagem: file ? `/uploads/${file.filename}` : undefined,
    });

    const postWithCategory = await Post.findByPk(newPost.id, {
      include: [
        {
          model: Category,
          as: "Category",
        },
      ],
    });

    res.status(201).json({
      message: "Post criado com sucesso!",
      post: postWithCategory,
    });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    res.status(500).json({
      message: "Erro ao criar post",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
