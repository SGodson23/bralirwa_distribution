import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  AlertTriangle,
  Search,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  FileText,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { Customer } from '../types';

export const DebtReceivablesModule: React.FC = () => {
  const { customers, updateCustomerCreditLimit, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [bucketFilter, setBucketFilter] = useState<'all' | '0-7' | '8-30' | '31-60' | '60+'>('all');
  const [selectedDebtor, setSelectedDebtor] = useState<Customer | null>(null);
  const [promiseDate, setPromiseDate] = useState('2026-10-02');
  const [collectorNote, setCollectorNote] = useState('');

  // Top Debtors with simulated aging
  const debtorsWithAging = customers.map((c, idx) => {
    let agingBucket: '0-7' | '8-30' | '31-60' | '60+' = '0-7';
    if (c.status === 'blocked' || c.paymentBehaviorScore === 'Risky') {
      agingBucket = '60+';
    } else if (c.status === 'watch_list') {
      agingBucket = '31-60';
    } else if (idx % 2 === 1) {
      agingBucket = '8-30';
    }

    return {
      ...c,
      agingBucket,
      lastPaymentPromise: idx === 0 ? 'Promised payment Friday 2pm via MoMo' : idx === 2 ? 'Cheque deposit due Monday' : 'None',
      collectorAssigned: idx % 2 === 0 ? 'Diane Mukandori' : 'Eric Mugabo'
    };
  });

  const filteredDebtors = debtorsWithAging.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search);
    const matchesBucket = bucketFilter === 'all' || d.agingBucket === bucketFilter;
    return matchesSearch && matchesBucket;
  });

  const handleRecordPromise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebtor) return;
    showToast(`Payment promise recorded for ${selectedDebtor.name} on ${promiseDate}!`);
    setSelectedDebtor(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Customer Debt & Receivables Center</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => showToast('Dispatched automated WhatsApp collection reminders to all 8-30d accounts!')}
            className="btn btn-secondary"
            style={{ color: '#16A36A', borderColor: '#A7F3D0', padding: '6px 14px', fontSize: '12.5px' }}
          >
            <Send size={14} />
            <span>Send Reminders</span>
          </button>
        </div>
      </div>

      {/* SECTION 17: Aging Buckets Summary Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        <div className="card" style={{ padding: '16px', backgroundColor: '#0B1220', color: '#FFFFFF' }}>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL RECEIVABLES</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0' }} className="tabular-nums">
            RWF 41,800,000
          </div>
          <div style={{ fontSize: '11px', color: '#CBD5E1' }}>Across 8 commercial clients</div>
        </div>

        <div
          onClick={() => setBucketFilter('0-7')}
          className="card card-interactive"
          style={{
            padding: '16px',
            cursor: 'pointer',
            border: bucketFilter === '0-7' ? '2px solid #16A36A' : '1px solid #E6EAF0'
          }}
        >
          <div style={{ fontSize: '11px', color: '#16A36A', fontWeight: 700, textTransform: 'uppercase' }}>0–7 DAYS</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0' }} className="tabular-nums">
            RWF 18.2M
          </div>
          <div style={{ fontSize: '11px', color: '#CBD5E1' }}>Current terms (Healthy)</div>
        </div>

        <div
          onClick={() => setBucketFilter('8-30')}
          className="card card-interactive"
          style={{
            padding: '16px',
            cursor: 'pointer',
            border: bucketFilter === '8-30' ? '2px solid #F2A93B' : '1px solid #E6EAF0'
          }}
        >
          <div style={{ fontSize: '11px', color: '#C07914', fontWeight: 700, textTransform: 'uppercase' }}>8–30 DAYS</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#C07914', margin: '4px 0' }} className="tabular-nums">
            RWF 13.4M
          </div>
          <div style={{ fontSize: '11px', color: '#CBD5E1' }}>Reminder required</div>
        </div>

        <div
          onClick={() => setBucketFilter('31-60')}
          className="card card-interactive"
          style={{
            padding: '16px',
            cursor: 'pointer',
            border: bucketFilter === '31-60' ? '2px solid #E5484D' : '1px solid #E6EAF0'
          }}
        >
          <div style={{ fontSize: '11px', color: '#E5484D', fontWeight: 700, textTransform: 'uppercase' }}>31–60 DAYS</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#E5484D', margin: '4px 0' }} className="tabular-nums">
            RWF 7.1M
          </div>
          <div style={{ fontSize: '11px', color: '#CBD5E1' }}>Overdue warning</div>
        </div>

        <div
          onClick={() => setBucketFilter('60+')}
          className="card card-interactive"
          style={{
            padding: '16px',
            cursor: 'pointer',
            backgroundColor: 'rgba(229, 72, 77, 0.14)',
            border: bucketFilter === '60+' ? '2px solid #F87171' : '1px solid rgba(229, 72, 77, 0.35)'
          }}
        >
          <div style={{ fontSize: '11px', color: '#F87171', fontWeight: 800, textTransform: 'uppercase' }}>60+ DAYS</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#F87171', margin: '4px 0' }} className="tabular-nums">
            RWF 3.1M
          </div>
          <div style={{ fontSize: '11px', color: '#FCA5A5' }}>High-Risk Default</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '280px' }}>
          <Search size={16} color="#667085" />
          <input
            type="text"
            placeholder="Search debtor, phone, or contact person..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', color: '#FFFFFF' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: '#CBD5E1' }}>Filter:</span>
          {(['all', '0-7', '8-30', '31-60', '60+'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBucketFilter(b)}
              style={{
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: bucketFilter === b ? 600 : 400,
                borderRadius: '6px',
                border: '1px solid',
                borderColor: bucketFilter === b ? '#16A36A' : '#E6EAF0',
                backgroundColor: bucketFilter === b ? '#ECFDF5' : '#FFFFFF',
                color: bucketFilter === b ? '#16A36A' : '#667085',
                cursor: 'pointer'
              }}
            >
              {b === 'all' ? 'All Buckets' : `${b} Days`}
            </button>
          ))}
        </div>
      </div>

      {/* Debtors List Table */}
      <div className="table-wrapper">
        <table className="data-table responsive-stack">
          <thead>
            <tr>
              <th>Customer / Account</th>
              <th>Credit Limit</th>
              <th>Outstanding Debt</th>
              <th>Aging Bucket</th>
              <th>Payment Terms</th>
              <th>Latest Promise</th>
              <th>Assigned Collector</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDebtors.map((d) => (
              <tr key={d.id}>
                <td data-label="Customer">
                  <div>
                    <strong style={{ color: '#FFFFFF', fontSize: '13.5px' }}>{d.name}</strong>
                    <div style={{ fontSize: '11.5px', color: '#CBD5E1' }}>
                      {d.contactPerson} • {d.phone} • {d.district}
                    </div>
                  </div>
                </td>
                <td data-label="Credit Limit" className="tabular-nums">
                  RWF {d.creditLimit.toLocaleString()}
                </td>
                <td data-label="Outstanding Debt" className="tabular-nums" style={{ fontWeight: 800, color: d.agingBucket === '60+' ? '#E5484D' : '#FFFFFF' }}>
                  RWF {d.currentExposure.toLocaleString()}
                </td>
                <td data-label="Aging">
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor:
                        d.agingBucket === '0-7'
                          ? '#ECFDF5'
                          : d.agingBucket === '8-30'
                          ? '#FEF6EB'
                          : '#FEECEE',
                      color:
                        d.agingBucket === '0-7'
                          ? '#16A36A'
                          : d.agingBucket === '8-30'
                          ? '#C07914'
                          : '#E5484D'
                    }}
                  >
                    {d.agingBucket} Days
                  </span>
                </td>
                <td data-label="Terms" style={{ fontSize: '12px' }}>
                  {d.paymentTermsDays} Days Net
                </td>
                <td data-label="Promise" style={{ fontSize: '12px', color: '#FFFFFF' }}>
                  {d.lastPaymentPromise}
                </td>
                <td data-label="Collector" style={{ fontSize: '12.5px', fontWeight: 500 }}>
                  {d.collectorAssigned}
                </td>
                <td data-label="Status">
                  <span
                    className={`badge ${
                      d.status === 'active' ? 'badge-success' : d.status === 'watch_list' ? 'badge-warning' : 'badge-danger'
                    }`}
                  >
                    {d.status.replace('_', ' ')}
                  </span>
                </td>
                <td data-label="Action">
                  <button
                    onClick={() => setSelectedDebtor(d)}
                    className="btn btn-secondary btn-sm"
                  >
                    Log Promise
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Payment Promise Modal */}
      {selectedDebtor && (
        <div className="modal-backdrop" onClick={() => setSelectedDebtor(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#07132B' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Log Client Payment Promise & Notes</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>{selectedDebtor.name} (Owing RWF {selectedDebtor.currentExposure.toLocaleString()})</p>
            </div>
            <form onSubmit={handleRecordPromise} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="label">Promised Settlement Date</label>
                <input
                  type="date"
                  className="input"
                  value={promiseDate}
                  onChange={(e) => setPromiseDate(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Collector Field Notes</label>
                <textarea
                  className="textarea"
                  rows={3}
                  required
                  placeholder="e.g. Spoke with manager Patrick. Promised RWF 2,000,000 bank transfer by 2 PM on Friday following weekend inventory sales."
                  value={collectorNote}
                  onChange={(e) => setCollectorNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setSelectedDebtor(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Collection Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
