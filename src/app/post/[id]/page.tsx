"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Row, Col, Spinner, Alert, Button, Badge } from "reactstrap";
import Layout from "../../../components/Layout";
import { Post } from "../../../types";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(params?.id);
    if (!id) {
      setError("ID inválido");
      setLoading(false);
      return;
    }
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Erro ao carregar post");
        const data: Post = await res.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params?.id]);

  if (loading) {
    return (
      <Layout>
        <Container className="text-center py-5">
          <Spinner color="primary" />
        </Container>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <Container className="py-5">
          <Alert color="danger">{error || "Post não encontrado"}</Alert>
          <Button color="secondary" onClick={() => router.back()}>
            Voltar
          </Button>
        </Container>
      </Layout>
    );
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
            <Button color="secondary" onClick={() => router.back()}>
              Voltar
            </Button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
