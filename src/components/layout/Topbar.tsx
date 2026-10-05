import React, { useState, useRef, useEffect } from 'react';
import { useApp, NavView } from '../../context/AppContext';
import {
  Search,
  Bell,
  ChevronDown,
  CheckCircle2,
  Check,
  ArrowRight,
  Settings,
  History,
  LogOut,
  Lock,
  Home
} from 'lucide-react';
import { UserRole } from '../../types';

interface RoleOption {
  role: UserRole;
  title: string;
  badge: string;
  department: string;
}

const ROLES_LIST: RoleOption[] = [
  { role: 'distributor_owner', title: 'Distributor Owner', badge: 'Full Control', department: 'Executive' },
  { role: 'general_manager', title: 'General Manager', badge: 'Operations', department: 'Executive' },
  { role: 'sales_manager', title: 'Sales Manager', badge: 'Sales & Quotas', department: 'Commercial' },
  { role: 'salesperson', title: 'Field Salesperson', badge: 'Field Orders POS', department: 'Commercial' },
  { role: 'warehouse_manager', title: 'Warehouse Manager', badge: 'Inventory & Stock', department: 'Supply Chain' },
  { role: 'storekeeper', title: 'Storekeeper', badge: 'Receiving Depot', department: 'Supply Chain' },
  { role: 'logistics_manager', title: 'Logistics Manager', badge: 'Fleet & Dispatch', department: 'Supply Chain' },
  { role: 'driver', title: 'Delivery Driver', badge: 'Mobile App', department: 'Supply Chain' },
  { role: 'accountant', title: 'Senior Accountant', badge: 'P&L & Receivables', department: 'Finance' },
  { role: 'cashier', title: 'Chief Cashier', badge: 'Daily Reconciliation', department: 'Finance' },
  { role: 'auditor', title: 'Internal Auditor', badge: 'Read-Only Audit', department: 'Audit' },
  { role: 'platform_admin', title: 'Platform Super Admin', badge: 'SaaS Multi-tenant', department: 'Platform' }
];

const NAV_METADATA: Record<NavView, { section: string; title: string }> = {
  homepage: { section: 'PORTAL', title: 'Distributor Operations Overview' },
  login: { section: 'PORTAL', title: 'Employee Portal Sign In' },
  dashboard: { section: 'OPERATIONS', title: 'Executive Command' },
  warehouse_dashboard: { section: 'OPERATIONS', title: 'Warehouse Health' },
  inventory: { section: 'OPERATIONS', title: 'Inventory & Stock' },
  products: { section: 'OPERATIONS', title: 'Inventory & Stock' },
  purchases: { section: 'OPERATIONS', title: 'Purchases & Receiving' },
  receiving: { section: 'OPERATIONS', title: 'Purchases & Receiving' },
  orders: { section: 'COMMERCIAL', title: 'Sales & Orders' },
  quick_order: { section: 'COMMERCIAL', title: 'Quick Order POS' },
  customers: { section: 'COMMERCIAL', title: 'Clients' },
  debt: { section: 'COMMERCIAL', title: 'Debt & Receivables' },
  empties: { section: 'LOGISTICS', title: 'Empties & Crates' },
  deliveries: { section: 'LOGISTICS', title: 'Deliveries & Dispatch' },
  delivery_map: { section: 'LOGISTICS', title: 'Live Route Map' },
  driver_mobile: { section: 'LOGISTICS', title: 'Driver Mobile App' },
  fleet: { section: 'LOGISTICS', title: 'Fleet Management' },
  accountant_dashboard: { section: 'FINANCE', title: 'Senior Accountant Financial Command' },
  reconciliation: { section: 'FINANCE', title: 'Cash Reconciliation' },
  finance: { section: 'FINANCE', title: 'P&L / Profitability' },
  expenses: { section: 'FINANCE', title: 'Operating Expenses' },
  sales_team: { section: 'FINANCE', title: 'Sales Team & Quotas' },
  forecasting: { section: 'INTELLIGENCE', title: 'AI Demand Forecast' },
  assistant: { section: 'INTELLIGENCE', title: 'AI Assistant' },
  fraud: { section: 'INTELLIGENCE', title: 'Fraud & Anomalies' },
  alerts: { section: 'INTELLIGENCE', title: 'Smart Alerts' },
  audit: { section: 'INTELLIGENCE', title: 'Audit Trail' },
  super_admin: { section: 'PLATFORM', title: 'SaaS Super Admin' },
  settings: { section: 'PLATFORM', title: 'Distributor Settings' }
};

export const Topbar: React.FC = () => {
  const {
    currentTenant,
    currentUser,
    currentUserProfile,
    switchRole,
    currentNav,
    setCurrentNav,
    smartAlerts,
    markAlertRead,
    setSearchOpen,
    showToast,
    lockCurrentPortal,
    logoutToLogin
  } = useApp();

  const [alertsMenuOpen, setAlertsMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const alertsRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (alertsRef.current && !alertsRef.current.contains(target)) setAlertsMenuOpen(false);
      if (roleRef.current && !roleRef.current.contains(target)) setRoleMenuOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAlertsMenuOpen(false);
        setRoleMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const unreadAlerts = smartAlerts.filter((a) => !a.read);
  const criticalAlertsCount = unreadAlerts.filter((a) => a.priority === 'critical').length;
  const navInfo = NAV_METADATA[currentNav] || { section: 'OPERATIONS', title: 'Dashboard' };

  const handleMarkAllAlertsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    unreadAlerts.forEach((a) => markAlertRead(a.id));
    showToast('All operational alerts marked as read');
  };

  const handleAlertClick = (alertId: string, actionTarget?: string) => {
    markAlertRead(alertId);
    setAlertsMenuOpen(false);
    if (actionTarget) {
      setCurrentNav(actionTarget as NavView);
    }
  };

  const handleRoleSelect = (roleOption: RoleOption) => {
    switchRole(roleOption.role);
    setRoleMenuOpen(false);
    showToast(`Switched perspective to ${roleOption.title}`);
  };

  return (
    <header className="topbar-header">
      {/* LEFT: Clean Single-Line Context Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#64748B',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}
        >
          {navInfo.section}
        </span>
        <span style={{ color: '#FFFFFF', fontSize: '13px' }}>/</span>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {navInfo.title}
        </span>
      </div>


      {/* RIGHT: Compact Search, Alerts & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Sleek Universal Search Button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="topbar-search-input"
          style={{
            width: '210px',
            padding: '5px 12px',
            height: '34px',
            borderRadius: '7px',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          title="Universal Search (Ctrl+K)"
          aria-label="Universal Search"
        >
          <Search size={14} color="#34D399" />
          <span style={{ flex: 1, textAlign: 'left', color: '#94A3B8' }}>Search...</span>
          <kbd
            style={{
              fontSize: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '4px',
              padding: '1px 5px',
              color: '#CBD5E1',
              fontFamily: 'monospace'
            }}
          >
            Ctrl K
          </kbd>
        </button>

        {/* Operational Alerts Bell */}
        <div ref={alertsRef} style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setAlertsMenuOpen(!alertsMenuOpen);
              setRoleMenuOpen(false);
            }}
            className={`topbar-btn ${alertsMenuOpen ? 'active' : ''}`}
            style={{
              width: '34px',
              height: '34px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '7px',
              position: 'relative'
            }}
            title={`Operational Alerts (${unreadAlerts.length} unread)`}
            aria-label="Smart Alerts Notification Center"
          >
            <Bell size={15} color={unreadAlerts.length > 0 ? '#FFFFFF' : '#94A3B8'} />
            {unreadAlerts.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: criticalAlertsCount > 0 ? '#E5484D' : '#F2A93B',
                  borderRadius: '50%',
                  border: '1.5px solid #06112B'
                }}
              />
            )}
          </button>

          {alertsMenuOpen && (
            <div className="topbar-popover" style={{ width: '360px', right: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px 10px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#FFFFFF' }}>
                    Operational Alerts
                  </div>
                  {unreadAlerts.length > 0 && (
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(229, 72, 77, 0.2)',
                        color: '#F87171',
                        fontWeight: 700
                      }}
                    >
                      {unreadAlerts.length} new
                    </span>
                  )}
                </div>

                {unreadAlerts.length > 0 && (
                  <button
                    onClick={handleMarkAllAlertsRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#34D399',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Check size={13} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Alert items list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto', padding: '8px 4px' }}>
                {smartAlerts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '13px' }}>
                    No alerts at this moment. Everything running smoothly!
                  </div>
                ) : (
                  smartAlerts.slice(0, 5).map((a) => {
                    const isCritical = a.priority === 'critical';
                    const isHigh = a.priority === 'high';
                    const borderColor = isCritical ? '#E5484D' : isHigh ? '#F2A93B' : '#3478F6';

                    return (
                      <div
                        key={a.id}
                        onClick={() => handleAlertClick(a.id, a.actionTarget)}
                        style={{
                          padding: '9px 11px',
                          borderRadius: '7px',
                          backgroundColor: a.read ? 'rgba(255, 255, 255, 0.03)' : 'rgba(30, 58, 110, 0.35)',
                          borderLeft: `3px solid ${borderColor}`,
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 700, textTransform: 'uppercase', color: borderColor }}>
                            {a.priority}
                          </span>
                          <span>{a.timestamp}</span>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>{a.title}</div>
                        <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px', lineHeight: 1.3 }}>{a.description}</div>
                      </div>
                    );
                  })
                )}
              </div>

              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '8px',
                  marginTop: '4px',
                  textAlign: 'center'
                }}
              >
                <button
                  onClick={() => {
                    setCurrentNav('alerts');
                    setAlertsMenuOpen(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#34D399',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Open Alerts Center</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Single-Line Badge */}
        <div ref={roleRef} style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setRoleMenuOpen(!roleMenuOpen);
              setAlertsMenuOpen(false);
            }}
            className={`topbar-btn ${roleMenuOpen ? 'active' : ''}`}
            style={{
              height: '34px',
              padding: '3px 8px 3px 4px',
              gap: '7px',
              borderRadius: '7px'
            }}
            title="User Profile & Perspective Switcher"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #16A36A'
              }}
            />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#FFFFFF' }}>
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown
              size={12}
              color="#94A3B8"
              style={{
                transform: roleMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 150ms ease'
              }}
            />
          </button>

          {roleMenuOpen && (
            <div className="topbar-popover" style={{ width: '320px', right: 0 }}>
              {/* Profile Card Header */}
              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '7px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #16A36A' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '11.5px', color: '#34D399', fontWeight: 600 }}>{currentUser.roleTitle}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{currentUser.email}</div>
                </div>
              </div>

              {/* Role Simulation Heading */}
              <div style={{ padding: '2px 8px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Simulate Role Perspective
                </span>
                <span style={{ fontSize: '10px', color: '#D5A021', fontWeight: 700 }}>12 Roles</span>
              </div>

              {/* Roles List */}
              <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {ROLES_LIST.map((r) => {
                  const isActive = r.role === currentUser.role;
                  return (
                    <div
                      key={r.role}
                      onClick={() => handleRoleSelect(r)}
                      className={`topbar-popover-item ${isActive ? 'active' : ''}`}
                      style={{ padding: '6px 10px' }}
                    >
                      <div>
                        <div style={{ fontWeight: isActive ? 700 : 500, color: isActive ? '#34D399' : '#FFFFFF', fontSize: '12.5px' }}>
                          {r.title}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                          {r.department} • {r.badge}
                        </div>
                      </div>
                      {isActive && <CheckCircle2 size={15} color="#34D399" />}
                    </div>
                  );
                })}
              </div>

              {/* Quick Profile Utilities */}
              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  marginTop: '8px',
                  paddingTop: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div
                  onClick={() => {
                    setCurrentNav('settings');
                    setRoleMenuOpen(false);
                  }}
                  className="topbar-popover-item"
                  style={{ padding: '6px 10px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={14} color="#94A3B8" />
                    <span>Distributor Settings</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setCurrentNav('audit');
                    setRoleMenuOpen(false);
                  }}
                  className="topbar-popover-item"
                  style={{ padding: '6px 10px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <History size={14} color="#94A3B8" />
                    <span>Audit Trail</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setCurrentNav('homepage');
                    setRoleMenuOpen(false);
                  }}
                  className="topbar-popover-item"
                  style={{ padding: '6px 10px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Home size={14} color="#D5A021" />
                    <span>Distributor Homepage</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    lockCurrentPortal();
                    setRoleMenuOpen(false);
                  }}
                  className="topbar-popover-item"
                  style={{ padding: '6px 10px', color: '#F87171' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={14} color="#F87171" />
                    <span style={{ fontWeight: 600 }}>Lock Portal Session</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    logoutToLogin();
                    setRoleMenuOpen(false);
                  }}
                  className="topbar-popover-item"
                  style={{ padding: '6px 10px', color: '#EF4444' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={14} color="#EF4444" />
                    <span style={{ fontWeight: 600 }}>Sign Out / Switch Employee</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
