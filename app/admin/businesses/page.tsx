import { getBusinesses } from '@/lib/getBusinesses';
import BusinessDashboard from '@/components/BusinessDashboard';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface BusinessListPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BusinessListPage({ searchParams }: BusinessListPageProps) {
  const params = await searchParams; 
  // @ts-ignore
  const safeParams = { ...params, isAdmin: true } || { isAdmin: true };
  
  const data = await getBusinesses(safeParams);

  return (
    <main className="min-h-screen bg-gray-50">
      <BusinessDashboard initialData={data} showStats={false} />
    </main>
  );
}
