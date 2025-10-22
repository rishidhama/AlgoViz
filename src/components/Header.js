import React from 'react';
import { Play, Pause, RotateCcw, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ isPlaying, onPlayPause, speed, onSpeedChange, onGenerateData }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-md shadow-xl border-b border-gray-200/50 dark:border-dark-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AlgoViz
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Interactive Algorithm Visualizer</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Speed Control */}
            <div className="flex items-center space-x-3 bg-gray-100 dark:bg-dark-700 rounded-xl px-4 py-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Speed:
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={speed}
                onChange={(e) => onSpeedChange(parseInt(e.target.value))}
                className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((speed - 50) / (500 - 50)) * 100}%, #e5e7eb ${((speed - 50) / (500 - 50)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 font-mono">
                {speed}ms
              </span>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={onPlayPause}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onGenerateData}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <RotateCcw size={20} />
              <span>Reset</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
