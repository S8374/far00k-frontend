"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { Building2 } from "lucide-react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { createRoot } from "react-dom/client";
import { GoHomeFill } from "react-icons/go";
import PropertyCardMap from "../main/PropertyCardMap";
import { useRouter } from "next/navigation";

type MapboxGLModule = typeof import("mapbox-gl");

type MapProperty = {
  id?: string | number;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  [key: string]: unknown;
};

interface PropertyMapProps {
  properties: MapProperty[];
  isMapActive: boolean;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function PropertyMap({ properties, isMapActive }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const markerByPropertyIdRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const activePopupRef = useRef<mapboxgl.Popup | null>(null);
  const router = useRouter();

  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current || !mapboxgl.accessToken) return;

    if (!mapboxgl.supported()) {
      setIsSupported(false);
      return;
    }

    try {
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/standard",
        center: [46.6753, 24.7136],
        zoom: 15.4,
        pitch: 71,
        bearing: -18,
        cooperativeGestures: true,
        antialias: true,
        config: {
          basemap: {
            lightPreset: "night",
            show3dObjects: true,
            showPointOfInterestLabels: true,
            showRoadLabels: true,
            showTransitLabels: false,
          },
        },
      });

      mapInstance.current = map;
    map.on("load", () => {
      // Soft atmospheric fog for a more realistic city depth.
      map.setFog({
        color: "rgb(11, 15, 26)",
        "high-color": "rgb(36, 52, 78)",
        "space-color": "rgb(4, 7, 14)",
        "horizon-blend": 0.28,
      });
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl as unknown as MapboxGLModule,
      marker: false,
      placeholder: "Search location",
      minLength: 1,
      limit: 6,
      autocomplete: true,
      clearAndBlurOnEsc: true,
    });

    map.addControl(geocoder, "top-right");

    const handleMapClick = () => {
      if (activePopupRef.current) {
        activePopupRef.current.remove();
        activePopupRef.current = null;
      }
    };

      map.on("click", handleMapClick);

      return () => {
        map.off("click", handleMapClick);
        markersRef.current.forEach((marker) => marker.remove());
        map.remove();
        mapInstance.current = null;
      };
    } catch (e) {
      console.error("Mapbox WebGL Error:", e);
      setIsSupported(false);
    }
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    markerByPropertyIdRef.current.clear();
    activePopupRef.current = null;

    const bounds = new mapboxgl.LngLatBounds();
    let hasRealCoordinates = false;

    properties.forEach((property) => {
      const lat = Number(property.latitude ?? property.lat);
      const lng = Number(property.longitude ?? property.lng);

      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      bounds.extend([lng, lat]);
      hasRealCoordinates = true;

      const markerDiv = document.createElement("div");
      markerDiv.style.cursor = "pointer";
      const markerRoot = createRoot(markerDiv);
      markerRoot.render(
        <div className="map-home-marker text-3xl text-blue-600">
          <GoHomeFill />
        </div>,
      );

      const popupDiv = document.createElement("div");
      popupDiv.className = "map-popup-container";
      popupDiv.addEventListener("click", (event) => {
        event.stopPropagation();
      });
      const popupRoot = createRoot(popupDiv);
      popupRoot.render(
        <PropertyCardMap
          property={property}
          onCardClick={() => router.push(`/property/${property.id}`)}
        />,
      );

      const popup = new mapboxgl.Popup({
        offset: 30,
        closeButton: true,
        closeOnClick: false,
        maxWidth: "340px",
        className: "map-property-popup",
      }).setDOMContent(popupDiv);

      popup.on("close", () => {
        if (activePopupRef.current === popup) {
          activePopupRef.current = null;
        }
      });

      const marker = new mapboxgl.Marker({
        element: markerDiv,
        anchor: "bottom",
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      const markerElement = marker.getElement();
      markerElement.style.cursor = "pointer";
      markerElement.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (activePopupRef.current && activePopupRef.current !== popup) {
          activePopupRef.current.remove();
        }

        if (popup.isOpen()) {
          popup.remove();
          activePopupRef.current = null;
          return;
        }

        popup.addTo(map);
        activePopupRef.current = popup;
      });

      markersRef.current.push(marker);

      if (property.id !== undefined && property.id !== null) {
        markerByPropertyIdRef.current.set(String(property.id), marker);
      }
    });

    if (hasRealCoordinates) {
      map.fitBounds(bounds, {
        padding: 70,
        duration: 900,
        maxZoom: 16,
        pitch: 71,
        bearing: -18,
      });
    }
  }, [properties, router]);

  useEffect(() => {
    const handleFocusLocation = (event: Event) => {
      const map = mapInstance.current;
      if (!map) return;

      const customEvent = event as CustomEvent<{
        id?: string | number;
        latitude?: number;
        longitude?: number;
      }>;

      const id = customEvent.detail?.id;
      const lat = Number(customEvent.detail?.latitude);
      const lng = Number(customEvent.detail?.longitude);

      const markerById =
        id !== undefined && id !== null
          ? markerByPropertyIdRef.current.get(String(id))
          : undefined;

      const markerLngLat = markerById?.getLngLat();
      const targetLng = Number.isFinite(lng) ? lng : markerLngLat?.lng;
      const targetLat = Number.isFinite(lat) ? lat : markerLngLat?.lat;

      if (typeof targetLng !== "number" || typeof targetLat !== "number") return;

      const mapWidth = map.getContainer().clientWidth;
      const isDesktop = window.innerWidth >= 1024;
      const horizontalOffset = isDesktop ? Math.round(Math.min(220, mapWidth * 0.11)) : 0;
      const verticalOffset = isDesktop ? 170 : 110;

      map.flyTo({
        center: [targetLng, targetLat],
        zoom: 16,
        duration: 900,
        offset: [horizontalOffset, verticalOffset],
      });

      if (markerById) {
        const popup = markerById.getPopup();
        if (popup && activePopupRef.current !== popup) {
          if (activePopupRef.current) {
            activePopupRef.current.remove();
          }
          popup.addTo(map);
          activePopupRef.current = popup;
        }
      }
    };

    window.addEventListener("focus-property-location", handleFocusLocation);
    return () => {
      window.removeEventListener("focus-property-location", handleFocusLocation);
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (isMapActive) {
      map.scrollZoom.enable();
      map.dragPan.enable();
      map.doubleClickZoom.enable();
      map.touchZoomRotate.enable();
      return;
    }

    map.scrollZoom.disable();
    map.dragPan.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();
  }, [isMapActive]);

  if (!mapboxgl.accessToken) {
    return (
      <div className="absolute inset-0 w-full h-full bg-zinc-900 text-zinc-300 flex items-center justify-center p-4 text-center">
        Map cannot load: missing NEXT_PUBLIC_MAPBOX_TOKEN.
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#0D0D0D] text-zinc-500 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4">
           <Building2 className="text-zinc-700" size={32} />
        </div>
        <h3 className="text-white font-bold mb-1">Interactive Map Unavailable</h3>
        <p className="text-sm max-w-xs mx-auto">Your browser or hardware doesn't support WebGL, which is required for this map.</p>
      </div>
    );
  }

  return <div ref={mapRef} className="absolute inset-0 w-full h-full" />;
}


