'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { LayoutGrid, List, Map as MapIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import BusinessCard from './BusinessCard';
import BusinessTable from './BusinessTable'; // Assuming this exists or I'll create it/use existing
import AnalyticsSummary from './AnalyticsSummary';
import SearchFilters from './SearchFilters';

const BusinessMap = dynamic(() => import('./BusinessMap'), { ssr: false });

export default function BusinessDashboard({ initialData, showStats = true }) {
  const [viewMode, setViewMode] = useState('grid'); // grid, table, map
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(initialData.page) || 1;
  const limit = parseInt(searchParams.get('limit') || '12');
  const total = initialData.total || 0;
  const totalPages = initialData.pages || 1;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page to 1 when changing filters other than page
    if (key !== 'page') {
        params.set('page', '1');
    }
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Business Directory</h1>
          <p className="text-lg text-gray-600 mt-2">Manage your local businesses.</p>
        </div>

        {showStats && (
            <AnalyticsSummary 
              total={initialData.total} 
              openNow={initialData.openNowCount} 
              avgRating={initialData.avgRating} 
              totalReviews={initialData.totalReviews}
              deletedCount={initialData.deletedCount} 
            />
        )}

        <SearchFilters />

        {/* View Toggle & Results Count */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
             <p className="text-gray-600 font-medium">
               Showing <span className="text-gray-900 font-bold">{total > 0 ? startItem : 0}–{endItem}</span> of <span className="text-gray-900 font-bold">{total}</span> results
             </p>
             <select 
                value={limit} 
                onChange={(e) => updateParam('limit', e.target.value)}
                className="border-gray-300 rounded-md text-sm py-1 pl-2 pr-8 shadow-sm focus:border-blue-500 focus:ring-blue-500"
             >
                <option value="12">12 per page</option>
                <option value="24">24 per page</option>
                <option value="48">48 per page</option>
             </select>
          </div>

          <div className="bg-white p-1 rounded-lg border border-gray-200 flex items-center shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-gray-100 text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              title="Table View"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-gray-100 text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              title="Map View"
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'map' ? (
          <BusinessMap businesses={initialData.data} />
        ) : viewMode === 'table' ? (
           <BusinessTable businesses={initialData.data} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialData.data.map((business) => (
              <BusinessCard key={business._id} business={business} />
            ))}
          </div>
        )}

        {/* Enhanced Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
               <button 
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <ChevronLeft className="w-5 h-5" />
               </button>

               {/* Simple Page Numbers */}
               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                   // Logic to show pages around current page could happen here, keeping it simple for now (1..5 or sliding)
                   // Let's do a simple sliding window if needed, but for now 1...min(5, totalPages) is okay, 
                   // or better: show current page + neighbours.
                   
                   let p = i + 1;
                   if (totalPages > 5) {
                      if (page > 3) {
                          p = page - 2 + i;
                      }
                      if (p > totalPages) return null;
                   }
                   
                   return (
                       <button 
                          key={p} 
                          onClick={() => handlePageChange(p)}
                          className={`w-10 h-10 rounded-lg border font-medium transition-colors ${
                              page === p 
                              ? 'bg-black text-white border-black' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                       >
                          {p}
                       </button>
                   );
               }).filter(Boolean)}

               <button 
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <ChevronRight className="w-5 h-5" />
               </button>
          </div>
        )}
      </div>
    </div>
  );
}
