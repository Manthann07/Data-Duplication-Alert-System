import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Upload, File, X } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const UploadDataset = () => {
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState({
    department: '',
    description: '',
    tags: ''
  });

  const onDrop = useCallback(acceptedFiles => {
    setFiles(prev => [...prev, ...acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9)
    }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  });

  const removeFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please select files to upload",
        variant: "destructive"
      });
      return;
    }

    if (!metadata.department) {
      toast({
        title: "Error",
        description: "Please select a department",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically upload the files
    toast({
      title: "Success",
      description: "Files uploaded successfully",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Upload Dataset</h1>
        <p className="text-gray-600">Upload your data files for duplicate detection</p>
      </div>

      {/* Upload Area */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          {isDragActive ? 'Drop the files here' : 'Drag & drop files here, or click to select files'}
        </p>
        <p className="text-sm text-gray-500">Supported formats: CSV, XLS, XLSX</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-3">Selected Files</h3>
          <div className="space-y-2">
            {files.map(({ file, id }) => (
              <div key={id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(id)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="font-medium mb-4">File Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={metadata.department}
              onChange={(e) => setMetadata({ ...metadata, department: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="IT">IT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              type="text"
              placeholder="Enter a description for these files"
              value={metadata.description}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <Input
              type="text"
              placeholder="e.g. monthly, reports, 2024"
              value={metadata.tags}
              onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setFiles([])}>
          Clear All
        </Button>
        <Button onClick={handleUpload}>
          Upload Files
        </Button>
      </div>
    </div>
  );
};

export default UploadDataset; 