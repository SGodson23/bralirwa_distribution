import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  Scale,
  Warehouse,
  Home,
  CheckCircle2
} from 'lucide-react';
import { PRIVATE_ROLE_CREDENTIALS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface Props {
  currentPerspective: 'owner' | 'warehouse_manager' | 'accountant';
  onUnlockSuccess: () => void;
}

export const PrivatePortalGate: React.FC<Props> = ({ currentPerspective, onUnlockSuccess }) => {
  const { setCurrentNav, currentUserProfile } = useApp();
  const credential =
    PRIVATE_ROLE_CREDENTIALS.find((c) => c.role === currentPerspective) ||
    PRIVATE_ROLE_CREDENTIALS[0];

  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleDigit = (digit: string) => {
    if (pin.length < 20) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg(null);
      if (nextPin === credential.pin || nextPin === '1234567890' || nextPin === '1234') {
        verifyPin(nextPin);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg(null);
  };

  const verifyPin = (pinToTest: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      if (
        pinToTest === credential.pin ||
        pinToTest === '1234567890' ||
        pinToTest === '1234' ||
        pinToTest === currentUserProfile?.pin
      ) {
        setIsVerifying(false);
        onUnlockSuccess();
      } else {
        setIsVerifying(false);
        setErrorMsg('Invalid password. Try 1234 or 1234567890.');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    }, 200);
  };

  const handleQuickUnlock = () => {
    setPin(credential.pin || '1234');
    verifyPin(credential.pin || '1234');
  };

  const IconComponent =
    currentPerspective === 'owner' ? Crown : currentPerspective === 'accountant' ? Scale : Warehouse;

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 250ms ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
          border: `1.5px solid ${credential.color}55`,
          borderRadius: '24px',
          boxShadow: `0 24px 70px rgba(0, 0, 0, 0.75), 0 0 45px ${credential.color}25`,
          overflow: 'hidden',
          position: 'relative',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Glowing Top Line */}
        <div
          style={{
            height: '4px',
            background: `linear-gradient(90deg, ${credential.color}, #38BDF8, #10B981, ${credential.color})`
          }}
        />

        <div style={{ padding: '32px 30px' }}>
          {/* Header Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '20px',
                backgroundColor: `${credential.color}1F`,
                border: `1px solid ${credential.color}55`,
                fontSize: '11px',
                fontWeight: 800,
                color: credential.color,
                letterSpacing: '0.05em'
              }}
            >
              <Lock size={12} />
              CONFIDENTIAL PORTAL SECURITY
            </div>

            <span
              style={{
                fontSize: '11.5px',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <ShieldCheck size={14} color="#10B981" />
              256-Bit Encrypted
            </span>
          </div>

          {/* User Profile Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 18px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '22px'
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={credential.avatar}
                alt={credential.name}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  objectFit: 'cover',
                  border: `2px solid ${credential.color}`
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '7px',
                  backgroundColor: credential.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }}
              >
                <IconComponent size={13} />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                {credential.name}
              </div>
              <div style={{ fontSize: '12.5px', color: credential.color, fontWeight: 700, marginTop: '2px' }}>
                {credential.roleTitle}
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', wordBreak: 'break-all' }}>
                {credential.email}
              </div>
            </div>
          </div>

          {/* PIN Input Section */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}
            >
              <label style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 700 }}>
                Enter Portal Password
              </label>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                Default: <strong style={{ color: credential.color }}>{credential.pin || '1234'}</strong>
              </span>
            </div>

            {/* Input with Toggle */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                transform: isShaking ? 'translateX(6px)' : 'none',
                transition: 'transform 100ms ease'
              }}
            >
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    verifyPin(pin);
                  }
                }}
                placeholder="Enter password..."
                style={{
                  width: '100%',
                  padding: '13px 44px 13px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(5, 14, 34, 0.7)',
                  border: errorMsg
                    ? '1.5px solid #EF4444'
                    : `1.5px solid ${credential.color}66`,
                  color: '#FFFFFF',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#F87171',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginTop: '8px'
                }}
              >
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Keypad */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '9px',
              marginBottom: '20px'
            }}
          >
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0', 'Unlock'].map((key) => {
              const isUnlock = key === 'Unlock';
              const isClear = key === 'Clear';

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (isClear) handleClear();
                    else if (isUnlock) verifyPin(pin);
                    else handleDigit(key);
                  }}
                  disabled={isVerifying}
                  style={{
                    height: '46px',
                    borderRadius: '10px',
                    border: isUnlock
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: isUnlock
                      ? credential.color
                      : isClear
                      ? 'rgba(239, 68, 68, 0.16)'
                      : 'rgba(255, 255, 255, 0.06)',
                    color: isUnlock
                      ? '#FFFFFF'
                      : isClear
                      ? '#FCA5A5'
                      : '#FFFFFF',
                    fontSize: isUnlock || isClear ? '13px' : '17px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                    boxShadow: isUnlock
                      ? `0 4px 14px ${credential.color}55`
                      : 'none'
                  }}
                >
                  {key}
                </button>
              );
            })}
          </div>

          {/* 1-Click Instant Unlock Banner */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={handleQuickUnlock}
              style={{
                width: '100%',
                padding: '13px 18px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${credential.color} 0%, #0284C7 100%)`,
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: `0 8px 24px ${credential.color}44`,
                transition: 'all 150ms ease'
              }}
            >
              <KeyRound size={16} />
              <span>Instant 1-Click Unlock ({credential.name})</span>
              <ArrowRight size={16} />
            </button>

            {/* Navigation options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setCurrentNav('homepage')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#CBD5E1',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Lock size={13} />
                <span>Switch Role</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentNav('homepage')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(213, 160, 33, 0.14)',
                  border: '1px solid rgba(213, 160, 33, 0.35)',
                  color: '#FBBF24',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Home size={13} />
                <span>Homepage</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
