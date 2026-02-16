'use client';

// Basic interface for logs
interface ActivityLog {
    _id: string;
    action: string;
    details: string;
    performedBy?: {
        name: string;
        email: string;
    };
    createdAt: string;
}

interface ActivityLogTableProps {
    logs: ActivityLog[];
}

export default function ActivityLogTable({ logs }: ActivityLogTableProps) {
  if (!logs || logs.length === 0) {
    return <div className="text-center py-10 text-gray-500">No activity logs found.</div>;
  }

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Details</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <span className="inline-block px-2 py-1 rounded bg-gray-100 text-xs">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4">{log.details}</td>
                <td className="px-6 py-4">
                  {log.performedBy ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{log.performedBy.name}</span>
                      <span className="text-xs text-gray-400">{log.performedBy.email}</span>
                    </div>
                  ) : <span className="text-gray-400">Unknown</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
