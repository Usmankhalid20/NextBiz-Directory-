'use client';

import { useState } from 'react';
import { Upload as UploadIcon, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [stats, setStats] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
      setStats(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setStats(data.stats);
        setFile(null);
        e.target.reset(); 
        router.refresh(); // Refresh to show new history
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-50 rounded-lg">
                    <UploadIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Upload Business Records</h2>
                    <p className="text-gray-500 mt-1">
                        Supported formats: CSV, JSON. Max file size: 5MB.
                    </p>
                </div>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/30 text-center">
                    <input
                        type="file"
                        accept=".csv,.json"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                    <label 
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                        <FileText className="w-12 h-12 text-gray-400" />
                        <span className="text-lg font-medium text-gray-700">
                            {file ? file.name : 'Click to browse or drag file here'}
                        </span>
                        <span className="text-sm text-gray-400">
                            {file ? `${(file.size / 1024).toFixed(2)} KB` : 'CSV or JSON files only'}
                        </span>
                    </label>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!file || loading}
                        className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${
                            !file || loading
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                    >
                        {loading ? 'Uploading & Processing...' : 'Upload Data'}
                    </button>
                </div>
            </form>

            {message && (
                <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                    message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-medium">{message.text}</p>
                </div>
            )}
            
            {stats && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500 mb-1">Total Processed</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.processed}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-green-600 mb-1">Successfully Added</p>
                            <p className="text-2xl font-bold text-green-700">{stats.added}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-red-600 mb-1">Failed / Skipped</p>
                            <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
