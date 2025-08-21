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

  const userChartData = {
    labels: ['Admin Users', 'Normal Users'],
    datasets: [{
      label: 'User Count',
      data: [users.filter(u => u.isAdmin).length, users.filter(u => !u.isAdmin).length],
      backgroundColor: [
        'rgba(255, 206, 86, 0.6)',
        'rgba(54, 162, 235, 0.6)',
      ],
      borderColor: [
        'rgba(255, 206, 86, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 1,
    }],
  };
  
  const filesByUserChartData = {
    labels: filesByUser.map(item => item.userName),
    datasets: [{
      label: 'Files by User',
      data: filesByUser.map(item => item.fileCount),
      backgroundColor: filesByUser.map((_, i) => `hsl(${i * 60}, 70%, 50%)`),
      borderColor: filesByUser.map((_, i) => `hsl(${i * 60}, 70%, 40%)`),
      borderWidth: 1,
    }],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: theme === 'dark' ? 'white' : 'black' },
      },
      title: {
        display: true,
        text: 'Platform Usage Statistics',
        color: theme === 'dark' ? 'white' : 'black',
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
    <div className={`container bg-transparent mx-auto p-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">Admin Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Management Section */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">All Users</h2>
          {users.length === 0 ? (
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
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.isAdmin ? 'Yes' : 'No'}
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
            </div>
          )}
        </div>
        
        {/* File Management Section */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">All Uploaded Files</h2>
          {files.length === 0 ? (
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
                  {files.map((file) => (
                    <tr key={file._id}>
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
            </div>
          )}
        </div>
        
        {/* New Pie Chart Section */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md col-span-2">
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
