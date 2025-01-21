import { useState } from "react";
import FilterBar from "./components/FilterBar";
import FullscreenMap from "./components/FullscreenMap";

function App() {
  const [filters, setFilters] = useState({ name: "", province: "", sport: "" });

  const handleFilterChange = (newFilters: {
    name: string;
    province: string;
    sport: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="absolute inset-x-0 top-4 z-50 mx-6">
        <FilterBar onFilterChange={handleFilterChange} />
      </div>
      <FullscreenMap filters={filters} />
    </div>
  );
}

export default App;
