import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { motion } from 'framer-motion';

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginError {
  message: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<LoginError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const trimmedUsername = formData.username.trim();

    try {
      const response = await axios.post(
        `http://localhost:7000/api/auth/login`,
        {
          username: trimmedUsername,
          password: formData.password
        },
        {
          withCredentials: true
        }
      );

      if (response.data.user) {
        dispatch(setCredentials({
          username: response.data.user.username,
          role: response.data.user.role,
          token: response.data.user.token,
        }));

        const origin = location.state?.from?.pathname || '/home';
        navigate(origin, { replace: true });
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      setError({
        message: err.response?.data?.error || 'Login failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden relative">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-gradient-xy">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_rgba(147,51,234,0.1)_0,_transparent_70%)]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full space-y-8 bg-gray-950/90 p-8 rounded-2xl shadow-2xl border border-gray-800/50 backdrop-blur-sm"
      >
        <div className="text-center">
          <motion.h2
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
          >
            Welcome Back
          </motion.h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-cyan-500/50"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-cyan-500/50"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-center p-3 rounded-lg bg-red-900/30 text-red-400"
            >
              {error.message}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 relative overflow-hidden ${isLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-lg hover:shadow-cyan-500/30'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              <span className="relative z-10">Sign In</span>
            )}
          </motion.button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Don’t have an account?{' '}
            <a href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
              Register here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;