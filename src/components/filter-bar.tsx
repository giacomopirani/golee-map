import { PROVINCES } from "@/utils/util";
import type React from "react";
import type { Filters } from "../types/types";
import { Input } from "./ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "./ui/scroll-area";

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
  filters: Filters;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, filters }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const onProvinceChange = (province: string) => {
    onFilterChange({ ...filters, province });
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

        <Select
          onValueChange={onProvinceChange}
          defaultValue={filters.province}
        >
          <SelectTrigger className="max-w-[350px]">
            <SelectValue placeholder="Filtra per provincia" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[300px]">
              {Object.entries(PROVINCES)
                .sort(([, a], [, b]) => a.label.localeCompare(b.label))
                .map(([code, { label }]) => (
                  <SelectItem key={code} value={code}>
                    {label} ({code})
                  </SelectItem>
                ))}
            </ScrollArea>
          </SelectContent>
        </Select>

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
