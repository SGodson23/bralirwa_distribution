import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BadgeDollarSign,
  AlertTriangle,
  CheckCircle2,
  Lock,
  FileCheck,
  Building,
  Smartphone,
  CreditCard,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

export const CashReconciliationModule: React.FC = () => {
  const {
    cashReconciliation,
    submitCashReconciliation,
    approveCashReconciliation,
    currentUser,
    showToast
  } = useApp();

  const [actualCash, setActualCash] = useState<number>(cashReconciliation.actualCashCounted);
  const [actualMoMo, setActualMoMo] = useState<number>(cashReconciliation.actualMoMoCounted);
  const [actualBank, setActualBank] = useState<number>(cashReconciliation.actualBankCounted);
  const [explanation, setExplanation] = useState<string>(cashReconciliation.discrepancyExplanation || '');

  const totalActual = actualCash + actualMoMo + actualBank;
  const variance = cashReconciliation.expectedTotal - (totalActual + cashReconciliation.expectedCredit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCashReconciliation(actualCash, actualMoMo, actualBank, explanation);
  };

  const isApproved = cashReconciliation.status === 'reconciled';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-warning">Daily End-of-Day Balancing</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1' }}>Date: {cashReconciliation.date} • Branch: Gikondo Hub</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>Cash & Payment Reconciliation</h1>
          <p style={{ fontSize: '13px', color: '#CBD5E1' }}>
            Strict daily balancing between route driver collections, MoMo gateway, Bank of Kigali, and physical cash drawer
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isApproved ? (
            <span className="badge badge-success" style={{ padding: '8px 14px', fontSize: '13px' }}>
              <CheckCircle2 size={16} /> Reconciled & Approved by {cashReconciliation.approvedBy}
            </span>
          ) : (
            <button
              onClick={() => approveCashReconciliation(cashReconciliation.id)}
              className="btn btn-primary"
            >
              <UserCheck size={16} />
              <span>Manager Approve & Close Drawer</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 25: Expected vs Actual Collections Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left: Interactive Input Form */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
            Physical Vault Count & Gateway Verification
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Cash */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="label">1. Physical Cash Counted in Vault (RWF)</label>
                <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                  Expected: <strong>RWF {cashReconciliation.expectedCash.toLocaleString()}</strong>
                </span>
              </div>
              <input
                type="number"
                step="1000"
                className="input"
                value={actualCash}
                onChange={(e) => setActualCash(parseInt(e.target.value) || 0)}
              />
            </div>

            {/* MTN MoMo */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="label">2. MTN Mobile Money Merchant Balance (RWF)</label>
                <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                  Expected: <strong>RWF {cashReconciliation.expectedMoMo.toLocaleString()}</strong>
                </span>
              </div>
              <input
                type="number"
                step="1000"
                className="input"
                value={actualMoMo}
                onChange={(e) => setActualMoMo(parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Bank */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="label">3. Bank of Kigali Deposit Receipts (RWF)</label>
                <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                  Expected: <strong>RWF {cashReconciliation.expectedBank.toLocaleString()}</strong>
                </span>
              </div>
              <input
                type="number"
                step="1000"
                className="input"
                value={actualBank}
                onChange={(e) => setActualBank(parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Credit (Non-cash) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="label">4. Authorized Credit Invoices (Non-Cash)</label>
                <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                  Fixed Terms: <strong>RWF {cashReconciliation.expectedCredit.toLocaleString()}</strong>
                </span>
              </div>
              <input
                type="text"
                disabled
                className="input"
                value={`RWF ${cashReconciliation.expectedCredit.toLocaleString()}`}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#CBD5E1', borderColor: 'rgba(255, 255, 255, 0.15)' }}
              />
            </div>

            {/* Discrepancy Explanation */}
            <div>
              <label className="label">
                Discrepancy Explanation {variance !== 0 && <span style={{ color: '#E5484D' }}>* (Required)</span>}
              </label>
              <textarea
                className="textarea"
                rows={3}
                placeholder="e.g. Driver Eric N. collected RWF 120,000 cash from Choma House which was handed over in sealed drop envelope awaiting vault count at 17:00."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              Save Balancing Counts
            </button>
          </form>
        </div>

        {/* Right: Variance Breakdown Card (Section 25 exact match) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            className="card"
            style={{
              padding: '24px',
              backgroundColor: '#0B1220',
              color: '#FFFFFF',
              borderRadius: '14px'
            }}
          >
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              EXPECTED COLLECTIONS TOTAL
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: '6px 0 16px' }} className="tabular-nums">
              RWF {cashReconciliation.expectedTotal.toLocaleString()}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #1C2B47', paddingTop: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Expected Cash:</span>
                <span className="tabular-nums">RWF 8,200,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Expected MoMo:</span>
                <span className="tabular-nums">RWF 4,800,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Expected Bank:</span>
                <span className="tabular-nums">RWF 2,500,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Credit Terms:</span>
                <span className="tabular-nums">RWF 1,400,000</span>
              </div>
            </div>
          </div>

          {/* Variance Box */}
          <div
            className="card"
            style={{
              padding: '20px',
              backgroundColor: variance !== 0 ? '#FEF6EB' : '#ECFDF5',
              border: `1.5px solid ${variance !== 0 ? '#F2A93B' : '#A7F3D0'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: variance !== 0 ? '#92400E' : '#065F46', textTransform: 'uppercase' }}>
                  RECONCILIATION VARIANCE
                </div>
                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: 800,
                    color: variance !== 0 ? '#92400E' : '#065F46',
                    marginTop: '4px'
                  }}
                  className="tabular-nums"
                >
                  RWF {variance.toLocaleString()}
                </div>
              </div>
              {variance === 0 ? (
                <CheckCircle2 size={32} color="#16A36A" />
              ) : (
                <AlertTriangle size={32} color="#F2A93B" />
              )}
            </div>

            <div style={{ marginTop: '12px', fontSize: '12px', color: variance !== 0 ? '#92400E' : '#065F46' }}>
              {variance !== 0
                ? 'Explanation logged by Cashier. General Manager review required before ledger closure.'
                : 'All collection streams balanced 100% with bank receipts and cash vault count.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
