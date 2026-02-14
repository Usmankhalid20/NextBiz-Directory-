import { MapPin, Phone, Star, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function BusinessTable({ businesses }) {
  const { user } = useAuth();
  const [actionId, setActionId] = useState(null);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to PERMANENTLY delete this business?')) return;

    setActionId(id);
    try {
        const res = await fetch(`/api/businesses/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (data.success) {
            window.location.reload(); 
        } else {
            alert(data.message);
        }
    } catch {
        alert('Failed to delete');
    } finally {
        setActionId(null);
    }
  };

  const handleRestore = async (id, e) => {
    e.preventDefault();
    setActionId(id);
    try {
        const res = await fetch(`/api/businesses/${id}/restore`, {
            method: 'PATCH',
        });
        const data = await res.json();
        if (data.success) {
            window.location.reload(); 
        } else {
            alert(data.message);
        }
    } catch {
        alert('Failed to restore');
    } finally {
        setActionId(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {businesses.map((business) => (
            <tr key={business._id} className={`hover:bg-gray-50 transition-colors group ${business.isDeleted ? 'bg-red-50 hover:bg-red-100' : ''}`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {business.businessName}
                        {business.isDeleted && <span className="ml-2 text-xs text-red-600 font-bold">(Deleted)</span>}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                         <Phone className="w-3 h-3" /> {business.phone || 'N/A'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-0.5 inline-flex text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                  {business.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm font-medium text-gray-900">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                    {business.rating ? business.rating.toFixed(1) : 'New'}
                    <span className="text-gray-400 text-xs ml-1">({business.reviewCount})</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={business.address}>
                <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {business.address}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                 <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${business.isOpenNow ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {business.isOpenNow ? 'Open' : 'Closed'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-2">
                 {user?.role === 'admin' && (
                      <>
                        {business.isDeleted && (
                            <button
                                onClick={(e) => handleRestore(business._id, e)}
                                disabled={actionId === business._id}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 mr-2"
                                title="Restore"
                            >
                                Restore
                            </button>
                        )}
                        <button
                            onClick={(e) => handleDelete(business._id, e)}
                            disabled={actionId === business._id}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Permanently Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                 )}
                 <Link href={`/admin/businesses/${business._id}`} className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1 ml-2">
                    Details <ArrowRight className="w-3 h-3" />
                 </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
