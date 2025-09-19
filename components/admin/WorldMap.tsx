"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface WorldMapProps {
    lat: number;
    long: number;
    zoom: number;
}

const WorldMap = ({lat, long, zoom}: WorldMapProps) => {
  useEffect(() => {
    // No need to put anything here unless you're interacting with map instance
  }, []);

  return (
    <div className="w-full h-full z-0 relative">
      <MapContainer
        center={[lat, long]}
        zoom={zoom}
        minZoom={5}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
