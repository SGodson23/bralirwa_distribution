import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Boxes,
  Plus,
  ArrowRightLeft,
  Search,
  Filter,
  Download,
  LayoutGrid,
  Table as TableIcon,
  Warehouse,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Product, InventoryItem } from '../types';
import { ProductStockCard } from '../components/inventory/ProductStockCard';
import { StockDetailModal } from '../components/inventory/StockDetailModal';

export const InventoryModule: React.FC = () => {
  const {
    inventory,
    products,
    currentWarehouseId,
    setCurrentWarehouseId,
    currentTenant,
    adjustStock,
    setQuickCreateOpen,
    setQuickCreateType,
    showToast,
    setCurrentNav
  } = useApp();

  // Search, Filters & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'low_stock' | 'critical' | 'overstock'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State for View Details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Global Stock Correction Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustProdId, setAdjustProdId] = useState(products[0]?.id || '');
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState('Physical cycle count discrepancy');

  // Warehouses list
  const allWarehouses = currentTenant.branches.flatMap((b) => b.warehouses);

  // Categories list
  const categories = ['All', 'Malt & Energy', 'Beer', 'Premium', 'Soft Drinks', 'Water'];

  // Filtered inventory logic
  const filteredProductsWithStock = products.filter((prod) => {
    // Category match
    const matchesCat = selectedCategory === 'All' || prod.category === selectedCategory;

    // Search query match
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.packaging.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter match (based on current warehouse inventory or default)
    const inv = inventory.find((i) => i.productId === prod.id && (currentWarehouseId === 'all' || i.warehouseId === currentWarehouseId))
      || inventory.find((i) => i.productId === prod.id);

    const matchesStatus = statusFilter === 'all' || (inv && inv.status === statusFilter);

    return matchesCat && matchesSearch && matchesStatus;
  });

  // Calculate aggregated stats
  const totalCratesOnHand = inventory.reduce((a, b) => a + b.onHandCrates, 0);
  const totalCratesReserved = inventory.reduce((a, b) => a + b.reservedCrates, 0);
  const totalCratesAvailable = totalCratesOnHand - totalCratesReserved;
  const totalDamagedCrates = inventory.reduce((a, b) => a + b.damagedCrates, 0);

  const totalValuationRWF = inventory.reduce((acc, item) => {
    const prod = products.find((p) => p.id === item.productId);
    return acc + item.onHandCrates * (prod?.bralirwaPurchasePrice || 14000);
  }, 0);

  // Open product details modal
  const handleViewDetails = (prod: Product, item: InventoryItem) => {
    setSelectedProduct(prod);
    setSelectedInventoryItem(item);
    setDetailModalOpen(true);
  };

  // Adjust stock handler
  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adjustStock(adjustProdId, currentWarehouseId, adjustAmount, adjustReason);
    setAdjustModalOpen(false);
    showToast(`Stock count updated: ${adjustAmount > 0 ? '+' : ''}${adjustAmount} crates!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '50px' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
              Inventory & Stock Management
            </h1>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                backgroundColor: 'rgba(22, 163, 106, 0.2)',
                color: '#34D399',
                padding: '3px 10px',
                borderRadius: '999px',
                border: '1px solid rgba(22, 163, 106, 0.35)'
              }}
            >
              Live Brewery Sync
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: '#94A3B8', marginTop: '4px', margin: 0 }}>
            Real-time physical crates in stock, reservation statuses, daily run-rate cover, and beverage product matrix
          </p>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Warehouse Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '4px 10px'
            }}
          >
            <Warehouse size={15} color="#16A36A" />
            <select
              value={currentWarehouseId}
              onChange={(e) => setCurrentWarehouseId(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {allWarehouses.map((w) => (
                <option key={w.id} value={w.id} style={{ backgroundColor: '#07132B', color: '#FFFFFF' }}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setQuickCreateType('transfer');
              setQuickCreateOpen(true);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <ArrowRightLeft size={15} color="#38BDF8" />
            <span>Inter-Depot Transfer</span>
          </button>

          <button
            onClick={() => setAdjustModalOpen(true)}
            style={{
              padding: '8px 16px',
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
              boxShadow: '0 4px 12px rgba(22, 163, 106, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={15} />
            <span>Stock Correction</span>
          </button>
        </div>
      </div>

      {/* Top Stock KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '16px 20px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Physical Stock
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0' }} className="tabular-nums">
            {totalCratesOnHand.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8' }}>Crates</span>
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 600 }}>
            {products.length} active beverage lines
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '16px 20px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
            Available to Sell
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981', margin: '4px 0' }} className="tabular-nums">
            {totalCratesAvailable.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8' }}>Crates</span>
          </div>
          <div style={{ fontSize: '12px', color: '#34D399' }}>
            Ready for instant dispatch
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '16px 20px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
            Reserved for Orders
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#38BDF8', margin: '4px 0' }} className="tabular-nums">
            {totalCratesReserved.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8' }}>Crates</span>
          </div>
          <div style={{ fontSize: '12px', color: '#7DD3FC' }}>
            Staged in dock loading bays
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '16px 20px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
            Damaged / Breakages
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#F87171', margin: '4px 0' }} className="tabular-nums">
            {totalDamagedCrates} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8' }}>Crates</span>
          </div>
          <div style={{ fontSize: '12px', color: '#F87171' }}>
            0.3% depot loss rate (Logged)
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '16px 20px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Asset Valuation
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#FBBF24', margin: '4px 0' }} className="tabular-nums">
            RWF {(totalValuationRWF / 1_000_000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '12px', color: '#FCD34D' }}>
            Factory cost valuation
          </div>
        </div>
      </div>

      {/* Filter, Search & View Controls Bar */}
      <div
        style={{
          backgroundColor: '#0B1733',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '18px',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {/* Row 1: Search, Status Filter & View Mode */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '10px',
              padding: '8px 14px',
              flex: 1,
              minWidth: '280px'
            }}
          >
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search by product name, SKU, brand, packaging..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Status Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Status:</span>
            {(['all', 'healthy', 'low_stock', 'critical'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: statusFilter === s ? 700 : 500,
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: statusFilter === s ? '#16A36A' : 'rgba(255, 255, 255, 0.12)',
                  backgroundColor: statusFilter === s ? 'rgba(22, 163, 106, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: statusFilter === s ? '#34D399' : '#CBD5E1',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.12s ease'
                }}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? '#16A36A' : 'transparent',
                color: viewMode === 'grid' ? '#FFFFFF' : '#94A3B8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Product Cards View (Reference Design)"
            >
              <LayoutGrid size={15} />
              <span>Cards</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'table' ? '#16A36A' : 'transparent',
                color: viewMode === 'table' ? '#FFFFFF' : '#94A3B8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Data Table View"
            >
              <TableIcon size={15} />
              <span>Matrix</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: selectedCategory === cat ? 700 : 500,
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#16A36A' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: selectedCategory === cat ? 'rgba(22, 163, 106, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat ? '#34D399' : '#94A3B8',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.12s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Area: Product Cards Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="beverage-paired-grid">
          {filteredProductsWithStock.map((prod) => {
            const item = inventory.find((i) => i.productId === prod.id && (currentWarehouseId === 'all' || i.warehouseId === currentWarehouseId))
              || inventory.find((i) => i.productId === prod.id)
              || {
                id: `inv-${prod.id}`,
                productId: prod.id,
                warehouseId: currentWarehouseId,
                onHandCrates: 487,
                reservedCrates: 45,
                availableCrates: 442,
                damagedCrates: 1,
                dailyAverageSalesCrates: 59,
                minLevelCrates: 150,
                maxLevelCrates: 650,
                reorderPointCrates: 250,
                stockCoverDays: 8.2,
                batchNumber: 'BRAL-KGL-240902-CH',
                expiryDate: '2026-09-02',
                status: 'healthy'
              };

            return (
              <ProductStockCard
                key={prod.id}
                product={prod}
                inventoryItem={item}
                onViewDetails={handleViewDetails}
              />
            );
          })}
        </div>
      ) : (
        <div className="table-wrapper" style={{ backgroundColor: '#0B1733', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.12)', overflow: 'hidden' }}>
          <table className="data-table responsive-stack">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>On Hand</th>
                <th>Reserved</th>
                <th>Available</th>
                <th>Damaged</th>
                <th>Daily Run-Rate</th>
                <th>Runway</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductsWithStock.map((prod) => {
                const item = inventory.find((i) => i.productId === prod.id && (currentWarehouseId === 'all' || i.warehouseId === currentWarehouseId))
                  || inventory.find((i) => i.productId === prod.id);
                if (!item) return null;

                return (
                  <tr key={prod.id}>
                    <td data-label="Product">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {prod.imageUrl && (
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            style={{ width: '34px', height: '34px', objectFit: 'contain' }}
                          />
                        )}
                        <div>
                          <strong style={{ color: '#FFFFFF', fontSize: '13.5px' }}>{prod.name}</strong>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                            {prod.sku} • {prod.bottleVolume}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Category">
                      <span className="badge badge-neutral">{prod.category}</span>
                    </td>
                    <td data-label="On Hand" className="tabular-nums" style={{ fontWeight: 700, color: '#FFFFFF' }}>
                      {item.onHandCrates.toLocaleString()} crates
                    </td>
                    <td data-label="Reserved" className="tabular-nums" style={{ color: '#38BDF8' }}>
                      {item.reservedCrates.toLocaleString()}
                    </td>
                    <td data-label="Available" className="tabular-nums" style={{ fontWeight: 700, color: '#34D399' }}>
                      {item.availableCrates.toLocaleString()}
                    </td>
                    <td data-label="Damaged" className="tabular-nums" style={{ color: item.damagedCrates > 0 ? '#F87171' : '#94A3B8' }}>
                      {item.damagedCrates}
                    </td>
                    <td data-label="Daily Run-Rate" className="tabular-nums" style={{ color: '#CBD5E1' }}>
                      {item.dailyAverageSalesCrates} / day
                    </td>
                    <td data-label="Runway">
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor:
                            item.status === 'critical' ? 'rgba(239, 68, 68, 0.2)' : item.status === 'low_stock' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(22, 163, 106, 0.2)',
                          color:
                            item.status === 'critical' ? '#F87171' : item.status === 'low_stock' ? '#FBBF24' : '#34D399'
                        }}
                      >
                        {item.stockCoverDays.toFixed(1)} Days
                      </span>
                    </td>
                    <td data-label="Status">
                      <span
                        className={`badge ${
                          item.status === 'healthy'
                            ? 'badge-success'
                            : item.status === 'low_stock'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td data-label="Action">
                      <button
                        onClick={() => handleViewDetails(prod, item)}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11.5px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(22, 163, 106, 0.2)',
                          border: '1px solid rgba(22, 163, 106, 0.4)',
                          color: '#34D399',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Detail Modal (Opened when owner clicks "View Details" on card) */}
      {detailModalOpen && selectedProduct && selectedInventoryItem && (
        <StockDetailModal
          product={selectedProduct}
          inventoryItem={selectedInventoryItem}
          allWarehouses={allWarehouses}
          currentWarehouseId={currentWarehouseId}
          onClose={() => setDetailModalOpen(false)}
          onAdjustStock={(prodId, whId, amt, rsn) => {
            adjustStock(prodId, whId, amt, rsn);
            showToast(`Inventory count updated: ${amt > 0 ? '+' : ''}${amt} crates!`);
          }}
          onOpenTransfer={() => {
            setQuickCreateType('transfer');
            setQuickCreateOpen(true);
          }}
          onOpenPO={(p) => {
            setCurrentNav('purchases');
            showToast(`Pre-filling replenishment purchase order for ${p.name}`);
          }}
        />
      )}

      {/* Global Stock Correction Modal */}
      {adjustModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setAdjustModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 14, 34, 0.85)',
            backdropFilter: 'blur(8px)',
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
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255, 255, 255, 0.14)'
            }}
          >
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#07132B' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Stock Adjustment / Discrepancy Correction
              </h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0' }}>
                All stock movements are permanently registered in the cryptographic audit trail
              </p>
            </div>

            <form onSubmit={handleAdjustSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label" style={{ color: '#CBD5E1', fontWeight: 700 }}>Select Beverage SKU</label>
                <select
                  className="select"
                  value={adjustProdId}
                  onChange={(e) => setAdjustProdId(e.target.value)}
                  style={{ width: '100%', color: '#FFFFFF', backgroundColor: '#07132B', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id} style={{ backgroundColor: '#07132B', color: '#FFFFFF' }}>
                      {p.name} ({p.packaging})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" style={{ color: '#CBD5E1', fontWeight: 700 }}>Adjustment Difference (Crates)</label>
                <input
                  type="number"
                  required
                  className="input"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  placeholder="e.g. +10 or -5"
                  style={{ width: '100%', color: '#FFFFFF', backgroundColor: '#07132B', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                />
                <span style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  Positive number increases stock count; negative number writes off breakage/loss.
                </span>
              </div>

              <div>
                <label className="label" style={{ color: '#CBD5E1', fontWeight: 700 }}>Audited Reason</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Physical inventory cycle count discrepancy"
                  style={{ width: '100%', color: '#FFFFFF', backgroundColor: '#07132B', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', backgroundColor: '#16A36A', border: 'none', boxShadow: '0 4px 14px rgba(22, 163, 106, 0.4)' }}
                >
                  Commit Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Stock Detail Modal */}
      {detailModalOpen && selectedProduct && (
        <StockDetailModal
          product={selectedProduct}
          inventoryItem={selectedInventoryItem}
          allWarehouses={allWarehouses}
          currentWarehouseId={currentWarehouseId}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedProduct(null);
            setSelectedInventoryItem(null);
          }}
          onAdjustStock={adjustStock}
          onOpenTransfer={() => {
            setDetailModalOpen(false);
            setQuickCreateType('transfer');
            setQuickCreateOpen(true);
          }}
          onOpenPO={(prod) => {
            setDetailModalOpen(false);
            showToast(`Generating PO for ${prod.name}`);
            setCurrentNav('purchases');
          }}
        />
      )}
    </div>
  );
};
