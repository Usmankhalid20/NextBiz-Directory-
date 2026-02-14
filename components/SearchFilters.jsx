'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw, CheckCircle } from 'lucide-react';

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [isOpen, setIsOpen] = useState(searchParams.get('isOpen') === 'true');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');

  const handleFilterChange = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All' && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset page on filter change
    params.set('page', '1');
    
    const newQueryString = params.toString();
    // Only push if query actually changed to avoid redundant loops
    if (newQueryString !== searchParams.toString()) {
        router.push(`/?${newQueryString}`);
    }
  }, [searchParams, router]);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (search !== currentSearch) {
         handleFilterChange('search', search);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, handleFilterChange, searchParams]);

  const categories = ['All', 'Food', 'Retail', 'Service', 'Health', 'Tech', 'Other']; // Should specific dynamic later

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
          <input
            type="text"
            placeholder="Search businesses, address, or keywords..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div className="md:w-48">
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black appearance-none cursor-pointer"
            value={category}
            onChange={(e) => {
                setCategory(e.target.value);
                handleFilterChange('category', e.target.value);
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="md:w-48">
             <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black appearance-none cursor-pointer"
                value={sort}
                onChange={(e) => {
                    setSort(e.target.value);
                    handleFilterChange('sort', e.target.value);
                }}
             >
                <option value="newest">Newest Listed</option>
                <option value="rating">Highest Rated</option>
                <option value="reviewCount">Most Reviewed</option>
                <option value="name">Alphabetical (A-Z)</option>
             </select>
        </div>
      </div>

      {/* Advanced Filters Row */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
         <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filters:
         </span>
         
         <label className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${isOpen ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <input 
                type="checkbox" 
                className="hidden" 
                checked={isOpen} 
                onChange={(e) => {
                    setIsOpen(e.target.checked);
                    handleFilterChange('isOpen', e.target.checked ? 'true' : '');
                }}
            />
            {isOpen && <CheckCircle className="w-3.5 h-3.5" />}
            Open Now
         </label>

         <select 
            className="px-3 py-1.5 rounded-full text-sm bg-gray-100 border-none text-gray-600 focus:ring-0 cursor-pointer hover:bg-gray-200"
            value={minRating}
            onChange={(e) => {
                setMinRating(e.target.value);
                handleFilterChange('minRating', e.target.value);
            }}
         >
             <option value="">Any Rating</option>
             <option value="4.5">4.5+ Stars</option>
             <option value="4">4.0+ Stars</option>
             <option value="3.5">3.5+ Stars</option>
             <option value="3">3.0+ Stars</option>
         </select>

         {(search || category !== 'All' || isOpen || minRating || sort !== 'newest') && (
             <button
                onClick={() => {
                    setSearch('');
                    setCategory('All');
                    setSort('newest');
                    setIsOpen(false);
                    setMinRating('');
                    router.push('/');
                }} 
                className="ml-auto text-sm text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
             >
                <RotateCcw className="w-3.5 h-3.5" /> Reset All
             </button>
         )}
      </div>
    </div>
  );
}
