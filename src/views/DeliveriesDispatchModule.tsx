import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Truck,
  Plus,
  Search,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  Fuel,
  Navigation,
  Eye,
  RotateCcw
} from 'lucide-react';
import { DeliveryRun, DeliveryStatus } from '../types';

export const DeliveriesDispatchModule: React.FC = () => {
  const {
    deliveryRuns,
    setCurrentNav,
    showToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedRun, setSelectedRun] = useState<DeliveryRun | null>(null);

  const filteredRuns = deliveryRuns.filter(
    (r) =>
      r.deliveryNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.routeName.toLowerCase().includes(search.toLowerCase()) ||
      r.driverName.toLowerCase().includes(search.toLowerCase()) ||
      r.truckPlate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Logistics, Deliveries & Dispatch Control</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setCurrentNav('delivery_map')} className="btn btn-secondary" style={{ color: '#16A36A', borderColor: '#A7F3D0', padding: '6px 12px', fontSize: '12.5px' }}>
            <MapPin size={14} />
            <span>Live Map</span>
          </button>
          <button onClick={() => setCurrentNav('driver_mobile')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12.5px' }}>
            <span>Driver View</span>
          </button>
        </div>
      </div>

      {/* Route Optimization Summary (Section 22) */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          backgroundColor: '#0B1220',
          color: '#FFFFFF',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Active Truck Dispatches</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
            {deliveryRuns.length} Delivery Runs
          </div>
          <div style={{ fontSize: '11px', color: '#16A36A' }}>Kigali East & West lines</div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Crates in Transit</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#3478F6', marginTop: '2px' }} className="tabular-nums">
            {deliveryRuns.reduce((a, b) => a + b.cratesLoaded, 0)} Crates
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>900 total truck capacity</div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Estimated Fuel Needed</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#D5A021', marginTop: '2px' }} className="tabular-nums">
            {deliveryRuns.reduce((a, b) => a + b.fuelEstimatedLiters, 0)} Liters Diesel
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>80.5 km planned routes</div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Cash to Collect en Route</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#16A36A', marginTop: '2px' }} className="tabular-nums">
            RWF {deliveryRuns.reduce((a, b) => a + b.totalValue, 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#16A36A' }}>Secured by drop boxes & MoMo</div>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search size={16} color="#667085" />
        <input
          type="text"
          placeholder="Search by delivery run, driver name, vehicle plate, route..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', color: '#FFFFFF' }}
        />
      </div>

      {/* Delivery Runs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredRuns.map((run) => (
          <div key={run.id} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #E6EAF0', paddingBottom: '14px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '16px', color: '#FFFFFF' }}>{run.deliveryNumber}</strong>
                  <span className="badge badge-info">{run.routeCode}</span>
                  <span className="badge badge-success">{run.status.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#4B5563', marginTop: '3px' }}>
                  {run.routeName} • Dispatched at {run.dispatchDate}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    {run.completedStops} of {run.totalStops} Stops Completed
                  </div>
                  <div style={{ fontSize: '12px', color: '#16A36A' }}>
                    {run.emptyCratesReturned} Empties Returned
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRun(run)}
                  className="btn btn-secondary btn-sm"
                >
                  <Eye size={14} /> View Manifest
                </button>
              </div>
            </div>

            {/* Telemetry Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>TRUCK & DRIVER</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{run.truckPlate}</div>
                <div style={{ fontSize: '11.5px', color: '#CBD5E1' }}>{run.driverName} ({run.driverPhone})</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>CRATES ON BOARD</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#38BDF8' }}>{run.cratesLoaded} Crates Loaded</div>
                <div style={{ fontSize: '11.5px', color: '#CBD5E1' }}>{run.cratesDelivered} crates delivered</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>COLLECTIONS PROGRESS</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#34D399' }} className="tabular-nums">
                  RWF {(run.cashCollected + run.momoCollected).toLocaleString()}
                </div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>of RWF {run.totalValue.toLocaleString()} route value</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>FUEL & DISTANCE</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{run.distanceKm} km</div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>~{run.fuelEstimatedLiters}L diesel</div>
              </div>
            </div>

            {/* Sequence Stops Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', textTransform: 'uppercase' }}>
                Delivery Sequence & Stops
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {run.stops.map((stop) => (
                  <div
                    key={stop.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: stop.status === 'completed' ? 'rgba(16, 185, 129, 0.35)' : stop.status === 'arrived' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.12)',
                      backgroundColor: stop.status === 'completed' ? 'rgba(16, 185, 129, 0.12)' : stop.status === 'arrived' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 700, color: '#94A3B8' }}>Stop #{stop.stopSequence}</span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: stop.status === 'completed' ? '#34D399' : stop.status === 'arrived' ? '#FBBF24' : '#94A3B8',
                          textTransform: 'uppercase'
                        }}
                      >
                        {stop.status}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {stop.customerName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                      {stop.cratesToDeliver} crates • RWF {(stop.paymentDue / 1000).toFixed(0)}k
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manifest Detail Modal */}
      {selectedRun && (
        <div className="modal-backdrop" onClick={() => setSelectedRun(null)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#07132B' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
                Loading Manifest & Driver Dispatch — {selectedRun.deliveryNumber}
              </h3>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                Vehicle: {selectedRun.truckPlate} • Driver: {selectedRun.driverName}
              </p>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E6EAF0', textAlign: 'left', color: '#CBD5E1' }}>
                      <th style={{ padding: '6px' }}>Seq</th>
                      <th style={{ padding: '6px' }}>Customer</th>
                      <th style={{ padding: '6px' }}>Address</th>
                      <th style={{ padding: '6px' }}>Deliver (Crates)</th>
                      <th style={{ padding: '6px' }}>Collect (Empties)</th>
                      <th style={{ padding: '6px' }}>Amount Due</th>
                      <th style={{ padding: '6px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRun.stops.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid #F1F4F9' }}>
                        <td style={{ padding: '6px', fontWeight: 700 }}>#{s.stopSequence}</td>
                        <td style={{ padding: '6px', fontWeight: 600 }}>{s.customerName}</td>
                        <td style={{ padding: '6px', color: '#CBD5E1' }}>{s.address}</td>
                        <td style={{ padding: '6px', fontWeight: 600 }}>{s.cratesToDeliver}</td>
                        <td style={{ padding: '6px', color: '#16A36A', fontWeight: 600 }}>{s.emptyCratesToCollect}</td>
                        <td style={{ padding: '6px' }} className="tabular-nums">RWF {s.paymentDue.toLocaleString()}</td>
                        <td style={{ padding: '6px' }}>
                          <span className={`badge ${s.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedRun(null)} className="btn btn-secondary">
                  Close Manifest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
