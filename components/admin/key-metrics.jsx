import { Users, UserCheck, Trash2, Building2, UserPlus, FileText } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

export default function KeyMetrics({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Users" 
        value={stats.totalUsers} 
        icon={Users} 
        color="bg-blue-500" 
      />
      <StatCard 
        title="Users With Access" 
        value={stats.usersWithAccess} 
        icon={UserCheck} 
        color="bg-green-500" 
      />
      <StatCard 
        title="Soft Deleted Businesses" 
        value={stats.softDeletedBusinesses} 
        icon={Trash2} 
        color="bg-red-500"
      />
      <StatCard 
        title="Active Businesses Today" 
        value={stats.businessesAddedToday} 
        icon={Building2} 
        color="bg-purple-500"
        subtext={`Deleted today: ${stats.businessesDeletedToday}`}
      />
    </div>
  );
}
