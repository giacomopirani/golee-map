import { PROVINCES } from "@/utils/provinces";
import type React from "react";
import type { Filters } from "../types/types";
import { Input } from "./ui/input";

import { useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORTS } from "@/utils/sports";
import {
  Loader2Icon,
  MenuIcon,
  MoonIcon,
  RotateCcw,
  Search,
  ShieldHalf,
  SunIcon,
  X,
} from "lucide-react";
import { Theme } from "./theme-provider";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
  filters: Filters;
  theme: Theme;
  onChangeTheme: (theme: Theme) => void;
  onResetBounds: () => void;
  onResetFilters?: () => void;
  stats?: {
    total: number;
    filtered: number;
    hasActiveFilters: boolean;
  };
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  filters,
  onResetFilters,
  stats,
  ...props
}) => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const onProvinceChange = (province: string) => {
    if (province === "reset") {
      onFilterChange({ ...filters, province: "" });
    } else {
      onFilterChange({ ...filters, province });
    }
  };

  const onSportChange = (sport: string) => {
    if (sport === "reset") {
      onFilterChange({ ...filters, sport: "" });
    } else {
      onFilterChange({ ...filters, sport });
    }
  };

  const handleResetFilters = () => {
    const initialFilters: Filters = {
      name: "",
      province: "",
      sport: "",
    };
    onFilterChange(initialFilters);

    if (onResetFilters) {
      onResetFilters();
    }

    props.onResetBounds();
  };

  const hasActiveFilters =
    filters.name !== "" || filters.province !== "" || filters.sport !== "";

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Mobile Toggle Button */}
      <div className="flex items-center gap-2 lg:hidden mb-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleNav}
          aria-label="Toggle filter menu"
          className="h-10 w-10"
        >
          <MenuIcon className="h-4 w-4" />
        </Button>

        {/* Quick Stats Mobile */}
        {stats && (
          <div className="flex bg-white/90 dark:bg-black backdrop-blur-sm rounded-lg px-3 py-2 border text-sm gap-1">
            <ShieldHalf size={20} color="red" />
            <span className="font-medium dark:text-slate-600">
              {stats.filtered}
            </span>
            <span className="text-gray-600 ml-1">
              {stats.hasActiveFilters && stats.filtered !== stats.total
                ? `di ${stats.total} società`
                : "società"}
            </span>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <nav
        className={`
          bg-background border-2 rounded-lg shadow-lg p-4
          transition-all duration-300 ease-in-out
          ${
            isNavVisible
              ? "max-h-[1000px] opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }
          lg:max-h-[1000px] lg:opacity-100 lg:overflow-visible
        `}
        ref={filterBarRef}
      >
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute dark:text-slate-500 left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              type="text"
              autoComplete="off"
              name="name"
              placeholder="Cerca per nome società..."
              value={filters.name}
              onChange={handleInputChange}
              className="flex-1 pl-10 w-full placeholder:text-slate-500 text-sm"
            />
            {filters.name && (
              <button
                onClick={() => onFilterChange({ ...filters, name: "" })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Province Filter */}
          <div className="min-w-[200px] lg:min-w-[230px]">
            <Select
              onValueChange={onProvinceChange}
              value={filters.province || ""}
            >
              <SelectTrigger className="text-slate-500 w-full">
                <SelectValue placeholder="Tutte le province" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[300px] text-slate-500">
                  {filters.province && (
                    <SelectItem
                      value="reset"
                      className="text-red-600 font-medium"
                    >
                      ✕ Rimuovi filtro provincia
                    </SelectItem>
                  )}
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
          </div>

          {/* Sport Filter */}
          <div className="min-w-[200px] lg:min-w-[230px]">
            <Select onValueChange={onSportChange} value={filters.sport || ""}>
              <SelectTrigger className="text-slate-500 w-full">
                <SelectValue placeholder="Tutti gli sport" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[300px] text-slate-500">
                  {filters.sport && (
                    <SelectItem
                      value="reset"
                      className="text-red-600 font-medium"
                    >
                      ✕ Rimuovi filtro sport
                    </SelectItem>
                  )}
                  {Object.keys(SPORTS).map((key) => (
                    <SelectItem key={key} value={key}>
                      {SPORTS[key]}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 lg:ml-auto">
            {/* Reset Filters Button */}
            <Button
              variant={hasActiveFilters ? "default" : "outline"}
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              className={`flex items-center gap-2 ${
                hasActiveFilters ? "bg-red-500 hover:bg-red-700 text-white" : ""
              }`}
              title="Rimuovi tutti i filtri"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              onClick={() => {
                if (isButtonDisabled) return;
                props.onChangeTheme(props.theme === "dark" ? "light" : "dark");
                setIsButtonDisabled(true);
                setTimeout(() => {
                  setIsButtonDisabled(false);
                }, 2000);
              }}
              disabled={isButtonDisabled}
              title={`Passa al tema ${
                props.theme === "dark" ? "chiaro" : "scuro"
              }`}
              className="h-10 w-10 p-0"
            >
              {isButtonDisabled ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {props.theme === "dark" ? (
                    <SunIcon className="h-4 w-4" />
                  ) : (
                    <MoonIcon className="h-4 w-4" />
                  )}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Active Filters Summary (Desktop) */}
        {hasActiveFilters && (
          <div className="hidden lg:flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">Filtri attivi:</span>
            {filters.name && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Nome: "{filters.name}"
                <button
                  onClick={() => onFilterChange({ ...filters, name: "" })}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.province && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Provincia: "{filters.province.toUpperCase()}"
                <button
                  onClick={() => onFilterChange({ ...filters, province: "" })}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.sport && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                Sport: "{SPORTS[filters.sport]}"
                <button
                  onClick={() => onFilterChange({ ...filters, sport: "" })}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default FilterBar;
