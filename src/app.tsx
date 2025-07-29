import L from "leaflet";
import { ChartNoAxesCombined } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchOrganizations } from "./api/organization";
import FilterBar from "./components/filter-bar";
import FullscreenMap from "./components/fullscreen-map";
import StatsPanel from "./components/stats-panel";
import { Theme, useTheme } from "./components/theme-provider";
import "./index.css";
import { Filters, Organization } from "./types/types";
import { mapStyleConfig } from "./utils/map-style-config";

// Debounce hook per ottimizzare i filtri
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function App() {
  const mapRef = useRef<L.Map | null>(null);
  const { setTheme, theme } = useTheme();

  // Stati esistenti
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    province: "",
    sport: "",
  });
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Debounce dei filtri per migliorare performance
  const debouncedFilters = useDebounce(filters, 300);

  // Calcolo organizzazioni filtrate con useMemo per ottimizzazione
  const filteredOrganizations = useMemo(() => {
    if (!organizations.length) return [];

    return organizations.filter((org) => {
      const nameMatch = org.name
        .toLowerCase()
        .includes(debouncedFilters.name.toLowerCase());

      const sportMatch =
        debouncedFilters.sport === "" ||
        org.sport.some((sport) =>
          sport.toLowerCase().includes(debouncedFilters.sport.toLowerCase())
        );

      const provinceMatch =
        debouncedFilters.province === "" ||
        (org?.address?.zone &&
          org.address.zone
            .toLowerCase()
            .includes(String(debouncedFilters.province).toLowerCase()));

      return nameMatch && sportMatch && provinceMatch;
    });
  }, [organizations, debouncedFilters]);

  // Stats per la UI
  const stats = useMemo(
    () => ({
      total: organizations.length,
      filtered: filteredOrganizations.length,
      hasActiveFilters:
        debouncedFilters.name !== "" ||
        debouncedFilters.province !== "" ||
        debouncedFilters.sport !== "",
    }),
    [organizations.length, filteredOrganizations.length, debouncedFilters]
  );

  // Gestione cambio filtri ottimizzata
  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  // Reset filtri
  const handleResetFilters = useCallback(() => {
    setFilters({
      name: "",
      province: "",
      sport: "",
    });
  }, []);

  // Aggiorna bounds mappa quando cambiano le organizzazioni filtrate
  useEffect(() => {
    if (!mapRef.current || !filteredOrganizations.length) return;

    const bounds = L.latLngBounds(
      filteredOrganizations
        .filter((org) => org.address?.coordinates)
        .map((org) => org.address.coordinates)
    );

    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15, // Evita zoom eccessivo
      });
    }
  }, [filteredOrganizations]);

  const updateMapBounds = useCallback((bounds: L.LatLngBounds) => {
    setMapBounds(bounds);
  }, []);

  const handleResetBounds = useCallback(() => {
    if (mapRef.current && mapBounds) {
      mapRef.current.fitBounds(mapBounds);
    }
  }, [mapBounds]);

  const changeTheme = useCallback(
    (_theme: Theme) => {
      if (!mapRef.current) return;

      setTheme(_theme);

      // Rimuovi layer esistenti prima di aggiungere quello nuovo
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapRef.current?.removeLayer(layer);
        }
      });

      L.tileLayer(mapStyleConfig[_theme].tileLayer, {
        minZoom: 4,
        maxZoom: 18,
        attribution: mapStyleConfig[_theme].attribution,
        ext: mapStyleConfig[_theme].ext,
      } as L.TileLayerOptions).addTo(mapRef.current);
    },
    [setTheme]
  );

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchOrganizations();
      setOrganizations(data);
    } catch (err) {
      console.error("Error fetching organizations:", err);
      setError("Errore nel caricamento dei dati. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Retry function per errori
  const handleRetry = useCallback(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">
            Oops! Qualcosa è andato storto
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative">
      {/* Header con filtri e stats */}
      <div className="absolute z-50 flex flex-col w-full">
        <div className="p-4">
          <div className="flex gap-4 max-w-7xl mx-auto">
            {/* FilterBar */}
            <div className="flex-1">
              <FilterBar
                onFilterChange={handleFilterChange}
                filters={filters}
                theme={theme}
                onChangeTheme={changeTheme}
                onResetBounds={handleResetBounds}
                onResetFilters={handleResetFilters}
                stats={stats}
              />
            </div>
          </div>
        </div>
        {/* Barra risultati */}
        {stats.hasActiveFilters && (
          <div className="px-4 pb-2 hidden lg:block">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/90 dark:bg-black backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Risultati: <strong>{filteredOrganizations.length}</strong>{" "}
                    società su {stats.total}
                  </span>
                  {filteredOrganizations.length === 0 && (
                    <span className="text-red-600">
                      Nessun risultato trovato
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Panel (Desktop - Sidebar) */}
      {showStats && !isLoading && (
        <div
          className="absolute right-4 top-4 z-40 w-80 hidden lg:block"
          style={{ marginTop: "120px" }}
        >
          <StatsPanel
            organizations={organizations}
            filteredOrganizations={filteredOrganizations}
            hasActiveFilters={stats.hasActiveFilters}
            variant="detailed"
          />
        </div>
      )}

      {/* Loading state migliorato */}
      {isLoading ? (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-600 mb-4 mx-auto"></div>
            <p className="text-gray-600">Caricamento società sportive...</p>
          </div>
        </div>
      ) : (
        <FullscreenMap
          organizations={filteredOrganizations}
          mapRef={mapRef}
          theme={theme}
          onBoundsChange={updateMapBounds}
          mapBounds={mapBounds}
        />
      )}

      {/* Mobile Stats Panel (Full overlay) */}
      {showStats && (
        <div
          className="absolute inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setShowStats(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black rounded-t-xl p-4 max-h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end items-center mb-2">
              <button
                onClick={() => setShowStats(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <StatsPanel
              organizations={organizations}
              filteredOrganizations={filteredOrganizations}
              hasActiveFilters={stats.hasActiveFilters}
              variant="detailed"
            />
          </div>
        </div>
      )}

      {/* Mobile Stats Toggle Button */}
      <div className="absolute bottom-5 right-5 z-40 lg:hidden">
        <button
          onClick={() => setShowStats(true)}
          className="bg-white hover:bg-slate-200 text-gray-500 dark:bg-black dark:border dark:border-slate-500 p-4 rounded-lg shadow-lg transition-colors"
          title="Mostra statistiche dettagliate"
        >
          <ChartNoAxesCombined size={20} />
        </button>
      </div>
    </div>
  );
}

export default App;
