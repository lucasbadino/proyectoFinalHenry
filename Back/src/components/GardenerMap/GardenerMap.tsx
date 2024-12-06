"use client";

import "leaflet/dist/leaflet.css"; // Importa el CSS directamente desde la URL
import { useEffect, useRef } from "react";

interface GardenerMapProps {
  location: { lat: number; lng: number }; // Ubicación con latitud y longitud
}

const GardenerMap: React.FC<GardenerMapProps> = ({ location }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Importar Leaflet dinámicamente
    const initializeMap = async () => {
      const L = await import("leaflet");

      // Inicializar el mapa solo si aún no existe
      if (!mapRef.current) {
        mapRef.current = L.map("map").setView([location.lat, location.lng], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        // Agregar un marcador circular con tooltip
        const circle = L.circle([location.lat, location.lng], {
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.5,
          radius: 600,
        }).addTo(mapRef.current);

        circle.bindTooltip("Ubicación aproximada con un radio de 1km").openTooltip();
      } else {
        // Actualizar la vista del mapa si ya existe
        mapRef.current.setView([location.lat, location.lng], 14);
      }
    };

    initializeMap();

    // Limpiar el mapa al desmontar el componente
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [location]);

  return (
    <div>
      <h2 className="text-lg font-bold text-[#263238] mb-4">Ubicación aproximada</h2>
      <div
        id="map"
        style={{
          height: "400px",
          width: "100%",
          position: "relative",
          border: "2px solid #4CAF50",
          borderRadius: "8px",
          zIndex: 9,
        }}
      ></div>
    </div>
  );
};

export default GardenerMap;
