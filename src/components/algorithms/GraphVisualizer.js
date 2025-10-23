import React, { useState, useEffect, useCallback, useRef } from 'react';

const GraphVisualizer = ({ algorithm, isPlaying, speed, onReset }) => {
  const [graph, setGraph] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedStartNode, setSelectedStartNode] = useState('A');
  const [selectedEndNode, setSelectedEndNode] = useState('F');
  const isPlayingRef = useRef(isPlaying);

  const initializeGraph = () => {
    const nodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const edges = [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'B', to: 'E', weight: 3 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'C', to: 'F', weight: 6 },
      { from: 'D', to: 'E', weight: 2 },
      { from: 'D', to: 'F', weight: 3 },
      { from: 'E', to: 'G', weight: 4 },
      { from: 'F', to: 'G', weight: 2 },
      { from: 'F', to: 'H', weight: 5 },
      { from: 'G', to: 'H', weight: 1 }
    ];

    setGraph({ nodes, edges });
  };


  const generateAnimations = useCallback(() => {
    let result = [];

    switch (algorithm) {
      case 'bfs':
        result = generateBFSAnimations();
        break;
      case 'dfs':
        result = generateDFSAnimations();
        break;
      case 'dijkstra':
        result = generateDijkstraAnimations();
        break;
      case 'prim':
        result = generatePrimAnimations();
        break;
      case 'kruskal':
        result = generateKruskalAnimations();
        break;
      default:
        result = [];
    }
    
    return result;
  }, [algorithm, selectedStartNode, selectedEndNode, graph]);

  useEffect(() => {
    initializeGraph();
  }, []);

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

    if (!graph) return;

    const steps = generateAnimations();
    if (steps.length === 0) {
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);

    const animate = async () => {
      for (let i = 0; i < steps.length; i++) {
        if (!isPlayingRef.current) break; // Stop if isPlaying becomes false

        const animation = steps[i];
        
        // Update graph state based on animation
        setGraph(prevGraph => ({
          ...prevGraph,
          currentAnimation: animation
        }));

        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      setIsAnimating(false);
    };
    animate();
  }, [isPlaying, speed, graph, generateAnimations]);

  const generateBFSAnimations = () => {
    const animations = [];
    const visited = new Set();
    const queue = [selectedStartNode];
    const adjacencyList = buildAdjacencyList();

    visited.add(selectedStartNode);
    animations.push({ type: 'visit', node: selectedStartNode });

    while (queue.length > 0) {
      const current = queue.shift();
      animations.push({ type: 'current', node: current });

      for (const neighbor of adjacencyList[current] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          animations.push({ type: 'discover', node: neighbor, from: current });
          animations.push({ type: 'visit', node: neighbor });
        }
      }
    }

    return animations;
  };

  const generateDFSAnimations = () => {
    const animations = [];
    const visited = new Set();
    const adjacencyList = buildAdjacencyList();

    const dfs = (node) => {
      visited.add(node);
      animations.push({ type: 'current', node });
      animations.push({ type: 'visit', node });

      for (const neighbor of adjacencyList[node] || []) {
        if (!visited.has(neighbor)) {
          animations.push({ type: 'discover', node: neighbor, from: node });
          dfs(neighbor);
        }
      }
    };

    dfs(selectedStartNode);
    return animations;
  };

  const generateDijkstraAnimations = () => {
    const animations = [];
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    const adjacencyList = buildWeightedAdjacencyList();

    // Initialize distances
    graph.nodes.forEach(node => {
      distances[node] = node === selectedStartNode ? 0 : Infinity;
      unvisited.add(node);
    });

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let current = null;
      let minDistance = Infinity;
      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          minDistance = distances[node];
          current = node;
        }
      }

      if (current === null) break;

      unvisited.delete(current);
      animations.push({ type: 'current', node: current });
      animations.push({ type: 'visit', node: current });

      // Update distances to neighbors
      for (const { node, weight } of adjacencyList[current] || []) {
        if (unvisited.has(node)) {
          const newDistance = distances[current] + weight;
          if (newDistance < distances[node]) {
            distances[node] = newDistance;
            previous[node] = current;
            animations.push({ type: 'update-distance', node, distance: newDistance });
          }
        }
      }
    }

    // Highlight shortest path
    let pathNode = selectedEndNode;
    while (pathNode && previous[pathNode]) {
      animations.push({ type: 'path', node: pathNode, from: previous[pathNode] });
      pathNode = previous[pathNode];
    }

    return animations;
  };





  const generatePrimAnimations = () => {
    const animations = [];
    const mst = new Set();
    const edges = [...graph.edges].sort((a, b) => a.weight - b.weight);
    const nodeSets = {};

    // Initialize each node as its own set
    graph.nodes.forEach(node => {
      nodeSets[node] = new Set([node]);
    });

    // Kruskal's algorithm for MST
    for (const edge of edges) {
      const set1 = nodeSets[edge.from];
      const set2 = nodeSets[edge.to];

      if (!set1.has(edge.to)) {
        // Union the sets
        const union = new Set([...set1, ...set2]);
        [...set1, ...set2].forEach(node => {
          nodeSets[node] = union;
        });

        mst.add(edge);
        animations.push({ type: 'add-edge', edge });
      }
    }

    return animations;
  };

  const generateKruskalAnimations = () => {
    const animations = [];
    const mst = [];
    const edges = [...graph.edges].sort((a, b) => a.weight - b.weight);
    const parent = {};

    // Initialize parent array
    graph.nodes.forEach(node => {
      parent[node] = node;
    });

    const find = (node) => {
      if (parent[node] !== node) {
        parent[node] = find(parent[node]);
      }
      return parent[node];
    };

    for (const edge of edges) {
      const root1 = find(edge.from);
      const root2 = find(edge.to);

      if (root1 !== root2) {
        parent[root1] = root2;
        mst.push(edge);
        animations.push({ type: 'add-edge', edge });
      }
    }

    return animations;
  };

  const buildAdjacencyList = () => {
    const adjacencyList = {};
    graph.edges.forEach(edge => {
      if (!adjacencyList[edge.from]) adjacencyList[edge.from] = [];
      if (!adjacencyList[edge.to]) adjacencyList[edge.to] = [];
      adjacencyList[edge.from].push(edge.to);
      adjacencyList[edge.to].push(edge.from);
    });
    return adjacencyList;
  };

  const buildWeightedAdjacencyList = () => {
    const adjacencyList = {};
    graph.edges.forEach(edge => {
      if (!adjacencyList[edge.from]) adjacencyList[edge.from] = [];
      if (!adjacencyList[edge.to]) adjacencyList[edge.to] = [];
      adjacencyList[edge.from].push({ node: edge.to, weight: edge.weight });
      adjacencyList[edge.to].push({ node: edge.from, weight: edge.weight });
    });
    return adjacencyList;
  };


  const getNodePosition = (node) => {
    const positions = {
      'A': { x: 100, y: 50 },
      'B': { x: 200, y: 100 },
      'C': { x: 300, y: 50 },
      'D': { x: 400, y: 100 },
      'E': { x: 500, y: 150 },
      'F': { x: 600, y: 100 },
      'G': { x: 700, y: 150 },
      'H': { x: 800, y: 100 }
    };
    return positions[node] || { x: 0, y: 0 };
  };

  const getNodeColor = (node) => {
    const currentAnimation = graph?.currentAnimation;
    if (!currentAnimation) return '#3B82F6'; // blue-500

    switch (currentAnimation.type) {
      case 'visit':
        return currentAnimation.node === node ? '#10B981' : '#3B82F6'; // green-500 : blue-500
      case 'current':
        return currentAnimation.node === node ? '#F59E0B' : '#3B82F6'; // yellow-500 : blue-500
      case 'discover':
        return currentAnimation.node === node ? '#F97316' : '#3B82F6'; // orange-500 : blue-500
      case 'update-distance':
        return currentAnimation.node === node ? '#8B5CF6' : '#3B82F6'; // purple-500 : blue-500
      case 'path':
        return currentAnimation.node === node ? '#EF4444' : '#3B82F6'; // red-500 : blue-500
      default:
        return '#3B82F6'; // blue-500
    }
  };

  const getEdgeColor = (edge) => {
    const currentAnimation = graph?.currentAnimation;
    if (!currentAnimation) return 'stroke-gray-400';

    if (currentAnimation.type === 'add-edge' && 
        ((currentAnimation.edge.from === edge.from && currentAnimation.edge.to === edge.to) ||
         (currentAnimation.edge.from === edge.to && currentAnimation.edge.to === edge.from))) {
      return 'stroke-green-500 stroke-2';
    }

    return 'stroke-gray-400';
  };

  if (!graph) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        {(algorithm === 'dijkstra' || algorithm === 'bfs' || algorithm === 'dfs') && (
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Node:
              </label>
              <select
                value={selectedStartNode}
                onChange={(e) => setSelectedStartNode(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
              >
                {graph.nodes.map(node => (
                  <option key={node} value={node}>{node}</option>
                ))}
              </select>
            </div>

            {algorithm === 'dijkstra' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Node:
                </label>
                <select
                  value={selectedEndNode}
                  onChange={(e) => setSelectedEndNode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                >
                  {graph.nodes.map(node => (
                    <option key={node} value={node}>{node}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Graph Visualization */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 overflow-hidden">
        <svg width="900" height="200" className="mx-auto">
          {/* Edges */}
          {graph.edges.map((edge, index) => {
            const fromPos = getNodePosition(edge.from);
            const toPos = getNodePosition(edge.to);
            
            return (
              <g key={index}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  className={`${getEdgeColor(edge)} stroke-2`}
                />
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 - 5}
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((node, index) => {
            const pos = getNodePosition(node);
            return (
              <g key={index}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  fill={getNodeColor(node)}
                  className="transition-colors duration-300"
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  className="text-white font-bold text-sm"
                  textAnchor="middle"
                >
                  {node}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Algorithm Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          {algorithm.toUpperCase()} Algorithm
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {algorithm === 'bfs' && 'Explores all neighbors at the current depth before moving to the next level.'}
          {algorithm === 'dfs' && 'Explores as far as possible along each branch before backtracking.'}
          {algorithm === 'dijkstra' && 'Finds the shortest path from a source node to all other nodes.'}
          {algorithm === 'prim' && 'Finds the minimum spanning tree by growing from a starting node.'}
          {algorithm === 'kruskal' && 'Finds the minimum spanning tree by adding edges in order of weight.'}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Discovering</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Path</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
