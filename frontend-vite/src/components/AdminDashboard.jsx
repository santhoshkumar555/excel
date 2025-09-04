import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({ userCount: 0, fileCount: 0 });
  const [filesByUser, setFilesByUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // --- Pagination and Search State
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [filesCurrentPage, setFilesCurrentPage] = useState(1);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const token = userInfo?.token;
      if (!token || !userInfo.isAdmin) {
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const usersResponse = await axios.get('http://localhost:5000/api/admin/users', config);
      const filesResponse = await axios.get('http://localhost:5000/api/admin/files', config);
      const statsResponse = await axios.get('http://localhost:5000/api/admin/stats', config);
      const filesByUserResponse = await axios.get('http://localhost:5000/api/admin/files-by-user', config);

      setUsers(usersResponse.data);
      setFiles(filesResponse.data);
      setStats(statsResponse.data);
      setFilesByUser(filesByUserResponse.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);
  
  const handleToggleAdminStatus = async (userId, currentStatus) => {
    if (window.confirm('Are you sure you want to change this user\'s admin status?')) {
      try {
        const token = userInfo?.token;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.put(`http://localhost:5000/api/admin/users/${userId}`, { isAdmin: !currentStatus }, config);
        fetchData();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to update user status.');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = userInfo?.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);
        fetchData();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file and its associated history?')) {
      try {
        const token = userInfo?.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/files/${fileId}`, config);
        fetchData();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to delete file.');
      }
    }
  };
  
  // --- Filtering Logic
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredFiles = files.filter(file =>
    file.fileName.toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
    (file.user && file.user.email.toLowerCase().includes(fileSearchTerm.toLowerCase()))
  );

  // --- Pagination Logic for Users
  const indexOfLastUser = usersCurrentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginateUsers = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalUserPages) {
        setUsersCurrentPage(pageNumber);
    }
  };

  // --- Pagination Logic for Files
  const indexOfLastFile = filesCurrentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
  const totalFilePages = Math.ceil(filteredFiles.length / itemsPerPage);

  const paginateFiles = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalFilePages) {
        setFilesCurrentPage(pageNumber);
    }
  };

  // --- Updated chart data with better colors for dark theme
  const userChartData = {
    labels: ['Admin Users', 'Normal Users'],
    datasets: [{
      label: 'User Count',
      data: [users.filter(u => u.isAdmin).length, users.filter(u => !u.isAdmin).length],
      backgroundColor: [
        '#FCD34D', // Yellow-300
        '#60A5FA', // Blue-400
      ],
      borderColor: [
        '#FBBF24', // Yellow-400
        '#3B82F6', // Blue-500
      ],
      borderWidth: 1,
    }],
  };
  
  const filesByUserChartData = {
    labels: filesByUser.map(item => item.userName),
    datasets: [{
      label: 'Files by User',
      data: filesByUser.map(item => item.fileCount),
      backgroundColor: ['#22C55E', '#A855F7', '#EC4899'], // Green, Purple, Pink
      borderColor: ['#16A34A', '#9333EA', '#DB2777'], // Darker shades
      borderWidth: 1,
    }],
  };
  
  // --- Updated chart options for dark theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: theme === 'dark' ? '#E5E7EB' : '#1F2937' },
      },
      title: {
        display: true,
        text: 'Platform Usage Statistics',
        color: theme === 'dark' ? '#E5E7EB' : '#1F2937',
      },
    },
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

  return (
    <div className={`container bg-transparent mx-auto p-8`}>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">Admin Dashboard</h1>

      {/* New Top-Level Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-white/20">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
            <p className="text-4xl font-bold text-gray-800 dark:text-white mt-2">{stats.userCount}</p>
          </div>
        </div>
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-white/20">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Files</h3>
            <p className="text-4xl font-bold text-gray-800 dark:text-white mt-2">{stats.fileCount}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Management Section */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-white/20">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">All Users</h2>
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={userSearchTerm}
              onChange={(e) => {
                setUserSearchTerm(e.target.value);
                setUsersCurrentPage(1);
              }}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {filteredUsers.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-white/30 dark:bg-gray-800/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                  {currentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'}`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {user._id !== userInfo._id && (
                           <button
                             onClick={() => handleToggleAdminStatus(user._id, user.isAdmin)}
                             className={`font-medium ${user.isAdmin ? 'text-yellow-600 hover:text-yellow-900' : 'text-indigo-600 hover:text-indigo-900'}`}
                           >
                             {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                           </button>
                        )}
                        {user._id !== userInfo._id && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => paginateUsers(usersCurrentPage - 1)}
                  disabled={usersCurrentPage === 1}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {usersCurrentPage} of {totalUserPages}
                </span>
                <button
                  onClick={() => paginateUsers(usersCurrentPage + 1)}
                  disabled={usersCurrentPage === totalUserPages}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* File Management Section */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-white/20">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">All Uploaded Files</h2>
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search files by name or uploader..."
              value={fileSearchTerm}
              onChange={(e) => {
                setFileSearchTerm(e.target.value);
                setFilesCurrentPage(1);
              }}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {filteredFiles.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No files uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-white/30 dark:bg-gray-800/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uploaded By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                  {currentFiles.map((file) => (
                    <tr key={file._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{file.fileName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {file.user ? `${file.user.name} (${file.user.email})` : 'User Deleted'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                  Page {filesCurrentPage} of {totalFilePages}
                </span>
                <button
                  onClick={() => paginateFiles(filesCurrentPage + 1)}
                  disabled={filesCurrentPage === totalFilePages}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* New Pie Chart Section */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md col-span-1 lg:col-span-2 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Platform Statistics</h2>
          <div className="h-96 flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="p-4 border rounded-lg shadow-sm bg-white/50 dark:bg-gray-800/50">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Users by Role</h3>
                <div className="h-48">
                    <Pie data={userChartData} options={chartOptions} />
                </div>
              </div>
              <div className="p-4 border rounded-lg shadow-sm bg-white/50 dark:bg-gray-800/50">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Files by User</h3>
                <div className="h-48">
                    <Pie data={filesByUserChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;