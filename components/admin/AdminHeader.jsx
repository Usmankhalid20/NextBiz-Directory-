'use client';

import { useAuth } from '@/context/AuthContext';
import { Bell, Search } from 'lucide-react';
import ProfileDropdown from '../ProfileDropdown';

export default function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
      {/* Search Bar (Placeholder) - Hidden on very small screens or adaptable */}
      <div className="relative w-full max-w-xs hidden sm:block md:max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="w-4 h-4 text-gray-400" />
        </span>
        <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      {/* Mobile Search Icon (optional, for now just hiding bar on XS) */}
      <button className="sm:hidden p-2 text-gray-400">
        <Search className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="pl-6 border-l border-gray-200">
           <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
