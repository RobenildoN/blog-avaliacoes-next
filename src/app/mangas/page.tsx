import CategoryPage from "../../components/CategoryPage";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function MangasPage({ searchParams }: PageProps) {
  return <CategoryPage title="Mangas" categoryName="Mangas" searchParams={searchParams} />;
}
