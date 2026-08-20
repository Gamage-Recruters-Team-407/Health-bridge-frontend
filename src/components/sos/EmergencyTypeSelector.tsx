import React from 'react';
import styles from './sos-components.module.css';
import { EmergencyType } from '../../types/emergency';
import { EmergencyTypeButton } from './EmergencyTypeButton';

interface EmergencyTypeSelectorProps {
  selectedType: EmergencyType | null;
  onSelect: (type: EmergencyType) => void;
}

const EMERGENCY_TYPES: Array<{ type: EmergencyType; icon: string; colorClass: 'red' | 'blue' | 'gray' }> = [
  { type: 'Chest Pain', icon: '❤️', colorClass: 'red' },
  { type: 'Breathing Issue', icon: '🌬️', colorClass: 'blue' },
  { type: 'Severe Injury', icon: '🩸', colorClass: 'red' },
  { type: 'Other', icon: '📌', colorClass: 'gray' },
];

export const EmergencyTypeSelector: React.FC<EmergencyTypeSelectorProps> = ({
  selectedType,
  onSelect
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.typeSelectorTitle}>Specific Emergency Type</h3>
      <div className={styles.typeGrid}>
        {EMERGENCY_TYPES.map((item) => (
          <EmergencyTypeButton
            key={item.type}
            type={item.type}
            icon={item.icon}
            colorClass={item.colorClass}
            isSelected={selectedType === item.type}
            onClick={() => onSelect(item.type)}
          />
        ))}
      </div>
    </div>
  );
};
