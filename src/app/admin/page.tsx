"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Alert,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import PostCard from "../../components/PostCard";
import { useAuth } from "../../contexts/AuthContext";
import { Post, Category, CreatePostData, UpdatePostData } from "../../types";

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<CreatePostData>({
    titulo: "",
    resumo: "",
    avaliacao: 5,
    categoryId: 0,
    lido_ate: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const allowedCategoryNames = ["Mangas", "Livros", "Filmes", "Séries", "Cursos", "Outras"];

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Carregar dados
  useEffect(() => {
    if (isAuthenticated) {
      const init = async () => {
        try {
          await fetch("/api/categories/ensure", { method: "POST" });
        } catch (_) {}
        await fetchCategories();
        await fetchPosts();
      };
      init();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Erro ao carregar posts");
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Erro ao carregar categorias");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "avaliacao" || name === "categoryId" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : "/api/posts";
      const method = editingPost ? "PUT" : "POST";

      let response: Response;
      if (imageFile) {
        const form = new FormData();
        form.set("titulo", formData.titulo);
        form.set("resumo", formData.resumo);
        form.set("avaliacao", String(formData.avaliacao));
        form.set("categoryId", String(formData.categoryId));
        if (formData.lido_ate) form.set("lido_ate", formData.lido_ate);
        if (imageFile) form.set("imagem", imageFile);
        response = await fetch(url, { method, body: form });
      } else {
        response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) throw new Error("Erro ao salvar post");

      await fetchPosts();
      setModalOpen(false);
      resetForm();
      setImageFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      titulo: post.titulo,
      resumo: post.resumo,
      avaliacao: post.avaliacao,
      categoryId: post.categoryId,
      lido_ate: post.lido_ate || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este post?")) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar post");

      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      resumo: "",
      avaliacao: 5,
      categoryId: 0,
      lido_ate: "",
    });
    setEditingPost(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };
  /* removed category creation UI */

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <Container className="text-center py-5">
          <Spinner color="primary" />
          <p className="mt-3">Verificando autenticação...</p>
        </Container>
      </Layout>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <Container className="py-4">
        <Row className="mb-4">
          <Col className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-3">
              Painel Administrativo
            </h1>
            <Button color="success" size="lg" onClick={openCreateModal}>
              Criar Novo Post
            </Button>
            {/* categoria creation hidden */}
          </Col>
        </Row>

        {error && (
          <Row className="mb-4">
            <Col>
              <Alert color="danger" toggle={() => setError(null)}>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          {posts.map((post) => (
            <Col key={post.id} md={6} lg={4} xl={3} className="mb-4">
              <PostCard
                post={post}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>

        {posts.length === 0 && !loading && (
          <Row>
            <Col className="text-center py-5">
              <p className="text-muted">
                Nenhum post encontrado. Crie o primeiro post!
              </p>
            </Col>
          </Row>
        )}

        {/* Modal de criação/edição */}
        <Modal
          isOpen={modalOpen}
          toggle={() => setModalOpen(!modalOpen)}
          size="lg"
        >
          <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
            {editingPost ? "Editar Post" : "Criar Novo Post"}
          </ModalHeader>
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="titulo">Título</Label>
                <Input
                  type="text"
                  name="titulo"
                  id="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="resumo">Resumo</Label>
                <Input
                  type="textarea"
                  name="resumo"
                  id="resumo"
                  value={formData.resumo}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </FormGroup>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="avaliacao">Avaliação (1-5)</Label>
                    <Input
                      type="number"
                      name="avaliacao"
                      id="avaliacao"
                      value={formData.avaliacao}
                      onChange={handleInputChange}
                      min={1}
                      max={5}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="categoryId">Categoria</Label>
                    <Input
                      type="select"
                      name="categoryId"
                      id="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value={0}>Selecione uma categoria</option>
                      {categories
                        .filter((category) => allowedCategoryNames.includes(category.name))
                        .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label for="imagem">Imagem do Post (opcional)</Label>
                <Input
                  type="file"
                  id="imagem"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFile(
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : null
                    )
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label for="lido_ate">Lido até (opcional)</Label>
                <Input
                  type="text"
                  name="lido_ate"
                  id="lido_ate"
                  value={formData.lido_ate}
                  onChange={handleInputChange}
                  placeholder="Ex: Capítulo 10, Página 150, Temporada 2"
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button color="primary" type="submit">
                {editingPost ? "Salvar Alterações" : "Criar Post"}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
        {/* category modal removed */}
      </Container>
    </Layout>
  );
}
