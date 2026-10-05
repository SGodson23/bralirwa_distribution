import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Shield,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { Customer, CustomerCategory } from '../types';
import { ClientsOverviewCard } from '../components/commercial/ClientsOverviewCard';

export const CustomersCRMModule: React.FC = () => {
  const {
    customers,
    updateCustomerCreditLimit,
    toggleCustomerBlock,
    setQuickCreateOpen,
    setQuickCreateType,
    setCurrentNav
  } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [newCreditLimit, setNewCreditLimit] = useState<number>(5000000);

  const categories = ['All', 'Bar', 'Restaurant', 'Hotel', 'Supermarket', 'Nightclub', 'Wholesaler'];

  const filtered = customers.filter((c) => {
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tradeName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.district.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalExposure = customers.reduce((sum, c) => sum + c.currentExposure, 0);
  const totalCratesHeld = customers.reduce((sum, c) => sum + c.outstandingCrates, 0);

  const handleUpdateCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCust) return;
    updateCustomerCreditLimit(selectedCust.id, newCreditLimit);
    setSelectedCust({ ...selectedCust, creditLimit: newCreditLimit, availableCredit: Math.max(0, newCreditLimit - selectedCust.currentExposure) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>Clients & Retailer CRM</h1>
          <p style={{ fontSize: '13px', color: '#CBD5E1' }}>
            Bars, restaurants, hotels, supermarkets, and wholesale accounts across Rwanda
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              setQuickCreateType('customer');
              setQuickCreateOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={15} />
            <span>Onboard Retailer</span>
          </button>
        </div>
      </div>

      {/* Top Overview: Exact User Requested CLIENTS Card & Key CRM Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '20px', alignItems: 'stretch' }}>
        <ClientsOverviewCard />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '11.5px', color: '#CBD5E1', fontWeight: 600, textTransform: 'uppercase' }}>Active Retailers</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0' }}>
              186 accounts
            </div>
            <div style={{ fontSize: '12px', color: '#16A36A', fontWeight: 600 }}>Kigali &amp; Eastern Province</div>
          </div>

          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '11.5px', color: '#CBD5E1', fontWeight: 600, textTransform: 'uppercase' }}>Total Credit Exposure</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0' }} className="tabular-nums">
              RWF {totalExposure.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#CBD5E1' }}>Across all open accounts</div>
          </div>

          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '11.5px', color: '#CBD5E1', fontWeight: 600, textTransform: 'uppercase' }}>Crates Outside Warehouse</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#D5A021', margin: '4px 0' }} className="tabular-nums">
              {totalCratesHeld.toLocaleString()} crates
            </div>
            <div style={{ fontSize: '12px', color: '#CBD5E1' }}>Held by customers as empties</div>
          </div>

          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '11.5px', color: '#CBD5E1', fontWeight: 600, textTransform: 'uppercase' }}>Watch-list / Blocked</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#E5484D', margin: '4px 0' }}>
              {customers.filter((c) => c.status !== 'active').length} accounts
            </div>
            <div style={{ fontSize: '12px', color: '#E5484D', fontWeight: 600 }}>Credit limit breached</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '300px' }}>
          <Search size={16} color="#667085" />
          <input
            type="text"
            placeholder="Search by customer name, phone, district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', color: '#FFFFFF' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              style={{
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: categoryFilter === c ? 600 : 400,
                borderRadius: '6px',
                border: '1px solid',
                borderColor: categoryFilter === c ? '#16A36A' : '#E6EAF0',
                backgroundColor: categoryFilter === c ? '#ECFDF5' : '#FFFFFF',
                color: categoryFilter === c ? '#16A36A' : '#667085',
                cursor: 'pointer'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="table-wrapper">
        <table className="data-table responsive-stack">
          <thead>
            <tr>
              <th>Retailer / Account</th>
              <th>Category</th>
              <th>Location</th>
              <th>Contact Person</th>
              <th>Credit Limit</th>
              <th>Current Exposure</th>
              <th>Available Credit</th>
              <th>Crates Held</th>
              <th>Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td data-label="Retailer">
                  <div>
                    <strong style={{ color: '#FFFFFF', fontSize: '13.5px' }}>{c.name}</strong>
                    <div style={{ fontSize: '11px', color: '#CBD5E1' }}>{c.accountNumber} • TIN: {c.tinNumber}</div>
                  </div>
                </td>
                <td data-label="Category">
                  <span className="badge badge-neutral">{c.category}</span>
                </td>
                <td data-label="Location" style={{ fontSize: '12.5px' }}>
                  {c.district}, {c.sector}
                </td>
                <td data-label="Contact">
                  <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{c.contactPerson}</div>
                  <div style={{ fontSize: '11px', color: '#CBD5E1' }}>{c.phone}</div>
                </td>
                <td data-label="Credit Limit" className="tabular-nums" style={{ fontWeight: 600 }}>
                  RWF {c.creditLimit.toLocaleString()}
                </td>
                <td data-label="Exposure" className="tabular-nums" style={{ fontWeight: 700, color: c.currentExposure > c.creditLimit ? '#E5484D' : '#FFFFFF' }}>
                  RWF {c.currentExposure.toLocaleString()}
                </td>
                <td data-label="Available" className="tabular-nums" style={{ color: '#16A36A', fontWeight: 600 }}>
                  RWF {c.availableCredit.toLocaleString()}
                </td>
                <td data-label="Crates Held" className="tabular-nums">
                  <strong style={{ color: '#D5A021' }}>{c.outstandingCrates}</strong> crates
                </td>
                <td data-label="Score">
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      backgroundColor:
                        c.paymentBehaviorScore === 'A+' || c.paymentBehaviorScore === 'A'
                          ? '#ECFDF5'
                          : c.paymentBehaviorScore === 'B'
                          ? '#FEFCE8'
                          : '#FEECEE',
                      color:
                        c.paymentBehaviorScore === 'A+' || c.paymentBehaviorScore === 'A'
                          ? '#16A36A'
                          : c.paymentBehaviorScore === 'B'
                          ? '#C07914'
                          : '#E5484D'
                    }}
                  >
                    {c.paymentBehaviorScore}
                  </span>
                </td>
                <td data-label="Status">
                  <span
                    className={`badge ${
                      c.status === 'active'
                        ? 'badge-success'
                        : c.status === 'watch_list'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                  >
                    {c.status.replace('_', ' ')}
                  </span>
                </td>
                <td data-label="Action">
                  <button
                    onClick={() => {
                      setSelectedCust(c);
                      setNewCreditLimit(c.creditLimit);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer 360 Drawer / Modal (Section 13) */}
      {selectedCust && (
        <div className="modal-backdrop" onClick={() => setSelectedCust(null)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#07132B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>{selectedCust.name}</h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                    {selectedCust.tradeName} • {selectedCust.accountNumber} • TIN: {selectedCust.tinNumber}
                  </p>
                </div>
                <button
                  onClick={() => toggleCustomerBlock(selectedCust.id)}
                  className={`btn btn-sm ${selectedCust.status === 'blocked' ? 'btn-primary' : 'btn-danger'}`}
                >
                  {selectedCust.status === 'blocked' ? 'Unblock Account' : 'Block Account'}
                </button>
              </div>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Commercial & Financial Health */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>CREDIT LIMIT</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }} className="tabular-nums">
                    RWF {selectedCust.creditLimit.toLocaleString()}
                  </div>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>CURRENT EXPOSURE</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#F87171', marginTop: '2px' }} className="tabular-nums">
                    RWF {selectedCust.currentExposure.toLocaleString()}
                  </div>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>AVAILABLE CREDIT</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#34D399', marginTop: '2px' }} className="tabular-nums">
                    RWF {selectedCust.availableCredit.toLocaleString()}
                  </div>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>PAYMENT TERMS</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                    {selectedCust.paymentTermsDays} Days Net
                  </div>
                </div>
              </div>

              {/* Empties & Container Assets Section (Section 13) */}
              <div
                style={{
                  backgroundColor: 'rgba(213, 160, 33, 0.14)',
                  border: '1px solid rgba(213, 160, 33, 0.35)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#FDE047', textTransform: 'uppercase' }}>
                    Empty Returnable Containers Held
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#FACC15', marginTop: '4px' }}>
                    {selectedCust.outstandingCrates} crates currently in client custody
                  </div>
                  <div style={{ fontSize: '12px', color: '#FEF08A' }}>
                    Physical asset deposit value: RWF {selectedCust.crateDepositHeld.toLocaleString()} (Guaranteed by deposit)
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentNav('empties');
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  <RotateCcw size={13} />
                  <span>Empties Ledger</span>
                </button>
              </div>

              {/* Adjust Credit Limit Form (Section 16, 46) */}
              <form onSubmit={handleUpdateCredit} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#FFFFFF' }}>Adjust Authorized Credit Limit</h4>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="number"
                    step="500000"
                    className="input"
                    value={newCreditLimit}
                    onChange={(e) => setNewCreditLimit(parseInt(e.target.value) || 0)}
                  />
                  <button type="submit" className="btn btn-primary">
                    Update & Audit Log
                  </button>
                </div>
              </form>

              {/* Retailer Contact & Territory Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                <div>
                  <div style={{ color: '#CBD5E1', marginBottom: '2px' }}>Physical Address</div>
                  <div style={{ fontWeight: 500 }}>{selectedCust.address}</div>
                  <div style={{ color: '#CBD5E1', marginTop: '2px' }}>
                    {selectedCust.district}, Sector {selectedCust.sector}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#CBD5E1', marginBottom: '2px' }}>Contact Person & Phone</div>
                  <div style={{ fontWeight: 500 }}>{selectedCust.contactPerson}</div>
                  <div style={{ color: '#16A36A' }}>{selectedCust.phone} • {selectedCust.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button onClick={() => setSelectedCust(null)} className="btn btn-secondary">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
