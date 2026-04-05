import CategoryPage from "../../components/CategoryPage";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function CursosPage({ searchParams }: PageProps) {
  return <CategoryPage title="Cursos" categoryName="Cursos" searchParams={searchParams} />;
}
