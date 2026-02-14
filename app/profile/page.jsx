'use client';

import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (!user) return <div className="p-8 text-center text-red-500">Please log in to view your profile.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="bg-black px-6 py-8 text-center">
            <div className="h-24 w-24 bg-white text-black text-4xl font-bold rounded-full flex items-center justify-center mx-auto shadow-lg mb-4">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
         </div>

         <div className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Details</h2>
            
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="text-gray-400 w-5 h-5" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Full Name</p>
                        <p className="text-gray-900 font-medium">{user.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="text-gray-400 w-5 h-5" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Email Address</p>
                        <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="text-gray-400 w-5 h-5" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Role</p>
                        <p className="text-gray-900 font-medium capitalize flex items-center gap-2">
                           {user.role} 
                           {user.role === 'admin' && <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wide">Admin Access</span>}
                        </p>
                    </div>
                </div>
                
                {/* Could add join date if we had it in token/context easily, else skip */}
            </div>
         </div>
         
         <div className="bg-gray-50 p-6 text-center text-xs text-gray-500 border-t border-gray-100">
            Account ID: <span className="font-mono">{user.id || user._id}</span>
         </div>
      </div>
    </div>
  );
}
