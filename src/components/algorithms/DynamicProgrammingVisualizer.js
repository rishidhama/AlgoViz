import React, { useState, useEffect, useCallback, useRef } from 'react';

const DynamicProgrammingVisualizer = ({ algorithm, isPlaying, speed, onReset }) => {
  const [data, setData] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [inputValue, setInputValue] = useState(8);
  const [knapsackCapacity, setKnapsackCapacity] = useState(10);
  const [matrixSize, setMatrixSize] = useState(4);
  const isPlayingRef = useRef(isPlaying);

  const generateAnimations = useCallback(() => {
    switch (algorithm) {
      case 'fibonacci':
        return generateFibonacciAnimations();
      case 'knapsack':
        return generateKnapsackAnimations();
      case 'matrix-chain':
        return generateMatrixChainAnimations();
      default:
        return [];
    }
  }, [algorithm, data]);

  const initializeData = useCallback(() => {
    switch (algorithm) {
      case 'fibonacci':
        setData({ n: inputValue, memo: new Array(inputValue + 1).fill(-1) });
        break;
      case 'knapsack':
        setData({
          weights: [2, 3, 4, 5],
          values: [3, 4, 5, 6],
          capacity: knapsackCapacity,
          dp: Array.from({ length: 5 }, () => new Array(knapsackCapacity + 1).fill(-1))
        });
        break;
      case 'matrix-chain':
        setData({
          dimensions: [1, 2, 3, 4, 5],
          dp: Array.from({ length: matrixSize }, () => new Array(matrixSize).fill(-1))
        });
        break;
      default:
        setData(null);
    }
  }, [algorithm, inputValue, knapsackCapacity, matrixSize]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Update ref when isPlaying changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Animation effect - responds to isPlaying from parent
  useEffect(() => {
    if (!isPlaying) {
      setIsAnimating(false);
      return;
    }

    if (isAnimating) return; // Prevent multiple animations from starting

    if (!data) return;

    const steps = generateAnimations();
    if (steps.length === 0) {
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);

    const animate = async () => {
      const delay = speed;

      for (let i = 0; i < steps.length; i++) {
        if (!isPlayingRef.current) break; // Stop if isPlaying becomes false

        const animation = steps[i];
        
        // Update data state based on animation
        setData(prevData => {
          const next = { ...prevData, currentAnimation: animation };
          return next;
        });

        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      setIsAnimating(false);
    };
    animate();
  }, [isPlaying, speed, data, generateAnimations, isAnimating]);


  const generateFibonacciAnimations = () => {
    const animations = [];
    const memo = new Array(inputValue + 1).fill(-1);

    const fibonacci = (n) => {
      if (n <= 1) {
        animations.push({ type: 'base-case', n, result: n });
        return n;
      }

      if (memo[n] !== -1) {
        animations.push({ type: 'memo-hit', n, result: memo[n] });
        return memo[n];
      }

      animations.push({ type: 'compute', n });
      memo[n] = fibonacci(n - 1) + fibonacci(n - 2);
      animations.push({ type: 'memo-store', n, result: memo[n] });
      
      return memo[n];
    };

    const result = fibonacci(inputValue);
    animations.push({ type: 'complete', result });
    return animations;
  };

  const generateKnapsackAnimations = () => {
    const animations = [];
    const weights = [2, 3, 4, 5];
    const values = [3, 4, 5, 6];
    const capacity = knapsackCapacity;
    const n = weights.length;

    const knapsack = (i, w) => {
      if (i === 0 || w === 0) {
        animations.push({ type: 'base-case', i, w, result: 0 });
        return 0;
      }

      if (data.dp[i][w] !== -1) {
        animations.push({ type: 'memo-hit', i, w, result: data.dp[i][w] });
        return data.dp[i][w];
      }

      animations.push({ type: 'compute', i, w });

      if (weights[i - 1] > w) {
        const result = knapsack(i - 1, w);
        animations.push({ type: 'exclude', i, w, result });
        data.dp[i][w] = result;
        animations.push({ type: 'memo-store', i, w, result });
        return result;
      } else {
        const include = values[i - 1] + knapsack(i - 1, w - weights[i - 1]);
        const exclude = knapsack(i - 1, w);
        const result = Math.max(include, exclude);
        
        animations.push({ type: 'include-exclude', i, w, include, exclude, result });
        data.dp[i][w] = result;
        animations.push({ type: 'memo-store', i, w, result });
        return result;
      }
    };

    const result = knapsack(n, capacity);
    animations.push({ type: 'complete', result });
    return animations;
  };

  const generateMatrixChainAnimations = () => {
    const animations = [];
    const dimensions = [1, 2, 3, 4, 5];
    const n = matrixSize;

    const matrixChain = (i, j) => {
      if (i === j) {
        animations.push({ type: 'base-case', i, j, result: 0 });
        return 0;
      }

      if (data.dp[i][j] !== -1) {
        animations.push({ type: 'memo-hit', i, j, result: data.dp[i][j] });
        return data.dp[i][j];
      }

      animations.push({ type: 'compute', i, j });

      let min = Infinity;
      let bestK = -1;

      for (let k = i; k < j; k++) {
        const left = matrixChain(i, k);
        const right = matrixChain(k + 1, j);
        const cost = dimensions[i - 1] * dimensions[k] * dimensions[j];
        const total = left + right + cost;
        
        animations.push({ type: 'split', i, j, k, left, right, cost, total });
        
        if (total < min) {
          min = total;
          bestK = k;
        }
      }

      data.dp[i][j] = min;
      animations.push({ type: 'memo-store', i, j, result: min, bestK });
      return min;
    };

    const result = matrixChain(1, n - 1);
    animations.push({ type: 'complete', result });
    return animations;
  };





  const renderFibonacci = () => {
    if (!data || !data.memo) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.memo.map((value, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-colors duration-300 ${
                data.currentAnimation?.type === 'memo-store' && data.currentAnimation.n === index
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : data.currentAnimation?.type === 'memo-hit' && data.currentAnimation.n === index
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : data.currentAnimation?.type === 'compute' && data.currentAnimation.n === index
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800'
              }`}
            >
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">f({index})</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {value === -1 ? '?' : value}
              </div>
            </div>
          ))}
        </div>
        
        {data.currentAnimation?.type === 'complete' && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-semibold">
              Fibonacci({inputValue}) = {data.currentAnimation.result}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderKnapsack = () => {
    if (!data || !data.dp) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-6 gap-2 text-xs">
          <div className="p-2 bg-gray-100 dark:bg-dark-700 rounded font-medium">Item/Weight</div>
          {Array.from({ length: knapsackCapacity + 1 }, (_, i) => (
            <div key={i} className="p-2 bg-gray-100 dark:bg-dark-700 rounded font-medium text-center">
              {i}
            </div>
          ))}
          
          {data.dp && data.dp.map((row, i) => (
            <React.Fragment key={i}>
              <div className="p-2 bg-gray-100 dark:bg-dark-700 rounded font-medium">
                {i === 0 ? 'No items' : `Item ${i}`}
              </div>
              {row.map((value, j) => (
                <div
                  key={j}
                  className={`p-2 rounded text-center transition-colors duration-300 ${
                    data.currentAnimation?.type === 'memo-store' && 
                    data.currentAnimation.i === i && data.currentAnimation.w === j
                      ? 'bg-green-500 text-white'
                      : data.currentAnimation?.type === 'memo-hit' && 
                        data.currentAnimation.i === i && data.currentAnimation.w === j
                      ? 'bg-blue-500 text-white'
                      : data.currentAnimation?.type === 'compute' && 
                        data.currentAnimation.i === i && data.currentAnimation.w === j
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600'
                  }`}
                >
                  {value === -1 ? '?' : value}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Items:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {data.weights && data.weights.map((weight, index) => (
              <div key={index} className="bg-white dark:bg-dark-800 p-2 rounded border">
                <div>Item {index + 1}</div>
                <div>Weight: {weight}</div>
                <div>Value: {data.values[index]}</div>
              </div>
            ))}
          </div>
        </div>

        {data.currentAnimation?.type === 'complete' && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-semibold">
              Maximum Value: {data.currentAnimation.result}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderMatrixChain = () => {
    if (!data || !data.dp) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-6 gap-2 text-xs">
          <div className="p-2 bg-gray-100 dark:bg-dark-700 rounded font-medium">i/j</div>
          {Array.from({ length: matrixSize }, (_, i) => (
            <div key={i} className="p-2 bg-gray-100 dark:bg-dark-700 rounded font-medium text-center">
              {i}
            </div>
          ))}
          
          {data.dp && data.dp.map((row, i) => (
            <React.Fragment key={i}>
              <div className="p-2 bg-gray-100 dark:bg-dark-700 rounded font-medium">
                {i}
              </div>
              {row.map((value, j) => (
                <div
                  key={j}
                  className={`p-2 rounded text-center transition-colors duration-300 ${
                    data.currentAnimation?.type === 'memo-store' && 
                    data.currentAnimation.i === i && data.currentAnimation.j === j
                      ? 'bg-green-500 text-white'
                      : data.currentAnimation?.type === 'memo-hit' && 
                        data.currentAnimation.i === i && data.currentAnimation.j === j
                      ? 'bg-blue-500 text-white'
                      : data.currentAnimation?.type === 'compute' && 
                        data.currentAnimation.i === i && data.currentAnimation.j === j
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600'
                  }`}
                >
                  {value === -1 ? '?' : value}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Matrix Dimensions:</h4>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            {data.dimensions && data.dimensions.map((dim, index) => (
              <span key={index}>
                {dim}
                {index < data.dimensions.length - 1 ? ' × ' : ''}
              </span>
            ))}
          </div>
        </div>

        {data.currentAnimation?.type === 'complete' && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-semibold">
              Minimum Multiplications: {data.currentAnimation.result}
            </p>
          </div>
        )}
      </div>
    );
  };




  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-4">
          {algorithm === 'fibonacci' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                N Value:
              </label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(parseInt(e.target.value))}
                min="1"
                max="20"
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white w-20"
              />
            </div>
          )}

          {algorithm === 'knapsack' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capacity:
              </label>
              <input
                type="number"
                value={knapsackCapacity}
                onChange={(e) => setKnapsackCapacity(parseInt(e.target.value))}
                min="5"
                max="15"
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white w-20"
              />
            </div>
          )}

          {algorithm === 'matrix-chain' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matrix Count:
              </label>
              <input
                type="number"
                value={matrixSize}
                onChange={(e) => setMatrixSize(parseInt(e.target.value))}
                min="3"
                max="6"
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white w-20"
              />
            </div>
          )}
        </div>
      </div>

      {/* DP / Backtracking Visualization */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        {algorithm === 'fibonacci' && renderFibonacci()}
        {algorithm === 'knapsack' && renderKnapsack()}
        {algorithm === 'matrix-chain' && renderMatrixChain()}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Computing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Memo Hit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Memo Store</span>
        </div>
      </div>
    </div>
  );
};

export default DynamicProgrammingVisualizer;
