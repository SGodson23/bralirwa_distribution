import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  RotateCcw,
  Search,
  Plus,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Warehouse,
  Users,
  Truck,
  DollarSign,
  CheckCircle2,
  HelpCircle,
  X
} from 'lucide-react';
import { CrateLedgerEntry } from '../types';

export const EmptiesCratesModule: React.FC = () => {
  const {
    emptiesSummary,
    crateLedger,
    customers,
    showToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnCustId, setReturnCustId] = useState(customers[0]?.id || '');
  const [cratesReturnedCount, setCratesReturnedCount] = useState<number>(50);
  const [bottlesBrokenCount, setBottlesBrokenCount] = useState<number>(0);
  const [disputeModalItem, setDisputeModalItem] = useState<CrateLedgerEntry | null>(null);

  const filteredLedger = crateLedger.filter(
    (cl) =>
      cl.customerName.toLowerCase().includes(search.toLowerCase()) ||
      cl.deliveryNumber.toLowerCase().includes(search.toLowerCase()) ||
      cl.driverName.toLowerCase().includes(search.toLowerCase())
  );

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === returnCustId);
    showToast(`Recorded ${cratesReturnedCount} empty crates returned by ${cust?.name}!`);
    setReturnModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px', color: '#FFFFFF' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              className="badge badge-success"
              style={{
                backgroundColor: 'rgba(22, 163, 106, 0.2)',
                color: '#34D399',
                fontWeight: 700,
                border: '1px solid rgba(22, 163, 106, 0.35)'
              }}
            >
              Signature Asset Module
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Physical Container Governance</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            Empty Bottles & Returnable Crates Ledger
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94A3B8', marginTop: '4px', margin: 0 }}>
            Track returnable glass bottles, plastic crates, kegs, and deposits held by retailers across Rwanda
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setReturnModalOpen(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: '#16A36A',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(22, 163, 106, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={16} />
            <span>Record Crate Return</span>
          </button>
        </div>
      </div>

      {/* Global Asset Distribution Banner */}
      <div
        className="card"
        style={{
          padding: '22px 24px',
          backgroundColor: '#0B1733',
          color: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              DISTRIBUTOR PHYSICAL ASSET POOL
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }} className="tabular-nums">
              {emptiesSummary.totalDistributorCrates.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: 500, color: '#94A3B8' }}>Total Crates</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>TOTAL DEPOSIT VALUATION</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#FBBF24', marginTop: '2px' }} className="tabular-nums">
              RWF {emptiesSummary.totalAssetValueRWF.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 5 Asset Distribution Segments */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>
              <Warehouse size={14} color="#34D399" />
              <span>IN WAREHOUSE</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#34D399', marginTop: '4px' }} className="tabular-nums">
              {emptiesSummary.inWarehouse.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>Ready for brewery swap</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>
              <Users size={14} color="#FBBF24" />
              <span>AT CUSTOMERS</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#FBBF24', marginTop: '4px' }} className="tabular-nums">
              {emptiesSummary.atCustomers.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>In client custody</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>
              <Truck size={14} color="#38BDF8" />
              <span>IN TRUCKS</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }} className="tabular-nums">
              {emptiesSummary.inTrucks.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>In active transit</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>
              <AlertTriangle size={14} color="#F87171" />
              <span>DAMAGED</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#F87171', marginTop: '4px' }} className="tabular-nums">
              {emptiesSummary.damaged.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>Condemned / broken</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>
              <HelpCircle size={14} color="#A78BFA" />
              <span>MISSING / DISPUTE</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#A78BFA', marginTop: '4px' }} className="tabular-nums">
              {emptiesSummary.missingInDispute.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>Auditor investigation</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#0B1733',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <Search size={16} color="#94A3B8" />
        <input
          type="text"
          placeholder="Search empties ledger by retailer, delivery number, driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '13.5px',
            width: '100%',
            backgroundColor: 'transparent',
            color: '#FFFFFF'
          }}
        />
      </div>

      {/* Empties Ledger Table - Every word is pure white/bright and 100% visible */}
      <div
        className="table-wrapper"
        style={{
          backgroundColor: '#0B1733',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <table className="data-table responsive-stack" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#07132B' }}>
            <tr>
              <th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px' }}>Timestamp</th>
              <th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px' }}>Customer / Account</th>
              <th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px' }}>Delivery Run</th>
              <th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px' }}>Containers Dispatched</th>
              <th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px' }}>Containers Returned</th>
              <th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px' }}>Damaged Bottles</th>
              <th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px' }}>Net Balance Held</th>
              <th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px' }}>Deposit Value (RWF)</th>
              <th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px' }}>Driver</th>
              <th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px' }}>Reference / POD</th>
              <th style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLedger.map((entry) => (
              <tr
                key={entry.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'background 0.15s ease'
                }}
              >
                <td data-label="Date" style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500, padding: '14px 16px' }}>
                  {entry.date}
                </td>
                <td data-label="Customer" style={{ padding: '14px 16px' }}>
                  <strong style={{ color: '#FFFFFF', fontSize: '13.5px', fontWeight: 700, display: 'block' }}>
                    {entry.customerName}
                  </strong>
                </td>
                <td data-label="Delivery" style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500, padding: '14px 16px' }}>
                  {entry.deliveryNumber}
                </td>
                <td data-label="Dispatched" className="tabular-nums" style={{ color: '#60A5FA', fontWeight: 700, fontSize: '13px', padding: '14px 16px' }}>
                  +{entry.cratesOut} crates
                </td>
                <td data-label="Returned" className="tabular-nums" style={{ color: '#34D399', fontWeight: 700, fontSize: '13px', padding: '14px 16px' }}>
                  -{entry.cratesReturned} crates
                </td>
                <td data-label="Damaged" className="tabular-nums" style={{ color: entry.bottlesLostOrDamaged > 0 ? '#F87171' : '#FFFFFF', fontWeight: 700, fontSize: '13px', padding: '14px 16px' }}>
                  {entry.bottlesLostOrDamaged}
                </td>
                <td data-label="Balance" className="tabular-nums" style={{ fontWeight: 800, color: '#FBBF24', fontSize: '13px', padding: '14px 16px' }}>
                  {entry.balanceOwed} crates
                </td>
                <td data-label="Deposit Value" className="tabular-nums" style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '13px', padding: '14px 16px' }}>
                  RWF {entry.depositAmount.toLocaleString()}
                </td>
                <td data-label="Driver" style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500, padding: '14px 16px' }}>
                  {entry.driverName}
                </td>
                <td data-label="Reference" style={{ fontSize: '12px', color: '#FFFFFF', fontFamily: 'monospace', fontWeight: 600, padding: '14px 16px' }}>
                  {entry.reference}
                </td>
                <td data-label="Action" style={{ padding: '14px 16px' }}>
                  <button
                    onClick={() => setDisputeModalItem(entry)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.22)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Investigate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Crate Return Modal */}
      {returnModalOpen && (
        <div className="modal-backdrop" onClick={() => setReturnModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#0B1733',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', backgroundColor: '#07132B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Record Customer Crate Return</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0' }}>Post physical empty bottles/crates return into warehouse pool</p>
              </div>
              <button
                onClick={() => setReturnModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label" style={{ color: '#FFFFFF', fontWeight: 600 }}>Customer Account</label>
                <select
                  className="select"
                  value={returnCustId}
                  onChange={(e) => setReturnCustId(e.target.value)}
                  style={{
                    backgroundColor: '#07132B',
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.18)',
                    width: '100%',
                    padding: '8px 12px'
                  }}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id} style={{ backgroundColor: '#07132B', color: '#FFFFFF' }}>
                      {c.name} (Currently holding: {c.outstandingCrates} crates)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" style={{ color: '#FFFFFF', fontWeight: 600 }}>Crates Returned by Customer</label>
                <input
                  type="number"
                  min="1"
                  className="input"
                  value={cratesReturnedCount}
                  onChange={(e) => setCratesReturnedCount(parseInt(e.target.value) || 0)}
                  style={{
                    backgroundColor: '#07132B',
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.18)',
                    width: '100%',
                    padding: '8px 12px'
                  }}
                />
              </div>

              <div>
                <label className="label" style={{ color: '#FFFFFF', fontWeight: 600 }}>Broken / Missing Bottles Found in Crates</label>
                <input
                  type="number"
                  min="0"
                  className="input"
                  value={bottlesBrokenCount}
                  onChange={(e) => setBottlesBrokenCount(parseInt(e.target.value) || 0)}
                  style={{
                    backgroundColor: '#07132B',
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.18)',
                    width: '100%',
                    padding: '8px 12px'
                  }}
                />
                <span style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  Deducted from customer deposit at RWF 150/bottle
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#16A36A',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Commit Return to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispute Investigation Modal */}
      {disputeModalItem && (
        <div className="modal-backdrop" onClick={() => setDisputeModalItem(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#0B1733',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '540px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', backgroundColor: '#07132B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Container Ledger Audit & Investigation
                </h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0' }}>
                  {disputeModalItem.customerName} — {disputeModalItem.deliveryNumber}
                </p>
              </div>
              <button
                onClick={() => setDisputeModalItem(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Dispatched:</span>
                  <strong style={{ color: '#60A5FA' }}>+{disputeModalItem.cratesOut} crates</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Returned:</span>
                  <strong style={{ color: '#34D399' }}>-{disputeModalItem.cratesReturned} crates</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Net Balance Held:</span>
                  <strong style={{ color: '#FBBF24' }}>{disputeModalItem.balanceOwed} crates</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Assigned Driver:</span>
                  <strong style={{ color: '#FFFFFF' }}>{disputeModalItem.driverName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Proof of Delivery Reference:</span>
                  <strong style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{disputeModalItem.reference}</strong>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
                Physical delivery voucher matches driver trip log. Customer signature confirmed on tablet terminal. Deposit is currently collateralized on client statement.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  onClick={() => setDisputeModalItem(null)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close Investigation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
