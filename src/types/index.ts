// Tipos para o Blog de Avaliações

export interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: number;
  titulo: string;
  imagem?: string;
  resumo: string;
  avaliacao: number;
  data_post: Date;
  categoryId: number;
  lido_ate?: string;
  finalizado: boolean;
  Category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  name?: string;
  role: 'admin' | 'user';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  searchTerm?: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationInfo;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserResponse;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface CreatePostData {
  titulo: string;
  resumo: string;
  avaliacao: number;
  categoryId: number;
  lido_ate?: string;
  imagem?: File;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: number;
}

export interface SearchFilters {
  categoryId?: number;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

// Tipos para componentes React
export interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export interface PostFormProps {
  post?: Post;
  categories: Category[];
  onSubmit: (data: CreatePostData | UpdatePostData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}