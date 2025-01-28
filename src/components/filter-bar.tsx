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
import { Loader2Icon, MoonIcon, Search, SunIcon } from "lucide-react";
import { Theme } from "./theme-provider";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
  filters: Filters;
  theme: Theme;
  onChangeTheme: (theme: Theme) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  filters,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const initialFilters: Filters = {
    name: "",
    province: "",
    sport: "",
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      filterBarRef.current &&
      filterBarRef.current.contains(target) &&
      target.tagName !== "INPUT"
    ) {
      setIsDragging(true);
      dragRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragRef.current) {
      requestAnimationFrame(() => {
        const newX = e.clientX - (dragRef.current?.x || 0);
        const newY = e.clientY - (dragRef.current?.y || 0);

        if (newX !== position.x || newY !== position.y) {
          setPosition({ x: newX, y: newY });
        }
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
    if (province !== "default") {
      onFilterChange({ ...filters, province });
    }
  };

  const onSportChange = (sport: string) => {
    if (sport !== "default") {
      onFilterChange({ ...filters, sport });
    }
  };

  const handleResetFilters = () => {
    onFilterChange(initialFilters);
  };
  return (
    <nav
      className={`relative bg-background border-2 cursor-pointer transition-transform duration-200 rounded-lg shadow-lg p-4 mx-auto  ${
        !isDragging && "animate-pulse-light"
      }
          ${
            isDragging
              ? "shadow-xl scale-105"
              : "hover:shadow-xl hover:-translate-y-1"
          }
      }`}
      ref={filterBarRef}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.1s ease",
      }}
    >
      <div className="flex flex-col space-y-4 md:flex-row md:gap-5 md:items-center md:space-y-0 ">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
          <Input
            type="text"
            autoComplete="off"
            name="name"
            placeholder="Cerca per nome"
            value={filters.name}
            onChange={handleInputChange}
            className="flex-1 pl-10 w-125"
          />
        </div>
        <Select onValueChange={onProvinceChange} value={filters.province}>
          <SelectTrigger className=" text-slate-500 w-[230px]">
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
        <Select onValueChange={onSportChange} value={filters.sport}>
          <SelectTrigger className="text-slate-500 w-[230px]">
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
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={"outline"}
            onClick={handleResetFilters}
            className="w-[36px] rounded-full"
          >
            ×
          </Button>
          <Button
            variant={"outline"}
            className="w-[36px] rounded-full"
            onClick={() => {
              if (isButtonDisabled) return;
              props.onChangeTheme(props.theme === "dark" ? "light" : "dark");
              setIsButtonDisabled(true);
              setTimeout(() => {
                setIsButtonDisabled(false);
              }, 2000);
            }}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <> {props.theme === "dark" ? <SunIcon /> : <MoonIcon />}</>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default FilterBar;
