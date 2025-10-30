import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble-sort');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [data, setData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize with random data
  useEffect(() => {
    generateRandomData();
  }, []);

  const generateRandomData = () => {
    // Reduce array size for better visualization - no scrolling needed
    const isMobile = window.innerWidth < 768;
    const arrayLength = isMobile ? 10 : 15;
    const newData = Array.from({ length: arrayLength }, () => 
      Math.floor(Math.random() * 100) + 10
    );
    setData(newData);
  };

  const handleAlgorithmSelect = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setIsPlaying(false);
    generateRandomData();
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handlePlayPause = () => {
    console.log('Play/Pause clicked, current isPlaying:', isPlaying);
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const handleReset = () => {
    console.log('Reset clicked');
    setIsPlaying(false); // Stop any running animations
    // Small delay to ensure animation stops before generating new data
    setTimeout(() => {
      generateRandomData();
    }, 100);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 transition-all duration-500 flex flex-col">
        <Header 
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        
        <div className="flex flex-1 min-h-0">
          <Sidebar 
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmSelect={handleAlgorithmSelect}
            isOpen={isSidebarOpen}
            onClose={handleCloseSidebar}
          />
          
          <MainContent 
            algorithm={selectedAlgorithm}
            data={data}
            isPlaying={isPlaying}
            speed={speed}
            onSpeedChange={handleSpeedChange}
            onPlayPause={handlePlayPause}
            onDataChange={setData}
            onGenerateData={handleReset}
          />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
