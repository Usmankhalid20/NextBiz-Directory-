'use client';

import { useState, useEffect } from 'react';
import { Upload, LayoutGrid, List, RefreshCw, FileText } from 'lucide-react';
import BusinessCard from '@/components/BusinessCard';
import BusinessTable from '@/components/BusinessTable';

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/businesses');
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage('Uploading & Processing...');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setUploadMessage(`Success! ${data.count} businesses processed.`);
        fetchBusinesses(); // Refresh list
        setTimeout(() => setUploadMessage(''), 3000);
      } else {
        setUploadMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setUploadMessage('Upload failed. Please try again.');
      console.error(error);
    } finally {
      setUploading(false);
       // Reset input
       e.target.value = null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Business Directory</h1>
                    <p className="mt-2 text-blue-100 text-lg">Manage and explore local business listings with ease.</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer group">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-white/20">
                            <Upload className={`w-6 h-6 ${uploading ? 'animate-bounce' : ''}`} />
                            <span className="font-medium text-sm">
                                {uploading ? 'Uploading...' : 'Upload CSV File'}
                            </span>
                        </div>
                        <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                    {uploadMessage && <p className="mt-2 text-xs text-center font-medium bg-black/20 py-1 px-2 rounded">{uploadMessage}</p>}
                </div>
            </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
             <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">{businesses.length} Listings found</span>
             </div>

             <div className="flex items-center bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${viewMode === 'card' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <LayoutGrid className="w-4 h-4" /> Cards
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${viewMode === 'table' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <List className="w-4 h-4" /> Table
                </button>
             </div>
        </div>

        {loading ? (
           <div className="flex justify-center items-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
        ) : businesses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No businesses found</h3>
                <p className="text-gray-500 mt-1">Upload a CSV file to get started.</p>
            </div>
        ) : (
            <div className="animate-in fade-in duration-500">
                {viewMode === 'card' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businesses.map((business) => (
                            <BusinessCard key={business.placeId} business={business} />
                        ))}
                    </div>
                ) : (
                    <BusinessTable businesses={businesses} />
                )}
            </div>
        )}
      </main>
    </div>
  );
}
