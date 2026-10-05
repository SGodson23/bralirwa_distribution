import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PieChart,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Layers,
  Percent,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export const FinanceProfitLossModule: React.FC = () => {
  const { profitLoss, currentTenant, showToast, setCurrentNav } = useApp();
  const [period, setPeriod] = useState<'this_month' | 'last_month' | 'ytd'>('this_month');

  const brandContributions = [
    { brand: 'Primus', volumeCrates: 4200, revenue: 67200000, cogs: 54600000, margin: 12600000, percent: 18.75, share: 44 },
    { brand: 'Mützig', volumeCrates: 2600, revenue: 50700000, cogs: 39520000, margin: 11180000, percent: 22.05, share: 33 },
    { brand: 'Amstel Malt', volumeCrates: 950, revenue: 16625000, cogs: 13300000, margin: 3325000, percent: 20.0, share: 11 },
    { brand: 'Heineken', volumeCrates: 520, revenue: 15600000, cogs: 12220000, margin: 3380000, percent: 21.67, share: 10 },
    { brand: 'Soft Drinks & Water', volumeCrates: 1100, revenue: 11550000, cogs: 9460000, margin: 2090000, percent: 18.09, share: 2 }
  ];

  const paymentBreakdown = [
    { channel: 'MTN Mobile Money (MoMo)', amount: 92450000, share: 57, color: '#F2A93B' },
    { channel: 'Bank Transfer (BK / BPR)', amount: 48670000, share: 30, color: '#3478F6' },
    { channel: 'Physical Cash Drawer', amount: 14240000, share: 9, color: '#16A36A' },
    { channel: 'Credit Receivables Due', amount: 6315000, share: 4, color: '#E5484D' }
  ];

  return (
    <div style={{ padding: '28px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A36A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Financial Intelligence
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>•</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1' }}>RRA & IFRS Compliant</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Profit & Loss / Commercial Margins
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '4px' }}>
            Audited financial performance for {currentTenant.name} — September 2026
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '8px', padding: '3px' }}>
            {(['this_month', 'last_month', 'ytd'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setPeriod(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: period === t ? '#16A36A' : 'transparent',
                  color: period === t ? '#FFFFFF' : '#94A3B8',
                  transition: 'all 150ms ease'
                }}
              >
                {t === 'this_month' ? 'September 2026' : t === 'last_month' ? 'August 2026' : 'YTD 2026'}
              </button>
            ))}
          </div>

          <button
            onClick={() => showToast('P&L Financial Statement generated & downloaded (PDF)')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              padding: '9px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13.5px',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <Download size={16} />
            Export Statement
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8' }}>Gross Revenue</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#34D399', fontSize: '12px', fontWeight: 700 }}>
              <ArrowUpRight size={15} /> +14.2%
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            RWF {profitLoss.grossRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            9,370 total crates sold across Kigali
          </div>
        </div>

        <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8' }}>Cost of Goods (BRALIRWA)</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>79.9% COGS</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            RWF {profitLoss.costOfGoodsSold.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            Purchased from Gisenyi & Kigali Depots
          </div>
        </div>

        <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8' }}>Gross Margin</span>
            <span style={{ backgroundColor: 'rgba(22, 163, 106, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
              {profitLoss.grossMarginPercent}%
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#34D399' }}>
            RWF {profitLoss.grossProfit.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            RWF 3,475 average gross spread per crate
          </div>
        </div>

        <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8' }}>Net Operating Profit (EBITDA)</span>
            <span style={{ backgroundColor: 'rgba(22, 163, 106, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
              {profitLoss.netMarginPercent}%
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            RWF {profitLoss.netOperatingProfit.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            After RWF {profitLoss.operatingExpenses.totalExpenses.toLocaleString()} OPEX
          </div>
        </div>
      </div>

      {/* Main Grid: Brand Margin Table & OPEX Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left: Brand Profitability Table */}
        <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Brand Margin & Gross Contribution
              </h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '3px 0 0 0' }}>
                Profitability analysis broken down by beverage line
              </p>
            </div>
            <span style={{ fontSize: '12px', backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '4px 10px', borderRadius: '6px', color: '#CBD5E1', fontWeight: 600 }}>
              5 Brands
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#08132A', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#CBD5E1', fontWeight: 600, fontSize: '12.5px' }}>
                <th style={{ padding: '12px 20px' }}>Brand</th>
                <th style={{ padding: '12px 16px' }}>Volume (Crates)</th>
                <th style={{ padding: '12px 16px' }}>Revenue (RWF)</th>
                <th style={{ padding: '12px 16px' }}>Gross Profit</th>
                <th style={{ padding: '12px 16px' }}>Margin %</th>
                <th style={{ padding: '12px 20px' }}>Share of Gross</th>
              </tr>
            </thead>
            <tbody>
              {brandContributions.map((b) => (
                <tr key={b.brand} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: b.brand === 'Primus' ? '#16A36A' : b.brand === 'Mützig' ? '#D5A021' : b.brand === 'Heineken' ? '#17A673' : '#3478F6' }} />
                      {b.brand}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 600 }}>
                    {b.volumeCrates.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#CBD5E1' }}>
                    {b.revenue.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#34D399' }}>
                    {b.margin.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ backgroundColor: b.percent >= 20 ? 'rgba(22, 163, 106, 0.2)' : 'rgba(213, 160, 33, 0.2)', color: b.percent >= 20 ? '#34D399' : '#FDE047', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '12px' }}>
                      {b.percent}%
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${b.share}%`, height: '100%', backgroundColor: '#38BDF8', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', minWidth: '30px' }}>
                        {b.share}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Operating Expenses Summary */}
        <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Operating Cost Structure
            </h3>
            <button
              onClick={() => setCurrentNav('expenses')}
              style={{ fontSize: '12.5px', color: '#34D399', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View Detailed Ledger →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Fleet Fuel (Diesel)', amount: profitLoss.operatingExpenses.fuel, color: '#3478F6' },
              { label: 'Staff Salaries & Field Commissions', amount: profitLoss.operatingExpenses.salaries, color: '#16A36A' },
              { label: 'Vehicle Maintenance & Repairs', amount: profitLoss.operatingExpenses.vehicleMaintenance, color: '#F2A93B' },
              { label: 'Warehouse Rent (Gikondo & Remera)', amount: profitLoss.operatingExpenses.rent, color: '#8B5CF6' },
              { label: 'Electricity & Cold Storage', amount: profitLoss.operatingExpenses.utilities, color: '#06B6D4' },
              { label: 'Fleet Insurance & Contrôle Tech', amount: profitLoss.operatingExpenses.insurance, color: '#EC4899' },
              { label: 'Marketing, POS Signage & Allowances', amount: profitLoss.operatingExpenses.marketing, color: '#D5A021' },
              { label: 'Other Sundry Expenses', amount: profitLoss.operatingExpenses.other, color: '#94A3B8' }
            ].map((item) => {
              const pct = ((item.amount / profitLoss.operatingExpenses.totalExpenses) * 100).toFixed(1);
              return (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ color: '#CBD5E1', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: '#FFFFFF' }}>
                      RWF {item.amount.toLocaleString()} <span style={{ color: '#94A3B8', fontWeight: 400 }}>({pct}%)</span>
                    </span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: item.color, borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Total Monthly OPEX</span>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#F87171' }}>
              RWF {profitLoss.operatingExpenses.totalExpenses.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Cash Collections Channels */}
      <div style={{ backgroundColor: '#0B1733', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '22px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
          Revenue Settlement by Inflow Channel
        </h3>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '18px' }}>
          MTN MoMo is the dominant settlement channel across Kigali bars, followed by BK transfers
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {paymentBreakdown.map((ch) => (
            <div key={ch.channel} style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: ch.color }} />
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#CBD5E1' }}>{ch.channel}</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                RWF {ch.amount.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: ch.color, marginTop: '4px' }}>
                {ch.share}% of total collections
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
