import { BarChart3, Filter, MapPin, TrendingUp, Users } from "lucide-react";
import React from "react";
import type { Organization } from "../types/types";

interface StatsData {
  total: number;
  filtered: number;
  hasActiveFilters: boolean;
  sportBreakdown: Record<string, number>;
  provinceBreakdown: Record<string, number>;
}

interface StatsPanelProps {
  organizations: Organization[];
  filteredOrganizations: Organization[];
  hasActiveFilters: boolean;
  className?: string;
  variant?: "compact" | "detailed" | "floating";
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  organizations,
  filteredOrganizations,
  hasActiveFilters,
  className = "",
  variant = "detailed",
}) => {
  // Calcolo statistiche
  const stats: StatsData = React.useMemo(() => {
    const sportBreakdown: Record<string, number> = {};
    const provinceBreakdown: Record<string, number> = {};

    // Analizza le organizzazioni filtrate per le statistiche
    filteredOrganizations.forEach((org) => {
      // Conta sport (un'organizzazione può avere più sport)
      org.sport.forEach((sport) => {
        sportBreakdown[sport] = (sportBreakdown[sport] || 0) + 1;
      });

      // Conta province
      if (org.address?.zone) {
        provinceBreakdown[org.address.zone] =
          (provinceBreakdown[org.address.zone] || 0) + 1;
      }
    });

    return {
      total: organizations.length,
      filtered: filteredOrganizations.length,
      hasActiveFilters,
      sportBreakdown,
      provinceBreakdown,
    };
  }, [organizations, filteredOrganizations, hasActiveFilters]);

  // Top 3 sport più comuni
  const topSports = React.useMemo(() => {
    return Object.entries(stats.sportBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [stats.sportBreakdown]);

  // Top 3 province più comuni
  const topProvinces = React.useMemo(() => {
    return Object.entries(stats.provinceBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [stats.provinceBreakdown]);

  // Variante compatta (mobile/floating)
  if (variant === "compact" || variant === "floating") {
    const baseClasses =
      variant === "floating"
        ? "bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200"
        : "bg-white border border-gray-200";

    return (
      <div className={`${baseClasses} rounded-lg px-3 py-2 ${className}`}>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-gray-900">{stats.filtered}</span>
          {hasActiveFilters && stats.filtered !== stats.total && (
            <span className="text-gray-500">di {stats.total}</span>
          )}
          <span className="text-gray-600">società</span>
        </div>
      </div>
    );
  }

  // Variante dettagliata
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-black dark:border-slate-700 ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-red-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Statistiche
          </h3>
        </div>
      </div>

      {/* Contenuto */}
      <div className="p-4 space-y-4">
        {/* Contatori principali */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-red-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-500">
                Visualizzate
              </span>
            </div>
            <div className="text-2xl font-bold text-red-500">
              {stats.filtered.toLocaleString()}
            </div>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-400 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Totali</span>
            </div>
            <div className="text-2xl font-bold text-gray-700">
              {stats.total.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filtri attivi indicator */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-slate-950 rounded-lg">
            <Filter className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700">
              Filtri attivi - Mostrando{" "}
              {((stats.filtered / stats.total) * 100).toFixed(1)}% del totale
            </span>
          </div>
        )}

        {/* Sport più popolari */}
        {topSports.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Sport più diffusi
            </h4>
            <div className="space-y-2">
              {topSports.map(([sport, count], index) => (
                <div
                  key={sport}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        index === 0
                          ? "bg-green-500"
                          : index === 1
                          ? "bg-yellow-500"
                          : "bg-orange-500"
                      }`}
                    />

                    <span className="text-gray-700 capitalize">{sport}</span>
                  </div>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Province più rappresentate (solo se ci sono risultati e non stiamo filtrando per provincia) */}
        {topProvinces.length > 0 && topProvinces.length > 1 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Province principali
            </h4>
            <div className="space-y-2">
              {topProvinces.slice(0, 3).map(([province, count], index) => (
                <div
                  key={province}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                          ? "bg-indigo-500"
                          : "bg-purple-500"
                      }`}
                    />
                    <span className="text-gray-700 uppercase">{province}</span>
                  </div>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nessun risultato */}
        {stats.filtered === 0 && hasActiveFilters && (
          <div className="text-center py-4">
            <div className="text-gray-400 mb-2">🔍</div>
            <p className="text-sm text-gray-600">
              Nessuna società trovata con i filtri attuali
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPanel;
