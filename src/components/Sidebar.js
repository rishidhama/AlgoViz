import React, { useState } from 'react';
import { ChevronDown, ChevronRight, SortAsc, Search, Network, TreePine, Brain } from 'lucide-react';

const Sidebar = ({ selectedAlgorithm, onAlgorithmSelect }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    sorting: true,
    searching: false,
    graphs: false,
    trees: false,
    dp: false,
  });

  const algorithmCategories = {
    sorting: {
      title: 'Sorting Algorithms',
      icon: SortAsc,
      color: 'from-red-500 to-pink-600',
      algorithms: [
        { id: 'bubble-sort', name: 'Bubble Sort', complexity: 'O(n²)', description: 'Simple comparison-based sorting algorithm' },
        { id: 'selection-sort', name: 'Selection Sort', complexity: 'O(n²)', description: 'Finds minimum element and places it at the beginning' },
        { id: 'insertion-sort', name: 'Insertion Sort', complexity: 'O(n²)', description: 'Builds sorted array one element at a time' },
        { id: 'merge-sort', name: 'Merge Sort', complexity: 'O(n log n)', description: 'Divide and conquer sorting algorithm' },
        { id: 'quick-sort', name: 'Quick Sort', complexity: 'O(n log n)', description: 'Pivot-based partitioning algorithm' },
        { id: 'heap-sort', name: 'Heap Sort', complexity: 'O(n log n)', description: 'Uses binary heap data structure' },
      ]
    },
    searching: {
      title: 'Searching Algorithms',
      icon: Search,
      color: 'from-blue-500 to-cyan-600',
      algorithms: [
        { id: 'linear-search', name: 'Linear Search', complexity: 'O(n)', description: 'Sequential search through each element' },
        { id: 'binary-search', name: 'Binary Search', complexity: 'O(log n)', description: 'Efficient search in sorted arrays' },
      ]
    },
    graphs: {
      title: 'Graph Algorithms',
      icon: Network,
      color: 'from-green-500 to-emerald-600',
      algorithms: [
        { id: 'bfs', name: 'Breadth-First Search', complexity: 'O(V + E)', description: 'Level-by-level exploration' },
        { id: 'dfs', name: 'Depth-First Search', complexity: 'O(V + E)', description: 'Deep exploration first' },
        { id: 'dijkstra', name: "Dijkstra's Algorithm", complexity: 'O((V + E) log V)', description: 'Shortest path finder' },
        { id: 'prim', name: "Prim's Algorithm", complexity: 'O(E log V)', description: 'Minimum spanning tree' },
        { id: 'kruskal', name: "Kruskal's Algorithm", complexity: 'O(E log E)', description: 'MST by edge sorting' },
      ]
    },
    trees: {
      title: 'Tree Algorithms',
      icon: TreePine,
      color: 'from-purple-500 to-violet-600',
      algorithms: [
        { id: 'inorder', name: 'Inorder Traversal', complexity: 'O(n)', description: 'Left → Root → Right' },
        { id: 'preorder', name: 'Preorder Traversal', complexity: 'O(n)', description: 'Root → Left → Right' },
        { id: 'postorder', name: 'Postorder Traversal', complexity: 'O(n)', description: 'Left → Right → Root' },
        { id: 'bst-insert', name: 'BST Insert', complexity: 'O(log n)', description: 'Maintains BST properties' },
        { id: 'bst-search', name: 'BST Search', complexity: 'O(log n)', description: 'Efficient tree search' },
      ]
    },
    dp: {
      title: 'Dynamic Programming',
      icon: Brain,
      color: 'from-orange-500 to-red-600',
      algorithms: [
        { id: 'fibonacci', name: 'Fibonacci', complexity: 'O(n)', description: 'Memoization demonstration' },
        { id: 'knapsack', name: 'Knapsack Problem', complexity: 'O(nW)', description: 'Optimization problem' },
        { id: 'matrix-chain', name: 'Matrix Chain Multiplication', complexity: 'O(n³)', description: 'Optimal multiplication order' },
      ]
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };


  const getCategoryTextStyle = (categoryKey) => {
    const styleMap = {
      sorting: { color: '#dc2626' },
      searching: { color: '#2563eb' },
      graphs: { color: '#16a34a' },
      trees: { color: '#9333ea' },
      dp: { color: '#ea580c' }
    };
    return styleMap[categoryKey] || { color: '#111827' };
  };

  return (
    <aside className="w-80 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md shadow-2xl border-r border-gray-200/50 dark:border-dark-700/50 overflow-hidden flex-shrink-0">
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Algorithm Categories
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose an algorithm to visualize
          </p>
        </div>
        
        <div className="space-y-3">
          {Object.entries(algorithmCategories).map(([categoryKey, category]) => {
            const IconComponent = category.icon;
            const isExpanded = expandedCategories[categoryKey];
            
            return (
              <div key={categoryKey} className="space-y-2">
                <button
                  onClick={() => toggleCategory(categoryKey)}
                  className="w-full flex items-center justify-between p-4 text-left bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-dark-600 dark:hover:to-dark-500 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md relative`}>
                      <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                        <IconComponent 
                          size={16} 
                          className="text-gray-700 font-bold" 
                        />
                      </div>
                    </div>
                    <div>
                      <span 
                        className="font-semibold"
                        style={getCategoryTextStyle(categoryKey)}
                      >
                        {category.title}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {category.algorithms.length} algorithms
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={20} className="text-gray-500 transition-transform duration-200" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-500 transition-transform duration-200" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="ml-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {category.algorithms.map((algorithm) => (
                      <button
                        key={algorithm.id}
                        onClick={() => onAlgorithmSelect(algorithm.id)}
                        className={`w-full p-3 text-left rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                          selectedAlgorithm === algorithm.id
                            ? `bg-gradient-to-r ${category.color} text-white shadow-lg font-semibold border-2 border-white/20`
                            : 'bg-white/80 dark:bg-dark-700/80 hover:bg-white dark:hover:bg-dark-600 text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg border'
                        }`}
                        style={selectedAlgorithm === algorithm.id ? {} : {
                          borderColor: getCategoryTextStyle(categoryKey).color + '40',
                          backgroundColor: getCategoryTextStyle(categoryKey).color + '10'
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium text-sm ${selectedAlgorithm === algorithm.id ? 'text-white font-bold' : ''}`}>{algorithm.name}</span>
                          <span 
                             className={`text-xs px-2 py-1 rounded-full font-medium ${
                               selectedAlgorithm === algorithm.id
                                 ? 'bg-black/30 text-white'
                                 : 'text-gray-700 dark:text-gray-300'
                             }`}
                            style={selectedAlgorithm === algorithm.id ? {} : {
                              backgroundColor: getCategoryTextStyle(categoryKey).color + '20',
                              color: getCategoryTextStyle(categoryKey).color
                            }}
                          >
                            {algorithm.complexity}
                          </span>
                        </div>
                        <p className={`text-xs ${
                          selectedAlgorithm === algorithm.id
                            ? 'text-white/90'
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {algorithm.description}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
