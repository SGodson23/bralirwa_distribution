import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShoppingCart,
  Users,
  Truck,
  Receipt,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PaymentMethod, CustomerCategory } from '../../types';

export const QuickCreateModal: React.FC = () => {
  const {
    quickCreateOpen,
    setQuickCreateOpen,
    quickCreateType,
    setQuickCreateType,
    customers,
    products,
    createSalesOrder,
    createPurchaseOrder,
    addExpense,
    currentTenant,
    currentWarehouseId,
    adjustStock,
    showToast
  } = useApp();

  // Tab 1: Sales Order State
  const [selectedCustId, setSelectedCustId] = useState(customers[0]?.id || '');
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 20 }
  ]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  // Tab 2: Customer State
  const [custName, setCustName] = useState('');
  const [custTrade, setCustTrade] = useState('');
  const [custCategory, setCustCategory] = useState<CustomerCategory>('Bar');
  const [custPhone, setCustPhone] = useState('+250 788 ');
  const [custDistrict, setCustDistrict] = useState('Gasabo');
  const [custSector, setCustSector] = useState('Remera');
  const [custCreditLimit, setCustCreditLimit] = useState(3000000);
  const [custTerms, setCustTerms] = useState(14);

  // Tab 3: BRALIRWA Purchase Order
  const [poDepot, setPoDepot] = useState<'BRALIRWA Plc - Gisenyi Brewery' | 'BRALIRWA Plc - Kigali Depot'>(
    'BRALIRWA Plc - Gisenyi Brewery'
  );
  const [poItems, setPoItems] = useState<{ productId: string; crates: number }[]>([
    { productId: products[0]?.id || '', crates: 500 }
  ]);

  // Tab 4: Expense State
  const [expCategory, setExpCategory] = useState<any>('Fuel');
  const [expAmount, setExpAmount] = useState(120000);
  const [expDesc, setExpDesc] = useState('');
  const [expPaidTo, setExpPaidTo] = useState('');
  const [expSource, setExpSource] = useState<any>('Cash Drawer');

  // Tab 5: Transfer State
  const [transferProdId, setTransferProdId] = useState(products[0]?.id || '');
  const [fromWh, setFromWh] = useState('wh-main-gikondo');
  const [toWh, setToWh] = useState('wh-remera-depot');
  const [transferQty, setTransferQty] = useState(50);

  if (!quickCreateOpen) return null;

  const selectedCustomer = customers.find((c) => c.id === selectedCustId);

  // Calculate order preview
  let calculatedSubtotal = 0;
  let calculatedCratesDeposit = 0;
  let calculatedTotalCrates = 0;

  orderItems.forEach((item) => {
    const prod = products.find((p) => p.id === item.productId);
    if (prod) {
      calculatedSubtotal += prod.distributorSellingPrice * item.quantity;
      calculatedCratesDeposit += prod.crateDepositValue * item.quantity;
      calculatedTotalCrates += item.quantity;
    }
  });

  const grandTotal = calculatedSubtotal + calculatedCratesDeposit;
  const isOverCreditLimit =
    paymentMethod === 'Credit' &&
    selectedCustomer &&
    selectedCustomer.currentExposure + grandTotal > selectedCustomer.creditLimit;

  // Handlers
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const items = orderItems.map((item) => {
      const prod = products.find((p) => p.id === item.productId)!;
      const sub = prod.distributorSellingPrice * item.quantity;
      const dep = prod.crateDepositValue * item.quantity;
      return {
        productId: prod.id,
        productName: prod.name,
        quantityCrates: item.quantity,
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
      items,
      subtotal: calculatedSubtotal,
      crateDepositTotal: calculatedCratesDeposit,
      discountTotal: 0,
      taxAmount: Math.round(calculatedSubtotal * 0.18),
      grandTotal,
      amountPaid: paymentMethod === 'Credit' ? 0 : grandTotal,
      balanceDue: paymentMethod === 'Credit' ? grandTotal : 0,
      paymentMethod,
      emptyCratesExpected: calculatedTotalCrates
    });

    setQuickCreateOpen(false);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName) return;

    // Simulated new customer addition
    showToast(`Retailer "${custName}" onboarded with RWF ${custCreditLimit.toLocaleString()} credit limit!`);
    setQuickCreateOpen(false);
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const items = poItems.map((item) => {
      const prod = products.find((p) => p.id === item.productId)!;
      const total = prod.bralirwaPurchasePrice * item.crates;
      return {
        productId: prod.id,
        orderedCrates: item.crates,
        unitPrice: prod.bralirwaPurchasePrice,
        totalAmount: total
      };
    });

    const sub = items.reduce((a, b) => a + b.totalAmount, 0);
    const vat = Math.round(sub * 0.18);

    createPurchaseOrder({
      supplier: poDepot,
      items,
      subtotal: sub,
      vatAmount: vat,
      totalAmount: sub + vat,
      notes: 'Generated via Quick Create PO'
    });

    setQuickCreateOpen(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDesc || expAmount <= 0) return;

    addExpense({
      date: new Date().toISOString().substring(0, 10),
      category: expCategory,
      amount: expAmount,
      description: expDesc,
      paidTo: expPaidTo || 'Vendor',
      paidFrom: expSource,
      approvedBy: 'Emmanuel Ndayisaba (Owner)',
      receiptNumber: `REC-${Date.now().toString().slice(-4)}`
    });

    setQuickCreateOpen(false);
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromWh === toWh) {
      alert('Source and destination warehouses must be different!');
      return;
    }

    adjustStock(transferProdId, fromWh, -transferQty, `Transferred to ${toWh}`);
    adjustStock(transferProdId, toWh, transferQty, `Received from ${fromWh}`);
    showToast(`Transferred ${transferQty} crates between depots.`);
    setQuickCreateOpen(false);
  };

  const tabs: { id: typeof quickCreateType; label: string; icon: any }[] = [
    { id: 'order', label: 'Sales Order', icon: ShoppingCart },
    { id: 'customer', label: 'Customer / Retailer', icon: Users },
    { id: 'po', label: 'BRALIRWA PO', icon: Truck },
    { id: 'expense', label: 'Expense', icon: Receipt },
    { id: 'transfer', label: 'Stock Transfer', icon: ArrowRightLeft }
  ];

  return (
    <div className="modal-backdrop" onClick={() => setQuickCreateOpen(false)}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#07132B'
          }}
        >
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>Quick Create Action</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8' }}>Create operational records with instant validation</p>
          </div>
          <button
            onClick={() => setQuickCreateOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab selection */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            padding: '0 16px'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = quickCreateType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setQuickCreateType(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? '2px solid #34D399' : '2px solid transparent',
                  color: active ? '#34D399' : '#94A3B8',
                  fontWeight: active ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '20px 24px' }}>
          {/* TAB 1: SALES ORDER */}
          {quickCreateType === 'order' && (
            <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="label">Customer / Retailer</label>
                  <select
                    className="select"
                    value={selectedCustId}
                    onChange={(e) => setSelectedCustId(e.target.value)}
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.district} - Exposure: RWF {c.currentExposure.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Payment Method</label>
                  <select
                    className="select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    <option value="Cash">Cash on Delivery</option>
                    <option value="MTN MoMo">MTN Mobile Money</option>
                    <option value="Airtel Money">Airtel Money</option>
                    <option value="Bank Transfer (BK)">Bank Transfer (BK)</option>
                    <option value="Credit">Credit (Invoice Terms)</option>
                  </select>
                </div>
              </div>

              {/* Order Products */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="label" style={{ margin: 0 }}>Order Line Items</label>
                  <button
                    type="button"
                    onClick={() => setOrderItems([...orderItems, { productId: products[1]?.id || '', quantity: 15 }])}
                    className="btn btn-secondary btn-sm"
                  >
                    + Add Product
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {orderItems.map((item, idx) => {
                    const prod = products.find((p) => p.id === item.productId);
                    return (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 40px', gap: '10px', alignItems: 'center' }}>
                        <select
                          className="select"
                          value={item.productId}
                          onChange={(e) => {
                            const newItems = [...orderItems];
                            newItems[idx].productId = e.target.value;
                            setOrderItems(newItems);
                          }}
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — RWF {p.distributorSellingPrice.toLocaleString()}/crate
                            </option>
                          ))}
                        </select>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            min="1"
                            max="500"
                            className="input"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...orderItems];
                              newItems[idx].quantity = parseInt(e.target.value) || 1;
                              setOrderItems(newItems);
                            }}
                          />
                          <span style={{ fontSize: '11px', color: '#CBD5E1' }}>crates</span>
                        </div>
                        {orderItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setOrderItems(orderItems.filter((_, i) => i !== idx))}
                            style={{ background: 'none', border: 'none', color: '#E5484D', cursor: 'pointer' }}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Overcredit alert if applicable */}
              {isOverCreditLimit && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(242, 169, 59, 0.15)',
                    border: '1px solid rgba(242, 169, 59, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12.5px',
                    color: '#FDE047'
                  }}
                >
                  <AlertTriangle size={17} color="#FBBF24" />
                  <div>
                    <strong>Credit Limit Exceeded:</strong> Total exposure with this order will reach RWF{' '}
                    {((selectedCustomer?.currentExposure || 0) + grandTotal).toLocaleString()} against limit of RWF{' '}
                    {selectedCustomer?.creditLimit.toLocaleString()}. Order will be staged for Manager Approval.
                  </div>
                </div>
              )}

              {/* Order Financial Summary */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>Beverages Subtotal:</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }} className="tabular-nums">RWF {calculatedSubtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>Returnable Crates Deposit ({calculatedTotalCrates} crates):</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }} className="tabular-nums">RWF {calculatedCratesDeposit.toLocaleString()}</span>
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
                    marginTop: '4px'
                  }}
                >
                  <span>Grand Total:</span>
                  <span style={{ color: '#34D399' }} className="tabular-nums">RWF {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setQuickCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Sales Order
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CUSTOMER */}
          {quickCreateType === 'customer' && (
            <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label">Retailer Trade Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kigali Heights Sky Lounge"
                    className="input"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Business Category</label>
                  <select
                    className="select"
                    value={custCategory}
                    onChange={(e) => setCustCategory(e.target.value as any)}
                  >
                    <option value="Bar">Bar & Lounge</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel & Hospitality</option>
                    <option value="Supermarket">Supermarket / Retail Shop</option>
                    <option value="Nightclub">Nightclub</option>
                    <option value="Wholesaler">Sub-Distributor / Wholesaler</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label">Contact Phone (MTN/Airtel)</label>
                  <input
                    type="text"
                    className="input"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">District & Sector</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      className="input"
                      value={custDistrict}
                      onChange={(e) => setCustDistrict(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input"
                      value={custSector}
                      onChange={(e) => setCustSector(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label">Credit Limit (RWF)</label>
                  <input
                    type="number"
                    step="500000"
                    className="input"
                    value={custCreditLimit}
                    onChange={(e) => setCustCreditLimit(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="label">Payment Terms (Days)</label>
                  <select
                    className="select"
                    value={custTerms}
                    onChange={(e) => setCustTerms(parseInt(e.target.value) || 7)}
                  >
                    <option value={7}>7 Days (Standard Bar)</option>
                    <option value={14}>14 Days (Established Lounge)</option>
                    <option value={30}>30 Days (Hotels & Supermarkets)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setQuickCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Retailer Account
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BRALIRWA PO */}
          {quickCreateType === 'po' && (
            <form onSubmit={handleCreatePO} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label">Supplier Depot</label>
                <select
                  className="select"
                  value={poDepot}
                  onChange={(e) => setPoDepot(e.target.value as any)}
                >
                  <option value="BRALIRWA Plc - Gisenyi Brewery">BRALIRWA Plc - Gisenyi Brewery (Rubavu)</option>
                  <option value="BRALIRWA Plc - Kigali Depot">BRALIRWA Plc - Kigali Distribution Depot</option>
                </select>
              </div>

              <div>
                <label className="label">Products to Order</label>
                {poItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr', gap: '10px', marginBottom: '8px' }}>
                    <select
                      className="select"
                      value={item.productId}
                      onChange={(e) => {
                        const next = [...poItems];
                        next[idx].productId = e.target.value;
                        setPoItems(next);
                      }}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Factory Purchase: RWF {p.bralirwaPurchasePrice.toLocaleString()}/crate)
                        </option>
                      ))}
                    </select>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        className="input"
                        value={item.crates}
                        onChange={(e) => {
                          const next = [...poItems];
                          next[idx].crates = parseInt(e.target.value) || 50;
                          setPoItems(next);
                        }}
                      />
                      <span style={{ fontSize: '11px', color: '#CBD5E1' }}>crates</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setQuickCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Transmit Order to BRALIRWA
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: EXPENSE */}
          {quickCreateType === 'expense' && (
            <form onSubmit={handleCreateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label">Category</label>
                  <select
                    className="select"
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                  >
                    <option value="Fuel">Fuel (Delivery Trucks)</option>
                    <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                    <option value="Salaries">Loader & Driver Allowances</option>
                    <option value="Warehouse Rent">Warehouse Rent</option>
                    <option value="Utilities">Utilities (Electricity/Water)</option>
                    <option value="Internet & IT">Internet & Communications</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="label">Amount (RWF)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="5000"
                    className="input"
                    value={expAmount}
                    onChange={(e) => setExpAmount(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Description & Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diesel 100L for RAD 245 H at Engen Gikondo"
                  className="input"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label">Paid To (Vendor/Staff)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engen Station"
                    className="input"
                    value={expPaidTo}
                    onChange={(e) => setExpPaidTo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Payment Source</label>
                  <select
                    className="select"
                    value={expSource}
                    onChange={(e) => setExpSource(e.target.value)}
                  >
                    <option value="Cash Drawer">Cash Drawer</option>
                    <option value="Bank Account (BK)">Bank Account (Bank of Kigali)</option>
                    <option value="MoMo Corporate">MTN MoMo Corporate</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setQuickCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Post Expense
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: TRANSFER */}
          {quickCreateType === 'transfer' && (
            <form onSubmit={handleCreateTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label">From Warehouse</label>
                  <select
                    className="select"
                    value={fromWh}
                    onChange={(e) => setFromWh(e.target.value)}
                  >
                    <option value="wh-main-gikondo">Main Distribution Hub (Gikondo)</option>
                    <option value="wh-remera-depot">Remera Quick-Fulfillment Depot</option>
                    <option value="wh-nyamata-depot">Nyamata Commercial Depot</option>
                  </select>
                </div>
                <div>
                  <label className="label">To Warehouse</label>
                  <select
                    className="select"
                    value={toWh}
                    onChange={(e) => setToWh(e.target.value)}
                  >
                    <option value="wh-remera-depot">Remera Quick-Fulfillment Depot</option>
                    <option value="wh-main-gikondo">Main Distribution Hub (Gikondo)</option>
                    <option value="wh-nyamata-depot">Nyamata Commercial Depot</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label className="label">Product</label>
                  <select
                    className="select"
                    value={transferProdId}
                    onChange={(e) => setTransferProdId(e.target.value)}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.packaging})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Quantity (Crates)</label>
                  <input
                    type="number"
                    min="1"
                    className="input"
                    value={transferQty}
                    onChange={(e) => setTransferQty(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setQuickCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Execute Inter-Depot Transfer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
