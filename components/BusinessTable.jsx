import { MapPin, Phone, ExternalLink } from 'lucide-react';

export default function BusinessTable({ businesses }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>

            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {businesses.map((business) => (
            <tr key={business.placeId} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{business.businessName}</div>
                    <div className="text-sm text-gray-500">{business.phone || 'N/A'}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {business.category}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={business.address}>
                {business.address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${business.isOpenNow ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {business.isOpenNow ? 'Open' : 'Closed'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {business.website ? (
                   <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 inline-flex items-center">
                     Visit <ExternalLink className="w-3 h-3 ml-1" />
                   </a>
                ) : (
                    <span className="text-gray-400">No Link</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
