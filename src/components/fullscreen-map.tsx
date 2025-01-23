import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import type { Organization } from "../types/types";

import OrganizationPopup from "./organization-popup";
import SidebarInfoPopup from "./sidebar-info-popup";

interface FullscreenMapProps {
  organizations: Organization[];
}

const FullscreenMap: React.FC<FullscreenMapProps> = ({ organizations }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const initMap = () => {
    if (!mapContainerRef.current || !!mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: false,
      minZoom: 5,
    }).setView([42.5, 12.5], 6);

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
        return zoom >= 15 ? 10 : 55 - zoom * 5;
      },
      disableClusteringAtZoom: 18,
      iconCreateFunction: (cluster) => {
        const childCount = cluster.getChildCount();
        const size = childCount < 10 ? 30 : childCount < 100 ? 40 : 50;
        return L.divIcon({
          html: `<div class="flex items-center justify-center bg-rose-400 bg-opacity-15 text-white rounded-full font-bold" style="width: ${size}px; height: ${size}px;"><span>${childCount}</span></div>`,
          className: "custom-cluster-icon",
          iconSize: L.point(size, size),
        });
      },
    });

    mapRef.current.addLayer(markerClusterGroupRef.current);
  };

  const setupMarkers = useCallback(() => {
    if (!mapRef.current || !markerClusterGroupRef.current) return;

    markerClusterGroupRef.current.clearLayers();
    organizations.forEach((org) => {
      if (org.address?.coordinates) {
        const customIcon = L.divIcon({
          html: `
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0" class="my-marker"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <circle cx="8" cy="8" r="7" fill="#ff9393" stroke="#749F9A" stroke-width="2"></circle>
              </g>
            </svg>
          `,
          className: "custom-div-icon",
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -24],
        });

        const marker = L.marker(org.address.coordinates, {
          icon: customIcon,
        });

        const popupContent = ReactDOMServer.renderToString(
          <OrganizationPopup
            organizationId={org.organizationId}
            name={org.name || ""}
            logo_url={org.logo_url}
          />
        );

        marker.bindTooltip(org.name);
        marker.bindPopup(popupContent);

        marker.on("popupopen", () => {
          const moreInfoButton = document.querySelector(".more-info-button");
          if (moreInfoButton) {
            moreInfoButton.addEventListener("click", (event) => {
              const target = event.target as HTMLElement;
              const organizationId = target.dataset.organizationId;

              if (organizationId) {
                setIsSidebarOpen(true);
                setSelectedOrganization(
                  organizations.find(
                    (org) => org.organizationId === organizationId
                  )!
                );
              }
            });
          }

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
  }, [organizations]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  useEffect(() => {
    setupMarkers();
  }, [setupMarkers]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

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
