import { Op, WhereOptions } from "sequelize";
import { connectDB } from "./database";
import { initModels } from "../models";
import { Post as PostType, Category as CategoryType, PostsResponse } from "../types";

export async function getPosts(
  page = 1,
  limit = 16,
  filters?: { categoryId?: number; categoryName?: string; others?: boolean }
): Promise<PostsResponse> {
  await connectDB();
  const { Post, Category } = initModels();

  const offset = (page - 1) * limit;
  let whereClause: WhereOptions = {};

  if (filters?.others) {
    const targetNames = ["Mangas", "Livros", "Filmes", "Séries", "Cursos", "Outras"];
    const targetCategories = await Category.findAll({
      where: { name: targetNames },
    });
    const targetIds = targetCategories.map((c: any) => c.id);
    whereClause = { categoryId: { [Op.notIn]: targetIds.length ? targetIds : [-1] } };
  } else if (filters?.categoryId) {
    whereClause = { categoryId: filters.categoryId };
  } else if (filters?.categoryName) {
    const cat = await Category.findOne({
      where: { name: filters.categoryName },
    });
    whereClause = cat ? { categoryId: cat.id } : { categoryId: -1 };
  }

  const totalPosts = await Post.count({ where: whereClause });

  const posts = await Post.findAll({
    include: [{ model: Category, as: "Category" }],
    where: whereClause,
    order: [["data_post", "DESC"]],
    limit,
    offset,
  });

  const totalPages = Math.ceil(totalPosts / limit);

  return {
    posts: posts.map((post: any) => post.toJSON() as PostType),
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getPostById(id: number): Promise<PostType | null> {
  await connectDB();
  const { Post, Category } = initModels();

  const post = await Post.findByPk(id, {
    include: [{ model: Category, as: "Category" }],
  });

  return post ? (post.toJSON() as PostType) : null;
}

export async function getAllCategories(): Promise<CategoryType[]> {
  await connectDB();
  const { Category } = initModels();

  const categories = await Category.findAll({ order: [["name", "ASC"]] });
  return categories.map((cat: any) => cat.toJSON() as CategoryType);
}

export async function searchPosts(
  searchTerm: string,
  page = 1,
  limit = 16
): Promise<PostsResponse> {
  await connectDB();
  const { Post, Category } = initModels();

  const offset = (page - 1) * limit;

  let whereCondition: WhereOptions = {};
  if (searchTerm.trim()) {
    whereCondition = {
      [Op.or]: [
        { titulo: { [Op.like]: `%${searchTerm}%` } },
        { resumo: { [Op.like]: `%${searchTerm}%` } },
      ],
    };
  }

  const totalPosts = await Post.count({ where: whereCondition });

  const posts = await Post.findAll({
    where: whereCondition,
    include: [{ model: Category, as: "Category" }],
    order: [["data_post", "DESC"]],
    limit,
    offset,
  });

  const totalPages = Math.ceil(totalPosts / limit);

  return {
    posts: posts.map((post: any) => post.toJSON() as PostType),
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      searchTerm,
    },
  };
}
