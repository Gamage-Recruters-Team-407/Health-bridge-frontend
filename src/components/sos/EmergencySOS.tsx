"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SOSButton } from './SOSButton';
import { PatientInfoCard } from './PatientInfoCard';
import { EmergencyTypeSelector } from './EmergencyTypeSelector';
import { LocationCard } from './LocationCard';
import { EmergencyContacts } from './EmergencyContacts';
import { ConfirmationDialog } from './ConfirmationDialog';
import { EmergencyType, PatientInfo, LocationInfo } from '../../types/emergency';
import { EmergencyContact } from '../../types/contact';

// Mock data for the UI
const mockPatient: PatientInfo = {
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

const mockContacts: EmergencyContact[] = [
  { id: '1', name: 'John Johnson', relationship: 'Husband', phoneNumber: '+1234567890' },
  { id: '2', name: 'Emily Johnson', relationship: 'Sister', phoneNumber: '+0987654321' },
];

export const EmergencySOS: React.FC = () => {
  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [location, setLocation] = useState<LocationInfo>(initialLocation);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // 1. Setup Location
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            const address = data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
            setLocation({ address, latitude: lat, longitude: lon, estimatedArrivalMins: { min: 8, max: 12 } });
          } catch (error) {
            setLocation({ address: `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`, latitude: lat, longitude: lon, estimatedArrivalMins: { min: 8, max: 12 } });
          }
        },
        (error) => setLocation({ address: '123 Main Street, Colombo 07 (Fallback)', estimatedArrivalMins: { min: 8, max: 12 } })
      );
    }

    // 2. Setup Voice Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-LK'; // Sri Lankan English

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => {
          // Auto-restart listening if it stops unexpectedly
          if (!isDialogOpen) recognition.start();
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript.toLowerCase();
          }
          
          if (
            currentTranscript.includes('help me health bridge') || 
            currentTranscript.includes('health bridge emergency') ||
            currentTranscript.includes('call 1990') ||
            currentTranscript.includes('call 1 9 9 0')
          ) {
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
    };
  }, [isDialogOpen]);

  const handleSOSTrigger = () => {
    setIsDialogOpen(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleAddContact = () => {
    alert('Add contact flow would open here');
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '13px', color: isListening ? '#16A34A' : '#64748B' }}>
        {isListening ? '🎤 Voice Activation Active (Say "Help me Health Bridge")' : '🎤 Voice Activation Unavailable'}
      </div>

      <SOSButton onTrigger={handleSOSTrigger} holdDuration={3000} />
      <PatientInfoCard patient={mockPatient} />
      <EmergencyTypeSelector selectedType={selectedType} onSelect={setSelectedType} />
      <LocationCard location={location} />
      <EmergencyContacts contacts={mockContacts} onCall={handleCall} onAddContact={handleAddContact} />
      
      <ConfirmationDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        patient={mockPatient}
        location={location}
      />
    </div>
  );
};
