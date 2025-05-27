'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SearchType = 'resource' | 'skill' | 'user' | 'post';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('resource');

  const handleClick = () => {
    navigate('/contribute'); 
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search/${searchType}/${encodeURIComponent(searchTerm)}`); 
  };

  const searchTypeOptions: { value: SearchType; label: string }[] = [
    { value: 'resource', label: 'Resources' },
    { value: 'skill', label: 'Skills' },
    { value: 'user', label: 'Users' },
    { value: 'post', label: 'Posts' },
  ];

  return (
    <main className="min-h-screen px-4 sm:px-6 md:px-10 py-10 bg-gray-900 text-white space-y-20">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-400 mb-4 leading-tight">
          Discover & Share in Your Community
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-8">
          Find skills, borrow resources, connect with neighbors, and share your updates.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center bg-gray-800 rounded-full shadow-xl overflow-hidden"
        >
          <div className="relative flex-grow w-full">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search for ${searchType}s...`}
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 transition duration-150 ease-in-out sm:rounded-l-none rounded-none sm:rounded-r-full w-full sm:w-auto"
          >
            Search
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {searchTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSearchType(option.value)}
              className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-200
                ${searchType === option.value
                  ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="text-center max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-4">Have something to offer?</h2>
        <p className="text-gray-400 mb-6">
          Share your skills, post an update, or list a resource. Let’s build the community together.
        </p>
        <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition" onClick={handleClick}>
          Contribute Now
        </button>
      </section>

      <footer className="text-center mt-16 pt-10 border-t border-gray-700 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Vishal
      </footer>
    </main>
  );
};

export default Home;
