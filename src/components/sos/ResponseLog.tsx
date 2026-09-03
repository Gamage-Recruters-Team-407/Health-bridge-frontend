import React from 'react';
import { CheckCircle2, CircleDot, Circle } from 'lucide-react';


interface LogItem {
  id: string;
  title: string;
  time?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

const MOCK_LOGS: LogItem[] = [
  { id: '1', title: 'SOS Request Received', time: '14:02:11', status: 'COMPLETED' },
  { id: '2', title: 'Location Broadcasted', time: '14:02:15', status: 'COMPLETED' },
  { id: '3', title: 'Hospital Notified', time: '14:02:45', status: 'COMPLETED' },
  { id: '4', title: 'Unit Dispatched', time: '14:04:12', status: 'COMPLETED' },
  { id: '5', title: 'Unit Approaching', status: 'IN_PROGRESS' },
  { id: '6', title: 'On Scene Arrival', status: 'PENDING' },
];

interface ResponseLogProps {
  isActive?: boolean;
  hasArrived?: boolean;
}

const INITIAL_LOGS: LogItem[] = [
  { id: '1', title: 'SOS Request Received', status: 'PENDING' },
  { id: '2', title: 'Location Broadcasted', status: 'PENDING' },
  { id: '3', title: 'Hospital Notified', status: 'PENDING' },
  { id: '4', title: 'Unit Dispatched', status: 'PENDING' },
  { id: '5', title: 'Unit Approaching', status: 'PENDING' },
  { id: '6', title: 'On Scene Arrival', status: 'PENDING' },
];

export const ResponseLog: React.FC<ResponseLogProps> = ({ isActive = false, hasArrived = false }) => {
  const [logs, setLogs] = React.useState<LogItem[]>(INITIAL_LOGS);

  React.useEffect(() => {
    if (!isActive) {
      setLogs(INITIAL_LOGS);
      return;
    }

    const formatTime = () => {
      const now = new Date();
      return now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    // Sequence Simulation
    let step = 0;
    
    // Step 1 immediately
    setLogs(prev => prev.map((l, i) => i === 0 ? { ...l, status: 'COMPLETED', time: formatTime() } : i === 1 ? { ...l, status: 'IN_PROGRESS' } : l));
    
    const timers: NodeJS.Timeout[] = [];
    
    // Step 2
    timers.push(setTimeout(() => {
      setLogs(prev => prev.map((l, i) => i === 1 ? { ...l, status: 'COMPLETED', time: formatTime() } : i === 2 ? { ...l, status: 'IN_PROGRESS' } : l));
    }, 2000));

    // Step 3
    timers.push(setTimeout(() => {
      setLogs(prev => prev.map((l, i) => i === 2 ? { ...l, status: 'COMPLETED', time: formatTime() } : i === 3 ? { ...l, status: 'IN_PROGRESS' } : l));
    }, 4500));

    // Step 4 & 5
    timers.push(setTimeout(() => {
      setLogs(prev => prev.map((l, i) => i === 3 ? { ...l, status: 'COMPLETED', time: formatTime() } : i === 4 ? { ...l, status: 'IN_PROGRESS' } : l));
    }, 7000));

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [isActive]);

  React.useEffect(() => {
    if (hasArrived) {
      const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      };
      setLogs(prev => prev.map((l, i) => 
        i === 4 ? { ...l, status: 'COMPLETED', time: formatTime() } : 
        i === 5 ? { ...l, status: 'COMPLETED', time: formatTime() } : l
      ));
    }
  }, [hasArrived]);

  const activeIndex = logs.findIndex(l => l.status === 'IN_PROGRESS');
  const completedCount = logs.filter(l => l.status === 'COMPLETED').length;
  // Calculate line height percentage
  const lineProgress = logs[5].status === 'COMPLETED' ? 100 : (completedCount * 17);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: '#334155' }}>
        Response Log
      </h3>
      
      {!isActive ? (
        <div style={{ color: '#94A3B8', fontSize: '14px', fontStyle: 'italic', padding: '12px 0' }}>
          Standby for emergency activation...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
          {/* Background gray vertical line */}
          <div style={{ position: 'absolute', left: '9px', top: '12px', bottom: '24px', width: '2px', backgroundColor: '#F1F5F9', zIndex: 0 }} />
          
          {/* Foreground red vertical line */}
          <div style={{ 
            position: 'absolute', 
            left: '9px', 
            top: '12px', 
            height: `${lineProgress}%`, 
            width: '2px', 
            backgroundColor: '#DC2626',
            zIndex: 0,
            transition: 'height 0.5s ease-in-out'
          }} />

          {logs.map((log) => {
            const isCompleted = log.status === 'COMPLETED';
            const isInProgress = log.status === 'IN_PROGRESS';
            
            return (
              <div key={log.id} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                {/* Icon */}
                <div style={{ flexShrink: 0, width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                  {isCompleted && (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                  {isInProgress && (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#EF4444', boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#991B1B', borderRadius: '50%' }} />
                    </div>
                  )}
                  {!isCompleted && !isInProgress && (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#F1F5F9', border: '2px solid #E2E8F0' }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: isCompleted ? '#0F172A' : isInProgress ? '#DC2626' : '#94A3B8' }}>
                    {log.title}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: isInProgress || !isCompleted ? '#94A3B8' : '#64748B', marginTop: '2px', textTransform: isInProgress || !isCompleted ? 'uppercase' : 'none' }}>
                    {log.status === 'COMPLETED' ? log.time : log.status === 'IN_PROGRESS' ? 'IN PROGRESS' : 'PENDING'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
