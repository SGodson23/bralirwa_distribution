import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Truck,
  Wrench,
  Fuel,
  Shield,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Phone,
  UserCheck
} from 'lucide-react';
import { Vehicle } from '../types';

export const FleetManagementModule: React.FC = () => {
  const { vehicles, showToast, setCurrentNav } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(vehicles[0] || null);

  const filteredVehicles = vehicles.filter((v) => {
    const matchSearch =
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.assignedDriverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCrateCapacity = vehicles.reduce((sum, v) => sum + v.capacityCrates, 0);
  const activeVehiclesCount = vehicles.filter((v) => v.status === 'active').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'maintenance').length;

  return (
    <div style={{ padding: '28px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Logistics Infrastructure
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>Fleet Compliance & Service</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            Fleet Maintenance & Capacity Management
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '6px' }}>
            Manage delivery trucks, tricycles, Contrôle Technique (Police) certificates, and fuel efficiency
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setCurrentNav('deliveries')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13.5px',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Truck size={16} />
            Dispatch Schedule
          </button>

          <button
            onClick={() => showToast('Contrôle Technique inspection scheduled for RAD 482 B')}
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
            <Wrench size={16} />
            Book Service Ticket
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Total Distribution Fleet
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF' }} className="tabular-nums font-display">
            {vehicles.length} Units
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle2 size={13} />
            {activeVehiclesCount} currently active on road
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Combined Crate Capacity
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8' }} className="tabular-nums font-display">
            {totalCrateCapacity.toLocaleString()} Crates
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
            Across trucks and tricycles
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Undergoing Maintenance
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: maintenanceCount > 0 ? '#FBBF24' : '#34D399' }} className="tabular-nums font-display">
            {maintenanceCount} Vehicles
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
            Garage Moderne & Isuzu Center
          </div>
        </div>

        <div className="glass-card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Contrôle Technique Compliance
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#34D399' }} className="tabular-nums font-display">
            100% Valid
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
            All Rwanda National Police certified
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '14px 20px',
          marginBottom: '22px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: 1,
            backgroundColor: 'rgba(5, 14, 34, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            minWidth: '280px'
          }}
        >
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search by plate number, truck model, or driver name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '13.5px',
              color: '#FFFFFF'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#CBD5E1' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '13px',
              backgroundColor: '#07152E',
              color: '#FFFFFF',
              fontWeight: 600
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (On Delivery)</option>
            <option value="available">Available (At Depot)</option>
            <option value="maintenance">In Maintenance</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Vehicles List & Detail View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr', gap: '24px' }}>
        {/* Vehicles Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredVehicles.map((vehicle) => {
            const isSelected = selectedVehicle?.id === vehicle.id;
            return (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className="glass-card"
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  border: isSelected
                    ? '2px solid rgba(16, 185, 129, 0.75)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isSelected
                    ? '0 10px 30px rgba(16, 185, 129, 0.25), 0 0 20px rgba(16, 185, 129, 0.15)'
                    : '0 6px 20px rgba(0, 0, 0, 0.35)',
                  transition: 'all 180ms ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                        {vehicle.plateNumber}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          backgroundColor:
                            vehicle.status === 'active'
                              ? 'rgba(16, 185, 129, 0.18)'
                              : vehicle.status === 'available'
                              ? 'rgba(56, 189, 248, 0.18)'
                              : 'rgba(245, 158, 11, 0.18)',
                          color:
                            vehicle.status === 'active'
                              ? '#34D399'
                              : vehicle.status === 'available'
                              ? '#38BDF8'
                              : '#FBBF24',
                          border: `1px solid ${
                            vehicle.status === 'active'
                              ? 'rgba(16, 185, 129, 0.4)'
                              : vehicle.status === 'available'
                              ? 'rgba(56, 189, 248, 0.4)'
                              : 'rgba(245, 158, 11, 0.4)'
                          }`
                        }}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                      {vehicle.model} • Capacity: <strong style={{ color: '#FFFFFF' }}>{vehicle.capacityCrates} Crates</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#38BDF8' }}>
                      {vehicle.fuelLevelPercent}% Fuel
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                      {(vehicle.currentMileageKm / 1000).toFixed(0)}k km
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '12.5px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
                    <UserCheck size={14} color="#34D399" />
                    <span>Driver: <strong style={{ color: '#FFFFFF' }}>{vehicle.assignedDriverName}</strong></span>
                  </div>
                  <div style={{ color: '#94A3B8' }}>
                    Contrôle: <strong style={{ color: '#34D399' }}>{vehicle.technicalControlExpiryDate}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Vehicle Detail Card */}
        {selectedVehicle && (
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Truck size={24} color="#38BDF8" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      {selectedVehicle.plateNumber}
                    </h2>
                    <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: '3px 0 0 0' }}>
                      {selectedVehicle.model} • Assigned to {selectedVehicle.assignedDriverName}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => showToast(`Service log updated for ${selectedVehicle.plateNumber}`)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Log Maintenance
              </button>
            </div>

            {/* Spec and Status Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '22px' }}>
              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>Crate Payload Capacity</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF' }} className="tabular-nums font-display">
                  {selectedVehicle.capacityCrates} Crates
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  Approx. {(selectedVehicle.capacityCrates * 24 * 0.5).toFixed(0)} Liters payload
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>Odometer & Next Service</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#38BDF8' }} className="tabular-nums font-display">
                  {selectedVehicle.currentMileageKm.toLocaleString()} KM
                </div>
                <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 600, marginTop: '2px' }}>
                  Next service at {selectedVehicle.nextServiceKm.toLocaleString()} KM
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>Contrôle Technique (Police)</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#34D399' }}>
                  Valid until {selectedVehicle.technicalControlExpiryDate}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  Rwanda National Police Remera Center
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>Commercial Insurance (SANLAM)</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#34D399' }}>
                  Valid until {selectedVehicle.insuranceExpiryDate}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  Comprehensive Goods-in-Transit cover
                </div>
              </div>
            </div>

            {/* Fuel Level Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: '#CBD5E1' }}>Fuel Tank Level (Diesel)</span>
                <span style={{ fontWeight: 800, color: '#FFFFFF' }}>{selectedVehicle.fuelLevelPercent}% (Estimated 45 Liters)</span>
              </div>
              <div style={{ height: '10px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${selectedVehicle.fuelLevelPercent}%`,
                    height: '100%',
                    background: selectedVehicle.fuelLevelPercent > 30 ? 'linear-gradient(90deg, #10B981, #34D399)' : 'linear-gradient(90deg, #EF4444, #F87171)',
                    borderRadius: '6px',
                    boxShadow: selectedVehicle.fuelLevelPercent > 30 ? '0 0 12px rgba(16, 185, 129, 0.5)' : '0 0 12px rgba(239, 68, 68, 0.5)'
                  }}
                />
              </div>
            </div>

            {/* Service History Log */}
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
              Recent Maintenance Logs
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { date: selectedVehicle.lastServiceDate, desc: 'Full oil change, diesel filter, air filter replacement', cost: 185000, provider: 'Garage Moderne Gikondo' },
                { date: '2026-07-15', desc: 'Rear suspension bushing and brake pad replacement', cost: 240000, provider: 'Isuzu Rwanda Service Center' },
                { date: '2026-05-10', desc: 'New front commercial Michelin tires (2 units)', cost: 360000, provider: 'Pneus Express Kigali' }
              ].map((log, i) => (
                <div
                  key={i}
                  style={{
                    padding: '13px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(5, 14, 34, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '13px' }}>{log.desc}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>
                      {log.date} • {log.provider}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#38BDF8', fontSize: '13.5px' }} className="tabular-nums font-display">
                    RWF {log.cost.toLocaleString()}
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
