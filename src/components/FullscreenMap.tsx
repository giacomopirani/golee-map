import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { fetchOrganizations } from "../api/organization";
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
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        minZoom: 4,
      }).setView([42.5, 10.5], 6);

      mapRef.current.setMaxBounds([
        [30.0, -10.0],
        [50.0, 30.0],
      ]);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 4, // Match the map's minZoom
        maxZoom: 18, // Reduced slightly to maintain focus on the region
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: "png",
      } as L.TileLayerOptions).addTo(mapRef.current);

      L.control
        .zoom({
          position: "bottomleft",
        })
        .addTo(mapRef.current);

      markerClusterGroupRef.current = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: (zoom) => {
          return zoom >= 15 ? 10 : 60 - zoom * 5;
        },
        disableClusteringAtZoom: 18,
        iconCreateFunction: (cluster) => {
          const childCount = cluster.getChildCount();
          const size = childCount < 10 ? 30 : childCount < 100 ? 40 : 50;
          return L.divIcon({
            html: `<div style="width: ${size}px; height: ${size}px;"><span>${childCount}</span></div>`,
            className: "custom-cluster-icon",
            iconSize: L.point(size, size),
          });
        },
      });

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
          const customIcon = L.divIcon({
            html: `
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="rgba(255, 0, 0, 0.6)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dot"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>
            `,
            className: "custom-div-icon",
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24],
          });

          const marker = L.marker(org.address.coordinates, { icon: customIcon })
            .bindPopup(`
            <strong>${org.name || "Nome non disponibile"}</strong><br>
            Sport: ${org.sport?.join(", ") || "Non specificato"}<br>
            Indirizzo: ${org.address.address || ""}, ${
            org.address.town || ""
          }<br>
            <img src="${
              org.logo_url || "/placeholder.svg?height=100&width=100"
            }" alt="Logo ${
            org.name || ""
          }" style="max-width: 100px; max-height: 100px;">
          `);
          markerClusterGroupRef.current?.addLayer(marker);
        }
      });
  }, [organizations, filters]);

  return <div ref={mapContainerRef} className="h-full w-full z-40" />;
};

export default FullscreenMap;
