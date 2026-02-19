'use client';

import { ArrowRight, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { IBusiness } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface BusinessTableProps {
  businesses: IBusiness[];
}

export default function BusinessTable({ businesses }: BusinessTableProps) {
    const { user } = useAuth();
    const [selectedBusiness, setSelectedBusiness] = useState<IBusiness | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isAdmin = user?.role === 'admin';

    const handleDeleteClick = (business: IBusiness) => {
        setSelectedBusiness(business);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedBusiness) return;
        setIsDeleting(true);
        const isSoftDelete = !isAdmin;

        try {
            const url = isSoftDelete 
                ? `/api/businesses/${selectedBusiness._id}/soft-delete`
                : `/api/businesses/${selectedBusiness._id}?hard_delete=true`;
            
            const method = isSoftDelete ? 'PATCH' : 'DELETE';

            const res = await fetch(url, { method });
            const data = await res.json();
            
            if (res.ok) {
                toast.success(data.message || 'Business deleted successfully');
                setTimeout(() => {
                    window.location.reload(); 
                }, 1000);
            } else {
                toast.error(data.message || 'Failed to delete');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setIsDeleting(false);
            setSelectedBusiness(null);
        }
    };

    return (
    <>
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {businesses.length === 0 ? (
               <tr>
                   <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                       No businesses found matching your criteria.
                   </td>
               </tr>
            ) : (
                businesses.map((business) => (
                    <tr key={business._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">{business.businessName}</div>
                            <div className="text-sm text-gray-500">{business.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{business.phone || 'N/A'}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{business.city}, {business.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">{business.rating > 0 ? business.rating.toFixed(1) : '-'}</span>
                            <span className="text-xs text-gray-500 ml-1">({business.reviewCount})</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          business.isOpenNow
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {business.isOpenNow ? 'Open' : 'Closed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <div className="flex items-center justify-end gap-2">
                             {user && (
                                <button
                                    onClick={() => handleDeleteClick(business)}
                                    className="text-gray-400 hover:text-red-600 transition-colors bg-gray-50 p-1.5 rounded-full hover:bg-gray-100"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                             )}
                             <Link href={`/business/${business._id}`} className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1 ml-2">
                                Details <ArrowRight className="w-3 h-3" />
                             </Link>
                         </div>
                      </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={isAdmin ? "Delete Business Permanently?" : "Remove Business?"}
        message={isAdmin 
            ? `Are you sure you want to PERMANENTLY delete "${selectedBusiness?.businessName}"? This action cannot be undone.`
            : `Remove "${selectedBusiness?.businessName}" from your list? You can restore it later if needed.`}
        confirmText={isAdmin ? "Delete Forever" : "Remove"}
        isDestructive={true}
      />
    </>
  );
}
