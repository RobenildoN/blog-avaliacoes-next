import User from './User';
import Category from './Category';
import Post from './Post';
import { setupAssociations } from './associations';

// Configurar associações
setupAssociations();

export { User, Category, Post, setupAssociations };