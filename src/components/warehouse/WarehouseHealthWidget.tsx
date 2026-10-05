import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Boxes,
  DollarSign,
  CheckCircle2,
  PackageX,
  Truck,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  Clock,
  Flame,
  ArrowRightLeft,
  PenSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface WarehouseHealthWidgetProps {
  status?: 'GOOD' | 'FAIR' | 'CRITICAL';
  stockValueText?: string;
  stockValueRWF?: number;
  lowStockText?: string;
  lowStockCount?: number;
  lowStockProducts?: string;
  lossDamageText?: string;
  lossDamageRWF?: number;
  lossDamageDetails?: string;
  stockAccuracyText?: string;
  stockAccuracyPercent?: number;
  stockAccuracyDetails?: string;
  alertText?: string;
  alertProductCrates?: number;
  alertDailyVelocity?: number;
  alertRunwayDays?: number;
  alertBufferDays?: number;
  depotBayFillText?: string;
  lastEditedText?: string;
  onViewWarehouse?: () => void;
  maxWidth?: string | number;
  onQuickPO?: () => void;
  onLogBreakage?: () => void;
  onCycleCount?: () => void;
  onEditTelemetry?: () => void;
}

export const WarehouseHealthWidget: React.FC<WarehouseHealthWidgetProps> = ({
  status = 'GOOD',
  stockValueText,
  stockValueRWF,
  lowStockText,
  lowStockCount,
  lowStockProducts,
  lossDamageText,
  lossDamageRWF,
  lossDamageDetails,
  stockAccuracyText,
  stockAccuracyPercent,
  stockAccuracyDetails,
  alertText = 'Primus may run out in 1.8 days',
  alertProductCrates,
  alertDailyVelocity,
  alertRunwayDays,
  alertBufferDays,
  depotBayFillText,
  lastEditedText,
  onViewWarehouse,
  maxWidth = '100%',
  onQuickPO,
  onLogBreakage,
  onCycleCount,
  onEditTelemetry
}) => {
  const { setCurrentNav } = useApp();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Formatted display values matching user's requested specification:
  // Stock Value -> RWF 96.4M
  // Low Stock -> 4 products
  // Loss / Damage -> RWF 320K
  // Stock Accuracy -> 98.7%
  const displayStockValue =
    stockValueText ||
    (stockValueRWF !== undefined ? `RWF ${(stockValueRWF / 1000000).toFixed(1)}M` : 'RWF 96.4M');

  const displayLowStock =
    lowStockText ||
    (lowStockCount !== undefined ? `${lowStockCount} products` : '4 products');

  const displayLossDamage =
    lossDamageText ||
    (lossDamageRWF !== undefined ? `RWF ${(lossDamageRWF / 1000).toFixed(0)}K` : 'RWF 320K');

  const displayAccuracy =
    stockAccuracyText ||
    (stockAccuracyPercent !== undefined ? `${stockAccuracyPercent}%` : '98.7%');

  const handleNavigateWarehouse = () => {
    if (onViewWarehouse) {
      onViewWarehouse();
    } else {
      setCurrentNav('inventory');
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: maxWidth,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP EXECUTIVE TELEMETRY COMMAND MATRIX
          Warehouse Health: GOOD
          Stock Value: RWF 96.4M
          Low Stock: 4 products
          Loss / Damage: RWF 320K
          Stock Accuracy: 98.7%
          ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #091938 0%, #061229 60%, #040D1E 100%)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '24px',
          boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Ambient background glows */}
        <div
          style={{
            position: 'absolute',
            top: '-70px',
            right: '-50px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '12%',
            width: '320px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Section Header */}
        <div
          style={{
            padding: '20px 26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            gap: '16px',
            position: 'relative',
            zIndex: 2
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Glowing Icon */}
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(22, 163, 106, 0.35) 0%, rgba(15, 104, 68, 0.2) 100%)',
                border: '1px solid rgba(52, 211, 153, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                flexShrink: 0
              }}
            >
              <Activity size={24} color="#34D399" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1
                  style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: 0,
                    letterSpacing: '-0.02em',
                    fontFamily: "var(--font-display), 'Manrope', sans-serif"
                  }}
                >
                  Warehouse Health
                </h1>
                {/* Status Pill: GOOD */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    backgroundColor: 'rgba(16, 185, 129, 0.18)',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    boxShadow: '0 0 12px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      boxShadow: '0 0 8px #10B981'
                    }}
                    className="pulse-indicator"
                  />
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 800,
                      color: '#34D399',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {status}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>{depotBayFillText || 'Live Depot Telemetry • Gikondo Central Logistics Hub • 14,820 / 25,000 Crates (79.4% Bay Fill)'}</span>
                {lastEditedText && (
                  <span style={{ color: '#34D399', fontWeight: 600, backgroundColor: 'rgba(22, 163, 106, 0.15)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(22, 163, 106, 0.3)' }}>
                    {lastEditedText}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Header Action: Edit & View Warehouse */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {onEditTelemetry && (
              <button
                onClick={onEditTelemetry}
                style={{
                  backgroundColor: '#16A36A',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 163, 106, 0.4)',
                  transition: 'all 0.18s ease'
                }}
                className="hover-lift"
              >
                <PenSquare size={15} />
                <span>Edit Warehouse Data</span>
              </button>
            )}
            <button
              onClick={handleNavigateWarehouse}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              className="hover-bright"
            >
              <span>View Full Inventory</span>
              <ArrowRight size={15} color="#38BDF8" />
            </button>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div
          style={{
            padding: '22px 26px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* 1. STOCK VALUE */}
          <div
            onMouseEnter={() => setHoveredCard('val')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: hoveredCard === 'val' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${hoveredCard === 'val' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(255, 255, 255, 0.12)'}`,
              borderRadius: '18px',
              padding: '18px 20px',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Stock Value
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <DollarSign size={17} color="#38BDF8" />
              </div>
            </div>

            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                fontFamily: "var(--font-display), 'Manrope', sans-serif",
                margin: '2px 0 6px 0'
              }}
              className="tabular-nums"
            >
              {displayStockValue}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#38BDF8', fontWeight: 600 }}>
              <TrendingUp size={13} />
              <span>+4.8% vs last week (14 lines)</span>
            </div>
          </div>

          {/* 2. LOW STOCK */}
          <div
            onClick={onQuickPO}
            onMouseEnter={() => setHoveredCard('low')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: hoveredCard === 'low' ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${hoveredCard === 'low' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(255, 255, 255, 0.12)'}`,
              borderRadius: '18px',
              padding: '18px 20px',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: onQuickPO ? 'pointer' : 'default',
              position: 'relative'
            }}
            title={onQuickPO ? 'Click to trigger brewery replenishment' : undefined}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Low Stock
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PackageX size={17} color="#FBBF24" />
              </div>
            </div>

            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#FBBF24',
                letterSpacing: '-0.02em',
                fontFamily: "var(--font-display), 'Manrope', sans-serif",
                margin: '2px 0 6px 0'
              }}
              className="tabular-nums"
            >
              {displayLowStock}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#FDE68A', fontWeight: 600 }}>
              <AlertTriangle size={13} />
              <span>{lowStockProducts || 'Primus, Turbo, Vitaló, Fanta'}</span>
            </div>
          </div>

          {/* 3. LOSS / DAMAGE */}
          <div
            onClick={onLogBreakage}
            onMouseEnter={() => setHoveredCard('loss')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: hoveredCard === 'loss' ? 'rgba(239, 68, 68, 0.16)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${hoveredCard === 'loss' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.12)'}`,
              borderRadius: '18px',
              padding: '18px 20px',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: onLogBreakage ? 'pointer' : 'default',
              position: 'relative'
            }}
            title={onLogBreakage ? 'Click to record bottle breakage write-off' : undefined}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Loss / Damage
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AlertTriangle size={17} color="#F87171" />
              </div>
            </div>

            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#F87171',
                letterSpacing: '-0.02em',
                fontFamily: "var(--font-display), 'Manrope', sans-serif",
                margin: '2px 0 6px 0'
              }}
              className="tabular-nums"
            >
              {displayLossDamage}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#FECACA', fontWeight: 600 }}>
              <span>{lossDamageDetails || '24 crates (0.33% breakage rate)'}</span>
            </div>
          </div>

          {/* 4. STOCK ACCURACY */}
          <div
            onClick={onCycleCount}
            onMouseEnter={() => setHoveredCard('acc')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: hoveredCard === 'acc' ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${hoveredCard === 'acc' ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255, 255, 255, 0.12)'}`,
              borderRadius: '18px',
              padding: '18px 20px',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: onCycleCount ? 'pointer' : 'default',
              position: 'relative'
            }}
            title={onCycleCount ? 'Click to reconcile cycle count' : undefined}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Stock Accuracy
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircle2 size={17} color="#34D399" />
              </div>
            </div>

            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#34D399',
                letterSpacing: '-0.02em',
                fontFamily: "var(--font-display), 'Manrope', sans-serif",
                margin: '2px 0 6px 0'
              }}
              className="tabular-nums"
            >
              {displayAccuracy}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#A7F3D0', fontWeight: 600 }}>
              <ShieldCheck size={13} />
              <span>{stockAccuracyDetails || '±14 crates physical audit variance'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SHOW-STOPPING PRIMUS RUNOUT SPOTLIGHT HERO
          "Primus may run out in 1.8 days"
          ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1C1205 0%, #2A1705 50%, #150B02 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          borderRadius: '24px',
          boxShadow: '0 16px 36px -8px rgba(245, 158, 11, 0.25), 0 0 0 1px rgba(245, 158, 11, 0.1)',
          padding: '22px 28px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        {/* Glow ambient background */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '120px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Left Side: Primus Bottle Avatar + Countdown Runway Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flex: '1 1 500px' }}>
          {/* Bottle Pedestal Showcase */}
          <div
            style={{
              width: '90px',
              height: '110px',
              borderRadius: '18px',
              background: 'radial-gradient(circle at 50% 40%, rgba(254, 240, 138, 0.25) 0%, rgba(245, 158, 11, 0.1) 70%)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              flexShrink: 0,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Pulsing indicator */}
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                boxShadow: '0 0 10px #EF4444'
              }}
              className="pulse-indicator"
            />

            <img
              src="/products/primus.png"
              alt="Primus"
              style={{
                height: '92px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4))'
              }}
            />
          </div>

          {/* Text and Runway Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'rgba(239, 68, 68, 0.22)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: '#FCA5A5',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                <Flame size={12} fill="#EF4444" color="#EF4444" />
                <span>CRITICAL DEPLETION</span>
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(245, 158, 11, 0.18)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#FDE68A',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                <Clock size={12} />
                <span>Runway: {alertRunwayDays !== undefined ? `${alertRunwayDays} Days` : '1.8 Days'}</span>
              </span>
            </div>

            {/* Headline */}
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              {alertText}
            </h2>

            {/* Velocity details */}
            <div style={{ fontSize: '13px', color: '#E2E8F0', marginTop: '2px' }}>
              Depot stock at <strong style={{ color: '#FBBF24' }}>{alertProductCrates !== undefined ? `${alertProductCrates.toLocaleString()} crates` : '738 crates'}</strong>. At average sales of{' '}
              <strong style={{ color: '#FFFFFF' }}>{alertDailyVelocity !== undefined ? `${alertDailyVelocity.toLocaleString()} crates/day` : '410 crates/day'}</strong>, on-hand inventory will fully deplete before the weekend rush.
            </div>

            {/* Visual Runway Progress Meter */}
            <div style={{ marginTop: '8px', maxWidth: '420px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#FCD34D', marginBottom: '4px', fontWeight: 600 }}>
                <span>Runway Remaining: {alertRunwayDays !== undefined ? `${alertRunwayDays} Days` : '1.8 Days'}</span>
                <span>Buffer Target: {alertBufferDays !== undefined ? `${alertBufferDays} Days` : '10 Days'}</span>
              </div>
              <div
                style={{
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.max(5, ((alertRunwayDays ?? 1.8) / (alertBufferDays ?? 10)) * 100))}%`,
                    borderRadius: '999px',
                    background: 'linear-gradient(90deg, #DC2626 0%, #F59E0B 100%)',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {onQuickPO && (
            <button
              onClick={onQuickPO}
              style={{
                padding: '12px 22px',
                borderRadius: '999px',
                backgroundColor: '#16A36A',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(22, 163, 106, 0.45)',
                transition: 'all 0.16s ease'
              }}
              title="Generate emergency replenishment purchase order to Bralirwa Brewery"
              className="hover-lift"
            >
              <Truck size={17} />
              <span>Order Stock Now</span>
            </button>
          )}

          <button
            onClick={handleNavigateWarehouse}
            style={{
              padding: '12px 20px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.16s ease'
            }}
            className="hover-bright"
          >
            <span>Review Buffer</span>
            <ArrowRight size={15} color="#38BDF8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseHealthWidget;
