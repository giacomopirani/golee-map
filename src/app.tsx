import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { fetchOrganizations } from "./api/organization";
import FilterBar from "./components/filter-bar";
import FullscreenMap from "./components/fullscreen-map";
import { Theme, useTheme } from "./components/theme-provider";
import "./index.css";
import { Filters, Organization } from "./types/types";
import { mapStyleConfig } from "./utils/map-style-config";

function App() {
  const mapRef = useRef<L.Map | null>(null);

  const { setTheme, theme } = useTheme();

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

  const changeTheme = (_theme: Theme) => {
    if (!mapRef.current) {
      return;
    }

    setTheme(_theme);

    L.tileLayer(mapStyleConfig[_theme].tileLayer, {
      minZoom: 4,
      maxZoom: 18,
      attribution: mapStyleConfig[_theme].attribution,
      ext: mapStyleConfig[_theme].ext,
    } as L.TileLayerOptions).addTo(mapRef.current);
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
      <div className="absolute z-50 flex p-4 w-full">
        <FilterBar
          onFilterChange={handleFilterChange}
          filters={filters}
          theme={theme}
          onChangeTheme={changeTheme}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-8 border-gray-500"></div>
        </div>
      ) : (
        <FullscreenMap
          organizations={filteredOrganizations}
          mapRef={mapRef}
          theme={theme}
        />
      )}
    </div>
  );
}

export default App;
