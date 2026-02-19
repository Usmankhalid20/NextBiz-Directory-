'use client';

import { useState } from 'react';
import { Trash2, Shield, ShieldOff, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    hasDataAccess: boolean;
    createdAt: string;
}

interface UserTableProps {
    users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleUpdate = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    // Ideally use ConfirmModal here, but for now simple confirm to speed up
    if (!confirm(`Are you sure you want to change role to ${newRole}?`)) return;

    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (res.ok) {
        toast.success('Role updated successfully');
        router.refresh();
      } else {
        toast.error('Failed to update role');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleAccessUpdate = async (userId: string, currentAccess: boolean) => {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasDataAccess: !currentAccess }),
      });

      if (res.ok) {
        toast.success(currentAccess ? 'Access revoked' : 'Access granted');
        router.refresh();
      } else {
        toast.error('Failed to update access');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('User deleted');
        router.refresh();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Data Access</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleAccessUpdate(user._id, user.hasDataAccess)}
                    disabled={loading === user._id}
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors ${
                      user.hasDataAccess 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {user.hasDataAccess ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {user.hasDataAccess ? 'Granted' : 'Revoked'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleRoleUpdate(user._id, user.role)}
                    disabled={loading === user._id}
                    className="text-gray-400 hover:text-purple-600 transition-colors"
                    title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                  >
                    {user.role === 'admin' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={loading === user._id}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
