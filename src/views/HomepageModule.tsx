import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LogIn,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  LogOut,
  ArrowRight,
  X,
  Crown
} from 'lucide-react';
import heroImage from '../assets/hero.png';

export const HomepageModule: React.FC = () => {
  const {
    loginWithCredentials,
    showToast,
    isAuthenticated,
    currentUserProfile,
    enterMyDashboard,
    logout
  } = useApp();

  // Login Modal State
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [identifierInput, setIdentifierInput] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [rememberTerminal, setRememberTerminal] = useState<boolean>(true);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsAuthenticating(true);

    setTimeout(() => {
      const result = loginWithCredentials(identifierInput, pinInput);
      setIsAuthenticating(false);
      if (!result.success) {
        setErrorMessage(result.message || 'Invalid credentials. Please verify your email/phone and password.');
      } else {
        setShowLoginModal(false);
        showToast('Authentication successful. Redirecting to your dashboard...');
      }
    }, 300);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundImage: `linear-gradient(180deg, rgba(5, 14, 34, 0.72) 0%, rgba(6, 18, 45, 0.78) 50%, rgba(3, 8, 20, 0.94) 100%), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        color: '#FFFFFF',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: 'border-box'
      }}
    >
      {/* =========================================================================
          MINIMAL HEADER: WHAT WE ARE ABOUT + LOGIN
          ========================================================================= */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 36px',
          background: 'rgba(5, 14, 34, 0.65)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 10,
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        {/* What We Are About */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #D5A021 0%, #B8860B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(213, 160, 33, 0.35)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              flexShrink: 0
            }}
          >
            <Crown size={22} color="#FFFFFF" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '19px', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                BRALIRWA
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(213, 160, 33, 0.2)',
                  color: '#D5A021',
                  border: '1px solid rgba(213, 160, 33, 0.45)',
                  letterSpacing: '0.04em'
                }}
              >
                DistributorOS
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '1px' }}>
              Enterprise Beverage Distribution Platform
            </div>
          </div>
        </div>

        {/* Clear Login Action */}
        <div>
          <button
            onClick={() => {
              setErrorMessage(null);
              setShowLoginModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #D5A021 0%, #B8860B 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(213, 160, 33, 0.45), 0 0 16px rgba(213, 160, 33, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <LogIn size={18} strokeWidth={2.5} />
            <span>Login</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          MINIMAL HERO BODY: CATCHY PHRASE & WHAT THE SYSTEM IS ABOUT
          ========================================================================= */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px 24px',
          maxWidth: '920px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Subtle pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '30px',
            backgroundColor: 'rgba(8, 23, 52, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(213, 160, 33, 0.45)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            marginBottom: '22px'
          }}
        >
          <Crown size={14} color="#FBBF24" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#FBBF24', letterSpacing: '0.06em' }}>
            BRALIRWA PLC DISTRIBUTOR PLATFORM
          </span>
        </div>

        {/* Catchy Main Phrase */}
        <h1
          style={{
            fontSize: '54px',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            margin: '0 0 18px 0',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.9)',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 50%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          From Brewery to Bottle,
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #FBBF24 0%, #D5A021 50%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Powered by Precision.
          </span>
        </h1>

        {/* What We Are About: Multi-Distributor Friendly */}
        <p
          style={{
            fontSize: '17px',
            color: '#E2E8F0',
            lineHeight: 1.65,
            maxWidth: '780px',
            margin: '0 0 36px 0',
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.85)',
            fontWeight: 400
          }}
        >
          The unified enterprise operations platform for authorized Bralirwa beverage distributors across Rwanda.
          Streamlining brewery replenishment, depot inventory, cold-chain route delivery, and automated fiscal accounting.
        </p>

        {/* Clear Center Login Icon Button */}
        <div>
          <button
            onClick={() => {
              setErrorMessage(null);
              setShowLoginModal(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 42px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #D5A021 0%, #B8860B 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 12px 36px rgba(213, 160, 33, 0.55), 0 0 24px rgba(213, 160, 33, 0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <LogIn size={20} strokeWidth={2.5} />
            <span>Sign In to Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </main>

      {/* =========================================================================
          MINIMAL FOOTER
          ========================================================================= */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '18px 24px',
          backgroundColor: 'rgba(5, 14, 34, 0.8)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '12px',
          color: '#94A3B8',
          zIndex: 10
        }}
      >
        <div>
          BRALIRWA PLC Beverage Distribution Network • Rwanda
        </div>
      </footer>

      {/* =========================================================================
          SECURE LOGIN MODAL
          ========================================================================= */}
      {showLoginModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(3, 8, 20, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowLoginModal(false)}
        >
          <div
            style={{
              backgroundColor: '#07152E',
              borderRadius: '24px',
              border: '1.5px solid rgba(213, 160, 33, 0.45)',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(213, 160, 33, 0.15)',
              width: '100%',
              maxWidth: '420px',
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(213, 160, 33, 0.2)',
                    border: '1px solid rgba(213, 160, 33, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D5A021'
                  }}
                >
                  <LogIn size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Distributor Portal Login
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                    Enter credentials to access your dashboard
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowLoginModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.18)',
                  border: '1px solid rgba(239, 68, 68, 0.45)',
                  color: '#FCA5A5',
                  fontSize: '12px'
                }}
              >
                <AlertCircle size={15} style={{ color: '#EF4444', flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Active Session shortcut if already logged in */}
            {isAuthenticated && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                  Active session detected
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      enterMyDashboard();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38BDF8',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Open Dashboard →
                  </button>
                  <span style={{ color: '#64748B' }}>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setShowLoginModal(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  Corporate Email or Mobile Phone
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748B',
                      pointerEvents: 'none'
                    }}
                  >
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    value={identifierInput}
                    onChange={(e) => {
                      setIdentifierInput(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="e.g. owner@example.com, warehouse@example.com"
                    required
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      color: '#FFFFFF',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748B',
                      pointerEvents: 'none'
                    }}
                  >
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="••••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 38px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      letterSpacing: showPin ? 'normal' : '0.15em',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberTerminal}
                    onChange={(e) => setRememberTerminal(e.target.checked)}
                    style={{ accentColor: '#D5A021' }}
                  />
                  <span>Remember this workstation</span>
                </label>

                <span style={{ color: '#38BDF8', fontSize: '11px' }}>
                  256-bit Encrypted
                </span>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #D5A021 0%, #B8860B 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: isAuthenticating ? 'wait' : 'pointer',
                  boxShadow: '0 6px 20px rgba(213, 160, 33, 0.45)',
                  opacity: isAuthenticating ? 0.7 : 1,
                  marginTop: '4px'
                }}
              >
                <span>{isAuthenticating ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageModule;
