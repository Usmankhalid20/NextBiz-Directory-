'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="h-8 w-8 bg-black rounded-lg group-hover:bg-blue-600 transition-colors"></div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900">NextBiz</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                   <ProfileDropdown />
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
