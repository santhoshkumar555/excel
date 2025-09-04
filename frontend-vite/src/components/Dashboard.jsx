import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  
  // --- Pagination State for History and Files
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [filesCurrentPage, setFilesCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const fetchHistory = async () => {
    try {
      const token = userInfo?.token;
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get('http://localhost:5000/api/history', config);
      setHistory(data.history);
      setFiles(data.files);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch history.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [navigate]);

  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file and all its associated history?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/files/${fileId}`, config);
        fetchHistory();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to delete file.');
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put('http://localhost:5000/api/users/profile', { name, email }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <p className="text-xl font-semibold dark:text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <p className="text-xl font-semibold text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  // --- Pagination Logic for History
  const indexOfLastHistoryItem = historyCurrentPage * itemsPerPage;
  const indexOfFirstHistoryItem = indexOfLastHistoryItem - itemsPerPage;
  const currentHistoryItems = history.slice().reverse().slice(indexOfFirstHistoryItem, indexOfLastHistoryItem);

  const totalHistoryPages = Math.ceil(history.length / itemsPerPage);

  const paginateHistory = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalHistoryPages) {
        setHistoryCurrentPage(pageNumber);
    }
  };

  // --- Pagination Logic for Files
  const indexOfLastFileItem = filesCurrentPage * itemsPerPage;
  const indexOfFirstFileItem = indexOfLastFileItem - itemsPerPage;
  const currentFilesItems = files.slice().reverse().slice(indexOfFirstFileItem, indexOfLastFileItem);
  
  const totalFilesPages = Math.ceil(files.length / itemsPerPage);

  const paginateFiles = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalFilesPages) {
        setFilesCurrentPage(pageNumber);
    }
  };


  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">User Dashboard</h1>
      
      {/* User Profile Section - Now a full-width card at the top */}
      <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md mb-8 border border-white/20">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Profile Details</h2>
        {editing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Name:</span> {userInfo.name}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Email:</span> {userInfo.email}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">User ID:</span> {userInfo._id}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">User Status:</span> {userInfo.isAdmin ? 'Administrator' : 'User'}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Uploaded Files Section */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-white/20">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Your Uploaded Files</h2>
          {files.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">You haven't uploaded any files yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-white/30 dark:bg-gray-800/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Upload Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                  {currentFilesItems.map((file) => (
                    <tr key={file._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{file.fileName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(file.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteFile(file._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => paginateFiles(filesCurrentPage - 1)}
                  disabled={filesCurrentPage === 1}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {filesCurrentPage} of {totalFilesPages}
                </span>
                <button
                  onClick={() => paginateFiles(filesCurrentPage + 1)}
                  disabled={filesCurrentPage === totalFilesPages}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Analysis History Section - Now with Pagination */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-white/20">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Analysis History</h2>
          {history.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">You haven't generated any charts yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-white/30 dark:bg-gray-800/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">X-Axis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Y-Axis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chart Type</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                  {currentHistoryItems.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.file ? item.file.fileName : 'File Deleted'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.xAxis}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.yAxis}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.chartType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
    
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => paginateHistory(historyCurrentPage - 1)}
                  disabled={historyCurrentPage === 1}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {historyCurrentPage} of {totalHistoryPages}
                </span>
                <button
                  onClick={() => paginateHistory(historyCurrentPage + 1)}
                  disabled={historyCurrentPage === totalHistoryPages}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;