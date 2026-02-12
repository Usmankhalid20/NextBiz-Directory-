'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { LayoutGrid, List, Map as MapIcon } from 'lucide-react';
import BusinessCard from './BusinessCard';
import BusinessTable from './BusinessTable'; // Assuming this exists or I'll create it/use existing
import AnalyticsSummary from './AnalyticsSummary';
import SearchFilters from './SearchFilters';

const BusinessMap = dynamic(() => import('./BusinessMap'), { ssr: false });

export default function BusinessDashboard({ initialData, searchParams }) {
  const [viewMode, setViewMode] = useState('grid'); // grid, table, map

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Business Directory</h1>
        <p className="text-lg text-gray-600 mt-2">Discover and connect with the best local businesses.</p>
      </div>

      <AnalyticsSummary 
        total={initialData.total} 
        openNow={initialData.openNowCount} 
        avgRating={initialData.avgRating} 
        totalReviews={initialData.totalReviews} 
      />

      <SearchFilters />

      {/* View Toggle & Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 font-medium">
          Showing <span className="text-gray-900 font-bold">{initialData.data.length}</span> of <span className="text-gray-900 font-bold">{initialData.total}</span> results
        </p>

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

      {/* Pagination Controls could be added here or inside SearchFilters/Separate Component */}
      {initialData.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
             {/* Simple Pagination Buttons */}
             {Array.from({ length: Math.min(5, initialData.pages) }, (_, i) => {
                 const p = i + 1;
                 // This is a simplified pagination. For full logic, we'd need a separate component component.
                 // For now, let's just rely on users using filters or basic next/prev if implemented.
                 return (
                     <a 
                        key={p} 
                        href={`/?page=${p}`}
                        className={`px-4 py-2 rounded-lg border ${Number(initialData.page) === p ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                     >
                        {p}
                     </a>
                 );
             })}
        </div>
      )}
    </div>
  );
}
