import { useState } from "react";

const DateFilter = ({ onFilterChange }) => {
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleFilterChange("all")}
        className={`text-xs uppercase tracking-widest px-4 py-2 border-2 transition-all rounded-lg font-medium ${
          filter === "all"
            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white border-primary-600 shadow-lg"
            : "bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:text-primary-700"
        }`}
      >
        All
      </button>
      <button
        onClick={() => handleFilterChange("thisMonth")}
        className={`text-xs uppercase tracking-widest px-4 py-2 border-2 transition-all rounded-lg font-medium ${
          filter === "thisMonth"
            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white border-primary-600 shadow-lg"
            : "bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:text-primary-700"
        }`}
      >
        This Month
      </button>
      <button
        onClick={() => handleFilterChange("lastMonth")}
        className={`text-xs uppercase tracking-widest px-4 py-2 border-2 transition-all rounded-lg font-medium ${
          filter === "lastMonth"
            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white border-primary-600 shadow-lg"
            : "bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:text-primary-700"
        }`}
      >
        Last Month
      </button>
    </div>
  );
};

export default DateFilter;

