import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Navigation,
  Phone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Camera,
  Edit3,
  Wifi,
  WifiOff,
  DollarSign,
  Truck,
  ArrowRight,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { DeliveryStop, PaymentMethod } from '../types';

export const DriverMobileAppModule: React.FC = () => {
  const {
    deliveryRuns,
    recordDeliveryStopCompletion,
    setCurrentNav,
    showToast
  } = useApp();

  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [activeDeliveryId, setActiveDeliveryId] = useState<string>('del-run-101');
  const [completingStop, setCompletingStop] = useState<DeliveryStop | null>(null);

  // Stop completion inputs
  const [collectedAmount, setCollectedAmount] = useState<number>(0);
  const [returnedCrates, setReturnedCrates] = useState<number>(0);
  const [sigName, setSigName] = useState<string>('');
  const [photoSnapped, setPhotoSnapped] = useState<boolean>(false);

  const activeRun = deliveryRuns.find((r) => r.id === activeDeliveryId) || deliveryRuns[0];

  const handleOpenCompleteModal = (stop: DeliveryStop) => {
    setCompletingStop(stop);
    setCollectedAmount(stop.paymentDue);
    setReturnedCrates(stop.emptyCratesToCollect);
    setSigName(stop.customerName.split(' ')[0] + ' (Manager)');
    setPhotoSnapped(false);
  };

  const handleFinishDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingStop) return;

    recordDeliveryStopCompletion(
      activeRun.id,
      completingStop.id,
      collectedAmount,
      returnedCrates,
      sigName
    );

    setCompletingStop(null);
    showToast(`Stop verified! ${returnedCrates} empties returned and payment recorded.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-success">Field Driver App</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1' }}>Driver: Eric Nshimiyimana (RAD 245 H)</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>Driver Handheld Mobile Terminal</h1>
          <p style={{ fontSize: '13px', color: '#CBD5E1' }}>
            Proof of delivery, instant customer cash/MoMo collection, empty return logs, and offline synchronization
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setOfflineMode(!offlineMode)}
            className={`btn ${offlineMode ? 'btn-danger' : 'btn-secondary'}`}
            style={{ fontSize: '12.5px' }}
          >
            {offlineMode ? <WifiOff size={15} /> : <Wifi size={15} color="#16A36A" />}
            <span>{offlineMode ? 'Simulating Offline Mode' : 'Online Sync Active'}</span>
          </button>
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="btn btn-secondary"
            style={{ fontSize: '12.5px' }}
          >
            <Smartphone size={15} />
            <span>{deviceFrameMode ? 'Switch to Full Width' : 'Switch to Smartphone Frame'}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: deviceFrameMode ? '420px' : '100%',
            backgroundColor: '#0B1220',
            borderRadius: deviceFrameMode ? '36px' : '16px',
            border: deviceFrameMode ? '10px solid #1E293B' : '1px solid #1C2B47',
            padding: deviceFrameMode ? '24px 18px' : '24px',
            boxShadow: '0 25px 60px rgba(11, 18, 32, 0.35)',
            color: '#FFFFFF',
            minHeight: '720px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 250ms ease'
          }}
        >
          {/* Mobile Top Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={16} color="#16A36A" />
                <span style={{ fontSize: '13px', fontWeight: 800 }}>DistributorOS Driver</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8' }}>
                {offlineMode ? (
                  <span style={{ color: '#F2A93B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <WifiOff size={12} /> Offline Queue (3)
                  </span>
                ) : (
                  <span style={{ color: '#16A36A', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Wifi size={12} /> Connected
                  </span>
                )}
              </div>
            </div>

            {/* Driver Summary Card (Section 23 Match) */}
            <div
              style={{
                backgroundColor: '#121C30',
                borderRadius: '16px',
                padding: '18px',
                border: '1px solid #1C2B47',
                marginBottom: '18px'
              }}
            >
              <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                TODAY'S DISPATCHED ROUTE
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '6px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>19 Deliveries</div>
                  <div style={{ fontSize: '12px', color: '#16A36A', fontWeight: 600 }}>14 Completed • 5 Remaining</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Route Collections</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#D5A021' }} className="tabular-nums">
                    RWF 4.6M
                  </div>
                </div>
              </div>
            </div>

            {/* Sequence Stops List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Route Stops
              </div>

              {activeRun.stops.map((stop) => {
                const isCurrent = stop.status === 'arrived';
                const isDone = stop.status === 'completed';

                return (
                  <div
                    key={stop.id}
                    style={{
                      backgroundColor: isCurrent ? '#16243E' : isDone ? '#0E1726' : '#121C30',
                      borderRadius: '12px',
                      padding: '14px',
                      border: '1px solid',
                      borderColor: isCurrent ? '#16A36A' : isDone ? '#1C2B47' : '#1E293B',
                      opacity: isDone ? 0.75 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: isDone ? '#16A36A' : isCurrent ? '#D5A021' : '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700
                          }}
                        >
                          {stop.stopSequence}
                        </span>
                        <strong style={{ fontSize: '14px', color: '#FFFFFF' }}>{stop.customerName}</strong>
                      </div>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: isDone ? '#ECFDF5' : isCurrent ? '#FEFCE8' : '#334155',
                          color: isDone ? '#16A36A' : isCurrent ? '#C07914' : '#CBD5E1',
                          textTransform: 'uppercase'
                        }}
                      >
                        {stop.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#94A3B8', marginLeft: '28px', marginBottom: '10px' }}>
                      {stop.address}
                    </div>

                    {/* Quantities & Values */}
                    <div
                      style={{
                        marginLeft: '28px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '6px',
                        fontSize: '11px',
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        padding: '8px 10px',
                        borderRadius: '6px'
                      }}
                    >
                      <div>
                        <div style={{ color: '#94A3B8' }}>Deliver</div>
                        <strong style={{ color: '#3478F6' }}>{stop.cratesToDeliver} Crates</strong>
                      </div>
                      <div>
                        <div style={{ color: '#94A3B8' }}>Collect</div>
                        <strong style={{ color: '#16A36A' }}>{stop.emptyCratesToCollect} Empties</strong>
                      </div>
                      <div>
                        <div style={{ color: '#94A3B8' }}>Payment</div>
                        <strong style={{ color: '#D5A021' }}>RWF {(stop.paymentDue / 1000).toFixed(0)}k</strong>
                      </div>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div style={{ marginLeft: '28px', marginTop: '10px', display: 'flex', gap: '8px' }}>
                      <a
                        href={`tel:${stop.customerPhone}`}
                        style={{
                          flex: 1,
                          padding: '6px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          color: '#FFFFFF',
                          fontSize: '11.5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          textDecoration: 'none',
                          fontWeight: 500
                        }}
                      >
                        <Phone size={13} color="#16A36A" /> Call
                      </a>

                      <button
                        type="button"
                        onClick={() => showToast(`Navigating to ${stop.customerName} via Google Maps...`)}
                        style={{
                          flex: 1,
                          padding: '6px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '11.5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        <Navigation size={13} color="#3478F6" /> Map
                      </button>

                      {!isDone && (
                        <button
                          type="button"
                          onClick={() => handleOpenCompleteModal(stop)}
                          style={{
                            flex: 1.5,
                            padding: '6px',
                            borderRadius: '6px',
                            backgroundColor: '#16A36A',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          <CheckCircle2 size={13} /> Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Bottom Footer */}
          <div style={{ borderTop: '1px solid #1C2B47', paddingTop: '14px', marginTop: '20px', textAlign: 'center', fontSize: '11px', color: '#94A3B8' }}>
            DistributorOS Offline-First Mobile Service • Sync v2.4
          </div>
        </div>
      </div>

      {/* Proof of Delivery Modal (Section 24: GPS, Timestamp, Signature, Payment, Empties, Photo) */}
      {completingStop && (
        <div className="modal-backdrop" onClick={() => setCompletingStop(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#07132B' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
                Proof of Delivery — {completingStop.customerName}
              </h3>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                Stop #{completingStop.stopSequence} • {completingStop.cratesToDeliver} Crates
              </p>
            </div>

            <form onSubmit={handleFinishDelivery} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="label">Payment Collected (RWF)</label>
                  <input
                    type="number"
                    className="input"
                    value={collectedAmount}
                    onChange={(e) => setCollectedAmount(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="label">Empty Crates Returned</label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={returnedCrates}
                    onChange={(e) => setReturnedCrates(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Receiver Name & Title</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={sigName}
                  onChange={(e) => setSigName(e.target.value)}
                  placeholder="e.g. Patrick Mugisha (Manager)"
                />
              </div>

              {/* Digital Signature Pad simulation */}
              <div>
                <label className="label">Client Digital Signature (Touch / Pen)</label>
                <div
                  style={{
                    height: '90px',
                    borderRadius: '8px',
                    border: '1.5px dashed rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#CBD5E1',
                    fontSize: '13px',
                    position: 'relative'
                  }}
                >
                  <Edit3 size={16} style={{ marginRight: '6px' }} />
                  <span>Signature captured on touch screen: "{sigName}"</span>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '6px',
                      right: '8px',
                      fontSize: '10px',
                      color: '#34D399',
                      fontWeight: 600
                    }}
                  >
                    ✓ GPS Verified (-1.9542, 30.1084)
                  </div>
                </div>
              </div>

              {/* Photo Proof */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoSnapped(true);
                    showToast('Delivery offloading photo captured!');
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', borderColor: photoSnapped ? '#16A36A' : '#E6EAF0' }}
                >
                  <Camera size={16} color={photoSnapped ? '#16A36A' : '#667085'} />
                  <span>{photoSnapped ? '✓ Photo Attached (Offloading_Bay.jpg)' : 'Take Photo of Offloaded Crates'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setCompletingStop(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Sign & Finalize Delivery Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
