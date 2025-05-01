import React, { useState, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';
import { datasetService } from '../services/datasetService';
import { formatFileSize, formatDate } from '../utils/formatters';

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
    const fetchDatasets = async () => {
      try {
        setIsLoading(true);
        const response = await datasetService.getDatasets();
        if (response.success) {
          setDatasets(response.files);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch datasets"
          });
        }
      } catch (error) {
        console.error('Error fetching datasets:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch datasets"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  // Filter datasets based on search query and filters
  const filteredDatasets = datasets.filter(dataset => {
    // Search query filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (dataset.name?.toLowerCase() || '').includes(searchLower) ||
      (dataset.description?.toLowerCase() || '').includes(searchLower);

    // Department filter
    const matchesDepartment = !filters.department || dataset.department === filters.department;

    // File type filter
    const matchesFileType = !filters.fileType || dataset.fileType === filters.fileType;

    // Date range filter
    let matchesDateRange = true;
    if (filters.dateRange !== 'all') {
      const uploadDate = new Date(dataset.uploadedAt);
      const now = new Date();
      const daysDiff = (now - uploadDate) / (1000 * 60 * 60 * 24);

      switch (filters.dateRange) {
        case 'today':
          matchesDateRange = daysDiff < 1;
          break;
        case 'week':
          matchesDateRange = daysDiff < 7;
          break;
        case 'month':
          matchesDateRange = daysDiff < 30;
          break;
        default:
          matchesDateRange = true;
      }
    }

    // Size filter
    let matchesSize = true;
    if (filters.size !== 'all') {
      const fileSizeMB = dataset.size / (1024 * 1024);
      switch (filters.size) {
        case 'small':
          matchesSize = fileSizeMB < 1;
          break;
        case 'medium':
          matchesSize = fileSizeMB >= 1 && fileSizeMB < 10;
          break;
        case 'large':
          matchesSize = fileSizeMB >= 10;
          break;
        default:
          matchesSize = true;
      }
    }

    return matchesSearch && matchesDepartment && matchesFileType && matchesDateRange && matchesSize;
  });

  const handleDownload = async (id) => {
    try {
      await datasetService.downloadDataset(id);
      toast({
        title: "Success",
        description: "File download started"
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to download file"
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await datasetService.deleteDataset(id);
      setDatasets(datasets.filter(d => d._id !== id));
      toast({
        title: "Success",
        description: "File deleted successfully"
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete file"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Data Repository</h1>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded"
          />
          
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">All Departments</option>
            <option value="finance">Finance</option>
            <option value="hr">HR</option>
            <option value="sales">Sales</option>
            <option value="marketing">Marketing</option>
          </select>
          
          <select
            value={filters.fileType}
            onChange={(e) => setFilters({ ...filters, fileType: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">All File Types</option>
            <option value="csv">CSV</option>
            <option value="xlsx">Excel</option>
            <option value="json">JSON</option>
          </select>
          
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          
          <select
            value={filters.size}
            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="all">All Sizes</option>
            <option value="small">&lt; 1MB</option>
            <option value="medium">1MB - 10MB</option>
            <option value="large">&gt; 10MB</option>
          </select>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map(dataset => (
          <div key={dataset._id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{dataset.name}</h3>
            <p className="text-gray-600 mb-4">{dataset.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="font-semibold">Department:</span>
                <p className="text-gray-600">{dataset.department}</p>
              </div>
              <div>
                <span className="font-semibold">File Type:</span>
                <p className="text-gray-600">{dataset.fileType}</p>
              </div>
              <div>
                <span className="font-semibold">Size:</span>
                <p className="text-gray-600">{formatFileSize(dataset.size)}</p>
              </div>
              <div>
                <span className="font-semibold">Uploaded:</span>
                <p className="text-gray-600">{formatDate(dataset.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleDownload(dataset._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(dataset._id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No datasets found</p>
        </div>
      )}
    </div>
  );
};

export default DataRepository;