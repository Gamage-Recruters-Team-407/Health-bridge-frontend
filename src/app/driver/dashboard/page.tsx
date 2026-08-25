"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Navigation, MapPin, StopCircle } from 'lucide-react';

interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number | null;
}

export default function DriverDashboard() {
  const [isDispatchActive, setIsDispatchActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const watchIdRef = useRef<number | null>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 10));
  };

  const startTracking = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      addLog("Error: Geolocation is not supported by your browser");
      return;
    }

    setIsDispatchActive(true);
    addLog("Dispatch accepted. Starting GPS tracker...");

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude, accuracy, speed });
        
        // TODO: In production, broadcast this to Spring Boot WebSocket!
        addLog(`Transmitting: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      },
      (error) => {
        addLog(`GPS Error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsDispatchActive(false);
    setCurrentLocation(null);
    addLog("Dispatch ended. Tracking stopped.");
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>Ambulance Driver Portal</h1>
        <p style={{ color: '#64748B' }}>HealthBridge Emergency Network</p>
      </header>

      {/* Active Emergency Info Card */}
      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>Pending Dispatch #HB-9912</h2>
          <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>Priority 1</span>
        </div>
        <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}><strong>Patient:</strong> John Doe</p>
        <p style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}><strong>Condition:</strong> Critical</p>
        <p style={{ fontSize: '14px', color: '#475569' }}><strong>Address:</strong> 123 Main St, Colombo</p>
      </div>

      {/* Main Action Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {!isDispatchActive ? (
          <button 
            onClick={startTracking}
            style={{ backgroundColor: '#2563EB', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)' }}
          >
            <Navigation size={24} />
            Accept Dispatch & Start Tracking
          </button>
        ) : (
          <button 
            onClick={stopTracking}
            style={{ backgroundColor: '#DC2626', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.4)' }}
          >
            <StopCircle size={24} />
            Arrived / End Tracking
          </button>
        )}
      </div>

      {/* Live Telemetry Display */}
      {isDispatchActive && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#059669' }}>
            <MapPin size={20} />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Live Telemetry Active</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Latitude</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A', fontFamily: 'monospace' }}>{currentLocation?.lat.toFixed(6) || '---'}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Longitude</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A', fontFamily: 'monospace' }}>{currentLocation?.lng.toFixed(6) || '---'}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Accuracy</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A' }}>{currentLocation ? `±${Math.round(currentLocation.accuracy)}m` : '---'}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Speed</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A' }}>{currentLocation?.speed ? `${Math.round(currentLocation.speed * 3.6)} km/h` : '0 km/h'}</p>
            </div>
          </div>
        </div>
      )}

      {/* System Logs */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', marginBottom: '12px', textTransform: 'uppercase' }}>Transmission Logs</h3>
        <div style={{ backgroundColor: '#1E293B', color: '#38BDF8', padding: '16px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px', minHeight: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {logs.length === 0 ? (
            <span style={{ color: '#64748B' }}>System idle. Waiting for dispatch...</span>
          ) : (
            logs.map((log, i) => (
              <div key={i} style={{ opacity: 1 - (i * 0.1) }}>{log}</div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
