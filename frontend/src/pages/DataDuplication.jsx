import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  RefreshCw,
  CheckCircle,
  MoreVertical,
  Settings2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Loading from "../components/ui/loading";
import { cn } from "../lib/utils";
import { useToast } from "../hooks/use-toast";
import { getDuplicates } from '../services/dataService';

const DataDuplication = () => {
  const [duplicates, setDuplicates] = useState([]);
  const [sortBy, setSortBy] = useState('matchConfidence');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const fetchDuplicates = async () => {
      try {
        const response = await getDuplicates(searchQuery, sortBy === 'matchConfidence' ? 0.8 : 0.6);
        setDuplicates(response.duplicates || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch duplicates",
          duration: 3000,
        });
        setDuplicates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDuplicates();
  }, [location.state, toast, searchQuery, sortBy]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setLoading(true);
  };

  const handleSort = (key) => {
    setSortBy(key);
    setLoading(true);
  };

  const toggleGroup = (id) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleMerge = async (duplicateId) => {
    try {
      setLoading(true);
      // TODO: Implement merge API call
      setDuplicates(prev => prev.filter(d => d._id !== duplicateId));
      toast({
        title: "Success",
        description: "Records merged successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to merge records",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIgnore = async (duplicateId) => {
    try {
      setLoading(true);
      // TODO: Implement ignore API call
      setDuplicates(prev => prev.filter(d => d._id !== duplicateId));
      toast({
        title: "Success",
        description: "Records marked as ignored",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to ignore records",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (duplicateId) => {
    if (!window.confirm('Are you sure you want to delete these records?')) {
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement delete API call
      setDuplicates(prev => prev.filter(d => d._id !== duplicateId));
      toast({
        title: "Success",
        description: "Records deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete records",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfigureRules = () => {
    // TODO: Implement rules configuration
    toast({
      title: "Coming Soon",
      description: "Rules configuration will be available soon",
    });
  };

  // Filter duplicates based on search query
  const filteredDuplicates = duplicates.filter(duplicate => 
    !searchQuery || 
    duplicate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    duplicate.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    duplicate.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Duplicate Detection</h1>
          <p className="text-sm text-gray-500">
            Manage and resolve duplicate records in your database
          </p>
        </div>
        <Button
          onClick={handleConfigureRules}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings2 className="w-4 h-4" />
          Configure Rules
        </Button>
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
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matchConfidence">Match Confidence</SelectItem>
                <SelectItem value="timestamp">Date Detected</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setLoading(true);
                fetchDuplicates();
              }}
              className="shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredDuplicates.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">No duplicates found</h3>
              <p className="mt-1 text-sm text-gray-500">
                All records are unique or have been resolved
              </p>
            </div>
          ) : (
            filteredDuplicates.map((duplicate) => (
              <div key={duplicate._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      duplicate.duplicateScore >= 0.9 
                        ? 'bg-red-100 text-red-800'
                        : duplicate.duplicateScore >= 0.8
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    )}>
                      {Math.round(duplicate.duplicateScore * 100)}% Match
                    </span>
                    <span className="text-sm text-gray-500">
                      Created {new Date(duplicate.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleMerge(duplicate._id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Merge Records
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleIgnore(duplicate._id)}
                    >
                      Ignore
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(duplicate._id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Original Record</h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <dt className="text-gray-500">Name</dt>
                      <dd className="text-gray-900">{duplicate.name}</dd>
                      <dt className="text-gray-500">Email</dt>
                      <dd className="text-gray-900">{duplicate.email}</dd>
                      <dt className="text-gray-500">Phone</dt>
                      <dd className="text-gray-900">{duplicate.phone}</dd>
                    </dl>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Duplicate Record</h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <dt className="text-gray-500">Name</dt>
                      <dd className="text-gray-900">{duplicate.duplicateOf?.name}</dd>
                      <dt className="text-gray-500">Email</dt>
                      <dd className="text-gray-900">{duplicate.duplicateOf?.email}</dd>
                      <dt className="text-gray-500">Phone</dt>
                      <dd className="text-gray-900">{duplicate.duplicateOf?.phone}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DataDuplication;