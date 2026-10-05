import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BellRing,
  AlertTriangle,
  Boxes,
  CreditCard,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  CheckCheck
} from 'lucide-react';
import { SmartAlert } from '../types';

export const SmartAlertsModule: React.FC = () => {
  const { smartAlerts, markAlertRead, setCurrentNav, showToast } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);

  const filteredAlerts = smartAlerts.filter((alert) => {
    const matchCat = categoryFilter === 'all' || alert.category === categoryFilter;
    const matchUnread = !unreadOnly || !alert.read;
    return matchCat && matchUnread;
  });

  const unreadCount = smartAlerts.filter((a) => !a.read).length;

  const handleActionClick = (alert: SmartAlert) => {
    markAlertRead(alert.id);
    if (alert.category === 'inventory') setCurrentNav('inventory');
    else if (alert.category === 'debt') setCurrentNav('debt');
    else if (alert.category === 'delivery') setCurrentNav('deliveries');
    else if (alert.category === 'crates') setCurrentNav('empties');
    else setCurrentNav('dashboard');
  };

  const handleMarkAllRead = () => {
    smartAlerts.forEach((a) => markAlertRead(a.id));
    showToast('All alerts marked as read');
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Operational Telemetry
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>Proactive Notifications</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            Operational Smart Alerts ({unreadCount} Unread)
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '6px' }}>
            Automated notifications for stockouts, credit limits, empty crate returns, and delayed route stops
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleMarkAllRead}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13.5px',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <CheckCheck size={16} />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div
        className="glass-card"
        style={{
          padding: '14px 20px',
          marginBottom: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'inventory', label: 'Inventory & Stock' },
            { id: 'debt', label: 'Retailer Credit' },
            { id: 'delivery', label: 'Logistics' },
            { id: 'crates', label: 'Empties & Deposits' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: categoryFilter === cat.id ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: categoryFilter === cat.id ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.06)',
                color: categoryFilter === cat.id ? '#38BDF8' : '#CBD5E1',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#CBD5E1', cursor: 'pointer', fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            style={{ accentColor: '#10B981' }}
          />
          Show Unread Only
        </label>
      </div>

      {/* Alerts Stream List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="glass-card"
            style={{
              padding: '20px 24px',
              border: alert.priority === 'critical' ? '1.5px solid rgba(239, 68, 68, 0.65)' : '1px solid rgba(255, 255, 255, 0.12)',
              borderLeft: alert.read ? undefined : '4px solid #10B981',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: alert.read ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 8px 24px rgba(16, 185, 129, 0.15)',
              transition: 'all 150ms ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1, marginRight: '20px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor:
                    alert.priority === 'critical'
                      ? 'rgba(239, 68, 68, 0.18)'
                      : alert.priority === 'high'
                      ? 'rgba(245, 158, 11, 0.18)'
                      : 'rgba(56, 189, 248, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <BellRing
                  size={20}
                  color={
                    alert.priority === 'critical'
                      ? '#FB7185'
                      : alert.priority === 'high'
                      ? '#FBBF24'
                      : '#38BDF8'
                  }
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor:
                        alert.priority === 'critical'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : alert.priority === 'high'
                          ? 'rgba(245, 158, 11, 0.2)'
                          : 'rgba(255, 255, 255, 0.08)',
                      color:
                        alert.priority === 'critical'
                          ? '#FB7185'
                          : alert.priority === 'high'
                          ? '#FBBF24'
                          : '#CBD5E1',
                      border: `1px solid ${
                        alert.priority === 'critical'
                          ? 'rgba(239, 68, 68, 0.45)'
                          : alert.priority === 'high'
                          ? 'rgba(245, 158, 11, 0.45)'
                          : 'rgba(255, 255, 255, 0.12)'
                      }`
                    }}
                  >
                    {alert.priority}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>{alert.category.toUpperCase()}</span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>•</span>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>{alert.timestamp}</span>
                </div>

                <div style={{ fontSize: '16px', fontWeight: alert.read ? 600 : 800, color: '#FFFFFF' }}>
                  {alert.title}
                </div>
                <div style={{ fontSize: '13.5px', color: '#CBD5E1', marginTop: '3px' }}>
                  {alert.description}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              {!alert.read && (
                <button
                  onClick={() => markAlertRead(alert.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#CBD5E1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Dismiss
                </button>
              )}

              {alert.actionLabel && (
                <button
                  onClick={() => handleActionClick(alert)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {alert.actionLabel}
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
