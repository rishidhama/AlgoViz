import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble-sort');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [data, setData] = useState([]);

  // Initialize with random data
  useEffect(() => {
    generateRandomData();
  }, []);

  const generateRandomData = () => {
    const newData = Array.from({ length: 20 }, () => 
      Math.floor(Math.random() * 100) + 10
    );
    setData(newData);
  };

  const handleAlgorithmSelect = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setIsPlaying(false);
    generateRandomData();
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
      <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 transition-all duration-500 flex flex-col overflow-hidden">
        <Header 
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          speed={speed}
          onSpeedChange={handleSpeedChange}
          onGenerateData={handleReset}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmSelect={handleAlgorithmSelect}
          />
          
          <MainContent 
            algorithm={selectedAlgorithm}
            data={data}
            isPlaying={isPlaying}
            speed={speed}
            onDataChange={setData}
            onGenerateData={handleReset}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
