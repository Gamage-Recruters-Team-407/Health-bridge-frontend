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
}

export const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.locationHeader}>📍 Current Location</h3>
      <p className={styles.addressText}>{location.address}</p>
      
      <div className={styles.etaContainer}>
        <span role="img" aria-label="ambulance">🚑</span>
        <span className={styles.etaText}>
          EST. ARRIVAL: {location.estimatedArrivalMins.min}-{location.estimatedArrivalMins.max} mins
        </span>
      </div>

      {location.latitude && location.longitude && (
        <div className={styles.mapContainer}>
          <LiveMap patientLat={location.latitude} patientLng={location.longitude} />
        </div>
      )}
    </div>
  );
};
