import React, { useState, useEffect, useCallback, useRef } from 'react';

const SearchingVisualizer = ({ algorithm, data, isPlaying, speed, targetValue, onReset }) => {
  const [array, setArray] = useState([...data]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [found, setFound] = useState(false);
  const [foundIndex, setFoundIndex] = useState(-1);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    const sortedData = [...data].sort((a, b) => a - b);
    setArray(sortedData);
    setComparisons(0);
    setFound(false);
    setFoundIndex(-1);
    setIsAnimating(false);
  }, [data]);

  // Update ref when isPlaying changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Reset function
  const handleReset = () => {
    setArray([...data].sort((a, b) => a - b));
    setComparisons(0);
    setFound(false);
    setFoundIndex(-1);
    setIsAnimating(false);
    if (onReset) {
      onReset();
    }
  };

  // Animation effect - responds to isPlaying from parent
  useEffect(() => {
    console.log('SearchingVisualizer - isPlaying changed:', isPlaying);
    if (!isPlaying) {
      setIsAnimating(false);
      return;
    }

    if (isAnimating) return; // Prevent multiple animations from starting

    const steps = generateAnimations();
    console.log('SearchingVisualizer - Generated steps:', steps);
    if (steps.length === 0) {
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);

    const animate = async () => {
      for (let i = 0; i < steps.length; i++) {
        if (!isPlayingRef.current) break; // Stop if isPlaying becomes false

        const animation = steps[i];
        console.log('SearchingVisualizer - Executing animation step:', animation);
        
        switch (animation.type) {
          case 'check':
            setArray(prev => prev.map((item, idx) => ({
              ...item,
              checking: animation.index === idx || (animation.indices && animation.indices.includes(idx)),
              found: false,
              notFound: false
            })));
            break;
          case 'found':
            setArray(prev => prev.map((item, idx) => ({
              ...item,
              found: idx === animation.index,
              checking: false
            })));
            break;
          case 'not-found':
            setArray(prev => prev.map(item => ({
              ...item,
              notFound: true,
              checking: false
            })));
            break;
          case 'range':
            setArray(prev => prev.map((item, idx) => ({
              ...item,
              inRange: idx >= animation.left && idx <= animation.right,
              checking: false
            })));
            break;
          case 'move-left':
          case 'move-right':
          case 'move-center':
            setArray(prev => prev.map((item, idx) => ({
              ...item,
              inRange: idx >= animation.left && idx <= animation.right,
              checking: false
            })));
            break;
          default:
            break;
        }

        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      setIsAnimating(false);
    };
    animate();
  }, [isPlaying, speed]);

  const generateAnimations = useCallback(() => {
    // Extract raw values from array for searching
    const rawArray = array.map(item => typeof item === 'object' ? item.value : item);
    let result;

    switch (algorithm) {
      case 'linear-search':
        result = linearSearch(rawArray, targetValue);
        break;
      case 'binary-search':
        result = binarySearch(rawArray, targetValue);
        break;
      // ternary-search removed
      case 'kmp':
        result = kmpSearch();
        break;
      case 'rabin-karp':
        result = rabinKarpSearch();
        break;
      case 'z-algorithm':
        result = zAlgorithmSearch();
        break;
      default:
        result = { animations: [], comparisons: 0, found: false, foundIndex: -1 };
    }

    setComparisons(result.comparisons);
    setFound(result.found);
    setFoundIndex(result.foundIndex);
    return result.animations;
  }, [algorithm, array, targetValue]);

  const linearSearch = (arr, target) => {
    const animations = [];
    let comparisons = 0;
    let found = false;
    let foundIndex = -1;

    console.log('Linear search - Array:', arr, 'Target:', target);

    for (let i = 0; i < arr.length; i++) {
      comparisons++;
      animations.push({ type: 'check', index: i });
      
      if (arr[i] === target) {
        found = true;
        foundIndex = i;
        animations.push({ type: 'found', index: i });
        break;
      }
    }

    if (!found) {
      animations.push({ type: 'not-found' });
    }

    console.log('Linear search result:', { animations, comparisons, found, foundIndex });
    return { animations, comparisons, found, foundIndex };
  };

  const binarySearch = (arr, target) => {
    const animations = [];
    let comparisons = 0;
    let found = false;
    let foundIndex = -1;
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      comparisons++;
      
      animations.push({ type: 'check', index: mid });
      animations.push({ type: 'range', left, right });
      
      if (arr[mid] === target) {
        found = true;
        foundIndex = mid;
        animations.push({ type: 'found', index: mid });
        break;
      } else if (arr[mid] < target) {
        left = mid + 1;
        animations.push({ type: 'move-right', left, right });
      } else {
        right = mid - 1;
        animations.push({ type: 'move-left', left, right });
      }
    }

    if (!found) {
      animations.push({ type: 'not-found' });
    }

    return { animations, comparisons, found, foundIndex };
  };

  // ternary-search implementation removed

  // String algorithms use a built-in sample text/pattern for visualization
  const getSampleTP = () => {
    const text = 'ABABDABACDABABCABAB';
    const pattern = 'ABABCABAB';
    return { text, pattern };
  };

  const kmpSearch = () => {
    const { text, pattern } = getSampleTP();
    const animations = [];
    let comparisons = 0;

    // Build LPS array
    const lps = new Array(pattern.length).fill(0);
    for (let i = 1, len = 0; i < pattern.length;) {
      if (pattern[i] === pattern[len]) {
        lps[i++] = ++len;
      } else if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i++] = 0;
      }
    }

    // Search
    for (let i = 0, j = 0; i < text.length;) {
      comparisons++;
      animations.push({ type: 'check', index: i });
      if (text[i] === pattern[j]) {
        i++; j++;
        if (j === pattern.length) {
          animations.push({ type: 'found', index: i - j });
          j = lps[j - 1];
        }
      } else {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
    }
    return { animations, comparisons, found: animations.some(a => a.type === 'found'), foundIndex: -1 };
  };

  const rabinKarpSearch = () => {
    const { text, pattern } = getSampleTP();
    const animations = [];
    let comparisons = 0;
    const d = 256;
    const q = 101; // prime
    const m = pattern.length;
    const n = text.length;
    let p = 0, t = 0, h = 1;
    for (let i = 0; i < m - 1; i++) h = (h * d) % q;
    for (let i = 0; i < m; i++) {
      p = (d * p + pattern.charCodeAt(i)) % q;
      t = (d * t + text.charCodeAt(i)) % q;
    }
    for (let i = 0; i <= n - m; i++) {
      animations.push({ type: 'range', left: i, right: i + m - 1 });
      if (p === t) {
        let match = true;
        for (let j = 0; j < m; j++) {
          comparisons++;
          animations.push({ type: 'check', index: i + j });
          if (text[i + j] !== pattern[j]) { match = false; break; }
        }
        if (match) animations.push({ type: 'found', index: i });
      }
      if (i < n - m) {
        t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + 1 * 1 + (m - 1))) % q;
        if (t < 0) t += q;
      }
    }
    return { animations, comparisons, found: animations.some(a => a.type === 'found'), foundIndex: -1 };
  };

  const zAlgorithmSearch = () => {
    const { text, pattern } = getSampleTP();
    const s = pattern + '$' + text;
    const n = s.length;
    const z = new Array(n).fill(0);
    const animations = [];
    let comparisons = 0;
    for (let i = 1, l = 0, r = 0; i < n; i++) {
      if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
      while (i + z[i] < n && s[z[i]] === s[i + z[i]]) { z[i]++; comparisons++; animations.push({ type: 'check', index: i + z[i] }); }
      if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
    }
    for (let i = 0; i < n; i++) {
      if (z[i] === pattern.length) {
        const pos = i - pattern.length - 1;
        animations.push({ type: 'found', index: pos });
      }
    }
    return { animations, comparisons, found: animations.some(a => a.type === 'found'), foundIndex: -1 };
  };


  const formatArray = (arr) => {
    return arr.map((item, index) => {
      if (typeof item === 'number') {
        return { 
          value: item, 
          checking: false, 
          found: false, 
          notFound: false,
          inRange: true 
        };
      }
      return item;
    });
  };

  const displayArray = formatArray(array);
  // Calculate maxValue from the original data to ensure consistent heights
  const maxValue = Math.max(...data);
  const containerHeight = 200;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-600 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap gap-4 items-center justify-end">
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white dark:bg-dark-800 px-3 py-2 rounded-lg shadow-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Target:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{targetValue}</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-dark-800 px-3 py-2 rounded-lg shadow-md">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Comparisons:</span>
              <span className="font-mono text-red-600 dark:text-red-400 font-bold">{comparisons}</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-dark-800 px-3 py-2 rounded-lg shadow-md">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Result:</span>
              <span className={`font-mono font-bold ${found ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {found ? `Found at ${foundIndex}` : 'Not Found'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-700 dark:to-dark-800 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-end justify-center space-x-1 h-[250px] p-3 bg-white/50 dark:bg-dark-600/50 rounded-xl backdrop-blur-sm relative">
          {displayArray.map((item, index) => {
            const height = maxValue > 0 ? (item.value / maxValue) * containerHeight : 10;
            const minHeight = 10;
            const finalHeight = Math.max(height, minHeight);
            
            let barColor = 'bg-gradient-to-t from-blue-500 to-blue-400';
            if (item.found) barColor = 'bg-gradient-to-t from-green-500 to-green-400 animate-pulse';
            else if (item.checking) barColor = 'bg-gradient-to-t from-yellow-500 to-yellow-400 animate-bounce';
            else if (item.notFound) barColor = 'bg-gradient-to-t from-red-500 to-red-400';
            else if (!item.inRange) barColor = 'bg-gradient-to-t from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700';
            else barColor = 'bg-gradient-to-t from-blue-500 to-blue-400';

            return (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 group"
              >
                <div
                  className={`w-8 rounded-t-lg transition-all duration-500 ease-out flex items-end justify-center text-xs font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-110 ${barColor}`}
                  style={{ 
                    height: `${finalHeight}px`
                  }}
                >
                  <span className="transform -rotate-90 whitespace-nowrap mb-2">
                    {item.value}
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-700 px-2 py-1 rounded-full shadow-sm">
                  {index}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Process Info */}
      {algorithm === 'binary-search' || algorithm === 'ternary-search' ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {algorithm === 'binary-search' ? 'Binary Search Process' : 'Ternary Search Process'}
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {algorithm === 'binary-search' 
              ? 'The array is divided into two halves at each step, eliminating half of the remaining elements.'
              : 'The array is divided into three parts at each step, eliminating two-thirds of the remaining elements.'
            }
          </p>
        </div>
      ) : null}

      {/* Legend */}
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Visual Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg shadow-md"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 p-3 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-t from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 rounded-lg shadow-md"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Eliminated</span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-3 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-lg shadow-md animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Checking</span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-3 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-t from-green-500 to-green-400 rounded-lg shadow-md animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Found</span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-3 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-t from-red-500 to-red-400 rounded-lg shadow-md"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Not Found</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchingVisualizer;
