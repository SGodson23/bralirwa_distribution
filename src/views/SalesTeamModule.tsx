import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Award,
  TrendingUp,
  Target,
  Phone,
  MapPin,
  CheckCircle2,
  Calendar,
  DollarSign,
  RotateCcw,
  Sparkles,
  Search,
  Plus
} from 'lucide-react';

export const SalesTeamModule: React.FC = () => {
  const { salespeople, showToast, setCurrentNav } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepId, setSelectedRepId] = useState<string>(salespeople[0]?.id || '');

  const filteredSalespeople = salespeople.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.territory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMonthlyTarget = salespeople.reduce((sum, s) => sum + s.monthlyTargetRWF, 0);
  const totalActualRevenue = salespeople.reduce((sum, s) => sum + s.actualRevenueRWF, 0);
  const totalCollections = salespeople.reduce((sum, s) => sum + s.collectionsRWF, 0);
  const averageAchievement = ((totalActualRevenue / totalMonthlyTarget) * 100).toFixed(1);

  const selectedRep = salespeople.find((s) => s.id === selectedRepId) || salespeople[0];

  return (
    <div style={{ padding: '28px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Commercial Force
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>Field Sales & Route Targets</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            Sales Team & Route Performance
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '6px' }}>
            Monitor route achievements, retailer visit compliance, and commission payouts across Kigali
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => showToast('Sales route incentives calculated for 4 representatives')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(213, 160, 33, 0.15)',
              border: '1px solid rgba(213, 160, 33, 0.35)',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13.5px',
              color: '#FBBF24',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Award size={16} color="#FBBF24" />
            Calculate Commission
          </button>

          <button
            onClick={() => setCurrentNav('quick_order')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={16} />
            Book Rep Order
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Combined Revenue Target
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF' }} className="tabular-nums font-display">
            RWF {(totalMonthlyTarget / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
            September 2026 Quota
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Actual Revenue Booked
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#34D399' }} className="tabular-nums font-display">
            RWF {(totalActualRevenue / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 700, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <TrendingUp size={13} />
            {averageAchievement}% team attainment
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Total Collections Collected
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8' }} className="tabular-nums font-display">
            RWF {(totalCollections / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
            MoMo & Cash collected by reps
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Active Field Sales Reps
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF' }} className="tabular-nums font-display">
            {salespeople.length} Reps
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle2 size={13} />
            100% active on Kigali routes
          </div>
        </div>
      </div>

      {/* Main Split: Rep Leaderboard & Detailed Rep Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr', gap: '24px' }}>
        {/* Left: Leaderboard & Performance list */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Territory Representatives
            </h3>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Ranked by Attainment</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredSalespeople.map((rep, index) => {
              const isSelected = rep.id === selectedRep?.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedRepId(rep.id)}
                  style={{
                    padding: '18px 22px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                    borderLeft: isSelected ? '4px solid #10B981' : '4px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          backgroundColor: index === 0 ? 'rgba(213, 160, 33, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                          color: index === 0 ? '#FBBF24' : '#CBD5E1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '13px',
                          border: index === 0 ? '1px solid rgba(213, 160, 33, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        {index === 0 ? '★' : index + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '14.5px' }}>{rep.name}</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={12} color="#38BDF8" /> {rep.territory}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: rep.achievementPercentage >= 90 ? '#34D399' : '#FBBF24' }}>
                        {rep.achievementPercentage}%
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                        RWF {(rep.actualRevenueRWF / 1000000).toFixed(1)}M / {(rep.monthlyTargetRWF / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(rep.achievementPercentage, 100)}%`,
                        height: '100%',
                        background: rep.achievementPercentage >= 90 ? 'linear-gradient(90deg, #10B981, #34D399)' : 'linear-gradient(90deg, #D5A021, #FBBF24)',
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Rep Deep Dive */}
        {selectedRep && (
          <div className="glass-card" style={{ padding: '26px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '22px',
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Users size={24} color="#34D399" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>{selectedRep.name}</h2>
                    <p style={{ fontSize: '13px', color: '#94A3B8', margin: '3px 0 0 0' }}>Senior Sales Representative • {selectedRep.territory}</p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: 'rgba(16, 185, 129, 0.18)',
                    color: '#34D399',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800
                  }}
                >
                  <CheckCircle2 size={14} /> Active on Route
                </span>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
                  {selectedRep.phone}
                </div>
              </div>
            </div>

            {/* Performance Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '22px' }}>
              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>Actual Revenue vs Target</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }} className="tabular-nums font-display">
                  RWF {selectedRep.actualRevenueRWF.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 700, marginTop: '3px' }}>
                  {selectedRep.achievementPercentage}% of RWF {selectedRep.monthlyTargetRWF.toLocaleString()}
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>Customer Portfolio</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }} className="tabular-nums font-display">
                  {selectedRep.activeCustomers} Active Retailers
                </div>
                <div style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 600, marginTop: '3px' }}>
                  +{selectedRep.newCustomersThisMonth} new accounts this month
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>Cash & MoMo Collected</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#34D399' }} className="tabular-nums font-display">
                  RWF {selectedRep.collectionsRWF.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>
                  Zero unreconciled balance today
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>Empty Crates Outstanding</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#FB7185' }} className="tabular-nums font-display">
                  {selectedRep.cratesOwedByPortfolio} Crates
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>
                  Held across {selectedRep.territory} bars
                </div>
              </div>
            </div>

            {/* Route Schedule for Selected Rep */}
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
              Weekly Route Visitation Schedule
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { day: 'Monday', sector: 'Remera - Kisimenti Commercial Strip', bars: '18 Bars', status: 'Completed' },
                { day: 'Tuesday', sector: 'Gikondo & Kagarama Centers', bars: '14 Bars', status: 'Completed' },
                { day: 'Wednesday', sector: 'Kimironko Market & Prison road', bars: '22 Bars', status: 'Today (In Progress)' },
                { day: 'Thursday', sector: 'Kacyiru & Boulevard de l Umuganda', bars: '12 Hotels & Lounges', status: 'Scheduled' },
                { day: 'Friday', sector: 'Nyarugenge Downtown & Biryogo', bars: '25 Bars & Restaurants', status: 'Scheduled' }
              ].map((route) => (
                <div
                  key={route.day}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: route.status.includes('Today') ? 'rgba(213, 160, 33, 0.12)' : 'rgba(5, 14, 34, 0.6)',
                    border: route.status.includes('Today') ? '1px solid rgba(213, 160, 33, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '13px', marginRight: '8px' }}>{route.day}:</span>
                    <span style={{ color: '#CBD5E1', fontSize: '13px' }}>{route.sector}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>{route.bars}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: route.status === 'Completed' ? 'rgba(16, 185, 129, 0.18)' : route.status.includes('Today') ? 'rgba(213, 160, 33, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        color: route.status === 'Completed' ? '#34D399' : route.status.includes('Today') ? '#FBBF24' : '#94A3B8',
                        border: `1px solid ${route.status === 'Completed' ? 'rgba(16, 185, 129, 0.35)' : route.status.includes('Today') ? 'rgba(213, 160, 33, 0.45)' : 'rgba(255, 255, 255, 0.1)'}`
                      }}
                    >
                      {route.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
