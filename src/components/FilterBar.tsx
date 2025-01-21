import type React from "react";
import { useCallback, useState } from "react";
import logoGolee from "../img/logo-golee-1.svg";

interface FilterBarProps {
  onFilterChange: (filters: {
    name: string;
    province: string;
    sport: string;
  }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [name, setName] = useState("");
  const [province, setProvince] = useState("");
  const [sport, setSport] = useState("");

  const handleInputChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setter(newValue);
        onFilterChange({ name, province, sport, [e.target.name]: newValue });
      },
    [name, province, sport, onFilterChange]
  );

  return (
    <nav className="bg-white rounded-lg shadow-lg p-4 max-w-6xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="w-30 flex md:items-center ">
          <img src={logoGolee} alt="Logo" className="h-10 w-auto mx-30  flex" />
        </div>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 flex-grow">
          <input
            type="text"
            name="name"
            placeholder="Cerca per nome"
            value={name}
            onChange={handleInputChange(setName)}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="text"
            name="province"
            placeholder="Filtra per provincia"
            value={province}
            onChange={handleInputChange(setProvince)}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="text"
            name="sport"
            placeholder="Filtra per sport"
            value={sport}
            onChange={handleInputChange(setSport)}
            className="flex-1 p-2 border rounded "
          />
        </div>
      </div>
    </nav>
  );
};

export default FilterBar;
