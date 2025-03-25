import React, { useState, useEffect } from 'react';
import { 
  Upload,
  Download,
  Plus,
  Search,
  MoreVertical,
  FileSpreadsheet,
  File,
  X,
  ChevronUp,
  ChevronDown,
  Settings2,
  ArrowUpDown,
  Filter,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import EditRecordForm from '../components/ui/EditRecordForm';
import Loading from '../components/ui/loading';
import { useToast } from '../hooks/use-toast';

const DataManagement = () => {
  const [records, setRecords] = useState([
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', phone: '555-123-4567', city: 'New York', status: 'Unique' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', phone: '555-987-6543', city: 'Los Angeles', status: 'Unique' },
    { id: 3, name: 'Michael Johnson', email: 'michael.johnson@example.com', phone: '555-222-3333', city: 'Chicago', status: 'Unique' },
    { id: 4, name: 'John Smith', email: 'john.smith2@example.com', phone: '555-444-5555', city: 'New York', status: 'Potential Duplicate' },
    { id: 5, name: 'Sarah Williams', email: 'sarah.williams@example.com', phone: '555-777-8888', city: 'Miami', status: 'Unique' },
    { id: 6, name: 'David Brown', email: 'david.brown@example.com', phone: '555-666-9999', city: 'Seattle', status: 'Unique' },
    { id: 7, name: 'Emily Davis', email: 'emily.davis@example.com', phone: '555-111-2222', city: 'Boston', status: 'Unique' },
    { id: 8, name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '555-333-4444', city: 'Miami', status: 'Potential Duplicate' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    email: true,
    phone: true,
    city: true,
    status: true
  });

  const { toast } = useToast();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Simulated loading effect
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sorting function
  const handleSort = async (key) => {
    setIsSorting(true);
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setTimeout(() => setIsSorting(false), 300);
  };

  // Sort records
  const sortedRecords = React.useMemo(() => {
    if (!sortConfig.key) return records;

    return [...records].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [records, sortConfig]);

  // Filter records
  const filteredRecords = React.useMemo(() => {
    return sortedRecords.filter(record => {
      const matchesSearch = Object.values(record).some(value =>
        value.toString().toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sortedRecords, debouncedSearch, statusFilter]);

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500');
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileSelection(files[0]);
    }
  };

  // Handle file selection
  const handleFileSelection = (file) => {
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();
      const allowedTypes = ['csv', 'xlsx', 'xls', 'pdf'];
      
      if (!allowedTypes.includes(fileType)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV, Excel, or PDF file",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `Selected file: ${file.name}`,
      });
    }
  };

  // Handle file import
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  // Process the imported file
  const processImportedFile = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const fileType = selectedFile.name.split('.').pop().toLowerCase();
    
    try {
      if (fileType === 'csv') {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const csvContent = event.target.result;
            const rows = csvContent.split('\n');
            const headers = rows[0].split(',');
            
            const newRecords = rows.slice(1)
              .filter(row => row.trim())
              .map((row, index) => {
                const values = row.split(',');
                const record = {};
                headers.forEach((header, i) => {
                  record[header.trim().toLowerCase()] = values[i]?.trim() || '';
                });
                record.id = records.length + index + 1;
                record.status = 'Pending';
                return record;
              });

            setRecords(prev => [...prev, ...newRecords]);
            setShowImportModal(false);
            setSelectedFile(null);
            toast({
              title: "Import Successful",
              description: `${newRecords.length} records imported successfully!`,
            });
          } catch (error) {
            console.error('Error parsing CSV:', error);
            toast({
              title: "Import Failed",
              description: "Error parsing CSV file. Please check the file format.",
              variant: "destructive",
            });
          }
        };
        reader.onerror = () => {
          toast({
            title: "Import Failed",
            description: "Error reading file. Please try again.",
            variant: "destructive",
          });
        };
        reader.readAsText(selectedFile);
      } else {
        toast({
          title: "Unsupported Format",
          description: `${fileType.toUpperCase()} processing will be implemented soon. Please use CSV format for now.`,
        });
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Import Failed",
        description: "Error processing file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle export
  const handleExport = (format) => {
    setLoading(true);
    setTimeout(() => {
      try {
        const data = records.map(record => ({
          ID: record.id,
          Name: record.name,
          Email: record.email,
          Phone: record.phone,
          City: record.city,
          Status: record.status
        }));

        if (format === 'csv') {
          const headers = ['ID', 'Name', 'Email', 'Phone', 'City', 'Status'];
          const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header] || '').join(','))
          ].join('\n');

          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'data-export.csv';
          a.click();

          toast({
            title: "Export Successful",
            description: "Records exported to CSV successfully!",
          });
        } else {
          toast({
            title: "Export Failed",
            description: `${format.toUpperCase()} export not implemented yet.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error exporting data:', error);
        toast({
          title: "Export Failed",
          description: "Error exporting data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Data Management</h1>
          <p className="text-sm text-gray-500">
            Import, manage, and export your data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowImportModal(true)}
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <File className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Record
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4 items-center">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="Unique">Unique</SelectItem>
                <SelectItem value="Potential Duplicate">Potential Duplicates</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setRecords([...records]);
                  setLoading(false);
                  toast({
                    title: "Records Refreshed",
                    description: "The data has been refreshed.",
                  });
                }, 1000);
              }}
              className="shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-gray-700"
                    onClick={() => handleSort('email')}
                  >
                    Email
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-gray-700"
                    onClick={() => handleSort('phone')}
                  >
                    Phone
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-gray-700"
                    onClick={() => handleSort('city')}
                  >
                    City
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-gray-700"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.status === 'Unique'
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'Potential Duplicate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingRecord(record);
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this record?')) {
                              setIsDeleting(true);
                              setTimeout(() => {
                                setRecords(records.filter(r => r.id !== record.id));
                                setIsDeleting(false);
                                toast({
                                  title: "Record Deleted",
                                  description: "The record has been deleted successfully.",
                                  variant: "destructive",
                                });
                              }, 500);
                            }
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentRecords.length === 0 && (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">No records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for
            </p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} records
              </span>
              <Select
                value={recordsPerPage.toString()}
                onValueChange={(value) => {
                  setRecordsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-700">per page</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <EditRecordForm
          onClose={() => setShowAddModal(false)}
          onSave={(record) => {
            setRecords([...records, { ...record, id: records.length + 1, status: 'Pending' }]);
            setShowAddModal(false);
            toast({
              title: "Record Added",
              description: "The new record has been added successfully.",
            });
          }}
        />
      )}

      {showEditModal && editingRecord && (
        <EditRecordForm
          record={editingRecord}
          onClose={() => {
            setShowEditModal(false);
            setEditingRecord(null);
          }}
          onSave={(updatedRecord) => {
            setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r));
            setShowEditModal(false);
            setEditingRecord(null);
            toast({
              title: "Record Updated",
              description: "The record has been updated successfully.",
            });
          }}
        />
      )}

      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Import Data</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowImportModal(false);
                  setSelectedFile(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center mb-4"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or click to browse from your computer
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.pdf"
                  onChange={handleFileImport}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  Browse Files
                </Button>
              </div>
            </div>
            {selectedFile && (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportModal(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={processImportedFile}
                disabled={!selectedFile}
              >
                Import Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement; 