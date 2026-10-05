import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Building,
  Key,
  CreditCard,
  RotateCcw,
  Users,
  Bell,
  Save,
  CheckCircle2,
  Shield,
  Smartphone,
  Server
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { currentTenant, currentUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'bralirwa' | 'payments' | 'crates' | 'roles'>('profile');

  // Form states
  const [tenantName, setTenantName] = useState(currentTenant.name);
  const [tinNumber, setTinNumber] = useState(currentTenant.tinNumber);
  const [licenseNumber, setLicenseNumber] = useState(currentTenant.licenseNumber);
  const [phone, setPhone] = useState(currentTenant.phone);
  const [email, setEmail] = useState(currentTenant.email);
  const [address, setAddress] = useState(currentTenant.address);

  // BRALIRWA SAP settings
  const [sapDepotCode, setSapDepotCode] = useState('BRAL-KGL-DEPOT-04');
  const [ediEndpoint, setEdiEndpoint] = useState('https://sap-edi.bralirwa.rw/v2/orders');
  const [autoAsnSync, setAutoAsnSync] = useState(true);

  // Payment settings
  const [momoMerchantCode, setMomoMerchantCode] = useState('684920');
  const [airtelMerchantId, setAirtelMerchantId] = useState('RW-AIRTEL-4412');
  const [bkAccountNumber, setBkAccountNumber] = useState('00040-06948201-92');

  // Crate deposit settings
  const [crateDeposit, setCrateDeposit] = useState(4000);
  const [bottleDeposit, setBottleDeposit] = useState(150);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Enterprise settings successfully saved & synchronized');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(5, 14, 34, 0.7)',
    color: '#FFFFFF',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#CBD5E1',
    display: 'block',
    marginBottom: '6px'
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              System Configuration
            </span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>•</span>
            <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: 600 }}>BRALIRWA Integration</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            DistributorOS Enterprise Settings
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '6px' }}>
            Configure partner SAP endpoints, MTN MoMo payment gateways, crate deposit policies, and user permissions
          </p>
        </div>

        <button
          onClick={handleSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '11px 22px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '13.5px',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
            transition: 'all 0.15s ease'
          }}
        >
          <Save size={16} />
          Save Configurations
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { id: 'profile', label: 'Company Profile', icon: Building },
          { id: 'bralirwa', label: 'BRALIRWA SAP / EDI', icon: Server },
          { id: 'payments', label: 'MoMo & Bank Gateways', icon: CreditCard },
          { id: 'crates', label: 'Crates & Bottle Deposits', icon: RotateCcw },
          { id: 'roles', label: 'User Roles & Access', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#38BDF8' : '#CBD5E1',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>Distributor Legal Entity</h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>Official registration and tax credentials recognized by BRALIRWA Plc and Rwanda Revenue Authority (RRA)</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Distributor Company Name</label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>RRA Taxpayer Identification Number (TIN)</label>
              <input
                type="text"
                value={tinNumber}
                onChange={(e) => setTinNumber(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>BRALIRWA Official Distributor License #</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Official Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Accounting Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Physical Depot Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: BRALIRWA SAP */}
      {activeTab === 'bralirwa' && (
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>BRALIRWA SAP & EDI Electronic Ordering</h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>Direct integration with BRALIRWA Gisenyi Brewery & Kigali Depot SAP S/4HANA</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <label style={labelStyle}>BRALIRWA Depot Partner Code</label>
              <input
                type="text"
                value={sapDepotCode}
                onChange={(e) => setSapDepotCode(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>EDI Secure Gateway Endpoint</label>
              <input
                type="text"
                value={ediEndpoint}
                onChange={(e) => setEdiEndpoint(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: '22px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600, color: '#FFFFFF', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoAsnSync}
                onChange={(e) => setAutoAsnSync(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
              />
              Automatically sync Advanced Shipping Notices (ASN) and Electronic Delivery Notes from Gisenyi trucks
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: Payments */}
      {activeTab === 'payments' && (
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>Mobile Money & Commercial Banking</h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>Real-time payment callback integration for retail bar settlements</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <label style={labelStyle}>MTN Mobile Money MoMo Pay Merchant Code</label>
              <input
                type="text"
                value={momoMerchantCode}
                onChange={(e) => setMomoMerchantCode(e.target.value)}
                style={inputStyle}
              />
              <span style={{ fontSize: '12px', color: '#38BDF8', marginTop: '6px', display: 'block' }}>Retailers dial *182*8*1*{momoMerchantCode}#</span>
            </div>

            <div>
              <label style={labelStyle}>Airtel Money Corporate Merchant ID</label>
              <input
                type="text"
                value={airtelMerchantId}
                onChange={(e) => setAirtelMerchantId(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Bank of Kigali (BK) Main Operating Account</label>
              <input
                type="text"
                value={bkAccountNumber}
                onChange={(e) => setBkAccountNumber(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Crates */}
      {activeTab === 'crates' && (
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>Empty Crates & Returnable Packaging Policy</h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>Set deposit fees and default recovery thresholds across bars and hotels</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Standard Crate Deposit (RWF)</label>
              <input
                type="number"
                value={crateDeposit}
                onChange={(e) => setCrateDeposit(Number(e.target.value))}
                style={inputStyle}
              />
              <span style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px', display: 'block' }}>Mandatory deposit held per empty 24-bottle plastic crate</span>
            </div>

            <div>
              <label style={labelStyle}>Glass Bottle Breakage Deposit (RWF)</label>
              <input
                type="number"
                value={bottleDeposit}
                onChange={(e) => setBottleDeposit(Number(e.target.value))}
                style={inputStyle}
              />
              <span style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px', display: 'block' }}>Deducted if returned crate has missing or broken bottles</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Roles */}
      {activeTab === 'roles' && (
        <div className="glass-card" style={{ padding: '30px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>Enterprise Role Permission Matrix</h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>Granular permissions across operations, accounting, inventory, and logistics</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(5, 14, 34, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#CBD5E1', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Role Title</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Create Orders</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Approve Credit</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Cash Count</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Stock Adjustment</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>BRALIRWA PO</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: 'Distributor Owner', o: true, c: true, ch: true, s: true, po: true },
                { title: 'General Manager', o: true, c: true, ch: true, s: true, po: true },
                { title: 'Senior Accountant', o: true, c: false, ch: true, s: false, po: true },
                { title: 'Warehouse Manager', o: false, c: false, ch: false, s: true, po: true },
                { title: 'Sales Manager', o: true, c: false, ch: false, s: false, po: false },
                { title: 'Delivery Driver', o: false, c: false, ch: false, s: false, po: false },
                { title: 'Chief Cashier', o: false, c: false, ch: true, s: false, po: false }
              ].map((r) => (
                <tr key={r.title} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#FFFFFF' }}>{r.title}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>{r.o ? '✅' : '—'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>{r.c ? '✅' : '—'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>{r.ch ? '✅' : '—'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>{r.s ? '✅' : '—'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>{r.po ? '✅' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
