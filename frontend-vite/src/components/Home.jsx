import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useContext } from 'react';
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

const features = [
  {
    title: 'Upload Excel Files',
    description: 'Effortlessly upload .xls and .xlsx files to start your data analysis journey.',
    image: 'upload.png',
  },
  {
    title: 'Generate Interactive Charts',
    description: 'Visualize your data with a variety of 2D and 3D charts, including bar, line, pie, and more.',
    image: 'chart.png',
  },
  {
    title: 'Get AI-Powered Insights',
    description: 'Leverage Gemini AI to get automated summaries and key insights from your data.',
    image: 'AI.png',
  },
  {
    title: 'Manage Your Data',
    description: 'View your upload history, analyze past charts, and delete files you no longer need.',
    image: 'dashboard.png',
  },
];

const barChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Monthly Sales',
    data: [1200, 1900, 3000, 500, 2000, 3000],
    backgroundColor: [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
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
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
    ],
    borderWidth: 1,
  }],
};


const Home = () => {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const { theme } = useContext(ThemeContext);

  return (
  <div className="min-h-screen p-4">
    <div className="container mx-auto mt-4 text-center">

      {/* 1. Feature Slider */}
      <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-xl relative mb-12 border border-white/20">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {features.map((feature, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col md:flex-row items-center p-8">
                <div className="md:w-1/2 ml-4">
                  <img src={feature.image} alt={feature.title} className=" rounded-full shadow-lg h-60 w-auto ml-8" />
                </div>  
                <div className="md:w-1/2 md:pl-12 mt-6 md:mt-0 text-center mr-20">
                  <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-prev-custom absolute top-1/2 left-0 z-10 p-2 transform -translate-y-1/2 bg-gray-900/50 hover:bg-gray-900/75 text-white rounded-r-lg cursor-pointer transition-colors hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12 15.75 4.5" />
          </svg>
        </div>
        <div className="swiper-button-next-custom absolute top-1/2 right-0 z-10 p-2 transform -translate-y-1/2 bg-gray-900/50 hover:bg-gray-900/75 text-white rounded-l-lg cursor-pointer transition-colors hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5 15.75 12 8.25 19.5" />
          </svg>
        </div>
      </div>

      {/* 2. Welcome Section */}
      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
        Welcome to the Excel Analytics Platform
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Your all-in-one solution for data visualization and analysis.
      </p>
      <div className="flex justify-center space-x-4 mb-8">
        <Link
          to={userInfo ? (userInfo.isAdmin ? '/admin' : '/upload') : '/login'}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
        {!userInfo && (
          <Link
            to="/register"
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Try for Free
          </Link>
        )}
      </div>
      
      {/* 3. "How It Works" Section */}
      <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-lg shadow-xl border border-white/20 mt-12 p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-blue-600 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">1. Upload Your File</h3>
                  <p className="text-gray-600 dark:text-gray-300">Securely upload your Excel spreadsheet from your computer.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-green-600 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">2. Analyze Your Data</h3>
                  <p className="text-gray-600 dark:text-gray-300">Select your axes and chart type to generate a visualization.</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <svg
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-16 h-16 text-indigo-600 mb-4"
                >
                  <path d="M12 1.5l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. Get Insights</h3>
                  <p className="text-gray-600 dark:text-gray-300">Generate an AI report to understand your data better.</p>
              </div>
          </div>
      </div>

      {/* 4. "See It in Action" Demo Charts */}
      <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-lg shadow-xl border border-white/20 mt-12 p-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">See It in Action</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div className="p-4 border rounded-lg shadow-sm bg-white/50 dark:bg-gray-800/50">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Sample Monthly Sales' },
                },
              }}
            />
          </div>
          <div className="p-4 border rounded-lg shadow-sm bg-white/50 dark:bg-gray-800/50">
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Sample Sales by Region' },
                },
              }}
            />
          </div>
        </div>
      </div>

    </div>
  </div>
);
};

export default Home;