"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issues in Next.js build
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MarkerInfo {
  latitude: number;
  longitude: number;
  name: string;
}

// Component to dynamically fit map bounds to include all markers
function FitBounds({ markers }: { markers: MarkerInfo[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    if (markers.length === 1) {
      map.setView([markers[0].latitude, markers[0].longitude], 12);
    } else {
      const bounds = L.latLngBounds(markers.map((m) => [m.latitude, m.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

interface MapProps {
  latitude?: number;
  longitude?: number;
  name?: string;
  markers?: MarkerInfo[];
}

export default function Map({ latitude, longitude, name, markers = [] }: MapProps) {
  // Normalize parameters to markers array
  const mapMarkers = markers.length > 0 
    ? markers 
    : latitude && longitude && name 
      ? [{ latitude, longitude, name }] 
      : [];

  const defaultCenter: [number, number] = mapMarkers.length > 0 
    ? [mapMarkers[0].latitude, mapMarkers[0].longitude] 
    : [20.5937, 78.9629]; // Default center of India

  const polylinePositions: [number, number][] = mapMarkers.map((m) => [m.latitude, m.longitude]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner min-h-[300px]">
      <MapContainer
        center={defaultCenter}
        zoom={10}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <FitBounds markers={mapMarkers} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapMarkers.map((marker, index) => (
          <Marker 
            key={`${marker.name}-${index}`} 
            position={[marker.latitude, marker.longitude]} 
            icon={markerIcon}
          >
            <Popup className="font-semibold text-slate-800">
              📍 {marker.name}
            </Popup>
          </Marker>
        ))}
        {polylinePositions.length > 1 && (
          <Polyline 
            positions={polylinePositions} 
            color="#2563eb" 
            weight={3.5} 
            dashArray="5, 10" 
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
}
