import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Sparkles,
  AlertTriangle,
  ShoppingCart,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Truck,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const DemandForecastModule: React.FC = () => {
  const { demandForecast, convertForecastToPO, showToast, setCurrentNav } = useApp();
  const [selectedEventMultiplier, setSelectedEventMultiplier] = useState<'normal' | 'weekend_derby' | 'festive'>('weekend_derby');
  const [selectedSkuFilter, setSelectedSkuFilter] = useState<string>('all');

  const filteredForecast = demandForecast.filter((item) => {
    if (selectedSkuFilter === 'critical') return item.shortageRisk === 'CRITICAL' || item.shortageRisk === 'HIGH';
    if (selectedSkuFilter === 'all') return true;
    return item.brand.toLowerCase() === selectedSkuFilter.toLowerCase();
  });

  const criticalItems = demandForecast.filter((i) => i.shortageRisk === 'CRITICAL' || i.shortageRisk === 'HIGH');
  const totalRecommendedPO = demandForecast.reduce((sum, i) => sum + i.recommendedReorderCrates, 0);

  const handleConvertAllToPO = () => {
    const items = criticalItems.map((item) => ({
      productId: item.productId,
      crates: item.recommendedReorderCrates
    }));

    convertForecastToPO(items);
    showToast(`Generated BRALIRWA Purchase Order for ${items.reduce((s, i) => s + i.crates, 0).toLocaleString()} crates`);
    setCurrentNav('purchases');
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Predictive Logistics AI
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>Machine Learning Demand Model</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            AI Demand Forecasting & Replenishment
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '6px' }}>
            Multi-factor predictive model combining bar sales velocity, Kigali events calendar, and Gisenyi factory lead time
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleConvertAllToPO}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '11px 20px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <ShoppingCart size={16} />
            Generate Replenishment PO ({totalRecommendedPO.toLocaleString()} Crates)
          </button>
        </div>
      </div>

      {/* AI Scenario Selector Banner */}
      <div
        className="glass-card"
        style={{
          padding: '22px 26px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          background: 'linear-gradient(135deg, rgba(8, 26, 60, 0.85) 0%, rgba(5, 14, 34, 0.9) 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: 'rgba(56, 189, 248, 0.18)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={24} color="#38BDF8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Kigali Seasonal & Event Demand Driver
              </h3>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(56, 189, 248, 0.2)',
                  color: '#38BDF8',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(56, 189, 248, 0.4)'
                }}
              >
                Rayon Sports vs APR Derby
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
              Dynamic surge forecasting: +40% Primus draught consumption in Remera & Kisimenti corridors
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'rgba(5, 14, 34, 0.7)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {[
            { id: 'normal', label: 'Normal Baseline' },
            { id: 'weekend_derby', label: '🏟️ Derby Weekend (+35%)' },
            { id: 'festive', label: '🎉 End-of-Year Festive (+60%)' }
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedEventMultiplier(sc.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: selectedEventMultiplier === sc.id ? '#38BDF8' : 'transparent',
                color: selectedEventMultiplier === sc.id ? '#050E22' : '#CBD5E1',
                transition: 'all 150ms ease'
              }}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Products at Shortage Risk
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FB7185' }} className="tabular-nums font-display">
            {criticalItems.length} SKUs
          </div>
          <div style={{ fontSize: '12px', color: '#FB7185', fontWeight: 700, marginTop: '8px' }}>
            Primus 50cl & Mützig 33cl running low
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            7-Day Projected Demand
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF' }} className="tabular-nums font-display">
            {demandForecast.reduce((s, i) => s + i.predicted7DayDemand, 0).toLocaleString()} Crates
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
            Combined across all 12 key SKUs
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Replenishment Order Recommended
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#34D399' }} className="tabular-nums font-display">
            {totalRecommendedPO.toLocaleString()} Crates
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 700, marginTop: '8px' }}>
            2 Full 8-Ton Fuso truckloads
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Lead Time from Gisenyi Brewery
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8' }} className="tabular-nums font-display">
            24 - 36 Hours
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
            Via Kigali depot cross-docking
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All SKUs' },
          { id: 'critical', label: '⚠️ High Risk Only' },
          { id: 'Primus', label: 'Primus' },
          { id: 'Mützig', label: 'Mützig' },
          { id: 'Amstel', label: 'Amstel' },
          { id: 'Heineken', label: 'Heineken' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedSkuFilter(tab.id)}
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              border: selectedSkuFilter === tab.id ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: selectedSkuFilter === tab.id ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.06)',
              color: selectedSkuFilter === tab.id ? '#38BDF8' : '#CBD5E1',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Forecast Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {filteredForecast.map((item) => (
          <div
            key={item.productId}
            className="glass-card"
            style={{
              padding: '24px',
              border: item.shortageRisk === 'CRITICAL' ? '2px solid rgba(239, 68, 68, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: item.shortageRisk === 'CRITICAL' ? '0 8px 30px rgba(239, 68, 68, 0.25)' : '0 6px 20px rgba(0, 0, 0, 0.35)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    backgroundColor:
                      item.shortageRisk === 'CRITICAL'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : item.shortageRisk === 'HIGH'
                        ? 'rgba(245, 158, 11, 0.2)'
                        : 'rgba(16, 185, 129, 0.2)',
                    color:
                      item.shortageRisk === 'CRITICAL'
                        ? '#FB7185'
                        : item.shortageRisk === 'HIGH'
                        ? '#FBBF24'
                        : '#34D399',
                    border: `1px solid ${
                      item.shortageRisk === 'CRITICAL'
                        ? 'rgba(239, 68, 68, 0.45)'
                        : item.shortageRisk === 'HIGH'
                        ? 'rgba(245, 158, 11, 0.45)'
                        : 'rgba(16, 185, 129, 0.45)'
                    }`
                  }}
                >
                  {item.shortageRisk} SHORTAGE RISK
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {item.productName}
                </h3>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '3px' }}>
                  Brand: <strong style={{ color: '#FFFFFF' }}>{item.brand}</strong> • Daily Velocity: <strong style={{ color: '#38BDF8' }}>{item.dailyRunRate} crates/day</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Stock Run-Out</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: item.urgencyDaysLeft < 3 ? '#FB7185' : '#FFFFFF' }}>
                  {item.urgencyDaysLeft} Days
                </div>
              </div>
            </div>

            {/* Run Rate vs Current Stock Comparison Bars */}
            <div
              style={{
                backgroundColor: 'rgba(5, 14, 34, 0.65)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Current Warehouse Stock:</span>
                <strong style={{ color: '#FFFFFF' }}>{item.currentStockCrates} Crates</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Predicted 7-Day Demand:</span>
                <strong style={{ color: '#38BDF8' }}>{item.predicted7DayDemand} Crates</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '8px', borderTop: '1px dashed rgba(255, 255, 255, 0.15)' }}>
                <span style={{ fontWeight: 800, color: '#FFFFFF' }}>Recommended PO Quantity:</span>
                <strong style={{ color: '#34D399', fontSize: '15px' }} className="tabular-nums font-display">
                  +{item.recommendedReorderCrates} Crates
                </strong>
              </div>
            </div>

            {/* AI Reasoning Note */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '12.5px',
                color: '#BAE6FD',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                padding: '12px 14px',
                borderRadius: '10px',
                marginBottom: '18px'
              }}
            >
              <Lightbulb size={16} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{item.reasoning}</div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                convertForecastToPO([{ productId: item.productId, crates: item.recommendedReorderCrates }]);
                showToast(`Added ${item.recommendedReorderCrates} crates of ${item.productName} to BRALIRWA PO draft`);
                setCurrentNav('purchases');
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                color: '#34D399',
                fontWeight: 800,
                fontSize: '13.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              Order {item.recommendedReorderCrates} Crates Now →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
