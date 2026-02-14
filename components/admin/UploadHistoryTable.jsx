'use client';

export default function UploadHistoryTable({ logs }) {
  if (!logs || logs.length === 0) {
    return <div className="text-center py-4 text-gray-500">No upload history found.</div>;
  }

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mt-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Upload History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">File Name</th>
              <th className="px-6 py-3">Uploaded By</th>
              <th className="px-6 py-3">Records</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{log.fileName}</td>
                <td className="px-6 py-4">
                  {log.uploadedBy ? log.uploadedBy.name : 'Unknown'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-green-600">{log.recordsInserted} Inserted</span>
                    {log.recordsFailed > 0 && <span className="text-red-500">{log.recordsFailed} Failed</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    log.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                    log.status === 'FAILED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {log.status}
                  </span>
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
