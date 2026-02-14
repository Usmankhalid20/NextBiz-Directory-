import { Suspense } from 'react';
import UserTable from '@/components/admin/UserTable';
import { cookies } from 'next/headers'; 

async function getUsers() {
   const cookieStore = await cookies();
   
   const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/users`, {
       headers: { Cookie: cookieStore.toString() },
       cache: 'no-store'
   });
   
   if (!res.ok) throw new Error('Failed to fetch users');
   const json = await res.json();
   return json.data;
}

// Better approach: Direct DB call since we are on server
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function getUsersDirectOptions() {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password').lean(); // lean for plain objects
    // Convert _id and dates to string if needed or pass as is (Next.js 15+ handles objects better, but 16 is fine too)
    // We need to serialize _id and dates.
    return JSON.parse(JSON.stringify(users));
}


export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await getUsersDirectOptions();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500">Manage system users and access controls.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
          Total Users: {users.length}
        </div>
      </div>

      <Suspense fallback={<div>Loading users...</div>}>
         <UserTable users={users} />
      </Suspense>
    </div>
  );
}
