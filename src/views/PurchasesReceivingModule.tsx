import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  PackageCheck,
  AlertTriangle,
  FileText,
  Calendar,
  Eye,
  Camera,
  Barcode,
  RefreshCw,
  UserCheck,
  Filter,
  ShieldCheck,
  Building2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { PurchaseOrder, GoodsReceiptReport } from '../types';
import { PurchasesReceivingCard } from '../components/purchases/PurchasesReceivingCard';

interface PurchasesReceivingModuleProps {
  initialTab?: 'orders' | 'receiving' | 'reviews' | 'suppliers';
}

export const PurchasesReceivingModule: React.FC<PurchasesReceivingModuleProps> = ({
  initialTab = 'orders'
}) => {
  const {
    purchaseOrders,
    products,
    setCurrentNav,
    setQuickCreateOpen,
    setQuickCreateType,
    receivePurchaseOrder,
    currentUser,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'receiving' | 'reviews' | 'suppliers'>(initialTab);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'received' | 'in_transit' | 'pending'>('all');
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);

  // Goods Receiving Terminal State
  const inTransitPos = purchaseOrders.filter(
    (po) => po.status === 'in_transit' || po.status === 'ordered_bralirwa' || po.status === 'pending_approval'
  );
  const [terminalPoId, setTerminalPoId] = useState<string>(
    inTransitPos[0]?.id || purchaseOrders[0]?.id || ''
  );
  const activeTerminalPo = purchaseOrders.find((p) => p.id === terminalPoId) || purchaseOrders[0];

  const [driverName, setDriverName] = useState('BRALIRWA Transport (Alphonse)');
  const [truckPlate, setTruckPlate] = useState('RAD 512 K');
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [itemsData, setItemsData] = useState<{ [productId: string]: { delivered: number; damaged: number } }>({});
  const [discrepancyReason, setDiscrepancyReason] = useState('');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [inspectorSignature, setInspectorSignature] = useState(currentUser.name);

  // Receiving state helpers
  const getItemDelivered = (productId: string, defaultOrdered: number) => {
    return itemsData[productId]?.delivered !== undefined ? itemsData[productId].delivered : defaultOrdered;
  };

  const getItemDamaged = (productId: string) => {
    return itemsData[productId]?.damaged || 0;
  };

  const setDelivered = (productId: string, val: number) => {
    setItemsData((prev) => ({
      ...prev,
      [productId]: {
        delivered: val,
        damaged: prev[productId]?.damaged || 0
      }
    }));
  };

  const setDamaged = (productId: string, val: number) => {
    setItemsData((prev) => ({
      ...prev,
      [productId]: {
        delivered: prev[productId]?.delivered || 0,
        damaged: val
      }
    }));
  };

  // Calculate terminal totals
  let totalOrdered = 0;
  let totalDelivered = 0;
  let totalDamaged = 0;

  if (activeTerminalPo) {
    activeTerminalPo.items.forEach((item) => {
      totalOrdered += item.orderedCrates;
      totalDelivered += getItemDelivered(item.productId, item.orderedCrates);
      totalDamaged += getItemDamaged(item.productId);
    });
  }

  const totalAccepted = Math.max(0, totalDelivered - totalDamaged);
  const totalVariance = Math.abs(totalOrdered - totalAccepted);

  const handleCommitReceiving = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTerminalPo) return;

    if (totalVariance > 0 && !discrepancyReason) {
      alert('A discrepancy explanation is required whenever delivery variance or damages exist.');
      return;
    }

    const report: GoodsReceiptReport = {
      receiptDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      receivedBy: currentUser.name,
      driverName,
      truckPlate,
      orderedTotal: totalOrdered,
      deliveredTotal: totalDelivered,
      damagedTotal: totalDamaged,
      acceptedTotal: totalAccepted,
      varianceTotal: totalVariance,
      discrepancyReason: totalVariance > 0 ? discrepancyReason : undefined,
      inspectorSignature
    };

    receivePurchaseOrder(activeTerminalPo.id, report);
    showToast(`Successfully received ${totalAccepted} crates into warehouse stock!`);
    setActiveTab('orders');
  };

  // Filtered POs
  const filteredPos = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      po.supplier.toLowerCase().includes(search.toLowerCase()) ||
      (po.bralirwaInvoiceNumber && po.bralirwaInvoiceNumber.toLowerCase().includes(search.toLowerCase())) ||
      (po.deliveryNoteNumber && po.deliveryNoteNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'received'
        ? po.status === 'received'
        : statusFilter === 'in_transit'
        ? po.status === 'in_transit'
        : (po.status === 'ordered_bralirwa' || po.status === 'pending_approval' || po.status === 'draft');

    return matchesSearch && matchesStatus;
  });

  // Flagged reviews
  const reviewOrders = purchaseOrders.filter(
    (po) => po.receivingReport?.varianceTotal && po.receivingReport.varianceTotal > 0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '50px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38BDF8',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}
            >
              Unified Supply Chain
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>BRALIRWA Official Distributor Ops</span>
          </div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: 'var(--font-display, sans-serif)',
              letterSpacing: '-0.02em',
              margin: 0
            }}
          >
            Purchases &amp; Receiving
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '3px' }}>
            Direct brewery procurement, supply logistics, goods receiving terminal &amp; variance audit
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('receiving')}
            className={`btn ${activeTab === 'receiving' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              borderColor: activeTab === 'receiving' ? undefined : 'rgba(52, 211, 153, 0.4)',
              color: activeTab === 'receiving' ? undefined : '#34D399'
            }}
          >
            <PackageCheck size={16} />
            <span>Dock Receiving Terminal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setQuickCreateType('po');
              setQuickCreateOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>New BRALIRWA PO</span>
          </button>
        </div>
      </div>

      {/* Hero Grid: Requested Card (Left) + Supply Headroom & Live Dock Status (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.25fr) minmax(300px, 1fr)', gap: '20px' }}>
        {/* Exact User Requested Card: PURCHASES & RECEIVING Supply Overview */}
        <PurchasesReceivingCard
          onOpenReceivingTerminal={() => setActiveTab('receiving')}
        />

        {/* Companion Card: Brewery Credit Facility & Dock Telemetry */}
        <div
          style={{
            backgroundColor: 'rgba(8, 22, 50, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '18px',
            padding: '24px 26px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.45)'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  BREWERY CREDIT FACILITY
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '3px 0 0 0' }}>
                  BRALIRWA Plc Credit Headroom
                </h3>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                Grade A Tier
              </span>
            </div>

            {/* Credit Numbers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '18px' }}>
              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.035)', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Available Headroom</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#10B981', marginTop: '2px' }}>
                  RWF 37.5M
                </div>
                <div style={{ fontSize: '10.5px', color: '#6EE7B7' }}>Safe for 2 truckloads</div>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.035)', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Facility Limit</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
                  RWF 150.0M
                </div>
                <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>Utilized: RWF 112.5M (75%)</div>
              </div>
            </div>

            {/* In-Transit Live Status Box */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                marginBottom: '14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} color="#38BDF8" />
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF' }}>
                    1 Shipment In Transit from Gisenyi
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 700 }}>PO-BRAL-2026-099</span>
              </div>
              <p style={{ fontSize: '11.5px', color: '#CBD5E1', margin: '6px 0 0 0' }}>
                Truck <strong style={{ color: '#FFFFFF' }}>RAD 512 K</strong> dispatched at 09:30. Estimated arrival at Gikondo depot: <strong style={{ color: '#38BDF8' }}>Today 16:30</strong> (20 crates Mutzig 50cl).
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('receiving')}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <PackageCheck size={14} />
              <span>Open Dock Terminal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setQuickCreateType('po');
                setQuickCreateOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Plus size={14} />
              <span>Direct Brewery PO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '12px',
          marginTop: '6px'
        }}
      >
        {[
          { id: 'orders', label: 'Purchase Orders & Pipeline', count: purchaseOrders.length },
          { id: 'receiving', label: 'Dock Goods Receiving Terminal', badge: 'Active Bay' },
          { id: 'reviews', label: 'Discrepancies & Reviews', count: reviewOrders.length, alert: true },
          { id: 'suppliers', label: 'Brewery Suppliers & Terms' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              backgroundColor: activeTab === tab.id ? 'rgba(56, 189, 248, 0.16)' : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === tab.id ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeTab === tab.id ? '#38BDF8' : '#CBD5E1',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 700 : 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: tab.alert ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.12)',
                  color: tab.alert ? '#FBBF24' : '#FFFFFF',
                  fontWeight: 700
                }}
              >
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span
                style={{
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#34D399',
                  fontWeight: 700
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: ORDERS & PIPELINE */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* PO Workflow visual pipeline (Section 11) */}
          <div
            className="card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#08132A',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              overflowX: 'auto'
            }}
          >
            {[
              { step: '1', title: 'Purchase Request', desc: 'Auto or Manual' },
              { step: '2', title: 'Internal Approval', desc: 'Owner / GM' },
              { step: '3', title: 'PO to BRALIRWA', desc: 'Brewery EDI' },
              { step: '4', title: 'Factory Dispatch', desc: 'Truck Loading' },
              { step: '5', title: 'Goods Received', desc: 'Dock Inspection' },
              { step: '6', title: 'Stock Updated', desc: 'Instant Live Matrix' }
            ].map((s, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '130px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: idx < 5 ? '#16A36A' : '#38BDF8',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{s.title}</div>
                    <div style={{ fontSize: '10px', color: '#CBD5E1' }}>{s.desc}</div>
                  </div>
                </div>
                {idx < 5 && <div style={{ width: '16px', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />}
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div
              className="card"
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#0B1733',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <Search size={16} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search by PO number, BRALIRWA invoice, delivery note..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  width: '100%',
                  color: '#FFFFFF'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {(['all', 'received', 'in_transit', 'pending'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    border: '1px solid',
                    cursor: 'pointer',
                    backgroundColor: statusFilter === st ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    borderColor: statusFilter === st ? '#38BDF8' : 'rgba(255, 255, 255, 0.1)',
                    color: statusFilter === st ? '#38BDF8' : '#94A3B8'
                  }}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* PO Table */}
          <div className="table-wrapper">
            <table className="data-table responsive-stack">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier Source</th>
                  <th>Order Date</th>
                  <th>Expected Date</th>
                  <th>Total Crates</th>
                  <th>Total Amount (RWF)</th>
                  <th>BRALIRWA Invoice</th>
                  <th>Delivery Note</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPos.map((po) => {
                  const totalCrates = po.items.reduce((a, b) => a + b.orderedCrates, 0);
                  const isReviewRequired = Boolean(po.receivingReport?.varianceTotal && po.receivingReport.varianceTotal > 0);

                  return (
                    <tr key={po.id} style={{ backgroundColor: isReviewRequired ? 'rgba(245, 158, 11, 0.05)' : undefined }}>
                      <td data-label="PO Number">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong style={{ color: '#FFFFFF', fontSize: '13.5px' }}>{po.poNumber}</strong>
                          {isReviewRequired && (
                            <span title="Delivery requires review" style={{ color: '#FBBF24' }}>
                              <AlertTriangle size={13} />
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>Req: {po.requestedBy}</div>
                      </td>
                      <td data-label="Supplier">
                        <span style={{ fontWeight: 500, color: '#FFFFFF' }}>{po.supplier}</span>
                      </td>
                      <td data-label="Order Date" style={{ fontSize: '12.5px', color: '#CBD5E1' }}>
                        {po.orderDate}
                      </td>
                      <td data-label="Expected Date" style={{ fontSize: '12.5px', color: '#CBD5E1' }}>
                        {po.expectedDeliveryDate}
                      </td>
                      <td data-label="Total Crates" className="tabular-nums" style={{ fontWeight: 700, color: '#FFFFFF' }}>
                        {totalCrates.toLocaleString()}
                      </td>
                      <td data-label="Total Amount" className="tabular-nums" style={{ fontWeight: 700, color: '#34D399' }}>
                        RWF {po.totalAmount.toLocaleString()}
                      </td>
                      <td data-label="Invoice">
                        <span style={{ fontSize: '12px', color: po.bralirwaInvoiceNumber ? '#FFFFFF' : '#94A3B8' }}>
                          {po.bralirwaInvoiceNumber || 'Pending'}
                        </span>
                      </td>
                      <td data-label="Delivery Note">
                        <span style={{ fontSize: '12px', color: po.deliveryNoteNumber ? '#FFFFFF' : '#94A3B8' }}>
                          {po.deliveryNoteNumber || 'Pending'}
                        </span>
                      </td>
                      <td data-label="Status">
                        <span
                          className={`badge ${
                            po.status === 'received'
                              ? 'badge-success'
                              : po.status === 'in_transit'
                              ? 'badge-info'
                              : 'badge-warning'
                          }`}
                        >
                          {po.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td data-label="Action">
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedPo(po)}
                            className="btn btn-secondary btn-sm"
                            title="View PO Details"
                          >
                            <Eye size={13} />
                          </button>
                          {(po.status === 'in_transit' || po.status === 'ordered_bralirwa') && (
                            <button
                              type="button"
                              onClick={() => {
                                setTerminalPoId(po.id);
                                setActiveTab('receiving');
                              }}
                              className="btn btn-primary btn-sm"
                              title="Receive Goods"
                            >
                              Receive
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DOCK GOODS RECEIVING TERMINAL */}
      {activeTab === 'receiving' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active PO Selector & Trailer Info */}
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.9)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Dock Receiving Inspection Terminal
                </h3>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Select incoming purchase order to verify crates, log broken bottles, and reconcile delivery notes
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Inbound PO:</span>
                <select
                  value={terminalPoId}
                  onChange={(e) => setTerminalPoId(e.target.value)}
                  style={{
                    backgroundColor: '#0F1E3D',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  {purchaseOrders.map((po) => (
                    <option key={po.id} value={po.id}>
                      {po.poNumber} — {po.supplier} ({po.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trailer & Driver Form */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label className="label" style={{ fontSize: '11px', color: '#94A3B8' }}>BRALIRWA Driver Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="input"
                  style={{ fontSize: '13px', backgroundColor: '#0B1733', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.14)' }}
                />
              </div>

              <div>
                <label className="label" style={{ fontSize: '11px', color: '#94A3B8' }}>Truck / Trailer Plate</label>
                <input
                  type="text"
                  value={truckPlate}
                  onChange={(e) => setTruckPlate(e.target.value)}
                  className="input"
                  style={{ fontSize: '13px', backgroundColor: '#0B1733', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.14)' }}
                />
              </div>

              <div>
                <label className="label" style={{ fontSize: '11px', color: '#94A3B8' }}>Receiving Storekeeper</label>
                <input
                  type="text"
                  value={inspectorSignature}
                  onChange={(e) => setInspectorSignature(e.target.value)}
                  className="input"
                  style={{ fontSize: '13px', backgroundColor: '#0B1733', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.14)' }}
                />
              </div>
            </div>
          </div>

          {/* Quantitative Receiving Inspection Summary */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              padding: '16px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Ordered Total</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                {totalOrdered.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8' }}>crates</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Delivered at Dock</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>
                {totalDelivered.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8' }}>crates</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Damaged / Broken</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: totalDamaged > 0 ? '#F87171' : '#94A3B8', marginTop: '2px' }}>
                {totalDamaged.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8' }}>crates</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Accepted into Stock</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#34D399', marginTop: '2px' }}>
                {totalAccepted.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8' }}>crates</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Delivery Variance</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: totalVariance > 0 ? '#FBBF24' : '#10B981', marginTop: '2px' }}>
                {totalVariance > 0 ? `-${totalVariance}` : '0'} <span style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8' }}>crates</span>
              </div>
            </div>
          </div>

          {/* Items Inspection Table */}
          {activeTerminalPo && (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Ordered</th>
                    <th>Delivered Crates</th>
                    <th>Broken / Damaged</th>
                    <th>Accepted Crates</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTerminalPo.items.map((item) => {
                    const prod = products.find((p) => p.id === item.productId);
                    const delivered = getItemDelivered(item.productId, item.orderedCrates);
                    const damaged = getItemDamaged(item.productId);
                    const accepted = Math.max(0, delivered - damaged);
                    const hasVariance = delivered !== item.orderedCrates || damaged > 0;

                    return (
                      <tr key={item.productId}>
                        <td>
                          <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{prod?.name || item.productId}</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{prod?.packaging}</div>
                        </td>
                        <td className="tabular-nums" style={{ fontWeight: 700, color: '#FFFFFF' }}>
                          {item.orderedCrates} cr
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={delivered}
                            onChange={(e) => setDelivered(item.productId, parseInt(e.target.value) || 0)}
                            style={{
                              width: '90px',
                              backgroundColor: '#0A1835',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: '#FFFFFF',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              fontWeight: 700
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={damaged}
                            onChange={(e) => setDamaged(item.productId, parseInt(e.target.value) || 0)}
                            style={{
                              width: '90px',
                              backgroundColor: '#0A1835',
                              border: damaged > 0 ? '1px solid #F87171' : '1px solid rgba(255, 255, 255, 0.2)',
                              color: damaged > 0 ? '#F87171' : '#FFFFFF',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              fontWeight: 700
                            }}
                          />
                        </td>
                        <td className="tabular-nums" style={{ fontWeight: 800, color: '#34D399' }}>
                          {accepted} cr
                        </td>
                        <td>
                          {hasVariance ? (
                            <span style={{ fontSize: '11.5px', color: '#FBBF24', fontWeight: 700 }}>
                              ⚠️ Variance ({item.orderedCrates - accepted} cr)
                            </span>
                          ) : (
                            <span style={{ fontSize: '11.5px', color: '#34D399', fontWeight: 700 }}>
                              ✓ Full Match
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Variance & Commit Form */}
          {totalVariance > 0 && (
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#FDE68A' }}>
                Discrepancy / Damage Explanation (Mandatory for Variance)
              </label>
              <textarea
                value={discrepancyReason}
                onChange={(e) => setDiscrepancyReason(e.target.value)}
                placeholder="State the reason for missing crates or in-transit broken bottles (e.g. Broken during transit from Gisenyi, pallet seal broken, etc.)..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#08142A',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px'
                }}
              />
            </div>
          )}

          {/* Commit Receiving Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCommitReceiving}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '14px', backgroundColor: '#16A36A' }}
            >
              <CheckCircle2 size={16} />
              <span>Confirm &amp; Post Stock Inbound ({totalAccepted} Crates)</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: DISCREPANCIES & REVIEWS */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.24)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} color="#FBBF24" />
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Active Goods Receiving Discrepancy Audits
                </h4>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0 0' }}>
                  Deliveries where received count differs from factory invoice or where broken bottles were reported
                </p>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#FBBF24' }}>
              1 Delivery Requires Review
            </span>
          </div>

          {/* Flagged Delivery Details Card */}
          <div
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.9)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '16px', color: '#FFFFFF' }}>PO-BRAL-2026-088</strong>
                  <span className="badge badge-warning">Review Pending</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                  Supplier: BRALIRWA Plc - Kigali Depot • Received: 2026-09-26 14:15
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#F87171' }}>
                  -27 Crates Discrepancy
                </div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                  Est. Credit Value: <strong style={{ color: '#FBBF24' }}>RWF 261,900</strong>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                fontSize: '12.5px',
                lineHeight: 1.5,
                color: '#E2E8F0'
              }}
            >
              <strong style={{ color: '#F87171' }}>Storekeeper Notes: </strong>
              "Factory loading slip indicated 200 crates Coca-Cola but pallet seal #9 had 20 crates missing. 7 crates broken during transit from Kigali depot."
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#94A3B8' }}>Delivery Truck:</span>
                <div style={{ fontWeight: 700, color: '#FFFFFF' }}>RAD 512 K (Driver: Kassim)</div>
              </div>
              <div>
                <span style={{ color: '#94A3B8' }}>Storekeeper:</span>
                <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Célestin Twagiramungu</div>
              </div>
              <div>
                <span style={{ color: '#94A3B8' }}>BRALIRWA Invoice:</span>
                <div style={{ fontWeight: 700, color: '#38BDF8' }}>INV-BRAL-KGL-77219</div>
              </div>
              <div>
                <span style={{ color: '#94A3B8' }}>Delivery Note:</span>
                <div style={{ fontWeight: 700, color: '#38BDF8' }}>DN-BRAL-77219</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
              <button
                type="button"
                onClick={() => showToast('Claim sent to BRALIRWA Area Manager via email & EDI.')}
                className="btn btn-secondary btn-sm"
              >
                <FileText size={14} />
                <span>Download Credit Claim Notice</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Discrepancy officially resolved and posted to Accounts Payable credit ledger.')}
                className="btn btn-primary btn-sm"
              >
                <CheckCircle2 size={14} />
                <span>Approve &amp; Close Review</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BREWERY SUPPLIERS & TERMS */}
      {activeTab === 'suppliers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          <div
            style={{
              padding: '22px',
              backgroundColor: 'rgba(8, 22, 50, 0.9)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Building2 size={20} color="#38BDF8" />
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  BRALIRWA Plc - Gisenyi Brewery
                </h4>
                <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>Rubavu District, Western Province</span>
              </div>
            </div>
            <p style={{ fontSize: '12.5px', color: '#CBD5E1', lineHeight: 1.5 }}>
              Primary manufacturing source for Primus, Mutzig, Amstel, and Turbo King draught and bottled beers. Standard long-haul trailer dispatch with 48h lead time.
            </p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Min Order: <strong style={{ color: '#FFFFFF' }}>1,200 Crates (Full Trailer)</strong></div>
              <div>Payment Terms: <strong style={{ color: '#10B981' }}>Net 30 Days</strong></div>
              <div>Dispatch Window: <strong style={{ color: '#FFFFFF' }}>Mon - Fri, 07:00 - 18:00</strong></div>
            </div>
          </div>

          <div
            style={{
              padding: '22px',
              backgroundColor: 'rgba(8, 22, 50, 0.9)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Building2 size={20} color="#FBBF24" />
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  BRALIRWA Plc - Kigali Regional Depot
                </h4>
                <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>Kicukiro / Gikondo Industrial Area</span>
              </div>
            </div>
            <p style={{ fontSize: '12.5px', color: '#CBD5E1', lineHeight: 1.5 }}>
              Regional hub supplying Coca-Cola brands (Coke, Fanta, Sprite, Vitalo) and emergency stock replenishment for beers. Same-day dock collection or depot delivery.
            </p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Min Order: <strong style={{ color: '#FFFFFF' }}>100 Crates</strong></div>
              <div>Payment Terms: <strong style={{ color: '#10B981' }}>Weekly Sweep Account</strong></div>
              <div>Collection Turnaround: <strong style={{ color: '#FFFFFF' }}>2 Hours Notice</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* PO Detail Modal */}
      {selectedPo && (
        <div className="modal-backdrop" onClick={() => setSelectedPo(null)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#08132A' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
                Purchase Order Details — {selectedPo.poNumber}
              </h3>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>Supplier: {selectedPo.supplier}</p>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '14px', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>BRALIRWA Invoice</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#FFFFFF' }}>{selectedPo.bralirwaInvoiceNumber || 'Pending'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Delivery Note</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#FFFFFF' }}>{selectedPo.deliveryNoteNumber || 'Pending'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>PO Status</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, textTransform: 'uppercase', color: '#34D399' }}>
                    {selectedPo.status}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Ordered</th>
                      <th>Unit Price</th>
                      <th>Total Amount</th>
                      <th>Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPo.items.map((it, idx) => {
                      const prod = products.find((p) => p.id === it.productId);
                      return (
                        <tr key={idx}>
                          <td>{prod?.name || it.productId}</td>
                          <td className="tabular-nums">{it.orderedCrates} crates</td>
                          <td className="tabular-nums">RWF {it.unitPrice.toLocaleString()}</td>
                          <td className="tabular-nums" style={{ color: '#34D399', fontWeight: 700 }}>
                            RWF {it.totalAmount.toLocaleString()}
                          </td>
                          <td className="tabular-nums">
                            {it.receivedCrates !== undefined ? `${it.receivedCrates} crates` : 'Pending'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Receiving Report if available */}
              {selectedPo.receivingReport && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.25)', fontSize: '12.5px' }}>
                  <strong style={{ color: '#34D399' }}>Verified Goods Receipt Report</strong>
                  <div style={{ marginTop: '4px', color: '#CBD5E1', lineHeight: 1.5 }}>
                    Inspected on {selectedPo.receivingReport.receiptDate} by {selectedPo.receivingReport.receivedBy}.<br />
                    Delivered by {selectedPo.receivingReport.driverName} (Truck {selectedPo.receivingReport.truckPlate}).<br />
                    Accepted: <strong style={{ color: '#FFFFFF' }}>{selectedPo.receivingReport.acceptedTotal} crates</strong> | Damaged: <strong style={{ color: '#F87171' }}>{selectedPo.receivingReport.damagedTotal} crates</strong> | Discrepancy Variance: <strong style={{ color: '#FBBF24' }}>{selectedPo.receivingReport.varianceTotal} crates</strong>.
                  </div>
                  {selectedPo.receivingReport.discrepancyReason && (
                    <div style={{ marginTop: '4px', color: '#FDE68A', fontStyle: 'italic' }}>
                      Reason: "{selectedPo.receivingReport.discrepancyReason}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedPo(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
