import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import Loading from "../components/ui/loading";
import { useToast } from "../hooks/use-toast";
import { 
  getFileDuplicates, 
  keepBothRecords, 
  mergeDuplicateRecords,
  downloadProcessedFile 
} from '../services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { FileSearch, ArrowRight, Database, AlertCircle, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const DataDuplication = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!fileId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getFileDuplicates(fileId);
        console.log('Raw API Response:', response);
        
        if (response.success) {
          const groups = [];
          if (response.hasDuplicates && Array.isArray(response.duplicates)) {
            response.duplicates.forEach((duplicate, index) => {
              groups.push({
                id: index,
                rowNumber1: duplicate.rowNumber1 || 'N/A',
                rowNumber2: duplicate.rowNumber2 || 'N/A',
                record1: duplicate.record1 || {},
                record2: duplicate.record2 || {},
                similarity: duplicate.similarity || 100
              });
            });
          }
          setDuplicateGroups(groups);
          
          if (groups.length > 0) {
            toast({
              title: `Found ${groups.length} groups of duplicate records`,
              description: "Review and manage the duplicate records below",
              variant: "default",
              className: "bg-blue-50 border-blue-500 text-blue-800 text-lg font-semibold",
              duration: 5000,
            });
          }
        } else {
          throw new Error(response.message || 'Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch data",
          duration: 3000,
        });
        setDuplicateGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fileId, toast]);

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
      .trim();
  };

  const renderRecord = (record, isOriginal, rowNumber) => {
    if (!record) return null;

    const fields = Object.keys(record).filter(key => 
      !['_id', '__v', 'createdAt', 'updatedAt'].includes(key)
    );

    return (
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className={`text-xs font-medium px-2 py-1 rounded inline-block mb-4 ${
          isOriginal ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'
        }`}>
          {isOriginal ? 'Original Record' : 'Duplicate #1'}
        </div>
        <div className="mb-2">
          <span className="text-sm text-gray-600">Row Number: </span>
          <span className="text-sm font-medium">{rowNumber}</span>
        </div>
        <div className="space-y-2">
          {fields.map(field => (
            <div key={field} className="text-sm">
              <span className="text-gray-600 font-medium">{formatFieldName(field)}: </span>
              <span className="text-gray-900">
                {record[field]?.toString() || 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleDownload = async (format) => {
    try {
      setProcessing(true);
      await downloadProcessedFile(fileId, format);
      toast({
        title: "Download Started",
        description: `Your file will be downloaded in ${format.toUpperCase()} format`,
        variant: "default",
        className: "bg-green-50 border-green-500 text-green-800",
        duration: 3000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file",
        duration: 3000,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleKeepBoth = async (group) => {
    if (processing) return;
    
    try {
      setProcessing(true);
      setCurrentGroupId(group.id);
      
      const result = await keepBothRecords(fileId, group);
      console.log('Keep both result:', result);
      
      if (result.success) {
        // Update the UI
        setDuplicateGroups(prev => prev.filter(g => g.id !== group.id));

        toast({
          title: "Records Kept",
          description: "Both records have been kept in the dataset",
          variant: "default",
          className: "bg-green-50 border-green-500 text-green-800",
          duration: 3000,
        });

        // Check if this was the last group
        if (duplicateGroups.length === 1) {
          toast({
            title: "All Duplicates Processed",
            description: "You can now download the processed file",
            variant: "default",
            className: "bg-blue-50 border-blue-500 text-blue-800",
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Error keeping both records:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to keep records",
        duration: 5000,
      });
    } finally {
      setProcessing(false);
      setCurrentGroupId(null);
    }
  };

  const handleMergeRecords = async (group) => {
    if (processing) return;
    
    try {
      setProcessing(true);
      setCurrentGroupId(group.id);
      
      const result = await mergeDuplicateRecords(fileId, group);
      console.log('Merge result:', result);
      
      if (result.success) {
        // Update the UI
        setDuplicateGroups(prev => prev.filter(g => g.id !== group.id));

        toast({
          title: "Records Merged",
          description: "The duplicate records have been merged successfully",
          variant: "default",
          className: "bg-green-50 border-green-500 text-green-800",
          duration: 3000,
        });

        // Check if this was the last group
        if (duplicateGroups.length === 1) {
          toast({
            title: "All Duplicates Processed",
            description: "You can now download the processed file",
            variant: "default",
            className: "bg-blue-50 border-blue-500 text-blue-800",
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Error merging records:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to merge records",
        duration: 5000,
      });
    } finally {
      setProcessing(false);
      setCurrentGroupId(null);
    }
  };

  const renderDuplicateGroup = (group, index) => {
    if (!group?.record1 || !group?.record2) return null;
    const isProcessing = processing && currentGroupId === group.id;

    return (
      <div key={group.id || index} className="mb-8 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Group {index + 1}</h3>
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {group.similarity?.toFixed(2) || '100.00'}% Similar
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {renderRecord(group.record1, true, group.rowNumber1)}
          {renderRecord(group.record2, false, group.rowNumber2)}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleKeepBoth(group)}
            disabled={processing}
            className={isProcessing ? "opacity-50" : ""}
          >
            {isProcessing ? 'Processing...' : 'Keep Both'}
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => handleMergeRecords(group)}
            disabled={processing}
            className={isProcessing ? "opacity-50" : ""}
          >
            {isProcessing ? 'Processing...' : 'Merge Records'}
          </Button>
        </div>
      </div>
    );
  };

  if (!fileId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Duplicate Detection</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find and manage duplicate records in your datasets to ensure data accuracy and consistency
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-900">No File Selected</CardTitle>
              </div>
              <CardDescription className="text-blue-800">
                Please select a file to analyze for duplicates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-blue-800">
                  You'll be redirected to the records page where you can select a file to analyze.
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => navigate('/records')}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    Go to Records
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl text-yellow-900">How it Works</CardTitle>
              </div>
              <CardDescription className="text-yellow-800">
                Understanding duplicate detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-yellow-800">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Select a file from your records</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Our system will analyze the data for potential duplicates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Review and manage duplicate records</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Merge or keep duplicate records as needed</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Duplicate Records</h1>
            <p className="mt-2 text-gray-600">Review and manage duplicate records in your dataset</p>
          </div>
          {!loading && fileId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Processed File
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleDownload('csv')}>
                  Download as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('xlsx')}>
                  Download as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('json')}>
                  Download as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loading className="w-8 h-8" />
        </div>
      ) : (
        <div className="space-y-6">
          {duplicateGroups && duplicateGroups.length > 0 ? (
            duplicateGroups.map((group, index) => renderDuplicateGroup(group, index))
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border">
              <p className="text-gray-500">
                {fileId ? "No duplicates found in this file" : "Please select a file to check for duplicates"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataDuplication;