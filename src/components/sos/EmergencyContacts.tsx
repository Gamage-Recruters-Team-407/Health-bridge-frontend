import React from 'react';
import styles from './sos-components.module.css';
import { EmergencyContact } from '../../types/contact';
import { ContactItem } from './ContactItem';
import { Button } from '../common/Button';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onCall: (phoneNumber: string) => void;
  onAddContact: () => void;
  onDeleteContact?: (id: string) => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ 
  contacts, 
  onCall,
  onAddContact,
  onDeleteContact
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.contactsTitle}>
        <span role="img" aria-label="phone">📞</span> Emergency Contacts
      </h3>
      
      <div className={styles.contactList}>
        {contacts.map((contact) => (
          <ContactItem 
            key={contact.id} 
            contact={contact} 
            onCall={onCall} 
            onDelete={onDeleteContact}
          />
        ))}
      </div>
      
      <Button 
        variant="outline" 
        className={styles.addContactButton}
        onClick={onAddContact}
      >
        + Add Contact
      </Button>
    </div>
  );
};
