import CategoryPage from "../../components/CategoryPage";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function OutrasPage({ searchParams }: PageProps) {
  return <CategoryPage title="Outras" others searchParams={searchParams} />;
}
