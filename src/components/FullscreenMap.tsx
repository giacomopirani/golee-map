import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { fetchOrganizations } from "../api/organization.ts";
import type { Organization } from "../types/types";

interface FullscreenMapProps {
  filters: { name: string; province: string; sport: string };
}

const FullscreenMap: React.FC<FullscreenMapProps> = ({ filters }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchOrganizations();
      setOrganizations(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [41.9028, 12.4964],
        6
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      markerClusterGroupRef.current = L.markerClusterGroup();
      mapRef.current.addLayer(markerClusterGroupRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerClusterGroupRef.current) return;

    markerClusterGroupRef.current.clearLayers();

    organizations
      .filter((org) => {
        const nameMatch =
          org.name?.toLowerCase().includes(filters.name.toLowerCase()) ?? false;
        const provinceMatch =
          org.address?.zone
            ?.toLowerCase()
            .includes(filters.province.toLowerCase()) ?? false;
        const sportMatch =
          org.sport?.some((s) =>
            s.toLowerCase().includes(filters.sport.toLowerCase())
          ) ?? false;
        return nameMatch && provinceMatch && sportMatch;
      })
      .forEach((org) => {
        if (org.address?.coordinates) {
          const marker = L.marker(org.address.coordinates).bindPopup(`
            <strong>${org.name || "Nome non disponibile"}</strong><br>
            Sport: ${org.sport?.join(", ") || "Non specificato"}<br>
            Indirizzo: ${org.address.address || ""}, ${
            org.address.town || ""
          }<br>
            <img src="${org.logo_url || ""}" alt="Logo ${
            org.name || ""
          }" style="max-width: 100px; max-height: 100px;">
          `);
          markerClusterGroupRef.current?.addLayer(marker);
        }
      });
  }, [organizations, filters]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default FullscreenMap;
