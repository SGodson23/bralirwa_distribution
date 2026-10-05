import React, { useState } from 'react';
import {
  ChevronDown,
  Truck
} from 'lucide-react';

interface PurchasesReceivingCardProps {
  onOpenReceivingTerminal?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const PurchasesReceivingCard: React.FC<PurchasesReceivingCardProps> = ({
  onOpenReceivingTerminal,
  className = '',
  style = {}
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'This Month' | 'Last Month' | 'This Quarter' | 'Year to Date'>('This Month');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Period-based stats configurations
  const periodData = {
    'This Month': {
      totalPurchased: 'RWF 18.4M',
      receivedAmount: 'RWF 17.8M',
      pendingAmount: 'RWF 600K',
      receivedPercent: '96.7%',
      progressPercent: 96.7,
      totalOrders: 12,
      completeOrders: 10,
      pendingOrders: 2
    },
    'Last Month': {
      totalPurchased: 'RWF 42.1M',
      receivedAmount: 'RWF 42.1M',
      pendingAmount: 'RWF 0',
      receivedPercent: '100%',
      progressPercent: 100,
      totalOrders: 24,
      completeOrders: 24,
      pendingOrders: 0
    },
    'This Quarter': {
      totalPurchased: 'RWF 60.5M',
      receivedAmount: 'RWF 59.9M',
      pendingAmount: 'RWF 600K',
      receivedPercent: '99.0%',
      progressPercent: 99.0,
      totalOrders: 36,
      completeOrders: 34,
      pendingOrders: 2
    },
    'Year to Date': {
      totalPurchased: 'RWF 198.2M',
      receivedAmount: 'RWF 197.6M',
      pendingAmount: 'RWF 600K',
      receivedPercent: '99.7%',
      progressPercent: 99.7,
      totalOrders: 118,
      completeOrders: 116,
      pendingOrders: 2
    }
  };

  const current = periodData[selectedPeriod];

  return (
    <div
      className={`purchases-receiving-card ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(8, 22, 50, 0.95) 0%, rgba(5, 14, 32, 0.98) 100%)',
        borderRadius: '18px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        padding: '24px 26px',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        ...style
      }}
    >
      {/* Header: Label, Title & Period Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.09em',
              color: '#38BDF8',
              textTransform: 'uppercase',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Truck size={12} color="#38BDF8" />
            <span>PURCHASES &amp; RECEIVING</span>
          </div>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0,
              fontFamily: 'var(--font-display, sans-serif)',
              letterSpacing: '-0.01em'
            }}
          >
            BRALIRWA Supply Overview
          </h3>
        </div>

        {/* Period Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#F1F5F9',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
          >
            <span>{selectedPeriod}</span>
            <ChevronDown
              size={14}
              color="#94A3B8"
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                backgroundColor: '#0A1835',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '10px',
                padding: '5px',
                minWidth: '140px',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.65)',
                zIndex: 60,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              {(['This Month', 'Last Month', 'This Quarter', 'Year to Date'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(period);
                    setDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '7px 10px',
                    fontSize: '12px',
                    fontWeight: selectedPeriod === period ? 700 : 500,
                    backgroundColor: selectedPeriod === period ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
                    color: selectedPeriod === period ? '#38BDF8' : '#CBD5E1',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPeriod !== period) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPeriod !== period) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Total Purchased Hero Metric */}
      <div style={{ marginTop: '22px', marginBottom: '18px' }}>
        <div
          style={{
            fontSize: '34px',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            fontFamily: 'var(--font-display, sans-serif)'
          }}
        >
          {current.totalPurchased}
        </div>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#FFFFFF',
            marginTop: '4px'
          }}
        >
          Total Purchased
        </div>
      </div>

      {/* 3-Column Metrics Grid: Received | Pending | Received % */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '14px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.035)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '12px',
          marginBottom: '18px'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#34D399',
              letterSpacing: '-0.01em',
              lineHeight: 1.2
            }}
          >
            {current.receivedAmount}
          </div>
          <div style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 600, marginTop: '3px' }}>
            Received
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: current.pendingAmount === 'RWF 0' ? '#FFFFFF' : '#FBBF24',
              letterSpacing: '-0.01em',
              lineHeight: 1.2
            }}
          >
            {current.pendingAmount}
          </div>
          <div style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 600, marginTop: '3px' }}>
            Pending
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#38BDF8',
              letterSpacing: '-0.01em',
              lineHeight: 1.2
            }}
          >
            {current.receivedPercent}
          </div>
          <div style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 600, marginTop: '3px' }}>
            Received
          </div>
        </div>
      </div>

      {/* Progress Bar & Receiving Progress Label */}
      <div style={{ marginBottom: '18px' }}>
        <div
          style={{
            width: '100%',
            height: '11px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: `${current.progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10B981 0%, #34D399 70%, #6EE7B7 100%)',
              borderRadius: '9999px',
              boxShadow: '0 0 10px rgba(52, 211, 153, 0.4)',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '7px'
          }}
        >
          <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 600 }}>
            Receiving Progress
          </span>
          <span style={{ fontSize: '12px', color: '#34D399', fontWeight: 700 }}>
            {current.progressPercent}%
          </span>
        </div>
      </div>

      {/* Orders Breakdown Row: 12 Orders | 10 Complete | 2 Pending */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px'
        }}
      >
        <div
          style={{
            padding: '9px 8px',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '9px',
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#FFFFFF'
          }}
        >
          {current.totalOrders} Orders
        </div>

        <div
          style={{
            padding: '9px 8px',
            textAlign: 'center',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '9px',
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#34D399'
          }}
        >
          {current.completeOrders} Complete
        </div>

        <div
          style={{
            padding: '9px 8px',
            textAlign: 'center',
            backgroundColor: current.pendingOrders > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            border: current.pendingOrders > 0 ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '9px',
            fontSize: '12.5px',
            fontWeight: 700,
            color: current.pendingOrders > 0 ? '#FBBF24' : '#FFFFFF'
          }}
        >
          {current.pendingOrders} Pending
        </div>
      </div>
    </div>
  );
};
