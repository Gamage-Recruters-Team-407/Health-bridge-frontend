import React from 'react';
import styles from './sos-components.module.css';
import { EmergencyType } from '../../types/emergency';

interface EmergencyTypeButtonProps {
  type: EmergencyType;
  icon: string;
  colorClass: 'red' | 'blue' | 'gray';
  isSelected: boolean;
  onClick: () => void;
}

export const EmergencyTypeButton: React.FC<EmergencyTypeButtonProps> = ({
  type,
  icon,
  colorClass,
  isSelected,
  onClick
}) => {
  return (
    <button
      className={`${styles.typeButton} ${isSelected ? `${styles.active} ${styles[colorClass]}` : ''}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <span>{icon}</span>
      <span>{type}</span>
    </button>
  );
};
