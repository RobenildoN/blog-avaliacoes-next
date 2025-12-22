'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert, Spinner } from 'reactstrap';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { LoginCredentials } from '../../types';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const success = await login(credentials.email, credentials.password);

      if (success) {
        router.push('/admin');
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <Layout>
        <Container className="text-center py-5">
          <Spinner color="primary" />
          <p className="mt-3">Carregando...</p>
        </Container>
      </Layout>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow">
              <CardBody className="p-4">
                <CardTitle tag="h2" className="text-center mb-4">
                  Login
                </CardTitle>

                {error && (
                  <Alert color="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Digite seu email"
                      value={credentials.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="password">Senha</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Digite sua senha"
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </FormGroup>

                  <Button
                    color="primary"
                    type="submit"
                    block
                    className="mt-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Não tem uma conta?{' '}
                    <a href="/register" className="text-primary">
                      Registre-se aqui
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