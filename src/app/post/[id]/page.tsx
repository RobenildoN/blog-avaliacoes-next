import { notFound } from "next/navigation";
import { Container, Row, Col, Button, Badge } from "reactstrap";
import Layout from "../../../components/Layout";
import { getPostById } from "../../../lib/data-fetching";

export const dynamic = 'force-dynamic';

interface PostDetailProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (!id) {
    notFound();
  }

  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <Layout>
      <Container className="py-4">
        <Row className="mb-4">
          <Col className="text-center">
            <h1 className="display-5 fw-bold text-primary mb-2">
              {post.titulo}
            </h1>
            <div className="mt-1">
              <Badge color="primary" pill>
                {post.Category?.name || "Sem categoria"}
              </Badge>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center mb-4">
          <Col md={8}>
            <img
              src={post.imagem || "/placeholder-image.jpg"}
              alt={post.titulo}
              className="w-100 rounded shadow"
              style={{
                maxHeight: 420,
                objectFit: "cover",
                backgroundColor: "#f8f9fa",
              }}
            />
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={8}>
            <div className="mb-3">
              <span className="text-warning fs-4 fw-bold">
                {"★".repeat(Math.round(post.avaliacao)) +
                  "☆".repeat(5 - Math.round(post.avaliacao))}
              </span>
              <small className="text-muted ms-2">
                {post.avaliacao}/5 estrelas
              </small>
            </div>
            <p className="lead">{post.resumo}</p>
            {post.lido_ate && (
              <p className="text-muted">Progresso: {post.lido_ate}</p>
            )}
            <Button color="secondary" href="/">
              Voltar
            </Button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
