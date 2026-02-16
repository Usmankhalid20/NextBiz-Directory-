'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none hover:bg-gray-100 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
      >
        <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center font-bold shadow-sm">
            {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{user.role}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
           <div className="px-4 py-3 border-b border-gray-100">
             <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
             <p className="text-xs text-gray-500 truncate">{user.email}</p>
           </div>
           
           <div className="py-1">
             <Link 
                href="/profile" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                onClick={() => setIsOpen(false)}
             >
                <UserIcon className="w-4 h-4" /> Profile Settings
             </Link>
             
             {user.role === 'admin' && (
                <Link 
                    href="/admin/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                    <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                </Link>
             )}
           </div>

           <div className="border-t border-gray-100 py-1">
             <button 
                onClick={() => {
                    setIsOpen(false);
                    logout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
             >
                <LogOut className="w-4 h-4" /> Sign out
             </button>
           </div>
        </div>
      )}
    </div>
  );
}
