import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const Duplicates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);

  const duplicates = [
    {
      id: 1,
      original: { name: 'Employee Data 2024', department: 'HR', date: '2024-02-20' },
      duplicate: { name: 'Employee Data 2024', department: 'HR', date: '2024-02-21' },
      confidence: 85,
      status: 'pending'
    },
    {
      id: 2,
      original: { name: 'Sales Report Q1', department: 'Finance', date: '2024-02-19' },
      duplicate: { name: 'Sales Report Q1', department: 'Finance', date: '2024-02-19' },
      confidence: 92,
      status: 'resolved'
    },
    {
      id: 3,
      original: { name: 'Marketing Campaign', department: 'Marketing', date: '2024-02-18' },
      duplicate: { name: 'Marketing Campaign', department: 'Marketing', date: '2024-02-18' },
      confidence: 78,
      status: 'rejected'
    }
  ];

  const filteredDuplicates = duplicates.filter(dup =>
    dup.original.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dup.duplicate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'resolved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-5 h-5" />;
      case 'resolved': return <CheckCircle2 className="w-5 h-5" />;
      case 'rejected': return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Duplicate Detection</h1>
        <p className="text-gray-600">Manage and resolve duplicate datasets</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search duplicates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Confidence:</span>
          <Input
            type="number"
            min="0"
            max="100"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(e.target.value)}
            className="w-20"
          />
          <span className="text-sm text-gray-600">%</span>
        </div>
        <Button>Scan for Duplicates</Button>
      </div>

      <div className="space-y-4">
        {filteredDuplicates.map((duplicate) => (
          <div key={duplicate.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className={getStatusColor(duplicate.status)}>
                  {getStatusIcon(duplicate.status)}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Match Confidence: {duplicate.confidence}%
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Ignore
                </Button>
                <Button size="sm">
                  Merge
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Original Record</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="space-y-1">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Name:</dt>
                      <dd className="text-sm text-gray-900">{duplicate.original.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Department:</dt>
                      <dd className="text-sm text-gray-900">{duplicate.original.department}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Date:</dt>
                      <dd className="text-sm text-gray-900">{duplicate.original.date}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Duplicate Record</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="space-y-1">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Name:</dt>
                      <dd className="text-sm text-gray-900">{duplicate.duplicate.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Department:</dt>
                      <dd className="text-sm text-gray-900">{duplicate.duplicate.department}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Date:</dt>
                      <dd className="text-sm text-gray-900">{duplicate.duplicate.date}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredDuplicates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No duplicates found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Duplicates; 