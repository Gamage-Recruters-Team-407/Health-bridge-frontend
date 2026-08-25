import React from 'react';
import styles from './sos-components.module.css';
import { PatientInfo } from '../../types/emergency';
import { StatusBadge } from '../common/StatusBadge';

interface PatientInfoCardProps {
  patient: PatientInfo;
}

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patient }) => {
  return (
    <div className={styles.card}>
      <div className={styles.patientHeader}>
        <h3 className={styles.patientName}>👤 {patient.name}</h3>
        <span className={styles.patientId}>ID: {patient.id}</span>
      </div>
      
      <div className={styles.patientDetails}>
        <div className={styles.detailLabel}>
          <span>🩸 Blood Type:</span>
          <StatusBadge label={patient.bloodType} color="green" />
        </div>
        
        <div className={styles.detailSeparator}></div>
        
        <div className={styles.detailLabel}>
          <span>⚠️ Allergies:</span>
          <StatusBadge label={patient.allergies.join(', ')} color="orange" />
        </div>
        
        <div className={styles.detailSeparator}></div>
        
        <div className={styles.detailLabel}>
          <span>🩺 Conditions:</span>
          <span className={styles.conditionsText}>{patient.conditions.join(', ')}</span>
        </div>
      </div>
    </div>
  );
};
