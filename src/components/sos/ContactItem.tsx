import React from 'react';
import styles from './sos-components.module.css';
import { EmergencyContact } from '../../types/contact';
import { Button } from '../common/Button';

interface ContactItemProps {
  contact: EmergencyContact;
  onCall: (phoneNumber: string) => void;
  onDelete?: (id: string) => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({ contact, onCall, onDelete }) => {
  return (
    <div className={styles.contactItem}>
      <div className={styles.contactInfo}>
        <h4 className={styles.contactName}>{contact.name}</h4>
        <span className={styles.contactRelation}>
          {contact.relationship} • {contact.phone || contact.phoneNumber || 'No phone added'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button 
          variant="outline" 
          onClick={() => onCall(contact.phone || contact.phoneNumber || '')}
          disabled={!contact.phone && !contact.phoneNumber}
          icon={<span role="img" aria-label="call">📞</span>}
        >
          Call
        </Button>
        {onDelete && (
          <button 
            onClick={() => onDelete(contact.id)}
            title="Delete Contact"
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '16px', 
              opacity: 0.6, 
              padding: '8px'
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '1'}
            onMouseOut={e => e.currentTarget.style.opacity = '0.6'}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};
