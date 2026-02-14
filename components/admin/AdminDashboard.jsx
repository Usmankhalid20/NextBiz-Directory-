'use client';

import KeyMetrics from '@/components/admin/key-metrics';
import BarChartCategory from '@/components/admin/charts/BarChartCategory';
import PieChartRatings from '@/components/admin/charts/PieChartRatings';
import LineChartUploads from '@/components/admin/charts/LineChartUploads';
import DoughnutChartStatus from '@/components/admin/charts/DoughnutChartStatus';

export default function AdminDashboard({ data }) {
  const { stats, charts } = data;

  return (
    <div className="p-6 max-w-7xl mx-auto">
       <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to the admin control panel.</p>
      </div>

      <KeyMetrics stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BarChartCategory data={charts.businessesByCategory} />
        <DoughnutChartStatus data={charts.businessStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartRatings data={charts.ratingDistribution} />
        <LineChartUploads data={charts.uploadsOverTime} />
      </div>
    </div>
  );
}
