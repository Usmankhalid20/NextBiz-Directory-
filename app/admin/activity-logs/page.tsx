import { Suspense } from 'react';
import ActivityLogTable from '@/components/admin/ActivityLogTable';
import { cookies } from 'next/headers'; 

export const dynamic = 'force-dynamic';

interface ActivityLogsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getActivityLogs(page = 1) {
   const cookieStore = await cookies();
   const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/activity-logs?page=${page}`, {
       headers: { Cookie: cookieStore.toString() },
       cache: 'no-store'
   });
   
   if (!res.ok) {
       // Graceful fallback
       return { data: [], pagination: {} }; 
   }
   return res.json();
}

export default async function ActivityLogsPage({ searchParams }: ActivityLogsPageProps) {
  const params = await searchParams;
  // @ts-ignore
  const page = parseInt(params.page || '1');
  const { data: logs, pagination } = await getActivityLogs(page);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Activity Logs</h1>
        <p className="text-gray-500">Track system events and user actions.</p>
      </div>

      <Suspense fallback={<div>Loading logs...</div>}>
         <ActivityLogTable logs={logs} />
      </Suspense>

      {/* Basic Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map((p) => (
                <a
                    key={p}
                    href={`/admin/activity-logs?page=${p}`}
                    className={`px-3 py-1 rounded border ${p === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                    {p}
                </a>
            ))}
        </div>
      )}
    </div>
  );
}
