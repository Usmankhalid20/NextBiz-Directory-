import { MapPin, Phone, Globe, CheckCircle, XCircle } from 'lucide-react';

export default function BusinessCard({ business }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{business.businessName}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${business.isOpenNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {business.isOpenNow ? 'Open' : 'Closed'}
          </span>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>{business.address}</span>
          </div>
          
          {business.phone && (
             <div className="flex items-center gap-3">
               <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
               <a href={`tel:${business.phone}`} className="hover:text-green-600 transition-colors">{business.phone}</a>
             </div>
          )}



          <div className="pt-2 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 border border-gray-200">
              {business.category}
            </span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
             {business.website ? (
               <a 
                 href={business.website} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
               >
                 <Globe className="w-4 h-4" /> Visit Website
               </a>
             ) : (
                <span className="text-gray-400 text-sm flex items-center gap-1">
                   <Globe className="w-4 h-4" /> No Website
                </span>
             )}
        </div>
      </div>
    </div>
  );
}
