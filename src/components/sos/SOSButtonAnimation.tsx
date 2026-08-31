import React from 'react';
import styles from './sos-components.module.css';

interface SOSButtonAnimationProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
}

export const SOSButtonAnimation: React.FC<SOSButtonAnimationProps> = ({ 
  progress, 
  size = 160, 
  strokeWidth = 6 
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className={styles.progressRingContainer}>
      <svg width={size} height={size}>
        {/* Background Track */}
        <circle
          stroke="#FEE2E2"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
        />
        {/* Progress Ring */}
        <circle
          className={styles.progressRingCircle}
          stroke="#EF4444"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={radius}
          cx={center}
          cy={center}
        />
      </svg>
    </div>
  );
};
