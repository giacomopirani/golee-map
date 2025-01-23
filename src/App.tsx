import { useEffect, useState } from "react";
import { fetchOrganizations } from "./api/organization";
import FilterBar from "./components/filter-bar";
import FullscreenMap from "./components/fullscreen-map";
import { Filters, Organization } from "./types/types";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    province: "",
    sport: "",
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    Organization[]
  >([]);

  const handleFilterChange = (newFilters: Filters) => {
    console.log(newFilters);

    setFilters(newFilters);

    const filteredOrganizations = organizations.filter((org) => {
      const nameMatch = org.name
        .toLowerCase()
        .includes(newFilters.name.toLowerCase());

      const sportMatch = org.sport.some((sport) =>
        sport.toLowerCase().includes(newFilters.sport.toLowerCase())
      );

      const provinceMatch =
        org && org.address && org.address.zone
          ? org.address.zone
              .toLowerCase()
              .includes(String(newFilters.province).toLowerCase())
          : false;

      return provinceMatch && nameMatch && sportMatch;
    });

    setFilteredOrganizations(filteredOrganizations);
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const data = await fetchOrganizations();
      setOrganizations(data);
      setFilteredOrganizations(data);
    } catch (err) {
      console.error("Error fetching organizations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-screen overflow-hidden">
      <div className="absolute inset-x-0 top-4 z-50 mx-6">
        <FilterBar onFilterChange={handleFilterChange} filters={filters} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <FullscreenMap organizations={filteredOrganizations} />
      )}
    </div>
  );
}

export default App;
