"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Realistic Top-Down Ambulance SVG with flashing siren lights
const ambulanceSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="30" height="60">
  <rect x="10" y="10" width="80" height="180" rx="15" fill="#f8f9fa" stroke="#ced4da" stroke-width="2"/>
  <rect x="25" y="40" width="50" height="25" rx="5" fill="#212529" opacity="0.8"/>
  <path d="M 15 80 L 85 80 L 85 180 L 15 180 Z" fill="#ffffff" stroke="#e9ecef" stroke-width="1"/>
  <rect x="40" y="100" width="20" height="60" fill="#dc3545"/>
  <rect x="20" y="120" width="60" height="20" fill="#dc3545"/>
  <!-- Sirens -->
  <rect x="25" y="5" width="15" height="10" rx="2" fill="#dc3545">
    <animate attributeName="fill" values="#dc3545;#ffcccc;#dc3545" dur="0.4s" repeatCount="indefinite"/>
  </rect>
  <rect x="60" y="5" width="15" height="10" rx="2" fill="#0d6efd">
    <animate attributeName="fill" values="#0d6efd;#ccccff;#0d6efd" dur="0.4s" repeatCount="indefinite"/>
  </rect>
</svg>`;

// Function to generate rotated ambulance icon
const getAmbulanceIcon = (angle: number) => L.divIcon({
  html: `<div style="transform: rotate(${angle}deg); filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.4)); transition: transform 0.5s ease; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
          ${ambulanceSVG}
         </div>`,
  className: 'ambulance-realistic-icon',
  iconSize: [30, 60],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

interface LiveMapProps {
  patientLat: number;
  patientLng: number;
  isActive?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
  onArrival?: () => void;
  onProgress?: (distanceKm: number, timeMins: number) => void;
}

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distance in km
}

export default function LiveMap({ patientLat, patientLng, isActive = false, onLocationChange, onArrival, onProgress }: LiveMapProps) {
  // Mock ambulance location (offset from patient)
  const [ambulanceLat, setAmbulanceLat] = useState(patientLat + 0.005);
  const [ambulanceLng, setAmbulanceLng] = useState(patientLng + 0.005);
  const [ambulanceAngle, setAmbulanceAngle] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);

  // Simulate ambulance moving towards patient only if active
  useEffect(() => {
    if (!isActive) {
      setHasArrived(false);
      return;
    }
    
    // Reset position when activated
    let currentLat = patientLat + 0.01; // ~1km away
    let currentLng = patientLng + 0.01;
    setAmbulanceLat(currentLat);
    setAmbulanceLng(currentLng);
    
    // Initial bearing
    const dx = patientLng - currentLng;
    const dy = patientLat - currentLat;
    const initialAngle = Math.atan2(dx, dy) * (180 / Math.PI);
    setAmbulanceAngle(initialAngle);
    
    setHasArrived(false);
    
    // Initial distance report
    if (onProgress) {
      const dist = getDistanceFromLatLonInKm(currentLat, currentLng, patientLat, patientLng);
      onProgress(dist, dist * 1.5); // assuming 40km/h -> 1.5 mins per km
    }
    
    const interval = setInterval(() => {
      // Calculate next step towards patient
      const nextLat = currentLat - (currentLat - patientLat) * 0.15;
      const nextLng = currentLng - (currentLng - patientLng) * 0.15;
      
      // Calculate bearing angle to make ambulance face the direction of travel
      const moveDx = nextLng - currentLng;
      const moveDy = nextLat - currentLat;
      const angle = Math.atan2(moveDx, moveDy) * (180 / Math.PI);
      
      currentLat = nextLat;
      currentLng = nextLng;
      
      const distKm = getDistanceFromLatLonInKm(currentLat, currentLng, patientLat, patientLng);
      
      setAmbulanceLat(currentLat);
      setAmbulanceLng(currentLng);
      setAmbulanceAngle(angle);
      
      if (distKm < 0.05) { // arrived if < 50 meters
        clearInterval(interval);
        setHasArrived(true);
        if (onArrival) onArrival();
      } else {
        // Report progress
        if (onProgress) {
          onProgress(distKm, distKm * 1.5);
        }
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [patientLat, patientLng, isActive, onArrival, onProgress]);

  return (
    <MapContainer center={[patientLat, patientLng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
      <MapUpdater lat={patientLat} lng={patientLng} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker 
        draggable={!!onLocationChange}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const pos = marker.getLatLng();
            if (onLocationChange) {
              onLocationChange(pos.lat, pos.lng);
            }
          }
        }}
        position={[patientLat, patientLng]}
      >
        <Popup>Drag to adjust your exact location</Popup>
      </Marker>
      {isActive && (
        <Marker position={[ambulanceLat, ambulanceLng]} icon={getAmbulanceIcon(ambulanceAngle)}>
          <Popup>Incoming Ambulance 🚑</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
