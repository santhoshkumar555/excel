import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      setMessage('Login successful! Redirecting...');
      localStorage.setItem('userInfo', JSON.stringify(data));
      setTimeout(() => {
        // Correct redirection logic based on user role
        if (data.isAdmin) {
          navigate('/');
        } else {
          navigate('/'); // Redirect normal users to the dashboard
        }
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid email or password.');
      console.error(error);
    }
  };

  return (
    <div className={`flex flex-col bg-transparent items-center justify-center min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-md w-full max-w-sm border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Sign In
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500 dark:text-red-400">
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;