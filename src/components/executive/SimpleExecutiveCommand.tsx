import React, { useState } from 'react';
import {
  TrendingUp,
  Boxes,
  FileText,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Truck,
  RotateCcw,
  Building,
  DollarSign,
  ChevronRight,
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export interface SimpleExecutiveCommandProps {
  userName?: string;
  depotName?: string;
  dateStr?: string;
  salesToday?: string;
  salesGrowth?: string;
  profitAmount?: string;
  profitPeriod?: string;
  cashAmount?: string;
  cashPeriod?: string;
  debtAmount?: string;
  debtOverdue?: string;
  stockHealthyCount?: number;
  stockLowCount?: number;
  stockCriticalCount?: number;
  deliveriesCompletedCount?: number;
  deliveriesInTransitCount?: number;
  deliveriesFailedCount?: number;
  cratesOutsideCount?: number;
  cratesAtRiskValue?: string;
  pendingApprovalsCount?: number;
  onViewReports: () => void;
  onViewApprovals: () => void;
  onViewInventory: () => void;
  onAttentionClick?: (type: 'primus' | 'debt' | 'crates') => void;
}

export const SimpleExecutiveCommand: React.FC<SimpleExecutiveCommandProps> = ({
  userName = 'Emmanuel',
  depotName = 'ABC Distribution Depot',
  dateStr = 'October 1, 2026',
  salesToday = 'RWF 18.4M',
  salesGrowth = '+8.2%',
  profitAmount = 'RWF 32.8M',
  profitPeriod = 'This month',
  cashAmount = 'RWF 14.7M',
  cashPeriod = 'Today',
  debtAmount = 'RWF 11.2M',
  debtOverdue = '3.1M overdue',
  stockHealthyCount = 18,
  stockLowCount = 4,
  stockCriticalCount = 2,
  deliveriesCompletedCount = 76,
  deliveriesInTransitCount = 8,
  deliveriesFailedCount = 2,
  cratesOutsideCount = 486,
  cratesAtRiskValue = 'RWF 7.2M at Risk',
  pendingApprovalsCount = 3,
  onViewReports,
  onViewApprovals,
  onViewInventory,
  onAttentionClick
}) => {
  const [chartRange, setChartRange] = useState<'7' | '30'>('7');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [detailModal, setDetailModal] = useState<'primus' | 'debt' | 'crates' | null>(null);

  // 7-Day Chart Data (ending Oct 1, 2026)
  const chartData7Days = [
    { day: 'Thu 25', date: 'Sep 25', revenueM: 14.8, crates: 980 },
    { day: 'Fri 26', date: 'Sep 26', revenueM: 17.2, crates: 1140 },
    { day: 'Sat 27', date: 'Sep 27', revenueM: 19.4, crates: 1290 },
    { day: 'Sun 28', date: 'Sep 28', revenueM: 12.1, crates: 810 },
    { day: 'Mon 29', date: 'Sep 29', revenueM: 16.5, crates: 1090 },
    { day: 'Tue 30', date: 'Sep 30', revenueM: 16.9, crates: 1120 },
    { day: 'Today', date: 'Oct 01', revenueM: 18.4, crates: 1220, isCurrent: true }
  ];

  // 30-Day Aggregated Data (4 Weeks + Current)
  const chartData30Days = [
    { day: 'Week 1', date: 'Sep 01 - 07', revenueM: 112.4, crates: 7450 },
    { day: 'Week 2', date: 'Sep 08 - 14', revenueM: 124.6, crates: 8260 },
    { day: 'Week 3', date: 'Sep 15 - 21', revenueM: 118.2, crates: 7830 },
    { day: 'Week 4', date: 'Sep 22 - 28', revenueM: 128.8, crates: 8540 },
    { day: 'Current', date: 'Sep 29 - Oct 01', revenueM: 51.8, crates: 3430, isCurrent: true }
  ];

  const currentChartData = chartRange === '7' ? chartData7Days : chartData30Days;
  const maxRevenue = Math.max(...currentChartData.map((d) => d.revenueM));

  // Render financial metrics using system display font (Manrope) & UI font (Inter)
  const renderMetricValue = (val: string, color: string = '#FFFFFF') => {
    const isRwf = val.startsWith('RWF ');
    const prefix = isRwf ? 'RWF' : '';
    const numPart = isRwf ? val.slice(4) : val;

    return (
      <div
        className="tabular-nums font-display"
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '5px',
          margin: '5px 0 3px'
        }}
      >
        {prefix && (
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#94A3B8',
              fontFamily: "var(--font-ui), 'Inter', sans-serif"
            }}
          >
            {prefix}
          </span>
        )}
        <span
          style={{
            fontSize: '27px',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: color,
            fontFamily: "var(--font-display), 'Manrope', -apple-system, sans-serif",
            lineHeight: 1.15
          }}
        >
          {numPart}
        </span>
      </div>
    );
  };

  const handleAttentionSelect = (type: 'primus' | 'debt' | 'crates') => {
    setDetailModal(type);
    if (onAttentionClick) {
      onAttentionClick(type);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#08142A',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        color: '#FFFFFF',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          HEADER ROW: Greeting, Depot & Date
          ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Good morning, {userName}
          </h1>
          <div
            style={{
              fontSize: '13px',
              color: '#94A3B8',
              fontWeight: 500,
              marginTop: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Building size={13} color="#D5A021" />
            <span>{depotName}</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '7px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#E2E8F0'
          }}
        >
          <Calendar size={14} color="#38BDF8" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 1: FOUR KEY METRIC TILES (SALES TODAY, PROFIT, CASH, DEBT)
          ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* SALES TODAY */}
        <div
          style={{
            padding: '18px 24px',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94A3B8',
              fontFamily: "var(--font-ui), 'Inter', sans-serif"
            }}
          >
            SALES TODAY
          </span>
          {renderMetricValue(salesToday, '#FFFFFF')}
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: 700,
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: "var(--font-ui), 'Inter', sans-serif"
            }}
          >
            <ArrowUpRight size={14} />
            <span className="tabular-nums">{salesGrowth}</span>
          </div>
        </div>

        {/* PROFIT */}
        <div
          style={{
            padding: '18px 24px',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94A3B8',
              fontFamily: "var(--font-ui), 'Inter', sans-serif"
            }}
          >
            PROFIT
          </span>
          {renderMetricValue(profitAmount, '#FFFFFF')}
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: 500,
              color: '#94A3B8',
              fontFamily: "var(--font-ui), 'Inter', sans-serif"
            }}
          >
            {profitPeriod}
          </div>
        </div>

        {/* CASH */}
        <div
          style={{
            padding: '18px 24px',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94A3B8',
              fontFamily: "var(--font-ui), 'Inter', sans-serif"
            }}
          >
            CASH
          </span>
          {renderMetricValue(cashAmount, '#10B981')}
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: 500,
              color: '#94A3B8',
              fontFamily: "var(--font-ui), 'Inter', sans-serif"
            }}
          >
            {cashPeriod}
          </div>
        </div>

        {/* DEBT */}
        <div
          style={{
            padding: '18px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94A3B8',
              fontFamily: "var(--font-ui), 'Inter', sans-serif"
            }}
          >
            DEBT
          </span>
          {renderMetricValue(debtAmount, '#FFFFFF')}
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#F87171',
              fontFamily: "var(--font-ui), 'Inter', sans-serif"
            }}
          >
            <span className="tabular-nums">{debtOverdue}</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 2: SALES TREND (Simple 7 / 30 day chart)
          ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '22px 24px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#94A3B8'
              }}
            >
              SALES TREND
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
              Simple 7 / 30 day chart
            </div>
          </div>

          {/* Clean 7 / 30 Toggle */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <button
              onClick={() => setChartRange('7')}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: chartRange === '7' ? 700 : 500,
                backgroundColor: chartRange === '7' ? '#16A36A' : 'transparent',
                color: chartRange === '7' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              7 Days
            </button>
            <button
              onClick={() => setChartRange('30')}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: chartRange === '30' ? 700 : 500,
                backgroundColor: chartRange === '30' ? '#16A36A' : 'transparent',
                color: chartRange === '30' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Minimalist Visual Bar Chart */}
        <div
          style={{
            height: '140px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: chartRange === '7' ? '18px' : '14px',
            paddingTop: '16px'
          }}
        >
          {currentChartData.map((item, idx) => {
            const heightPercent = Math.max(18, Math.round((item.revenueM / maxRevenue) * 100));
            const isHovered = hoveredBarIndex === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {/* Value Above Bar */}
                <span
                  className="tabular-nums font-display"
                  style={{
                    fontSize: '11px',
                    fontWeight: item.isCurrent || isHovered ? 800 : 600,
                    color: item.isCurrent ? '#34D399' : isHovered ? '#FFFFFF' : '#94A3B8',
                    fontFamily: "var(--font-display), 'Manrope', sans-serif",
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    transform: isHovered ? 'scale(1.08)' : 'none',
                    transition: 'all 120ms ease'
                  }}
                >
                  {chartRange === '7' ? `${item.revenueM}M` : `${item.revenueM}M`}
                </span>

                {/* The Bar */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: chartRange === '7' ? '48px' : '64px',
                    height: `${heightPercent}px`,
                    background: item.isCurrent
                      ? 'linear-gradient(180deg, #10B981 0%, #047857 100%)'
                      : isHovered
                      ? 'linear-gradient(180deg, #38BDF8 0%, #0369A1 100%)'
                      : 'linear-gradient(180deg, #2563EB 0%, #1E3A8A 100%)',
                    borderRadius: '5px 5px 2px 2px',
                    boxShadow: item.isCurrent
                      ? '0 0 14px rgba(16, 185, 129, 0.45)'
                      : isHovered
                      ? '0 0 10px rgba(56, 189, 248, 0.35)'
                      : 'none',
                    transition: 'all 150ms ease'
                  }}
                />

                {/* Day Label */}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: item.isCurrent ? 700 : 500,
                    color: item.isCurrent ? '#FFFFFF' : '#64748B',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.day}
                </span>

                {/* Hover Tooltip Popup */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      marginBottom: '8px',
                      backgroundColor: '#050E22',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      padding: '5px 9px',
                      borderRadius: '6px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                      fontSize: '11px',
                      zIndex: 10,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{ color: '#FFFFFF', fontWeight: 700 }}>
                      {item.date}: RWF {item.revenueM}M
                    </div>
                    <div style={{ color: '#94A3B8' }}>{item.crates.toLocaleString()} crates</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 3: THREE OPERATIONAL STATUS PANELS (STOCK, DELIVERIES, CRATES)
          ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* STOCK HEALTH */}
        <div
          style={{
            padding: '18px 24px',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94A3B8',
              marginBottom: '12px'
            }}
          >
            STOCK HEALTH
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 6px #10B981'
                }}
              />
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{stockHealthyCount} Healthy</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  boxShadow: '0 0 6px #F59E0B'
                }}
              />
              <span style={{ color: '#FDE68A', fontWeight: 600 }}>{stockLowCount} Low</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  boxShadow: '0 0 6px #EF4444'
                }}
              />
              <span style={{ color: '#FCA5A5', fontWeight: 600 }}>{stockCriticalCount} Critical</span>
            </div>
          </div>
        </div>

        {/* DELIVERIES */}
        <div
          style={{
            padding: '18px 24px',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94A3B8',
              marginBottom: '12px'
            }}
          >
            DELIVERIES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 6px #10B981'
                }}
              />
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{deliveriesCompletedCount} Completed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#38BDF8',
                  boxShadow: '0 0 6px #38BDF8'
                }}
              />
              <span style={{ color: '#BAE6FD', fontWeight: 600 }}>{deliveriesInTransitCount} In Transit</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  boxShadow: '0 0 6px #EF4444'
                }}
              />
              <span style={{ color: '#FCA5A5', fontWeight: 600 }}>{deliveriesFailedCount} Failed</span>
            </div>
          </div>
        </div>

        {/* CRATES */}
        <div
          style={{
            padding: '18px 24px'
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94A3B8',
              marginBottom: '12px'
            }}
          >
            CRATES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#E2E8F0'
                }}
              />
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{cratesOutsideCount} Outside</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#F87171',
                  boxShadow: '0 0 6px #F87171'
                }}
              />
              <span style={{ color: '#F87171', fontWeight: 600 }}>{cratesAtRiskValue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 4: ATTENTION REQUIRED & QUICK ACTIONS
          ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
        }}
      >
        {/* ATTENTION REQUIRED */}
        <div
          style={{
            padding: '20px 24px',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94A3B8',
              marginBottom: '12px'
            }}
          >
            ATTENTION REQUIRED
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => handleAttentionSelect('primus')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#FCA5A5',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 120ms ease'
              }}
            >
              <span>• Primus low stock</span>
              <span style={{ fontSize: '11px', color: '#F87171', opacity: 0.8 }}>Action →</span>
            </button>

            <button
              onClick={() => handleAttentionSelect('debt')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#FDE68A',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 120ms ease'
              }}
            >
              <span>• RWF 3.2M overdue</span>
              <span style={{ fontSize: '11px', color: '#FBBF24', opacity: 0.8 }}>Action →</span>
            </button>

            <button
              onClick={() => handleAttentionSelect('crates')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#BAE6FD',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 120ms ease'
              }}
            >
              <span>• 76 crates overdue</span>
              <span style={{ fontSize: '11px', color: '#38BDF8', opacity: 0.8 }}>Action →</span>
            </button>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94A3B8',
              marginBottom: '12px'
            }}
          >
            QUICK ACTIONS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* View Reports */}
            <button
              onClick={onViewReports}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 120ms ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={15} color="#38BDF8" />
                <span>View Reports</span>
              </div>
              <ChevronRight size={14} color="#64748B" />
            </button>

            {/* Approvals */}
            <button
              onClick={onViewApprovals}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 120ms ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} color="#10B981" />
                <span>Approvals</span>
              </div>
              {pendingApprovalsCount > 0 && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    backgroundColor: '#D5A021',
                    color: '#FFFFFF'
                  }}
                >
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            {/* View Inventory */}
            <button
              onClick={onViewInventory}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 120ms ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Boxes size={15} color="#FBBF24" />
                <span>View Inventory</span>
              </div>
              <ChevronRight size={14} color="#64748B" />
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE ATTENTION MODAL / ACTION POPUP
          ───────────────────────────────────────────────────────────── */}
      {detailModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px'
          }}
          onClick={() => setDetailModal(null)}
        >
          <div
            style={{
              backgroundColor: '#0A1C3E',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              padding: '22px 24px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              color: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle
                  size={18}
                  color={detailModal === 'primus' ? '#EF4444' : detailModal === 'debt' ? '#F59E0B' : '#38BDF8'}
                />
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                  {detailModal === 'primus' && 'Low Stock Alert: Primus 50CL RGB'}
                  {detailModal === 'debt' && 'Overdue Receivables: RWF 3.2M'}
                  {detailModal === 'crates' && 'Overdue Crates: 76 Crates Unreturned'}
                </h3>
              </div>
              <button
                onClick={() => setDetailModal(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {detailModal === 'primus' && (
              <div>
                <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 14px' }}>
                  Primus 50CL RGB stock level has dropped to <strong>1.8 days cover</strong> at Gikondo Hub (180 crates
                  remaining). Run-rate indicates risk of stockout before Friday evening.
                </p>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '12px'
                  }}
                >
                  <div>• Suggested Order: <strong>600 crates (PO-2026-0883)</strong></div>
                  <div>• Supplier: Bralirwa Plc - Gisenyi Brewery</div>
                  <div>• Est. Cost: RWF 8,520,000</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setDetailModal(null)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#E2E8F0',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => {
                      setDetailModal(null);
                      onViewInventory();
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#16A36A',
                      border: 'none',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    View in Inventory
                  </button>
                </div>
              </div>
            )}

            {detailModal === 'debt' && (
              <div>
                <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 14px' }}>
                  <strong>Envy Club Kimihurura</strong> has RWF 3,120,000 in the 60+ days aging bucket (Credit limit: RWF
                  4.0M). Last partial payment received 19 days ago.
                </p>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '12px'
                  }}
                >
                  <div>• Account: Envy Club Kimihurura (ACC-1082)</div>
                  <div>• Account Manager: Jean-Claude Uwizeye</div>
                  <div>• Recommended: Lock delivery dispatches until 50% settlement</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setDetailModal(null)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#E2E8F0',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => {
                      setDetailModal(null);
                      onViewReports();
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#D5A021',
                      border: 'none',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Review Debt Aging
                  </button>
                </div>
              </div>
            )}

            {detailModal === 'crates' && (
              <div>
                <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 14px' }}>
                  76 crates of empty glass bottles have remained unreturned for over 14 days at <strong>Papyrus Bar</strong>{' '}
                  and 2 secondary retail spots in Gikondo sector.
                </p>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '12px'
                  }}
                >
                  <div>• Crate Value at Risk: RWF 304,000 (RWF 4,000 / crate)</div>
                  <div>• Recovery Route: Route 02 (Driver: Eric Mugabo)</div>
                  <div>• Status: Assigned for morning truck sweep</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setDetailModal(null)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#E2E8F0',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
