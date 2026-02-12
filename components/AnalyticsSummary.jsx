'use client';
import { Building2, CheckCircle, Star, Grid } from 'lucide-react';

export default function AnalyticsSummary({ total, openNow, avgRating, totalReviews }) {
  const stats = [
    { label: 'Total Businesses', value: total, icon: Building2, color: 'bg-blue-100 text-blue-600' },
    { label: 'Open Now', value: openNow, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { label: 'Avg Rating', value: avgRating.toFixed(1), icon: Star, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Total Reviews', value: totalReviews, icon: Grid, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className={`p-3 rounded-lg ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
