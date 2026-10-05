import React, { useState } from 'react';
import { Product, InventoryItem, Warehouse } from '../../types';
import {
  X,
  Boxes,
  PlusCircle,
  Truck,
  ArrowRightLeft,
  DollarSign,
  Clock
} from 'lucide-react';

interface StockDetailModalProps {
  product: Product | null;
  inventoryItem: InventoryItem | null;
  currentWarehouseId: string;
  allWarehouses: Warehouse[];
  onClose: () => void;
  onAdjustStock: (productId: string, warehouseId: string, amountDiff: number, reason: string) => void;
  onOpenPO?: (product: Product) => void;
  onOpenTransfer?: () => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  product,
  inventoryItem,
  currentWarehouseId,
  allWarehouses,
  onClose,
  onAdjustStock,
  onOpenPO,
  onOpenTransfer
}) => {
  const [quickAdjustOpen, setQuickAdjustOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('Physical count verification discrepancy');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(currentWarehouseId);

  if (!product || !inventoryItem) return null;

  const item = inventoryItem;

  // Status text & colors
  const getStatusPresentation = () => {
    switch (item.status) {
      case 'healthy':
        return {
          label: 'HEALTHY',
          color: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.12)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          textColor: '#34D399',
          desc: `Stock is HEALTHY. With an average velocity of ${item.dailyAverageSalesCrates} crates/day, your depot has ${item.stockCoverDays.toFixed(1)} days of inventory runway before touching the reorder trigger.`
        };
      case 'low_stock':
        return {
          label: 'LOW STOCK WARNING',
          color: '#F59E0B',
          bgColor: 'rgba(245, 158, 11, 0.12)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          textColor: '#FBBF24',
          desc: `Stock is nearing minimum safety levels (${item.stockCoverDays.toFixed(1)} days left). Triggering a factory replenishment order from BRALIRWA is strongly advised.`
        };
      case 'critical':
        return {
          label: 'CRITICAL STOCKOUT RISK',
          color: '#EF4444',
          bgColor: 'rgba(239, 68, 68, 0.12)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          textColor: '#F87171',
          desc: `Urgent! Stock cover is at ${item.stockCoverDays.toFixed(1)} days, below minimum safety buffer (${item.minLevelCrates} crates). Immediate restock required.`
        };
      case 'overstock':
        return {
          label: 'OVERSTOCK / SLOW MOVING',
          color: '#38BDF8',
          bgColor: 'rgba(56, 189, 248, 0.12)',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          textColor: '#7DD3FC',
          desc: `Stock exceeds regular 14-day cycle capacity (${item.stockCoverDays.toFixed(1)} days). Review promotional discounts or inter-depot transfers.`
        };
    }
  };

  const statusPres = getStatusPresentation();

  // Valuation
  const purchaseValuation = item.onHandCrates * product.bralirwaPurchasePrice;
  const wholesaleValuation = item.onHandCrates * product.distributorSellingPrice;
  const profitMargin = wholesaleValuation - purchaseValuation;
  const totalBottles = item.onHandCrates * (product.unitsPerCrate || 24);

  // Stock Capacity Percentage
  const maxCap = item.maxLevelCrates || 1000;
  const capacityPct = Math.min(100, Math.round((item.onHandCrates / maxCap) * 100));

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdjustStock(product.id, selectedWarehouseId, adjustAmount, adjustReason);
    setQuickAdjustOpen(false);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 10, 24, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#0A1838',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.65), 0 0 1px 1px rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#07132B',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {product.imageUrl ? (
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Boxes size={24} color="#16A36A" />
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {product.name}
                </h2>
                <span
                  style={{
                    backgroundColor: 'rgba(22, 163, 106, 0.2)',
                    color: '#34D399',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(22, 163, 106, 0.35)'
                  }}
                >
                  {product.category}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>
                SKU: <strong style={{ color: '#E2E8F0' }}>{product.sku}</strong> • {product.packaging} • {product.bottleVolume}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#CBD5E1',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* SECTION 1: CRATES IN STOCK BREAKDOWN */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Boxes size={18} color="#34D399" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Crates in Stock & Physical Availability
                </h3>
              </div>
              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
                {totalBottles.toLocaleString()} Total Units / Bottles
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px'
              }}
            >
              {/* Total On-Hand */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                  Total On-Hand
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', margin: '6px 0 2px' }} className="tabular-nums">
                  {item.onHandCrates.toLocaleString()}
                </div>
                <div style={{ fontSize: '11.5px', color: '#34D399', fontWeight: 600 }}>
                  Physical Depot Stock
                </div>
              </div>

              {/* Available to Sell */}
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6EE7B7', textTransform: 'uppercase' }}>
                  Available to Sell
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#34D399', margin: '6px 0 2px' }} className="tabular-nums">
                  {item.availableCrates.toLocaleString()}
                </div>
                <div style={{ fontSize: '11.5px', color: '#A7F3D0', fontWeight: 600 }}>
                  Ready for Invoicing
                </div>
              </div>

              {/* Reserved for Orders */}
              <div
                style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#7DD3FC', textTransform: 'uppercase' }}>
                  Reserved Orders
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8', margin: '6px 0 2px' }} className="tabular-nums">
                  {item.reservedCrates.toLocaleString()}
                </div>
                <div style={{ fontSize: '11.5px', color: '#BAE6FD', fontWeight: 600 }}>
                  Staged for Dispatch
                </div>
              </div>

              {/* Damaged / Breakages */}
              <div
                style={{
                  backgroundColor: item.damagedCrates > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: `1px solid ${item.damagedCrates > 0 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255, 255, 255, 0.12)'}`
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: item.damagedCrates > 0 ? '#FCA5A5' : '#94A3B8', textTransform: 'uppercase' }}>
                  Breakages / Damaged
                </div>
                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: 800,
                    color: item.damagedCrates > 0 ? '#F87171' : '#CBD5E1',
                    margin: '6px 0 2px'
                  }}
                  className="tabular-nums"
                >
                  {item.damagedCrates}
                </div>
                <div style={{ fontSize: '11.5px', color: item.damagedCrates > 0 ? '#F87171' : '#94A3B8', fontWeight: 600 }}>
                  Recorded Breakages
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: STATUS OF THE STOCK & RUNWAY */}
          <div
            style={{
              backgroundColor: statusPres.bgColor,
              border: `1px solid ${statusPres.borderColor}`,
              borderRadius: '18px',
              padding: '18px 20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: statusPres.color
                  }}
                />
                <span style={{ fontSize: '13px', fontWeight: 800, color: statusPres.textColor, letterSpacing: '0.04em' }}>
                  STOCK STATUS: {statusPres.label}
                </span>
              </div>

              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 800,
                  color: statusPres.textColor,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  border: `1px solid ${statusPres.borderColor}`
                }}
              >
                ⏳ {item.stockCoverDays.toFixed(1)} Days Runway
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#E2E8F0', margin: '0 0 14px 0', lineHeight: 1.5 }}>
              {statusPres.desc}
            </p>

            {/* Capacity Progress Bar with Markers */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#CBD5E1', marginBottom: '6px', fontWeight: 600 }}>
                <span>Depot Capacity: {item.onHandCrates} / {maxCap} Crates</span>
                <span>{capacityPct}% Capacity Utilization</span>
              </div>
              <div
                style={{
                  height: '10px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${capacityPct}%`,
                    height: '100%',
                    borderRadius: '999px',
                    backgroundColor: statusPres.color,
                    boxShadow: `0 0 10px ${statusPres.color}`,
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              {/* Thresholds Line */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: '#94A3B8',
                  marginTop: '6px'
                }}
              >
                <span>Safety Min: {item.minLevelCrates} crates</span>
                <span>Reorder Point: {item.reorderPointCrates} crates</span>
                <span>Max Capacity: {item.maxLevelCrates} crates</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: COMMERCIAL VALUATION & BATCH INTELLIGENCE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Financial Valuation */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '16px 18px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <DollarSign size={16} color="#34D399" />
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Inventory Asset Valuation
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                  <span>BRALIRWA Purchase Rate:</span>
                  <strong style={{ color: '#FFFFFF' }}>RWF {product.bralirwaPurchasePrice.toLocaleString()} / crate</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                  <span>Distributor Wholesale Rate:</span>
                  <strong style={{ color: '#FFFFFF' }}>RWF {product.distributorSellingPrice.toLocaleString()} / crate</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                  <span>Total Purchase Cost (Assets):</span>
                  <strong style={{ color: '#FFFFFF' }} className="tabular-nums">RWF {purchaseValuation.toLocaleString()}</strong>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399', fontWeight: 700 }}>
                  <span>Gross Margin Potential:</span>
                  <span className="tabular-nums">+ RWF {profitMargin.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Batch & Quality Tracking */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '16px 18px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Clock size={16} color="#38BDF8" />
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Batch Quality & Velocity
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                  <span>Brewery Batch Number:</span>
                  <strong style={{ color: '#FFFFFF' }}>{item.batchNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                  <span>Expiration Date:</span>
                  <strong style={{ color: '#FFFFFF' }}>{item.expiryDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                  <span>Daily Sales Velocity:</span>
                  <strong style={{ color: '#FFFFFF' }}>{item.dailyAverageSalesCrates} crates / day</strong>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                  <span>Empty Crate Deposit:</span>
                  <span style={{ color: '#FBBF24', fontWeight: 600 }}>RWF {product.crateDepositValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Adjustment Drawer if toggled */}
          {quickAdjustOpen && (
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '16px 18px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Adjust Physical Stock Count for {product.name}
                </h4>
                <button
                  type="button"
                  onClick={() => setQuickAdjustOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAdjustSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                      Depot Warehouse
                    </label>
                    <select
                      className="select"
                      value={selectedWarehouseId}
                      onChange={(e) => setSelectedWarehouseId(e.target.value)}
                      style={{ fontSize: '12.5px', padding: '6px 10px', width: '100%', color: '#FFFFFF', backgroundColor: '#07132B', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                    >
                      {allWarehouses.map((w) => (
                        <option key={w.id} value={w.id} style={{ backgroundColor: '#07132B', color: '#FFFFFF' }}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                      Crates Adjustment (+ or -)
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                      placeholder="e.g. +15 or -5"
                      style={{ fontSize: '12.5px', padding: '6px 10px', width: '100%', color: '#FFFFFF', backgroundColor: '#07132B', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                    Reason for Correction (Audited)
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="e.g. Physical inventory cycle count variance"
                    style={{ fontSize: '12.5px', padding: '6px 10px', width: '100%', color: '#FFFFFF', backgroundColor: '#07132B', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setQuickAdjustOpen(false)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '6px 16px', fontSize: '12px' }}
                  >
                    Commit Count
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#07132B',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setQuickAdjustOpen(!quickAdjustOpen)}
              className="btn btn-secondary"
              style={{
                fontSize: '12.5px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <PlusCircle size={15} />
              <span>Correct Stock Count</span>
            </button>

            {onOpenTransfer && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTransfer();
                }}
                className="btn btn-secondary"
                style={{
                  fontSize: '12.5px',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowRightLeft size={15} />
                <span>Inter-Depot Transfer</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onOpenPO && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPO(product);
                }}
                style={{
                  backgroundColor: '#16A36A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 163, 106, 0.4)'
                }}
              >
                <Truck size={15} />
                <span>Order from BRALIRWA</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ fontSize: '12.5px', padding: '8px 16px' }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailModal;
