'use client';

import React from 'react';
import { Card, CardBody, CardTitle, CardText, Button, Badge } from 'reactstrap';
import Link from 'next/link';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  showActions = false,
  onEdit,
  onDelete
}) => {
  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getProgressText = () => {
    if (!post.Category) return '';

    switch (post.Category.id) {
      case 1:
      case 3:
        return `Lido até: ${post.lido_ate || 'N/A'}`;
      case 2:
      case 4:
        return `Visto até: ${post.lido_ate || 'N/A'}`;
      case 5:
        return `Feito até: ${post.lido_ate || 'N/A'}`;
      default:
        return `Até: ${post.lido_ate || 'N/A'}`;
    }
  };

  return (
    <Card className="h-100 shadow-sm border-0 bg-light">
      <div className="position-relative overflow-hidden rounded-top">
        <img
          src={post.imagem || '/placeholder-image.jpg'}
          alt={post.titulo}
          className="card-img-top transition-all hover-scale"
          style={{
            height: '280px',
            objectFit: 'cover',
            backgroundColor: '#f8f9fa'
          }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <Badge color="primary" pill className="fs-6">
            {post.Category?.name || 'Sem categoria'}
          </Badge>
        </div>
      </div>

      <CardBody className="d-flex flex-column p-4">
        <CardTitle tag="h5" className="text-center mb-3 fw-bold text-dark">
          {post.titulo}
        </CardTitle>

        <CardText className="text-muted small mb-3 text-center">
          {post.resumo.length > 150
            ? `${post.resumo.substring(0, 150)}...`
            : post.resumo
          }
        </CardText>

        <div className="text-center mb-3">
          <div className="mb-2">
            <span className="text-warning fs-4 fw-bold">
              {renderStars(post.avaliacao)}
            </span>
          </div>
          <small className="text-muted fw-medium">
            {post.avaliacao}/5 estrelas
          </small>
        </div>

        <div className="text-center mb-3">
          <small className="text-muted bg-light px-2 py-1 rounded">
            📖 {getProgressText()}
          </small>
        </div>

        <div className="mt-auto">
          <Link href={`/post/${post.id}`}>
            <Button color="success" size="sm" className="w-100 fw-bold">
              📖 Ler mais
            </Button>
          </Link>
        </div>

        {showActions && (
          <div className="d-flex gap-2 mt-3">
            <Button
              color="primary"
              size="sm"
              className="flex-fill fw-bold"
              onClick={() => onEdit?.(post)}
            >
              ✏️ Editar
            </Button>
            <Button
              color="danger"
              size="sm"
              className="flex-fill fw-bold"
              onClick={() => onDelete?.(post.id)}
            >
              🗑️ Deletar
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PostCard;