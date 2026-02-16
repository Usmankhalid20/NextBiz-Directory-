import { Suspense } from 'react';
import UserTable from '@/components/admin/UserTable';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { IUser } from '@/types';

async function getUsersDirectOptions(): Promise<IUser[]> {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password').lean();
    // Normalize _id to string etc.
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
         {/* @ts-ignore - UserTable expects users with specific shape */}
         <UserTable users={users} />
      </Suspense>
    </div>
  );
}
