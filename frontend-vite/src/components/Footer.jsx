import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className={`bg-gray-800 ${theme === 'dark' ? 'dark:bg-gray-900' : ''} text-white p-6 mt-12`}>
      <div className="container mx-auto text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">Insight Canvas </h3>
            <p className="text-sm text-gray-400">
              Your all-in-one solution for data visualization and analysis.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Quick Links</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              </li>
              <li>
                <Link to="/upload" className="hover:underline">Upload</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Connect</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>
                <a href="mailto:contact@example.com" className="hover:underline">contact@example.com</a>
              </li>
              <li>
                <a href="#" className="hover:underline">LinkedIn</a>
              </li>
              <li>
                <a href="#" className="hover:underline">GitHub</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-6 text-sm text-gray-500 text-center">
          &copy; 2025 Insight Canvas . All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;