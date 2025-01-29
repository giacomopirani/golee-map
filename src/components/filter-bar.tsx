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
import { Loader2Icon, MenuIcon, MoonIcon, Search, SunIcon } from "lucide-react";
import { Theme } from "./theme-provider";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
  filters: Filters;
  theme: Theme;
  onChangeTheme: (theme: Theme) => void;
  onResetBounds: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  filters,
  ...props
}) => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const initialFilters: Filters = {
    name: "",
    province: "",
    sport: "",
  };

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

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

    props.onResetBounds();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden mb-2"
        onClick={toggleNav}
        aria-label="Toggle filter menu"
      >
        <MenuIcon className="h-4 m-4" />
      </Button>

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
          <div className="relative min-w-[230px] w-full">
            <Search className="absolute dark:text-slate-500 left-3 top-1/2 tex transform -translate-y-1/2  h-4 w-4" />
            <Input
              type="text"
              autoComplete="off"
              name="name"
              placeholder="Cerca per nome"
              value={filters.name}
              onChange={handleInputChange}
              className="flex-1 pl-10 w-full placeholder:text-slate-500 text-sm"
            />
          </div>

          <Select onValueChange={onProvinceChange} value={filters.province}>
            <SelectTrigger className="text-slate-500 min-w-[230px] w-full">
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
            <SelectTrigger className="text-slate-500 min-w-[230px] w-full">
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
    </div>
  );
};

export default FilterBar;
