import React, { useState, useEffect, useCallback, useRef } from 'react';

const SortingVisualizer = ({ algorithm, data, isPlaying, speed, onDataChange, onReset }) => {
  const [array, setArray] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [animationSteps, setAnimationSteps] = useState([]);
  const isPlayingRef = useRef(isPlaying);
  const finishedRef = useRef(false);

  // Initialize array when data changes
  useEffect(() => {
    const formattedArray = data.map((value, index) => ({
      value,
      index,
      comparing: false,
      sorted: false,
      selected: false,
      pivot: false
    }));
    setArray(formattedArray);
    setCurrentStep(0);
    setTotalSteps(0);
    setComparisons(0);
    setSwaps(0);
    setIsAnimating(false);
    setAnimationSteps([]);
    finishedRef.current = false;
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

      case 'merge-sort':
        const mergeSort = (arr, left, right) => {
          if (left < right) {
            const mid = Math.floor((left + right) / 2);
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
          }
        };

        const merge = (arr, left, mid, right) => {
          const leftArr = arr.slice(left, mid + 1);
          const rightArr = arr.slice(mid + 1, right + 1);
          let i = 0, j = 0, k = left;

          while (i < leftArr.length && j < rightArr.length) {
            addStep('compare', [left + i, mid + 1 + j]);
            comps++;
            if (leftArr[i] <= rightArr[j]) {
              addStep('swap', [k], [leftArr[i]]);
              arr[k] = leftArr[i];
              swapCount++;
              i++;
            } else {
              addStep('swap', [k], [rightArr[j]]);
              arr[k] = rightArr[j];
              swapCount++;
              j++;
            }
            k++;
          }

          while (i < leftArr.length) {
            addStep('swap', [k], [leftArr[i]]);
            arr[k] = leftArr[i];
            swapCount++;
            i++;
            k++;
          }

          while (j < rightArr.length) {
            addStep('swap', [k], [rightArr[j]]);
            arr[k] = rightArr[j];
            swapCount++;
            j++;
            k++;
          }
        };

        mergeSort(arr, 0, arr.length - 1);
        // Mark all as sorted at the end
        for (let i = 0; i < arr.length; i++) {
          addStep('sorted', [i]);
        }
        break;

      case 'quick-sort':
        const quickSort = (arr, low, high) => {
          if (low < high) {
            const pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
          }
        };

        const partition = (arr, low, high) => {
          const pivot = arr[high];
          addStep('pivot', [high]);
          let i = low - 1;

          for (let j = low; j < high; j++) {
            addStep('compare', [j, high]);
            comps++;
            if (arr[j] <= pivot) {
              i++;
              if (i !== j) {
                addStep('swap', [i, j], [arr[j], arr[i]]);
                [arr[i], arr[j]] = [arr[j], arr[i]];
                swapCount++;
              }
            }
          }
          
          if (i + 1 !== high) {
            addStep('swap', [i + 1, high], [arr[high], arr[i + 1]]);
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            swapCount++;
          }
          
          addStep('sorted', [i + 1]);
          return i + 1;
        };

        quickSort(arr, 0, arr.length - 1);
        // Mark remaining elements as sorted
        for (let i = 0; i < arr.length; i++) {
          addStep('sorted', [i]);
        }
        break;

      case 'heap-sort':
        const heapSort = (arr) => {
          const n = arr.length;
          
          // Build max heap
          for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arr, n, i);
          }
          
          // Extract elements from heap one by one
          for (let i = n - 1; i > 0; i--) {
            addStep('swap', [0, i], [arr[i], arr[0]]);
            [arr[0], arr[i]] = [arr[i], arr[0]];
            swapCount++;
            addStep('sorted', [i]);
            heapify(arr, i, 0);
          }
          addStep('sorted', [0]);
        };

        const heapify = (arr, n, i) => {
          let largest = i;
          const left = 2 * i + 1;
          const right = 2 * i + 2;

          if (left < n) {
            addStep('compare', [left, largest]);
            comps++;
            if (arr[left] > arr[largest]) {
              largest = left;
            }
          }

          if (right < n) {
            addStep('compare', [right, largest]);
            comps++;
            if (arr[right] > arr[largest]) {
              largest = right;
            }
          }

          if (largest !== i) {
            addStep('swap', [i, largest], [arr[largest], arr[i]]);
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            swapCount++;
            heapify(arr, n, largest);
          }
        };

        heapSort(arr);
        break;

      default:
        for (let i = 0; i < arr.length; i++) {
          addStep('sorted', [i]);
        }
        break;
    }

    return { steps, comps, swapCount };
  }, [algorithm, data]);

  // Update ref when isPlaying changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Simple animation control
  useEffect(() => {
    console.log('isPlaying changed:', isPlaying);
    if (!isPlaying) {
      setIsAnimating(false);
      return;
    }

    // Prevent multiple concurrent animations or reruns after finishing
    if (isAnimating || finishedRef.current) return;

    setIsAnimating(true);

    const animate = async () => {
      // Always generate fresh steps when starting
      const { steps, comps, swapCount } = generateSortingSteps();

      if (steps.length === 0) {
        setIsAnimating(false);
        return;
      }

      // Initialize playback state once before the loop
      setAnimationSteps(steps);
      setComparisons(comps);
      setSwaps(swapCount);
      setTotalSteps(steps.length);
      setCurrentStep(0);

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

          // Clear all transient states first
          newArray.forEach(item => {
            item.comparing = false;
            item.selected = false;
            item.pivot = false;
          });

          switch (step.type) {
            case 'compare':
              step.indices.forEach(idx => {
                newArray[idx].comparing = true;
              });
              break;
            case 'swap':
              if (step.values) {
                step.indices.forEach((idx, vi) => {
                  if (step.values[vi] !== undefined) {
                    newArray[idx].value = step.values[vi];
                  }
                });
              }
              break;
            case 'select':
              step.indices.forEach(idx => {
                newArray[idx].selected = true;
              });
              break;
            case 'pivot':
              step.indices.forEach(idx => {
                newArray[idx].pivot = true;
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
      finishedRef.current = true;
      setCurrentStep(steps.length);
      console.log('Animation finished');
    };

    animate();
  }, [isPlaying, speed, isAnimating, generateSortingSteps]);

  const maxValue = Math.max(...array.map(item => item.value));
  const containerHeight = 220;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-600 rounded-2xl p-3 sm:p-4 shadow-lg">
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-end">
          <div className="flex flex-wrap gap-2 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2 bg-white dark:bg-dark-800 px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Comparisons:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{comparisons}</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-dark-800 px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-md">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Swaps:</span>
              <span className="font-mono text-red-600 dark:text-red-400 font-bold">{swaps}</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-dark-800 px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-md">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">Step:</span>
              <span className="font-mono text-green-600 dark:text-green-400 font-bold">{currentStep}/{totalSteps}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-700 dark:to-dark-800 rounded-2xl p-3 sm:p-4 shadow-2xl">
        <div className="flex items-end justify-center space-x-0.5 sm:space-x-1 h-[280px] sm:h-[350px] p-2 sm:p-3 bg-white/50 dark:bg-dark-600/50 rounded-xl backdrop-blur-sm overflow-x-auto">
          {array.map((item, index) => {
            const height = maxValue > 0 ? (item.value / maxValue) * containerHeight : 10;
            const minHeight = 10;
            const finalHeight = Math.max(height, minHeight);

            let barColor = 'bg-gradient-to-t from-blue-500 to-blue-400';
            if (item.comparing) barColor = 'bg-gradient-to-t from-yellow-500 to-yellow-400 animate-pulse';
            if (item.sorted) barColor = 'bg-gradient-to-t from-green-500 to-green-400';
            if (item.selected) barColor = 'bg-gradient-to-t from-orange-500 to-orange-400 animate-pulse';
            if (item.pivot) barColor = 'bg-gradient-to-t from-purple-500 to-purple-400 animate-pulse';

            return (
              <div key={index} className="flex flex-col items-center space-y-1 sm:space-y-2 group">
                <div
                  className={`w-4 sm:w-6 lg:w-8 rounded-t-lg transition-all duration-300 ease-out flex items-end justify-center text-xs font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-110 ${barColor}`}
                  style={{ height: `${finalHeight}px` }}
                >
                  <span className="transform -rotate-90 whitespace-nowrap mb-1 sm:mb-2 text-xs sm:text-sm">
                    {item.value}
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-700 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
                  {index}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Visual Legend</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-2 sm:p-3 rounded-lg">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg shadow-md"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm">Normal</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-2 sm:p-3 rounded-lg">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-lg shadow-md animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm">Comparing</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-2 sm:p-3 rounded-lg">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-t from-green-500 to-green-400 rounded-lg shadow-md"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm">Sorted</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-2 sm:p-3 rounded-lg">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-t from-orange-500 to-orange-400 rounded-lg shadow-md animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm">Selected</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-2 sm:p-3 rounded-lg">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-t from-purple-500 to-purple-400 rounded-lg shadow-md animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm">Pivot</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;