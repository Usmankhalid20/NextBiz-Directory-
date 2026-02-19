import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Globe, Star, Clock, ArrowLeft, Calendar, Share2 } from 'lucide-react';
import Link from 'next/link';
import { IBusiness } from '@/types';

export const dynamic = 'force-dynamic';

interface BusinessDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BusinessDetailsPage({ params }: BusinessDetailsPageProps) {
  const { id } = await params;

  await connectToDatabase();
  
  console.log('Fetching business with ID:', id);
  let businessDoc;
  try {
      businessDoc = await Business.findById(id).lean();
      console.log('Business found:', businessDoc ? 'Yes' : 'No');
  } catch (e) {
      console.error('Error fetching business:', e);
      // If ID is invalid mongo ID
      notFound();
  }

  if (!businessDoc) {
    notFound();
  }

  // Cast to IBusiness (and ensure _id is string)
  // We need to manually handle the _id to string conversion for TS contentment if we use IBusiness strict
  const business = JSON.parse(JSON.stringify(businessDoc)) as IBusiness;

  const rating = business.rating || 0;
  const reviewCount = business.reviewCount || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header / Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                            {business.category}
                        </span>
                        {business.isOpenNow ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                Open Now
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                                Closed
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{business.businessName}</h1>
                    <div className="flex items-center gap-2 mb-4">
                         <div className="flex items-center text-yellow-400">
                            <Star className={`w-5 h-5 ${rating >= 1 ? 'fill-current' : 'text-gray-300'}`} />
                            <span className="ml-1 text-lg font-bold text-gray-900">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
                         </div>
                         <span className="text-gray-500">• {reviewCount} reviews</span>
                    </div>
                </div>
                
                <div className="flex gap-3">
                     {business.website && (
                        <a 
                            href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Globe className="w-4 h-4 mr-2" />
                            Visit Website
                        </a>
                     )}
                     <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                     </button>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {business.description || "No description available for this business."}
                    </p>
                </section>
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Contact & Location</h3>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Address</p>
                                <p className="text-sm text-gray-600">{business.address}</p>
                                <p className="text-sm text-gray-600">{business.city}, {business.state} {business.zip}</p>
                            </div>
                        </div>

                        {business.phone && (
                            <div className="flex items-start">
                                <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Phone</p>
                                    <a href={`tel:${business.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                                        {business.phone}
                                    </a>
                                </div>
                            </div>
                        )}

                        {business.website && (
                             <div className="flex items-start">
                                <Globe className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Website</p>
                                    <a 
                                        href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800 break-all"
                                    >
                                        {business.website}
                                    </a>
                                </div>
                             </div>
                        )}
                        
                        <div className="flex items-start">
                            <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Status</p>
                                <p className={`text-sm ${business.isOpenNow ? 'text-green-600' : 'text-red-600'}`}>
                                    {business.isOpenNow ? 'Open Now' : 'Closed'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Listed</p>
                                <p className="text-sm text-gray-600">
                                    {business.createdAt ? new Date(business.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
