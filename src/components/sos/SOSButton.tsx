"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './sos-components.module.css';
import { SOSButtonAnimation } from './SOSButtonAnimation';

interface SOSButtonProps {
  onTrigger: () => void;
  holdDuration?: number; // in milliseconds
}

export const SOSButton: React.FC<SOSButtonProps> = ({ 
  onTrigger, 
  holdDuration = 3000 
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTriggered, setIsTriggered] = useState(false);
  
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimers = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const vibrate = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent default to avoid selection issues
    e.preventDefault();
    if (isTriggered) return;

    vibrate(50); // Short haptic feedback on press
    setIsHolding(true);
    startTimeRef.current = Date.now();
    
    // Start progress animation
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / holdDuration, 1);
      setProgress(newProgress);
    }, 16); // ~60fps

    // Set trigger timer
    holdTimerRef.current = setTimeout(() => {
      clearTimers();
      setIsHolding(false);
      setProgress(1);
      setIsTriggered(true);
      vibrate([100, 50, 100, 50, 200]); // Distinct success pattern
      onTrigger();
      
      // Reset after some time if needed (optional based on UX)
      // setTimeout(() => {
      //   setIsTriggered(false);
      //   setProgress(0);
      // }, 3000);
      
    }, holdDuration);
  };

  const handlePointerUpOrLeave = () => {
    if (isTriggered) return;
    
    clearTimers();
    setIsHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <div className={styles.sosContainer}>
      <div 
        className={styles.sosButtonWrapper}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long press
        style={{ touchAction: 'none' }} // Prevent scrolling while holding
      >
        <SOSButtonAnimation progress={progress} />
        <button 
          className={`${styles.sosButton} ${isHolding ? styles.holding : ''} ${isTriggered ? styles.triggered : ''}`}
          aria-label="Emergency SOS"
        >
          <div className={styles.sosTitle}>🚨 SOS</div>
          <div className={styles.sosSubtitle}>
            {isTriggered ? 'SENT' : 'Hold for 3 seconds'}
          </div>
        </button>
      </div>
      <p className={styles.sosHelperText}>
        Press and hold to prevent accidental emergency requests.
      </p>
    </div>
  );
};
