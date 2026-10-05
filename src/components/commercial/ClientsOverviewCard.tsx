import React from 'react';
import {
  Users,
  ArrowRight,
  UserCheck,
  UserPlus,
  UserX
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ClientsOverviewCardProps {
  onViewClients?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ClientsOverviewCard: React.FC<ClientsOverviewCardProps> = ({
  onViewClients,
  className = '',
  style = {}
}) => {
  const { setCurrentNav } = useApp();

  const handleNavigate = () => {
    if (onViewClients) {
      onViewClients();
    } else {
      setCurrentNav('customers');
    }
  };

  return (
    <div
      className={`clients-overview-card ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(8, 22, 50, 0.95) 0%, rgba(5, 14, 32, 0.98) 100%)',
        borderRadius: '18px',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        padding: '24px 26px',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        ...style
      }}
    >
      {/* Subheading Header: CLIENTS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Users size={14} color="#38BDF8" />
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#FFFFFF',
            textTransform: 'uppercase'
          }}
        >
          CLIENTS
        </span>
      </div>

      {/* Hero Metric: 248 Total Clients */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            fontSize: '34px',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            fontFamily: "var(--font-display), 'Manrope', -apple-system, sans-serif"
          }}
        >
          248
        </div>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#FFFFFF',
            marginTop: '3px'
          }}
        >
          Total Clients
        </div>
      </div>

      {/* Row: 186 Active      +24 New */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '18px' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '9px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            fontSize: '13px',
            fontWeight: 700,
            color: '#FFFFFF'
          }}
        >
          <UserCheck size={14} color="#34D399" />
          <span>186 Active</span>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '9px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            fontSize: '13px',
            fontWeight: 700,
            color: '#FFFFFF'
          }}
        >
          <UserPlus size={14} color="#38BDF8" />
          <span>+24 New</span>
        </div>
      </div>

      {/* 82% Active Clients Rate & Progress Bar */}
      <div style={{ marginBottom: '18px' }}>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 900,
            color: '#34D399',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
            fontFamily: "var(--font-display), 'Manrope', -apple-system, sans-serif"
          }}
        >
          82%
        </div>
        <div style={{ fontSize: '12.5px', color: '#FFFFFF', fontWeight: 600, marginTop: '2px', marginBottom: '8px' }}>
          Active Clients Rate
        </div>

        {/* Progress Bar: 82% */}
        <div
          style={{
            width: '100%',
            height: '11px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div
            style={{
              width: '82%',
              height: '100%',
              background: 'linear-gradient(90deg, #10B981 0%, #34D399 75%, #6EE7B7 100%)',
              borderRadius: '9999px',
              boxShadow: '0 0 10px rgba(52, 211, 153, 0.4)'
            }}
          />
        </div>
      </div>

      {/* 38 Inactive */}
      <div style={{ marginBottom: '18px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            fontSize: '12.5px',
            fontWeight: 600,
            color: '#FFFFFF'
          }}
        >
          <UserX size={13} color="#FFFFFF" />
          <span>38 Inactive</span>
        </div>
      </div>

      {/* Footer Link: View CLIENTS → */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '14px', marginTop: 'auto' }}>
        <button
          type="button"
          onClick={handleNavigate}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '2px 0',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#38BDF8';
            e.currentTarget.style.transform = 'translateX(2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <span>View CLIENTS</span>
          <ArrowRight size={14} color="#38BDF8" />
        </button>
      </div>
    </div>
  );
};
