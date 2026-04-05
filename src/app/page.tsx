import { Container, Row, Col, Button } from 'reactstrap';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { getPosts, searchPosts } from '../lib/data-fetching';

export const dynamic = 'force-dynamic';

interface HomeProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const query = params.q || '';

  const data = query
    ? await searchPosts(query, page, 16)
    : await getPosts(page, 16);

  const { posts, pagination } = data;
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  return (
    <Layout>
      <Container className="py-4">
        <Row className="mb-5">
          <Col className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-4">
              {query ? `Resultados para "${query}"` : 'Últimos Posts'}
            </h1>
            <p className="lead text-muted mb-4">
              {query
                ? `${pagination.totalPosts} resultado(s) encontrado(s)`
                : 'Descubra avaliações incríveis de mangas, livros, filmes, séries e cursos'}
            </p>
          </Col>
        </Row>

        <Row>
          {posts.map((post) => (
            <Col key={post.id} md={6} lg={4} xl={3} className="mb-4">
              <PostCard post={post} />
            </Col>
          ))}
        </Row>

        {posts.length === 0 && (
          <Row>
            <Col className="text-center py-5">
              <p className="text-muted">
                {query ? 'Nenhum resultado encontrado para sua busca.' : 'Nenhum post encontrado.'}
              </p>
            </Col>
          </Row>
        )}

        {(hasPrevPage || hasNextPage) && (
          <Row className="mt-4">
            <Col className="text-center">
              <div className="d-flex justify-content-center align-items-center gap-3">
                <Button
                  color="secondary"
                  disabled={!hasPrevPage}
                  href={hasPrevPage ? `/?q=${encodeURIComponent(query)}&page=${currentPage - 1}` : undefined}
                >
                  Anterior
                </Button>

                <span className="fw-bold">
                  Página {currentPage} de {totalPages}
                </span>

                <Button
                  color="primary"
                  disabled={!hasNextPage}
                  href={hasNextPage ? `/?q=${encodeURIComponent(query)}&page=${currentPage + 1}` : undefined}
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
