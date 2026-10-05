import React from 'react';
import { useApp, NavView } from '../../context/AppContext';
import {
  LayoutDashboard,
  Warehouse,
  Boxes,
  Beer,
  Truck,
  PackageCheck,
  ShoppingCart,
  Zap,
  Users,
  CreditCard,
  RotateCcw,
  Send,
  MapPin,
  Smartphone,
  Wrench,
  BadgeDollarSign,
  Scale,
  PieChart,
  Receipt,
  UserCheck,
  TrendingUp,
  Bot,
  ShieldAlert,
  BellRing,
  History,
  Building,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Lock,
  LucideIcon,
  Home,
  LogOut
} from 'lucide-react';

interface NavItem {
  id: NavView;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    currentNav,
    setCurrentNav,
    sidebarCollapsed,
    toggleSidebar,
    smartAlerts,
    fraudAlerts,
    currentTenant,
    allowedNavs,
    currentCredential,
    currentUserProfile,
    isCurrentPortalLocked,
    lockCurrentPortal,
    logoutToLogin
  } = useApp();

  const unreadAlerts = smartAlerts.filter((a) => !a.read).length;
  const openFraudAlerts = fraudAlerts.filter((f) => f.status === 'open').length;

  const sections: NavSection[] = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Executive Command', icon: LayoutDashboard },
        { id: 'warehouse_dashboard', label: 'Warehouse Health', icon: Warehouse, badge: 'Depot', badgeColor: '#16A36A' },
        { id: 'inventory', label: 'Inventory & Stock', icon: Boxes },
        { id: 'purchases', label: 'Purchases & Receiving', icon: Truck, badge: 'Unified', badgeColor: '#16A36A' }
      ]
    },
    {
      title: 'COMMERCIAL',
      items: [
        { id: 'customers', label: 'Clients', icon: Users, badge: '248', badgeColor: '#38BDF8' },
        { id: 'orders', label: 'Sales & Orders', icon: ShoppingCart },
        { id: 'quick_order', label: 'Quick Order POS', icon: Zap, badge: 'Fast', badgeColor: '#D5A021' },
        { id: 'debt', label: 'Debt & Receivables', icon: CreditCard }
      ]
    },
    {
      title: 'LOGISTICS & ASSETS',
      items: [
        { id: 'empties', label: 'Empties & Crates', icon: RotateCcw, badge: 'Signature', badgeColor: '#16A36A' },
        { id: 'deliveries', label: 'Logistics Dispatch', icon: Send },
        { id: 'delivery_map', label: 'Live Delivery Map', icon: MapPin },
        { id: 'driver_mobile', label: 'Driver Mobile App', icon: Smartphone, badge: 'Driver' },
        { id: 'fleet', label: 'Fleet & Service', icon: Wrench }
      ]
    },
    {
      title: 'FINANCIAL CONTROL',
      items: [
        { id: 'accountant_dashboard', label: 'Accountant Command', icon: Scale, badge: 'Finance', badgeColor: '#3478F6' },
        { id: 'reconciliation', label: 'Cash Reconciliation', icon: BadgeDollarSign, badge: 'Daily' },
        { id: 'finance', label: 'P&L / Profitability', icon: PieChart },
        { id: 'expenses', label: 'Operating Expenses', icon: Receipt },
        { id: 'sales_team', label: 'Sales Team & Targets', icon: UserCheck }
      ]
    },
    {
      title: 'INTELLIGENCE & TRUST',
      items: [
        { id: 'forecasting', label: 'AI Demand Forecast', icon: TrendingUp, badge: 'AI', badgeColor: '#3478F6' },
        { id: 'assistant', label: 'Intelligent Assistant', icon: Bot, badge: 'Ask', badgeColor: '#8B5CF6' },
        {
          id: 'fraud',
          label: 'Fraud & Anomalies',
          icon: ShieldAlert,
          badge: openFraudAlerts > 0 ? `${openFraudAlerts}` : undefined,
          badgeColor: '#E5484D'
        },
        {
          id: 'alerts',
          label: 'Smart Alerts',
          icon: BellRing,
          badge: unreadAlerts > 0 ? `${unreadAlerts}` : undefined,
          badgeColor: '#F2A93B'
        },
        { id: 'audit', label: 'Audit Trail', icon: History }
      ]
    },
    {
      title: 'PLATFORM',
      items: [
        { id: 'super_admin', label: 'Superhost Command', icon: Building, badge: 'GOD-MODE', badgeColor: '#6366F1' },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  // Filter sections by private allowedNavs
  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => (allowedNavs ? allowedNavs.includes(item.id) : true))
    }))
    .filter((section) => section.items.length > 0);


  return (
    <aside
      style={{
        width: sidebarCollapsed ? '72px' : '260px',
        backgroundColor: '#071229',
        color: '#FFFFFF',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #132752',
        transition: 'width 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 50,
        userSelect: 'none'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: sidebarCollapsed ? '18px 12px' : '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid #1C2B47'
        }}
      >
        <div
          onClick={() => setCurrentNav('homepage')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', cursor: 'pointer' }}
          title="Return to Bralirwa Distributor Homepage"
        >
          {/* Logo icon */}
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #16A36A 0%, #0F6844 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(22, 163, 106, 0.35)'
            }}
          >
            <Boxes size={19} color="#FFFFFF" />
          </div>

          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '16px',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF'
                  }}
                >
                  Distributor<span style={{ color: '#16A36A' }}>OS</span>
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(213, 160, 33, 0.2)',
                    color: '#D5A021',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    border: '1px solid rgba(213, 160, 33, 0.3)'
                  }}
                >
                  PRO
                </span>
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                Beverage Distribution Intelligence
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px'
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: sidebarCollapsed ? '12px 6px' : '14px 12px'
        }}
      >
        {/* Distributor Homepage Jump */}
        <button
          onClick={() => setCurrentNav('homepage')}
          style={{
            width: '100%',
            marginBottom: '14px',
            padding: sidebarCollapsed ? '10px 0' : '9px 12px',
            borderRadius: '9px',
            backgroundColor: currentNav === 'homepage' ? 'rgba(213, 160, 33, 0.25)' : 'rgba(213, 160, 33, 0.1)',
            border: '1px solid rgba(213, 160, 33, 0.35)',
            color: '#FBBF24',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Distributor Operations Homepage"
        >
          <Home size={16} color="#D5A021" />
          {!sidebarCollapsed && <span>Distributor Home</span>}
        </button>
        {filteredSections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '16px' }}>
            {!sidebarCollapsed && (
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#64748B',
                  letterSpacing: '0.08em',
                  padding: '6px 10px',
                  textTransform: 'uppercase'
                }}
              >
                {section.title}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = currentNav === item.id || (item.id === 'purchases' && currentNav === 'receiving');
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentNav(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: sidebarCollapsed ? '10px 0' : '8px 12px',
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      width: '100%',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: active ? 'rgba(22, 163, 106, 0.15)' : 'transparent',
                      color: active ? '#FFFFFF' : '#94A3B8',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: active ? 600 : 400,
                      transition: 'all 120ms ease',
                      position: 'relative'
                    }}
                  >
                    {active && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '6px',
                          bottom: '6px',
                          width: '3px',
                          backgroundColor: '#16A36A',
                          borderRadius: '0 4px 4px 0'
                        }}
                      />
                    )}
                    <Icon size={17} color={active ? '#16A36A' : '#94A3B8'} />
                    {!sidebarCollapsed && (
                      <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '10px',
                          backgroundColor: item.badgeColor || '#334155',
                          color: '#FFFFFF'
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Distributor Badge & Expand Button */}
      <div
        style={{
          padding: sidebarCollapsed ? '12px 6px' : '14px 16px',
          borderTop: '1px solid #1C2B47',
          backgroundColor: '#070B14'
        }}
      >
        {sidebarCollapsed ? (
          <button
            onClick={toggleSidebar}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px 0'
            }}
          >
            <ChevronRight size={18} />
          </button>
        ) : (
          <div>
            {/* Private Portal Session Indicator & Lock */}
            <div
              style={{
                marginBottom: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${currentCredential.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: isCurrentPortalLocked ? '#EF4444' : '#10B981',
                    boxShadow: isCurrentPortalLocked ? '0 0 8px #EF4444' : '0 0 8px #10B981',
                    flexShrink: 0
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentCredential.name}
                  </div>
                  <div style={{ fontSize: '10px', color: currentCredential.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {isCurrentPortalLocked ? 'Locked' : 'Private Session'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {!isCurrentPortalLocked && (
                  <button
                    onClick={lockCurrentPortal}
                    title="Lock Private Session"
                    style={{
                      padding: '4px 7px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#EF4444',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Lock size={10} />
                    <span>Lock</span>
                  </button>
                )}

                <button
                  onClick={logoutToLogin}
                  title="Sign Out / Switch Employee"
                  style={{
                    padding: '4px 7px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#94A3B8',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <LogOut size={10} />
                  <span>Exit</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Licensed BRALIRWA Partner</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A36A' }} />
            </div>
            <div style={{ fontSize: '11.5px', color: '#E2E8F0', fontWeight: 600 }}>{currentTenant.licenseNumber}</div>
            <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>Rwanda Revenue TIN: {currentTenant.tinNumber}</div>
          </div>
        )}
      </div>
    </aside>
  );
};
