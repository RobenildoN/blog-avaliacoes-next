import CategoryPage from "../../components/CategoryPage";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function FilmesPage({ searchParams }: PageProps) {
  return <CategoryPage title="Filmes" categoryName="Filmes" searchParams={searchParams} />;
}
