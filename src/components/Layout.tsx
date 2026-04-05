"use client";

import React, { ReactNode, useState } from "react";
import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
} from "reactstrap";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (pathname === "/") {
      router.push("/");
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar dark expand="md" className="mb-4" style={{ backgroundColor: "#D3D3D3" }}>
        <Container fluid className="px-4">
          <div className="d-flex justify-content-center w-100 position-relative">
            <NavbarBrand href="/" className="text-black fw-bold fs-4">
              Blog de Avaliações
            </NavbarBrand>

            {isAuthenticated && (
              <div className="position-absolute end-0 top-50 translate-middle-y">
                <span className="text-black small">
                  Olá, {user?.name || user?.email}!
                </span>
              </div>
            )}
          </div>

          <form className="d-flex justify-content-center w-100 mt-2 mb-2" onSubmit={handleSearch}>
            <div className="d-flex align-items-center w-50">
              <input
                type="text"
                placeholder="Pesquisar títulos e resumos..."
                className="form-control me-2 w-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button color="success" size="sm" className="me-2" type="submit">
                Pesquisar
              </Button>
              <Button color="secondary" size="sm" type="button" onClick={handleClear}>
                Limpar
              </Button>
            </div>
          </form>

          <div className="d-flex justify-content-center w-100">
            <Nav navbar className="flex-row gap-2">
              <NavItem>
                <Link
                  href="/mangas"
                  className="nav-link text-white text-center bg-light px-3 py-2 rounded fw-semibold text-decoration-none"
                >
                  Mangas
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  href="/livros"
                  className="nav-link text-white text-center bg-light px-3 py-2 rounded fw-semibold text-decoration-none"
                >
                  Livros
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  href="/filmes"
                  className="nav-link text-white text-center bg-light px-3 py-2 rounded fw-semibold text-decoration-none"
                >
                  Filmes
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  href="/series"
                  className="nav-link text-white text-center bg-light px-3 py-2 rounded fw-semibold text-decoration-none"
                >
                  Séries
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  href="/cursos"
                  className="nav-link text-white text-center bg-light px-3 py-2 rounded fw-semibold text-decoration-none"
                >
                  Cursos
                </Link>
              </NavItem>
              <NavItem>
                <Link
                  href="/outras"
                  className="nav-link text-white text-center bg-light px-3 py-2 rounded fw-semibold text-decoration-none"
                >
                  Outras
                </Link>
              </NavItem>
              {isAuthenticated && (
                <NavItem>
                  <Link
                    href="/admin"
                    className="nav-link text-white text-center bg-light px-3 py-2 rounded fw-semibold text-decoration-none"
                  >
                    Criar Post
                  </Link>
                </NavItem>
              )}
              <NavItem>
                {isAuthenticated ? (
                  <div className="d-flex align-items-center">
                    <Button
                      color="danger"
                      className="text-white text-center px-3 py-2 rounded fw-semibold"
                      onClick={handleLogout}
                    >
                      Deslogar
                    </Button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="nav-link text-white text-center bg-light px-3 py-2 rounded fw-semibold text-decoration-none"
                  >
                    Logar
                  </Link>
                )}
              </NavItem>
            </Nav>
          </div>
        </Container>
      </Navbar>

      <main className="flex-grow-1">{children}</main>

      <footer className="text-white py-2 mt-2" style={{ backgroundColor: "#D3D3D3" }}>
        <Container className="d-flex justify-content-center">
          <small className=" text-black text-center mb-0">
            <Link href="/" className="text-black text-decoration-none fw-bold">
              Blog de Avaliações
            </Link >{' '}
            © 2025. Todos os direitos reservados.
          </small>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;
