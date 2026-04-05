# Blog de Avaliações - Next.js

Aplicação web para avaliações de mangas, livros, filmes, séries e cursos, construída com Next.js 15 (App Router), React 19 e TypeScript, com API de posts e categorias, painel administrativo, busca funcional e upload de imagens.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** (App Router + Pages API)
- **React 19**
- **TypeScript**
- **Reactstrap + Bootstrap 5**
- **Sequelize ORM** com inicialização lazy
- **SQLite** (padrão de desenvolvimento) e MySQL/PostgreSQL (suportados)
- **Multer** para upload de imagens
- **JWT** com cookies HttpOnly
- **Middleware** para proteção de rotas

## 📋 Funcionalidades

### ✅ Implementadas

- **Server-Side Rendering (SSR)** nas páginas públicas (home, categorias, detalhes)
- **Busca funcional** por título e resumo com paginação
- **Paginação** em todas as listagens
- **Login com autenticação JWT** via cookies HttpOnly
- **Middleware** protegendo rota `/admin`
- **Painel Admin** para criar, editar e deletar posts
- **Upload de imagem** nos posts (criação e edição)
- **API REST** para posts e categorias
- **Páginas por categoria**: Mangas, Livros, Filmes, Séries, Cursos e Outras
- **Página de detalhes** do post
- **Layout responsivo** com cabeçalho e rodapé
- **Inicialização lazy** dos modelos do banco (evita erros no build)

## 🏗️ Arquitetura

```
blog-avaliacoes-next/
├── src/
│   ├── app/                        # Páginas Next.js (App Router)
│   │   ├── page.tsx                # Home com busca e paginação (SSR)
│   │   ├── login/                  # Página de login
│   │   ├── register/               # Página de registro
│   │   ├── admin/                  # Painel administrativo (protegido)
│   │   ├── post/[id]/              # Detalhes do post (SSR)
│   │   ├── mangas/                 # Página Mangas (SSR)
│   │   ├── livros/                 # Página Livros (SSR)
│   │   ├── filmes/                 # Página Filmes (SSR)
│   │   ├── series/                 # Página Séries (SSR)
│   │   ├── cursos/                 # Página Cursos (SSR)
│   │   └── outras/                 # Página Outras (SSR)
│   ├── middleware.ts               # Proteção de rotas com JWT
│   ├── components/                 # Componentes React
│   │   ├── Layout.tsx              # Layout com busca funcional
│   │   ├── PostCard.tsx            # Card de post
│   │   └── CategoryPage.tsx        # Template de categoria (SSR)
│   ├── contexts/                   # Contextos React
│   │   └── AuthContext.tsx         # Auth com cookies HttpOnly
│   ├── lib/                        # Utilitários
│   │   ├── database.ts             # Conexão lazy com Sequelize
│   │   ├── data-fetching.ts        # Funções server-side para SSR
│   │   ├── auth.ts                 # Helpers JWT
│   │   └── sync-db.ts              # Sincronização do banco
│   ├── models/                     # Modelos Sequelize (lazy init)
│   │   ├── index.ts                # initModels() com associações
│   │   ├── User.ts
│   │   ├── Category.ts
│   │   └── Post.ts
│   ├── pages/api/                  # API Routes
│   │   ├── posts/                  # CRUD + search
│   │   ├── categories/             # Gerenciamento de categorias
│   │   │   └── ensure.ts           # Garante categorias padrão
│   │   └── auth/                   # login, logout, me, register, verify
│   └── types/                      # Tipos TypeScript
│       └── index.ts
├── .env.local                      # Variáveis de ambiente
└── package.json
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Opcional: MySQL/PostgreSQL (SQLite é padrão de desenvolvimento)

### Instalação

1. **Clone o repositório**:

   ```bash
   git clone <repository-url>
   cd blog-avaliacoes-next
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Configure o banco de dados** (opcional):

   - Por padrão, usa SQLite (`./database.sqlite`)
   - Para MySQL/PostgreSQL, configure `.env.local`

4. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**:
   - Página inicial: http://localhost:3000
   - Login: http://localhost:3000/login
   - Admin: http://localhost:3000/admin

## 🔧 Configuração

### Variáveis de Ambiente (.env.local)

```env
# SQLite (padrão de desenvolvimento)
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite

# MySQL/PostgreSQL (opcional)
# DB_DIALECT=mysql # ou 'postgres'
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=blog_avaliacoes

# JWT Secret (obrigatório em produção)
JWT_SECRET=your_super_secret_jwt_key_here
```

## 📊 API Endpoints

### Posts

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/posts` | Lista paginada; filtros `categoryId`, `categoryName`, `others=true` |
| `POST` | `/api/posts` | Cria post; aceita JSON ou `multipart/form-data` com campo `imagem` |
| `GET` | `/api/posts/[id]` | Busca por ID |
| `PUT` | `/api/posts/[id]` | Atualiza; aceita `multipart/form-data` com `imagem` |
| `DELETE` | `/api/posts/[id]` | Remove post |
| `GET` | `/api/posts/search` | Busca por termo (`?q=termo`) |

### Categorias

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/categories` | Lista categorias |
| `POST` | `/api/categories` | Cria categoria |
| `POST` | `/api/categories/ensure` | Garante categorias padrão |

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/login` | Login (define cookie HttpOnly) |
| `POST` | `/api/auth/logout` | Logout (remove cookies) |
| `GET` | `/api/auth/me` | Retorna usuário atual |
| `POST` | `/api/auth/register` | Registra novo usuário |
| `POST` | `/api/auth/verify` | Verifica token JWT |

## 🔐 Autenticação

Autenticação implementada com **JWT + cookies HttpOnly**:

1. Login via `/api/auth/login` retorna cookie `auth_token` com flag `HttpOnly`
2. Middleware em `src/middleware.ts` valida o token antes de acessar `/admin`
3. `AuthContext` usa `/api/auth/me` para verificar sessão ao carregar
4. Logout via `/api/auth/logout` limpa os cookies automaticamente

## 🖼️ Upload de Imagens

- Armazenamento em `public/uploads` (criado automaticamente)
- Limite de tamanho: 5MB
- Tipos aceitos: `image/*`

## 📱 Responsividade

A aplicação é totalmente responsiva:
- Desktop
- Tablet
- Mobile

## 🚀 Performance

- **SSR** (Server-Side Rendering) em todas as páginas públicas
- **Inicialização lazy** do Sequelize (conexão só ao usar)
- **Modelos lazy** (`initModels()` evita erro no build)
- **Dynamic routes** com `force-dynamic` para dados em tempo real

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autor

**Autor** - Desenvolvimento inicial

## 🙏 Agradecimentos

- Next.js team pela documentação excepcional
- Reactstrap pela biblioteca de componentes
- Comunidade open source
