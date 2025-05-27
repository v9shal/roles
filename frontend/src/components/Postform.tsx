import axios from 'axios';
import React, { useEffect, type ChangeEvent } from 'react';

interface Post {
  id?: string;
  content: string;
  imageUrl: string | null;
  authorId: string;
  //zoneId: string | null;
}

interface FormDataState {
  content: string;
  imageUrl: string | null;
  authorId: string;
 // zoneId: string;
  localFile?: File | null;
}

const PostForm = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [posts, setPosts] = React.useState<Post[]>([]);

  const initialFormData: FormDataState = {
    content: '',
    imageUrl: null,
    authorId: '',
    //zoneId: ''
  };

  const [formData, setFormData] = React.useState<FormDataState>(initialFormData);
  const [currentObjectUrl, setCurrentObjectUrl] = React.useState<string | null>(null);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [currentObjectUrl]);

  // Fetch posts on component mount
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await axios.get('/api/posts');
  //       setPosts(response.data);
  //     } catch (err) {
  //       setError('Failed to fetch posts');
  //     }
  //   };
  //   fetchPosts();
  // }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('content', formData.content);
      formDataToSubmit.append('authorId', formData.authorId);
     // formDataToSubmit.append('zoneId', formData.zoneId);
      
      if (formData.localFile) {
        formDataToSubmit.append('image', formData.localFile);
      } else if (formData.imageUrl && formData.imageUrl.startsWith('http')) {
        formDataToSubmit.append('imageUrl', formData.imageUrl);
      }

      const response = await axios.post('http://localhost:3000/api/post/createPost', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Post created successfully!');
      setPosts([...posts, response.data]);
      setFormData(initialFormData);
      
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        setCurrentObjectUrl(null);
      }
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      
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
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Author ID</label>
          <input
            type="text"
            name="authorId"
            value={formData.authorId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
{/* 
        <div>
          <label className="block text-gray-700 mb-2">Zone ID</label>
          <input
            type="text"
            name="zoneId"
            value={formData.zoneId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}

        <div>
          <label className="block text-gray-700 mb-2">Image</label>
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
          {formData.imageUrl && (
            <div className="mt-2">
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                className="mt-1 max-w-xs max-h-40 object-contain border rounded"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Submitting...' : 'Create Post'}
        </button>
      </form>

    </div>
  );
};

export default PostForm;