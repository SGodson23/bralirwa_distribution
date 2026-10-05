import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Zap,
  Eye,
  AlertTriangle,
  Send,
  UserCheck
} from 'lucide-react';
import { SalesOrder, OrderStatus } from '../types';

export const SalesOrdersModule: React.FC = () => {
  const {
    salesOrders,
    updateOrderStatus,
    approveCreditOverlimit,
    currentUser,
    setQuickCreateOpen,
    setQuickCreateType,
    setCurrentNav
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  const filteredOrders = salesOrders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.salespersonName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses: OrderStatus[] = [
    'draft',
    'pending_approval',
    'approved',
    'picking',
    'loaded',
    'dispatched',
    'delivered',
    'paid',
    'closed'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Sales & Order Management</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setCurrentNav('quick_order')}
            className="btn btn-secondary"
            style={{ color: '#D5A021', borderColor: '#FDE68A', padding: '6px 14px', fontSize: '12.5px' }}
          >
            <Zap size={14} />
            <span>Open Quick POS</span>
          </button>
          <button
            onClick={() => {
              setQuickCreateType('order');
              setQuickCreateOpen(true);
            }}
            className="btn btn-primary"
            style={{ padding: '6px 14px', fontSize: '12.5px' }}
          >
            <Plus size={14} />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Order Lifecycle Pipeline Visualizer (Section 14) */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          backgroundColor: '#0B1220',
          color: '#FFFFFF'
        }}
      >
        {[
          { label: 'Draft', desc: 'Field entry' },
          { label: 'Pending Approval', desc: 'Credit check' },
          { label: 'Approved', desc: 'Ready' },
          { label: 'Picking', desc: 'Warehouse staging' },
          { label: 'Loaded', desc: 'On Truck' },
          { label: 'Dispatched', desc: 'In Transit' },
          { label: 'Delivered', desc: 'POD & Empties' },
          { label: 'Paid & Closed', desc: 'Reconciled' }
        ].map((step, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>{step.label}</div>
              <div style={{ fontSize: '10px', color: '#CBD5E1' }}>{step.desc}</div>
            </div>
            {idx < 7 && <span style={{ color: '#94A3B8', fontSize: '14px' }}>→</span>}
          </div>
        ))}
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
          gap: '12px',
          backgroundColor: '#0B1733',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '280px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '6px 12px', borderRadius: '8px' }}>
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search by order number, retailer, salesperson..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: '#FFFFFF' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
          <span style={{ fontSize: '12px', color: '#CBD5E1' }}>Status:</span>
          {['all', 'pending_approval', 'approved', 'picking', 'loaded', 'dispatched', 'delivered', 'paid'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: statusFilter === st ? 600 : 400,
                borderRadius: '6px',
                border: '1px solid',
                borderColor: statusFilter === st ? '#16A36A' : 'rgba(255, 255, 255, 0.12)',
                backgroundColor: statusFilter === st ? 'rgba(22, 163, 106, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: statusFilter === st ? '#34D399' : '#CBD5E1',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-wrapper">
        <table className="data-table responsive-stack">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer / Retailer</th>
              <th>Order Date</th>
              <th>Crates Expected</th>
              <th>Grand Total (RWF)</th>
              <th>Payment Method</th>
              <th>Assigned Truck & Driver</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((ord) => {
              const totalCrates = ord.items.reduce((a, b) => a + b.quantityCrates, 0);
              return (
                <tr key={ord.id}>
                  <td data-label="Order ID">
                    <strong style={{ color: '#FFFFFF', fontSize: '13.5px' }}>{ord.orderNumber}</strong>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>Rep: {ord.salespersonName}</div>
                  </td>
                  <td data-label="Customer">
                    <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{ord.customerName}</span>
                  </td>
                  <td data-label="Date" style={{ fontSize: '12.5px', color: '#CBD5E1' }}>
                    {ord.orderDate}
                  </td>
                  <td data-label="Crates" className="tabular-nums">
                    <strong style={{ color: '#FFFFFF' }}>{totalCrates}</strong> crates
                  </td>
                  <td data-label="Grand Total" className="tabular-nums" style={{ fontWeight: 800, color: '#34D399' }}>
                    RWF {ord.grandTotal.toLocaleString()}
                  </td>
                  <td data-label="Payment">
                    <span className="badge badge-neutral">{ord.paymentMethod}</span>
                  </td>
                  <td data-label="Truck & Driver" style={{ fontSize: '12.5px' }}>
                    {ord.assignedTruck ? (
                      <div>
                        <strong style={{ color: '#FFFFFF' }}>{ord.assignedTruck}</strong>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{ord.assignedDriver}</div>
                      </div>
                    ) : (
                      <span style={{ color: '#94A3B8' }}>Unassigned</span>
                    )}
                  </td>
                  <td data-label="Status">
                    <span
                      className={`badge ${
                        ord.status === 'delivered' || ord.status === 'paid'
                          ? 'badge-success'
                          : ord.status === 'dispatched' || ord.status === 'loaded'
                          ? 'badge-info'
                          : ord.status === 'pending_approval'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {ord.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="btn btn-secondary btn-sm"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Detail & Approval Drawer */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#08132A' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF' }}>
                    {selectedOrder.orderNumber} — {selectedOrder.customerName}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Salesperson: {selectedOrder.salespersonName} • Placed on {selectedOrder.orderDate}
                  </p>
                </div>
                <span className={`badge ${selectedOrder.status === 'paid' ? 'badge-success' : 'badge-info'}`}>
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Over-limit credit notice & manager approval button */}
              {selectedOrder.status === 'pending_approval' && (
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(242, 169, 59, 0.15)',
                    border: '1px solid rgba(242, 169, 59, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={20} color="#FBBF24" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FDE047' }}>
                        Credit Limit Overrun Approval Required
                      </div>
                      <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
                        Customer exceeded authorized credit terms. Manager signature required to release to warehouse picking.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      approveCreditOverlimit(selectedOrder.id);
                      setSelectedOrder({ ...selectedOrder, status: 'approved' });
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Authorize Release
                  </button>
                </div>
              )}

              {/* Order Items Table */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#FFFFFF' }}>Line Items Breakdown</h4>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: '#CBD5E1' }}>
                      <th style={{ padding: '8px' }}>Product</th>
                      <th style={{ padding: '8px' }}>Qty (Crates)</th>
                      <th style={{ padding: '8px' }}>Price / Crate</th>
                      <th style={{ padding: '8px' }}>Crate Deposit</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Line Total (RWF)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <td style={{ padding: '8px', fontWeight: 600, color: '#FFFFFF' }}>{item.productName}</td>
                        <td style={{ padding: '8px', color: '#CBD5E1' }} className="tabular-nums">{item.quantityCrates} crates</td>
                        <td style={{ padding: '8px', color: '#CBD5E1' }} className="tabular-nums">RWF {item.unitPrice.toLocaleString()}</td>
                        <td style={{ padding: '8px', color: '#CBD5E1' }} className="tabular-nums">RWF {item.depositPerCrate.toLocaleString()}</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#34D399' }} className="tabular-nums">
                          RWF {item.lineTotal.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial summary box */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: '#94A3B8' }}>Beverage Subtotal:</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }} className="tabular-nums">RWF {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: '#94A3B8' }}>Returnable Crates Deposit:</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }} className="tabular-nums">RWF {selectedOrder.crateDepositTotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: '#94A3B8' }}>18% VAT (Included):</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }} className="tabular-nums">RWF {selectedOrder.taxAmount.toLocaleString()}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '8px',
                    marginTop: '6px'
                  }}
                >
                  <span>Grand Total:</span>
                  <span style={{ color: '#34D399' }} className="tabular-nums">
                    RWF {selectedOrder.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status advancement buttons */}
              <div>
                <label className="label">Advance Order Workflow Step:</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, st);
                        setSelectedOrder({ ...selectedOrder, status: st });
                      }}
                      className={`btn btn-sm ${selectedOrder.status === st ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
