import React, { useState, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';

const DataRepository = () => {
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    fileType: '',
    dateRange: 'all',
    size: 'all'
  });

  // Fetch datasets from backend
  useEffect(() => {
    // Mock data for immediate testing
    const mockData = [
      {
        id: 1,
        name: 'Employee Records 2024',
        description: 'Annual employee data compilation',
        department: 'research',
        fileType: 'xlsx',
        size: 1024 * 1024 * 2.5, // 2.5MB
        uploadedAt: '2024-03-01',
        previewUrl: '#'
      },
      {
        id: 2,
        name: 'Customer Database',
        description: 'Complete customer information',
        department: 'administrative',
        fileType: 'csv',
        size: 1024 * 1024 * 1.8, // 1.8MB
        uploadedAt: '2024-03-10',
        previewUrl: '#'
      },
      {
        id: 3,
        name: 'Research Findings Q1',
        description: 'Quarterly research results',
        department: 'research',
        fileType: 'pdf',
        size: 1024 * 1024 * 3.2, // 3.2MB
        uploadedAt: '2024-03-15',
        previewUrl: '#'
      }
    ];
    setDatasets(mockData);
    setIsLoading(false);
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async (datasetId) => {
    try {
      // First check for duplicates
      const checkResponse = await fetch(`http://localhost:5000/api/datasets/${datasetId}/check-duplicate`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const checkResult = await checkResponse.json();
      
      if (checkResult.isDuplicate) {
        // Show duplicate alert with existing location
        toast({
          title: "Duplicate Alert",
          description: `This dataset already exists at: ${checkResult.location}`,
          action: (
            <button 
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => window.open(checkResult.location)}
            >
              Open Location
            </button>
          ),
          duration: 5000,
        });
        return;
      }

      // Proceed with download if not duplicate
      const downloadResponse = await fetch(`http://localhost:5000/api/datasets/${datasetId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Handle file download
      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = checkResult.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process download",
        duration: 3000,
      });
    }
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = !filters.department || dataset.department === filters.department;
    const matchesFileType = !filters.fileType || dataset.fileType === filters.fileType;
    
    // Date range filtering
    let matchesDate = true;
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const datasetDate = new Date(dataset.uploadedAt);
      const daysDiff = (now - datasetDate) / (1000 * 60 * 60 * 24);
      
      matchesDate = filters.dateRange === 'week' ? daysDiff <= 7 :
                    filters.dateRange === 'month' ? daysDiff <= 30 :
                    filters.dateRange === 'year' ? daysDiff <= 365 : true;
    }

    return matchesSearch && matchesDepartment && matchesFileType && matchesDate;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Data Repository</h1>
        <p className="mt-2 text-gray-600">Browse and download datasets while avoiding duplicates</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select
          value={filters.department}
          onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Departments</option>
          <option value="research">Research</option>
          <option value="academic">Academic</option>
          <option value="administrative">Administrative</option>
        </select>

        <select
          value={filters.fileType}
          onChange={(e) => setFilters(prev => ({ ...prev, fileType: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All File Types</option>
          <option value="pdf">PDF</option>
          <option value="csv">CSV</option>
          <option value="xlsx">Excel</option>
          <option value="doc">Word</option>
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Time</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Dataset Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDatasets.map(dataset => (
            <div key={dataset.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      dataset.fileType === 'pdf' ? 'bg-red-100 text-red-600' :
                      dataset.fileType === 'csv' ? 'bg-green-100 text-green-600' :
                      dataset.fileType === 'xlsx' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {dataset.fileType.toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{dataset.name}</h3>
                      <p className="text-sm text-gray-500">{dataset.department}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{dataset.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{formatFileSize(dataset.size)}</span>
                  <span>{new Date(dataset.uploadedAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleDownload(dataset.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Download
                  </button>
                  
                  <button
                    onClick={() => window.open(dataset.previewUrl)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredDatasets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No datasets found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DataRepository; 