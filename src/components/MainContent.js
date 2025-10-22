import React, { useState, useEffect } from 'react';
import SortingVisualizer from './algorithms/SortingVisualizer';
import SearchingVisualizer from './algorithms/SearchingVisualizer';
import GraphVisualizer from './algorithms/GraphVisualizer';
import TreeVisualizer from './algorithms/TreeVisualizer';
import DynamicProgrammingVisualizer from './algorithms/DynamicProgrammingVisualizer';

const CodeDisplay = ({ code }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  
  const languages = {
    javascript: { name: 'JavaScript', icon: 'JS' },
    python: { name: 'Python', icon: 'PY' },
    java: { name: 'Java', icon: 'JA' },
    cpp: { name: 'C++', icon: 'C+' },
    c: { name: 'C', icon: 'C' }
  };

  const getCurrentCode = () => {
    if (typeof code === 'string') {
      return code; // Legacy single language support
    }
    return code[selectedLanguage] || 'Code not available';
  };

  // Get available languages for this code
  const getAvailableLanguages = () => {
    if (typeof code === 'string') {
      return { javascript: languages.javascript }; // Legacy support
    }
    
    const available = {};
    Object.keys(languages).forEach(lang => {
      if (code[lang]) {
        available[lang] = languages[lang];
      }
    });
    
    return available;
  };

  const availableLanguages = getAvailableLanguages();

  // Ensure selected language is available, fallback to first available
  useEffect(() => {
    if (typeof code !== 'string' && !code[selectedLanguage]) {
      const firstAvailable = Object.keys(availableLanguages)[0];
      if (firstAvailable) {
        setSelectedLanguage(firstAvailable);
      }
    }
  }, [code, selectedLanguage, availableLanguages]);

  const highlightCode = (code, language) => {
    if (!code) return '';
    
    // Use a token-based approach to prevent nested spans
    const tokens = [];
    let currentPos = 0;
    
    // Define token patterns for each language
    const getTokenPatterns = (lang) => {
      switch (lang) {
        case 'javascript':
          return [
            { pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, type: 'comment', class: 'text-gray-500 italic' },
            { pattern: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, type: 'string', class: 'text-green-400' },
            { pattern: /\b(function|const|let|var|return|if|else|for|while|do|switch|case|break|continue|import|from|true|false|null|undefined|new|this|super|extends|implements|interface|try|catch|finally|throw|throws|private|protected|abstract|final|volatile|synchronized|transient|native|strictfp|async|await|yield|in|of|with|as|is)\b/g, type: 'keyword', class: 'text-blue-400 font-semibold' },
            { pattern: /\b(console|Math|Array|Object|String|Number|Boolean|Date|RegExp|JSON|Promise|Set|Map|WeakSet|WeakMap|Symbol|Proxy|Reflect|Error|TypeError|ReferenceError|SyntaxError|RangeError|EvalError|URIError|parseInt|parseFloat|isNaN|isFinite|decodeURI|encodeURI|decodeURIComponent|encodeURIComponent|escape|unescape|eval|setTimeout|setInterval|clearTimeout|clearInterval|requestAnimationFrame|cancelAnimationFrame|fetch|XMLHttpRequest|localStorage|sessionStorage|indexedDB|Worker|SharedWorker|ServiceWorker|Blob|File|FileReader|FormData|URL|URLSearchParams|Headers|Request|Response)\b/g, type: 'builtin', class: 'text-orange-400 font-semibold' },
            { pattern: /\b\d+(\.\d+)?[fFlL]?\b/g, type: 'number', class: 'text-yellow-400' },
            { pattern: /\b(\w+)\s*(?=\()/g, type: 'function', class: 'text-cyan-400' },
            { pattern: /([+\-*/%=<>!&|^~?:,;.\[\]{}()])/g, type: 'operator', class: 'text-purple-400' }
          ];
          
        case 'python':
          return [
            { pattern: /(#.*$)/gm, type: 'comment', class: 'text-gray-500 italic' },
            { pattern: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, type: 'string', class: 'text-green-400' },
            { pattern: /\b(def|class|return|if|elif|else|for|while|do|switch|case|break|continue|import|from|and|or|not|global|nonlocal|assert|del|exec|raise|except|finally|try|with|as|is|pass|lambda|yield|async|await)\b/g, type: 'keyword', class: 'text-blue-400 font-semibold' },
            { pattern: /\b(print|len|range|enumerate|zip|map|filter|reduce|sum|min|max|sorted|reversed|list|dict|set|tuple|str|int|float|bool|type|isinstance|hasattr|getattr|setattr|delattr|dir|vars|locals|globals|exec|eval|compile|open|input|raw_input|file|super|object|property|staticmethod|classmethod|abstractmethod)\b/g, type: 'builtin', class: 'text-orange-400 font-semibold' },
            { pattern: /\b\d+(\.\d+)?[fFlL]?\b/g, type: 'number', class: 'text-yellow-400' },
            { pattern: /\b(\w+)\s*(?=\()/g, type: 'function', class: 'text-cyan-400' },
            { pattern: /([+\-*/%=<>!&|^~?:,;\.\[\]{}()])/g, type: 'operator', class: 'text-purple-400' }
          ];
          
        case 'java':
          return [
            { pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, type: 'comment', class: 'text-gray-500 italic' },
            { pattern: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, type: 'string', class: 'text-green-400' },
            { pattern: /\b(public|private|protected|static|final|abstract|synchronized|volatile|transient|native|strictfp|class|interface|extends|implements|import|package|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|new|this|super|instanceof|enum|assert|default|goto|const|strictfp)\b/g, type: 'keyword', class: 'text-blue-400 font-semibold' },
            { pattern: /\b(int|string|char|bool|float|double|void|long|short|byte|unsigned|signed|auto|static|const|volatile|register|extern|typedef|struct|union|enum|class|interface|namespace|template|typename|vector|list|map|set|queue|stack|deque|unordered_map|unordered_set|array|tuple|optional|variant|any|auto|decltype)\b/g, type: 'type', class: 'text-blue-300 font-semibold' },
            { pattern: /\b(System|out|println|print|String|Integer|Double|Float|Boolean|Character|Byte|Short|Long|Math|Arrays|Collections|ArrayList|LinkedList|HashMap|HashSet|TreeMap|TreeSet|Queue|Stack|Vector|Iterator|Comparable|Comparator|Runnable|Thread|Exception|IOException|RuntimeException|NullPointerException|IllegalArgumentException|IndexOutOfBoundsException|ConcurrentModificationException|UnsupportedOperationException|ClassCastException|NumberFormatException|SecurityException|CloneNotSupportedException|InterruptedException|FileNotFoundException|EOFException|SocketException|MalformedURLException|UnknownHostException|ConnectException|BindException|SocketTimeoutException)\b/g, type: 'builtin', class: 'text-orange-400 font-semibold' },
            { pattern: /\b\d+(\.\d+)?[fFlL]?\b/g, type: 'number', class: 'text-yellow-400' },
            { pattern: /\b(\w+)\s*(?=\()/g, type: 'function', class: 'text-cyan-400' },
            { pattern: /([+\-*/%=<>!&|^~?:,;\.\[\]{}()])/g, type: 'operator', class: 'text-purple-400' }
          ];
          
        case 'cpp':
        case 'c':
          return [
            { pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, type: 'comment', class: 'text-gray-500 italic' },
            { pattern: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, type: 'string', class: 'text-green-400' },
            { pattern: /\b(public|private|protected|static|final|abstract|synchronized|volatile|transient|native|strictfp|class|interface|extends|implements|import|package|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|new|this|super|instanceof|enum|assert|default|goto|const|strictfp|include|define|ifdef|ifndef|endif|pragma|extern|sizeof|alignof|typeof|auto|register|static|inline|virtual|explicit|friend|mutable|noexcept|override|final|delete|default|constexpr|decltype|nullptr|thread_local|using|namespace|template|typename|class|struct|union|enum|public|private|protected|virtual|override|final|explicit|friend|mutable|static_cast|dynamic_cast|const_cast|reinterpret_cast|new|delete|operator|sizeof|alignof|typeid|throw|try|catch|noexcept|constexpr|decltype|auto|register|static|extern|inline|virtual|explicit|friend|mutable|noexcept|override|final|delete|default)\b/g, type: 'keyword', class: 'text-blue-400 font-semibold' },
            { pattern: /\b(int|string|char|bool|float|double|void|long|short|byte|unsigned|signed|auto|static|const|volatile|register|extern|typedef|struct|union|enum|class|interface|namespace|template|typename|vector|list|map|set|queue|stack|deque|unordered_map|unordered_set|array|tuple|optional|variant|any|auto|decltype)\b/g, type: 'type', class: 'text-blue-300 font-semibold' },
            { pattern: /\b\d+(\.\d+)?[fFlL]?\b/g, type: 'number', class: 'text-yellow-400' },
            { pattern: /\b(\w+)\s*(?=\()/g, type: 'function', class: 'text-cyan-400' },
            { pattern: /([+\-*/%=<>!&|^~?:,;\.\[\]{}()])/g, type: 'operator', class: 'text-purple-400' }
          ];
          
        default:
          return [];
      }
    };
    
    const patterns = getTokenPatterns(language);
    
    // Find all matches and sort by position
    const matches = [];
    patterns.forEach(({ pattern, type, class: className }) => {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          type,
          className
        });
      }
    });
    
    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);
    
    // Remove overlapping matches (keep the first one)
    const filteredMatches = [];
    let lastEnd = 0;
    matches.forEach(match => {
      if (match.start >= lastEnd) {
        filteredMatches.push(match);
        lastEnd = match.end;
      }
    });
    
    // Build highlighted code
    let result = '';
    let pos = 0;
    
    filteredMatches.forEach(match => {
      // Add text before match
      if (pos < match.start) {
        result += code.slice(pos, match.start);
      }
      
      // Add highlighted match
      result += `<span class="${match.className}">${match.text}</span>`;
      pos = match.end;
    });
    
    // Add remaining text
    if (pos < code.length) {
      result += code.slice(pos);
    }
    
    return result;
  };

  return (
    <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-800 rounded-xl border border-gray-200/50 dark:border-dark-600/50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-dark-600/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Algorithm Code
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Multiple language implementations
            </p>
          </div>
        </div>
        
        {/* Language Tabs - Only show available languages */}
        {Object.keys(availableLanguages).length > 1 && (
          <div className="flex space-x-1 bg-white dark:bg-dark-800 rounded-lg p-1 shadow-md">
            {Object.entries(availableLanguages).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => setSelectedLanguage(key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  selectedLanguage === key
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                {lang.icon}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {availableLanguages[selectedLanguage]?.name || 'Code'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({selectedLanguage})
            </span>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(getCurrentCode())}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            Copy Code
          </button>
        </div>
        <pre className="bg-gray-900 dark:bg-dark-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-100 font-mono leading-relaxed">
          <code 
            key={selectedLanguage}
            dangerouslySetInnerHTML={{ 
              __html: highlightCode(getCurrentCode(), selectedLanguage) 
            }} 
          />
        </pre>
      </div>
    </div>
  );
};

const MainContent = ({ algorithm, data, isPlaying, speed, onDataChange, onGenerateData }) => {
  const [customData, setCustomData] = useState('');
  const [targetValue, setTargetValue] = useState(50);

  const getAlgorithmInfo = () => {
    const algorithmInfo = {
      'bubble-sort': {
        name: 'Bubble Sort',
        description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(n)',
        averageCase: 'O(n²)',
        worstCase: 'O(n²)',
        code: {
          javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
          python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
          java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
          cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
          c: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
        }
      },
      'selection-sort': {
        name: 'Selection Sort',
        description: 'An in-place comparison sorting algorithm. It finds the minimum element and places it at the beginning.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(n²)',
        averageCase: 'O(n²)',
        worstCase: 'O(n²)',
        code: {
          javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
          python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
          java: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
          cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
          c: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`
        }
      },
      'insertion-sort': {
        name: 'Insertion Sort',
        description: 'A simple sorting algorithm that builds the final sorted array one item at a time.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(n)',
        averageCase: 'O(n²)',
        worstCase: 'O(n²)',
        code: {
          javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
          python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
          java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
          cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
          c: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
        }
      },
      'merge-sort': {
        name: 'Merge Sort',
        description: 'A divide-and-conquer algorithm that divides the input array into two halves, sorts them, and then merges them.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        bestCase: 'O(n log n)',
        averageCase: 'O(n log n)',
        worstCase: 'O(n log n)',
        code: {
          javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
          python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    return result + left[i:] + right[j:]`,
          java: `public static int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    
    int mid = arr.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
    
    return merge(left, right);
}

public static int[] merge(int[] left, int[] right) {
    int[] result = new int[left.length + right.length];
    int i = 0, j = 0, k = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result[k++] = left[i++];
        } else {
            result[k++] = right[j++];
        }
    }
    
    while (i < left.length) result[k++] = left[i++];
    while (j < right.length) result[k++] = right[j++];
    
    return result;
}`,
          cpp: `vector<int> mergeSort(vector<int>& arr) {
    if (arr.size() <= 1) return arr;
    
    int mid = arr.size() / 2;
    vector<int> left(arr.begin(), arr.begin() + mid);
    vector<int> right(arr.begin() + mid, arr.end());
    
    left = mergeSort(left);
    right = mergeSort(right);
    
    return merge(left, right);
}

vector<int> merge(vector<int>& left, vector<int>& right) {
    vector<int> result;
    int i = 0, j = 0;
    
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) {
            result.push_back(left[i++]);
        } else {
            result.push_back(right[j++]);
        }
    }
    
    while (i < left.size()) result.push_back(left[i++]);
    while (j < right.size()) result.push_back(right[j++]);
    
    return result;
}`,
          c: `void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    int L[n1], R[n2];
    
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    
    int i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i++];
        } else {
            arr[k] = R[j++];
        }
        k++;
    }
    
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}`
        }
      },
      'quick-sort': {
        name: 'Quick Sort',
        description: 'A divide-and-conquer algorithm that picks a pivot element and partitions the array around the pivot.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
        bestCase: 'O(n log n)',
        averageCase: 'O(n log n)',
        worstCase: 'O(n²)',
        code: {
          javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
          python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
          java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

public static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    return i + 1;
}`,
          cpp: `void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
          c: `void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    return i + 1;
}`
        }
      },
      'heap-sort': {
        name: 'Heap Sort',
        description: 'A comparison-based sorting algorithm that uses a binary heap data structure.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(n log n)',
        averageCase: 'O(n log n)',
        worstCase: 'O(n log n)',
        code: `function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`
      },
      'linear-search': {
        name: 'Linear Search',
        description: 'A simple search algorithm that checks each element in the list sequentially until a match is found.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(1)',
        averageCase: 'O(n)',
        worstCase: 'O(n)',
        code: {
          javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
          python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
          java: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
          cpp: `int linearSearch(int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
          c: `int linearSearch(int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`
        }
      },
      'binary-search': {
        name: 'Binary Search',
        description: 'A search algorithm that finds the position of a target value within a sorted array.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(1)',
        averageCase: 'O(log n)',
        worstCase: 'O(log n)',
        code: {
          javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
          python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
          java: `public static int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`,
          cpp: `int binarySearch(int arr[], int size, int target) {
    int left = 0;
    int right = size - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`,
          c: `int binarySearch(int arr[], int size, int target) {
    int left = 0;
    int right = size - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`
        }
      },
      'ternary-search': {
        name: 'Ternary Search',
        description: 'A divide and conquer algorithm that divides the search space into three parts.',
        timeComplexity: 'O(log₃ n)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(1)',
        averageCase: 'O(log₃ n)',
        worstCase: 'O(log₃ n)',
        code: `function ternarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  
  const mid1 = left + Math.floor((right - left) / 3);
  const mid2 = right - Math.floor((right - left) / 3);
  
  if (arr[mid1] === target) return mid1;
  if (arr[mid2] === target) return mid2;
  
  if (target < arr[mid1]) {
    return ternarySearch(arr, target, left, mid1 - 1);
  } else if (target > arr[mid2]) {
    return ternarySearch(arr, target, mid2 + 1, right);
  } else {
    return ternarySearch(arr, target, mid1 + 1, mid2 - 1);
  }
}`
      },
      'bfs': {
        name: 'Breadth-First Search',
        description: 'A graph traversal algorithm that explores all vertices at the present depth level before moving to the next level.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        bestCase: 'O(V + E)',
        averageCase: 'O(V + E)',
        worstCase: 'O(V + E)',
        code: {
          javascript: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);
    
    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`,
          python: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    result = []
    
    visited.add(start)
    
    while queue:
        current = queue.popleft()
        result.append(current)
        
        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result`,
          java: `import java.util.*;

public static List<String> bfs(Map<String, List<String>> graph, String start) {
    Set<String> visited = new HashSet<>();
    Queue<String> queue = new LinkedList<>();
    List<String> result = new ArrayList<>();
    
    visited.add(start);
    queue.offer(start);
    
    while (!queue.isEmpty()) {
        String current = queue.poll();
        result.add(current);
        
        for (String neighbor : graph.getOrDefault(current, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.offer(neighbor);
            }
        }
    }
    
    return result;
}`,
          cpp: `#include <queue>
#include <unordered_set>
#include <vector>

vector<string> bfs(unordered_map<string, vector<string>>& graph, string start) {
    unordered_set<string> visited;
    queue<string> q;
    vector<string> result;
    
    visited.insert(start);
    q.push(start);
    
    while (!q.empty()) {
        string current = q.front();
        q.pop();
        result.push_back(current);
        
        for (const string& neighbor : graph[current]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    
    return result;
}`,
          c: `// BFS in C requires manual implementation of queue and hash set
// This is a simplified version assuming adjacency matrix

void bfs(int graph[][MAX_SIZE], int start, int n, int visited[]) {
    int queue[MAX_SIZE];
    int front = 0, rear = 0;
    
    visited[start] = 1;
    queue[rear++] = start;
    
    while (front < rear) {
        int current = queue[front++];
        printf("%d ", current);
        
        for (int i = 0; i < n; i++) {
            if (graph[current][i] && !visited[i]) {
                visited[i] = 1;
                queue[rear++] = i;
            }
        }
    }
}`
        }
      },
      'dfs': {
        name: 'Depth-First Search',
        description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        bestCase: 'O(V + E)',
        averageCase: 'O(V + E)',
        worstCase: 'O(V + E)',
        code: {
          javascript: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  const result = [start];
  
  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      result.push(...dfs(graph, neighbor, visited));
    }
  }
  
  return result;
}`,
          python: `def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    result = [start]
    
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            result.extend(dfs(graph, neighbor, visited))
    
    return result`,
          java: `public static List<String> dfs(Map<String, List<String>> graph, String start) {
    Set<String> visited = new HashSet<>();
    List<String> result = new ArrayList<>();
    dfsHelper(graph, start, visited, result);
    return result;
}

private static void dfsHelper(Map<String, List<String>> graph, String node, 
                             Set<String> visited, List<String> result) {
    visited.add(node);
    result.add(node);
    
    for (String neighbor : graph.getOrDefault(node, new ArrayList<>())) {
        if (!visited.contains(neighbor)) {
            dfsHelper(graph, neighbor, visited, result);
        }
    }
}`,
          cpp: `void dfs(unordered_map<string, vector<string>>& graph, string start, 
         unordered_set<string>& visited, vector<string>& result) {
    visited.insert(start);
    result.push_back(start);
    
    for (const string& neighbor : graph[start]) {
        if (visited.find(neighbor) == visited.end()) {
            dfs(graph, neighbor, visited, result);
        }
    }
}`,
          c: `// DFS in C requires manual implementation of stack and hash set
// This is a simplified version using recursion

void dfs(int graph[][MAX_SIZE], int start, int n, int visited[], int result[], int* resultIndex) {
    visited[start] = 1;
    result[(*resultIndex)++] = start;
    
    for (int i = 0; i < n; i++) {
        if (graph[start][i] && !visited[i]) {
            dfs(graph, i, n, visited, result, resultIndex);
        }
    }
}`
        }
      },
      'dijkstra': {
        name: "Dijkstra's Algorithm",
        description: 'An algorithm for finding the shortest paths between nodes in a weighted graph.',
        timeComplexity: 'O((V + E) log V)',
        spaceComplexity: 'O(V)',
        bestCase: 'O((V + E) log V)',
        averageCase: 'O((V + E) log V)',
        worstCase: 'O((V + E) log V)',
        code: `function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  
  // Initialize distances
  for (const vertex in graph) {
    distances[vertex] = Infinity;
  }
  distances[start] = 0;
  
  while (visited.size < Object.keys(graph).length) {
    const current = getMinDistance(distances, visited);
    visited.add(current);
    
    for (const neighbor in graph[current]) {
      const newDistance = distances[current] + graph[current][neighbor];
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
      }
    }
  }
  
  return distances;
}`
      },
      'prim': {
        name: "Prim's Algorithm",
        description: 'A greedy algorithm that finds a minimum spanning tree for a weighted undirected graph.',
        timeComplexity: 'O(V²)',
        spaceComplexity: 'O(V)',
        bestCase: 'O(V²)',
        averageCase: 'O(V²)',
        worstCase: 'O(V²)'
      },
      'kruskal': {
        name: "Kruskal's Algorithm",
        description: 'A greedy algorithm that finds a minimum spanning tree by sorting edges by weight.',
        timeComplexity: 'O(E log E)',
        spaceComplexity: 'O(V)',
        bestCase: 'O(E log E)',
        averageCase: 'O(E log E)',
        worstCase: 'O(E log E)'
      },
      'inorder': {
        name: 'Inorder Traversal',
        description: 'A tree traversal algorithm that visits left subtree, root, then right subtree.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)',
        bestCase: 'O(n)',
        averageCase: 'O(n)',
        worstCase: 'O(n)',
        code: `function inorderTraversal(root) {
  const result = [];
  
  function inorder(node) {
    if (node) {
      inorder(node.left);   // Visit left subtree
      result.push(node.val); // Visit root
      inorder(node.right);  // Visit right subtree
    }
  }
  
  inorder(root);
  return result;
}`
      },
      'preorder': {
        name: 'Preorder Traversal',
        description: 'A tree traversal algorithm that visits root, left subtree, then right subtree.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)',
        bestCase: 'O(n)',
        averageCase: 'O(n)',
        worstCase: 'O(n)',
        code: `function preorderTraversal(root) {
  const result = [];
  
  function preorder(node) {
    if (node) {
      result.push(node.val); // Visit root
      preorder(node.left);   // Visit left subtree
      preorder(node.right);  // Visit right subtree
    }
  }
  
  preorder(root);
  return result;
}`
      },
      'postorder': {
        name: 'Postorder Traversal',
        description: 'A tree traversal algorithm that visits left subtree, right subtree, then root.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(h)',
        bestCase: 'O(n)',
        averageCase: 'O(n)',
        worstCase: 'O(n)',
        code: `function postorderTraversal(root) {
  const result = [];
  
  function postorder(node) {
    if (node) {
      postorder(node.left);  // Visit left subtree
      postorder(node.right); // Visit right subtree
      result.push(node.val); // Visit root
    }
  }
  
  postorder(root);
  return result;
}`
      },
      'bst-insert': {
        name: 'BST Insertion',
        description: 'An algorithm to insert a new node into a binary search tree while maintaining the BST property.',
        timeComplexity: 'O(h)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(log n)',
        averageCase: 'O(log n)',
        worstCase: 'O(n)'
      },
      'bst-search': {
        name: 'BST Search',
        description: 'An algorithm to search for a value in a binary search tree.',
        timeComplexity: 'O(h)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(log n)',
        averageCase: 'O(log n)',
        worstCase: 'O(n)'
      },
      'fibonacci': {
        name: 'Fibonacci Sequence',
        description: 'A dynamic programming algorithm to compute the nth Fibonacci number using memoization.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        bestCase: 'O(n)',
        averageCase: 'O(n)',
        worstCase: 'O(n)',
        code: `function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}`
      },
      'knapsack': {
        name: '0/1 Knapsack Problem',
        description: 'A dynamic programming algorithm to solve the knapsack problem with optimal substructure.',
        timeComplexity: 'O(nW)',
        spaceComplexity: 'O(nW)',
        bestCase: 'O(nW)',
        averageCase: 'O(nW)',
        worstCase: 'O(nW)',
        code: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}`
      },
      'matrix-chain': {
        name: 'Matrix Chain Multiplication',
        description: 'A dynamic programming algorithm to find the optimal way to multiply a sequence of matrices.',
        timeComplexity: 'O(n³)',
        spaceComplexity: 'O(n²)',
        bestCase: 'O(n³)',
        averageCase: 'O(n³)',
        worstCase: 'O(n³)'
      },
      // Advanced Sorting Algorithms
      'radix-sort': {
        name: 'Radix Sort',
        description: 'A non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by individual digits.',
        timeComplexity: 'O(d(n+k))',
        spaceComplexity: 'O(n+k)',
        bestCase: 'O(d(n+k))',
        averageCase: 'O(d(n+k))',
        worstCase: 'O(d(n+k))',
        code: {
          javascript: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  return arr;
}

function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  
  for (let i = 0; i < n; i++) {
    count[Math.floor(arr[i] / exp) % 10]++;
  }
  
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  for (let i = n - 1; i >= 0; i--) {
    output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
    count[Math.floor(arr[i] / exp) % 10]--;
  }
  
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}`,
          python: `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

def counting_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    
    for i in range(n):
        count[(arr[i] // exp) % 10] += 1
    
    for i in range(1, 10):
        count[i] += count[i - 1]
    
    for i in range(n - 1, -1, -1):
        output[count[(arr[i] // exp) % 10] - 1] = arr[i]
        count[(arr[i] // exp) % 10] -= 1
    
    for i in range(n):
        arr[i] = output[i]`,
          java: `public static void radixSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    for (int exp = 1; max / exp > 0; exp *= 10) {
        countingSortByDigit(arr, exp);
    }
}

public static void countingSortByDigit(int[] arr, int exp) {
    int n = arr.length;
    int[] output = new int[n];
    int[] count = new int[10];
    
    for (int i = 0; i < n; i++) {
        count[(arr[i] / exp) % 10]++;
    }
    
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}`,
          cpp: `void radixSort(int arr[], int n) {
    int max = *max_element(arr, arr + n);
    for (int exp = 1; max / exp > 0; exp *= 10) {
        countingSortByDigit(arr, n, exp);
    }
}

void countingSortByDigit(int arr[], int n, int exp) {
    int output[n];
    int count[10] = {0};
    
    for (int i = 0; i < n; i++) {
        count[(arr[i] / exp) % 10]++;
    }
    
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}`,
          c: `void radixSort(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
    }
    
    for (int exp = 1; max / exp > 0; exp *= 10) {
        countingSortByDigit(arr, n, exp);
    }
}

void countingSortByDigit(int arr[], int n, int exp) {
    int output[n];
    int count[10] = {0};
    
    for (int i = 0; i < n; i++) {
        count[(arr[i] / exp) % 10]++;
    }
    
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }
}`
        }
      },
      'counting-sort': {
        name: 'Counting Sort',
        description: 'A stable sorting algorithm that works by counting the number of objects having distinct key values.',
        timeComplexity: 'O(n+k)',
        spaceComplexity: 'O(k)',
        bestCase: 'O(n+k)',
        averageCase: 'O(n+k)',
        worstCase: 'O(n+k)',
        code: {
          javascript: `function countingSort(arr) {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
  }
  
  let index = 0;
  for (let i = 0; i <= max; i++) {
    while (count[i] > 0) {
      arr[index] = i;
      index++;
      count[i]--;
    }
  }
  return arr;
}`,
          python: `def counting_sort(arr):
    max_val = max(arr)
    count = [0] * (max_val + 1)
    
    for num in arr:
        count[num] += 1
    
    index = 0
    for i in range(len(count)):
        while count[i] > 0:
            arr[index] = i
            index += 1
            count[i] -= 1
    return arr`,
          java: `public static void countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    int[] count = new int[max + 1];
    
    for (int num : arr) {
        count[num]++;
    }
    
    int index = 0;
    for (int i = 0; i <= max; i++) {
        while (count[i] > 0) {
            arr[index] = i;
            index++;
            count[i]--;
        }
    }
}`,
          cpp: `void countingSort(int arr[], int n) {
    int max = *max_element(arr, arr + n);
    int count[max + 1] = {0};
    
    for (int i = 0; i < n; i++) {
        count[arr[i]]++;
    }
    
    int index = 0;
    for (int i = 0; i <= max; i++) {
        while (count[i] > 0) {
            arr[index] = i;
            index++;
            count[i]--;
        }
    }
}`,
          c: `void countingSort(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
    }
    
    int count[max + 1];
    for (int i = 0; i <= max; i++) {
        count[i] = 0;
    }
    
    for (int i = 0; i < n; i++) {
        count[arr[i]]++;
    }
    
    int index = 0;
    for (int i = 0; i <= max; i++) {
        while (count[i] > 0) {
            arr[index] = i;
            index++;
            count[i]--;
        }
    }
}`
        }
      },
      'bucket-sort': {
        name: 'Bucket Sort',
        description: 'A sorting algorithm that works by distributing the elements of an array into a number of buckets.',
        timeComplexity: 'O(n+k)',
        spaceComplexity: 'O(n+k)',
        bestCase: 'O(n+k)',
        averageCase: 'O(n+k)',
        worstCase: 'O(n²)',
        code: {
          javascript: `function bucketSort(arr) {
  const n = arr.length;
  const buckets = Array.from({ length: n }, () => []);
  
  for (let i = 0; i < n; i++) {
    const bucketIndex = Math.floor(n * arr[i]);
    buckets[bucketIndex].push(arr[i]);
  }
  
  for (let i = 0; i < n; i++) {
    buckets[i].sort((a, b) => a - b);
  }
  
  let index = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      arr[index] = buckets[i][j];
      index++;
    }
  }
  return arr;
}`,
          python: `def bucket_sort(arr):
    n = len(arr)
    buckets = [[] for _ in range(n)]
    
    for num in arr:
        bucket_index = int(n * num)
        buckets[bucket_index].append(num)
    
    for i in range(n):
        buckets[i].sort()
    
    index = 0
    for i in range(n):
        for j in range(len(buckets[i])):
            arr[index] = buckets[i][j]
            index += 1
    return arr`,
          java: `public static void bucketSort(double[] arr) {
    int n = arr.length;
    List<List<Double>> buckets = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        buckets.add(new ArrayList<>());
    }
    
    for (double num : arr) {
        int bucketIndex = (int) (n * num);
        buckets.get(bucketIndex).add(num);
    }
    
    for (List<Double> bucket : buckets) {
        Collections.sort(bucket);
    }
    
    int index = 0;
    for (List<Double> bucket : buckets) {
        for (double num : bucket) {
            arr[index] = num;
            index++;
        }
    }
}`,
          cpp: `void bucketSort(double arr[], int n) {
    vector<vector<double>> buckets(n);
    
    for (int i = 0; i < n; i++) {
        int bucketIndex = n * arr[i];
        buckets[bucketIndex].push_back(arr[i]);
    }
    
    for (int i = 0; i < n; i++) {
        sort(buckets[i].begin(), buckets[i].end());
    }
    
    int index = 0;
    for (int i = 0; i < n; i++) {
        for (double num : buckets[i]) {
            arr[index] = num;
            index++;
        }
    }
}`,
          c: `void bucketSort(double arr[], int n) {
    double buckets[n][n];
    int bucketSizes[n];
    
    for (int i = 0; i < n; i++) {
        bucketSizes[i] = 0;
    }
    
    for (int i = 0; i < n; i++) {
        int bucketIndex = (int)(n * arr[i]);
        buckets[bucketIndex][bucketSizes[bucketIndex]] = arr[i];
        bucketSizes[bucketIndex]++;
    }
    
    for (int i = 0; i < n; i++) {
        qsort(buckets[i], bucketSizes[i], sizeof(double), compare);
    }
    
    int index = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < bucketSizes[i]; j++) {
            arr[index] = buckets[i][j];
            index++;
        }
    }
}`
        }
      },
      // Advanced Graph Algorithms
      'a-star': {
        name: 'A* Search',
        description: 'A pathfinding algorithm that uses heuristics to find the shortest path between two points.',
        timeComplexity: 'O(b^d)',
        spaceComplexity: 'O(b^d)',
        bestCase: 'O(b^d)',
        averageCase: 'O(b^d)',
        worstCase: 'O(b^d)',
        code: {
          javascript: `function aStar(start, goal, graph) {
  const openSet = [start];
  const closedSet = new Set();
  const gScore = new Map();
  const fScore = new Map();
  const cameFrom = new Map();
  
  gScore.set(start, 0);
  fScore.set(start, heuristic(start, goal));
  
  while (openSet.length > 0) {
    const current = openSet.reduce((min, node) => 
      fScore.get(node) < fScore.get(min) ? node : min
    );
    
    if (current === goal) {
      return reconstructPath(cameFrom, current);
    }
    
    openSet.splice(openSet.indexOf(current), 1);
    closedSet.add(current);
    
    for (const neighbor of getNeighbors(current, graph)) {
      if (closedSet.has(neighbor)) continue;
      
      const tentativeG = gScore.get(current) + getDistance(current, neighbor);
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= gScore.get(neighbor)) {
        continue;
      }
      
      cameFrom.set(neighbor, current);
      gScore.set(neighbor, tentativeG);
      fScore.set(neighbor, gScore.get(neighbor) + heuristic(neighbor, goal));
    }
  }
  
  return null; // No path found
}`,
          python: `def a_star(start, goal, graph):
    open_set = [start]
    closed_set = set()
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}
    came_from = {}
    
    while open_set:
        current = min(open_set, key=lambda x: f_score.get(x, float('inf')))
        
        if current == goal:
            return reconstruct_path(came_from, current)
        
        open_set.remove(current)
        closed_set.add(current)
        
        for neighbor in get_neighbors(current, graph):
            if neighbor in closed_set:
                continue
            
            tentative_g = g_score[current] + get_distance(current, neighbor)
            
            if neighbor not in open_set:
                open_set.append(neighbor)
            elif tentative_g >= g_score.get(neighbor, float('inf')):
                continue
            
            came_from[neighbor] = current
            g_score[neighbor] = tentative_g
            f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, goal)
    
    return None`,
          java: `public static List<Node> aStar(Node start, Node goal, Graph graph) {
    PriorityQueue<Node> openSet = new PriorityQueue<>(Comparator.comparingDouble(n -> fScore.get(n)));
    Set<Node> closedSet = new HashSet<>();
    Map<Node, Double> gScore = new HashMap<>();
    Map<Node, Double> fScore = new HashMap<>();
    Map<Node, Node> cameFrom = new HashMap<>();
    
    gScore.put(start, 0.0);
    fScore.put(start, heuristic(start, goal));
    openSet.add(start);
    
    while (!openSet.isEmpty()) {
        Node current = openSet.poll();
        
        if (current.equals(goal)) {
            return reconstructPath(cameFrom, current);
        }
        
        closedSet.add(current);
        
        for (Node neighbor : getNeighbors(current, graph)) {
            if (closedSet.contains(neighbor)) continue;
            
            double tentativeG = gScore.get(current) + getDistance(current, neighbor);
            
            if (!openSet.contains(neighbor)) {
                openSet.add(neighbor);
            } else if (tentativeG >= gScore.getOrDefault(neighbor, Double.MAX_VALUE)) {
                continue;
            }
            
            cameFrom.put(neighbor, current);
            gScore.put(neighbor, tentativeG);
            fScore.put(neighbor, gScore.get(neighbor) + heuristic(neighbor, goal));
        }
    }
    
    return null;
}`,
          cpp: `vector<Node> aStar(Node start, Node goal, Graph& graph) {
    priority_queue<Node, vector<Node>, CompareNode> openSet;
    set<Node> closedSet;
    map<Node, double> gScore;
    map<Node, double> fScore;
    map<Node, Node> cameFrom;
    
    gScore[start] = 0;
    fScore[start] = heuristic(start, goal);
    openSet.push(start);
    
    while (!openSet.empty()) {
        Node current = openSet.top();
        openSet.pop();
        
        if (current == goal) {
            return reconstructPath(cameFrom, current);
        }
        
        closedSet.insert(current);
        
        for (Node neighbor : getNeighbors(current, graph)) {
            if (closedSet.find(neighbor) != closedSet.end()) continue;
            
            double tentativeG = gScore[current] + getDistance(current, neighbor);
            
            if (gScore.find(neighbor) == gScore.end()) {
                gScore[neighbor] = numeric_limits<double>::max();
            }
            
            if (tentativeG >= gScore[neighbor]) continue;
            
            cameFrom[neighbor] = current;
            gScore[neighbor] = tentativeG;
            fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal);
            openSet.push(neighbor);
        }
    }
    
    return {};
}`,
          c: `typedef struct {
    int x, y;
    double g, h, f;
    int parent_x, parent_y;
} Node;

Node* aStar(Node start, Node goal, Graph* graph) {
    Node* openSet = malloc(MAX_NODES * sizeof(Node));
    Node* closedSet = malloc(MAX_NODES * sizeof(Node));
    int openCount = 0, closedCount = 0;
    
    start.g = 0;
    start.h = heuristic(start, goal);
    start.f = start.g + start.h;
    openSet[openCount++] = start;
    
    while (openCount > 0) {
        Node current = openSet[0];
        int currentIndex = 0;
        
        for (int i = 1; i < openCount; i++) {
            if (openSet[i].f < current.f) {
                current = openSet[i];
                currentIndex = i;
            }
        }
        
        if (current.x == goal.x && current.y == goal.y) {
            return reconstructPath(current);
        }
        
        for (int i = currentIndex; i < openCount - 1; i++) {
            openSet[i] = openSet[i + 1];
        }
        openCount--;
        
        closedSet[closedCount++] = current;
        
        for (int i = 0; i < 8; i++) {
            Node neighbor = {current.x + dx[i], current.y + dy[i]};
            if (isValid(neighbor, graph) && !inSet(neighbor, closedSet, closedCount)) {
                double tentativeG = current.g + getDistance(current, neighbor);
                
                if (!inSet(neighbor, openSet, openCount) || tentativeG < neighbor.g) {
                    neighbor.parent_x = current.x;
                    neighbor.parent_y = current.y;
                    neighbor.g = tentativeG;
                    neighbor.h = heuristic(neighbor, goal);
                    neighbor.f = neighbor.g + neighbor.h;
                    
                    if (!inSet(neighbor, openSet, openCount)) {
                        openSet[openCount++] = neighbor;
                    }
                }
            }
        }
    }
    
    return NULL;
}`
        }
      },
      'bellman-ford': {
        name: 'Bellman-Ford',
        description: 'An algorithm that finds shortest paths from a source vertex to all other vertices, even with negative edge weights.',
        timeComplexity: 'O(VE)',
        spaceComplexity: 'O(V)',
        bestCase: 'O(VE)',
        averageCase: 'O(VE)',
        worstCase: 'O(VE)',
        code: {
          javascript: `function bellmanFord(graph, source) {
  const distances = {};
  const predecessors = {};
  
  // Initialize distances
  for (const vertex of Object.keys(graph)) {
    distances[vertex] = Infinity;
    predecessors[vertex] = null;
  }
  distances[source] = 0;
  
  // Relax edges V-1 times
  for (let i = 0; i < Object.keys(graph).length - 1; i++) {
    for (const [u, edges] of Object.entries(graph)) {
      for (const { v, weight } of edges) {
        if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
          distances[v] = distances[u] + weight;
          predecessors[v] = u;
        }
      }
    }
  }
  
  // Check for negative cycles
  for (const [u, edges] of Object.entries(graph)) {
    for (const { v, weight } of edges) {
      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        throw new Error('Negative cycle detected');
      }
    }
  }
  
  return { distances, predecessors };
}`,
          python: `def bellman_ford(graph, source):
    distances = {vertex: float('inf') for vertex in graph}
    predecessors = {vertex: None for vertex in graph}
    distances[source] = 0
    
    # Relax edges V-1 times
    for _ in range(len(graph) - 1):
        for u in graph:
            for v, weight in graph[u]:
                if distances[u] != float('inf') and distances[u] + weight < distances[v]:
                    distances[v] = distances[u] + weight
                    predecessors[v] = u
    
    # Check for negative cycles
    for u in graph:
        for v, weight in graph[u]:
            if distances[u] != float('inf') and distances[u] + weight < distances[v]:
                raise ValueError("Negative cycle detected")
    
    return distances, predecessors`,
          java: `public static Map<String, Integer> bellmanFord(Map<String, List<Edge>> graph, String source) {
    Map<String, Integer> distances = new HashMap<>();
    Map<String, String> predecessors = new HashMap<>();
    
    for (String vertex : graph.keySet()) {
        distances.put(vertex, Integer.MAX_VALUE);
        predecessors.put(vertex, null);
    }
    distances.put(source, 0);
    
    for (int i = 0; i < graph.size() - 1; i++) {
        for (String u : graph.keySet()) {
            for (Edge edge : graph.get(u)) {
                String v = edge.destination;
                int weight = edge.weight;
                
                if (distances.get(u) != Integer.MAX_VALUE && 
                    distances.get(u) + weight < distances.get(v)) {
                    distances.put(v, distances.get(u) + weight);
                    predecessors.put(v, u);
                }
            }
        }
    }
    
    // Check for negative cycles
    for (String u : graph.keySet()) {
        for (Edge edge : graph.get(u)) {
            String v = edge.destination;
            int weight = edge.weight;
            
            if (distances.get(u) != Integer.MAX_VALUE && 
                distances.get(u) + weight < distances.get(v)) {
                throw new RuntimeException("Negative cycle detected");
            }
        }
    }
    
    return distances;
}`,
          cpp: `vector<int> bellmanFord(vector<vector<pair<int, int>>>& graph, int source) {
    int V = graph.size();
    vector<int> distances(V, INT_MAX);
    vector<int> predecessors(V, -1);
    
    distances[source] = 0;
    
    for (int i = 0; i < V - 1; i++) {
        for (int u = 0; u < V; u++) {
            for (auto& edge : graph[u]) {
                int v = edge.first;
                int weight = edge.second;
                
                if (distances[u] != INT_MAX && distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;
                    predecessors[v] = u;
                }
            }
        }
    }
    
    // Check for negative cycles
    for (int u = 0; u < V; u++) {
        for (auto& edge : graph[u]) {
            int v = edge.first;
            int weight = edge.second;
            
            if (distances[u] != INT_MAX && distances[u] + weight < distances[v]) {
                throw runtime_error("Negative cycle detected");
            }
        }
    }
    
    return distances;
}`,
          c: `void bellmanFord(int graph[][MAX_VERTICES], int V, int source, int distances[]) {
    for (int i = 0; i < V; i++) {
        distances[i] = INT_MAX;
    }
    distances[source] = 0;
    
    for (int i = 0; i < V - 1; i++) {
        for (int u = 0; u < V; u++) {
            for (int v = 0; v < V; v++) {
                if (graph[u][v] != 0 && distances[u] != INT_MAX && 
                    distances[u] + graph[u][v] < distances[v]) {
                    distances[v] = distances[u] + graph[u][v];
                }
            }
        }
    }
    
    // Check for negative cycles
    for (int u = 0; u < V; u++) {
        for (int v = 0; v < V; v++) {
            if (graph[u][v] != 0 && distances[u] != INT_MAX && 
                distances[u] + graph[u][v] < distances[v]) {
                printf("Negative cycle detected\\n");
                return;
            }
        }
    }
}`
        }
      },
      'floyd-warshall': {
        name: 'Floyd-Warshall',
        description: 'An algorithm for finding shortest paths in a weighted graph with positive or negative edge weights.',
        timeComplexity: 'O(V³)',
        spaceComplexity: 'O(V²)',
        bestCase: 'O(V³)',
        averageCase: 'O(V³)',
        worstCase: 'O(V³)',
        code: {
          javascript: `function floydWarshall(graph) {
  const V = graph.length;
  const dist = Array(V).fill().map(() => Array(V).fill(Infinity));
  const next = Array(V).fill().map(() => Array(V).fill(null));
  
  // Initialize distances
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) {
      if (i === j) {
        dist[i][j] = 0;
      } else if (graph[i][j] !== 0) {
        dist[i][j] = graph[i][j];
        next[i][j] = j;
      }
    }
  }
  
  // Floyd-Warshall algorithm
  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }
  
  return { dist, next };
}`,
          python: `def floyd_warshall(graph):
    V = len(graph)
    dist = [[float('inf')] * V for _ in range(V)]
    next_vertex = [[None] * V for _ in range(V)]
    
    # Initialize distances
    for i in range(V):
        for j in range(V):
            if i == j:
                dist[i][j] = 0
            elif graph[i][j] != 0:
                dist[i][j] = graph[i][j]
                next_vertex[i][j] = j
    
    # Floyd-Warshall algorithm
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    next_vertex[i][j] = next_vertex[i][k]
    
    return dist, next_vertex`,
          java: `public static int[][] floydWarshall(int[][] graph) {
    int V = graph.length;
    int[][] dist = new int[V][V];
    int[][] next = new int[V][V];
    
    // Initialize distances
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (i == j) {
                dist[i][j] = 0;
            } else if (graph[i][j] != 0) {
                dist[i][j] = graph[i][j];
                next[i][j] = j;
            } else {
                dist[i][j] = Integer.MAX_VALUE;
            }
        }
    }
    
    // Floyd-Warshall algorithm
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != Integer.MAX_VALUE && dist[k][j] != Integer.MAX_VALUE &&
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
    }
    
    return dist;
}`,
          cpp: `vector<vector<int>> floydWarshall(vector<vector<int>>& graph) {
    int V = graph.size();
    vector<vector<int>> dist(V, vector<int>(V, INT_MAX));
    vector<vector<int>> next(V, vector<int>(V, -1));
    
    // Initialize distances
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (i == j) {
                dist[i][j] = 0;
            } else if (graph[i][j] != 0) {
                dist[i][j] = graph[i][j];
                next[i][j] = j;
            }
        }
    }
    
    // Floyd-Warshall algorithm
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX &&
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
    }
    
    return dist;
}`,
          c: `void floydWarshall(int graph[][MAX_VERTICES], int V, int dist[][MAX_VERTICES]) {
    // Initialize distances
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (i == j) {
                dist[i][j] = 0;
            } else if (graph[i][j] != 0) {
                dist[i][j] = graph[i][j];
            } else {
                dist[i][j] = INT_MAX;
            }
        }
    }
    
    // Floyd-Warshall algorithm
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX &&
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
}`
        }
      },
      // String Algorithms
      'kmp': {
        name: 'KMP Pattern Matching',
        description: 'An efficient string searching algorithm that uses the failure function to avoid unnecessary comparisons.',
        timeComplexity: 'O(n+m)',
        spaceComplexity: 'O(m)',
        bestCase: 'O(n+m)',
        averageCase: 'O(n+m)',
        worstCase: 'O(n+m)',
        code: {
          javascript: `function kmpSearch(text, pattern) {
  const lps = computeLPSArray(pattern);
  const result = [];
  let i = 0; // index for text
  let j = 0; // index for pattern
  
  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }
    
    if (j === pattern.length) {
      result.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
  
  return result;
}

function computeLPSArray(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;
  
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  
  return lps;
}`,
          python: `def kmp_search(text, pattern):
    lps = compute_lps_array(pattern)
    result = []
    i = j = 0
    
    while i < len(text):
        if pattern[j] == text[i]:
            i += 1
            j += 1
        
        if j == len(pattern):
            result.append(i - j)
            j = lps[j - 1]
        elif i < len(text) and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    
    return result

def compute_lps_array(pattern):
    lps = [0] * len(pattern)
    length = 0
    i = 1
    
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    
    return lps`,
          java: `public static List<Integer> kmpSearch(String text, String pattern) {
    int[] lps = computeLPSArray(pattern);
    List<Integer> result = new ArrayList<>();
    int i = 0, j = 0;
    
    while (i < text.length()) {
        if (pattern.charAt(j) == text.charAt(i)) {
            i++;
            j++;
        }
        
        if (j == pattern.length()) {
            result.add(i - j);
            j = lps[j - 1];
        } else if (i < text.length() && pattern.charAt(j) != text.charAt(i)) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return result;
}

public static int[] computeLPSArray(String pattern) {
    int[] lps = new int[pattern.length()];
    int len = 0;
    int i = 1;
    
    while (i < pattern.length()) {
        if (pattern.charAt(i) == pattern.charAt(len)) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}`,
          cpp: `vector<int> kmpSearch(string text, string pattern) {
    vector<int> lps = computeLPSArray(pattern);
    vector<int> result;
    int i = 0, j = 0;
    
    while (i < text.length()) {
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }
        
        if (j == pattern.length()) {
            result.push_back(i - j);
            j = lps[j - 1];
        } else if (i < text.length() && pattern[j] != text[i]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return result;
}

vector<int> computeLPSArray(string pattern) {
    vector<int> lps(pattern.length(), 0);
    int len = 0;
    int i = 1;
    
    while (i < pattern.length()) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}`,
          c: `int* kmpSearch(char* text, char* pattern) {
    int* lps = computeLPSArray(pattern);
    int* result = malloc(MAX_RESULTS * sizeof(int));
    int resultCount = 0;
    int i = 0, j = 0;
    
    while (text[i] != '\\0') {
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }
        
        if (pattern[j] == '\\0') {
            result[resultCount++] = i - j;
            j = lps[j - 1];
        } else if (text[i] != '\\0' && pattern[j] != text[i]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    result[resultCount] = -1; // Sentinel
    free(lps);
    return result;
}

int* computeLPSArray(char* pattern) {
    int len = strlen(pattern);
    int* lps = malloc(len * sizeof(int));
    int length = 0;
    int i = 1;
    
    lps[0] = 0;
    
    while (i < len) {
        if (pattern[i] == pattern[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length != 0) {
                length = lps[length - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}`
        }
      },
      'rabin-karp': {
        name: 'Rabin-Karp',
        description: 'A string searching algorithm that uses rolling hash to find patterns in text.',
        timeComplexity: 'O(n+m)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(n+m)',
        averageCase: 'O(n+m)',
        worstCase: 'O(nm)',
        code: {
          javascript: `function rabinKarp(text, pattern) {
  const result = [];
  const d = 256; // Number of characters in alphabet
  const q = 101; // Prime number
  const m = pattern.length;
  const n = text.length;
  let h = 1;
  
  // Calculate h = d^(m-1) % q
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }
  
  let p = 0; // Hash value for pattern
  let t = 0; // Hash value for text
  
  // Calculate hash value of pattern and first window of text
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }
  
  // Slide the pattern over text
  for (let i = 0; i <= n - m; i++) {
    if (p === t) {
      // Check characters one by one
      let j;
      for (j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) break;
      }
      
      if (j === m) {
        result.push(i);
      }
    }
    
    // Calculate hash value for next window
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t = t + q;
    }
  }
  
  return result;
}`,
          python: `def rabin_karp(text, pattern):
    result = []
    d = 256  # Number of characters in alphabet
    q = 101  # Prime number
    m = len(pattern)
    n = len(text)
    h = 1
    
    # Calculate h = d^(m-1) % q
    for i in range(m - 1):
        h = (h * d) % q
    
    p = 0  # Hash value for pattern
    t = 0  # Hash value for text
    
    # Calculate hash value of pattern and first window of text
    for i in range(m):
        p = (d * p + ord(pattern[i])) % q
        t = (d * t + ord(text[i])) % q
    
    # Slide the pattern over text
    for i in range(n - m + 1):
        if p == t:
            # Check characters one by one
            for j in range(m):
                if text[i + j] != pattern[j]:
                    break
            else:
                result.append(i)
        
        # Calculate hash value for next window
        if i < n - m:
            t = (d * (t - ord(text[i]) * h) + ord(text[i + m])) % q
            if t < 0:
                t = t + q
    
    return result`,
          java: `public static List<Integer> rabinKarp(String text, String pattern) {
    List<Integer> result = new ArrayList<>();
    int d = 256; // Number of characters in alphabet
    int q = 101; // Prime number
    int m = pattern.length();
    int n = text.length();
    int h = 1;
    
    // Calculate h = d^(m-1) % q
    for (int i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }
    
    int p = 0; // Hash value for pattern
    int t = 0; // Hash value for text
    
    // Calculate hash value of pattern and first window of text
    for (int i = 0; i < m; i++) {
        p = (d * p + pattern.charAt(i)) % q;
        t = (d * t + text.charAt(i)) % q;
    }
    
    // Slide the pattern over text
    for (int i = 0; i <= n - m; i++) {
        if (p == t) {
            // Check characters one by one
            int j;
            for (j = 0; j < m; j++) {
                if (text.charAt(i + j) != pattern.charAt(j)) break;
            }
            
            if (j == m) {
                result.add(i);
            }
        }
        
        // Calculate hash value for next window
        if (i < n - m) {
            t = (d * (t - text.charAt(i) * h) + text.charAt(i + m)) % q;
            if (t < 0) t = t + q;
        }
    }
    
    return result;
}`,
          cpp: `vector<int> rabinKarp(string text, string pattern) {
    vector<int> result;
    int d = 256; // Number of characters in alphabet
    int q = 101; // Prime number
    int m = pattern.length();
    int n = text.length();
    int h = 1;
    
    // Calculate h = d^(m-1) % q
    for (int i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }
    
    int p = 0; // Hash value for pattern
    int t = 0; // Hash value for text
    
    // Calculate hash value of pattern and first window of text
    for (int i = 0; i < m; i++) {
        p = (d * p + pattern[i]) % q;
        t = (d * t + text[i]) % q;
    }
    
    // Slide the pattern over text
    for (int i = 0; i <= n - m; i++) {
        if (p == t) {
            // Check characters one by one
            int j;
            for (j = 0; j < m; j++) {
                if (text[i + j] != pattern[j]) break;
            }
            
            if (j == m) {
                result.push_back(i);
            }
        }
        
        // Calculate hash value for next window
        if (i < n - m) {
            t = (d * (t - text[i] * h) + text[i + m]) % q;
            if (t < 0) t = t + q;
        }
    }
    
    return result;
}`,
          c: `int* rabinKarp(char* text, char* pattern) {
    int* result = malloc(MAX_RESULTS * sizeof(int));
    int resultCount = 0;
    int d = 256; // Number of characters in alphabet
    int q = 101; // Prime number
    int m = strlen(pattern);
    int n = strlen(text);
    int h = 1;
    
    // Calculate h = d^(m-1) % q
    for (int i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }
    
    int p = 0; // Hash value for pattern
    int t = 0; // Hash value for text
    
    // Calculate hash value of pattern and first window of text
    for (int i = 0; i < m; i++) {
        p = (d * p + pattern[i]) % q;
        t = (d * t + text[i]) % q;
    }
    
    // Slide the pattern over text
    for (int i = 0; i <= n - m; i++) {
        if (p == t) {
            // Check characters one by one
            int j;
            for (j = 0; j < m; j++) {
                if (text[i + j] != pattern[j]) break;
            }
            
            if (j == m) {
                result[resultCount++] = i;
            }
        }
        
        // Calculate hash value for next window
        if (i < n - m) {
            t = (d * (t - text[i] * h) + text[i + m]) % q;
            if (t < 0) t = t + q;
        }
    }
    
    result[resultCount] = -1; // Sentinel
    return result;
}`
        }
      },
      'z-algorithm': {
        name: 'Z-Algorithm',
        description: 'A linear time pattern matching algorithm that constructs a Z-array to find all occurrences of a pattern.',
        timeComplexity: 'O(n+m)',
        spaceComplexity: 'O(n+m)',
        bestCase: 'O(n+m)',
        averageCase: 'O(n+m)',
        worstCase: 'O(n+m)',
        code: {
          javascript: `function zAlgorithm(text, pattern) {
  const combined = pattern + '$' + text;
  const z = computeZArray(combined);
  const result = [];
  const m = pattern.length;
  
  for (let i = m + 1; i < z.length; i++) {
    if (z[i] === m) {
      result.push(i - m - 1);
    }
  }
  
  return result;
}

function computeZArray(str) {
  const n = str.length;
  const z = new Array(n).fill(0);
  let l = 0, r = 0;
  
  for (let i = 1; i < n; i++) {
    if (i <= r) {
      z[i] = Math.min(r - i + 1, z[i - l]);
    }
    
    while (i + z[i] < n && str[z[i]] === str[i + z[i]]) {
      z[i]++;
    }
    
    if (i + z[i] - 1 > r) {
      l = i;
      r = i + z[i] - 1;
    }
  }
  
  return z;
}`,
          python: `def z_algorithm(text, pattern):
    combined = pattern + '$' + text
    z = compute_z_array(combined)
    result = []
    m = len(pattern)
    
    for i in range(m + 1, len(z)):
        if z[i] == m:
            result.append(i - m - 1)
    
    return result

def compute_z_array(s):
    n = len(s)
    z = [0] * n
    l = r = 0
    
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        
        if i + z[i] - 1 > r:
            l = i
            r = i + z[i] - 1
    
    return z`,
          java: `public static List<Integer> zAlgorithm(String text, String pattern) {
    String combined = pattern + "$" + text;
    int[] z = computeZArray(combined);
    List<Integer> result = new ArrayList<>();
    int m = pattern.length();
    
    for (int i = m + 1; i < z.length; i++) {
        if (z[i] == m) {
            result.add(i - m - 1);
        }
    }
    
    return result;
}

public static int[] computeZArray(String str) {
    int n = str.length();
    int[] z = new int[n];
    int l = 0, r = 0;
    
    for (int i = 1; i < n; i++) {
        if (i <= r) {
            z[i] = Math.min(r - i + 1, z[i - l]);
        }
        
        while (i + z[i] < n && str.charAt(z[i]) == str.charAt(i + z[i])) {
            z[i]++;
        }
        
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    
    return z;
}`,
          cpp: `vector<int> zAlgorithm(string text, string pattern) {
    string combined = pattern + "$" + text;
    vector<int> z = computeZArray(combined);
    vector<int> result;
    int m = pattern.length();
    
    for (int i = m + 1; i < z.size(); i++) {
        if (z[i] == m) {
            result.push_back(i - m - 1);
        }
    }
    
    return result;
}

vector<int> computeZArray(string str) {
    int n = str.length();
    vector<int> z(n, 0);
    int l = 0, r = 0;
    
    for (int i = 1; i < n; i++) {
        if (i <= r) {
            z[i] = min(r - i + 1, z[i - l]);
        }
        
        while (i + z[i] < n && str[z[i]] == str[i + z[i]]) {
            z[i]++;
        }
        
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    
    return z;
}`,
          c: `int* zAlgorithm(char* text, char* pattern) {
    int textLen = strlen(text);
    int patternLen = strlen(pattern);
    char* combined = malloc((textLen + patternLen + 2) * sizeof(char));
    strcpy(combined, pattern);
    strcat(combined, "$");
    strcat(combined, text);
    
    int* z = computeZArray(combined);
    int* result = malloc(MAX_RESULTS * sizeof(int));
    int resultCount = 0;
    
    for (int i = patternLen + 1; i < strlen(combined); i++) {
        if (z[i] == patternLen) {
            result[resultCount++] = i - patternLen - 1;
        }
    }
    
    result[resultCount] = -1; // Sentinel
    free(combined);
    free(z);
    return result;
}

int* computeZArray(char* str) {
    int n = strlen(str);
    int* z = malloc(n * sizeof(int));
    int l = 0, r = 0;
    
    z[0] = 0;
    
    for (int i = 1; i < n; i++) {
        if (i <= r) {
            z[i] = (r - i + 1 < z[i - l]) ? r - i + 1 : z[i - l];
        }
        
        while (i + z[i] < n && str[z[i]] == str[i + z[i]]) {
            z[i]++;
        }
        
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    
    return z;
}`
        }
      },
      // Advanced Tree Algorithms
      'avl-insert': {
        name: 'AVL Insert',
        description: 'Insert operation in AVL tree with automatic balancing to maintain height balance.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(log n)',
        bestCase: 'O(log n)',
        averageCase: 'O(log n)',
        worstCase: 'O(log n)',
        code: {
          javascript: `class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }
  
  getHeight(node) {
    return node ? node.height : 0;
  }
  
  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }
  
  updateHeight(node) {
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }
  
  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;
    
    x.right = y;
    y.left = T2;
    
    this.updateHeight(y);
    this.updateHeight(x);
    
    return x;
  }
  
  leftRotate(x) {
    const y = x.right;
    const T2 = y.left;
    
    y.left = x;
    x.right = T2;
    
    this.updateHeight(x);
    this.updateHeight(y);
    
    return y;
  }
  
  insert(node, value) {
    if (!node) return new AVLNode(value);
    
    if (value < node.value) {
      node.left = this.insert(node.left, value);
    } else if (value > node.value) {
      node.right = this.insert(node.right, value);
    } else {
      return node; // Duplicate values not allowed
    }
    
    this.updateHeight(node);
    
    const balance = this.getBalance(node);
    
    // Left Left Case
    if (balance > 1 && value < node.left.value) {
      return this.rightRotate(node);
    }
    
    // Right Right Case
    if (balance < -1 && value > node.right.value) {
      return this.leftRotate(node);
    }
    
    // Left Right Case
    if (balance > 1 && value > node.left.value) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    
    // Right Left Case
    if (balance < -1 && value < node.right.value) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }
    
    return node;
  }
  
  insertValue(value) {
    this.root = this.insert(this.root, value);
  }
}`,
          python: `class AVLNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def __init__(self):
        self.root = None
    
    def get_height(self, node):
        return node.height if node else 0
    
    def get_balance(self, node):
        return self.get_height(node.left) - self.get_height(node.right) if node else 0
    
    def update_height(self, node):
        node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))
    
    def right_rotate(self, y):
        x = y.left
        T2 = x.right
        
        x.right = y
        y.left = T2
        
        self.update_height(y)
        self.update_height(x)
        
        return x
    
    def left_rotate(self, x):
        y = x.right
        T2 = y.left
        
        y.left = x
        x.right = T2
        
        self.update_height(x)
        self.update_height(y)
        
        return y
    
    def insert(self, node, value):
        if not node:
            return AVLNode(value)
        
        if value < node.value:
            node.left = self.insert(node.left, value)
        elif value > node.value:
            node.right = self.insert(node.right, value)
        else:
            return node  # Duplicate values not allowed
        
        self.update_height(node)
        
        balance = self.get_balance(node)
        
        # Left Left Case
        if balance > 1 and value < node.left.value:
            return self.right_rotate(node)
        
        # Right Right Case
        if balance < -1 and value > node.right.value:
            return self.left_rotate(node)
        
        # Left Right Case
        if balance > 1 and value > node.left.value:
            node.left = self.left_rotate(node.left)
            return self.right_rotate(node)
        
        # Right Left Case
        if balance < -1 and value < node.right.value:
            node.right = self.right_rotate(node.right)
            return self.left_rotate(node)
        
        return node
    
    def insert_value(self, value):
        self.root = self.insert(self.root, value)`,
          java: `class AVLNode {
    int value, height;
    AVLNode left, right;
    
    AVLNode(int value) {
        this.value = value;
        this.height = 1;
    }
}

class AVLTree {
    AVLNode root;
    
    int getHeight(AVLNode node) {
        return node == null ? 0 : node.height;
    }
    
    int getBalance(AVLNode node) {
        return node == null ? 0 : getHeight(node.left) - getHeight(node.right);
    }
    
    void updateHeight(AVLNode node) {
        node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    }
    
    AVLNode rightRotate(AVLNode y) {
        AVLNode x = y.left;
        AVLNode T2 = x.right;
        
        x.right = y;
        y.left = T2;
        
        updateHeight(y);
        updateHeight(x);
        
        return x;
    }
    
    AVLNode leftRotate(AVLNode x) {
        AVLNode y = x.right;
        AVLNode T2 = y.left;
        
        y.left = x;
        x.right = T2;
        
        updateHeight(x);
        updateHeight(y);
        
        return y;
    }
    
    AVLNode insert(AVLNode node, int value) {
        if (node == null) return new AVLNode(value);
        
        if (value < node.value) {
            node.left = insert(node.left, value);
        } else if (value > node.value) {
            node.right = insert(node.right, value);
        } else {
            return node; // Duplicate values not allowed
        }
        
        updateHeight(node);
        
        int balance = getBalance(node);
        
        // Left Left Case
        if (balance > 1 && value < node.left.value) {
            return rightRotate(node);
        }
        
        // Right Right Case
        if (balance < -1 && value > node.right.value) {
            return leftRotate(node);
        }
        
        // Left Right Case
        if (balance > 1 && value > node.left.value) {
            node.left = leftRotate(node.left);
            return rightRotate(node);
        }
        
        // Right Left Case
        if (balance < -1 && value < node.right.value) {
            node.right = rightRotate(node.right);
            return leftRotate(node);
        }
        
        return node;
    }
    
    void insertValue(int value) {
        root = insert(root, value);
    }
}`,
          cpp: `struct AVLNode {
    int value;
    int height;
    AVLNode* left;
    AVLNode* right;
    
    AVLNode(int value) : value(value), height(1), left(nullptr), right(nullptr) {}
};

class AVLTree {
private:
    AVLNode* root;
    
    int getHeight(AVLNode* node) {
        return node ? node->height : 0;
    }
    
    int getBalance(AVLNode* node) {
        return node ? getHeight(node->left) - getHeight(node->right) : 0;
    }
    
    void updateHeight(AVLNode* node) {
        node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    }
    
    AVLNode* rightRotate(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* T2 = x->right;
        
        x->right = y;
        y->left = T2;
        
        updateHeight(y);
        updateHeight(x);
        
        return x;
    }
    
    AVLNode* leftRotate(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* T2 = y->left;
        
        y->left = x;
        x->right = T2;
        
        updateHeight(x);
        updateHeight(y);
        
        return y;
    }
    
    AVLNode* insert(AVLNode* node, int value) {
        if (!node) return new AVLNode(value);
        
        if (value < node->value) {
            node->left = insert(node->left, value);
        } else if (value > node->value) {
            node->right = insert(node->right, value);
        } else {
            return node; // Duplicate values not allowed
        }
        
        updateHeight(node);
        
        int balance = getBalance(node);
        
        // Left Left Case
        if (balance > 1 && value < node->left->value) {
            return rightRotate(node);
        }
        
        // Right Right Case
        if (balance < -1 && value > node->right->value) {
            return leftRotate(node);
        }
        
        // Left Right Case
        if (balance > 1 && value > node->left->value) {
            node->left = leftRotate(node->left);
            return rightRotate(node);
        }
        
        // Right Left Case
        if (balance < -1 && value < node->right->value) {
            node->right = rightRotate(node->right);
            return leftRotate(node);
        }
        
        return node;
    }
    
public:
    AVLTree() : root(nullptr) {}
    
    void insertValue(int value) {
        root = insert(root, value);
    }
};`,
          c: `typedef struct AVLNode {
    int value;
    int height;
    struct AVLNode* left;
    struct AVLNode* right;
} AVLNode;

AVLNode* createNode(int value) {
    AVLNode* node = (AVLNode*)malloc(sizeof(AVLNode));
    node->value = value;
    node->height = 1;
    node->left = NULL;
    node->right = NULL;
    return node;
}

int getHeight(AVLNode* node) {
    return node ? node->height : 0;
}

int getBalance(AVLNode* node) {
    return node ? getHeight(node->left) - getHeight(node->right) : 0;
}

void updateHeight(AVLNode* node) {
    node->height = 1 + (getHeight(node->left) > getHeight(node->right) ? 
                       getHeight(node->left) : getHeight(node->right));
}

AVLNode* rightRotate(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;
    
    x->right = y;
    y->left = T2;
    
    updateHeight(y);
    updateHeight(x);
    
    return x;
}

AVLNode* leftRotate(AVLNode* x) {
    AVLNode* y = x->right;
    AVLNode* T2 = y->left;
    
    y->left = x;
    x->right = T2;
    
    updateHeight(x);
    updateHeight(y);
    
    return y;
}

AVLNode* insert(AVLNode* node, int value) {
    if (!node) return createNode(value);
    
    if (value < node->value) {
        node->left = insert(node->left, value);
    } else if (value > node->value) {
        node->right = insert(node->right, value);
    } else {
        return node; // Duplicate values not allowed
    }
    
    updateHeight(node);
    
    int balance = getBalance(node);
    
    // Left Left Case
    if (balance > 1 && value < node->left->value) {
        return rightRotate(node);
    }
    
    // Right Right Case
    if (balance < -1 && value > node->right->value) {
        return leftRotate(node);
    }
    
    // Left Right Case
    if (balance > 1 && value > node->left->value) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    
    // Right Left Case
    if (balance < -1 && value < node->right->value) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    
    return node;
}`
        }
      },
      'avl-delete': {
        name: 'AVL Delete',
        description: 'Delete operation in AVL tree with automatic balancing to maintain height balance.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(log n)',
        bestCase: 'O(log n)',
        averageCase: 'O(log n)',
        worstCase: 'O(log n)',
        code: {
          javascript: `delete(node, value) {
  if (!node) return node;
  
  if (value < node.value) {
    node.left = this.delete(node.left, value);
  } else if (value > node.value) {
    node.right = this.delete(node.right, value);
  } else {
    // Node with only one child or no child
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    
    // Node with two children: get inorder successor
    const temp = this.getMinValueNode(node.right);
    node.value = temp.value;
    node.right = this.delete(node.right, temp.value);
  }
  
  this.updateHeight(node);
  
  const balance = this.getBalance(node);
  
  // Left Left Case
  if (balance > 1 && this.getBalance(node.left) >= 0) {
    return this.rightRotate(node);
  }
  
  // Left Right Case
  if (balance > 1 && this.getBalance(node.left) < 0) {
    node.left = this.leftRotate(node.left);
    return this.rightRotate(node);
  }
  
  // Right Right Case
  if (balance < -1 && this.getBalance(node.right) <= 0) {
    return this.leftRotate(node);
  }
  
  // Right Left Case
  if (balance < -1 && this.getBalance(node.right) > 0) {
    node.right = this.rightRotate(node.right);
    return this.leftRotate(node);
  }
  
  return node;
}

getMinValueNode(node) {
  let current = node;
  while (current.left) {
    current = current.left;
  }
  return current;
}

deleteValue(value) {
  this.root = this.delete(this.root, value);
}`,
          python: `def delete(self, node, value):
    if not node:
        return node
    
    if value < node.value:
        node.left = self.delete(node.left, value)
    elif value > node.value:
        node.right = self.delete(node.right, value)
    else:
        # Node with only one child or no child
        if not node.left:
            return node.right
        if not node.right:
            return node.left
        
        # Node with two children: get inorder successor
        temp = self.get_min_value_node(node.right)
        node.value = temp.value
        node.right = self.delete(node.right, temp.value)
    
    self.update_height(node)
    
    balance = self.get_balance(node)
    
    # Left Left Case
    if balance > 1 and self.get_balance(node.left) >= 0:
        return self.right_rotate(node)
    
    # Left Right Case
    if balance > 1 and self.get_balance(node.left) < 0:
        node.left = self.left_rotate(node.left)
        return self.right_rotate(node)
    
    # Right Right Case
    if balance < -1 and self.get_balance(node.right) <= 0:
        return self.left_rotate(node)
    
    # Right Left Case
    if balance < -1 and self.get_balance(node.right) > 0:
        node.right = self.right_rotate(node.right)
        return self.left_rotate(node)
    
    return node

def get_min_value_node(self, node):
    current = node
    while current.left:
        current = current.left
    return current

def delete_value(self, value):
    self.root = self.delete(self.root, value)`,
          java: `AVLNode delete(AVLNode node, int value) {
    if (node == null) return node;
    
    if (value < node.value) {
        node.left = delete(node.left, value);
    } else if (value > node.value) {
        node.right = delete(node.right, value);
    } else {
        // Node with only one child or no child
        if (node.left == null) return node.right;
        if (node.right == null) return node.left;
        
        // Node with two children: get inorder successor
        AVLNode temp = getMinValueNode(node.right);
        node.value = temp.value;
        node.right = delete(node.right, temp.value);
    }
    
    updateHeight(node);
    
    int balance = getBalance(node);
    
    // Left Left Case
    if (balance > 1 && getBalance(node.left) >= 0) {
        return rightRotate(node);
    }
    
    // Left Right Case
    if (balance > 1 && getBalance(node.left) < 0) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }
    
    // Right Right Case
    if (balance < -1 && getBalance(node.right) <= 0) {
        return leftRotate(node);
    }
    
    // Right Left Case
    if (balance < -1 && getBalance(node.right) > 0) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }
    
    return node;
}

AVLNode getMinValueNode(AVLNode node) {
    AVLNode current = node;
    while (current.left != null) {
        current = current.left;
    }
    return current;
}

void deleteValue(int value) {
    root = delete(root, value);
}`,
          cpp: `AVLNode* deleteNode(AVLNode* node, int value) {
    if (!node) return node;
    
    if (value < node->value) {
        node->left = deleteNode(node->left, value);
    } else if (value > node->value) {
        node->right = deleteNode(node->right, value);
    } else {
        // Node with only one child or no child
        if (!node->left) return node->right;
        if (!node->right) return node->left;
        
        // Node with two children: get inorder successor
        AVLNode* temp = getMinValueNode(node->right);
        node->value = temp->value;
        node->right = deleteNode(node->right, temp->value);
    }
    
    updateHeight(node);
    
    int balance = getBalance(node);
    
    // Left Left Case
    if (balance > 1 && getBalance(node->left) >= 0) {
        return rightRotate(node);
    }
    
    // Left Right Case
    if (balance > 1 && getBalance(node->left) < 0) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    
    // Right Right Case
    if (balance < -1 && getBalance(node->right) <= 0) {
        return leftRotate(node);
    }
    
    // Right Left Case
    if (balance < -1 && getBalance(node->right) > 0) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    
    return node;
}

AVLNode* getMinValueNode(AVLNode* node) {
    AVLNode* current = node;
    while (current->left) {
        current = current->left;
    }
    return current;
}

void deleteValue(int value) {
    root = deleteNode(root, value);
}`,
          c: `AVLNode* deleteNode(AVLNode* node, int value) {
    if (!node) return node;
    
    if (value < node->value) {
        node->left = deleteNode(node->left, value);
    } else if (value > node->value) {
        node->right = deleteNode(node->right, value);
    } else {
        // Node with only one child or no child
        if (!node->left) return node->right;
        if (!node->right) return node->left;
        
        // Node with two children: get inorder successor
        AVLNode* temp = getMinValueNode(node->right);
        node->value = temp->value;
        node->right = deleteNode(node->right, temp->value);
    }
    
    updateHeight(node);
    
    int balance = getBalance(node);
    
    // Left Left Case
    if (balance > 1 && getBalance(node->left) >= 0) {
        return rightRotate(node);
    }
    
    // Left Right Case
    if (balance > 1 && getBalance(node->left) < 0) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    
    // Right Right Case
    if (balance < -1 && getBalance(node->right) <= 0) {
        return leftRotate(node);
    }
    
    // Right Left Case
    if (balance < -1 && getBalance(node->right) > 0) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    
    return node;
}

AVLNode* getMinValueNode(AVLNode* node) {
    AVLNode* current = node;
    while (current->left) {
        current = current->left;
    }
    return current;
}`
        }
      },
      'rb-insert': {
        name: 'Red-Black Insert',
        description: 'Insert operation in Red-Black tree with color-coded balancing to maintain properties.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(log n)',
        bestCase: 'O(log n)',
        averageCase: 'O(log n)',
        worstCase: 'O(log n)',
        code: {
          javascript: `class RBNode {
  constructor(value, color = 'RED') {
    this.value = value;
    this.color = color;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    this.nil = new RBNode(0, 'BLACK');
    this.root = this.nil;
  }
  
  leftRotate(x) {
    const y = x.right;
    x.right = y.left;
    
    if (y.left !== this.nil) {
      y.left.parent = x;
    }
    
    y.parent = x.parent;
    
    if (x.parent === this.nil) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    
    y.left = x;
    x.parent = y;
  }
  
  rightRotate(y) {
    const x = y.left;
    y.left = x.right;
    
    if (x.right !== this.nil) {
      x.right.parent = y;
    }
    
    x.parent = y.parent;
    
    if (y.parent === this.nil) {
      this.root = x;
    } else if (y === y.parent.left) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }
    
    x.right = y;
    y.parent = x;
  }
  
  insertFixup(z) {
    while (z.parent.color === 'RED') {
      if (z.parent === z.parent.parent.left) {
        const y = z.parent.parent.right;
        if (y.color === 'RED') {
          z.parent.color = 'BLACK';
          y.color = 'BLACK';
          z.parent.parent.color = 'RED';
          z = z.parent.parent;
        } else {
          if (z === z.parent.right) {
            z = z.parent;
            this.leftRotate(z);
          }
          z.parent.color = 'BLACK';
          z.parent.parent.color = 'RED';
          this.rightRotate(z.parent.parent);
        }
      } else {
        const y = z.parent.parent.left;
        if (y.color === 'RED') {
          z.parent.color = 'BLACK';
          y.color = 'BLACK';
          z.parent.parent.color = 'RED';
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this.rightRotate(z);
          }
          z.parent.color = 'BLACK';
          z.parent.parent.color = 'RED';
          this.leftRotate(z.parent.parent);
        }
      }
    }
    this.root.color = 'BLACK';
  }
  
  insert(value) {
    const z = new RBNode(value);
    let y = this.nil;
    let x = this.root;
    
    while (x !== this.nil) {
      y = x;
      if (z.value < x.value) {
        x = x.left;
      } else {
        x = x.right;
      }
    }
    
    z.parent = y;
    
    if (y === this.nil) {
      this.root = z;
    } else if (z.value < y.value) {
      y.left = z;
    } else {
      y.right = z;
    }
    
    z.left = this.nil;
    z.right = this.nil;
    z.color = 'RED';
    
    this.insertFixup(z);
  }
}`,
          python: `class RBNode:
    def __init__(self, value, color='RED'):
        self.value = value
        self.color = color
        self.left = None
        self.right = None
        self.parent = None

class RedBlackTree:
    def __init__(self):
        self.nil = RBNode(0, 'BLACK')
        self.root = self.nil
    
    def left_rotate(self, x):
        y = x.right
        x.right = y.left
        
        if y.left != self.nil:
            y.left.parent = x
        
        y.parent = x.parent
        
        if x.parent == self.nil:
            self.root = y
        elif x == x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        
        y.left = x
        x.parent = y
    
    def right_rotate(self, y):
        x = y.left
        y.left = x.right
        
        if x.right != self.nil:
            x.right.parent = y
        
        x.parent = y.parent
        
        if y.parent == self.nil:
            self.root = x
        elif y == y.parent.left:
            y.parent.left = x
        else:
            y.parent.right = x
        
        x.right = y
        y.parent = x
    
    def insert_fixup(self, z):
        while z.parent.color == 'RED':
            if z.parent == z.parent.parent.left:
                y = z.parent.parent.right
                if y.color == 'RED':
                    z.parent.color = 'BLACK'
                    y.color = 'BLACK'
                    z.parent.parent.color = 'RED'
                    z = z.parent.parent
                else:
                    if z == z.parent.right:
                        z = z.parent
                        self.left_rotate(z)
                    z.parent.color = 'BLACK'
                    z.parent.parent.color = 'RED'
                    self.right_rotate(z.parent.parent)
            else:
                y = z.parent.parent.left
                if y.color == 'RED':
                    z.parent.color = 'BLACK'
                    y.color = 'BLACK'
                    z.parent.parent.color = 'RED'
                    z = z.parent.parent
                else:
                    if z == z.parent.left:
                        z = z.parent
                        self.right_rotate(z)
                    z.parent.color = 'BLACK'
                    z.parent.parent.color = 'RED'
                    self.left_rotate(z.parent.parent)
        
        self.root.color = 'BLACK'
    
    def insert(self, value):
        z = RBNode(value)
        y = self.nil
        x = self.root
        
        while x != self.nil:
            y = x
            if z.value < x.value:
                x = x.left
            else:
                x = x.right
        
        z.parent = y
        
        if y == self.nil:
            self.root = z
        elif z.value < y.value:
            y.left = z
        else:
            y.right = z
        
        z.left = self.nil
        z.right = self.nil
        z.color = 'RED'
        
        self.insert_fixup(z)`,
          java: `class RBNode {
    int value;
    String color;
    RBNode left, right, parent;
    
    RBNode(int value) {
        this.value = value;
        this.color = "RED";
        this.left = this.right = this.parent = null;
    }
}

class RedBlackTree {
    RBNode root;
    RBNode nil;
    
    RedBlackTree() {
        nil = new RBNode(0);
        nil.color = "BLACK";
        root = nil;
    }
    
    void leftRotate(RBNode x) {
        RBNode y = x.right;
        x.right = y.left;
        
        if (y.left != nil) {
            y.left.parent = x;
        }
        
        y.parent = x.parent;
        
        if (x.parent == nil) {
            root = y;
        } else if (x == x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        
        y.left = x;
        x.parent = y;
    }
    
    void rightRotate(RBNode y) {
        RBNode x = y.left;
        y.left = x.right;
        
        if (x.right != nil) {
            x.right.parent = y;
        }
        
        x.parent = y.parent;
        
        if (y.parent == nil) {
            root = x;
        } else if (y == y.parent.left) {
            y.parent.left = x;
        } else {
            y.parent.right = x;
        }
        
        x.right = y;
        y.parent = x;
    }
    
    void insertFixup(RBNode z) {
        while (z.parent.color.equals("RED")) {
            if (z.parent == z.parent.parent.left) {
                RBNode y = z.parent.parent.right;
                if (y.color.equals("RED")) {
                    z.parent.color = "BLACK";
                    y.color = "BLACK";
                    z.parent.parent.color = "RED";
                    z = z.parent.parent;
                } else {
                    if (z == z.parent.right) {
                        z = z.parent;
                        leftRotate(z);
                    }
                    z.parent.color = "BLACK";
                    z.parent.parent.color = "RED";
                    rightRotate(z.parent.parent);
                }
            } else {
                RBNode y = z.parent.parent.left;
                if (y.color.equals("RED")) {
                    z.parent.color = "BLACK";
                    y.color = "BLACK";
                    z.parent.parent.color = "RED";
                    z = z.parent.parent;
                } else {
                    if (z == z.parent.left) {
                        z = z.parent;
                        rightRotate(z);
                    }
                    z.parent.color = "BLACK";
                    z.parent.parent.color = "RED";
                    leftRotate(z.parent.parent);
                }
            }
        }
        root.color = "BLACK";
    }
    
    void insert(int value) {
        RBNode z = new RBNode(value);
        RBNode y = nil;
        RBNode x = root;
        
        while (x != nil) {
            y = x;
            if (z.value < x.value) {
                x = x.left;
            } else {
                x = x.right;
            }
        }
        
        z.parent = y;
        
        if (y == nil) {
            root = z;
        } else if (z.value < y.value) {
            y.left = z;
        } else {
            y.right = z;
        }
        
        z.left = nil;
        z.right = nil;
        z.color = "RED";
        
        insertFixup(z);
    }
}`,
          cpp: `enum Color { RED, BLACK };

struct RBNode {
    int value;
    Color color;
    RBNode* left;
    RBNode* right;
    RBNode* parent;
    
    RBNode(int value) : value(value), color(RED), left(nullptr), right(nullptr), parent(nullptr) {}
};

class RedBlackTree {
private:
    RBNode* root;
    RBNode* nil;
    
    void leftRotate(RBNode* x) {
        RBNode* y = x->right;
        x->right = y->left;
        
        if (y->left != nil) {
            y->left->parent = x;
        }
        
        y->parent = x->parent;
        
        if (x->parent == nil) {
            root = y;
        } else if (x == x->parent->left) {
            x->parent->left = y;
        } else {
            x->parent->right = y;
        }
        
        y->left = x;
        x->parent = y;
    }
    
    void rightRotate(RBNode* y) {
        RBNode* x = y->left;
        y->left = x->right;
        
        if (x->right != nil) {
            x->right->parent = y;
        }
        
        x->parent = y->parent;
        
        if (y->parent == nil) {
            root = x;
        } else if (y == y->parent->left) {
            y->parent->left = x;
        } else {
            y->parent->right = x;
        }
        
        x->right = y;
        y->parent = x;
    }
    
    void insertFixup(RBNode* z) {
        while (z->parent->color == RED) {
            if (z->parent == z->parent->parent->left) {
                RBNode* y = z->parent->parent->right;
                if (y->color == RED) {
                    z->parent->color = BLACK;
                    y->color = BLACK;
                    z->parent->parent->color = RED;
                    z = z->parent->parent;
                } else {
                    if (z == z->parent->right) {
                        z = z->parent;
                        leftRotate(z);
                    }
                    z->parent->color = BLACK;
                    z->parent->parent->color = RED;
                    rightRotate(z->parent->parent);
                }
            } else {
                RBNode* y = z->parent->parent->left;
                if (y->color == RED) {
                    z->parent->color = BLACK;
                    y->color = BLACK;
                    z->parent->parent->color = RED;
                    z = z->parent->parent;
                } else {
                    if (z == z->parent->left) {
                        z = z->parent;
                        rightRotate(z);
                    }
                    z->parent->color = BLACK;
                    z->parent->parent->color = RED;
                    leftRotate(z->parent->parent);
                }
            }
        }
        root->color = BLACK;
    }
    
public:
    RedBlackTree() {
        nil = new RBNode(0);
        nil->color = BLACK;
        root = nil;
    }
    
    void insert(int value) {
        RBNode* z = new RBNode(value);
        RBNode* y = nil;
        RBNode* x = root;
        
        while (x != nil) {
            y = x;
            if (z->value < x->value) {
                x = x->left;
            } else {
                x = x->right;
            }
        }
        
        z->parent = y;
        
        if (y == nil) {
            root = z;
        } else if (z->value < y->value) {
            y->left = z;
        } else {
            y->right = z;
        }
        
        z->left = nil;
        z->right = nil;
        z->color = RED;
        
        insertFixup(z);
    }
};`,
          c: `typedef enum { RED, BLACK } Color;

typedef struct RBNode {
    int value;
    Color color;
    struct RBNode* left;
    struct RBNode* right;
    struct RBNode* parent;
} RBNode;

RBNode* createRBNode(int value) {
    RBNode* node = (RBNode*)malloc(sizeof(RBNode));
    node->value = value;
    node->color = RED;
    node->left = NULL;
    node->right = NULL;
    node->parent = NULL;
    return node;
}

void leftRotate(RBNode** root, RBNode* x) {
    RBNode* y = x->right;
    x->right = y->left;
    
    if (y->left != NULL) {
        y->left->parent = x;
    }
    
    y->parent = x->parent;
    
    if (x->parent == NULL) {
        *root = y;
    } else if (x == x->parent->left) {
        x->parent->left = y;
    } else {
        x->parent->right = y;
    }
    
    y->left = x;
    x->parent = y;
}

void rightRotate(RBNode** root, RBNode* y) {
    RBNode* x = y->left;
    y->left = x->right;
    
    if (x->right != NULL) {
        x->right->parent = y;
    }
    
    x->parent = y->parent;
    
    if (y->parent == NULL) {
        *root = x;
    } else if (y == y->parent->left) {
        y->parent->left = x;
    } else {
        y->parent->right = x;
    }
    
    x->right = y;
    y->parent = x;
}

void insertFixup(RBNode** root, RBNode* z) {
    while (z->parent && z->parent->color == RED) {
        if (z->parent == z->parent->parent->left) {
            RBNode* y = z->parent->parent->right;
            if (y && y->color == RED) {
                z->parent->color = BLACK;
                y->color = BLACK;
                z->parent->parent->color = RED;
                z = z->parent->parent;
            } else {
                if (z == z->parent->right) {
                    z = z->parent;
                    leftRotate(root, z);
                }
                z->parent->color = BLACK;
                z->parent->parent->color = RED;
                rightRotate(root, z->parent->parent);
            }
        } else {
            RBNode* y = z->parent->parent->left;
            if (y && y->color == RED) {
                z->parent->color = BLACK;
                y->color = BLACK;
                z->parent->parent->color = RED;
                z = z->parent->parent;
            } else {
                if (z == z->parent->left) {
                    z = z->parent;
                    rightRotate(root, z);
                }
                z->parent->color = BLACK;
                z->parent->parent->color = RED;
                leftRotate(root, z->parent->parent);
            }
        }
    }
    (*root)->color = BLACK;
}

void insert(RBNode** root, int value) {
    RBNode* z = createRBNode(value);
    RBNode* y = NULL;
    RBNode* x = *root;
    
    while (x != NULL) {
        y = x;
        if (z->value < x->value) {
            x = x->left;
        } else {
            x = x->right;
        }
    }
    
    z->parent = y;
    
    if (y == NULL) {
        *root = z;
    } else if (z->value < y->value) {
        y->left = z;
    } else {
        y->right = z;
    }
    
    z->left = NULL;
    z->right = NULL;
    z->color = RED;
    
    insertFixup(root, z);
}`
        }
      },
      'rb-delete': {
        name: 'Red-Black Delete',
        description: 'Delete operation in Red-Black tree with complex balancing to maintain properties.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(log n)',
        bestCase: 'O(log n)',
        averageCase: 'O(log n)',
        worstCase: 'O(log n)',
        code: {
          javascript: `delete(node, value) {
  let z = this.search(node, value);
  if (!z) return node;
  
  let y = z;
  let yOriginalColor = y.color;
  let x;
  
  if (!z.left) {
    x = z.right;
    this.transplant(z, z.right);
  } else if (!z.right) {
    x = z.left;
    this.transplant(z, z.left);
  } else {
    y = this.getMinValueNode(z.right);
    yOriginalColor = y.color;
    x = y.right;
    
    if (y.parent === z) {
      x.parent = y;
    } else {
      this.transplant(y, y.right);
      y.right = z.right;
      y.right.parent = y;
    }
    
    this.transplant(z, y);
    y.left = z.left;
    y.left.parent = y;
    y.color = z.color;
  }
  
  if (yOriginalColor === 'BLACK') {
    this.deleteFixup(x);
  }
  
  return this.root;
}

transplant(u, v) {
  if (!u.parent) {
    this.root = v;
  } else if (u === u.parent.left) {
    u.parent.left = v;
  } else {
    u.parent.right = v;
  }
  
  if (v) {
    v.parent = u.parent;
  }
}

deleteFixup(x) {
  while (x !== this.root && x.color === 'BLACK') {
    if (x === x.parent.left) {
      let w = x.parent.right;
      if (w.color === 'RED') {
        w.color = 'BLACK';
        x.parent.color = 'RED';
        this.leftRotate(x.parent);
        w = x.parent.right;
      }
      
      if (w.left.color === 'BLACK' && w.right.color === 'BLACK') {
        w.color = 'RED';
        x = x.parent;
      } else {
        if (w.right.color === 'BLACK') {
          w.left.color = 'BLACK';
          w.color = 'RED';
          this.rightRotate(w);
          w = x.parent.right;
        }
        
        w.color = x.parent.color;
        x.parent.color = 'BLACK';
        w.right.color = 'BLACK';
        this.leftRotate(x.parent);
        x = this.root;
      }
    } else {
      let w = x.parent.left;
      if (w.color === 'RED') {
        w.color = 'BLACK';
        x.parent.color = 'RED';
        this.rightRotate(x.parent);
        w = x.parent.left;
      }
      
      if (w.right.color === 'BLACK' && w.left.color === 'BLACK') {
        w.color = 'RED';
        x = x.parent;
      } else {
        if (w.left.color === 'BLACK') {
          w.right.color = 'BLACK';
          w.color = 'RED';
          this.leftRotate(w);
          w = x.parent.left;
        }
        
        w.color = x.parent.color;
        x.parent.color = 'BLACK';
        w.left.color = 'BLACK';
        this.rightRotate(x.parent);
        x = this.root;
      }
    }
  }
  x.color = 'BLACK';
}

search(node, value) {
  if (!node || node.value === value) {
    return node;
  }
  
  if (value < node.value) {
    return this.search(node.left, value);
  } else {
    return this.search(node.right, value);
  }
}

getMinValueNode(node) {
  while (node.left) {
    node = node.left;
  }
  return node;
}

deleteValue(value) {
  this.root = this.delete(this.root, value);
}`,
          python: `def delete(self, node, value):
    z = self.search(node, value)
    if not z:
        return node
    
    y = z
    y_original_color = y.color
    x = None
    
    if not z.left:
        x = z.right
        self.transplant(z, z.right)
    elif not z.right:
        x = z.left
        self.transplant(z, z.left)
    else:
        y = self.get_min_value_node(z.right)
        y_original_color = y.color
        x = y.right
        
        if y.parent == z:
            x.parent = y
        else:
            self.transplant(y, y.right)
            y.right = z.right
            y.right.parent = y
        
        self.transplant(z, y)
        y.left = z.left
        y.left.parent = y
        y.color = z.color
    
    if y_original_color == 'BLACK':
        self.delete_fixup(x)
    
    return self.root

def transplant(self, u, v):
    if not u.parent:
        self.root = v
    elif u == u.parent.left:
        u.parent.left = v
    else:
        u.parent.right = v
    
    if v:
        v.parent = u.parent

def delete_fixup(self, x):
    while x != self.root and x.color == 'BLACK':
        if x == x.parent.left:
            w = x.parent.right
            if w.color == 'RED':
                w.color = 'BLACK'
                x.parent.color = 'RED'
                self.left_rotate(x.parent)
                w = x.parent.right
            
            if w.left.color == 'BLACK' and w.right.color == 'BLACK':
                w.color = 'RED'
                x = x.parent
            else:
                if w.right.color == 'BLACK':
                    w.left.color = 'BLACK'
                    w.color = 'RED'
                    self.right_rotate(w)
                    w = x.parent.right
                
                w.color = x.parent.color
                x.parent.color = 'BLACK'
                w.right.color = 'BLACK'
                self.left_rotate(x.parent)
                x = self.root
        else:
            w = x.parent.left
            if w.color == 'RED':
                w.color = 'BLACK'
                x.parent.color = 'RED'
                self.right_rotate(x.parent)
                w = x.parent.left
            
            if w.right.color == 'BLACK' and w.left.color == 'BLACK':
                w.color = 'RED'
                x = x.parent
            else:
                if w.left.color == 'BLACK':
                    w.right.color = 'BLACK'
                    w.color = 'RED'
                    self.left_rotate(w)
                    w = x.parent.left
                
                w.color = x.parent.color
                x.parent.color = 'BLACK'
                w.left.color = 'BLACK'
                self.right_rotate(x.parent)
                x = self.root
    
    x.color = 'BLACK'

def search(self, node, value):
    if not node or node.value == value:
        return node
    
    if value < node.value:
        return self.search(node.left, value)
    else:
        return self.search(node.right, value)

def get_min_value_node(self, node):
    while node.left:
        node = node.left
    return node

def delete_value(self, value):
    self.root = self.delete(self.root, value)`,
          java: `RBNode delete(RBNode node, int value) {
    RBNode z = search(node, value);
    if (z == null) return node;
    
    RBNode y = z;
    String yOriginalColor = y.color;
    RBNode x;
    
    if (z.left == nil) {
        x = z.right;
        transplant(z, z.right);
    } else if (z.right == nil) {
        x = z.left;
        transplant(z, z.left);
    } else {
        y = getMinValueNode(z.right);
        yOriginalColor = y.color;
        x = y.right;
        
        if (y.parent == z) {
            x.parent = y;
        } else {
            transplant(y, y.right);
            y.right = z.right;
            y.right.parent = y;
        }
        
        transplant(z, y);
        y.left = z.left;
        y.left.parent = y;
        y.color = z.color;
    }
    
    if (yOriginalColor.equals("BLACK")) {
        deleteFixup(x);
    }
    
    return root;
}

void transplant(RBNode u, RBNode v) {
    if (u.parent == nil) {
        root = v;
    } else if (u == u.parent.left) {
        u.parent.left = v;
    } else {
        u.parent.right = v;
    }
    
    if (v != nil) {
        v.parent = u.parent;
    }
}

void deleteFixup(RBNode x) {
    while (x != root && x.color.equals("BLACK")) {
        if (x == x.parent.left) {
            RBNode w = x.parent.right;
            if (w.color.equals("RED")) {
                w.color = "BLACK";
                x.parent.color = "RED";
                leftRotate(x.parent);
                w = x.parent.right;
            }
            
            if (w.left.color.equals("BLACK") && w.right.color.equals("BLACK")) {
                w.color = "RED";
                x = x.parent;
            } else {
                if (w.right.color.equals("BLACK")) {
                    w.left.color = "BLACK";
                    w.color = "RED";
                    rightRotate(w);
                    w = x.parent.right;
                }
                
                w.color = x.parent.color;
                x.parent.color = "BLACK";
                w.right.color = "BLACK";
                leftRotate(x.parent);
                x = root;
            }
        } else {
            RBNode w = x.parent.left;
            if (w.color.equals("RED")) {
                w.color = "BLACK";
                x.parent.color = "RED";
                rightRotate(x.parent);
                w = x.parent.left;
            }
            
            if (w.right.color.equals("BLACK") && w.left.color.equals("BLACK")) {
                w.color = "RED";
                x = x.parent;
            } else {
                if (w.left.color.equals("BLACK")) {
                    w.right.color = "BLACK";
                    w.color = "RED";
                    leftRotate(w);
                    w = x.parent.left;
                }
                
                w.color = x.parent.color;
                x.parent.color = "BLACK";
                w.left.color = "BLACK";
                rightRotate(x.parent);
                x = root;
            }
        }
    }
    x.color = "BLACK";
}

RBNode search(RBNode node, int value) {
    if (node == nil || node.value == value) {
        return node;
    }
    
    if (value < node.value) {
        return search(node.left, value);
    } else {
        return search(node.right, value);
    }
}

RBNode getMinValueNode(RBNode node) {
    while (node.left != nil) {
        node = node.left;
    }
    return node;
}

void deleteValue(int value) {
    root = delete(root, value);
}`,
          cpp: `RBNode* deleteNode(RBNode* node, int value) {
    RBNode* z = search(node, value);
    if (!z) return node;
    
    RBNode* y = z;
    Color yOriginalColor = y->color;
    RBNode* x;
    
    if (z->left == nil) {
        x = z->right;
        transplant(z, z->right);
    } else if (z->right == nil) {
        x = z->left;
        transplant(z, z->left);
    } else {
        y = getMinValueNode(z->right);
        yOriginalColor = y->color;
        x = y->right;
        
        if (y->parent == z) {
            x->parent = y;
        } else {
            transplant(y, y->right);
            y->right = z->right;
            y->right->parent = y;
        }
        
        transplant(z, y);
        y->left = z->left;
        y->left->parent = y;
        y->color = z->color;
    }
    
    if (yOriginalColor == BLACK) {
        deleteFixup(x);
    }
    
    return root;
}

void transplant(RBNode* u, RBNode* v) {
    if (u->parent == nil) {
        root = v;
    } else if (u == u->parent->left) {
        u->parent->left = v;
    } else {
        u->parent->right = v;
    }
    
    if (v != nil) {
        v->parent = u->parent;
    }
}

void deleteFixup(RBNode* x) {
    while (x != root && x->color == BLACK) {
        if (x == x->parent->left) {
            RBNode* w = x->parent->right;
            if (w->color == RED) {
                w->color = BLACK;
                x->parent->color = RED;
                leftRotate(x->parent);
                w = x->parent->right;
            }
            
            if (w->left->color == BLACK && w->right->color == BLACK) {
                w->color = RED;
                x = x->parent;
            } else {
                if (w->right->color == BLACK) {
                    w->left->color = BLACK;
                    w->color = RED;
                    rightRotate(w);
                    w = x->parent->right;
                }
                
                w->color = x->parent->color;
                x->parent->color = BLACK;
                w->right->color = BLACK;
                leftRotate(x->parent);
                x = root;
            }
        } else {
            RBNode* w = x->parent->left;
            if (w->color == RED) {
                w->color = BLACK;
                x->parent->color = RED;
                rightRotate(x->parent);
                w = x->parent->left;
            }
            
            if (w->right->color == BLACK && w->left->color == BLACK) {
                w->color = RED;
                x = x->parent;
            } else {
                if (w->left->color == BLACK) {
                    w->right->color = BLACK;
                    w->color = RED;
                    leftRotate(w);
                    w = x->parent->left;
                }
                
                w->color = x->parent->color;
                x->parent->color = BLACK;
                w->left->color = BLACK;
                rightRotate(x->parent);
                x = root;
            }
        }
    }
    x->color = BLACK;
}

RBNode* search(RBNode* node, int value) {
    if (node == nil || node->value == value) {
        return node;
    }
    
    if (value < node->value) {
        return search(node->left, value);
    } else {
        return search(node->right, value);
    }
}

RBNode* getMinValueNode(RBNode* node) {
    while (node->left != nil) {
        node = node->left;
    }
    return node;
}

void deleteValue(int value) {
    root = deleteNode(root, value);
}`,
          c: `RBNode* deleteNode(RBNode* root, int value) {
    RBNode* z = search(root, value);
    if (!z) return root;
    
    RBNode* y = z;
    Color yOriginalColor = y->color;
    RBNode* x = NULL;
    
    if (!z->left) {
        x = z->right;
        transplant(&root, z, z->right);
    } else if (!z->right) {
        x = z->left;
        transplant(&root, z, z->left);
    } else {
        y = getMinValueNode(z->right);
        yOriginalColor = y->color;
        x = y->right;
        
        if (y->parent == z) {
            if (x) x->parent = y;
        } else {
            transplant(&root, y, y->right);
            y->right = z->right;
            if (y->right) y->right->parent = y;
        }
        
        transplant(&root, z, y);
        y->left = z->left;
        if (y->left) y->left->parent = y;
        y->color = z->color;
    }
    
    if (yOriginalColor == BLACK) {
        deleteFixup(&root, x);
    }
    
    return root;
}

void transplant(RBNode** root, RBNode* u, RBNode* v) {
    if (!u->parent) {
        *root = v;
    } else if (u == u->parent->left) {
        u->parent->left = v;
    } else {
        u->parent->right = v;
    }
    
    if (v) {
        v->parent = u->parent;
    }
}

void deleteFixup(RBNode** root, RBNode* x) {
    while (x && x != *root && x->color == BLACK) {
        if (x == x->parent->left) {
            RBNode* w = x->parent->right;
            if (w && w->color == RED) {
                w->color = BLACK;
                x->parent->color = RED;
                leftRotate(root, x->parent);
                w = x->parent->right;
            }
            
            if (w && w->left && w->right && 
                w->left->color == BLACK && w->right->color == BLACK) {
                w->color = RED;
                x = x->parent;
            } else {
                if (w && w->right && w->right->color == BLACK) {
                    if (w->left) w->left->color = BLACK;
                    w->color = RED;
                    rightRotate(root, w);
                    w = x->parent->right;
                }
                
                if (w) {
                    w->color = x->parent->color;
                    x->parent->color = BLACK;
                    if (w->right) w->right->color = BLACK;
                    leftRotate(root, x->parent);
                }
                x = *root;
            }
        } else {
            RBNode* w = x->parent->left;
            if (w && w->color == RED) {
                w->color = BLACK;
                x->parent->color = RED;
                rightRotate(root, x->parent);
                w = x->parent->left;
            }
            
            if (w && w->right && w->left && 
                w->right->color == BLACK && w->left->color == BLACK) {
                w->color = RED;
                x = x->parent;
            } else {
                if (w && w->left && w->left->color == BLACK) {
                    if (w->right) w->right->color = BLACK;
                    w->color = RED;
                    leftRotate(root, w);
                    w = x->parent->left;
                }
                
                if (w) {
                    w->color = x->parent->color;
                    x->parent->color = BLACK;
                    if (w->left) w->left->color = BLACK;
                    rightRotate(root, x->parent);
                }
                x = *root;
            }
        }
    }
    if (x) x->color = BLACK;
}

RBNode* search(RBNode* node, int value) {
    if (!node || node->value == value) {
        return node;
    }
    
    if (value < node->value) {
        return search(node->left, value);
    } else {
        return search(node->right, value);
    }
}

RBNode* getMinValueNode(RBNode* node) {
    while (node->left) {
        node = node->left;
    }
    return node;
}`
        }
      },
      // Backtracking Algorithms
      'n-queens': {
        name: 'N-Queens',
        description: 'A classic backtracking problem to place N queens on an N×N chessboard such that no two queens attack each other.',
        timeComplexity: 'O(N!)',
        spaceComplexity: 'O(N)',
        bestCase: 'O(N!)',
        averageCase: 'O(N!)',
        worstCase: 'O(N!)',
        code: {
          javascript: `function solveNQueens(n) {
  const result = [];
  const board = Array(n).fill().map(() => Array(n).fill('.'));
  
  function isValid(row, col) {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    
    // Check diagonal (top-left to bottom-right)
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    
    // Check diagonal (top-right to bottom-left)
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    
    return true;
  }
  
  function backtrack(row) {
    if (row === n) {
      result.push(board.map(row => row.join('')));
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = 'Q';
        backtrack(row + 1);
        board[row][col] = '.';
      }
    }
  }
  
  backtrack(0);
  return result;
}`,
          python: `def solve_n_queens(n):
    result = []
    board = [['.' for _ in range(n)] for _ in range(n)]
    
    def is_valid(row, col):
        # Check column
        for i in range(row):
            if board[i][col] == 'Q':
                return False
        
        # Check diagonal (top-left to bottom-right)
        i, j = row - 1, col - 1
        while i >= 0 and j >= 0:
            if board[i][j] == 'Q':
                return False
            i -= 1
            j -= 1
        
        # Check diagonal (top-right to bottom-left)
        i, j = row - 1, col + 1
        while i >= 0 and j < n:
            if board[i][j] == 'Q':
                return False
            i -= 1
            j += 1
        
        return True
    
    def backtrack(row):
        if row == n:
            result.append([''.join(row) for row in board])
            return
        
        for col in range(n):
            if is_valid(row, col):
                board[row][col] = 'Q'
                backtrack(row + 1)
                board[row][col] = '.'
    
    backtrack(0)
    return result`,
          java: `public static List<List<String>> solveNQueens(int n) {
    List<List<String>> result = new ArrayList<>();
    char[][] board = new char[n][n];
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            board[i][j] = '.';
        }
    }
    
    boolean isValid(int row, int col) {
        // Check column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') return false;
        }
        
        // Check diagonal (top-left to bottom-right)
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }
        
        // Check diagonal (top-right to bottom-left)
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 'Q') return false;
        }
        
        return true;
    }
    
    void backtrack(int row) {
        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (char[] row : board) {
                solution.add(new String(row));
            }
            result.add(solution);
            return;
        }
        
        for (int col = 0; col < n; col++) {
            if (isValid(row, col)) {
                board[row][col] = 'Q';
                backtrack(row + 1);
                board[row][col] = '.';
            }
        }
    }
    
    backtrack(0);
    return result;
}`,
          cpp: `vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> result;
    vector<string> board(n, string(n, '.'));
    
    auto isValid = [&](int row, int col) -> bool {
        // Check column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') return false;
        }
        
        // Check diagonal (top-left to bottom-right)
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }
        
        // Check diagonal (top-right to bottom-left)
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 'Q') return false;
        }
        
        return true;
    };
    
    function<void(int)> backtrack = [&](int row) {
        if (row == n) {
            result.push_back(board);
            return;
        }
        
        for (int col = 0; col < n; col++) {
            if (isValid(row, col)) {
                board[row][col] = 'Q';
                backtrack(row + 1);
                board[row][col] = '.';
            }
        }
    };
    
    backtrack(0);
    return result;
}`,
          c: `bool isValid(char board[][MAX_N], int row, int col, int n) {
    // Check column
    for (int i = 0; i < row; i++) {
        if (board[i][col] == 'Q') return false;
    }
    
    // Check diagonal (top-left to bottom-right)
    for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 'Q') return false;
    }
    
    // Check diagonal (top-right to bottom-left)
    for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
        if (board[i][j] == 'Q') return false;
    }
    
    return true;
}

bool solveNQueens(char board[][MAX_N], int row, int n) {
    if (row == n) {
        return true; // All queens placed successfully
    }
    
    for (int col = 0; col < n; col++) {
        if (isValid(board, row, col, n)) {
            board[row][col] = 'Q';
            
            if (solveNQueens(board, row + 1, n)) {
                return true;
            }
            
            board[row][col] = '.'; // Backtrack
        }
    }
    
    return false;
}`
        }
      },
      'sudoku': {
        name: 'Sudoku Solver',
        description: 'A backtracking algorithm to solve a 9×9 Sudoku puzzle by filling empty cells with valid numbers.',
        timeComplexity: 'O(9^(n*n))',
        spaceComplexity: 'O(n*n)',
        bestCase: 'O(9^(n*n))',
        averageCase: 'O(9^(n*n))',
        worstCase: 'O(9^(n*n))',
        code: {
          javascript: `function solveSudoku(board) {
  function isValid(board, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    
    return true;
  }
  
  function solve(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num.toString())) {
              board[row][col] = num.toString();
              
              if (solve(board)) {
                return true;
              }
              
              board[row][col] = '.'; // Backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  return solve(board);
}`,
          python: `def solve_sudoku(board):
    def is_valid(board, row, col, num):
        # Check row
        for x in range(9):
            if board[row][x] == num:
                return False
        
        # Check column
        for x in range(9):
            if board[x][col] == num:
                return False
        
        # Check 3x3 box
        start_row = (row // 3) * 3
        start_col = (col // 3) * 3
        
        for i in range(3):
            for j in range(3):
                if board[start_row + i][start_col + j] == num:
                    return False
        
        return True
    
    def solve(board):
        for row in range(9):
            for col in range(9):
                if board[row][col] == '.':
                    for num in range(1, 10):
                        if is_valid(board, row, col, str(num)):
                            board[row][col] = str(num)
                            
                            if solve(board):
                                return True
                            
                            board[row][col] = '.'  # Backtrack
                    return False
        return True
    
    return solve(board)`,
          java: `public static boolean solveSudoku(char[][] board) {
    for (int row = 0; row < 9; row++) {
        for (int col = 0; col < 9; col++) {
            if (board[row][col] == '.') {
                for (char num = '1'; num <= '9'; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        
                        if (solveSudoku(board)) {
                            return true;
                        }
                        
                        board[row][col] = '.'; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}

private static boolean isValid(char[][] board, int row, int col, char num) {
    // Check row
    for (int x = 0; x < 9; x++) {
        if (board[row][x] == num) return false;
    }
    
    // Check column
    for (int x = 0; x < 9; x++) {
        if (board[x][col] == num) return false;
    }
    
    // Check 3x3 box
    int startRow = (row / 3) * 3;
    int startCol = (col / 3) * 3;
    
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] == num) return false;
        }
    }
    
    return true;
}`,
          cpp: `bool solveSudoku(vector<vector<char>>& board) {
    for (int row = 0; row < 9; row++) {
        for (int col = 0; col < 9; col++) {
            if (board[row][col] == '.') {
                for (char num = '1'; num <= '9'; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        
                        if (solveSudoku(board)) {
                            return true;
                        }
                        
                        board[row][col] = '.'; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}

bool isValid(vector<vector<char>>& board, int row, int col, char num) {
    // Check row
    for (int x = 0; x < 9; x++) {
        if (board[row][x] == num) return false;
    }
    
    // Check column
    for (int x = 0; x < 9; x++) {
        if (board[x][col] == num) return false;
    }
    
    // Check 3x3 box
    int startRow = (row / 3) * 3;
    int startCol = (col / 3) * 3;
    
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] == num) return false;
        }
    }
    
    return true;
}`,
          c: `bool isValid(char board[9][9], int row, int col, char num) {
    // Check row
    for (int x = 0; x < 9; x++) {
        if (board[row][x] == num) return false;
    }
    
    // Check column
    for (int x = 0; x < 9; x++) {
        if (board[x][col] == num) return false;
    }
    
    // Check 3x3 box
    int startRow = (row / 3) * 3;
    int startCol = (col / 3) * 3;
    
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] == num) return false;
        }
    }
    
    return true;
}

bool solveSudoku(char board[9][9]) {
    for (int row = 0; row < 9; row++) {
        for (int col = 0; col < 9; col++) {
            if (board[row][col] == '.') {
                for (char num = '1'; num <= '9'; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        
                        if (solveSudoku(board)) {
                            return true;
                        }
                        
                        board[row][col] = '.'; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}`
        }
      },
      'maze-generation': {
        name: 'Maze Generation',
        description: 'Generate a random maze using recursive backtracking algorithm with walls and paths.',
        timeComplexity: 'O(n*m)',
        spaceComplexity: 'O(n*m)',
        bestCase: 'O(n*m)',
        averageCase: 'O(n*m)',
        worstCase: 'O(n*m)',
        code: {
          javascript: `function generateMaze(width, height) {
  const maze = Array(height).fill().map(() => Array(width).fill(1)); // 1 = wall, 0 = path
  const stack = [];
  
  function isValid(x, y) {
    return x >= 0 && x < width && y >= 0 && y < height;
  }
  
  function getNeighbors(x, y) {
    const neighbors = [];
    const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]]; // 2 steps for walls
    
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (isValid(nx, ny) && maze[ny][nx] === 1) {
        neighbors.push([nx, ny]);
      }
    }
    return neighbors;
  }
  
  function carvePath(x, y) {
    maze[y][x] = 0; // Mark as path
    
    const neighbors = getNeighbors(x, y);
    if (neighbors.length > 0) {
      const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)];
      const wallX = (x + nextX) / 2;
      const wallY = (y + nextY) / 2;
      
      maze[wallY][wallX] = 0; // Remove wall between cells
      stack.push([x, y]);
      carvePath(nextX, nextY);
    } else if (stack.length > 0) {
      const [prevX, prevY] = stack.pop();
      carvePath(prevX, prevY);
    }
  }
  
  // Start from top-left corner (ensure it's odd coordinates)
  const startX = 1;
  const startY = 1;
  carvePath(startX, startY);
  
  return maze;
}`,
          python: `def generate_maze(width, height):
    maze = [[1 for _ in range(width)] for _ in range(height)]  # 1 = wall, 0 = path
    stack = []
    
    def is_valid(x, y):
        return 0 <= x < width and 0 <= y < height
    
    def get_neighbors(x, y):
        neighbors = []
        directions = [(0, 2), (2, 0), (0, -2), (-2, 0)]  # 2 steps for walls
        
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if is_valid(nx, ny) and maze[ny][nx] == 1:
                neighbors.append((nx, ny))
        return neighbors
    
    def carve_path(x, y):
        maze[y][x] = 0  # Mark as path
        
        neighbors = get_neighbors(x, y)
        if neighbors:
            next_x, next_y = random.choice(neighbors)
            wall_x = (x + next_x) // 2
            wall_y = (y + next_y) // 2
            
            maze[wall_y][wall_x] = 0  # Remove wall between cells
            stack.append((x, y))
            carve_path(next_x, next_y)
        elif stack:
            prev_x, prev_y = stack.pop()
            carve_path(prev_x, prev_y)
    
    # Start from top-left corner (ensure it's odd coordinates)
    start_x, start_y = 1, 1
    carve_path(start_x, start_y)
    
    return maze`,
          java: `public static int[][] generateMaze(int width, int height) {
    int[][] maze = new int[height][width];
    Stack<int[]> stack = new Stack<>();
    
    // Initialize with walls
    for (int i = 0; i < height; i++) {
        for (int j = 0; j < width; j++) {
            maze[i][j] = 1; // 1 = wall, 0 = path
        }
    }
    
    boolean isValid(int x, int y) {
        return x >= 0 && x < width && y >= 0 && y < height;
    }
    
    List<int[]> getNeighbors(int x, int y) {
        List<int[]> neighbors = new ArrayList<>();
        int[][] directions = {{0, 2}, {2, 0}, {0, -2}, {-2, 0}}; // 2 steps for walls
        
        for (int[] dir : directions) {
            int nx = x + dir[0];
            int ny = y + dir[1];
            if (isValid(nx, ny) && maze[ny][nx] == 1) {
                neighbors.add(new int[]{nx, ny});
            }
        }
        return neighbors;
    }
    
    void carvePath(int x, int y) {
        maze[y][x] = 0; // Mark as path
        
        List<int[]> neighbors = getNeighbors(x, y);
        if (!neighbors.isEmpty()) {
            int[] next = neighbors.get((int)(Math.random() * neighbors.size()));
            int wallX = (x + next[0]) / 2;
            int wallY = (y + next[1]) / 2;
            
            maze[wallY][wallX] = 0; // Remove wall between cells
            stack.push(new int[]{x, y});
            carvePath(next[0], next[1]);
        } else if (!stack.isEmpty()) {
            int[] prev = stack.pop();
            carvePath(prev[0], prev[1]);
        }
    }
    
    // Start from top-left corner (ensure it's odd coordinates)
    int startX = 1, startY = 1;
    carvePath(startX, startY);
    
    return maze;
}`,
          cpp: `vector<vector<int>> generateMaze(int width, int height) {
    vector<vector<int>> maze(height, vector<int>(width, 1)); // 1 = wall, 0 = path
    stack<pair<int, int>> st;
    
    auto isValid = [&](int x, int y) -> bool {
        return x >= 0 && x < width && y >= 0 && y < height;
    };
    
    auto getNeighbors = [&](int x, int y) -> vector<pair<int, int>> {
        vector<pair<int, int>> neighbors;
        vector<pair<int, int>> directions = {{0, 2}, {2, 0}, {0, -2}, {-2, 0}}; // 2 steps for walls
        
        for (auto [dx, dy] : directions) {
            int nx = x + dx;
            int ny = y + dy;
            if (isValid(nx, ny) && maze[ny][nx] == 1) {
                neighbors.push_back({nx, ny});
            }
        }
        return neighbors;
    };
    
    function<void(int, int)> carvePath = [&](int x, int y) {
        maze[y][x] = 0; // Mark as path
        
        auto neighbors = getNeighbors(x, y);
        if (!neighbors.empty()) {
            auto [nextX, nextY] = neighbors[rand() % neighbors.size()];
            int wallX = (x + nextX) / 2;
            int wallY = (y + nextY) / 2;
            
            maze[wallY][wallX] = 0; // Remove wall between cells
            st.push({x, y});
            carvePath(nextX, nextY);
        } else if (!st.empty()) {
            auto [prevX, prevY] = st.top();
            st.pop();
            carvePath(prevX, prevY);
        }
    };
    
    // Start from top-left corner (ensure it's odd coordinates)
    int startX = 1, startY = 1;
    carvePath(startX, startY);
    
    return maze;
}`,
          c: `void generateMaze(int width, int height, int maze[][MAX_SIZE]) {
    // Initialize with walls
    for (int i = 0; i < height; i++) {
        for (int j = 0; j < width; j++) {
            maze[i][j] = 1; // 1 = wall, 0 = path
        }
    }
    
    int stack[MAX_SIZE * MAX_SIZE][2];
    int stackSize = 0;
    
    bool isValid(int x, int y) {
        return x >= 0 && x < width && y >= 0 && y < height;
    }
    
    void carvePath(int x, int y) {
        maze[y][x] = 0; // Mark as path
        
        int neighbors[4][2];
        int neighborCount = 0;
        int directions[4][2] = {{0, 2}, {2, 0}, {0, -2}, {-2, 0}}; // 2 steps for walls
        
        for (int i = 0; i < 4; i++) {
            int nx = x + directions[i][0];
            int ny = y + directions[i][1];
            if (isValid(nx, ny) && maze[ny][nx] == 1) {
                neighbors[neighborCount][0] = nx;
                neighbors[neighborCount][1] = ny;
                neighborCount++;
            }
        }
        
        if (neighborCount > 0) {
            int randomIndex = rand() % neighborCount;
            int nextX = neighbors[randomIndex][0];
            int nextY = neighbors[randomIndex][1];
            int wallX = (x + nextX) / 2;
            int wallY = (y + nextY) / 2;
            
            maze[wallY][wallX] = 0; // Remove wall between cells
            stack[stackSize][0] = x;
            stack[stackSize][1] = y;
            stackSize++;
            carvePath(nextX, nextY);
        } else if (stackSize > 0) {
            stackSize--;
            int prevX = stack[stackSize][0];
            int prevY = stack[stackSize][1];
            carvePath(prevX, prevY);
        }
    }
    
    // Start from top-left corner (ensure it's odd coordinates)
    int startX = 1, startY = 1;
    carvePath(startX, startY);
}`
        }
      }
    };

    return algorithmInfo[algorithm] || {
      name: 'Algorithm',
      description: 'Select an algorithm to see its description and complexity.',
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      bestCase: 'N/A',
      averageCase: 'N/A',
      worstCase: 'N/A'
    };
  };

  const handleCustomDataSubmit = () => {
    try {
      const newData = customData.split(',').map(num => parseInt(num.trim()));
      if (newData.every(num => !isNaN(num) && num > 0)) {
        onDataChange(newData);
        setCustomData('');
      } else {
        alert('Please enter valid positive numbers separated by commas');
      }
    } catch (error) {
      alert('Invalid input format. Please enter numbers separated by commas.');
    }
  };

  const renderVisualizer = () => {
    const algorithmType = algorithm.split('-')[0];
    
    switch (algorithmType) {
      case 'bubble':
      case 'selection':
      case 'insertion':
      case 'merge':
      case 'quick':
      case 'heap':
      case 'radix':
      case 'counting':
      case 'bucket':
        return (
          <SortingVisualizer
            algorithm={algorithm}
            data={data}
            isPlaying={isPlaying}
            speed={speed}
            onDataChange={onDataChange}
            onReset={onGenerateData}
          />
        );
      case 'linear':
      case 'binary':
      case 'ternary':
        return (
          <SearchingVisualizer
            algorithm={algorithm}
            data={data}
            isPlaying={isPlaying}
            speed={speed}
            targetValue={targetValue}
            onReset={onGenerateData}
          />
        );
      case 'bfs':
      case 'dfs':
      case 'dijkstra':
      case 'prim':
      case 'kruskal':
      case 'a':
      case 'bellman':
      case 'floyd':
        return (
          <GraphVisualizer
            algorithm={algorithm}
            isPlaying={isPlaying}
            speed={speed}
            onReset={onGenerateData}
          />
        );
      case 'inorder':
      case 'preorder':
      case 'postorder':
      case 'bst':
      case 'avl':
      case 'rb':
        return (
          <TreeVisualizer
            algorithm={algorithm}
            isPlaying={isPlaying}
            speed={speed}
            onReset={onGenerateData}
          />
        );
      case 'fibonacci':
      case 'knapsack':
      case 'matrix':
        return (
          <DynamicProgrammingVisualizer
            algorithm={algorithm}
            isPlaying={isPlaying}
            speed={speed}
            onReset={onGenerateData}
          />
        );
      case 'kmp':
      case 'rabin':
      case 'z':
        return (
          <SearchingVisualizer
            algorithm={algorithm}
            data={data}
            isPlaying={isPlaying}
            speed={speed}
            targetValue={targetValue}
            onReset={onGenerateData}
          />
        );
      case 'n':
      case 'sudoku':
      case 'maze':
        return (
          <DynamicProgrammingVisualizer
            algorithm={algorithm}
            isPlaying={isPlaying}
            speed={speed}
            onReset={onGenerateData}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500 dark:text-gray-400">
              Select an algorithm to start visualization
            </p>
          </div>
        );
    }
  };

  const info = getAlgorithmInfo();

  return (
    <main className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto max-w-7xl mx-auto space-y-4 p-4">
        {/* Algorithm Info */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-dark-700/50 p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {info.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {info.description}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-dark-700 dark:to-dark-600 px-4 py-2 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Ready to Visualize</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm">Time Complexity</span>
              </div>
              <div className="text-blue-600 dark:text-blue-400 font-mono text-lg font-bold">{info.timeComplexity}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-semibold text-purple-700 dark:text-purple-300 text-sm">Space Complexity</span>
              </div>
              <div className="text-purple-600 dark:text-purple-400 font-mono text-lg font-bold">{info.spaceComplexity}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-green-700 dark:text-green-300 text-sm">Best Case</span>
              </div>
              <div className="text-green-600 dark:text-green-400 font-mono text-lg font-bold">{info.bestCase}</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-200/50 dark:border-red-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-semibold text-red-700 dark:text-red-300 text-sm">Worst Case</span>
              </div>
              <div className="text-red-600 dark:text-red-400 font-mono text-lg font-bold">{info.worstCase}</div>
            </div>
          </div>

          {/* Code Section */}
          {info.code && (
            <CodeDisplay code={info.code} />
          )}
        </div>

        {/* Custom Data Input */}
        {(algorithm.includes('sort') || algorithm.includes('search')) && (
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-dark-700/50 p-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Custom Data Input
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize your data set for visualization
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Enter numbers (comma-separated):
                </label>
                <input
                  type="text"
                  value={customData}
                  onChange={(e) => setCustomData(e.target.value)}
                  placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                />
              </div>
              {algorithm.includes('search') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Target Value:
                  </label>
                  <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseInt(e.target.value))}
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                  />
                </div>
              )}
              <div className="flex items-end">
                <button
                  onClick={handleCustomDataSubmit}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={!customData.trim()}
                >
                  Apply Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visualizer */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-dark-700/50 p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Live Visualization
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Watch the algorithm in action
              </p>
            </div>
          </div>
          {renderVisualizer()}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
