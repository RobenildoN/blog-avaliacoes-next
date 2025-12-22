"use client";

import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { RegisterData } from "../../types";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.message || "Erro ao realizar cadastro");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow border-0">
              <CardBody className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Criar Conta</h2>
                  <p className="text-muted">
                    Preencha os dados para se cadastrar
                  </p>
                </div>

                {error && (
                  <Alert color="danger" toggle={() => setError(null)}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert color="success">
                    Cadastro realizado com sucesso! Redirecionando...
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <FormGroup className="mb-3">
                    <Label for="name">Nome</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={loading || success}
                    />
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label for="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading || success}
                    />
                  </FormGroup>

                  <FormGroup className="mb-4">
                    <Label for="password">Senha</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Crie uma senha"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={4}
                      disabled={loading || success}
                    />
                  </FormGroup>

                  <Button
                    color="primary"
                    type="submit"
                    block
                    className="w-100 py-2 fw-bold"
                    disabled={loading || success}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar"
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    Já tem uma conta?{" "}
                    <a
                      href="/login"
                      className="text-primary text-decoration-none fw-bold"
                    >
                      Faça login
                    </a>
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
