import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ThemeContext } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- New Card Shuffle Component for the Hero section
const CardShuffle = () => {
  // New Base64-encoded images for card backgrounds
  const image1 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMzMzQxNTUiLz4KICA8cGF0aCBkPSJNMCAyMDAgQzIwMCA1MCA0MDAtMzAwIDYwMCAyMDAiIHN0cm9rZT0iIzZkOTdkZiIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIi8+CiAgPHJlY3QgeD0iMTAwIiB5PSI1MCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM3NDYwZTYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIyNSIgZmlsbD0iIzYzNjZFMSIvPgogIDxjaXJjbGUgY3g9IjUwMCIgY3k9IjMwMCIgcj0iNjAiIGZpbGw9IiM3NDYwZTYiLz4KICA8cGF0aCBkPSJNMjAwLDEwMCBDMjUwLDQwMCA0MDAsLTEwMCA1MDAsMTAwIiBzdHJva2U9IiM5MzkzYjgiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=`;
  const image2 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxZjI5M2YiLz4KICA8cGF0aCBkPSJNMTAwLDQwMCBMNTg4LDE4NiBMNTAwLDQwMCBaIiBmaWxsPSIjMmFkNmQwIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgogIDxwYXRoIGQ9Ik0wLDE1MCBDMTAwLDYwIDI1MCw2MCAzMDAsMTUwIFMyODAsMzAwIDQ1MCwyMDAgUzU1MCwzMDAgNjAwLDMwMCBMNjAwLDQwMCBMMCw0MDAgWiIgc3Ryb2tlPSIjMjlhZGU1IiBzdHJva2Utd2lkdGg9IjUiIGZpbGw9IiMwYjEzNzIiIGZpbGwtb3BhY2l0eT0iMC44Ii8+CiAgPHBhdGggZD0iTTUwLDMwMCBMNTUwLDMwMCIgc3Ryb2tlPSIjMjlhZGU1IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNODAsMjkwIEw4MCwzMjAgTDIyMCwyOTAgTDIyMCwzMjAgTDI1MCwyODAgTDI1MCwzMzAgTDI4MCwyODAgTDI4MCwzMzAgTDMzMCwyNzAgTDMzMCwzNDAgTDM4MCwyODAgTDM4MCwzMzAgTDM5MCwyOTAgTDQ2MCwyNjAgTDQ2MCwzMjAiIHN0cm9rZT0iIzcyYzk1YyIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==`;
  const image3 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMzYjgxZjQiLz4KICA8cGF0aCBkPSJNMCwwIEwzMDAsMjAwIEw2MDAsMCBMNDAwLDQwMCBMNDAwLDMwMCBMMjAwLDEwMCBMMjAwLDQwMCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiM4Yjg3ZjUiIHN0cm9rZS13aWR0aD0iNSIvPgogIDxyZWN0IHg9IjEwMCIgeT0iMTUwIiB3aWR0aD0iNDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZGJhZGYwIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgogIDxyZWN0IHg9IjE4MCIgeT0iMTUwIiB3aWR0aD0iNDAiIGhlaWdodD0iMTMwIiBmaWxsPSIjYmQ4MmZjIiBmaWxsLW9wYWNpdHk9IjAuNyIvPgogIDxyZWN0IHg9IjI2MCIgeT0iMTUwIiB3aWR0aD0iNDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjOTMyMGRhIiBmaWxsLW9wYWNpdHk9IjAuNyIvPgogIDxyZWN0IHg9IjM0MCIgeT0iMTUwIiB3aWR0aD0iNDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjNjM2NmYxIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgogIDxyZWN0IHg9IjQyMCIgeT0iMTUwIiB3aWR0aD0iNDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjNDg0ZWM5IiBmaWxsLW9wYWNpdHk9IjAuNyIvPgogIDxyZWN0IHg9IjUwMCIgeT0iMTUwIiB3aWR0aD0iNDAiIGhlaWdodD0iMTMwIiBmaWxsPSIjM2I4MWY0IiBmaWxsLW9wYWNpdHk9IjAuNiIvPgo8L3N2Zz4=`;
  const image4 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMyNjI2MjYiLz4KICA8cGF0aCBkPSJNMCwxODAgTDIwMCwxMjAgTDMwMCwyODAgTDM1MCwyMjAgTDU1MCwyOTAgTDYwMCwxODAiIHN0cm9rZT0iIzEzNzJiMiIgc3Ryb2tlLXdpZHRoPSI3IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTAgMjIwIEwxMjAgMTcwIEwyNjAgMzA5IEw0MDUgMTY1IEw2MDAgMjkwIiBzdHJva2U9IiM3Mzk5Y2QiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgogIDxsaW5lIHgxPSIxMDAiIHkxPSIyMzAiIHgyPSI1MTAiIHkyPSIyMzAiIHN0cm9rZT0iIzk0YTk5ZCIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgPHBhdGggZD0iTTUwLDMwMCBMNTAwLDMwMCIgc3Ryb2tlPSIjOWI5YmFhIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+`;

  const cards = [
    { title: 'Data Visualizations', value: '1,500+', image: image1 },
    { title: 'Daily Reports', value: '750+', image: image2 },
    { title: 'AI-Powered Insights', value: '100%', image: image3 },
    { title: 'User Satisfaction', value: '99%', image: image4 },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <div className="relative w-full max-w-sm h-72">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full p-6 rounded-xl shadow-2xl transition-opacity duration-1000 ease-in-out
            ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${card.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `rotate(${index * 5}deg)`,
            transformOrigin: 'bottom',
          }}
        >
          <div className="flex flex-col h-full justify-between items-start text-white bg-black bg-opacity-30 p-2 rounded">
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="text-5xl font-bold">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Updated chart data with new colors
const barChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Monthly Sales',
    data: [1200, 1900, 3000, 500, 2000, 3000],
    backgroundColor: [
      '#6366F1', // Indigo-500
      '#22C55E', // Green-500
      '#FCD34D', // Yellow-300
      '#3B82F6', // Blue-500
      '#A855F7', // Purple-500
      '#EC4899', // Pink-500
    ],
    borderColor: [
      '#4F46E5', // Indigo-600
      '#16A34A', // Green-600
      '#F59E0B', // Yellow-600
      '#2563EB', // Blue-600
      '#9333EA', // Purple-600
      '#DB2777', // Pink-600
    ],
    borderWidth: 1,
  }],
};

const pieChartData = {
  labels: ['North', 'South', 'East', 'West'],
  datasets: [{
    label: 'Sales by Region',
    data: [300, 500, 100, 400],
    backgroundColor: [
      '#60A5FA', // Blue-400
      '#34D399', // Green-400
      '#FDE047', // Yellow-200
      '#A78BFA', // Purple-400
    ],
    borderColor: [
      '#3B82F6', // Blue-500
      '#10B981', // Green-500
      '#FACC15', // Yellow-500
      '#8B5CF6', // Purple-500
    ],
    borderWidth: 1,
  }],
};

// --- Chart options for a dark theme
const barChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: '#E5E7EB', // White text for legend
            },
        },
        title: {
            display: true,
            text: 'Sample Monthly Sales',
            color: '#E5E7EB', // White text for title
        },
    },
    scales: {
        x: {
            ticks: {
                color: '#9CA3AF', // Light gray for x-axis labels
            },
            grid: {
                color: 'rgba(156, 163, 175, 0.2)', // Semi-transparent gridlines
            },
        },
        y: {
            ticks: {
                color: '#9CA3AF', // Light gray for y-axis labels
            },
            grid: {
                color: 'rgba(156, 163, 175, 0.2)', // Semi-transparent gridlines
            },
        },
    },
};

const pieChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: '#E5E7EB', // White text for legend
            },
        },
        title: {
            display: true,
            text: 'Sample Sales by Region',
            color: '#E5E7EB', // White text for title
        },
    },
};


const Home = () => {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const { theme } = useContext(ThemeContext);

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto mt-4 text-center">

        {/* 1. Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between py-12 px-6 md:px-12 bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20">
          <div className="md:w-1/2 text-left mb-8 md:mb-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
              Transform Your Excel Data <br /> into Actionable Insights
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Unlock the full potential of your spreadsheets with powerful analytics and reporting.
            </p>
            <div className="flex space-x-4">
              <Link
                to={userInfo ? (userInfo.isAdmin ? '/admin' : '/upload') : '/login'}
                className="px-6 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <CardShuffle />
          </div>
        </div>

        {/* 2. "How It Works" Section */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-lg shadow-xl border border-white/20 mt-12 p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">How It Works</h2>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
                {/* Step 1 */}
                <div className="flex flex-col items-center flex-1 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-blue-600 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">1. Connect Your Excel Files</h3>
                    <p className="text-gray-600 dark:text-gray-300">Securely upload your spreadsheets directly from your computer.</p>
                </div>
                {/* Arrow/Line Separator */}
                <div className="w-16 h-1 bg-gray-400 dark:bg-gray-600 hidden md:block" />
                
                {/* Step 2 */}
                <div className="flex flex-col items-center flex-1 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-green-600 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2. Analyze & Visualize</h3>
                    <p className="text-gray-600 dark:text-gray-300">Choose from a variety of charts and tools to analyze your data.</p>
                </div>
                {/* Arrow/Line Separator */}
                <div className="w-16 h-1 bg-gray-400 dark:bg-gray-600 hidden md:block" />
                
                {/* Step 3 */}
                <div className="flex flex-col items-center flex-1 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-indigo-600 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.043 0-2.052.196-3 .554m18 0c-.948-.358-1.957-.554-3-.554a8.967 8.967 0 00-6 2.292m-2.997 1.258a6.52 6.52 0 01-1.258 2.023A8.967 8.967 0 013.75 15c-.358.948-.554 1.957-.554 3m18 0c.358-.948.554-1.957.554-3a8.967 8.967 0 01-1.258-2.023m-2.997-1.258a6.52 6.52 0 00-2.023 1.258M12 18.75a8.967 8.967 0 006-2.292m2.997-1.258a6.52 6.52 0 00-1.258-2.023M12 18.75a8.967 8.967 0 01-6 2.292m-2.997 1.258a6.52 6.52 0 012.023-1.258" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">3. Share Insights</h3>
                    <p className="text-gray-600 dark:text-gray-300">Export your charts or share your dashboards with your team.</p>
                </div>
            </div>
        </div>

        {/* 3. New Testimonials Section */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-lg shadow-xl border border-white/20 mt-12 p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg shadow-sm text-center">
                    <p className="text-lg font-italic text-gray-800 dark:text-white mb-4">"Insight Canvas has revolutionized how we handle our monthly reports. The automated insights save us hours every week!"</p>
                    <div className="flex flex-col items-center">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSI0MCIgZmlsbD0iIzYwQTVGQSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWl5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBkeT0iLjNlbSI+SkQ8L3RleHQ+PC9zdmc+" alt="User" className="w-16 h-16 rounded-full mb-2" />
                        <span className="font-bold text-gray-900 dark:text-white">Jane Doe</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Data Analyst at Global Corp</span>
                    </div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg shadow-sm text-center">
                    <p className="text-lg font-italic text-gray-800 dark:text-white mb-4">"I was able to create a stunning dashboard in minutes. The drag-and-drop interface is incredibly intuitive for non-tech users."</p>
                    <div className="flex flex-col items-center">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSI0MCIgZmlsbD0iIzM0RDkzOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWl5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBkeT0iLjNlbSI+SlM8L3RleHQ+PC9zdmc+" alt="User" className="w-16 h-16 rounded-full mb-2" />
                        <span className="font-bold text-gray-900 dark:text-white">John Smith</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Marketing Manager at Innovate Inc.</span>
                    </div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg shadow-sm text-center">
                    <p className="text-lg font-italic text-gray-800 dark:text-white mb-4">"A fantastic tool for visualizing complex datasets without any coding. Highly recommend it for small businesses."</p>
                    <div className="flex flex-col items-center">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSI0MCIgZmlsbD0iI0ZERTA0NyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWl5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBkeT0iLjNlbSI+QUM8L3RleHQ+PC9zdmc+" alt="User" className="w-16 h-16 rounded-full mb-2" />
                        <span className="font-bold text-gray-900 dark:text-white">Alex Chen</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">CEO of Tech Solutions</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 5. "See It in Action" Demo Charts (Kept your original charts and styling) */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-lg shadow-xl border border-white/20 mt-12 p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">See It in Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="p-4 border rounded-lg shadow-sm bg-white/50 dark:bg-gray-800/50">
              <Bar
                data={barChartData}
                options={barChartOptions}
              />
            </div>
            <div className="p-4 border rounded-lg shadow-sm bg-white/50 dark:bg-gray-800/50">
              <Pie
                data={pieChartData}
                options={pieChartOptions}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;