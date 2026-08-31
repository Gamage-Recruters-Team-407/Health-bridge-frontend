"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SOSButton } from './SOSButton';
import { PatientInfoCard } from './PatientInfoCard';
import { EmergencyTypeSelector } from './EmergencyTypeSelector';
import { LocationCard } from './LocationCard';
import { EmergencyContacts } from './EmergencyContacts';
import { AddContactDialog } from './AddContactDialog';
import { ResponseLog } from './ResponseLog';
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

export const EmergencySOS: React.FC = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [hasArrived, setHasArrived] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [location, setLocation] = useState<LocationInfo>(initialLocation);
  const [isLocationManuallySet, setIsLocationManuallySet] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [patient, setPatient] = useState<PatientInfo>(defaultPatient);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const isManuallySetRef = useRef(false);
  
  useEffect(() => {
    isManuallySetRef.current = isLocationManuallySet;
  }, [isLocationManuallySet]);

  useEffect(() => {
    if (!isEmergencyActive) setHasArrived(false);
  }, [isEmergencyActive]);

  const [alertHistory, setAlertHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const user = getStoredUser();
      const userId = user?.id || 'user-123';
      const token = typeof window !== 'undefined' ? localStorage.getItem('healthbridge_token') : null;
      const res = await fetch(`http://localhost:8088/api/sos/history?userId=${userId}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAlertHistory(data.alerts || []);
      }
    } catch (e) {
      console.error("Failed to fetch SOS history:", e);
    }
  };

  const fetchContacts = async () => {
    try {
      const user = getStoredUser();
      const userId = user?.id || 'user-123';
      const token = typeof window !== 'undefined' ? localStorage.getItem('healthbridge_token') : null;
      const res = await fetch(`http://localhost:8088/api/contacts?userId=${userId}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
      }
    } catch (e) {
      console.error("Failed to fetch contacts:", e);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchContacts();

    // 0. Setup User
    const user = getStoredUser();
    if (user) {
      setPatient(prev => ({
        ...prev,
        name: user.fullName || prev.name,
        id: user.id || prev.id
      }));

      const fetchProfile = async () => {
        try {
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
          if (isManuallySetRef.current) return;
          
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
        (error) => {},
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
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => {
          if (!isEmergencyActive) recognition.start();
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          
          const lastWords = currentTranscript.split(' ').slice(-15).join(' ');
          const displayEl = document.getElementById('voice-transcript-display');
          if (displayEl) {
            displayEl.innerText = `Heard: "${lastWords.trim()}..."`;
          }
          
          const cleanedTranscript = currentTranscript.replace(/[^\w\s\d]/gi, '').toLowerCase();
          
          if (cleanedTranscript.includes('emergency help')) {
            handleSOSTrigger();
            recognition.stop();
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

  const [alertId, setAlertId] = useState<string | null>(null);

  const handleSOSTrigger = async () => {
    setIsEmergencyActive(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("Emergency request activated. Priority 1 dispatch initiated. Please stay calm.");
      msg.rate = 0.9;
      msg.pitch = 1.1;
      msg.volume = 1.0;
      window.speechSynthesis.speak(msg);
    }

    try {
      const user = getStoredUser();
      const userId = user?.id || 'user-123';
      const token = typeof window !== 'undefined' ? localStorage.getItem('healthbridge_token') : null;
      const res = await fetch('http://localhost:8088/api/sos/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          emergencyType: 'General Emergency',
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAlertId(data.alertId);
        console.log("SOS Triggered successfully on backend:", data.alertId);
        fetchHistory();
      }
    } catch (e) {
      console.error("Failed to trigger SOS on backend:", e);
    }
  };

  const handleSOSCancel = async () => {
    setIsEmergencyActive(false);
    setHasArrived(false);
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("Emergency request cancelled.");
      window.speechSynthesis.speak(msg);
    }

    if (alertId) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('healthbridge_token') : null;
        await fetch(`http://localhost:8088/api/sos/${alertId}/cancel`, {
          method: 'PUT',
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        console.log("SOS Cancelled successfully on backend");
        setAlertId(null);
        fetchHistory();
      } catch (e) {
        console.error("Failed to cancel SOS on backend:", e);
      }
    }
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleAddContact = () => {
    setIsAddContactOpen(true);
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm('Are you sure you want to remove this emergency contact?')) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('healthbridge_token') : null;
        const res = await fetch(`http://localhost:8088/api/contacts/${id}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          fetchContacts();
        }
      } catch (e) {
        console.error("Failed to delete contact:", e);
      }
    }
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
          <EmergencyContacts 
            contacts={contacts} 
            onCall={handleCall} 
            onAddContact={handleAddContact} 
            onDeleteContact={handleDeleteContact}
          />
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
              
              try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const data = await res.json();
                const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                setLocation(prev => ({ ...prev, address }));
              } catch (e) {}
            }}
          />
        </div>
      </div>
      
      {/* SOS History Section */}
      <div style={{ marginTop: '32px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A', marginBottom: '16px' }}>Past Emergencies</h3>
        {alertHistory.length === 0 ? (
          <p style={{ color: '#64748B', fontSize: '14px' }}>No emergency history found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alertHistory.map((alert, i) => (
              <div key={alert.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{alert.emergencyType || 'General Emergency'}</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    {new Date(alert.triggeredAt).toLocaleString()}
                  </div>
                </div>
                <div style={{ 
                  padding: '4px 10px', 
                  borderRadius: '999px', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  backgroundColor: alert.status === 'ACTIVE' ? '#FEE2E2' : '#F1F5F9',
                  color: alert.status === 'ACTIVE' ? '#DC2626' : '#64748B'
                }}>
                  {alert.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddContactDialog 
        isOpen={isAddContactOpen} 
        onClose={() => setIsAddContactOpen(false)} 
        onAdd={async (newContact) => {
          try {
            const user = getStoredUser();
            const userId = user?.id || 'user-123';
            const token = typeof window !== 'undefined' ? localStorage.getItem('healthbridge_token') : null;
            const res = await fetch(`http://localhost:8088/api/contacts?userId=${userId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify(newContact)
            });
            if (res.ok) fetchContacts();
          } catch(e) { console.error("Failed to add contact", e); }
        }} 
      />

    </div>
  );
};
