import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Check,
  X,
  AlertTriangle,
  ArrowDownToLine,
  Search,
  Boxes,
  Sparkles,
  Filter,
  ArrowRight,
  Warehouse,
  PenSquare,
  Save,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  Truck,
  ShieldCheck,
  Send,
  Eye,
  Sliders,
  DollarSign,
  PackageX,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Product, InventoryItem, GoodsReceiptReport } from '../types';
import { WarehouseHealthWidget } from '../components/warehouse/WarehouseHealthWidget';

interface WarehouseManualTelemetry {
  status: 'GOOD' | 'FAIR' | 'CRITICAL';
  stockValueText: string;
  lowStockText: string;
  lowStockProducts: string;
  lossDamageText: string;
  lossDamageDetails: string;
  stockAccuracyText: string;
  stockAccuracyDetails: string;
  alertText: string;
  alertProductCrates: number;
  alertDailyVelocity: number;
  alertRunwayDays: number;
  alertBufferDays: number;
  depotBayFillText: string;
  bayCratesStored: number;
  depotCapacity: number;
  shiftNotes: string;
  inspectorName: string;
  lastEditedText: string;
}

const DEFAULT_TELEMETRY: WarehouseManualTelemetry = {
  status: 'GOOD',
  stockValueText: 'RWF 96.4M',
  lowStockText: '4 products',
  lowStockProducts: 'Primus, Turbo, Vitaló, Fanta',
  lossDamageText: 'RWF 320K',
  lossDamageDetails: '24 crates (0.33% breakage rate)',
  stockAccuracyText: '98.7%',
  stockAccuracyDetails: '±14 crates physical audit variance',
  alertText: 'Primus may run out in 1.8 days',
  alertProductCrates: 738,
  alertDailyVelocity: 410,
  alertRunwayDays: 1.8,
  alertBufferDays: 10,
  depotBayFillText: 'Live Depot Telemetry • Gikondo Central Logistics Hub • 14,820 / 25,000 Crates (79.4% Bay Fill)',
  bayCratesStored: 14820,
  depotCapacity: 25000,
  shiftNotes: 'Morning Bralirwa replenishment from Gisenyi Brewery verified and unloaded with intact seals. Temperature buffer 4°C verified. All bays restacked.',
  inspectorName: 'Jean-Claude Mugabo (Warehouse Manager)',
  lastEditedText: 'Manager Verified'
};

export const WarehouseManagerDashboard: React.FC = () => {
  const {
    inventory,
    products,
    purchaseOrders,
    currentWarehouseId,
    currentTenant,
    adjustStock,
    receivePurchaseOrder,
    showToast,
    currentUser,
    setCurrentNav,
    postWarehouseReceivingCrossSync,
    addConnectedEvent,
    addAuditLog
  } = useApp();

  // Load manual telemetry from localStorage or defaults
  const [telemetry, setTelemetry] = useState<WarehouseManualTelemetry>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kbl_warehouse_telemetry');
      if (saved) {
        try {
          return { ...DEFAULT_TELEMETRY, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Failed to parse saved telemetry', e);
        }
      }
    }
    return DEFAULT_TELEMETRY;
  });

  // Editing access state
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState<'metrics' | 'runway' | 'capacity' | 'skus'>('metrics');

  // Form draft state for editing
  const [draftTelemetry, setDraftTelemetry] = useState<WarehouseManualTelemetry>(telemetry);

  // Editable SKU floor counts
  const [skuPhysicalCounts, setSkuPhysicalCounts] = useState<Record<string, number>>({});

  // Modals state for standard actions
  const [cycleCountModalOpen, setCycleCountModalOpen] = useState(false);
  const [cycleProductId, setCycleProductId] = useState(products[0]?.id || '');
  const [cyclePhysicalCount, setCyclePhysicalCount] = useState<number>(0);
  const [cycleReason, setCycleReason] = useState<string>('Routine Daily Floor Count');

  const [inboundModalOpen, setInboundModalOpen] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState(purchaseOrders[0]?.id || '');
  const [inboundDriverName, setInboundDriverName] = useState('Alexis Gasasira');
  const [inboundTruckPlate, setInboundTruckPlate] = useState('TR-BRAL-09');
  const [inboundDamaged, setInboundDamaged] = useState<number>(0);
  const [inboundDiscrepancyNotes, setInboundDiscrepancyNotes] = useState('Seals verified intact. Zero breakage.');

  const [breakageModalOpen, setBreakageModalOpen] = useState(false);
  const [breakageProductId, setBreakageProductId] = useState(products[0]?.id || '');
  const [breakageBottles, setBreakageBottles] = useState<number>(4);
  const [breakageCause, setBreakageCause] = useState<string>('Handling Slip');
  const [breakageLocation, setBreakageLocation] = useState('Zone A - Bay 3');

  // Warehouse Details & Calculations
  const allWarehouses = currentTenant.branches.flatMap((b) => b.warehouses);
  const activeWarehouse = allWarehouses.find((w) => w.id === currentWarehouseId) || allWarehouses[0] || {
    id: 'wh-main-gikondo',
    name: 'Main Distribution Hub (Gikondo)',
    capacityCrates: 25000,
    managerName: 'Jean-Claude Mugabo',
    phone: '+250 788 560 340',
    address: 'Plot 18, Gikondo Industrial Zone'
  };

  const currentDepotInventory = inventory.filter((inv) => inv.warehouseId === currentWarehouseId);

  // Initialize SKU physical counts when inventory loads
  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    currentDepotInventory.forEach((item) => {
      initialCounts[item.productId] = item.onHandCrates;
    });
    setSkuPhysicalCounts(initialCounts);
  }, [inventory, currentWarehouseId]);

  // Keep draft in sync when entering edit mode
  const handleOpenEditMode = () => {
    setDraftTelemetry(telemetry);
    setIsEditingMode(true);
  };

  // Save manual data entry
  const handleSaveTelemetry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedTelemetry: WarehouseManualTelemetry = {
      ...draftTelemetry,
      depotBayFillText: `Live Depot Telemetry • ${activeWarehouse.name} • ${draftTelemetry.bayCratesStored.toLocaleString()} / ${draftTelemetry.depotCapacity.toLocaleString()} Crates (${Math.round((draftTelemetry.bayCratesStored / (draftTelemetry.depotCapacity || 1)) * 100)}% Bay Fill)`,
      lastEditedText: `Edited today at ${timestamp} by ${currentUser.name}`
    };

    setTelemetry(updatedTelemetry);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kbl_warehouse_telemetry', JSON.stringify(updatedTelemetry));
    }

    // Publish connected event to sync with Owner Dashboard
    addConnectedEvent({
      sourceRole: 'warehouse_manager',
      sourceLabel: `Warehouse Manager (${currentUser.name})`,
      actionTitle: 'Depot Telemetry & Floor Data Updated Manually',
      description: `Health: ${updatedTelemetry.status}. Stock Value: ${updatedTelemetry.stockValueText}. Low stock: ${updatedTelemetry.lowStockText}. Loss/damage: ${updatedTelemetry.lossDamageText}. Accuracy: ${updatedTelemetry.stockAccuracyText}. Notes: ${updatedTelemetry.shiftNotes.substring(0, 90)}...`,
      impactWarehouse: 'Floor crate tallies, runway alert, and bay fill capacity updated by manager.',
      impactFinance: `Stock value: ${updatedTelemetry.stockValueText} verified against floor pallets.`,
      impactOwner: 'Owner Executive Dashboard updated with live manager floor verification.',
      status: 'executed'
    });

    addAuditLog(
      'Manual Warehouse Data Entry',
      'Warehouse Telemetry',
      currentWarehouseId,
      telemetry.status,
      `${updatedTelemetry.status} (Value: ${updatedTelemetry.stockValueText}, Accuracy: ${updatedTelemetry.stockAccuracyText})`
    );

    setIsEditingMode(false);
    showToast('Warehouse details saved! Synced to Owner Executive Dashboard.');
  };

  // Reset to automated ERP calculations
  const handleResetTelemetry = () => {
    setTelemetry(DEFAULT_TELEMETRY);
    setDraftTelemetry(DEFAULT_TELEMETRY);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kbl_warehouse_telemetry');
    }
    showToast('Restored default telemetry calculations.');
  };

  // Save physical SKU floor count adjustments
  const handleSaveSkuCounts = () => {
    let adjustmentsMade = 0;
    Object.entries(skuPhysicalCounts).forEach(([productId, enteredCount]) => {
      const item = currentDepotInventory.find((i) => i.productId === productId);
      if (item && item.onHandCrates !== enteredCount) {
        const diff = enteredCount - item.onHandCrates;
        adjustStock(productId, currentWarehouseId, diff, 'Manager Floor Tally Sheet Update');
        adjustmentsMade++;
      }
    });

    showToast(`Saved! Updated inventory for ${adjustmentsMade} beverage SKUs.`);
  };

  // Cycle count submit handler
  const handleCycleCountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = currentDepotInventory.find((i) => i.productId === cycleProductId);
    if (!item) {
      showToast('Product not found in this depot');
      return;
    }

    const variance = cyclePhysicalCount - item.onHandCrates;
    adjustStock(cycleProductId, currentWarehouseId, variance, cycleReason);
    setCycleCountModalOpen(false);
    showToast(`Cycle count posted! Discrepancy: ${variance > 0 ? '+' : ''}${variance} crates.`);
  };

  // Inbound receipt submit handler
  const handleInboundReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const po = purchaseOrders.find((p) => p.id === selectedPoId);
    if (!po) return;

    const orderedTotal = po.items.reduce((s, it) => s + it.orderedCrates, 0);
    const deliveredTotal = orderedTotal;
    const acceptedTotal = deliveredTotal - inboundDamaged;

    const report: GoodsReceiptReport = {
      receiptDate: new Date().toISOString().substring(0, 10),
      receivedBy: `${currentUser.name} (${currentUser.roleTitle})`,
      driverName: inboundDriverName,
      truckPlate: inboundTruckPlate,
      orderedTotal,
      deliveredTotal,
      damagedTotal: inboundDamaged,
      acceptedTotal,
      varianceTotal: inboundDamaged,
      discrepancyReason: inboundDiscrepancyNotes,
      inspectorSignature: `Checked by ${currentUser.name}`
    };

    receivePurchaseOrder(selectedPoId, report);
    postWarehouseReceivingCrossSync(po.poNumber, acceptedTotal, po.totalAmount);
    setInboundModalOpen(false);
    showToast(`PO ${po.poNumber} received and inventory updated.`);
  };

  // Breakage log submit handler
  const handleBreakageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === breakageProductId);
    if (!prod) return;

    const bottlesPerCrate = prod.unitsPerCrate || 24;
    const cratesEquivalent = Math.max(1, Math.floor(breakageBottles / bottlesPerCrate));
    adjustStock(breakageProductId, currentWarehouseId, -cratesEquivalent, `Damaged: ${breakageCause} at ${breakageLocation}`);
    setBreakageModalOpen(false);
    showToast(`Logged ${breakageBottles} broken bottles (${cratesEquivalent} crates adjusted).`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      {/* =========================================================================
          TOP MANAGER FLOOR COMMAND & EDITING ACCESS BAR
          ========================================================================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(8, 20, 42, 0.95) 0%, rgba(13, 30, 61, 0.95) 100%)',
          padding: '18px 24px',
          borderRadius: '18px',
          border: '1px solid #1E3B70',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#16A36A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(22, 163, 106, 0.4)'
            }}
          >
            <Warehouse size={24} color="#FFFFFF" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Warehouse Manager Operations & Floor Command
              </h1>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(22, 163, 106, 0.2)',
                  color: '#34D399',
                  border: '1px solid rgba(22, 163, 106, 0.4)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                EDITING ACCESS AUTHORIZED
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                <ShieldCheck size={12} />
                SYNCED TO OWNER DASHBOARD
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '12.5px', color: '#CBD5E1', flexWrap: 'wrap' }}>
              <span>Depot: <strong style={{ color: '#FFFFFF' }}>{activeWarehouse.name}</strong></span>
              <span>•</span>
              <span>Manager on Duty: <strong style={{ color: '#38BDF8' }}>{currentUser.name}</strong></span>
              <span>•</span>
              <span>Capacity: <strong style={{ color: '#D5A021' }}>{telemetry.depotCapacity.toLocaleString()} Crates</strong></span>
              <span>•</span>
              <span>Status: <strong style={{ color: '#34D399' }}>{telemetry.lastEditedText}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsEditingMode(!isEditingMode)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 700,
              backgroundColor: isEditingMode ? '#D5A021' : '#16A36A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(22, 163, 106, 0.4)',
              transition: 'all 0.18s ease'
            }}
          >
            <PenSquare size={16} />
            <span>{isEditingMode ? 'Close Edit Form' : 'Write / Edit Dashboard Data'}</span>
          </button>

          <button
            onClick={() => setInboundModalOpen(true)}
            style={{
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ArrowDownToLine size={15} color="#38BDF8" />
            <span>Inbound Gate PO</span>
          </button>

          <button
            onClick={() => setBreakageModalOpen(true)}
            style={{
              padding: '8px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <AlertTriangle size={15} color="#F87171" />
            <span>Log Breakage</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MANAGER MANUAL WRITING & DATA ENTRY PANEL (ACTIVE IN EDIT MODE)
          ========================================================================= */}
      {isEditingMode && (
        <div
          style={{
            background: 'linear-gradient(180deg, #0D1E3D 0%, #08142A 100%)',
            border: '2px solid #16A36A',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PenSquare size={18} color="#34D399" />
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Manual Floor Data Entry & Telemetry Editing
                </h2>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(22, 163, 106, 0.2)', color: '#34D399' }}>
                  DIRECT EDITING ACCESS
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#CBD5E1', margin: '4px 0 0 0' }}>
                Write and fill in physical warehouse floor details directly. All changes synchronize in real-time with the Owner Executive Dashboard.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handleResetTelemetry}
                style={{
                  padding: '6px 12px',
                  fontSize: '11.5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#CBD5E1',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={13} />
                <span>Reset to System Defaults</span>
              </button>
            </div>
          </div>

          {/* Sub-tabs for Editing Sections */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1E3B70', paddingBottom: '10px', overflowX: 'auto' }}>
            {[
              { id: 'metrics', label: '1. Health & Operating KPIs', icon: Sparkles },
              { id: 'runway', label: '2. Critical Depletion & Runway', icon: Flame },
              { id: 'capacity', label: '3. Bay Fill & Shift Log', icon: Layers },
              { id: 'skus', label: '4. Physical SKU Crate Tally', icon: Boxes }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeEditTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditTab(tab.id as any)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? '#16A36A' : 'rgba(255, 255, 255, 0.05)',
                    color: '#FFFFFF',
                    border: '1px solid',
                    borderColor: isActive ? '#16A36A' : 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSaveTelemetry} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* TAB 1: HEALTH & OPERATING KPIS */}
            {activeEditTab === 'metrics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  {/* Warehouse Health Status */}
                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Warehouse Health Status</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      {(['GOOD', 'FAIR', 'CRITICAL'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setDraftTelemetry({ ...draftTelemetry, status: st })}
                          style={{
                            flex: 1,
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 800,
                            border: '1.5px solid',
                            borderColor:
                              draftTelemetry.status === st
                                ? st === 'GOOD'
                                  ? '#10B981'
                                  : st === 'FAIR'
                                  ? '#FBBF24'
                                  : '#EF4444'
                                : 'rgba(255, 255, 255, 0.1)',
                            backgroundColor:
                              draftTelemetry.status === st
                                ? st === 'GOOD'
                                  ? 'rgba(16, 185, 129, 0.25)'
                                  : st === 'FAIR'
                                  ? 'rgba(245, 158, 11, 0.25)'
                                  : 'rgba(239, 68, 68, 0.25)'
                                : 'rgba(255, 255, 255, 0.05)',
                            color:
                              draftTelemetry.status === st
                                ? st === 'GOOD'
                                  ? '#34D399'
                                  : st === 'FAIR'
                                  ? '#FBBF24'
                                  : '#F87171'
                                : '#94A3B8',
                            cursor: 'pointer'
                          }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stock Value */}
                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Total Stock Value Text</label>
                    <input
                      type="text"
                      value={draftTelemetry.stockValueText}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, stockValueText: e.target.value })}
                      placeholder="e.g. RWF 96.4M"
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374', fontWeight: 700 }}
                      required
                    />
                  </div>

                  {/* Low Stock Text */}
                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Low Stock Headline Text</label>
                    <input
                      type="text"
                      value={draftTelemetry.lowStockText}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, lowStockText: e.target.value })}
                      placeholder="e.g. 4 products"
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374', fontWeight: 700 }}
                      required
                    />
                  </div>

                  {/* Low Stock Affected SKUs */}
                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Affected Low-Stock Products</label>
                    <input
                      type="text"
                      value={draftTelemetry.lowStockProducts}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, lowStockProducts: e.target.value })}
                      placeholder="e.g. Primus, Turbo, Vitaló, Fanta"
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  {/* Loss / Damage Text */}
                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Loss / Damage Value</label>
                    <input
                      type="text"
                      value={draftTelemetry.lossDamageText}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, lossDamageText: e.target.value })}
                      placeholder="e.g. RWF 320K"
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374', fontWeight: 700 }}
                      required
                    />
                  </div>

                  {/* Loss / Damage Details */}
                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Breakage / Loss Incident Details</label>
                    <input
                      type="text"
                      value={draftTelemetry.lossDamageDetails}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, lossDamageDetails: e.target.value })}
                      placeholder="e.g. 24 crates (0.33% breakage rate)"
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                      required
                    />
                  </div>

                  {/* Stock Accuracy Text */}
                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Stock Accuracy Percentage</label>
                    <input
                      type="text"
                      value={draftTelemetry.stockAccuracyText}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, stockAccuracyText: e.target.value })}
                      placeholder="e.g. 98.7%"
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374', fontWeight: 700 }}
                      required
                    />
                  </div>

                  {/* Stock Accuracy Details */}
                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Physical Audit Discrepancy Note</label>
                    <input
                      type="text"
                      value={draftTelemetry.stockAccuracyDetails}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, stockAccuracyDetails: e.target.value })}
                      placeholder="e.g. ±14 crates physical audit variance"
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CRITICAL DEPLETION & RUNWAY */}
            {activeEditTab === 'runway' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="label" style={{ color: '#CBD5E1' }}>Critical Stock Depletion Alert Headline</label>
                    <input
                      type="text"
                      value={draftTelemetry.alertText}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, alertText: e.target.value })}
                      placeholder="e.g. Primus may run out in 1.8 days"
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374', fontSize: '15px', fontWeight: 700 }}
                      required
                    />
                  </div>

                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Runway Remaining (Days)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={draftTelemetry.alertRunwayDays}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, alertRunwayDays: parseFloat(e.target.value) || 0 })}
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374', fontWeight: 700 }}
                      required
                    />
                  </div>

                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Physical Crates on Hand (Critical SKU)</label>
                    <input
                      type="number"
                      min="0"
                      value={draftTelemetry.alertProductCrates}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, alertProductCrates: parseInt(e.target.value) || 0 })}
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374', fontWeight: 700 }}
                      required
                    />
                  </div>

                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Daily Sales Velocity (Crates / Day)</label>
                    <input
                      type="number"
                      min="1"
                      value={draftTelemetry.alertDailyVelocity}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, alertDailyVelocity: parseInt(e.target.value) || 1 })}
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374', fontWeight: 700 }}
                      required
                    />
                  </div>

                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Buffer Stock Target (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={draftTelemetry.alertBufferDays}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, alertBufferDays: parseInt(e.target.value) || 10 })}
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374', fontWeight: 700 }}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BAY CAPACITY & SHIFT LOG */}
            {activeEditTab === 'capacity' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Crates Stored in Bays</label>
                    <input
                      type="number"
                      min="0"
                      value={draftTelemetry.bayCratesStored}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, bayCratesStored: parseInt(e.target.value) || 0 })}
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374', fontWeight: 700 }}
                      required
                    />
                  </div>

                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Total Depot Bay Capacity (Crates)</label>
                    <input
                      type="number"
                      min="1000"
                      value={draftTelemetry.depotCapacity}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, depotCapacity: parseInt(e.target.value) || 25000 })}
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374', fontWeight: 700 }}
                      required
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="label" style={{ color: '#CBD5E1' }}>Manager on Duty Signoff Name</label>
                    <input
                      type="text"
                      value={draftTelemetry.inspectorName}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, inspectorName: e.target.value })}
                      className="input"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                      required
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="label" style={{ color: '#CBD5E1' }}>Manager Daily Shift Remarks & Inspection Log</label>
                    <textarea
                      value={draftTelemetry.shiftNotes}
                      onChange={(e) => setDraftTelemetry({ ...draftTelemetry, shiftNotes: e.target.value })}
                      className="textarea"
                      rows={3}
                      placeholder="Write daily remarks regarding floor counts, cold chain temperature, breakage write-offs, or logistics..."
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PHYSICAL SKU CRATE TALLY */}
            {activeEditTab === 'skus' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#CBD5E1' }}>
                    Direct manual count per SKU on depot floor. Write exact numbers from the physical tally sheet.
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveSkuCounts}
                    style={{
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: '#3478F6',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Apply Physical SKU Counts
                  </button>
                </div>

                <div className="table-wrapper" style={{ border: '1px solid #1E3B70', borderRadius: '10px', overflow: 'hidden' }}>
                  <table className="data-table">
                    <thead>
                      <tr style={{ backgroundColor: '#0B1733', color: '#CBD5E1' }}>
                        <th>Product SKU & Packaging</th>
                        <th>Category</th>
                        <th style={{ textAlign: 'right' }}>System Record</th>
                        <th style={{ textAlign: 'right' }}>Physical Floor Count (Write In)</th>
                        <th style={{ textAlign: 'right' }}>Variance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => {
                        const invItem = currentDepotInventory.find((i) => i.productId === p.id);
                        const sysCount = invItem?.onHandCrates || 0;
                        const physical = skuPhysicalCounts[p.id] !== undefined ? skuPhysicalCounts[p.id] : sysCount;
                        const variance = physical - sysCount;

                        return (
                          <tr key={p.id} style={{ borderBottom: '1px solid #16243E' }}>
                            <td>
                              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '13px' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{p.sku} • {p.packaging}</div>
                            </td>
                            <td>
                              <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.06)', color: '#CBD5E1' }}>
                                {p.category}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right', color: '#CBD5E1', fontWeight: 600 }}>
                              {sysCount.toLocaleString()} crates
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <input
                                type="number"
                                min="0"
                                value={physical}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  setSkuPhysicalCounts((prev) => ({ ...prev, [p.id]: val }));
                                }}
                                style={{
                                  width: '100px',
                                  padding: '5px 8px',
                                  textAlign: 'right',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  border: '1px solid #38BDF8',
                                  borderRadius: '6px',
                                  color: '#FFFFFF',
                                  fontWeight: 700,
                                  fontSize: '13px'
                                }}
                              />
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 700, color: variance === 0 ? '#34D399' : variance > 0 ? '#60A5FA' : '#F87171' }}>
                              {variance > 0 ? `+${variance}` : variance} crates
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Save & Cancel Action Strip */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #1E3B70', paddingTop: '14px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsEditingMode(false)}
                style={{
                  padding: '9px 18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  padding: '9px 24px',
                  backgroundColor: '#16A36A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 163, 106, 0.45)'
                }}
              >
                <Save size={16} />
                <span>Save & Publish to Owner Dashboard</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          WAREHOUSE HEALTH WIDGET (POWERED BY MANAGER'S MANUALLY ENTERED VALUES)
          ========================================================================= */}
      <WarehouseHealthWidget
        status={telemetry.status}
        stockValueText={telemetry.stockValueText}
        lowStockText={telemetry.lowStockText}
        lowStockProducts={telemetry.lowStockProducts}
        lossDamageText={telemetry.lossDamageText}
        lossDamageDetails={telemetry.lossDamageDetails}
        stockAccuracyText={telemetry.stockAccuracyText}
        stockAccuracyDetails={telemetry.stockAccuracyDetails}
        alertText={telemetry.alertText}
        alertProductCrates={telemetry.alertProductCrates}
        alertDailyVelocity={telemetry.alertDailyVelocity}
        alertRunwayDays={telemetry.alertRunwayDays}
        alertBufferDays={telemetry.alertBufferDays}
        depotBayFillText={telemetry.depotBayFillText}
        lastEditedText={telemetry.lastEditedText}
        onViewWarehouse={() => setCurrentNav('inventory')}
        onQuickPO={() => setInboundModalOpen(true)}
        onLogBreakage={() => setBreakageModalOpen(true)}
        onCycleCount={() => {
          const item = currentDepotInventory[0];
          setCycleProductId(item?.productId || products[0]?.id || '');
          setCyclePhysicalCount(item?.onHandCrates || 0);
          setCycleCountModalOpen(true);
        }}
        onEditTelemetry={handleOpenEditMode}
      />

      {/* =========================================================================
          MANAGER DAILY SHIFT INSPECTION LOG & BAY OCCUPANCY CARD
          ========================================================================= */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0B1733 0%, #081226 100%)',
          border: '1px solid #1E3B70',
          borderRadius: '16px',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={18} color="#38BDF8" />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Depot Floor Inspection & Shift Verification Log
            </h3>
          </div>

          <button
            onClick={() => {
              setActiveEditTab('capacity');
              setIsEditingMode(true);
            }}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#38BDF8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PenSquare size={13} />
            <span>Update Shift Remarks</span>
          </button>
        </div>

        {/* Current Remarks Quote Box */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderLeft: '4px solid #16A36A',
            padding: '14px 18px',
            borderRadius: '0 10px 10px 0'
          }}
        >
          <div style={{ fontSize: '13.5px', color: '#FFFFFF', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{telemetry.shiftNotes}"
          </div>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Verified By: <strong style={{ color: '#38BDF8' }}>{telemetry.inspectorName}</strong></span>
            <span>•</span>
            <span>Audit Status: <strong style={{ color: '#34D399' }}>{telemetry.lastEditedText}</strong></span>
          </div>
        </div>

        {/* Bay Capacity Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#CBD5E1' }}>
            <span>Depot Bay Utilization ({telemetry.bayCratesStored.toLocaleString()} / {telemetry.depotCapacity.toLocaleString()} Crates)</span>
            <span style={{ fontWeight: 700, color: '#38BDF8' }}>
              {Math.round((telemetry.bayCratesStored / (telemetry.depotCapacity || 1)) * 100)}% Occupied
            </span>
          </div>
          <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, (telemetry.bayCratesStored / (telemetry.depotCapacity || 1)) * 100)}%`,
                backgroundColor: telemetry.bayCratesStored / telemetry.depotCapacity > 0.85 ? '#FBBF24' : '#16A36A',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          QUICK ACCESS TO STOCK & INVENTORY
          ========================================================================= */}
      <div
        onClick={() => setCurrentNav('inventory')}
        style={{
          backgroundColor: '#091938',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '22px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.45)'
        }}
        className="hover-lift"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(22, 163, 106, 0.6)';
          e.currentTarget.style.backgroundColor = '#0B1E44';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.backgroundColor = '#091938';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'rgba(22, 163, 106, 0.2)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Boxes size={26} color="#34D399" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Stock & Inventory Master
              </h3>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(22, 163, 106, 0.2)',
                  color: '#34D399',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: '1px solid rgba(22, 163, 106, 0.35)'
                }}
              >
                {products.length} SKUs Managed
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
              Access full product cards, live crate counts, cold-chain buffers, and stock runway.
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentNav('inventory');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#16A36A',
            color: '#FFFFFF',
            padding: '11px 22px',
            borderRadius: '999px',
            fontSize: '13.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(22, 163, 106, 0.35)',
            flexShrink: 0,
            transition: 'all 0.18s ease'
          }}
          className="hover-bright"
        >
          <Boxes size={17} />
          <span>Open Stock & Inventory</span>
          <ArrowRight size={17} />
        </button>
      </div>

      {/* =========================================================================
          MODAL 1: PHYSICAL CYCLE COUNT & STOCK ADJUSTMENT
          ========================================================================= */}
      {cycleCountModalOpen && (
        <div className="modal-backdrop" onClick={() => setCycleCountModalOpen(false)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', backgroundColor: '#0B1733', border: '1px solid #1E3B70', color: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Depot Stock Cycle Count Verification
                </h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                  Reconcile physical floor inventory with ERP digital record for {activeWarehouse.name}.
                </p>
              </div>
              <button onClick={() => setCycleCountModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCycleCountSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label" style={{ color: '#CBD5E1' }}>Select Product SKU to Recount</label>
                <select
                  value={cycleProductId}
                  onChange={(e) => {
                    setCycleProductId(e.target.value);
                    const item = currentDepotInventory.find((i) => i.productId === e.target.value);
                    setCyclePhysicalCount(item?.onHandCrates || 0);
                  }}
                  className="select"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id} style={{ backgroundColor: '#0B1733', color: '#FFFFFF' }}>
                      {p.name} ({p.sku}) — {p.packaging}
                    </option>
                  ))}
                </select>
              </div>

              {(() => {
                const currentItem = currentDepotInventory.find((i) => i.productId === cycleProductId);
                const systemCount = currentItem?.onHandCrates || 0;
                const variance = cyclePhysicalCount - systemCount;

                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '14px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>System Recorded Count</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }} className="tabular-nums">
                          {systemCount.toLocaleString()} crates
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>Physical Count Entered</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#3478F6' }} className="tabular-nums">
                          {cyclePhysicalCount.toLocaleString()} crates
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>Variance / Discrepancy</div>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 800,
                            color: variance === 0 ? '#10B981' : variance > 0 ? '#34D399' : '#EF4444'
                          }}
                          className="tabular-nums"
                        >
                          {variance > 0 ? `+${variance}` : variance} crates
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="label" style={{ color: '#CBD5E1' }}>Physical Count Result (Crates)</label>
                      <input
                        type="number"
                        min="0"
                        value={cyclePhysicalCount}
                        onChange={(e) => setCyclePhysicalCount(parseInt(e.target.value) || 0)}
                        className="input"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                        required
                      />
                    </div>

                    <div>
                      <label className="label" style={{ color: '#CBD5E1' }}>Reason for Variance / Recount Note</label>
                      <input
                        type="text"
                        value={cycleReason}
                        onChange={(e) => setCycleReason(e.target.value)}
                        className="input"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                      />
                    </div>
                  </>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setCycleCountModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px' }}>
                  <Check size={16} />
                  <span>Post Verified Stock Count</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: INBOUND GATE BREWERY INTAKE & SEAL VERIFICATION
          ========================================================================= */}
      {inboundModalOpen && (
        <div className="modal-backdrop" onClick={() => setInboundModalOpen(false)}>
          <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', backgroundColor: '#0B1733', border: '1px solid #1E3B70', color: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Dock Gate Inbound PO Verification
                </h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                  Inspect arriving brewery trailer from Bralirwa, verify seals, tally pallet counts, and update inventory.
                </p>
              </div>
              <button onClick={() => setInboundModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInboundReceiptSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label" style={{ color: '#CBD5E1' }}>Select Inbound BRALIRWA Purchase Order</label>
                <select
                  value={selectedPoId}
                  onChange={(e) => setSelectedPoId(e.target.value)}
                  className="select"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                >
                  {purchaseOrders.map((p) => (
                    <option key={p.id} value={p.id} style={{ backgroundColor: '#0B1733', color: '#FFFFFF' }}>
                      {p.poNumber} — {p.supplier} ({p.items.reduce((s, it) => s + it.orderedCrates, 0)} crates) [{p.status.toUpperCase()}]
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div>
                  <label className="label" style={{ color: '#CBD5E1' }}>Trailer Truck Plate Number</label>
                  <input
                    type="text"
                    value={inboundTruckPlate}
                    onChange={(e) => setInboundTruckPlate(e.target.value)}
                    className="input"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                    required
                  />
                </div>

                <div>
                  <label className="label" style={{ color: '#CBD5E1' }}>Brewery Driver Full Name</label>
                  <input
                    type="text"
                    value={inboundDriverName}
                    onChange={(e) => setInboundDriverName(e.target.value)}
                    className="input"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div>
                  <label className="label" style={{ color: '#CBD5E1' }}>Damaged Crates on Arrival (Transit Jarring)</label>
                  <input
                    type="number"
                    min="0"
                    value={inboundDamaged}
                    onChange={(e) => setInboundDamaged(parseInt(e.target.value) || 0)}
                    className="input"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                  />
                </div>

                <div>
                  <label className="label" style={{ color: '#CBD5E1' }}>Receiver Signature / Badge</label>
                  <input
                    type="text"
                    readOnly
                    value={`${currentUser.name} (${currentUser.roleTitle})`}
                    className="input"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', color: '#94A3B8', borderColor: '#2A4374' }}
                  />
                </div>
              </div>

              <div>
                <label className="label" style={{ color: '#CBD5E1' }}>Inspection Notes & Seal Confirmation</label>
                <textarea
                  value={inboundDiscrepancyNotes}
                  onChange={(e) => setInboundDiscrepancyNotes(e.target.value)}
                  className="textarea"
                  rows={2}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setInboundModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px' }}>
                  <ArrowDownToLine size={16} />
                  <span>Accept Cargo & Increment Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: BREAKAGE & SPOILAGE INCIDENT LOG
          ========================================================================= */}
      {breakageModalOpen && (
        <div className="modal-backdrop" onClick={() => setBreakageModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', backgroundColor: '#0B1733', border: '1px solid #1E3B70', color: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Report Beverage Breakage & Spoilage
                </h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                  Document handling losses for write-off and insurance credit.
                </p>
              </div>
              <button onClick={() => setBreakageModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBreakageSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="label" style={{ color: '#CBD5E1' }}>Damaged Product</label>
                <select
                  value={breakageProductId}
                  onChange={(e) => setBreakageProductId(e.target.value)}
                  className="select"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id} style={{ backgroundColor: '#0B1733', color: '#FFFFFF' }}>
                      {p.name} ({p.packaging})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label className="label" style={{ color: '#CBD5E1' }}>Bottles / Cans Broken</label>
                  <input
                    type="number"
                    min="1"
                    value={breakageBottles}
                    onChange={(e) => setBreakageBottles(parseInt(e.target.value) || 1)}
                    className="input"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                    required
                  />
                </div>

                <div>
                  <label className="label" style={{ color: '#CBD5E1' }}>Incident Cause</label>
                  <select
                    value={breakageCause}
                    onChange={(e) => setBreakageCause(e.target.value)}
                    className="select"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                  >
                    <option value="Handling Slip">Handling Slip (Manual)</option>
                    <option value="Forklift Tilt">Forklift Maneuver Impact</option>
                    <option value="Stack Failure">Stack Height Instability</option>
                    <option value="Transit Jarring">Transit Jarring from Brewery</option>
                    <option value="Damaged Pallet">Defective Wooden Pallet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label" style={{ color: '#CBD5E1' }}>Depot Location</label>
                <input
                  type="text"
                  value={breakageLocation}
                  onChange={(e) => setBreakageLocation(e.target.value)}
                  className="input"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setBreakageModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', borderColor: '#2A4374' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" style={{ padding: '8px 18px' }}>
                  <AlertTriangle size={15} />
                  <span>Log Breakage & Adjust Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseManagerDashboard;
