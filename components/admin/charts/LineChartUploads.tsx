'use client';

// @ts-ignore
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartUploadsProps {
  data: any[];
}

export default function LineChartUploads({ data }: LineChartUploadsProps) {
  if (!data || data.length === 0) return <p className="text-gray-500 text-center py-10">No data available</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Uploads Over Time (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="_id" tick={{fontSize: 12}} />
          <YAxis />
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} name="Uploads" />
          <Line type="monotone" dataKey="records" stroke="#82ca9d" strokeWidth={2} name="Records Processed" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
