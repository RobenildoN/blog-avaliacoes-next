import { Container, Row, Col, Button } from 'reactstrap';
import Layout from './Layout';
import PostCard from './PostCard';
import { getPosts } from '../lib/data-fetching';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  title: string;
  categoryName?: string;
  others?: boolean;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ title, categoryName, others, searchParams }: CategoryPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');

  const data = await getPosts(page, 16, { categoryName, others });
  const { posts, pagination } = data;
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  return (
    <Layout>
      <Container className="py-4">
        <Row className="mb-5">
          <Col className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-4">{title}</h1>
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
              <p className="text-muted">Nenhum post encontrado.</p>
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
                  href={hasPrevPage ? `?page=${currentPage - 1}` : undefined}
                >
                  Anterior
                </Button>
                <span className="fw-bold">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  color="primary"
                  disabled={!hasNextPage}
                  href={hasNextPage ? `?page=${currentPage + 1}` : undefined}
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
