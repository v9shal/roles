import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Resource {
  id?: string;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string | null;
  ownerId: string;
  isSharable: boolean;
}

interface FormDataState {
  title: string;
  description: string;
  imageUrl: string | null;
  category: string;
  ownerId: string;
  isSharable: boolean;
  localFile: File | null;
}

const ResourceForm = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const initialFormData: FormDataState = {
    title: '',
    description: '',
    imageUrl: null,
    category: '',
    ownerId: '',
    isSharable: false,
    localFile: null,
  };

  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [imageSourceType, setImageSourceType] = useState<'url' | 'file'>('url');
  const [currentObjectUrl, setCurrentObjectUrl] = useState<string | null>(null);

  // Cleanup object URL on unmount or when a new one is created
  useEffect(() => {
    return () => {
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [currentObjectUrl]);

  // Fetch resources on component mount
  // useEffect(() => {
  //   const fetchResources = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get('/api/getAllResources');
  //       setResources(response.data);
  //     } catch (err) {
  //       setError('Failed to fetch resources');
  //       console.error('Error fetching resources:', err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchResources();
  // }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isSharable: e.target.checked });
  };

  const handleImageSourceTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newType = e.target.value as 'url' | 'file';
    setImageSourceType(newType);
    // Clear previous image data when switching types
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      setCurrentObjectUrl(null);
    }
    setFormData({ ...formData, imageUrl: null, localFile: null });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Revoke previous object URL if it exists
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
      const newObjectUrl = URL.createObjectURL(file);
      setCurrentObjectUrl(newObjectUrl);
      setFormData({ ...formData, imageUrl: newObjectUrl, localFile: file });
    } else {
      // No file selected, or selection cancelled
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        setCurrentObjectUrl(null);
      }
      setFormData({ ...formData, imageUrl: null, localFile: null });
    }
  };

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    // If user types a URL, we clear any local file/object URL
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      setCurrentObjectUrl(null);
    }
    setFormData({ ...formData, imageUrl: e.target.value, localFile: null });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('ownerId', formData.ownerId);
      formDataToSend.append('isSharable', String(formData.isSharable));
      
      if (formData.localFile) {
        formDataToSend.append('image', formData.localFile);
      } else if (formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl);
      }

      const response = await axios.post('http://localhost:3000/api/resources/uploadresources', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Resource created successfully!');
      setResources([...resources, response.data]);
      
      // Reset form
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        setCurrentObjectUrl(null);
      }
      setFormData(initialFormData);
      setImageSourceType('url');
    } catch (err) {
      console.error('Error creating resource:', err);
      setError(err.response?.data?.error || 'Failed to create resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await axios.delete(`/api/deleteResource/${id}`);
      setResources(resources.filter(resource => resource.id !== id));
      setSuccess('Resource deleted successfully');
    } catch (err) {
      setError('Failed to delete resource');
      console.error('Error deleting resource:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Resource</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter resource title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            placeholder="Enter resource description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 mb-2">Image Source</label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="url"
                checked={imageSourceType === 'url'}
                onChange={handleImageSourceTypeChange}
                className="text-blue-600"
              />
              <span className="ml-2">URL</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="file"
                checked={imageSourceType === 'file'}
                onChange={handleImageSourceTypeChange}
                className="text-blue-600"
              />
              <span className="ml-2">Upload File</span>
            </label>
          </div>

          {imageSourceType === 'url' ? (
            <div>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl || ''}
                onChange={handleImageUrlChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {formData.imageUrl && formData.localFile && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Preview:</p>
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="mt-1 max-w-xs max-h-40 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Category</label>
          <input
            type="text"
            name="category"
            placeholder="Enter category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Owner ID</label>
          <input
            type="text"
            name="ownerId"
            placeholder="Enter owner ID"
            value={formData.ownerId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isSharable"
            checked={formData.isSharable}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-gray-700">Shareable</label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg text-white font-medium ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Resource'}
        </button>
      </form>

      <hr className="my-8 border-gray-200" />

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Resources</h3>
        
        {isLoading ? (
          <p className="text-gray-500">Loading resources...</p>
        ) : resources.length === 0 ? (
          <p className="text-gray-500">No resources found.</p>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">{resource.title}</h4>
                    <p className="text-gray-600 mt-1">{resource.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="mr-3">Category: {resource.category || 'N/A'}</span>
                      <span className="mr-3">Owner: {resource.ownerId}</span>
                      <span>Shared: {resource.isSharable ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(resource.id!)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
                {resource.imageUrl && (
                  <img 
                    src={resource.imageUrl} 
                    alt={resource.title} 
                    className="mt-3 max-w-xs max-h-40 object-contain border rounded"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceForm;