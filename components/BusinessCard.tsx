'use client';

import { MapPin, Phone, Globe, Star, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { IBusiness } from '@/types';

interface BusinessCardProps {
  business: IBusiness;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const rating = business.rating || 0;
  const reviewCount = business.reviewCount || 0;
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const isSoftDelete = user?.role !== 'admin';

    try {
        const url = isSoftDelete 
            ? `/api/businesses/${business._id}/soft-delete`
            : `/api/businesses/${business._id}?hard_delete=true`;
        
        const method = isSoftDelete ? 'PATCH' : 'DELETE';

        const res = await fetch(url, { method });
        const data = await res.json();
        
        if (res.ok) {
            toast.success(data.message || 'Business deleted successfully');
            // Slight delay to allow toast to show before reload
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
    }
  };

  if (!business) return null; // Safety check

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group relative">
        {user && (
            <button 
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-colors ${
                  isAdmin
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' // Admin: Hard Delete
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200' // User: Soft Delete
              }`}
              title={isAdmin ? "Permanently Delete" : "Remove from list"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
        )}
        <div className="p-5 flex-grow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors pr-8">
                {business.businessName}
              </h3>
              <p className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded-full inline-block mt-1">
                {business.category}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              business.isOpenNow 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {business.isOpenNow ? 'Open' : 'Closed'}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <Star className={`w-4 h-4 ${rating >= 1 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            <span className="text-sm font-bold text-gray-900">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
            <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{business.address}, {business.city}, {business.state}</span>
            </div>
            
            {business.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href={`tel:${business.phone}`} className="hover:text-blue-600 transition-colors">{business.phone}</a>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          {business.website ? (
            <a 
              href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4" /> Website
            </a>
          ) : (
              <span className="text-gray-400 text-sm flex items-center gap-1.5 opacity-50 cursor-not-allowed">
                <Globe className="w-4 h-4" /> Website
              </span>
          )}

          <Link 
              href={`/business/${business._id}`}
              className="bg-gray-900 hover:bg-black text-white text-sm py-2 px-4 rounded-lg font-medium transition-colors flex items-center gap-1"
          >
              Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={isAdmin ? "Delete Business Permanently?" : "Remove Business?"}
        message={isAdmin 
            ? "Are you sure you want to PERMANENTLY delete this business? This action cannot be undone."
            : "Remove this business from your list? You can restore it later if needed."}
        confirmText={isAdmin ? "Delete Forever" : "Remove"}
        isDestructive={true}
      />
    </>
  );
}
