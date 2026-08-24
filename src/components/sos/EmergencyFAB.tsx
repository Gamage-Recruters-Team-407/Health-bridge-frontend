"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'dispatcher';
  text: string;
  time: string;
}

export const EmergencyFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'dispatcher', text: 'HealthBridge Emergency Dispatch. How can we assist you while the ambulance is en route?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setMessage('');

    // Simulate dispatcher response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'dispatcher',
        text: 'Message received. The ambulance driver has been notified.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
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
        <div style={{ 
          width: '350px', 
          height: '450px', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #E2E8F0'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#0F172A', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#22C55E', borderRadius: '50%' }} />
              <span style={{ fontWeight: 600, fontSize: '15px' }}>Live Dispatcher Chat</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ 
            flex: 1, 
            padding: '16px', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#F8FAFC'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}>
                <div style={{ 
                  backgroundColor: msg.sender === 'user' ? '#2563EB' : '#FFFFFF',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  borderBottomRightRadius: msg.sender === 'user' ? '4px' : '12px',
                  borderBottomLeftRadius: msg.sender === 'dispatcher' ? '4px' : '12px',
                  border: msg.sender === 'dispatcher' ? '1px solid #E2E8F0' : 'none',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#94A3B8', 
                  marginTop: '4px',
                  textAlign: msg.sender === 'user' ? 'right' : 'left'
                }}>
                  {msg.time}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} style={{ 
            padding: '16px', 
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            gap: '12px',
            backgroundColor: '#FFFFFF'
          }}>
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '999px',
                border: '1px solid #CBD5E1',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              style={{
                backgroundColor: message.trim() ? '#2563EB' : '#94A3B8',
                color: 'white',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: message.trim() ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s'
              }}
            >
              <Send size={18} style={{ marginLeft: '2px' }} />
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#2563EB',
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
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};
