import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { PaymentMethod } from '../types';

export const QuickOrderModule: React.FC = () => {
  const {
    products,
    customers,
    createSalesOrder,
    setCurrentNav,
    showToast
  } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [cart, setCart] = useState<{ [productId: string]: number }>({
    'prod-primus-50': 20,
    'prod-mutzig-50': 10,
    'prod-coca-cola-30': 15
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const categories = ['All', 'Beer', 'Soft Drinks', 'Premium', 'Water'];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const updateQty = (prodId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[prodId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[prodId];
        return copy;
      }
      return { ...prev, [prodId]: next };
    });
  };

  const setExactQty = (prodId: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) {
        const copy = { ...prev };
        delete copy[prodId];
        return copy;
      }
      return { ...prev, [prodId]: qty };
    });
  };

  // Cart financial computations
  let subtotal = 0;
  let depositTotal = 0;
  let totalCrates = 0;

  Object.entries(cart).forEach(([prodId, qty]) => {
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      subtotal += prod.distributorSellingPrice * qty;
      depositTotal += prod.crateDepositValue * qty;
      totalCrates += qty;
    }
  });

  const grandTotal = subtotal + depositTotal;
  const isOverCreditLimit =
    paymentMethod === 'Credit' &&
    selectedCustomer.currentExposure + grandTotal > selectedCustomer.creditLimit;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalCrates === 0) {
      alert('Please add at least one product crate to cart!');
      return;
    }

    const orderItems = Object.entries(cart).map(([prodId, qty]) => {
      const prod = products.find((p) => p.id === prodId)!;
      const sub = prod.distributorSellingPrice * qty;
      const dep = prod.crateDepositValue * qty;
      return {
        productId: prod.id,
        productName: prod.name,
        quantityCrates: qty,
        unitPrice: prod.distributorSellingPrice,
        depositPerCrate: prod.crateDepositValue,
        subtotal: sub,
        depositSubtotal: dep,
        discount: 0,
        lineTotal: sub + dep
      };
    });

    createSalesOrder({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      items: orderItems,
      subtotal,
      crateDepositTotal: depositTotal,
      discountTotal: 0,
      taxAmount: Math.round(subtotal * 0.18),
      grandTotal,
      amountPaid: paymentMethod === 'Credit' ? 0 : grandTotal,
      balanceDue: paymentMethod === 'Credit' ? grandTotal : 0,
      paymentMethod,
      emptyCratesExpected: totalCrates
    });

    setCart({});
    showToast(`Order created for ${selectedCustomer.name}!`);
    setCurrentNav('orders');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', paddingBottom: '40px' }}>
      {/* Left: Product Catalog & Fast Incrementers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>Quick Order & Field POS</h1>
            <p style={{ fontSize: '13px', color: '#CBD5E1' }}>
              Ultra-fast order entry for van salesmen, counter cashiers, and field reps
            </p>
          </div>
          <span className="badge badge-warning" style={{ fontSize: '12px' }}>
            <Zap size={14} /> Rapid Mode
          </span>
        </div>

        {/* Customer Select Bar */}
        <div className="card" style={{ padding: '14px 18px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <label className="label">Select Retailer / Customer</label>
          <select
            className="select"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.district} — Credit Available: RWF {c.availableCredit.toLocaleString()} | {c.outstandingCrates} crates held)
              </option>
            ))}
          </select>
        </div>

        {/* Category & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: selectedCat === cat ? 600 : 400,
                  border: '1px solid',
                  borderColor: selectedCat === cat ? '#16A36A' : '#E6EAF0',
                  backgroundColor: selectedCat === cat ? '#ECFDF5' : '#FFFFFF',
                  color: selectedCat === cat ? '#16A36A' : '#667085',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px' }}>
            <Search size={15} color="#667085" />
            <input
              type="text"
              placeholder="Filter products..."
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '12.5px' }}
            />
          </div>
        </div>

        {/* Product Cards with [-] qty [+] (Section 15 example) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {filteredProducts.map((p) => {
            const qty = cart[p.id] || 0;
            return (
              <div
                key={p.id}
                className="card"
                style={{
                  padding: '14px',
                  border: qty > 0 ? '1.5px solid #16A36A' : '1px solid #E6EAF0',
                  backgroundColor: qty > 0 ? '#F9FEFB' : '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong style={{ fontSize: '14px', color: '#FFFFFF' }}>{p.name}</strong>
                    <span style={{ fontSize: '11px', color: '#CBD5E1' }}>{p.bottleVolume}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#CBD5E1', marginTop: '2px' }}>
                    {p.packaging} • Deposit: RWF {p.crateDepositValue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#16A36A', marginTop: '6px' }} className="tabular-nums">
                    RWF {p.distributorSellingPrice.toLocaleString()}{' '}
                    <span style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: 400 }}>/ crate</span>
                  </div>
                </div>

                {/* Fast Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => updateQty(p.id, -10)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      title="Minus 10 crates"
                    >
                      -10
                    </button>
                    <button
                      type="button"
                      onClick={() => updateQty(p.id, -1)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px' }}
                    >
                      <Minus size={13} />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={qty}
                      onChange={(e) => setExactQty(p.id, parseInt(e.target.value) || 0)}
                      style={{
                        width: '48px',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '4px 0'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => updateQty(p.id, 1)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px' }}
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateQty(p.id, 10)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      title="Add 10 crates"
                    >
                      +10
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Live Cart & Instant Settlement */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', position: 'sticky', top: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E6EAF0', paddingBottom: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} color="#16A36A" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Active Sales Cart</h3>
            </div>
            <span className="badge badge-success">{totalCrates} Crates</span>
          </div>

          {/* Customer Credit Snapshot */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ color: '#94A3B8', fontWeight: 600 }}>Client:</span>
              <strong style={{ color: '#FFFFFF' }}>{selectedCustomer.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ color: '#94A3B8', fontWeight: 600 }}>Credit Limit:</span>
              <span style={{ color: '#FFFFFF' }} className="tabular-nums">RWF {selectedCustomer.creditLimit.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8', fontWeight: 600 }}>Available Credit:</span>
              <strong style={{ color: selectedCustomer.availableCredit < grandTotal ? '#F87171' : '#34D399' }} className="tabular-nums">
                RWF {selectedCustomer.availableCredit.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Cart Items List */}
          <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {Object.keys(cart).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '13px' }}>
                Cart is empty. Tap products to add crates.
              </div>
            ) : (
              Object.entries(cart).map(([prodId, qty]) => {
                const prod = products.find((p) => p.id === prodId);
                if (!prod) return null;
                const lineTotal = (prod.distributorSellingPrice + prod.crateDepositValue) * qty;

                return (
                  <div
                    key={prodId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{prod.name}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                        {qty} crates × RWF {(prod.distributorSellingPrice + prod.crateDepositValue).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#34D399' }} className="tabular-nums">
                        RWF {lineTotal.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(prodId, -qty)}
                        style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label className="label">Payment Settlement Channel</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {(['Cash', 'MTN MoMo', 'Bank Transfer (BK)', 'Credit'] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: paymentMethod === m ? 600 : 400,
                    border: '1px solid',
                    borderColor: paymentMethod === m ? '#34D399' : 'rgba(255, 255, 255, 0.12)',
                    backgroundColor: paymentMethod === m ? 'rgba(22, 163, 106, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: paymentMethod === m ? '#34D399' : '#CBD5E1',
                    cursor: 'pointer'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Credit Limit Alert if Exceeded */}
          {isOverCreditLimit && (
            <div
              style={{
                backgroundColor: 'rgba(242, 169, 59, 0.15)',
                border: '1px solid rgba(242, 169, 59, 0.35)',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '14px',
                fontSize: '11.5px',
                color: '#FDE047'
              }}
            >
              <AlertTriangle size={15} color="#FBBF24" style={{ display: 'inline', marginRight: '4px' }} />
              Warning: Exceeds available credit limit! Order will be submitted for manager approval.
            </div>
          )}

          {/* Financial Totals */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: '#94A3B8' }}>Beverages Subtotal:</span>
              <span style={{ fontWeight: 600, color: '#FFFFFF' }} className="tabular-nums">RWF {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: '#94A3B8' }}>Returnable Crate Deposit:</span>
              <span style={{ fontWeight: 600, color: '#FFFFFF' }} className="tabular-nums">RWF {depositTotal.toLocaleString()}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: 800,
                color: '#FFFFFF',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '8px',
                marginTop: '4px'
              }}
            >
              <span>Grand Total:</span>
              <span style={{ color: '#34D399' }} className="tabular-nums">RWF {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={totalCrates === 0}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '16px' }}
          >
            <CheckCircle2 size={18} />
            <span>Submit Order (RWF {grandTotal.toLocaleString()})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
