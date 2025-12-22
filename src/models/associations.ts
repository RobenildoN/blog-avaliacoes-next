import Category from './Category';
import Post from './Post';

// Configurar associações entre os modelos
export const setupAssociations = () => {
  // Post pertence a Category
  Post.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'Category'
  });

  // Category tem muitos Posts
  Category.hasMany(Post, {
    foreignKey: 'categoryId',
    as: 'Posts'
  });
};