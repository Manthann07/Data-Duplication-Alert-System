import { API_ENDPOINTS } from '../config/api';
import authService from './authService';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

export const datasetService = {
  // Fetch all datasets with optional filters
  async getDatasets(params = {}) {
    try {
      console.log('Fetching datasets with params:', params);
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_ENDPOINTS.GET_FILES}${queryParams ? `?${queryParams}` : ''}`;
      console.log('Fetching from URL:', url);

      const token = getAuthToken();
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      console.log('Using headers:', headers);

      const response = await fetch(url, {
        headers: headers
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch datasets');
      }
      
      const data = await response.json();
      console.log('Fetch response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching datasets:', error);
      throw error;
    }
  },

  // Upload a new dataset
  async uploadDataset(file, metadata) {
    try {
      console.log('Uploading dataset...');
      
      const token = getAuthToken();
      console.log('Using token:', token);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('department', metadata.department || '');
      formData.append('description', metadata.description || '');
      formData.append('tags', metadata.tags ? metadata.tags.join(',') : '');

      const headers = {
        'Authorization': `Bearer ${token}`
      };
      console.log('Upload headers:', headers);
      console.log('FormData contents:', [...formData.entries()]);

      const response = await fetch(API_ENDPOINTS.UPLOAD_FILE, {
        method: 'POST',
        headers: headers,
        body: formData
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.message || 'Error uploading file');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Get dataset details
  async getDatasetDetails(id) {
    try {
      const token = getAuthToken();
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_ENDPOINTS.GET_FILES}/${id}`, {
        headers: headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get dataset details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting dataset details:', error);
      throw error;
    }
  },

  // Download a dataset
  async downloadDataset(id) {
    try {
      const token = getAuthToken();
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_ENDPOINTS.GET_FILES}/${id}/download`, {
        headers: headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Download failed');
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'download';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      return { success: true, message: 'Download started' };
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },

  // Delete a dataset
  async deleteDataset(id) {
    try {
      const token = getAuthToken();
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_ENDPOINTS.GET_FILES}/${id}`, {
        method: 'DELETE',
        headers: headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Delete failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
};

export default datasetService;