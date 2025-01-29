import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import type { Organization } from "../types/types";

import { mapStyleConfig } from "@/utils/map-style-config";
import OrganizationPopup from "./organization-popup";
import SidebarInfoPopup from "./sidebar-info-popup";
import { Theme } from "./theme-provider";

interface FullscreenMapProps {
  organizations: Organization[];
  mapRef: React.MutableRefObject<L.Map | null>;
  theme: Theme;
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  mapBounds: L.LatLngBounds | null;
}

const FullscreenMap: React.FC<FullscreenMapProps> = ({
  organizations,
  mapRef,
  ...props
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState<string>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const initTheme = () => {
    if (!mapRef.current) {
      return;
    }

    L.tileLayer(mapStyleConfig[props.theme].tileLayer, {
      minZoom: 4,
      maxZoom: 18,
      attribution: mapStyleConfig[props.theme].attribution,
      ext: mapStyleConfig[props.theme].ext,
    } as L.TileLayerOptions).addTo(mapRef.current);
  };

  const initMap = () => {
    if (!mapContainerRef.current) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: false,
      minZoom: 5,
    }).setView([42.5, 12.5], 6);

    L.control
      .zoom({
        position: "bottomleft",
      })
      .addTo(mapRef.current);

    initTheme();

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
          html: `<div class="flex items-center justify-center bg-red-600 bg-opacity-15 text-white rounded-full font-bold" style="width: ${size}px; height: ${size}px;"><span>${childCount}</span></div>`,
          className: "custom-cluster-icon",
          iconSize: L.point(size, size),
        });
      },
    });

    mapRef.current.addLayer(markerClusterGroupRef.current);

    mapRef.current.on("moveend", () => {
      if (mapRef.current) {
        props.onBoundsChange(mapRef.current.getBounds());
      }
    });
  };

  const setupMarkers = useCallback(() => {
    if (!mapRef.current || !markerClusterGroupRef.current) return;

    markerClusterGroupRef.current.clearLayers();

    const bounds = L.latLngBounds([]);

    organizations.forEach((org) => {
      if (org.address?.coordinates) {
        const [lat, lng] = org.address.coordinates;

        const customIcon = L.divIcon({
          html: `
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-300">
      <g id="SVGRepo_bgCarrier" stroke-width="0" class="my-marker"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <circle 
          cx="8" 
          cy="8" 
          r="7" 
          fill="#dd2d4a" 
          stroke="#749F9A" 
          stroke-width="2"
          class="transition-all duration-300"
        ></circle>
      </g>
    </svg>
          `,
          className: "custom-div-icon",
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -24],
        });

        const marker = L.marker([lat, lng], {
          icon: customIcon,
        });

        const popupContent = ReactDOMServer.renderToString(
          <OrganizationPopup
            organizationId={org.organizationId}
            name={org.name || ""}
            logo_url={org.logo_url}
            sport={org.sport}
          />
        );

        marker.bindTooltip(org.name);
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
        bounds.extend([lat, lng]);
      }
    });

    if (bounds.isValid()) {
      props.onBoundsChange(bounds);
    }
  }, [organizations]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  useEffect(() => {
    setupMarkers();
  }, [setupMarkers]);

  useEffect(() => {
    if (mapRef.current && markerClusterGroupRef.current) {
      const bounds = markerClusterGroupRef.current.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [organizations]);

  useEffect(() => {
    if (mapRef.current && props.mapBounds && organizations.length === 0) {
      mapRef.current.fitBounds(props.mapBounds);
    }
  }, [organizations, props.mapBounds]);

  const initPopupListeners = () => {
    document.addEventListener("click", (event) => {
      if (event.target) {
        const target = event.target as HTMLElement;

        if (target.classList.contains("more-info-button")) {
          const organizationId = target.dataset.organizationId;

          if (organizationId) {
            setIsSidebarOpen(true);
            setSelectedOrganizationId(organizationId);
          }
        }
      }
    });
  };

  useEffect(() => {
    initPopupListeners();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  console.log({ isSidebarOpen, selectedOrganizationId });

  return (
    <>
      <div ref={mapContainerRef} className="h-full w-full z-40">
        <SidebarInfoPopup
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          organizationId={selectedOrganizationId}
        />
      </div>
    </>
  );
};

export default FullscreenMap;
