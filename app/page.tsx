import { getBusinesses } from '@/lib/getBusinesses';
import BusinessDashboard from '@/components/BusinessDashboard';

// Force dynamic rendering since we rely on searchParams
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams; 
  // Convert params to plain object for getBusinesses if needed, or cast it.
  // getBusinesses expects a plain object.
  const safeParams: any = params || {};
  
  const data = await getBusinesses(safeParams);

  return (
    <main className="min-h-screen bg-gray-50">
      <BusinessDashboard initialData={data} searchParams={safeParams} />
    </main>
  );
}
