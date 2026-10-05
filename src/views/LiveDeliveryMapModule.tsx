import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Truck,
  Navigation,
  CheckCircle2,
  Clock,
  Phone,
  Fuel,
  Maximize2,
  RefreshCw,
  Layers,
  Compass
} from 'lucide-react';

export const LiveDeliveryMapModule: React.FC = () => {
  const { deliveryRuns, vehicles, setCurrentNav } = useApp();
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState<string>('RAD 245 H');

  const selectedRun =
    deliveryRuns.find((r) => r.truckPlate === selectedVehiclePlate) || deliveryRuns[0];

  const vehicleInfo =
    vehicles.find((v) => v.plateNumber === selectedVehiclePlate) || vehicles[0];

  // Coordinates mapped for visual interactive SVG Kigali map
  // Kigali coordinates ~ lat -1.95, lng 30.06
  const mapPoints = [
    { id: 'wh-gikondo', name: 'Main Hub (Gikondo)', x: 380, y: 310, isHub: true },
    { id: 'stop-1', name: 'Kigali Lounge (Remera)', x: 520, y: 220, completed: true, val: '2.6M' },
    { id: 'stop-2', name: 'Choma House (Sonatubes)', x: 440, y: 280, completed: true, val: '1.4M' },
    { id: 'stop-3', name: 'Envy VIP Club (Gikondo)', x: 360, y: 340, completed: true, val: '414k' },
    { id: 'stop-4', name: 'Papyrus (Kimihurura)', x: 410, y: 230, inProgress: true, val: '1.3M' },
    { id: 'stop-5', name: 'Kiyovu Heights (Kiyovu)', x: 320, y: 200, remaining: true, val: '1.8M' },
    // Route 2 points
    { id: 'stop-6', name: 'Simba Supermarket (CBD)', x: 300, y: 180, completed: true, val: '3.9M' },
    { id: 'stop-7', name: 'Hôtel Mille Collines', x: 290, y: 210, completed: true, val: '2.1M' },
    { id: 'stop-8', name: 'Le Petit Prince (Biryogo)', x: 260, y: 270, inProgress: true, val: '5.9M' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>Live Delivery & Route Fleet Map</h1>
          <p style={{ fontSize: '13px', color: '#CBD5E1' }}>
            Real-time GPS delivery stops, vehicle telemetry, and route progress across Kigali City
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setCurrentNav('driver_mobile')} className="btn btn-secondary" style={{ color: '#16A36A', borderColor: '#A7F3D0' }}>
            <span>Open Driver App View</span>
          </button>
          <button onClick={() => setCurrentNav('fleet')} className="btn btn-secondary">
            <span>Fleet Maintenance</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Telemetry Panel (Section 21) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Interactive Stylized Kigali Map */}
        <div
          className="card"
          style={{
            position: 'relative',
            height: '560px',
            backgroundColor: '#070B14',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '1px solid #1C2B47'
          }}
        >
          {/* Map Top Bar */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              right: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 10
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              {deliveryRuns.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedVehiclePlate(r.truckPlate)}
                  style={{
                    backgroundColor: selectedVehiclePlate === r.truckPlate ? '#16A36A' : 'rgba(11, 18, 32, 0.85)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <Truck size={14} />
                  <span>{r.truckPlate} ({r.driverName.split(' ')[0]})</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(11, 18, 32, 0.8)', padding: '6px 12px', borderRadius: '8px', border: '1px solid #1C2B47' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A36A' }} />
              <span style={{ fontSize: '11.5px', color: '#CBD5E1', fontWeight: 600 }}>GPS LIVE (Kigali Telemetry)</span>
            </div>
          </div>

          {/* SVG Map of Kigali Roads & Delivery Routes */}
          <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 700 500">
            {/* Grid background lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="700" height="500" fill="url(#grid)" />

            {/* Kigali arterial roads representation */}
            <path d="M 120 180 Q 280 190 380 310 T 600 420" fill="none" stroke="#1C2B47" strokeWidth="6" />
            <path d="M 280 120 Q 300 240 380 310 Q 480 260 580 180" fill="none" stroke="#1C2B47" strokeWidth="4" />
            <path d="M 380 310 L 440 280 L 520 220" fill="none" stroke="#16A36A" strokeWidth="4" strokeDasharray="4 2" />
            <path d="M 440 280 L 410 230 L 320 200" fill="none" stroke="#3478F6" strokeWidth="3" strokeDasharray="6 3" />

            {/* Sector Boundary Labels */}
            <text x="270" y="150" fill="#64748B" fontSize="11" fontFamily="sans-serif">NYARUGENGE (CBD)</text>
            <text x="490" y="170" fill="#64748B" fontSize="11" fontFamily="sans-serif">GASABO (REMERA)</text>
            <text x="350" y="380" fill="#64748B" fontSize="11" fontFamily="sans-serif">KICUKIRO (GIKONDO)</text>

            {/* Main Warehouse Pin */}
            <circle cx="380" cy="310" r="14" fill="#0B1220" stroke="#16A36A" strokeWidth="3" />
            <circle cx="380" cy="310" r="5" fill="#16A36A" />
            <text x="380" y="336" fill="#A7F3D0" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
              Main Hub (Gikondo)
            </text>

            {/* Interactive Route Pins */}
            {mapPoints.map((pt) => {
              if (pt.isHub) return null;
              const fill = pt.completed ? '#16A36A' : pt.inProgress ? '#D5A021' : '#3478F6';
              return (
                <g key={pt.id}>
                  <circle cx={pt.x} cy={pt.y} r="10" fill={fill} stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx={pt.x} cy={pt.y} r="18" fill="none" stroke={fill} strokeWidth="1" opacity="0.4" />
                  <text x={pt.x} y={pt.y - 14} fill="#FFFFFF" fontSize="10.5" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
                    {pt.name}
                  </text>
                  <text x={pt.x} y={pt.y + 20} fill="#94A3B8" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                    RWF {pt.val}
                  </text>
                </g>
              );
            })}

            {/* Truck Pin with Animated Pulse (RAD 245 H at Papyrus) */}
            <g transform="translate(410, 230)">
              <circle cx="0" cy="0" r="16" fill="rgba(22, 163, 106, 0.3)" />
              <rect x="-10" y="-10" width="20" height="20" rx="4" fill="#16A36A" stroke="#FFFFFF" strokeWidth="2" />
              <text x="0" y="3" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">RAD</text>
            </g>
          </svg>

          {/* Map Legend */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              backgroundColor: 'rgba(11, 18, 32, 0.85)',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #1C2B47',
              display: 'flex',
              gap: '16px',
              fontSize: '11px',
              color: '#CBD5E1'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A36A' }} />
              <span>Completed Stop</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D5A021' }} />
              <span>Truck Arrived (Offloading)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3478F6' }} />
              <span>Pending Stop</span>
            </div>
          </div>
        </div>

        {/* SECTION 21: Vehicle Telemetry & Stop Sequence Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E6EAF0', paddingBottom: '12px', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-success" style={{ marginBottom: '4px' }}>IN TRANSIT</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>{selectedRun.truckPlate}</h3>
                <div style={{ fontSize: '12.5px', color: '#CBD5E1' }}>
                  Driver: <strong style={{ color: '#FFFFFF' }}>{selectedRun.driverName}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#CBD5E1', textTransform: 'uppercase' }}>ROUTE VALUE</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#16A36A' }} className="tabular-nums">
                  RWF 4.6M
                </div>
              </div>
            </div>

            {/* Key Telematics Indicators (Section 21 match) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>TOTAL STOPS</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>19</div>
              </div>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#6EE7B7' }}>COMPLETED</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#34D399', marginTop: '2px' }}>14</div>
              </div>
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#FCD34D' }}>REMAINING</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FBBF24', marginTop: '2px' }}>5</div>
              </div>
            </div>

            {/* Route & Truck Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Assigned Route:</span>
                <strong>Kigali East & Remera</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Vehicle Model:</span>
                <span>{vehicleInfo.model.split('(')[0]}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Fuel Tank:</span>
                <span style={{ color: '#34D399', fontWeight: 600 }}>{vehicleInfo.fuelLevelPercent}% Diesel</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Next Maintenance:</span>
                <span style={{ color: '#F87171', fontWeight: 600 }}>Due in 420 km!</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={() => setCurrentNav('driver_mobile')}
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '12.5px' }}
              >
                <Navigation size={14} /> Open Driver View
              </button>
            </div>
          </div>

          {/* Current Stop Detail */}
          <div className="card" style={{ padding: '16px', backgroundColor: 'rgba(213, 160, 33, 0.14)', border: '1px solid rgba(213, 160, 33, 0.35)' }}>
            <div style={{ fontSize: '11px', color: '#FDE047', fontWeight: 700, textTransform: 'uppercase' }}>
              Current Active Stop (Offloading)
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
              Papyrus Garden Restaurant & Club
            </div>
            <div style={{ fontSize: '12px', color: '#FEF08A', marginTop: '2px' }}>
              KG 674 St, Kimihurura • Delivering 60 Crates • RWF 1,341,000 Credit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
