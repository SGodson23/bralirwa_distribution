import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  Filter,
  ShieldCheck,
  UserX,
  FileSpreadsheet,
  Building,
  HelpCircle
} from 'lucide-react';
import { FraudAnomalyAlert } from '../types';

export const FraudDetectionModule: React.FC = () => {
  const { fraudAlerts, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [localAlerts, setLocalAlerts] = useState<FraudAnomalyAlert[]>(fraudAlerts);

  const filteredAlerts = localAlerts.filter((alert) => {
    const matchSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.involvedUser.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchStatus = selectedStatus === 'all' || alert.status === selectedStatus;
    return matchSearch && matchSeverity && matchStatus;
  });

  const openCount = localAlerts.filter((a) => a.status === 'open').length;
  const totalAtRiskRWF = localAlerts
    .filter((a) => a.status !== 'resolved')
    .reduce((sum, a) => sum + a.estimatedRiskValueRWF, 0);

  const handleUpdateStatus = (alertId: string, newStatus: 'investigating' | 'resolved') => {
    setLocalAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
    showToast(`Anomaly alert status updated to ${newStatus}`);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#FB7185', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Loss Prevention & Security
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>Automated Audit Telemetry</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            Fraud & Loss Prevention Center
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '6px' }}>
            Real-time automated tripwire rules detecting crate diversion, cash mismatch, unauthorized discounts, and ghost deliveries
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => showToast('Internal loss prevention audit report generated (PDF)')}
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
            <ShieldCheck size={16} color="#34D399" />
            Audit Report
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Open Anomaly Flags
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: openCount > 0 ? '#FB7185' : '#34D399' }} className="tabular-nums font-display">
            {openCount} Open Flags
          </div>
          <div style={{ fontSize: '12px', color: '#FB7185', fontWeight: 600, marginTop: '8px' }}>
            Requires General Manager review
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Estimated Value at Risk
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF' }} className="tabular-nums font-display">
            RWF {(totalAtRiskRWF / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
            Potential leakage intercepted
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Active Tripwire Rules
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#34D399' }} className="tabular-nums font-display">
            14 Rules
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
            GPS geofence + MoMo API cross-check
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Resolved This Month
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8' }} className="tabular-nums font-display">
            8 Cases
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle2 size={13} />
            100% recovered to depot ledger
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '14px 20px',
          marginBottom: '22px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: 1,
            backgroundColor: 'rgba(5, 14, 34, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            minWidth: '280px'
          }}
        >
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search anomalies by title, description, or involved staff member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '13.5px',
              color: '#FFFFFF'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1' }}>Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '13px',
              backgroundColor: '#07152E',
              color: '#FFFFFF',
              fontWeight: 600
            }}
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1' }}>Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '13px',
              backgroundColor: '#07152E',
              color: '#FFFFFF',
              fontWeight: 600
            }}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="glass-card"
            style={{
              padding: '24px',
              border: alert.severity === 'CRITICAL' ? '1.5px solid rgba(239, 68, 68, 0.65)' : '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: alert.severity === 'CRITICAL' ? '0 10px 30px rgba(239, 68, 68, 0.2)' : '0 6px 20px rgba(0, 0, 0, 0.35)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor:
                        alert.severity === 'CRITICAL'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : alert.severity === 'HIGH'
                          ? 'rgba(245, 158, 11, 0.2)'
                          : 'rgba(56, 189, 248, 0.2)',
                      color:
                        alert.severity === 'CRITICAL'
                          ? '#FB7185'
                          : alert.severity === 'HIGH'
                          ? '#FBBF24'
                          : '#38BDF8',
                      border: `1px solid ${
                        alert.severity === 'CRITICAL'
                          ? 'rgba(239, 68, 68, 0.45)'
                          : alert.severity === 'HIGH'
                          ? 'rgba(245, 158, 11, 0.45)'
                          : 'rgba(56, 189, 248, 0.45)'
                      }`
                    }}
                  >
                    {alert.severity}
                  </span>

                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
                    Module: <strong style={{ color: '#FFFFFF' }}>{alert.module}</strong>
                  </span>

                  <span style={{ fontSize: '12px', color: '#64748B' }}>•</span>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>{alert.timestamp}</span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {alert.title}
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Estimated Risk</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#FB7185' }} className="tabular-nums font-display">
                  RWF {alert.estimatedRiskValueRWF.toLocaleString()}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '18px' }}>
              {alert.description}
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                Staff Member Flagged: <strong style={{ color: '#FFFFFF' }}>{alert.involvedUser}</strong>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {alert.status === 'open' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'investigating')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#FFFFFF',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Mark Investigating
                  </button>
                )}

                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'resolved')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Resolve & Close Anomaly
                  </button>
                )}

                {alert.status === 'resolved' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#34D399',
                      backgroundColor: 'rgba(16, 185, 129, 0.18)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      padding: '5px 12px',
                      borderRadius: '8px'
                    }}
                  >
                    <CheckCircle2 size={14} /> Resolved
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
