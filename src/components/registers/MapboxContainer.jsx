import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapBoxComponent = ({ currentLatitude, currentLongitude, onLocationSelect }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESSTOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [currentLongitude, currentLatitude],
      zoom: 15,
    });

    markerRef.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([currentLongitude, currentLatitude])
      .addTo(mapRef.current);

    markerRef.current.on("dragend", () => {
      const { lng, lat } = markerRef.current.getLngLat();
      onLocationSelect(lat, lng);
    });

    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      markerRef.current.setLngLat([lng, lat]);
      onLocationSelect(lat, lng);
    });

    return () => mapRef.current.remove();
  }, []);

  useEffect(() => {
    if (markerRef.current && currentLatitude && currentLongitude) {
      markerRef.current.setLngLat([currentLongitude, currentLatitude]);
      mapRef.current?.setCenter([currentLongitude, currentLatitude]);
    }
  }, [currentLatitude, currentLongitude]);

  return <div ref={mapContainerRef} style={{ height: "400px", width: "100%", borderRadius: "12px", overflow: "hidden" }} />;
};

export default MapBoxComponent;
