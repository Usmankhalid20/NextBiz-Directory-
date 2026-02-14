import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { MapPin, Phone, Globe, Star, Clock, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import BusinessMapWrapper from '@/components/BusinessMapWrapper';

async function getBusiness(id: string) {
  try {
    await connectToDatabase();
    const business = await Business.findById(id).lean();
    if (!business) return null;
    return {
        ...business,
        _id: business._id.toString(),
        createdAt: business.createdAt.toISOString(),
        updatedAt: business.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BusinessPage({ params }: Props) {
  // Await params in Next.js 15+
  const { id } = await params;
  const business = await getBusiness(id);

  if (!business) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Business Not Found</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Directory
            </Link>
        </div>
    );
  }

  const rating = business.rating || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Link>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-800 w-full relative">
                 <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="px-8 pb-8">
                <div className="relative -mt-12 mb-4 flex justify-between items-end">
                    <div className="bg-white p-1 rounded-2xl shadow-lg">
                        <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-3xl font-bold text-gray-400 border border-gray-200">
                           {business.businessName.charAt(0)}
                        </div>
                    </div>
                     <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${business.isOpenNow ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                        {business.isOpenNow ? 'Open Now' : 'Closed'}
                     </span>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{business.businessName}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="px-3 py-1 bg-gray-100 rounded-full font-medium text-gray-700">{business.category}</span>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                                <span className="text-gray-500">({business.reviewCount} reviews)</span>
                            </div>
                        </div>
                         {business.description && (
                            <p className="text-gray-600 max-w-2xl leading-relaxed">{business.description}</p>
                         )}
                    </div>
    
                    <div className="flex flex-col gap-3 min-w-[200px]">
                        {business.phone && (
                            <a href={`tel:${business.phone}`} className="flex items-center justify-center gap-2 w-full bg-black text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition font-medium">
                                <Phone className="w-4 h-4" /> Call Now
                            </a>
                        )}
                        {business.website && (
                            <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition font-medium">
                                <Globe className="w-4 h-4" /> Visit Website
                            </a>
                        )}
                        <button className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition font-medium">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">
                 {/* Images (Placeholder if logic exists later) */}
                 
                 {/* Map Section */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                     <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> Location
                     </h2>
                     <div className="mb-4 text-gray-600">
                        <p className="font-medium text-gray-900">{business.address}</p>
                        <p>{business.city}, {business.state} {business.zip}</p>
                     </div>
                     <div className="h-64 rounded-xl overflow-hidden border border-gray-200 relative z-0">
                         {/* Pass single business to map in an array */}
                         <BusinessMapWrapper businesses={[business]} />
                     </div>
                 </div>
            </div>

            {/* Right Column: Other Info */}
            <div className="space-y-8">
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Address</p>
                                <p className="text-sm text-gray-600">{business.address}</p>
                            </div>
                        </div>
                        {business.phone && (
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Phone</p>
                                    <p className="text-sm text-gray-600">{business.phone}</p>
                                </div>
                            </div>
                        )}
                        {/* Email Removed as per request */}
                         {business.website && (
                            <div className="flex items-start gap-3">
                                <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Website</p>
                                    <a href={business.website} target="_blank" className="text-sm text-blue-600 hover:underline truncate block max-w-[200px]">{business.website}</a>
                                </div>
                            </div>
                        )}
                    </div>
                 </div>

                 {/* Hours (Placeholder) */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Opening Hours
                    </h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Monday - Friday</span>
                            <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Saturday</span>
                            <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Sunday</span>
                            <span className="text-red-500 font-medium">Closed</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
