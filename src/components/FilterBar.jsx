const FilterBar = ({ activeFilter, onFilterChange }) => {
  const filters = [
    "All",
    "Technology",
    "Gaming",
    "Education",
    "Music",
    "Entertainment",
    "Sports",
    "Coding",
  ];

  return (
    <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-thin">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
            activeFilter === filter
              ? "bg-white text-black"
              : "bg-[#272727] text-white hover:bg-[#3f3f3f]"
          }`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
