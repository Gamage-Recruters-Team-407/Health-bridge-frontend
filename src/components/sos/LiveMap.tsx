"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom ambulance icon
const ambulanceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1013/1013280.png',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -19]
});

interface LiveMapProps {
  patientLat: number;
  patientLng: number;
}

export default function LiveMap({ patientLat, patientLng }: LiveMapProps) {
  // Mock ambulance location (offset from patient)
  const [ambulanceLat, setAmbulanceLat] = useState(patientLat + 0.005);
  const [ambulanceLng, setAmbulanceLng] = useState(patientLng + 0.005);

  // Simulate ambulance moving towards patient
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulanceLat(prev => prev - (prev - patientLat) * 0.1);
      setAmbulanceLng(prev => prev - (prev - patientLng) * 0.1);
    }, 2000);
    return () => clearInterval(interval);
  }, [patientLat, patientLng]);

  return (
    <MapContainer center={[patientLat, patientLng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[patientLat, patientLng]}>
        <Popup>Your Location</Popup>
      </Marker>
      <Marker position={[ambulanceLat, ambulanceLng]} icon={ambulanceIcon}>
        <Popup>Incoming Ambulance 🚑</Popup>
      </Marker>
    </MapContainer>
  );
}
