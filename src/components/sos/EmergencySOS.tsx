"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SOSButton } from './SOSButton';
import { PatientInfoCard } from './PatientInfoCard';
import { EmergencyTypeSelector } from './EmergencyTypeSelector';
import { LocationCard } from './LocationCard';
import { EmergencyContacts } from './EmergencyContacts';
import { AddContactDialog } from './AddContactDialog';
import { ResponseLog } from './ResponseLog';
import { EmergencyFAB } from './EmergencyFAB';
import { ActiveEmergencyBanner } from './ActiveEmergencyBanner';
import { VoiceWave } from './VoiceWave';
import { EmergencyType, PatientInfo, LocationInfo } from '../../types/emergency';
import { EmergencyContact } from '../../types/contact';
import { getStoredUser } from '@/lib/auth';

// Mock data for the UI
const defaultPatient: PatientInfo = {
  name: 'Sarah Johnson',
  id: 'PT-2026-00458',
  bloodType: 'O+',
  allergies: ['Penicillin'],
  conditions: ['Type 1 Diabetes', 'Hypertension'],
};

const initialLocation: LocationInfo = {
  address: 'Locating...',
  estimatedArrivalMins: { min: 8, max: 12 },
};

const initialContacts: EmergencyContact[] = [
  { id: '1', name: 'John Johnson', relationship: 'Husband', phoneNumber: '+1234567890' },
  { id: '2', name: 'Emily Johnson', relationship: 'Sister', phoneNumber: '+0987654321' },
];

export const EmergencySOS: React.FC = () => {
  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [location, setLocation] = useState<LocationInfo>(initialLocation);
  const [isLocationManuallySet, setIsLocationManuallySet] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [patient, setPatient] = useState<PatientInfo>(defaultPatient);
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts);
  
  const [hasArrived, setHasArrived] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  // We use a ref for manual set to avoid adding it to the useEffect dependency array 
  // which would cause watchPosition to restart constantly.
  const isManuallySetRef = useRef(false);
  useEffect(() => {
    isManuallySetRef.current = isLocationManuallySet;
  }, [isLocationManuallySet]);

  useEffect(() => {
    // Reset hasArrived when emergency toggles
    if (!isEmergencyActive) setHasArrived(false);
  }, [isEmergencyActive]);

  useEffect(() => {
    // 0. Setup User
    const user = getStoredUser();
    if (user) {
      setPatient(prev => ({
        ...prev,
        name: user.fullName || prev.name,
        id: user.id || prev.id
      }));

      // Fetch live user profile
      const fetchProfile = async () => {
        try {
          // Assuming an axios instance or fetch to /api/users/profile
          const res = await fetch('http://localhost:8088/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('healthbridge_token')}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setPatient(prev => ({
              ...prev,
              bloodType: data.bloodGroup || prev.bloodType,
              allergies: data.allergies?.length > 0 ? data.allergies : prev.allergies,
              conditions: data.conditions?.length > 0 ? data.conditions : prev.conditions
            }));
          }
        } catch (e) {
          console.error("Failed to fetch user profile", e);
        }
      };
      fetchProfile();
    }

    // 1. Setup Location
    let watchId: number;
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          if (isManuallySetRef.current) return; // Don't override user's manual pin drag
          
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            const address = data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
            if (!isManuallySetRef.current) setLocation(prev => ({ ...prev, address, latitude: lat, longitude: lon }));
          } catch (error) {
            if (!isManuallySetRef.current) setLocation(prev => ({ ...prev, address: `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`, latitude: lat, longitude: lon }));
          }
        },
        (error) => {
          // Keep current fallback or previous location if error
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }

    // 2. Setup Voice Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US'; // Use standard English model for better accuracy

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => {
          // Auto-restart listening if it stops unexpectedly
          if (!isEmergencyActive) recognition.start();
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          
          // Show what is being heard on screen
          const lastWords = currentTranscript.split(' ').slice(-15).join(' '); // Keep only last few words for UI
          const displayEl = document.getElementById('voice-transcript-display');
          if (displayEl) {
            displayEl.innerText = `Heard: "${lastWords.trim()}..."`;
          }
          
          const cleanedTranscript = currentTranscript.replace(/[^\w\s\d]/gi, '').toLowerCase();
          
          if (cleanedTranscript.includes('emergency help')) {
            handleSOSTrigger();
            recognition.stop(); // Stop listening once triggered
          }
        };

        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {
          console.error("Speech recognition error:", e);
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
      if (watchId && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isEmergencyActive]);

  const handleSOSTrigger = () => {
    setIsEmergencyActive(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    // Audio confirmation
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const msg = new SpeechSynthesisUtterance("Emergency request activated. Priority 1 dispatch initiated. Please stay calm.");
      msg.rate = 0.9; // Slightly slower for clarity
      msg.pitch = 1.1;
      msg.volume = 1.0;
      window.speechSynthesis.speak(msg);
    }
  };

  const handleSOSCancel = () => {
    setIsEmergencyActive(false);
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("Emergency request cancelled.");
      window.speechSynthesis.speak(msg);
    }
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleAddContact = () => {
    setIsAddContactOpen(true);
  };

  return (
    <div>
      {isEmergencyActive && <ActiveEmergencyBanner initialMinutes={5} />}
      
      {!isEmergencyActive && (
        <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '13px', color: isListening ? '#16A34A' : '#64748B' }}>
          {isListening ? '🎤 Voice Activation Active (Say "Emergency Help")' : '🎤 Voice Activation Unavailable'}
          <div id="voice-transcript-display" style={{ marginTop: '4px', fontStyle: 'italic', color: '#94A3B8', minHeight: '20px' }}></div>
          {isListening && <VoiceWave />}
        </div>
      )}

      <SOSButton 
        onTrigger={handleSOSTrigger} 
        onCancel={handleSOSCancel} 
        holdDuration={3000} 
        isActive={isEmergencyActive} 
      />
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
        marginTop: '32px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <PatientInfoCard patient={patient} />
          <EmergencyTypeSelector selectedType={selectedType} onSelect={setSelectedType} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ResponseLog isActive={isEmergencyActive} hasArrived={hasArrived} />
          <LocationCard 
            location={location}
            isActive={isEmergencyActive} 
            onArrival={() => setHasArrived(true)}
            onLocationChange={async (lat, lng) => {
              setIsLocationManuallySet(true);
              setLocation(prev => ({ ...prev, latitude: lat, longitude: lng }));
              
              // Reverse geocode the new pin location
              try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const data = await res.json();
                const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                setLocation(prev => ({ ...prev, address }));
              } catch (e) {
                // Ignore error, keep old address if it fails
              }
            }}
          />
          <EmergencyContacts contacts={contacts} onCall={handleCall} onAddContact={handleAddContact} />
        </div>
      </div>
      
      <AddContactDialog 
        isOpen={isAddContactOpen} 
        onClose={() => setIsAddContactOpen(false)} 
        onAdd={(newContact) => setContacts([...contacts, newContact])} 
      />

      <EmergencyFAB />
    </div>
  );
};
