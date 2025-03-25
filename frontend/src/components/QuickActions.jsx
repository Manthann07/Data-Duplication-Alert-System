import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from './ui/use-toast';
import { API_ENDPOINTS } from '../config/api';

const QuickActions = ({ stats }) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Simulate successful upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      navigate('/app/data-management');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file. Please try again.",
      });
    }
  };

  const handleExport = async () => {
    try {
      // Simulate download
      const dummyData = 'Sample,Data\n1,Test\n2,Example';
      const blob = new Blob([dummyData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export data. Please try again.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Upload Data */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload Data</h3>
          <p className="text-sm text-gray-600">Import CSV or Excel</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Export Report */}
      <div
        onClick={handleExport}
        className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Export Report</h3>
          <p className="text-sm text-gray-600">Download as Excel</p>
        </div>
      </div>

      {/* Review Duplicates */}
      <Link
        to="/app/duplicates"
        className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Review Duplicates</h3>
          <p className="text-sm text-gray-600">
            {stats?.duplicateRecords || 0} duplicates found
          </p>
        </div>
      </Link>

      {/* Manage Data */}
      <Link
        to="/app/data-management"
        className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Manage Data</h3>
          <p className="text-sm text-gray-600">View and edit records</p>
        </div>
      </Link>
    </div>
  );
};

export default QuickActions; 