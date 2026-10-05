import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: '#0B1220',
        color: '#FFFFFF',
        padding: '12px 18px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(11, 18, 32, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 200,
        fontSize: '13.5px',
        fontWeight: 500,
        border: '1px solid #1C2B47',
        animation: 'slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <CheckCircle2 size={18} color="#16A36A" />
      <span>{toastMessage}</span>
    </div>
  );
};
