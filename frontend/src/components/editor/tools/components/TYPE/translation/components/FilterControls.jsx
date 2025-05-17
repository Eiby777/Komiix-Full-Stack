import React from 'react';

const FilterControls = ({ filterText, setFilterText, filterByIndex, setFilterByIndex }) => {
  return (
    <div className="flex items-center gap-2 mb-2 w-[98%] mx-auto">
      <input
        type="text"
        placeholder="Filter translations..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="w-full p-1.5 rounded-md bg-[#2a2a2a] text-white border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-all duration-200 ease-in-out"
      />
      <button
        onClick={() => setFilterByIndex(!filterByIndex)}
        className={`p-1.5 rounded-md ${filterByIndex ? 'bg-blue-500' : 'bg-[#2a2a2a]'} hover:bg-blue-600 transition-all duration-200 ease-in-out flex-shrink-0`}
        title="Filter by current index"
      >
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
        </svg>
      </button>
    </div>
  );
};

export default FilterControls;