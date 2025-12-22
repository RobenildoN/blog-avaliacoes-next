'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'reactstrap';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { Post, PostsResponse } from '../types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/posts?page=${page}&limit=16`);
      if (!response.ok) {
        throw new Error('Erro ao carregar posts');
      }

      const data: PostsResponse = await response.json();
      setPosts(data.posts);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setHasNextPage(data.pagination.hasNextPage);
      setHasPrevPage(data.pagination.hasPrevPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchPosts(newPage);
  };

  if (loading && posts.length === 0) {
    return (
      <Layout>
        <Container className="text-center py-5">
          <Spinner color="primary" />
          <p className="mt-3">Carregando posts...</p>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout showAdminLink={true}>
      <Container className="py-4">
        <Row className="mb-5">
          <Col className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-4">Últimos Posts</h1>
            <p className="lead text-muted mb-4">Descubra avaliações incríveis de mangas, livros, filmes, séries e cursos</p>
          </Col>
        </Row>

        {error && (
          <Row className="mb-4">
            <Col>
              <Alert color="danger">
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          {posts.map((post) => (
            <Col key={post.id} md={6} lg={4} xl={3} className="mb-4">
              <PostCard post={post} />
            </Col>
          ))}
        </Row>

        {posts.length === 0 && !loading && (
          <Row>
            <Col className="text-center py-5">
              <p className="text-muted">Nenhum post encontrado.</p>
            </Col>
          </Row>
        )}

        {/* Pagination Controls */}
        {(hasPrevPage || hasNextPage) && (
          <Row className="mt-4">
            <Col className="text-center">
              <div className="d-flex justify-content-center align-items-center gap-3">
                <Button
                  color="secondary"
                  disabled={!hasPrevPage}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </Button>

                <span className="fw-bold">
                  Página {currentPage} de {totalPages}
                </span>

                <Button
                  color="primary"
                  disabled={!hasNextPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Próximo
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </Layout>
  );
}
