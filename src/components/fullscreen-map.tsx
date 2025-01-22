import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { fetchOrganizations } from "../api/organization";
import type { Organization } from "../types/types";
import OrganizationPopup from "./organization-popup";
import SidebarInfoPopup from "./sidebar-info-popup";

interface FullscreenMapProps {
  filters: { name: string; province: string; sport: string };
}

const FullscreenMap: React.FC<FullscreenMapProps> = ({ filters }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const popupPoolRef = useRef<
    Map<string, { root: Root; container: HTMLDivElement }>
  >(new Map());

  const createPopupContent = useCallback((org: Organization) => {
    const popupId = `popup-${org.id}`;
    let popupData = popupPoolRef.current.get(popupId);

    if (!popupData) {
      const container = document.createElement("div");
      const root = createRoot(container);
      popupData = { root, container };
      popupPoolRef.current.set(popupId, popupData);
    }

    const { root, container } = popupData;

    root.render(
      <OrganizationPopup
        name={org.name || ""}
        logo_url={org.logo_url}
        onMoreInfo={() => {
          setSelectedOrganization(org);
          setIsSidebarOpen(true);
        }}
      />
    );

    return container;
  }, []);

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
        minZoom: 5,
      }).setView([42.5, 12.5], 6);

      mapRef.current.setMaxBounds([
        [35.0, 6.0],
        [47.5, 19.0],
      ]);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 4,
        maxZoom: 18,
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
            html: `<div class="flex items-center justify-center bg-red-500 bg-opacity-50 text-white rounded-full font-bold" style="width: ${size}px; height: ${size}px;"><span>${childCount}</span></div>`,
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
      // Pulizia dei root React
      popupPoolRef.current.forEach(({ root }) => root.unmount());
      popupPoolRef.current.clear();
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
              <div class="flex items-center justify-center bg-white border-2 border-red-500 rounded-full" style="width: 24px; height: 24px;">
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            `,
            className: "custom-div-icon",
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24],
          });

          const marker = L.marker(org.address.coordinates, {
            icon: customIcon,
          });

          const popupContent = createPopupContent(org);
          marker.bindPopup(popupContent);

          marker.on("popupopen", () => {
            if (mapRef.current) {
              const px = mapRef.current.project(marker.getLatLng());
              px.y -= 200;
              mapRef.current.panTo(mapRef.current.unproject(px), {
                animate: true,
              });
            }
          });

          markerClusterGroupRef.current?.addLayer(marker);
        }
      });
  }, [organizations, filters, createPopupContent]);

  return (
    <>
      <div ref={mapContainerRef} className="h-full w-full z-40" />
      <SidebarInfoPopup
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        organization={selectedOrganization}
      />
    </>
  );
};

export default FullscreenMap;
