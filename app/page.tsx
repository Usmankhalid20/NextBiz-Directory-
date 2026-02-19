import { getBusinesses } from '@/lib/getBusinesses';
import BusinessDashboard from '@/components/BusinessDashboard';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

interface UserDashboardProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UserDashboard({ searchParams }: UserDashboardProps) {
  const params = await searchParams;
  const safeParams = params || {};
  
  // Convert generic search params to specific types expected by getBusinesses if needed
  // getBusinesses expects any currently based on my previous refactor, or I need to check
  // getBusinesses signature in lib/getBusinesses.ts takes "any" or a specific interface?
  // It takes "filters: any". So passing safeParams is fine.
  
  const data = await getBusinesses(safeParams);

  return (
    <main className="min-h-screen bg-gray-50">
      <BusinessDashboard initialData={data} showStats={false} />
    </main>
  );
}
