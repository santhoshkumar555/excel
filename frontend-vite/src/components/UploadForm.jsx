// import React, { useState, useRef, useContext } from 'react';
// import axios from 'axios';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement, RadialLinearScale, Filler } from 'chart.js';
// import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
// import Plot from 'react-plotly.js';
// import { useNavigate, Link } from 'react-router-dom';
// import jsPDF from 'jspdf';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import { ThemeContext } from '../context/ThemeContext'; // Import the context

// // Register all the components we plan to use for charting and the new plugin
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   RadialLinearScale,
//   Filler,
//   Title,
//   Tooltip,
//   Legend,
//   ChartDataLabels
// );

// const UploadForm = () => {
//   const [file, setFile] = useState(null);
//   const [headers, setHeaders] = useState([]);
//   const [sheetNames, setSheetNames] = useState([]);
//   const [message, setMessage] = useState('');
//   const [fileId, setFileId] = useState(null);
//   const [selectedSheet, setSelectedSheet] = useState('');
//   const [selectedXAxis, setSelectedXAxis] = useState('');
//   const [selectedYAxis, setSelectedYAxis] = useState('');
//   const [selectedZAxis, setSelectedZAxis] = useState('');
//   const [chartType, setChartType] = useState('bar');
//   const [chartData, setChartData] = useState(null);
//   const [aiInsights, setAiInsights] = useState(null);
//   const chartRef = useRef(null);
//   const navigate = useNavigate();
//   const [isDragging, setIsDragging] = useState(false);
//   const { theme } = useContext(ThemeContext); // Access the theme context

//   const chartTypes = ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea', '3d-bar'];

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setHeaders([]);
//     setSheetNames([]);
//     setFileId(null);
//     setSelectedSheet('');
//     setSelectedXAxis('');
//     setSelectedYAxis('');
//     setSelectedZAxis('');
//     setMessage('');
//     setChartData(null);
//     setAiInsights(null);
//   };
  
//   const handleChartTypeChange = (e) => {
//     setChartType(e.target.value);
//     setChartData(null);
//     setSelectedZAxis('');
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setMessage('Please select a file first.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('excelFile', file);

//     try {
//       const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//       const token = userInfo?.token;
//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       setMessage('Uploading...');
//       const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);

//       setHeaders(data.headers);
//       setSheetNames(data.sheetNames);
//       setFileId(data.fileId);
//       setMessage(data.message);
      
//       if (data.sheetNames.length > 0) {
//         setSelectedSheet(data.sheetNames[0]);
//       }
//       if (data.headers.length >= 2) {
//         setSelectedXAxis(data.headers[0]);
//         setSelectedYAxis(data.headers[1]);
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Upload failed.');
//       console.error(error);
//       if (error.response?.status === 401) {
//           navigate('/login');
//       }
//     }
//   };

//   const handleChartGeneration = async (e) => {
//     e.preventDefault();
//     if (!fileId || !selectedSheet || !selectedXAxis || !selectedYAxis) {
//       setMessage('Please select all required fields.');
//       return;
//     }
//     if (chartType === '3d-bar' && !selectedZAxis) {
//       setMessage('Please select a Z-Axis for 3D charts.');
//       return;
//     }

//     try {
//       const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//       const token = userInfo?.token;
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       setMessage('Generating chart...');
//       const { data } = await axios.post(
//         'http://localhost:5000/api/analyze',
//         { fileId, sheetName: selectedSheet, xAxis: selectedXAxis, yAxis: selectedYAxis, zAxis: selectedZAxis, chartType },
//         config
//       );
      
//       if (chartType === '3d-bar') {
//           const plotlyData = [{
//               x: data.labels,
//               y: data.data,
//               z: data.zData,
//               type: 'bar',
//               name: selectedYAxis,
//               marker: {color: 'rgb(14, 127, 218)'},
//               orientation: 'v'
//           }];
//           setChartData(plotlyData);
//           setMessage('3D chart data generated successfully!');
//           return;
//       }
      
//       const getRandomColor = () => {
//         const letters = '0123456789ABCDEF';
//         let color = '#';
//         for (let i = 0; i < 6; i++) {
//           color += letters[Math.floor(Math.random() * 16)];
//         }
//         return color;
//       };

//       let chartJsData;
//       const backgroundColors = data.labels.map(() => getRandomColor());
//       chartJsData = {
//           labels: data.labels,
//           datasets: [{
//               label: selectedYAxis,
//               data: data.data,
//               backgroundColor: backgroundColors,
//               borderColor: backgroundColors,
//               borderWidth: 1,
//           }],
//       };
      
//       if (chartType === 'line' || chartType === 'radar') {
//           chartJsData.datasets[0].backgroundColor = backgroundColors[0];
//           chartJsData.datasets[0].borderColor = backgroundColors[0];
//       }

//       setChartData(chartJsData);
//       setMessage('Chart generated successfully!');
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Chart generation failed.');
//       console.error(error);
//       if (error.response?.status === 401) {
//           navigate('/login');
//       }
//     }
//   };

//   const handleAIAnalysis = async () => {
//     if (!fileId) {
//         setMessage('Please upload a file first.');
//         return;
//     }

//     try {
//         const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//         const token = userInfo?.token;
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//         };

//         setMessage('Generating AI insights...');
//         const { data } = await axios.post('http://localhost:5000/api/ai/insights', { fileId }, config);
        
//         setAiInsights(data.insights);
//         setMessage(data.message);
//     } catch (error) {
//       console.error(error);
//       if (error.response?.status === 401) {
//         navigate('/login');
//       } else if (error.response?.status === 503) {
//         setMessage('The AI model is currently busy. Please try again in a moment.');
//       } else {
//         setMessage(error.response?.data?.message || 'AI analysis failed.');
//       }
//     }
//   };

//   const handleDownload = (format) => {
//     if (!chartRef.current) return;

//     const chartInstance = chartRef.current;
    
//     if (chartType === '3d-bar') {
//       setMessage("3D charts have their own download options.");
//       return;
//     }

//     if (format === 'png') {
//         const image = chartInstance.toBase64Image('image/png', 1);
//         const link = document.createElement('a');
//         link.href = image;
//         link.download = `${chartType}_chart.png`;
//         link.click();
//     } else if (format === 'jpeg') {
//         const image = chartInstance.toBase64Image('image/jpeg', 1);
//         const link = document.createElement('a');
//         link.href = image;
//         link.download = `${chartType}_chart.jpeg`;
//         link.click();
//     } else if (format === 'pdf') {
//         const image = chartInstance.toBase64Image('image/png', 1);
//         const doc = new jsPDF();
//         const imgProps= doc.getImageProperties(image);
//         const pdfWidth = doc.internal.pageSize.getWidth();
//         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//         doc.addImage(image, 'PNG', 0, 0, pdfWidth, pdfHeight);
//         doc.save(`${chartType}_chart.pdf`);
//     }
//   };

//  const renderChart = () => {
//     // Corrected logic for 3D charts
//     if (chartType === '3d-bar' && chartData) {
//         return (
//           <div className="w-full h-96">
//             <Plot
//               data={chartData}
//               layout={{
//                 title: `${selectedYAxis} vs ${selectedXAxis} vs ${selectedZAxis}`,
//                 autosize: true,
//                 scene: {
//                   xaxis: { title: selectedXAxis },
//                   yaxis: { title: selectedYAxis },
//                   zaxis: { title: selectedZAxis },
//                 },
//                 paper_bgcolor: 'transparent',
//                 plot_bgcolor: 'transparent'
//               }}
//               config={{ responsive: true, displaylogo: false }}
//               style={{ width: '100%', height: '100%' }}
//             />
//           </div>
//         );
//     }
    
//     const options = {
//         responsive: true,
//         plugins: {
//             legend: { position: 'top' },
//             title: { display: true, text: `${selectedYAxis} vs ${selectedXAxis}` },
//             datalabels: {
//               display: true,
//               color: theme === 'dark' ? 'white' : 'black',
//               formatter: (value, context) => {
//                 return value;
//               },
//             },
//         },
//         scales: {
//             x: { 
//               title: { 
//                 display: true, 
//                 text: selectedXAxis,
//                 color: theme === 'dark' ? 'white' : 'black',
//               },
//               ticks: {
//                 color: theme === 'dark' ? 'white' : 'black',
//               },
//             },
//             y: { 
//               title: { 
//                 display: true, 
//                 text: selectedYAxis,
//                 color: theme === 'dark' ? 'white' : 'black',
//               },
//               ticks: {
//                 color: theme === 'dark' ? 'white' : 'black',
//               },
//             },
//         },
//     };

//     switch (chartType) {
//       case 'line':
//         return <Line ref={chartRef} data={chartData} options={options} />;
//       case 'pie':
//         return <Pie ref={chartRef} data={chartData} options={{ ...options, scales: {} }} />;
//       case 'doughnut':
//         return <Doughnut ref={chartRef} data={chartData} options={{ ...options, scales: {} }} />;
//       case 'polarArea':
//         return <PolarArea ref={chartRef} data={chartData} options={{ ...options, scales: {} }} />;
//       case 'radar':
//         return <Radar ref={chartRef} data={chartData} options={options} />;
//       case 'bar':
//       default:
//         return <Bar ref={chartRef} data={chartData} options={options} />;
//     }
// };

//   return (
 
//   <div className={`flex flex-col bg-transparent items-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-4`}>
//     <div className={`container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-8`}>
//       {/* Left Column: Upload, Configuration, and Chart */}
//       <div className={`bg-white/30 dark:bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-md border border-white/20`}>
//         <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Insight Canvas </h1>
        
//         {/* 1. File Upload Section */}
//         <div className="border-b pb-4 mb-6">
//           <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">1. Upload Excel File</h2>
//           {/* Draggable File Input */}
//           <div
//             onDragOver={(e) => {
//               e.preventDefault();
//               setIsDragging(true);
//             }}
//             onDragLeave={() => setIsDragging(false)}
//             onDrop={(e) => {
//               e.preventDefault();
//               setIsDragging(false);
//               const files = e.dataTransfer.files;
//               if (files.length > 0) {
//                 setFile(files[0]);
//                 // Clear old state
//                 setHeaders([]);
//                 setSheetNames([]);
//                 setFileId(null);
//                 setSelectedSheet('');
//                 setSelectedXAxis('');
//                 setSelectedYAxis('');
//                 setSelectedZAxis('');
//                 setMessage('');
//                 setChartData(null);
//                 setAiInsights(null);
//               }
//             }}
//             className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}`}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${isDragging ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//             </svg>
//             <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Drag and drop your file here</p>
//             <p className="text-sm text-gray-400 dark:text-gray-500">or</p>
//             <label htmlFor="file-upload" className="relative cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
//               <span>Choose from device</span>
//               <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} className="sr-only" />
//             </label>
//           </div>

//           <form onSubmit={handleUpload} className="mt-4">
//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
//             >
//               Upload
//             </button>
//           </form>
//           {message && <p className="mt-4 text-center text-gray-700 dark:text-gray-300">{message}</p>}
//         </div>

//          {/* 2. Chart Configuration Section */}
//         {headers.length > 0 && (
//           <div>
//             <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">2. Configure Chart</h2>
//             <form onSubmit={handleChartGeneration} className="space-y-4 mb-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="sheetName">Select Worksheet</label>
//                   <select
//                     id="sheetName"
//                     value={selectedSheet}
//                     onChange={(e) => setSelectedSheet(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   >
//                     {sheetNames.map((sheet, index) => (
//                       <option key={index} value={sheet}>{sheet}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="xAxis">Select X-Axis</label>
//                   <select
//                     id="xAxis"
//                     value={selectedXAxis}
//                     onChange={(e) => setSelectedXAxis(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   >
//                     {headers.map((header, index) => (
//                       <option key={index} value={header}>{header}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="yAxis">Select Y-Axis</label>
//                   <select
//                     id="yAxis"
//                     value={selectedYAxis}
//                     onChange={(e) => setSelectedYAxis(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   >
//                     {headers.map((header, index) => (
//                       <option key={index} value={header}>{header}</option>
//                     ))}
//                   </select>
//                 </div>
//                 {chartType === '3d-bar' && (
//                   <div>
//                     <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="zAxis">Select Z-Axis</label>
//                     <select
//                       id="zAxis"
//                       value={selectedZAxis}
//                       onChange={(e) => setSelectedZAxis(e.target.value)}
//                       className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     >
//                       <option value="">-- Select Z-Axis --</option>
//                       {headers.map((header, index) => (
//                         <option key={index} value={header}>{header}</option>
//                       ))}
//                     </select>
//                   </div>
//                 )}
//                 <div>
//                   <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="chartType">Select Chart Type</label>
//                   <select
//                     id="chartType"
//                     value={chartType}
//                     onChange={handleChartTypeChange}
//                     className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   >
//                     {chartTypes.map((type, index) => (
//                       <option key={index} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)} Chart</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
//               >
//                 Generate Chart
//               </button>
//             </form>

//             {chartData && (
//               <div className="mt-6 p-4 border rounded-lg bg-white/50 dark:bg-gray-800/50">
//                 <div className="mb-4">
//                   {renderChart()}
//                 </div>
//                 <div className="flex space-x-2 mt-4">
//                   {chartType !== '3d-bar' && (
//                     <>
//                       <button
//                         onClick={() => handleDownload('png')}
//                         className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
//                       >
//                         Download PNG
//                       </button>
//                       <button
//                         onClick={() => handleDownload('jpeg')}
//                         className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
//                       >
//                         Download JPEG
//                       </button>
//                       <button
//                         onClick={() => handleDownload('pdf')}
//                         className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
//                       >
//                         Download PDF
//                       </button>
//                     </>
//                   )}
//                   {chartType === '3d-bar' && (
//                     <p className="w-full text-center text-gray-600 dark:text-gray-300">
//                       Plotly charts have built-in download buttons on the chart itself.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Right Column: AI Insights */}
//       <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-lg shadow-md border border-white/20 p-8">
//         <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">AI Insights</h2>
//         {fileId ? (
//           <>
//             <button
//               onClick={handleAIAnalysis}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
//             >
//               Get AI Report
//             </button>
//             {aiInsights && (
//               <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto">
//                 <h3 className="font-semibold mb-2">AI Insights:</h3>
//                 <p>{aiInsights}</p>
//               </div>
//             )}
//           </>
//         ) : (
//           <p className="text-gray-600 dark:text-gray-300">Please upload a file to enable AI analysis.</p>
//         )}
//       </div>
//     </div>
//   </div>
// );
// };
// export default UploadForm;


import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement, RadialLinearScale, Filler } from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import { useNavigate, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ThemeContext } from '../context/ThemeContext';

// Register all the components we plan to use for charting and the new plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [message, setMessage] = useState('');
  const [fileId, setFileId] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');
  const [selectedZAxis, setSelectedZAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalChartData, setModalChartData] = useState(null);
  const chartRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [isInsightsExpanded, setIsInsightsExpanded] = useState({
      summary: true, // Start with summary expanded
      trends: false,
      limitations: false,
      recommendations: false,
  });

  const chartTypes = [
    'bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea',
    '3d-bar', '3d-scatter', '3d-surface', '3d-line', '3d-mesh',
    '3d-volume', '3d-isosurface'
  ];

  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const handleFileChange = (e) => {
    const originalFile = e.target.files[0];
    if (!originalFile) return;
    setFile(originalFile);
    setMessage('');
    setHeaders([]);
    setSheetNames([]);
    setFileId(null);
    setSelectedSheet('');
    setSelectedXAxis('');
    setSelectedYAxis('');
    setSelectedZAxis('');
    setChartData(null);
    setAiInsights(null);
  };
  
  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
    setChartData(null);
    setSelectedZAxis('');
  };
  
  const handleClear = () => {
      setFile(null);
      setHeaders([]);
      setSheetNames([]);
      setFileId(null);
      setSelectedSheet('');
      setSelectedXAxis('');
      setSelectedYAxis('');
      setSelectedZAxis('');
      setChartType('bar');
      setChartData(null);
      setAiInsights(null);
      setMessage('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const token = userInfo?.token;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      setMessage('Uploading...');
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);

      setHeaders(data.headers);
      setSheetNames(data.sheetNames);
      setFileId(data.fileId);
      setMessage(data.message);
      
      if (data.sheetNames.length > 0) {
        setSelectedSheet(data.sheetNames[0]);
      }
      if (data.headers.length >= 2) {
        setSelectedXAxis(data.headers[0]);
        setSelectedYAxis(data.headers[1]);
      }
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed.');
      console.error(error);
      if (error.response?.status === 401) {
          navigate('/login');
      }
    }
  };

  const handleChartGeneration = async (e) => {
    e.preventDefault();
    if (!fileId || !selectedSheet || !selectedXAxis || !selectedYAxis) {
      setMessage('Please select all required fields.');
      return;
    }
    if (
      ['3d-scatter', '3d-line', '3d-surface', '3d-mesh', '3d-bar', '3d-volume', '3d-isosurface'].includes(chartType) &&
      !selectedZAxis
    ) {
      setMessage('Please select a Z-Axis for 3D charts.');
      return;
    }

    try {
      const token = userInfo?.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      setMessage('Generating chart...');
      const { data } = await axios.post(
        'http://localhost:5000/api/analyze',
        { fileId, sheetName: selectedSheet, xAxis: selectedXAxis, yAxis: selectedYAxis, zAxis: selectedZAxis, chartType },
        config
      );

      if (
        ['3d-scatter', '3d-line', '3d-surface', '3d-mesh', '3d-bar', '3d-volume', '3d-isosurface'].includes(chartType)
      ) {
        let plotlyData = [];

        switch (chartType) {
          case '3d-scatter':
            plotlyData = [
              {
                x: data.labels,
                y: data.data,
                z: data.zData,
                mode: 'markers',
                type: 'scatter3d',
                marker: { size: 6, color: data.zData, colorscale: 'Viridis', opacity: 0.8 },
              },
            ];
            break;

          case '3d-line':
            plotlyData = [
              {
                x: data.labels,
                y: data.data,
                z: data.zData,
                mode: 'lines+markers',
                type: 'scatter3d',
                line: { color: 'blue', width: 4 },
                marker: { size: 5, color: 'red' },
              },
            ];
            break;

          case '3d-surface': {
            // Convert Z data into 2D grid
            const gridSize = Math.ceil(Math.sqrt(data.zData.length));
            const zMatrix = [];
            for (let i = 0; i < data.zData.length; i += gridSize) {
              zMatrix.push(data.zData.slice(i, i + gridSize));
            }
            plotlyData = [
              {
                z: zMatrix,
                type: 'surface',
                colorscale: 'Viridis',
                contours: { z: { show: true, usecolormap: true } },
              },
            ];
            break;
          }

          case '3d-mesh':
            plotlyData = [
              {
                x: data.labels,
                y: data.data,
                z: data.zData,
                type: 'mesh3d',
                opacity: 0.7,
                color: 'skyblue',
              },
            ];
            break;

          case '3d-bar':
            plotlyData = [
              {
                x: data.labels,
                y: data.data,
                z: data.zData,
                type: 'scatter3d',
                mode: 'markers',
                marker: {
                  size: 10,
                  color: data.data,
                  colorscale: 'Blues',
                  symbol: 'square',
                  opacity: 0.8,
                },
              },
            ];
            break;

          case '3d-volume': {
            const values = data.zData.map((z, i) => data.data[i] * (z || 1));
            plotlyData = [
              {
                x: data.labels,
                y: data.data,
                z: data.zData,
                value: values,
                type: 'volume',
                isomin: Math.min(...values),
                isomax: Math.max(...values),
                opacity: 0.2,
                surface: { count: 20 },
                colorscale: 'Hot',
              },
            ];
            break;
          }

          case '3d-isosurface': {
            const values = data.zData.map((z, i) => data.data[i] * (z || 1));
            plotlyData = [
              {
                x: data.labels,
                y: data.data,
                z: data.zData,
                value: values,
                type: 'isosurface',
                isomin: Math.min(...values),
                isomax: Math.max(...values),
                caps: { x: { show: false }, y: { show: false }, z: { show: false } },
                colorscale: 'Rainbow',
                opacity: 0.6,
              },
            ];
            break;
          }

          default:
            break;
        }

        setModalChartData(plotlyData);
        setShowModal(true);
        setMessage('3D chart generated successfully!');
        return;
      }

      // ✅ Normal 2D ChartJS charts
      const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      const backgroundColors = data.labels.map(() => getRandomColor());
      const chartJsData = {
        labels: data.labels,
        datasets: [
          {
            label: selectedYAxis,
            data: data.data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1,
          },
        ],
      };

      setChartData(chartJsData);
      setMessage('Chart generated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Chart generation failed.');
      console.error(error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleAIAnalysis = async (fileIdToAnalyze) => {
    if (!fileIdToAnalyze) {
      setMessage('Please upload a file first.');
      return;
    }

    try {
      const token = userInfo?.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      setMessage('Generating AI insights...');
      const { data } = await axios.post('http://localhost:5000/api/ai/insights', { fileId: fileIdToAnalyze }, config);
      
      setAiInsights(data.insights);
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 503) {
        setMessage('The AI model is currently busy. Please try again in a moment.');
      } else {
        setMessage(error.response?.data?.message || 'AI analysis failed.');
      }
    }
  };

  const handleDownload = (format) => {
    if (!chartRef.current) return;

    const chartInstance = chartRef.current;
    
    if (['3d-bar', '3d-scatter', '3d-surface', '3d-line', '3d-mesh', '3d-volume', '3d-isosurface'].includes(chartType)) {
      setMessage("3D charts have their own download options.");
      return;
    }

    if (format === 'png') {
      const image = chartInstance.toBase64Image('image/png', 1);
      const link = document.createElement('a');
      link.href = image;
      link.download = `${chartType}_chart.png`;
      link.click();
    } else if (format === 'jpeg') {
      const image = chartInstance.toBase64Image('image/jpeg', 1);
      const link = document.createElement('a');
      link.href = image;
      link.download = `${chartType}_chart.jpeg`;
      link.click();
    } else if (format === 'pdf') {
      const image = chartInstance.toBase64Image('image/png', 1);
      const doc = new jsPDF();
      const imgProps= doc.getImageProperties(image);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(image, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save(`${chartType}_chart.pdf`);
    }
  };

  const renderChart = () => {
    if (['3d-bar', '3d-scatter', '3d-surface', '3d-line', '3d-mesh', '3d-volume', '3d-isosurface'].includes(chartType)) {
      return null;
    }
    
    const options = {
      responsive: true,
      plugins: {
          legend: { position: 'top' },
          title: { display: true, text: `${selectedYAxis} vs ${selectedXAxis}` },
          datalabels: {
            display: true,
            color: theme === 'dark' ? 'white' : 'black',
            formatter: (value, context) => {
              return value;
            },
          },
      },
      scales: {
          x: { 
            title: { 
              display: true, 
              text: selectedXAxis,
              color: theme === 'dark' ? 'white' : 'black',
            },
            ticks: {
              color: theme === 'dark' ? 'white' : 'black',
            },
          },
          y: { 
            title: { 
              display: true, 
              text: selectedYAxis,
              color: theme === 'dark' ? 'white' : 'black',
            },
            ticks: {
              color: theme === 'dark' ? 'white' : 'black',
            },
          },
      },
    };

    switch (chartType) {
      case 'line':
        return <Line ref={chartRef} data={chartData} options={options} />;
      case 'pie':
        return <Pie ref={chartRef} data={chartData} options={{ ...options, scales: {} }} />;
      case 'doughnut':
        return <Doughnut ref={chartRef} data={chartData} options={{ ...options, scales: {} }} />;
      case 'polarArea':
        return <PolarArea ref={chartRef} data={chartData} options={{ ...options, scales: {} }} />;
      case 'radar':
        return <Radar ref={chartRef} data={chartData} options={options} />;
      case 'bar':
      default:
        return <Bar ref={chartRef} data={chartData} options={options} />;
    }
  };
  
  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-11/12 md:w-3/4 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">3D Chart Visualization</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
  
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
        handleFileChange({ target: { files: [droppedFile] } });
    }
  };

  const handleDragOver = (e) => {
      e.preventDefault();
  };
  
  const renderAiInsights = () => {
    if (!aiInsights) return null;
    const insightsData = {};
    const parts = aiInsights.split('##').slice(1);
    parts.forEach(part => {
      const [title, ...content] = part.split('**');
      insightsData[title.trim()] = content.join('**').trim();
    });

    const renderCollapsibleInsights = (title, content, sectionKey) => (
        <div className="border border-white/20 rounded-lg overflow-hidden my-2">
            <button
                onClick={() => setIsInsightsExpanded(prevState => ({ ...prevState, [sectionKey]: !prevState[sectionKey] }))}
                className="w-full text-left p-4 bg-white/10 text-lg font-semibold flex justify-between items-center text-gray-800 dark:text-white"
            >
                {title}
                <span className="transform transition-transform duration-300">
                    {isInsightsExpanded[sectionKey] ? '−' : '﹢'}
                </span>
            </button>
            {isInsightsExpanded[sectionKey] && (
                <div className="p-4 text-gray-700 dark:text-gray-300 bg-white/5">
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            )}
        </div>
    );
    
    return (
        <div className="text-left">
            {renderCollapsibleInsights(
                'AI Insights Summary',
                insightsData['AI Insights:'] || '',
                'summary'
            )}
            {renderCollapsibleInsights(
                'Key Insights & Trends',
                insightsData['Key Insights & Trends'] || '',
                'trends'
            )}
            {renderCollapsibleInsights(
                'Limitations',
                insightsData['Limitations'] || '',
                'limitations'
            )}
            {renderCollapsibleInsights(
                'Recommendations',
                insightsData['Recommendations'] || '',
                'recommendations'
            )}
        </div>
    );
  };
  
  const handleWorksheetChange = (e) => {
    const newWorksheet = e.target.value;
    setSelectedSheet(newWorksheet);
    setHeaders(fileContent.headers[newWorksheet]);
    setSelectedXAxis('');
    setSelectedYAxis('');
    setSelectedZAxis('');
    setChartData(null);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">Upload & Analyze</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Upload, Configuration, and Chart */}
        <div>
          <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                {fileId ? '2. Configure Chart' : '1. Upload Excel File'}
            </h2>
            
            {!fileId ? (
                <div>
                  <div
                      className={`border-dashed border-2 border-gray-400 dark:border-gray-600 p-6 rounded-lg text-center transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900' : 'bg-transparent'}`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragEnter={() => setIsDragging(true)}
                      onDragLeave={() => setIsDragging(false)}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`mx-auto h-12 w-12 ${isDragging ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">Drag and drop your file here</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">or</p>
                      <label htmlFor="file-upload" className="relative cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                          <span>Choose from device</span>
                          <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} className="sr-only" />
                      </label>
                  </div>
                  <form onSubmit={handleUpload} className="mt-4">
                      <button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                          Upload
                      </button>
                  </form>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="sheetName">Select Worksheet</label>
                            <select value={selectedSheet} onChange={handleWorksheetChange} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                {sheetNames.map((sheet, index) => <option key={index} value={sheet}>{sheet}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="xAxis">Select X-Axis</label>
                            <select value={selectedXAxis} onChange={(e) => setSelectedXAxis(e.target.value)} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Select X-Axis</option>
                                {headers.map((header, index) => <option key={index} value={header}>{header}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="yAxis">Select Y-Axis</label>
                            <select value={selectedYAxis} onChange={(e) => setSelectedYAxis(e.target.value)} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="">Select Y-Axis</option>
                                {headers.map((header, index) => <option key={index} value={header}>{header}</option>)}
                            </select>
                        </div>
                        {['3d-bar', '3d-scatter', '3d-surface', '3d-line', '3d-mesh', '3d-volume', '3d-isosurface'].includes(chartType) && (
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="zAxis">Select Z-Axis</label>
                            <select value={selectedZAxis} onChange={(e) => setSelectedZAxis(e.target.value)} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                              <option value="">Select Z-Axis</option>
                              {headers.map((header, index) => <option key={index} value={header}>{header}</option>)}
                            </select>
                          </div>
                        )}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="chartType">Select Chart Type</label>
                            <select value={chartType} onChange={handleChartTypeChange} className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                {chartTypes.map((type, index) => <option key={index} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)} Chart</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <button onClick={handleChartGeneration} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50" disabled={!selectedXAxis || !selectedYAxis}>
                            Generate Chart
                        </button>
                        <button onClick={handleClear} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Clear
                        </button>
                    </div>
                </div>
            )}
            {message && <p className="mt-4 text-center text-gray-600 dark:text-gray-400">{message}</p>}
          </div>

          {/* Chart Section */}
          {chartData && (
              <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-white/20 mt-8">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Chart Visualization</h2>
                  <div className="h-96 flex items-center justify-center">
                      {renderChart()}
                  </div>
                  {['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea'].includes(chartType) && (
                      <div className="flex space-x-2 mt-4">
                          <button onClick={() => handleDownload('png')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                              PNG
                          </button>
                          <button onClick={() => handleDownload('jpeg')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                              JPEG
                          </button>
                          <button onClick={() => handleDownload('pdf')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H6zm1 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                              PDF
                          </button>
                      </div>
                  )}
                  {['3d-bar', '3d-scatter', '3d-surface', '3d-line', '3d-mesh', '3d-volume', '3d-isosurface'].includes(chartType) && (
                      <p className="w-full text-center text-gray-600 dark:text-gray-300 mt-4">
                          Plotly charts have built-in download buttons on the chart itself.
                      </p>
                  )}
              </div>
          )}
        </div>
        
        {/* Right Column: AI Insights */}
        <div>
          <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">AI Insights</h2>
            {aiInsights ? (
              <div className="mt-4 p-4 bg-white/5 dark:bg-gray-800/50 rounded-lg text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto">
                <h3 className="font-semibold mb-2">AI Insights:</h3>
                <p>{aiInsights}</p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">Please upload a file to enable AI analysis.</p>
            )}
            <button
                onClick={() => handleAIAnalysis(fileId)}
                disabled={!fileId}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Get AI Report
            </button>
          </div>
        </div>
      </div>
      
      {showModal && modalChartData && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="h-96">
            <Plot
              data={modalChartData}
              layout={{
                title: `${selectedYAxis} vs ${selectedXAxis}${selectedZAxis ? ` vs ${selectedZAxis}` : ''}`,
                autosize: true,
                scene: {
                  xaxis: { title: selectedXAxis },
                  yaxis: { title: selectedYAxis },
                  zaxis: { title: selectedZAxis },
                },
                paper_bgcolor: theme === 'dark' ? '#1f2937' : '#ffffff',
                plot_bgcolor: theme === 'dark' ? '#1f2937' : '#ffffff',
                font: {
                    color: theme === 'dark' ? 'white' : 'black',
                }
              }}
              config={{ responsive: true, displaylogo: false }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
export default UploadForm;
