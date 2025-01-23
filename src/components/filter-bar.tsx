import type React from "react";
import type { Filters } from "../types/types";
import { Input } from "./ui/input";

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
  filters: Filters;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, filters }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <nav className="bg-white rounded-lg shadow-lg p-4 max-w-6xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <Input
          type="text"
          name="name"
          placeholder="Cerca per nome"
          value={filters.name}
          onChange={handleInputChange}
          className="flex-1"
        />
        <Input
          type="text"
          name="province"
          placeholder="Filtra per provincia"
          value={filters.province}
          onChange={handleInputChange}
          className="flex-1"
        />
        <Input
          type="text"
          name="sport"
          placeholder="Filtra per sport"
          value={filters.sport}
          onChange={handleInputChange}
          className="flex-1"
        />
      </div>
    </nav>
  );
};

export default FilterBar;
