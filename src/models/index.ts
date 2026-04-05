import { getSequelize } from "../lib/database";
import { initCategory, getCategory } from "./Category";
import { initPost, getPost } from "./Post";
import { initUser, getUser } from "./User";

export function initModels() {
  const sequelize = getSequelize();
  const Category = initCategory(sequelize);
  const Post = initPost(sequelize);
  const User = initUser(sequelize);

  Post.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "Category",
  });

  Category.hasMany(Post, {
    foreignKey: "categoryId",
    as: "Posts",
  });

  return { Category, Post, User };
}

export { getCategory, getPost, getUser };
