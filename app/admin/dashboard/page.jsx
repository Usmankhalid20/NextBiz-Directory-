import { getAdminStats } from '@/lib/getAdminStats';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Suspense } from 'react';

// Force dynamic rendering since we rely on DB data that changes often
export const dynamic = 'force-dynamic';

export default async function Page() {
  // Fetch stats directly on the server
  const data = await getAdminStats();

  return (
    <main className="min-h-screen bg-gray-50">
       <Suspense fallback={<div className="p-6 text-center">Loading stats...</div>}>
          <AdminDashboard data={data} />
       </Suspense>
    </main>
  );
}
