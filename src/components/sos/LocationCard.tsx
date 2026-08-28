import React from 'react';
import dynamic from 'next/dynamic';
import styles from './sos-components.module.css';
import { LocationInfo } from '../../types/emergency';

const LiveMap = dynamic(() => import('./LiveMap'), { 
  ssr: false,
  loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9' }}>Loading map...</div>
});

interface LocationCardProps {
  location: LocationInfo;
  isActive?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
  onArrival?: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location, isActive = false, onLocationChange, onArrival }) => {
  const [ambulanceArrived, setAmbulanceArrived] = React.useState(false);
  const [liveDistanceKm, setLiveDistanceKm] = React.useState<number | null>(null);
  const [liveTimeMins, setLiveTimeMins] = React.useState<number | null>(null);

  // Reset tracking states if emergency is cancelled
  React.useEffect(() => {
    if (!isActive) {
      setAmbulanceArrived(false);
      setLiveDistanceKm(null);
      setLiveTimeMins(null);
    }
  }, [isActive]);
  
  const handleArrival = React.useCallback(() => {
    setAmbulanceArrived(true);
    if (onArrival) onArrival();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("The ambulance has arrived at your location.");
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
    }
  }, [onArrival]);

  const handleProgress = React.useCallback((dist: number, time: number) => {
    setLiveDistanceKm(dist);
    setLiveTimeMins(time);
  }, []);

  return (
    <div className={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className={styles.locationHeader}>📍 Current Location</h3>
      </div>
      <p className={styles.addressText}>{location.address}</p>
      
      {!isActive && (
        <p style={{ fontSize: '12px', color: '#64748B', marginTop: '-8px', marginBottom: '16px' }}>
          If this location is wrong, drag the pin on the map to correct it.
        </p>
      )}
      
      {isActive && !ambulanceArrived && liveDistanceKm !== null && liveTimeMins !== null && (
        <div className={styles.etaContainer} style={{ justifyContent: 'space-between', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span role="img" aria-label="ambulance">🚑</span>
            <span className={styles.etaText}>
              EST. ARRIVAL: {Math.ceil(liveTimeMins)} mins
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669' }}>
            {liveDistanceKm.toFixed(2)} km away
          </div>
        </div>
      )}

      {isActive && ambulanceArrived && (
        <div className={styles.etaContainer} style={{ backgroundColor: '#DC2626', color: 'white', fontWeight: 'bold' }}>
          <span role="img" aria-label="siren">🚨</span>
          <span>AMBULANCE HAS ARRIVED</span>
        </div>
      )}

      {location.latitude && location.longitude && (
        <div className={styles.mapContainer}>
          <LiveMap 
            patientLat={location.latitude} 
            patientLng={location.longitude} 
            isActive={isActive}
            onLocationChange={isActive ? undefined : onLocationChange} // Disable dragging when active
            onArrival={handleArrival}
            onProgress={handleProgress}
          />
        </div>
      )}
    </div>
  );
};
