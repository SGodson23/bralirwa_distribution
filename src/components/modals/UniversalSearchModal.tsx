import React, { useState } from 'react';
import { useApp, NavView } from '../../context/AppContext';
import {
  Search,
  ShoppingCart,
  Users,
  Boxes,
  Truck,
  RotateCcw,
  Zap,
  ArrowRight,
  X,
  CreditCard,
  Building2
} from 'lucide-react';

export const UniversalSearchModal: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    products,
    customers,
    salesOrders,
    deliveryRuns,
    setCurrentNav,
    setQuickCreateOpen,
    setQuickCreateType
  } = useApp();

  const [query, setQuery] = useState('');

  if (!searchOpen) return null;

  const q = query.toLowerCase().trim();

  // Matched products
  const matchedProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );

  // Matched customers
  const matchedCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.contactPerson.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.phone.includes(q)
  );

  // Matched orders
  const matchedOrders = salesOrders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q)
  );

  // Quick Action Commands
  const quickActions = [
    {
      title: 'Create Sales Order',
      icon: ShoppingCart,
      category: 'Command',
      action: () => {
        setQuickCreateType('order');
        setQuickCreateOpen(true);
        setSearchOpen(false);
      }
    },
    {
      title: 'Open Quick Order POS',
      icon: Zap,
      category: 'Navigation',
      action: () => {
        setCurrentNav('quick_order');
        setSearchOpen(false);
      }
    },
    {
      title: 'Warehouse Health & Floor Matrix',
      icon: Boxes,
      category: 'Navigation',
      action: () => {
        setCurrentNav('warehouse_dashboard');
        setSearchOpen(false);
      }
    },
    {
      title: 'Accountant Financial Command & General Ledger',
      icon: CreditCard,
      category: 'Navigation',
      action: () => {
        setCurrentNav('accountant_dashboard');
        setSearchOpen(false);
      }
    },
    {
      title: 'New BRALIRWA Purchase Order',
      icon: Truck,
      category: 'Command',
      action: () => {
        setQuickCreateType('po');
        setQuickCreateOpen(true);
        setSearchOpen(false);
      }
    },
    {
      title: 'View Empty Bottles & Crates Ledger',
      icon: RotateCcw,
      category: 'Navigation',
      action: () => {
        setCurrentNav('empties');
        setSearchOpen(false);
      }
    },
    {
      title: 'Run Cash Reconciliation',
      icon: CreditCard,
      category: 'Navigation',
      action: () => {
        setCurrentNav('reconciliation');
        setSearchOpen(false);
      }
    },
    {
      title: 'Open Live Delivery Route Map',
      icon: Truck,
      category: 'Navigation',
      action: () => {
        setCurrentNav('delivery_map');
        setSearchOpen(false);
      }
    }
  ].filter((a) => a.title.toLowerCase().includes(q));

  return (
    <div className="modal-backdrop" onClick={() => setSearchOpen(false)}>
      <div
        className="modal-content modal-content-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ overflow: 'hidden', padding: 0 }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: 'rgba(8, 20, 44, 0.95)'
          }}
        >
          <Search size={20} color="#34D399" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search customers, products, orders, or commands..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontFamily: 'Inter, sans-serif',
              color: '#FFFFFF',
              backgroundColor: 'transparent'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X size={16} />
            </button>
          )}
          <kbd
            style={{
              fontSize: '11px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '4px',
              padding: '2px 6px',
              color: '#CBD5E1'
            }}
          >
            ESC to close
          </kbd>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '460px', overflowY: 'auto', padding: '16px 20px' }}>
          {/* Quick Actions / Commands */}
          {quickActions.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Commands & Shortcuts
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {quickActions.slice(0, 4).map((qa, i) => {
                  const Icon = qa.icon;
                  return (
                    <div
                      key={i}
                      onClick={qa.action}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 120ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={16} color="#16A36A" />
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>{qa.title}</span>
                      </div>
                      <ArrowRight size={14} color="#667085" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customers */}
          {matchedCustomers.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Retailers & Customers ({matchedCustomers.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedCustomers.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setCurrentNav('customers');
                      setSearchOpen(false);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#FFFFFF' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
                        {c.category} • {c.district}, {c.sector} • Contact: {c.contactPerson} ({c.phone})
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }} className="tabular-nums">
                        Exposure: RWF {c.currentExposure.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '11px', color: '#16A36A' }}>{c.outstandingCrates} crates held</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {matchedProducts.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                BRALIRWA Products ({matchedProducts.length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {matchedProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setCurrentNav('inventory');
                      setSearchOpen(false);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{p.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#CBD5E1' }}>{p.packaging}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#34D399' }} className="tabular-nums">
                        RWF {p.distributorSellingPrice.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>SKU: {p.sku}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {matchedOrders.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Recent Sales Orders ({matchedOrders.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {matchedOrders.slice(0, 3).map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      setCurrentNav('orders');
                      setSearchOpen(false);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                        {o.orderNumber} — {o.customerName}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#CBD5E1' }}>
                        {o.orderDate} • {o.paymentMethod} • Status: <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{o.status}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }} className="tabular-nums">
                      RWF {o.grandTotal.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedProducts.length === 0 && matchedCustomers.length === 0 && matchedOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#CBD5E1' }}>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>No exact matches found for "{query}"</p>
              <p style={{ fontSize: '12.5px', marginTop: '4px' }}>Try searching by product brand, customer name, district, or order number.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
