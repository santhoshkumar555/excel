import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false); // State to handle mobile menu

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const isAdminOrSuperAdmin = userInfo && (userInfo.role === 'admin' || userInfo.role === 'super_admin');

  return (
    <nav className={`bg-gray-800 p-4 shadow-md ${theme === 'dark' ? 'dark:bg-transparent' : ''}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Insight Canvas
        </Link>
        
        {/* Mobile menu button and theme toggle */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors mr-2"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4 items-center">
          {userInfo ? (
            <>
              {userInfo.isAdmin && (
                <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/upload" className="text-gray-300 hover:text-white transition-colors">
                Upload
              </Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                Register
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu content */}
      <div className={`fixed inset-x-0 top-16 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm`}>
        <div className="flex flex-col space-y-4 p-4 text-white">
          {userInfo ? (
            <>
              {userInfo.isAdmin && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/upload" onClick={() => setIsOpen(false)} className="block py-2">
                Upload
              </Link>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2">
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="block py-2">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;