"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './sos-components.module.css';
import { SOSButtonAnimation } from './SOSButtonAnimation';

interface SOSButtonProps {
  onTrigger: () => void;
  onCancel?: () => void;
  holdDuration?: number; // in milliseconds
  isActive?: boolean;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ 
  onTrigger, 
  onCancel,
  holdDuration = 3000,
  isActive = false
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTriggered, setIsTriggered] = useState(isActive);

  useEffect(() => {
    setIsTriggered(isActive);
    if (!isActive) {
      setProgress(0);
    }
  }, [isActive]);
  
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
        onContextMenu={(e) => e.preventDefault()}
        style={{ touchAction: 'none' }}
      >
        <SOSButtonAnimation progress={progress} />
        <button 
          className={`${styles.sosButton} ${isHolding ? styles.holding : ''} ${isTriggered ? styles.triggered : ''}`}
          aria-label="Emergency SOS"
        >
          <div className={styles.sosTitle}>🚨 SOS</div>
          <div className={styles.sosSubtitle}>
            {isTriggered ? 'ACTIVE' : 'Hold for 3 seconds'}
          </div>
        </button>
      </div>
      {!isTriggered ? (
        <p className={styles.sosHelperText}>
          Press and hold to prevent accidental emergency requests.
        </p>
      ) : (
        <button
          onClick={() => {
            setIsTriggered(false);
            setProgress(0);
            if (onCancel) onCancel();
          }}
          style={{
            marginTop: '24px',
            padding: '12px 32px',
            backgroundColor: '#F1F5F9',
            color: '#DC2626',
            border: '2px solid #DC2626',
            borderRadius: '999px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Cancel Emergency
        </button>
      )}
    </div>
  );
};
