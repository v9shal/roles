import React, { useState } from 'react';
import ResourceForm from '../components/ResourceForm';
import PostForm from '../components/Postform';

const Contribute = () => {
  const [activeForm, setActiveForm] = useState<'resource' | 'post' | null>(null); // State to track active form

  const handleClick = (formType: 'resource' | 'post') => {
    setActiveForm(formType); // Set the active form based on the button clicked
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Contribute</h1>
      <p className="mb-6">
        We welcome contributions to our community! You can share your knowledge, resources, and experiences.
      </p>
      <div className="space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => handleClick('resource')}
        >
          Resource
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => handleClick('post')}
        >
          Post
        </button>
      </div>

      <div className="mt-6">
        {activeForm === 'resource' && <ResourceForm />}
        {activeForm === 'post' && <PostForm />}
      </div>
    </div>
  );
};

export default Contribute;
