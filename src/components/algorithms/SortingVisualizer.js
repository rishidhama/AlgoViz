import React, { useState, useEffect, useCallback, useRef } from 'react';

const SortingVisualizer = ({ algorithm, data, isPlaying, speed, onDataChange, onReset }) => {
  const [array, setArray] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [animationSteps, setAnimationSteps] = useState([]);
  const isPlayingRef = useRef(isPlaying);

  // Initialize array when data changes
  useEffect(() => {
    const formattedArray = data.map((value, index) => ({
      value,
      index,
      comparing: false,
      sorted: false,
      selected: false
    }));
    setArray(formattedArray);
    setCurrentStep(0);
    setTotalSteps(0);
    setComparisons(0);
    setSwaps(0);
    setIsAnimating(false);
    setAnimationSteps([]);
  }, [data]);

  // Generate sorting steps
  const generateSortingSteps = useCallback(() => {
    const steps = [];
    const arr = [...data];
    let comps = 0;
    let swapCount = 0;

    const addStep = (type, indices, values = null) => {
      steps.push({ type, indices, values });
    };

    switch (algorithm) {
      case 'bubble-sort':
        for (let i = 0; i < arr.length - 1; i++) {
          for (let j = 0; j < arr.length - 1 - i; j++) {
            addStep('compare', [j, j + 1]);
            comps++;
            if (arr[j] > arr[j + 1]) {
              addStep('swap', [j, j + 1], [arr[j + 1], arr[j]]);
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              swapCount++;
            }
          }
          addStep('sorted', [arr.length - 1 - i]);
        }
        addStep('sorted', [0]);
        break;

      case 'selection-sort':
        for (let i = 0; i < arr.length - 1; i++) {
          let minIdx = i;
          addStep('select', [i]);
          for (let j = i + 1; j < arr.length; j++) {
            addStep('compare', [minIdx, j]);
            comps++;
            if (arr[j] < arr[minIdx]) {
              minIdx = j;
            }
          }
          if (minIdx !== i) {
            addStep('swap', [i, minIdx], [arr[minIdx], arr[i]]);
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            swapCount++;
          }
          addStep('sorted', [i]);
        }
        addStep('sorted', [arr.length - 1]);
        break;

      case 'insertion-sort':
        for (let i = 1; i < arr.length; i++) {
          let current = arr[i];
          let j = i - 1;
          addStep('select', [i]);
          while (j >= 0 && arr[j] > current) {
            addStep('compare', [j, j + 1]);
            comps++;
            addStep('swap', [j + 1], [arr[j]]);
            arr[j + 1] = arr[j];
            swapCount++;
            j--;
          }
          addStep('swap', [j + 1], [current]);
          arr[j + 1] = current;
          swapCount++;
          addStep('sorted', [i]);
        }
        break;




      default:
        for (let i = 0; i < arr.length; i++) {
          addStep('sorted', [i]);
        }
        break;
    }

    setTotalSteps(steps.length);
    setComparisons(comps);
    setSwaps(swapCount);
    setAnimationSteps(steps);
    return steps;
  }, [algorithm, data]);

  // Update ref when isPlaying changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Simple animation control
  useEffect(() => {
    console.log('isPlaying changed:', isPlaying);
    if (isPlaying) {
      if (animationSteps.length === 0) {
        const steps = generateSortingSteps();
        if (steps.length === 0) return;
      }
      
      setIsAnimating(true);
      setCurrentStep(0);
      
      const animate = async () => {
        const steps = animationSteps.length > 0 ? animationSteps : generateSortingSteps();
        
        for (let i = 0; i < steps.length; i++) {
          // Check isPlaying state before each step using ref
          if (!isPlayingRef.current) {
            console.log('Animation paused at step', i);
            break;
          }

          const step = steps[i];
          setCurrentStep(i + 1);

          setArray(prev => {
            const newArray = [...prev];
            
            // Clear all states first
            newArray.forEach(item => {
              item.comparing = false;
              item.selected = false;
            });
            
            switch (step.type) {
              case 'compare':
                step.indices.forEach(idx => {
                  newArray[idx].comparing = true;
                });
                break;
              case 'swap':
                if (step.values) {
                  step.indices.forEach((idx, i) => {
                    if (step.values[i] !== undefined) {
                      newArray[idx].value = step.values[i];
                    }
                  });
                }
                break;
              case 'select':
                step.indices.forEach(idx => {
                  newArray[idx].selected = true;
                });
                break;
              case 'sorted':
                step.indices.forEach(idx => {
                  newArray[idx].sorted = true;
                });
                break;
              default:
                break;
            }
            
            return newArray;
          });

          await new Promise(resolve => setTimeout(resolve, speed));
        }
        
        setIsAnimating(false);
        console.log('Animation finished');
      };

      animate();
    } else {
      setIsAnimating(false);
    }
  }, [isPlaying, speed]);

  const maxValue = Math.max(...array.map(item => item.value));
  const containerHeight = 200;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-600 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap gap-4 items-center justify-end">
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white dark:bg-dark-800 px-3 py-2 rounded-lg shadow-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Comparisons:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{comparisons}</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-dark-800 px-3 py-2 rounded-lg shadow-md">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Swaps:</span>
              <span className="font-mono text-red-600 dark:text-red-400 font-bold">{swaps}</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-dark-800 px-3 py-2 rounded-lg shadow-md">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Step:</span>
              <span className="font-mono text-green-600 dark:text-green-400 font-bold">{currentStep}/{totalSteps}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-700 dark:to-dark-800 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-end justify-center space-x-1 h-[250px] p-3 bg-white/50 dark:bg-dark-600/50 rounded-xl backdrop-blur-sm">
          {array.map((item, index) => {
            const height = maxValue > 0 ? (item.value / maxValue) * containerHeight : 10;
            const minHeight = 10;
            const finalHeight = Math.max(height, minHeight);

            let barColor = 'bg-gradient-to-t from-blue-500 to-blue-400';
            if (item.comparing) barColor = 'bg-gradient-to-t from-yellow-500 to-yellow-400 animate-pulse';
            if (item.sorted) barColor = 'bg-gradient-to-t from-green-500 to-green-400';
            if (item.selected) barColor = 'bg-gradient-to-t from-orange-500 to-orange-400 animate-pulse';

            return (
              <div key={index} className="flex flex-col items-center space-y-2 group">
                <div
                  className={`w-8 rounded-t-lg transition-all duration-300 ease-out flex items-end justify-center text-xs font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-110 ${barColor}`}
                  style={{ height: `${finalHeight}px` }}
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

      {/* Legend */}
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Visual Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg shadow-md"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Normal</span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-3 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-lg shadow-md animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Comparing</span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-3 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-t from-green-500 to-green-400 rounded-lg shadow-md"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Sorted</span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-3 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-t from-orange-500 to-orange-400 rounded-lg shadow-md animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;