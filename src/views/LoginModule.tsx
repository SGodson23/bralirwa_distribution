import React, { useState } from 'react';
import { useApp, NavView } from '../context/AppContext';
import { ALL_USER_CREDENTIALS } from '../data/mockData';
import { UserCredentialProfile } from '../types';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Crown,
  Scale,
  Warehouse,
  PackageCheck,
  TrendingUp,
  ShoppingCart,
  Truck,
  Smartphone,
  BadgeDollarSign,
  History,
  Building,
  Home,
  UserCheck
} from 'lucide-react';

interface LoginModuleProps {
  onBackToHome?: () => void;
}

export const LoginModule: React.FC<LoginModuleProps> = ({ onBackToHome }) => {
  const { setCurrentNav, loginWithCredentials, showToast, currentTenant } = useApp();

  const [emailInput, setEmailInput] = useState<string>('emmanuel@kbl-rwanda.com');
  const [pinInput, setPinInput] = useState<string>('8888');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeDeptTab, setActiveDeptTab] = useState<string>('all');
  const [rememberTerminal, setRememberTerminal] = useState<boolean>(true);

  // Quick department filter for 12 user accounts
  const departments = [
    { id: 'all', label: 'All Users (12)' },
    { id: 'Executive', label: 'Executive' },
    { id: 'Finance', label: 'Finance & Tax' },
    { id: 'Supply Chain', label: 'Supply Chain' },
    { id: 'Commercial', label: 'Commercial' },
    { id: 'Logistics', label: 'Logistics' }
  ];

  const filteredUsers =
    activeDeptTab === 'all'
      ? ALL_USER_CREDENTIALS
      : ALL_USER_CREDENTIALS.filter((u) => u.department === activeDeptTab);

  // Look up matched user based on entered email
  const matchedUser = ALL_USER_CREDENTIALS.find(
    (u) =>
      u.email.toLowerCase() === emailInput.trim().toLowerCase() ||
      u.phone.replace(/\s+/g, '') === emailInput.trim().replace(/\s+/g, '')
  );

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginWithCredentials(emailInput, pinInput);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.message || 'Invalid credentials. Please verify your email/phone and PIN.');
      }
    }, 300);
  };

  const executeLogin = (user: UserCredentialProfile) => {
    setIsLoading(true);
    setErrorMessage(null);
    setEmailInput(user.email);
    setPinInput(user.pin);

    setTimeout(() => {
      loginWithCredentials(user.email, user.pin);
      setIsLoading(false);
    }, 250);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'distributor_owner':
        return <Crown size={18} color="#D5A021" />;
      case 'accountant':
        return <Scale size={18} color="#3478F6" />;
      case 'warehouse_manager':
        return <Warehouse size={18} color="#16A36A" />;
      case 'storekeeper':
        return <PackageCheck size={18} color="#10B981" />;
      case 'sales_manager':
        return <TrendingUp size={18} color="#8B5CF6" />;
      case 'salesperson':
        return <ShoppingCart size={18} color="#EC4899" />;
      case 'logistics_manager':
        return <Truck size={18} color="#EAB308" />;
      case 'driver':
        return <Smartphone size={18} color="#F97316" />;
      case 'cashier':
        return <BadgeDollarSign size={18} color="#38BDF8" />;
      case 'auditor':
        return <History size={18} color="#A855F7" />;
      case 'platform_admin':
        return <Building size={18} color="#6366F1" />;
      default:
        return <UserCheck size={18} color="#D5A021" />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#081734',
        backgroundImage: 'radial-gradient(circle at 50% 10%, #0F2D6B 0%, #071530 60%, #030A17 100%)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 20px 60px'
      }}
    >
      {/* Top Bar with brand and Back to Home button */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '36px',
          padding: '12px 24px',
          background: 'rgba(10, 28, 62, 0.7)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #D5A021 0%, #B8860B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(213, 160, 33, 0.4)'
            }}
          >
            KBL
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.01em', color: '#FFFFFF' }}>
              {currentTenant.name}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>
              Bralirwa Tier-1 Authorized Distributor ERP
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => {
              if (onBackToHome) onBackToHome();
              else setCurrentNav('homepage');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F8FAFC',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
          >
            <Home size={16} />
            Distributor Homepage
          </button>
        </div>
      </div>

      {/* Main Grid: Left Side Form + Right Side Fast Presets */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: 'minmax(380px, 460px) 1fr',
          gap: '32px',
          alignItems: 'start'
        }}
      >
        {/* =========================================================================
            LEFT COLUMN: SIGN-IN FORM
            ========================================================================= */}
        <div
          style={{
            backgroundColor: 'rgba(10, 28, 62, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.1)',
            padding: '36px 32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8'
              }}
            >
              <Lock size={16} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Enterprise Authentication
            </span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', color: '#FFFFFF' }}>
            Sign In to Workspace
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 24px 0', lineHeight: 1.5 }}>
            Access your department dashboard with your verified Rwanda operational credentials.
          </p>

          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#FCA5A5',
                fontSize: '13px',
                marginBottom: '20px',
                lineHeight: 1.4
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#EF4444' }} />
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleStandardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email / Username field */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                Corporate Email or Phone
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    color: '#64748B',
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. emmanuel.ndayisaba@kbl-rwanda.com"
                  autoComplete="username"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#38BDF8')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(148, 163, 184, 0.25)')}
                />
              </div>
            </div>

            {/* Role Live Match Preview */}
            {matchedUser && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  border: `1px solid ${matchedUser.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <img
                  src={matchedUser.avatar}
                  alt={matchedUser.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{matchedUser.name}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{matchedUser.roleTitle}</div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: `${matchedUser.color}25`,
                    color: matchedUser.color,
                    fontWeight: 700
                  }}
                >
                  {matchedUser.department}
                </span>
              </div>
            )}

            {/* PIN Input field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>
                  Password
                </label>
                {matchedUser && (
                  <button
                    type="button"
                    onClick={() => setPinInput(matchedUser.pin)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38BDF8',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Auto-Fill Password ({matchedUser.pin})
                  </button>
                )}
              </div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <KeyRound
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    color: '#64748B',
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={24}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter password (e.g. 1234567890)"
                  autoComplete="current-password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    letterSpacing: '0.15em',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#38BDF8')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(148, 163, 184, 0.25)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Terminal checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#94A3B8' }}>
                <input
                  type="checkbox"
                  checked={rememberTerminal}
                  onChange={(e) => setRememberTerminal(e.target.checked)}
                  style={{ accentColor: '#38BDF8', width: '15px', height: '15px' }}
                />
                Remember this terminal session
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#38BDF8' }}>
                <ShieldCheck size={13} />
                TLS 256-bit
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px',
                backgroundColor: '#D5A021',
                backgroundImage: 'linear-gradient(135deg, #D5A021 0%, #B8860B 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '14px',
                cursor: isLoading ? 'wait' : 'pointer',
                boxShadow: '0 8px 24px rgba(213, 160, 33, 0.35)',
                transition: 'all 0.2s ease',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(213, 160, 33, 0.45)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(213, 160, 33, 0.35)';
              }}
            >
              {isLoading ? (
                <>Authenticating with Bralirwa Server...</>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Quick instructions */}
          <div
            style={{
              marginTop: '28px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '12px',
              color: '#94A3B8',
              lineHeight: 1.5
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#E2E8F0', marginBottom: '4px' }}>
              <HelpCircle size={14} color="#38BDF8" />
              Demo Tip: 12 User Accounts Pre-Configured
            </div>
            You can either type any employee credential above or click any profile in the directory on the right for instant 1-click authentication!
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: 12-USER INSTANT DIRECTORY
            ========================================================================= */}
        <div>
          {/* Header & Department Filters */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  Operational Staff Directory
                </h2>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
                  Select any of the 12 active staff members to test their role-specific dashboard & permissions.
                </div>
              </div>
            </div>

            {/* Department Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {departments.map((dept) => {
                const isActive = activeDeptTab === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setActiveDeptTab(dept.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: isActive
                        ? '1px solid #38BDF8'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: isActive ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      color: isActive ? '#38BDF8' : '#94A3B8',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {dept.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '14px',
              maxHeight: '680px',
              overflowY: 'auto',
              paddingRight: '6px'
            }}
          >
            {filteredUsers.map((user) => {
              const isSelected = emailInput === user.email;
              return (
                <div
                  key={user.id}
                  style={{
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(10, 28, 62, 0.75)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    border: isSelected
                      ? `1px solid ${user.color}`
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 8px 24px ${user.color}25` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: `2px solid ${user.color}`
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#0F172A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${user.color}`
                        }}
                      >
                        {getRoleIcon(user.role)}
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.name}
                        </div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: `${user.color}22`,
                            color: user.color,
                            flexShrink: 0
                          }}
                        >
                          {user.department}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>
                        {user.roleTitle}
                      </div>
                    </div>
                  </div>

                  {/* Credentials snippet */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      fontSize: '11px',
                      color: '#94A3B8'
                    }}
                  >
                    <div>
                      <span style={{ color: '#64748B' }}>PIN: </span>
                      <strong style={{ color: '#F8FAFC', letterSpacing: '0.08em' }}>{user.pin}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Access: </span>
                      <span style={{ color: '#38BDF8', fontWeight: 600 }}>{user.allowedNavs.length} modules</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Target: </span>
                      <span style={{ color: '#E2E8F0', fontWeight: 600 }}>#{user.portalHash}</span>
                    </div>
                  </div>

                  {/* Action buttons: 1-click Sign In & Select in Form */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setEmailInput(user.email);
                        setPinInput(user.pin);
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#CBD5E1',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Fill In Form
                    </button>

                    <button
                      onClick={() => executeLogin(user)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        backgroundColor: `${user.color}25`,
                        border: `1px solid ${user.color}60`,
                        color: user.color,
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${user.color}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${user.color}25`;
                      }}
                    >
                      <span>1-Click Login</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginModule;
