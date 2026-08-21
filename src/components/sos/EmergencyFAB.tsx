"use client";

import React, { useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';

export const EmergencyFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCall = () => {
    window.location.href = 'tel:1990';
  };

  const handleChat = () => {
    alert('Opening emergency chat with dispatcher...');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '16px',
      zIndex: 50
    }}>
      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={handleChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              padding: '12px 20px',
              borderRadius: '999px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ whiteSpace: 'nowrap' }}>Chat with Dispatcher</span>
            <div style={{ backgroundColor: '#DBEAFE', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={18} color="#2563EB" />
            </div>
          </button>

          <button 
            onClick={handleCall}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              padding: '12px 20px',
              borderRadius: '999px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ whiteSpace: 'nowrap' }}>Call Ambulance (1990)</span>
            <div style={{ backgroundColor: '#FEE2E2', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={18} color="#DC2626" />
            </div>
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: isOpen ? '#475569' : '#DC2626',
          color: 'white',
          border: 'none',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {isOpen ? <X size={28} /> : <Phone size={28} />}
      </button>
    </div>
  );
};
