import { getBusinesses } from '@/lib/getBusinesses';
import BusinessDashboard from '@/components/BusinessDashboard';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function UserDashboard({ searchParams }) {
  const params = await searchParams;
  const safeParams = params || {};
  
  // User Dashboard: showStats=false (as per requirement, mainly search/filter/list)
  // or maybe show stats? Requirement says "Users can only access public dashboard".
  // Let's show search/filter and list.
  
  const data = await getBusinesses(safeParams);

  return (
    <main className="min-h-screen bg-gray-50">
      <BusinessDashboard initialData={data} showStats={false} />
    </main>
  );
}
