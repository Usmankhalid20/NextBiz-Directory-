import { MapPin, Phone, Globe, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BusinessCard({ business }) {
  const rating = business.rating || 0;
  const reviewCount = business.reviewCount || 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
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
             href={business.website} 
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
  );
}
