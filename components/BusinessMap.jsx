'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Star } from 'lucide-react';
import Link from 'next/link';

// Fix for default marker icon in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function BusinessMap({ businesses }) {
  // Default center (can be adjusted or dynamic)
  const defaultCenter = [40.7128, -74.0060]; // New York
  const center = businesses.length > 0 && businesses[0].location?.coordinates 
    ? [businesses[0].location.coordinates[1], businesses[0].location.coordinates[0]] 
    : defaultCenter;

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0 relative">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {businesses.map((business) => {
             if (business.location && business.location.coordinates && business.location.coordinates.length === 2 && business.location.coordinates[0] !== 0) {
                 const [lng, lat] = business.location.coordinates;
                 return (
                    <Marker key={business._id} position={[lat, lng]}>
                      <Popup className="custom-popup">
                        <div className="min-w-[200px]">
                            <h3 className="font-bold text-base mb-1">{business.businessName}</h3>
                            <p className="text-xs text-gray-500 mb-2">{business.address}</p>
                            <div className="flex items-center gap-1 mb-2">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold">{business.rating || 0}</span>
                                <span className="text-[10px] text-gray-400">({business.reviewCount} reviews)</span>
                            </div>
                            <Link href={`/business/${business._id}`} className="block text-center bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700 transition">
                                View Details
                            </Link>
                        </div>
                      </Popup>
                    </Marker>
                 );
             }
             return null;
        })}
      </MapContainer>
    </div>
  );
}
