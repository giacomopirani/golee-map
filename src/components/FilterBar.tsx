import type React from "react";
import { useCallback, useState } from "react";

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
    <div className="bg-white p-4 shadow-md flex space-x-4">
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
        className="flex-1 p-2 border rounded"
      />
    </div>
  );
};

export default FilterBar;
