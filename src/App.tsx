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
    <div className="h-screen w-screen flex flex-col">
      <FilterBar onFilterChange={handleFilterChange} />
      <div className="flex-1">
        <FullscreenMap filters={filters} />
      </div>
    </div>
  );
}

export default App;
