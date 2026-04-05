import CategoryPage from "../../components/CategoryPage";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function SeriesPage({ searchParams }: PageProps) {
  return <CategoryPage title="Séries" categoryName="Séries" searchParams={searchParams} />;
}
