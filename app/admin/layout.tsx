import Sidebar from '@/components/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-8">
            {children}
          </main>
      </div>
    </div>
  );
}
