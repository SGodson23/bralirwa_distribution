import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { AuditLogEntry } from '../types';

export const AuditTrailModule: React.FC = () => {
  const { auditLogs, showToast, currentTenant } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.previousValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.newValue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAction = selectedAction === 'all' || log.action.toLowerCase().includes(selectedAction.toLowerCase());
    const matchUser = selectedUser === 'all' || log.userName === selectedUser;
    return matchSearch && matchAction && matchUser;
  });

  const uniqueUsers = Array.from(new Set(auditLogs.map((l) => l.userName)));

  return (
    <div style={{ padding: '28px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Governance & Compliance
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>Tamper-Evident Immutable Log</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            System Audit Trail & Access Log
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '6px' }}>
            Full accountability record for credit limit overrides, stock adjustments, cash counts, and dispatch approvals
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => showToast('Audit trail exported to CSV with cryptographic hash')}
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
            <Download size={16} />
            Export Audit Log (CSV)
          </button>
        </div>
      </div>

      {/* Security Status Banner */}
      <div
        className="glass-card"
        style={{
          padding: '18px 24px',
          marginBottom: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShieldCheck size={22} color="#34D399" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
              Immutable Audit Integrity: ACTIVE
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
              All actions are signed with SHA-256 integrity checksums and client IP addresses
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#CBD5E1' }}>
          Tenant: <strong style={{ color: '#38BDF8' }}>{currentTenant.name}</strong> • Total Events: <strong style={{ color: '#34D399' }}>{auditLogs.length}</strong>
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
            placeholder="Search by action, user, entity, values, or target ID..."
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
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1' }}>User:</span>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
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
            <option value="all">All Users</option>
            {uniqueUsers.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1' }}>Action:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
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
            <option value="all">All Action Types</option>
            <option value="credit">Credit Overrides</option>
            <option value="reconciliation">Reconciliation</option>
            <option value="stock">Stock Adjustments</option>
            <option value="purchase">PO Creation</option>
            <option value="dispatch">Dispatch</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(5, 14, 34, 0.85)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#CBD5E1', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '14px 20px' }}>Timestamp</th>
              <th style={{ padding: '14px 16px' }}>User & Role</th>
              <th style={{ padding: '14px 16px' }}>Action Executed</th>
              <th style={{ padding: '14px 16px' }}>Target Entity / ID</th>
              <th style={{ padding: '14px 16px' }}>Previous State</th>
              <th style={{ padding: '14px 16px' }}>New State</th>
              <th style={{ padding: '14px 20px' }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 20px', color: '#94A3B8', fontSize: '12.5px' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{log.timestamp.split(' ')[0]}</div>
                  <div>{log.timestamp.split(' ')[1]}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{log.userName}</div>
                  <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>{log.userRole}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      backgroundColor:
                        log.action.includes('Approved') || log.action.includes('Reconciled')
                          ? 'rgba(16, 185, 129, 0.18)'
                          : log.action.includes('Override') || log.action.includes('Blocked')
                          ? 'rgba(245, 158, 11, 0.18)'
                          : 'rgba(56, 189, 248, 0.18)',
                      color:
                        log.action.includes('Approved') || log.action.includes('Reconciled')
                          ? '#34D399'
                          : log.action.includes('Override') || log.action.includes('Blocked')
                          ? '#FBBF24'
                          : '#38BDF8',
                      border: `1px solid ${
                        log.action.includes('Approved') || log.action.includes('Reconciled')
                          ? 'rgba(16, 185, 129, 0.35)'
                          : log.action.includes('Override') || log.action.includes('Blocked')
                          ? 'rgba(245, 158, 11, 0.35)'
                          : 'rgba(56, 189, 248, 0.35)'
                      }`
                    }}
                  >
                    {log.action}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{log.targetEntity}</div>
                  <div style={{ fontSize: '11.5px', color: '#38BDF8', fontFamily: 'monospace' }}>{log.targetId}</div>
                </td>
                <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '12.5px', maxWidth: '200px' }}>
                  <div style={{ textDecoration: 'line-through', opacity: 0.8 }}>{log.previousValue}</div>
                </td>
                <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700, fontSize: '12.5px', maxWidth: '200px' }}>
                  {log.newValue}
                </td>
                <td style={{ padding: '14px 20px', color: '#94A3B8', fontSize: '12px', fontFamily: 'monospace' }}>
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
