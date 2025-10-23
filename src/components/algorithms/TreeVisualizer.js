import React, { useState, useEffect, useCallback, useRef } from 'react';

const TreeVisualizer = ({ algorithm, isPlaying, speed, onReset }) => {
  const [tree, setTree] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [insertValue, setInsertValue] = useState(50);
  const [searchValue, setSearchValue] = useState(50);
  const isPlayingRef = useRef(isPlaying);

  const generateAnimations = useCallback(() => {
    switch (algorithm) {
      case 'inorder':
        return generateInorderAnimations();
      case 'preorder':
        return generatePreorderAnimations();
      case 'postorder':
        return generatePostorderAnimations();
      case 'bst-insert':
        return generateBSTInsertAnimations();
      case 'bst-search':
        return generateBSTSearchAnimations();
      default:
        return [];
    }
  }, [algorithm, tree]);

  useEffect(() => {
    initializeTree();
  }, [algorithm, insertValue, searchValue]);

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

    if (!tree) return;

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
        
        // Update tree state based on animation
        setTree(prevTree => ({
          ...prevTree,
          currentAnimation: animation
        }));

        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      setIsAnimating(false);
    };
    animate();
  }, [isPlaying, speed, tree, generateAnimations, isAnimating]);

  const initializeTree = useCallback(() => {
    // Create a sample BST
    const nodes = [50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43, 56, 68, 81, 93];
    const tree = { nodes: [], edges: [], values: nodes };
    
    // Build BST structure
    nodes.forEach(value => {
      tree.nodes.push({ id: value, value, x: 0, y: 0 });
    });

    // Create edges based on BST properties
    const edges = [
      { from: 50, to: 25 }, { from: 50, to: 75 },
      { from: 25, to: 12 }, { from: 25, to: 37 },
      { from: 75, to: 62 }, { from: 75, to: 87 },
      { from: 12, to: 6 }, { from: 12, to: 18 },
      { from: 37, to: 31 }, { from: 37, to: 43 },
      { from: 62, to: 56 }, { from: 62, to: 68 },
      { from: 87, to: 81 }, { from: 87, to: 93 }
    ];

    tree.edges = edges;
    calculatePositions(tree);
    setTree(tree);
  }, []);


  const calculatePositions = (tree) => {
    const positions = {
      50: { x: 400, y: 50 },
      25: { x: 200, y: 150 }, 75: { x: 600, y: 150 },
      12: { x: 100, y: 250 }, 37: { x: 300, y: 250 },
      62: { x: 500, y: 250 }, 87: { x: 700, y: 250 },
      6: { x: 50, y: 350 }, 18: { x: 150, y: 350 },
      31: { x: 250, y: 350 }, 43: { x: 350, y: 350 },
      56: { x: 450, y: 350 }, 68: { x: 550, y: 350 },
      81: { x: 650, y: 350 }, 93: { x: 750, y: 350 }
    };

    tree.nodes.forEach(node => {
      const pos = positions[node.value];
      if (pos) {
        node.x = pos.x;
        node.y = pos.y;
      }
    });
  };


  const generateInorderAnimations = () => {
    const animations = [];
    const values = [];

    const inorderTraversal = (nodeValue) => {
      const node = tree.nodes.find(n => n.value === nodeValue);
      if (!node) return;

      // Find left child
      const leftChild = tree.edges.find(edge => edge.from === nodeValue)?.to;
      if (leftChild && leftChild < nodeValue) {
        inorderTraversal(leftChild);
      }

      // Visit current node
      animations.push({ type: 'visit', node: nodeValue });
      values.push(nodeValue);

      // Find right child
      const rightChild = tree.edges.find(edge => edge.from === nodeValue)?.to;
      if (rightChild && rightChild > nodeValue) {
        inorderTraversal(rightChild);
      }
    };

    inorderTraversal(50); // Start from root
    animations.push({ type: 'complete', values });
    return animations;
  };

  const generatePreorderAnimations = () => {
    const animations = [];
    const values = [];

    const preorderTraversal = (nodeValue) => {
      const node = tree.nodes.find(n => n.value === nodeValue);
      if (!node) return;

      // Visit current node first
      animations.push({ type: 'visit', node: nodeValue });
      values.push(nodeValue);

      // Find children
      const children = tree.edges.filter(edge => edge.from === nodeValue).map(edge => edge.to);
      const leftChild = children.find(child => child < nodeValue);
      const rightChild = children.find(child => child > nodeValue);

      if (leftChild) preorderTraversal(leftChild);
      if (rightChild) preorderTraversal(rightChild);
    };

    preorderTraversal(50); // Start from root
    animations.push({ type: 'complete', values });
    return animations;
  };

  const generatePostorderAnimations = () => {
    const animations = [];
    const values = [];

    const postorderTraversal = (nodeValue) => {
      const node = tree.nodes.find(n => n.value === nodeValue);
      if (!node) return;

      // Find children first
      const children = tree.edges.filter(edge => edge.from === nodeValue).map(edge => edge.to);
      const leftChild = children.find(child => child < nodeValue);
      const rightChild = children.find(child => child > nodeValue);

      if (leftChild) postorderTraversal(leftChild);
      if (rightChild) postorderTraversal(rightChild);

      // Visit current node last
      animations.push({ type: 'visit', node: nodeValue });
      values.push(nodeValue);
    };

    postorderTraversal(50); // Start from root
    animations.push({ type: 'complete', values });
    return animations;
  };

  const generateBSTInsertAnimations = () => {
    const animations = [];
    const value = insertValue;
    let current = 50; // Start from root

    animations.push({ type: 'current', node: current });

    const findChild = (parent, isLeft) => {
      return tree.edges.find(edge => edge.from === parent && (isLeft ? edge.to < parent : edge.to > parent))?.to;
    };

    while (true) {
      if (value < current) {
        const leftChild = findChild(current, true);
        if (leftChild) {
          current = leftChild;
          animations.push({ type: 'current', node: current });
        } else {
          // Insert as left child
          animations.push({ type: 'insert', node: value, parent: current, position: 'left' });
          break;
        }
      } else if (value > current) {
        const rightChild = findChild(current, false);
        if (rightChild) {
          current = rightChild;
          animations.push({ type: 'current', node: current });
        } else {
          // Insert as right child
          animations.push({ type: 'insert', node: value, parent: current, position: 'right' });
          break;
        }
      } else {
        // Value already exists
        animations.push({ type: 'exists', node: value });
        break;
      }
    }

    return animations;
  };

  const generateBSTSearchAnimations = () => {
    const animations = [];
    const value = searchValue;
    let current = 50; // Start from root

    animations.push({ type: 'current', node: current });

    const findChild = (parent, isLeft) => {
      return tree.edges.find(edge => edge.from === parent && (isLeft ? edge.to < parent : edge.to > parent))?.to;
    };

    while (current !== null && current !== undefined) {
      if (value === current) {
        animations.push({ type: 'found', node: current });
        break;
      } else if (value < current) {
        const leftChild = findChild(current, true);
        if (leftChild) {
          current = leftChild;
          animations.push({ type: 'current', node: current });
        } else {
          animations.push({ type: 'not-found' });
          break;
        }
      } else {
        const rightChild = findChild(current, false);
        if (rightChild) {
          current = rightChild;
          animations.push({ type: 'current', node: current });
        } else {
          animations.push({ type: 'not-found' });
          break;
        }
      }
    }

    return animations;
  };



  const getNodeColor = (nodeValue) => {
    const currentAnimation = tree?.currentAnimation;
    if (!currentAnimation) return '#3B82F6'; // blue-500

    switch (currentAnimation.type) {
      case 'visit':
        return currentAnimation.node === nodeValue ? '#10B981' : '#3B82F6'; // green-500 : blue-500
      case 'current':
        return currentAnimation.node === nodeValue ? '#F59E0B' : '#3B82F6'; // yellow-500 : blue-500
      case 'found':
        return currentAnimation.node === nodeValue ? '#EF4444' : '#3B82F6'; // red-500 : blue-500
      case 'insert':
        return currentAnimation.node === nodeValue ? '#8B5CF6' : '#3B82F6'; // purple-500 : blue-500
      case 'exists':
        return currentAnimation.node === nodeValue ? '#F97316' : '#3B82F6'; // orange-500 : blue-500
      default:
        return '#3B82F6'; // blue-500
    }
  };

  const getEdgeColor = (edge) => {
    const currentAnimation = tree?.currentAnimation;
    if (!currentAnimation) return 'stroke-gray-400';

    if (currentAnimation.type === 'current' && 
        (currentAnimation.node === edge.from || currentAnimation.node === edge.to)) {
      return 'stroke-yellow-500 stroke-2';
    }

    return 'stroke-gray-400';
  };

  if (!tree) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        {(algorithm === 'bst-insert' || algorithm === 'bst-search') && (
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {algorithm === 'bst-insert' ? 'Insert Value:' : 'Search Value:'}
              </label>
              <input
                type="number"
                value={algorithm === 'bst-insert' ? insertValue : searchValue}
                onChange={(e) => {
                  if (algorithm === 'bst-insert') {
                    setInsertValue(parseInt(e.target.value));
                  } else {
                    setSearchValue(parseInt(e.target.value));
                  }
                }}
                min="1"
                max="100"
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white w-24"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tree Visualization */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 overflow-hidden">
        <svg width="800" height="400" className="mx-auto">
          {/* Edges */}
          {tree.edges.map((edge, index) => {
            const fromNode = tree.nodes.find(n => n.value === edge.from);
            const toNode = tree.nodes.find(n => n.value === edge.to);
            
            if (!fromNode || !toNode) return null;

            return (
              <line
                key={index}
                x1={fromNode.x}
                y1={fromNode.y + 20}
                x2={toNode.x}
                y2={toNode.y - 20}
                className={`${getEdgeColor(edge)} stroke-2 transition-colors duration-300`}
              />
            );
          })}

          {/* Nodes */}
          {tree.nodes.map((node, index) => (
            <g key={index}>
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill={getNodeColor(node.value)}
                className="transition-colors duration-300"
              />
              <text
                x={node.x}
                y={node.y + 5}
                className="text-white font-bold text-sm"
                textAnchor="middle"
              >
                {node.value}
              </text>
            </g>
          ))}

          {/* Inserted node (if any) */}
          {tree.currentAnimation?.type === 'insert' && (
            <g>
              <circle
                cx={tree.currentAnimation.position === 'left' ? 
                  tree.nodes.find(n => n.value === tree.currentAnimation.parent).x - 100 :
                  tree.nodes.find(n => n.value === tree.currentAnimation.parent).x + 100
                }
                cy={tree.nodes.find(n => n.value === tree.currentAnimation.parent).y + 100}
                r="20"
                className="bg-purple-500 animate-pulse"
              />
              <text
                x={tree.currentAnimation.position === 'left' ? 
                  tree.nodes.find(n => n.value === tree.currentAnimation.parent).x - 100 :
                  tree.nodes.find(n => n.value === tree.currentAnimation.parent).x + 100
                }
                y={tree.nodes.find(n => n.value === tree.currentAnimation.parent).y + 105}
                className="text-white font-bold text-sm"
                textAnchor="middle"
              >
                {tree.currentAnimation.node}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Traversal Result */}
      {tree.currentAnimation?.type === 'complete' && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
            Traversal Result:
          </h4>
          <p className="text-sm text-green-800 dark:text-green-200 font-mono">
            {tree.currentAnimation.values.join(' → ')}
          </p>
        </div>
      )}

      {/* Algorithm Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          {algorithm.replace('-', ' ').toUpperCase()} Algorithm
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {algorithm === 'inorder' && 'Left → Root → Right. Visits nodes in sorted order for BST.'}
          {algorithm === 'preorder' && 'Root → Left → Right. Useful for creating a copy of the tree.'}
          {algorithm === 'postorder' && 'Left → Right → Root. Useful for deleting the tree.'}
          {algorithm === 'bst-insert' && 'Inserts a new node while maintaining BST properties.'}
          {algorithm === 'bst-search' && 'Searches for a value using BST properties for efficiency.'}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Found</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Insert</span>
        </div>
      </div>
    </div>
  );
};

export default TreeVisualizer;
