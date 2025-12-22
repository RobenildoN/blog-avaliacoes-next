# Blog de Avaliações - Next.js

Aplicação web para avaliações de mangas, livros, filmes, séries e cursos, construída com Next.js (App Router), React e TypeScript, com API de posts e categorias, painel administrativo e upload de imagens.

## 🚀 Tecnologias Utilizadas

- Next.js 15 (App Router)
- React 19
- TypeScript
- Reactstrap + Bootstrap 5
- Sequelize ORM
- SQLite (padrão de desenvolvimento) e MySQL/PostgreSQL (suportados)
- Multer para upload de imagens
- JWT para autenticação básica
- SCSS

## 📋 Funcionalidades

### ✅ Implementadas

- Página inicial com paginação
- Login com autenticação JWT
- Painel Admin para criar, editar e deletar posts
- Upload de imagem nos posts (criação e edição)
- API REST para posts e categorias
- Páginas por categoria: Mangas, Livros, Filmes, Séries, Cursos e Outras
- Página de detalhes do post acessível pelo botão “Ler mais”
- Layout responsivo; cabeçalho e rodapé em azul claro

### 🔄 Planejadas

- Migração para NextAuth.js
- Melhores práticas de SEO e otimização

## 🏗️ Arquitetura

```
blog-avaliacoes-next/
├── src/
│   ├── app/                    # Páginas Next.js (App Router)
│   │   ├── page.tsx            # Página inicial
│   │   ├── login/              # Página de login
│   │   ├── admin/              # Painel administrativo
│   │   ├── post/[id]/          # Página de detalhes do post
│   │   ├── mangas/             # Página Mangas
│   │   ├── livros/             # Página Livros
│   │   ├── filmes/             # Página Filmes
│   │   ├── series/             # Página Séries
│   │   ├── cursos/             # Página Cursos
│   │   └── outras/             # Página Outras
│   ├── components/            # Componentes React
│   │   ├── Layout.tsx         # Layout principal
│   │   └── PostCard.tsx       # Card de post
│   ├── lib/                   # Utilitários
│   │   └── database.ts        # Configuração do banco
│   ├── models/                # Modelos Sequelize
│   │   ├── User.ts
│   │   ├── Category.ts
│   │   ├── Post.ts
│   │   └── associations.ts
│   ├── pages/api/             # API Routes
│   │   ├── posts/              # CRUD de posts
│   │   ├── categories/         # Gerenciamento de categorias
│   │   │   └── ensure.ts       # Garante categorias padrão
│   │   └── auth/               # Autenticação
│   └── types/                 # Tipos TypeScript
│       └── index.ts
├── .env.local                 # Variáveis de ambiente
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

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# NextAuth (planejado)
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 📊 API Endpoints

### Posts

- `GET /api/posts` lista paginada; filtros `categoryId`, `categoryName` e `others=true`
- `POST /api/posts` cria post; aceita `application/json` ou `multipart/form-data` com campo `imagem`
- `GET /api/posts/[id]` busca por ID
- `PUT /api/posts/[id]` atualiza; aceita `multipart/form-data` com `imagem`
- `DELETE /api/posts/[id]` remove post
- `GET /api/posts/search` busca por termo

### Categorias

- `GET /api/categories` lista categorias
- `POST /api/categories` cria categoria
- `POST /api/categories/ensure` garante categorias padrão: Mangas, Livros, Filmes, Séries, Cursos, Outras

### Autenticação

- `POST /api/auth/login` login de usuário

## 🎨 Componentes Principais

### Layout

Layout com navegação, cabeçalho e rodapé em azul claro.

### PostCard

Card para exibir posts com imagem, resumo, avaliação e categoria.

### Formulários

Formulários de criação e edição com suporte a upload de imagem.

## 🖼️ Upload de Imagens

- Armazenamento em `public/uploads` (criado automaticamente)
- Limite de tamanho de arquivo: 5MB
- Tipos aceitos: `image/*`

## 🔐 Autenticação

Implementada com JWT. Planejada migração para NextAuth.js.

## 📱 Responsividade

A aplicação é totalmente responsiva, funcionando perfeitamente em:

- Desktop
- Tablet
- Mobile

## 🚀 Performance

- SSR/SG com Next.js
- API Routes otimizadas

## 🔄 Migração do Projeto Original

Este projeto foi refatorado a partir de uma aplicação Electron com:

- Backend Express.js + Sequelize
- Frontend HTML puro + JavaScript vanilla
- App desktop Electron

### Melhorias Implementadas

- Performance com SSR/SSG
- Manutenibilidade com TypeScript e componentes
- UX com Reactstrap e design responsivo
- Escalabilidade modular

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

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autor

**Autor** - Desenvolvimento inicial

## 🙏 Agradecimentos

- Next.js team pela documentação excepcional
- Reactstrap pela biblioteca de componentes
- Comunidade open source
