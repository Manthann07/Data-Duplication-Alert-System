import React, { useState } from 'react';
import { Download, Check, X, ArrowRight, FileDown } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const DuplicateGroup = ({ group, similarity }) => {
  const [status, setStatus] = useState('pending'); // pending, merged, kept_both

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Downloading records as CSV",
      duration: 3000,
    });
    // Add API call to download
  };

  const handleMerge = () => {
    setStatus('merged');
    toast({
      title: "Records Merged",
      description: "The records have been successfully merged",
      duration: 3000,
    });
  };

  const handleKeepBoth = () => {
    setStatus('kept_both');
    toast({
      title: "Keeping Both Records",
      description: "Both records will be maintained separately",
      duration: 3000,
    });
  };

  return (
    <div className="mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Group {group.id}</h3>
            <span className="text-sm text-blue-600 font-medium">{similarity}% Similar</span>
            {status !== 'pending' && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                status === 'merged' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {status === 'merged' ? 'Merged' : 'Kept Both'}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Download button - Always visible */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            {status === 'pending' && (
              <>
                <button
                  onClick={handleKeepBoth}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Keep Both
                </button>
                <button
                  onClick={handleMerge}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Merge Records
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-2 divide-x divide-gray-200">
        {/* Original Record */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-blue-600">Original Record</h4>
            <span className="text-xs text-gray-500">Row {group.original.rowNumber}</span>
          </div>
          <div className="space-y-2">
            {Object.entries(group.original).map(([key, value]) => (
              key !== 'rowNumber' && (
                <div key={key} className="grid grid-cols-2 gap-2">
                  <span className="text-sm font-medium text-gray-500">{key}:</span>
                  <span className="text-sm text-gray-900">{value}</span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Duplicate Record */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-amber-600">Duplicate #{group.duplicate.id}</h4>
            <span className="text-xs text-gray-500">Row {group.duplicate.rowNumber}</span>
          </div>
          <div className="space-y-2">
            {Object.entries(group.duplicate).map(([key, value]) => (
              key !== 'rowNumber' && (
                <div key={key} className="grid grid-cols-2 gap-2">
                  <span className="text-sm font-medium text-gray-500">{key}:</span>
                  <span className="text-sm text-gray-900">{value}</span>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Duplicates = () => {
  const handleDownloadAll = () => {
    toast({
      title: "Downloading All Records",
      description: "Starting download of all records",
      duration: 3000,
    });
    // Add API call to download all
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Duplicate Records</h1>
          <p className="text-gray-600">Review and manage duplicate records in your dataset</p>
        </div>
        
        {/* Main Download Button - Always visible */}
        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileDown className="w-4 h-4" />
          Download All Records
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileDown className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Found 162 groups of duplicate records</h2>
            <p className="text-sm text-blue-700">Download or manage duplicate records below</p>
          </div>
        </div>
      </div>

      {/* Example duplicate group */}
      <DuplicateGroup
        group={{
          id: 1,
          original: {
            rowNumber: 2,
            index: 2,
            customerId: "1Ef7b82A4CAAD10",
            firstName: "Preston",
            lastName: "Lozano",
            company: "Vega-Gentry",
            city: "East Jimmychester",
            country: "Djibouti",
            phone1: "5153435776",
            phone2: "686-620-1820×944",
            email: "vmata@colon.com",
            subscriptionDate: "44309",
            website: "http://www.hobbs.com/"
          },
          duplicate: {
            id: 1,
            rowNumber: 125,
            index: 2,
            customerId: "1Ef7b82A4CAAD10",
            firstName: "Preston",
            lastName: "Lozano",
            company: "Vega-Gentry",
            city: "East Jimmychester",
            country: "Djibouti",
            phone1: "5153435776",
            phone2: "686-620-1820×944",
            email: "vmata@colon.com",
            subscriptionDate: "44309",
            website: "http://www.hobbs.com/"
          }
        }}
        similarity={100}
      />
    </div>
  );
};

export default Duplicates; 