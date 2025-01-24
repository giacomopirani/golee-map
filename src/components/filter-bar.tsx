import { PROVINCES } from "@/utils/provinces";
import type React from "react";
import type { Filters } from "../types/types";
import { Input } from "./ui/input";

import { useEffect, useRef, useState } from "react";

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
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const filterBarRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      filterBarRef.current &&
      filterBarRef.current.contains(e.target as Node)
    ) {
      setIsDragging(true);
      dragRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      e.preventDefault(); // Previene il comportamento predefinito
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragRef.current) {
      setPosition({
        x: e.clientX - dragRef.current.x,
        y: e.clientY - dragRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

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
    <nav
      className="relative bg-white border-[#749F9A] border-2 cursor-move rounded-lg shadow-lg p-4 mx-auto object-fit:contain"
      ref={filterBarRef}
      onMouseDown={handleMouseDown}
      style={{ left: position.x, top: position.y }}
    >
      {" "}
      <div className="flex flex-col space-y-4 md:flex-row md:gap-5 md:items-center md:space-y-0 ">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            type="text"
            name="name"
            placeholder="Cerca per nome"
            value={filters.name}
            onChange={handleInputChange}
            className="flex-1 pl-10 w-125 text-slate-500 max-w-[350px]"
          />
        </div>
        <Select
          onValueChange={onProvinceChange}
          defaultValue={filters.province}
        >
          <SelectTrigger className="max-w-[300px] text-slate-500">
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
          <SelectTrigger className="max-w-[300px] text-slate-500">
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
