import React from 'react';
import styles from './sos-components.module.css';
import { EmergencyContact } from '../../types/contact';
import { Button } from '../common/Button';

interface ContactItemProps {
  contact: EmergencyContact;
  onCall: (phoneNumber: string) => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({ contact, onCall }) => {
  return (
    <div className={styles.contactItem}>
      <div className={styles.contactInfo}>
        <h4 className={styles.contactName}>{contact.name}</h4>
        <span className={styles.contactRelation}>{contact.relationship}</span>
      </div>
      <Button 
        variant="outline" 
        onClick={() => onCall(contact.phoneNumber)}
        icon={<span role="img" aria-label="call">📞</span>}
      >
        Call
      </Button>
    </div>
  );
};
