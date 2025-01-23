import { PROVINCES } from "@/utils/provinces";
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
import { SPORTS } from "@/utils/sports";
import { Search } from "lucide-react";
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

  const onSportChange = (sport: string) => {
    onFilterChange({ ...filters, sport });
  };

  return (
    <nav className="bg-white rounded-lg shadow-lg p-4 max-w-4xl mx-auto object-fit: contain">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            name="name"
            placeholder="Cerca per nome"
            value={filters.name}
            onChange={handleInputChange}
            className="flex-1 pl-10 w-125 text-slate-500 w-[290px]"
          />
        </div>
        <Select
          onValueChange={onProvinceChange}
          defaultValue={filters.province}
        >
          <SelectTrigger className="max-w-[350px] text-slate-500">
            <SelectValue placeholder="Filtra per provincia" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[300px] text-slate-500">
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
        <Select onValueChange={onSportChange} defaultValue={filters.sport}>
          <SelectTrigger className="max-w-[350px] text-slate-500">
            <SelectValue placeholder="Filtra per sport" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[300px] text-slate-500">
              {Object.keys(SPORTS).map((key) => (
                <SelectItem key={key} value={key}>
                  {SPORTS[key]}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
};

export default FilterBar;
