import { Suspense } from 'react';
import UploadForm from '@/components/admin/UploadForm';
import UploadHistoryTable from '@/components/admin/UploadHistoryTable';
import { cookies } from 'next/headers'; 

export const dynamic = 'force-dynamic';

async function getUploadHistory() {
   const cookieStore = await cookies();
   const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/upload-logs?limit=20`, {
       headers: { Cookie: cookieStore.toString() },
       cache: 'no-store'
   });
   
   if (!res.ok) {
       return []; 
   }
   const json = await res.json();
   return json.data || [];
}

export default async function UploadPage() {
  const logs = await getUploadHistory();

  return (
    <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Bulk Data Upload</h1>
        
        <UploadForm />

        <div className="mt-8">
            <Suspense fallback={<div>Loading history...</div>}>
                <UploadHistoryTable logs={logs} />
            </Suspense>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="font-bold text-gray-900 mb-3">CSV Format Guide</h3>
             <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
placeId,businessName,address,category,phone,website,rating,isOpenNow
123,Best Coffee,123 Main St,Cafe,555-0123,https://example.com,4.5,true
             </pre>
        </div>
    </div>
  );
}
