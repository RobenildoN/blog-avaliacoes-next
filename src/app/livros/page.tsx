import CategoryPage from "../../components/CategoryPage";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function LivrosPage({ searchParams }: PageProps) {
  return <CategoryPage title="Livros" categoryName="Livros" searchParams={searchParams} />;
}
