import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Shield,
  Layers,
  CheckCircle2,
  Users,
  Server,
  Database,
  Lock,
  Plus,
  Search,
  ExternalLink,
  Sliders,
  DollarSign,
  Activity,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Smartphone,
  Truck,
  Cpu,
  FileText,
  Download,
  Key,
  Eye,
  UserCheck,
  Radio,
  Trash2,
  Settings,
  Zap,
  Power,
  Ban,
  Check,
  X,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  ShieldAlert,
  Send,
  Boxes
} from 'lucide-react';
import { Tenant, Product, UserRole } from '../types';
import { ALL_USER_CREDENTIALS } from '../data/mockData';

type SuperhostTab = 'tenants' | 'catalog' | 'users' | 'integrations' | 'security' | 'platform';

interface BlacklistEntity {
  id: string;
  type: 'Retailer TIN' | 'Delivery Truck' | 'Driver License';
  identifier: string;
  name: string;
  reason: string;
  dateAdded: string;
  addedBy: string;
  status: 'active_ban' | 'under_review';
}

interface BackupSnapshot {
  id: string;
  name: string;
  timestamp: string;
  sizeMb: number;
  hash: string;
  recordCount: number;
  type: 'Automated Daily' | 'Manual Superhost';
}

export const SuperAdminModule: React.FC = () => {
  const {
    tenants,
    currentTenant,
    setTenantId,
    addTenant,
    updateTenant,
    toggleTenantStatus,
    updateProductPricing,
    addProduct,
    products,
    fraudAlerts,
    auditLogs,
    addAuditLog,
    showToast,
    switchRole,
    loginAsUser,
    setCurrentNav
  } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<SuperhostTab>('tenants');

  // Platform Controls State
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string>(
    'Scheduled RRA Fiscal EBM & Database Maintenance in progress. Expected completion in 30 minutes.'
  );
  const [nationalVatRate, setNationalVatRate] = useState<number>(18);
  const [nationalCrateDeposit, setNationalCrateDeposit] = useState<number>(4500);
  const [defaultCreditDays, setDefaultCreditDays] = useState<number>(14);

  // Tab 1: Tenants State
  const [tenantSearch, setTenantSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // New Tenant Form State
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantCode, setNewTenantCode] = useState('');
  const [newTenantCity, setNewTenantCity] = useState('Kigali');
  const [newTenantTin, setNewTenantTin] = useState('');
  const [newTenantLicense, setNewTenantLicense] = useState('');
  const [newTenantPhone, setNewTenantPhone] = useState('+250 788 ');
  const [newTenantEmail, setNewTenantEmail] = useState('');
  const [newTenantAddress, setNewTenantAddress] = useState('');
  const [newTenantPlan, setNewTenantPlan] = useState<'Enterprise' | 'Professional' | 'Starter'>('Enterprise');
  const [newTenantWhName, setNewTenantWhName] = useState('');
  const [newTenantCapacity, setNewTenantCapacity] = useState('20000');

  // Tab 2: Catalog State
  const [catalogSearch, setCatalogSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPurchasePrice, setEditPurchasePrice] = useState<number>(0);
  const [editSellingPrice, setEditSellingPrice] = useState<number>(0);
  const [editDepositValue, setEditDepositValue] = useState<number>(0);
  const [editRetailPrice, setEditRetailPrice] = useState<number>(0);
  const [isAddSkuModalOpen, setIsAddSkuModalOpen] = useState(false);
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
  const [bulkAdjustmentPercent, setBulkAdjustmentPercent] = useState<number>(5);
  const [bulkCategory, setBulkCategory] = useState<string>('Beer');

  // New SKU State
  const [newSkuCode, setNewSkuCode] = useState('');
  const [newSkuName, setNewSkuName] = useState('');
  const [newSkuBrand, setNewSkuBrand] = useState('BRALIRWA');
  const [newSkuCategory, setNewSkuCategory] = useState<'Beer' | 'Soft Drinks' | 'Water' | 'Malt & Energy' | 'Premium'>('Beer');
  const [newSkuPackaging, setNewSkuPackaging] = useState('RGB Crate (24x50cl)');
  const [newSkuUnits, setNewSkuUnits] = useState('24');
  const [newSkuVolume, setNewSkuVolume] = useState('500ml');
  const [newSkuPurchase, setNewSkuPurchase] = useState('18000');
  const [newSkuSelling, setNewSkuSelling] = useState('21000');
  const [newSkuDeposit, setNewSkuDeposit] = useState('4500');
  const [newSkuRetail, setNewSkuRetail] = useState('1100');

  // Tab 3: Users State
  const [userSearch, setUserSearch] = useState('');
  const [userDeptFilter, setUserDeptFilter] = useState<string>('all');
  const [userList, setUserList] = useState(ALL_USER_CREDENTIALS);
  const [resettingUser, setResettingUser] = useState<typeof ALL_USER_CREDENTIALS[0] | null>(null);
  const [newPinValue, setNewPinValue] = useState('1234');

  // Tab 4: Gateways Simulation State
  const [gatewayPinging, setGatewayPinging] = useState<string | null>(null);
  const [gatewayLatencies, setGatewayLatencies] = useState<{ [key: string]: number }>({
    rra: 12,
    momo: 24,
    bk: 19,
    sap: 42,
    db: 14
  });

  // Tab 5: Security & Blacklist State
  const [blacklist, setBlacklist] = useState<BlacklistEntity[]>([
    {
      id: 'bl-001',
      type: 'Retailer TIN',
      identifier: '109984321',
      name: 'Skyline VIP Lounge (Nyarugenge)',
      reason: 'Repeated bounce of unbacked MoMo cheques and unreturned crate deposits (142 crates)',
      dateAdded: '2026-09-14',
      addedBy: 'Platform Anti-Fraud Engine',
      status: 'active_ban'
    },
    {
      id: 'bl-002',
      type: 'Delivery Truck',
      identifier: 'RAD 942 C',
      name: 'Isuzu 5-Ton Route Truck',
      reason: 'GPS geo-fence violation detected: unauthorized route stop in unassigned sector outside curfew',
      dateAdded: '2026-09-22',
      addedBy: 'Keza Gakwaya (Superhost)',
      status: 'active_ban'
    },
    {
      id: 'bl-003',
      type: 'Retailer TIN',
      identifier: '100412890',
      name: 'Hilltop Terrace Bar (Kimironko)',
      reason: 'Forged EBM electronic fiscal receipt submission detected by RRA validation API',
      dateAdded: '2026-09-28',
      addedBy: 'RRA EBM Security Bridge',
      status: 'active_ban'
    }
  ]);
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [newBlType, setNewBlType] = useState<'Retailer TIN' | 'Delivery Truck' | 'Driver License'>('Retailer TIN');
  const [newBlIdentifier, setNewBlIdentifier] = useState('');
  const [newBlName, setNewBlName] = useState('');
  const [newBlReason, setNewBlReason] = useState('');

  // Tab 6: Backups State
  const [snapshots, setSnapshots] = useState<BackupSnapshot[]>([
    {
      id: 'snap-20261002-0200',
      name: 'National-Cluster-Snapshot-Daily-Auto',
      timestamp: '2026-10-02 02:00:15 CAT',
      sizeMb: 428.4,
      hash: 'sha256:7f9a2b8e4c1d6a9f0e3b5d8c1a7e4f9b',
      recordCount: 148920,
      type: 'Automated Daily'
    },
    {
      id: 'snap-20261001-0200',
      name: 'National-Cluster-Snapshot-Daily-Auto',
      timestamp: '2026-10-01 02:00:08 CAT',
      sizeMb: 422.1,
      hash: 'sha256:3a1b5c7d9e0f2a4b6c8d1e3f5a7b9c0d',
      recordCount: 147104,
      type: 'Automated Daily'
    },
    {
      id: 'snap-20260930-1845',
      name: 'Pre-Month-End-Reconciliation-Baseline',
      timestamp: '2026-09-30 18:45:33 CAT',
      sizeMb: 418.9,
      hash: 'sha256:9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
      recordCount: 145890,
      type: 'Manual Superhost'
    }
  ]);
  const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);

  // Filtered Tenants
  const filteredTenants = tenants.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.city.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.code.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.tinNumber.toLowerCase().includes(tenantSearch.toLowerCase());
    const matchPlan = planFilter === 'all' || t.subscriptionPlan === planFilter;
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Filtered Users
  const filteredUsers = userList.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.roleTitle.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch);
    const matchDept = userDeptFilter === 'all' || u.department === userDeptFilter;
    return matchSearch && matchDept;
  });

  // --- Handlers ---

  // Provision Tenant Submit
  const handleProvisionTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantCode || !newTenantTin) {
      showToast('Please provide Company Name, Code, and TIN');
      return;
    }

    const newTenant: Tenant = {
      id: `tenant-${newTenantCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: newTenantName,
      code: newTenantCode.toUpperCase(),
      licenseNumber: newTenantLicense || `BRAL-DIST-2026-${Math.floor(100 + Math.random() * 900)}`,
      tinNumber: newTenantTin,
      phone: newTenantPhone,
      email: newTenantEmail || `contact@${newTenantCode.toLowerCase()}.rw`,
      address: newTenantAddress || `${newTenantCity} Commercial Park`,
      city: newTenantCity,
      subscriptionPlan: newTenantPlan,
      status: 'active',
      createdAt: new Date().toISOString().substring(0, 10),
      branches: [
        {
          id: `branch-${newTenantCode.toLowerCase()}-hq`,
          name: `${newTenantName} Central Depot`,
          code: `${newTenantCode}-01`,
          province: newTenantCity.includes('Kigali') ? 'Kigali City' : 'Regional Province',
          district: newTenantCity,
          warehouses: [
            {
              id: `wh-${newTenantCode.toLowerCase()}-main`,
              branchId: `branch-${newTenantCode.toLowerCase()}-hq`,
              name: newTenantWhName || `${newTenantCity} Primary Logistics Hub`,
              code: `WH-${newTenantCode}-01`,
              capacityCrates: Number(newTenantCapacity) || 20000,
              managerName: 'Regional Logistics Director',
              phone: newTenantPhone,
              address: newTenantAddress || `${newTenantCity} Industrial Sector`
            }
          ]
        }
      ]
    };

    addTenant(newTenant);
    setIsProvisionModalOpen(false);
    // Reset Form
    setNewTenantName('');
    setNewTenantCode('');
    setNewTenantTin('');
    setNewTenantLicense('');
    setNewTenantAddress('');
  };

  // Open Edit Product Modal
  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditPurchasePrice(prod.bralirwaPurchasePrice);
    setEditSellingPrice(prod.distributorSellingPrice);
    setEditDepositValue(prod.crateDepositValue || 4500);
    setEditRetailPrice(prod.recommendedRetailPrice);
  };

  // Save Product Price
  const handleSaveProductPrice = () => {
    if (!editingProduct) return;
    updateProductPricing(editingProduct.id, {
      bralirwaPurchasePrice: editPurchasePrice,
      distributorSellingPrice: editSellingPrice,
      crateDepositValue: editDepositValue,
      recommendedRetailPrice: editRetailPrice
    });
    setEditingProduct(null);
  };

  // Bulk Price Update
  const handleApplyBulkPriceAdjustment = () => {
    const factor = 1 + bulkAdjustmentPercent / 100;
    const targetProducts = products.filter((p) => bulkCategory === 'all' || p.category === bulkCategory);
    targetProducts.forEach((p) => {
      const newPurchase = Math.round(p.bralirwaPurchasePrice * factor);
      const newSelling = Math.round(p.distributorSellingPrice * factor);
      updateProductPricing(p.id, {
        bralirwaPurchasePrice: newPurchase,
        distributorSellingPrice: newSelling
      });
    });
    showToast(`Bulk adjustment of ${bulkAdjustmentPercent > 0 ? '+' : ''}${bulkAdjustmentPercent}% applied to ${targetProducts.length} SKUs!`);
    setIsBulkPriceModalOpen(false);
  };

  // Add SKU Submit
  const handleAddSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkuName || !newSkuCode) {
      showToast('Please enter SKU Code and Product Name');
      return;
    }
    const newProd: Product = {
      id: `prod-${newSkuCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      sku: newSkuCode.toUpperCase(),
      barcode: `600${Math.floor(1000000 + Math.random() * 9000000)}`,
      name: newSkuName,
      brand: newSkuBrand,
      category: newSkuCategory,
      packaging: newSkuPackaging as any,
      unitsPerCrate: Number(newSkuUnits) || 24,
      bottleVolume: newSkuVolume,
      bralirwaPurchasePrice: Number(newSkuPurchase) || 18000,
      distributorSellingPrice: Number(newSkuSelling) || 21000,
      crateDepositValue: Number(newSkuDeposit) || 4500,
      bottleDepositValue: 100,
      taxRate: 18,
      isActive: true,
      recommendedRetailPrice: Number(newSkuRetail) || 1100
    };
    addProduct(newProd);
    setIsAddSkuModalOpen(false);
  };

  // Ping Gateway Simulation
  const handlePingGateway = (gw: string) => {
    setGatewayPinging(gw);
    setTimeout(() => {
      const randomLatency = Math.floor(8 + Math.random() * 20);
      setGatewayLatencies((prev) => ({ ...prev, [gw]: randomLatency }));
      setGatewayPinging(null);
      showToast(`Pinged ${gw.toUpperCase()} Gateway: Response in ${randomLatency}ms (Status: HTTP 200 OK)`);
    }, 600);
  };

  // Take Snapshot Backup
  const handleCreateSnapshot = () => {
    setIsTakingSnapshot(true);
    setTimeout(() => {
      const now = new Date();
      const newSnap: BackupSnapshot = {
        id: `snap-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`,
        name: `Superhost-Immediate-State-Snapshot`,
        timestamp: `${now.toISOString().substring(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} CAT`,
        sizeMb: Number((430 + Math.random() * 10).toFixed(1)),
        hash: `sha256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        recordCount: 149000 + Math.floor(Math.random() * 500),
        type: 'Manual Superhost'
      };
      setSnapshots((prev) => [newSnap, ...prev]);
      setIsTakingSnapshot(false);
      showToast('Immutable System Snapshot successfully generated and signed with SHA-256!');
      addAuditLog('CREATED_SNAPSHOT', 'SystemBackup', newSnap.id, 'None', newSnap.name);
    }, 1200);
  };

  // Blacklist Add
  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlIdentifier || !newBlName) {
      showToast('Please provide an identifier and name/entity');
      return;
    }
    const newEntry: BlacklistEntity = {
      id: `bl-${Date.now()}`,
      type: newBlType,
      identifier: newBlIdentifier,
      name: newBlName,
      reason: newBlReason || 'Violation of Bralirwa network terms',
      dateAdded: new Date().toISOString().substring(0, 10),
      addedBy: 'Keza Gakwaya (Superhost)',
      status: 'active_ban'
    };
    setBlacklist((prev) => [newEntry, ...prev]);
    setIsBlacklistModalOpen(false);
    showToast(`Entity ${newBlName} added to National Blacklist!`);
    addAuditLog('ADDED_TO_BLACKLIST', newBlType, newBlIdentifier, 'Permitted', `Banned: ${newBlReason}`);
    setNewBlIdentifier('');
    setNewBlName('');
    setNewBlReason('');
  };

  // Remove Blacklist
  const handleRemoveBlacklist = (id: string, name: string) => {
    setBlacklist((prev) => prev.filter((b) => b.id !== id));
    showToast(`Ban revoked for ${name}`);
    addAuditLog('REVOKED_BLACKLIST_BAN', 'Blacklist', id, 'Banned', 'Ban Revoked');
  };

  // Reset PIN
  const handleConfirmResetPin = () => {
    if (!resettingUser) return;
    showToast(`Security PIN for ${resettingUser.name} has been reset to: ${newPinValue}`);
    addAuditLog('RESET_USER_PIN', 'User', resettingUser.id, 'Encrypted', `Reset by Superhost`);
    setResettingUser(null);
  };

  // Impersonate / Login As User
  const handleImpersonateUser = (user: typeof ALL_USER_CREDENTIALS[0]) => {
    loginAsUser(user);
    showToast(`Impersonating ${user.name} (${user.roleTitle})`);
    if (user.targetNav) {
      setCurrentNav(user.targetNav as any);
    }
  };

  // Total Circulating Crates Calculation
  const totalDepots = tenants.reduce((acc, t) => acc + t.branches.reduce((bAcc, b) => bAcc + b.warehouses.length, 0), 0);
  const totalCrateCapacity = tenants.reduce(
    (acc, t) => acc + t.branches.reduce((bAcc, b) => bAcc + b.warehouses.reduce((wAcc, w) => wAcc + w.capacityCrates, 0), 0),
    0
  );

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1680px', margin: '0 auto', color: '#FFFFFF' }}>
      {/* ── TOP SUPERHOST COMMAND BAR ── */}
      <div
        className="glass-card"
        style={{
          padding: '16px 24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
            }}
          >
            <Shield size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(99, 102, 241, 0.25)',
                  color: '#A5B4FC',
                  border: '1px solid rgba(99, 102, 241, 0.4)'
                }}
              >
                GOD-MODE ACTIVATED
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#34D399', fontWeight: 600 }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 10px #10B981',
                    display: 'inline-block'
                  }}
                />
                National Network Controller Online
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 0 0', letterSpacing: '-0.02em' }}>
              BRALIRWA Cloud Master Command Center
            </h1>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Active Tenant Quick Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              padding: '6px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <Building2 size={16} color="#38BDF8" />
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Active Tenant:</span>
            <select
              value={currentTenant.id}
              onChange={(e) => {
                setTenantId(e.target.value);
                const t = tenants.find((item) => item.id === e.target.value);
                showToast(`Switched active tenant context to: ${t?.name}`);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#34D399',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id} style={{ backgroundColor: '#0F172A', color: '#FFFFFF' }}>
                  {t.name} ({t.code})
                </option>
              ))}
            </select>
          </div>

          {/* Maintenance Mode Toggle */}
          <button
            onClick={() => {
              const next = !maintenanceMode;
              setMaintenanceMode(next);
              showToast(next ? '⚠️ Platform Global Maintenance Mode ENABLED!' : '✅ Platform Maintenance Mode DISABLED. Live operations resumed.');
              addAuditLog('TOGGLE_MAINTENANCE_MODE', 'Platform', 'Global', maintenanceMode ? 'Enabled' : 'Disabled', next ? 'Enabled' : 'Disabled');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: maintenanceMode ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: maintenanceMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: maintenanceMode ? '#F87171' : '#CBD5E1',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Power size={15} color={maintenanceMode ? '#EF4444' : '#94A3B8'} />
            {maintenanceMode ? 'Maintenance Mode: ON' : 'Maintenance Mode: OFF'}
          </button>

          {/* 1-Click Snapshot Backup */}
          <button
            onClick={handleCreateSnapshot}
            disabled={isTakingSnapshot}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: isTakingSnapshot ? 'wait' : 'pointer',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <HardDrive size={15} />
            {isTakingSnapshot ? 'Capturing Snapshot...' : 'Create Snapshot'}
          </button>
        </div>
      </div>

      {/* Maintenance Mode Alert Banner if Active */}
      {maintenanceMode && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '12px',
            padding: '14px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={22} color="#F87171" />
            <div>
              <strong style={{ color: '#F87171', fontSize: '14px' }}>
                GLOBAL MAINTENANCE KILL-SWITCH IS CURRENTLY ACTIVE
              </strong>
              <div style={{ fontSize: '12.5px', color: '#FECACA', marginTop: '2px' }}>
                {maintenanceMessage}
              </div>
            </div>
          </div>
          <button
            onClick={() => setMaintenanceMode(false)}
            style={{
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Deactivate Kill-Switch
          </button>
        </div>
      )}

      {/* ── MASTER NETWORK KPI METRICS (5 CARDS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Authorized Distributors
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }} className="tabular-nums font-display">
            {tenants.length} Distributors
          </div>
          <div style={{ fontSize: '12px', color: '#38BDF8', marginTop: '6px', fontWeight: 600 }}>
            {totalDepots} Regional Depots ({totalCrateCapacity.toLocaleString()} Crates Capacity)
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Circulating Crate Deposit Float
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#34D399', marginTop: '6px' }} className="tabular-nums font-display">
            148,250 Crates
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            RWF 667,125,000 float secured in escrow
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            National Gross MTD Throughput
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#FBBF24', marginTop: '6px' }} className="tabular-nums font-display">
            RWF 482.9M
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} /> +12.4% network growth vs August
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            External Gateways Health
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38BDF8', marginTop: '6px' }} className="tabular-nums font-display">
            4 / 4 Gateways Online
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> RRA EBM • MTN MoMo • BK • SAP
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Cloud Database Latency
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#A855F7', marginTop: '6px' }} className="tabular-nums font-display">
            {gatewayLatencies.db}ms
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
            Tier-3 Telecom Kigali (99.99% SLA)
          </div>
        </div>
      </div>

      {/* ── 6-TAB NAVIGATION CONTROLLER ── */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          gap: '8px',
          padding: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'tenants' as SuperhostTab, label: 'Distributors & Tenants Hub', icon: Building2, count: tenants.length },
          { id: 'catalog' as SuperhostTab, label: 'National Master SKU Catalog & Pricing', icon: Boxes, count: products.length },
          { id: 'users' as SuperhostTab, label: 'Global User Directory & Access', icon: Users, count: ALL_USER_CREDENTIALS.length },
          { id: 'integrations' as SuperhostTab, label: 'Gateways & Infrastructure', icon: Server, badge: '4 Online' },
          { id: 'security' as SuperhostTab, label: 'National Security & Blacklist Wall', icon: ShieldAlert, count: blacklist.length },
          { id: 'platform' as SuperhostTab, label: 'Platform Controls & Disaster Recovery', icon: Sliders }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(79, 70, 229, 0.25) 100%)'
                  : 'transparent',
                color: isActive ? '#FFFFFF' : '#94A3B8',
                fontWeight: isActive ? 800 : 600,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: isActive ? '1px solid rgba(99, 102, 241, 0.6)' : 'none',
                boxShadow: isActive ? '0 4px 16px rgba(99, 102, 241, 0.25)' : 'none',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={17} color={isActive ? '#38BDF8' : '#94A3B8'} />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#38BDF8' : '#CBD5E1',
                    fontWeight: 700
                  }}
                >
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#34D399',
                    fontWeight: 700
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT ── */}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: DISTRIBUTORS & TENANTS HUB
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'tenants' && (
        <div>
          {/* Action Bar */}
          <div
            className="glass-card"
            style={{
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '320px', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'rgba(5, 14, 34, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '9px 14px',
                  flex: 1
                }}
              >
                <Search size={16} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Search distributor by company name, city, TIN, code, or license..."
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '13px',
                    color: '#FFFFFF'
                  }}
                />
              </div>

              {/* Plan Filter */}
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '13px',
                  backgroundColor: '#07152E',
                  color: '#FFFFFF',
                  fontWeight: 600
                }}
              >
                <option value="all">All Plans</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Professional">Professional</option>
                <option value="Starter">Starter</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '13px',
                  backgroundColor: '#07152E',
                  color: '#FFFFFF',
                  fontWeight: 600
                }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
            </div>

            <button
              onClick={() => setIsProvisionModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
              }}
            >
              <Plus size={16} />
              Provision New Distributor
            </button>
          </div>

          {/* Tenants Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {filteredTenants.map((t) => {
              const isCurrent = t.id === currentTenant.id;
              const isSuspended = t.status === 'suspended';
              const depotCount = t.branches.reduce((s, b) => s + b.warehouses.length, 0);
              const crateCap = t.branches.reduce((s, b) => s + b.warehouses.reduce((ws, w) => ws + w.capacityCrates, 0), 0);

              return (
                <div
                  key={t.id}
                  className="glass-card"
                  style={{
                    padding: '24px',
                    border: isCurrent
                      ? '2px solid rgba(16, 185, 129, 0.8)'
                      : isSuspended
                      ? '1px solid rgba(239, 68, 68, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: isCurrent
                      ? '0 12px 36px rgba(16, 185, 129, 0.25), 0 0 20px rgba(16, 185, 129, 0.15)'
                      : '0 8px 24px rgba(0, 0, 0, 0.35)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          backgroundColor: isCurrent ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                          border: `1px solid ${isCurrent ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Building2 size={26} color={isCurrent ? '#34D399' : '#CBD5E1'} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                            {t.name}
                          </h3>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#E2E8F0'
                            }}
                          >
                            {t.code}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '3px' }}>
                          {t.city} • Registered: {t.createdAt}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: t.subscriptionPlan === 'Enterprise' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(245, 158, 11, 0.18)',
                          color: t.subscriptionPlan === 'Enterprise' ? '#38BDF8' : '#FBBF24',
                          border: `1px solid ${t.subscriptionPlan === 'Enterprise' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                        }}
                      >
                        {t.subscriptionPlan}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: isSuspended ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: isSuspended ? '#F87171' : '#34D399',
                          border: `1px solid ${isSuspended ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                        }}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '12px',
                      backgroundColor: 'rgba(5, 14, 34, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      fontSize: '12.5px'
                    }}
                  >
                    <div>
                      <span style={{ color: '#94A3B8' }}>RRA TIN:</span> <strong style={{ color: '#FFFFFF' }}>{t.tinNumber}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>License #:</span> <strong style={{ color: '#FFFFFF' }}>{t.licenseNumber}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Phone:</span> <strong style={{ color: '#FFFFFF' }}>{t.phone}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Email:</span> <strong style={{ color: '#FFFFFF' }}>{t.email}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Depots:</span> <strong style={{ color: '#38BDF8' }}>{depotCount} Warehouses</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Storage Capacity:</span> <strong style={{ color: '#34D399' }}>{crateCap.toLocaleString()} Crates</strong>
                    </div>
                  </div>

                  {/* Quota Usage Bar */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>
                      <span>Monthly Quota Throughput:</span>
                      <strong style={{ color: '#FFFFFF' }}>28,420 / 40,000 Crates (71%)</strong>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '71%', height: '100%', backgroundColor: '#38BDF8', borderRadius: '3px' }} />
                    </div>
                  </div>

                  {/* Controls / Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {isCurrent ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#34D399' }}>
                          <CheckCircle2 size={16} /> Currently Active Context
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setTenantId(t.id);
                            showToast(`Switched active context to ${t.name}`);
                          }}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: '1px solid rgba(16, 185, 129, 0.5)',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#34D399',
                            fontWeight: 700,
                            fontSize: '12.5px',
                            cursor: 'pointer'
                          }}
                        >
                          Switch Context
                        </button>
                      )}

                      <button
                        onClick={() => toggleTenantStatus(t.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: isSuspended ? '1px solid #10B981' : '1px solid rgba(239, 68, 68, 0.4)',
                          backgroundColor: isSuspended ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isSuspended ? '#34D399' : '#F87171',
                          fontWeight: 700,
                          fontSize: '12.5px',
                          cursor: 'pointer'
                        }}
                      >
                        {isSuspended ? 'Reactivate' : 'Suspend'}
                      </button>
                    </div>

                    <button
                      onClick={() => setEditingTenant(t)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: '#CBD5E1',
                        fontWeight: 600,
                        fontSize: '12.5px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit Plan & Quotas
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: NATIONAL MASTER SKU CATALOG & PRICING
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'catalog' && (
        <div>
          {/* Controls Bar */}
          <div
            className="glass-card"
            style={{
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '320px', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'rgba(5, 14, 34, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '9px 14px',
                  flex: 1
                }}
              >
                <Search size={16} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Search SKU by brand, product name, or barcode..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '13px',
                    color: '#FFFFFF'
                  }}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '13px',
                  backgroundColor: '#07152E',
                  color: '#FFFFFF',
                  fontWeight: 600
                }}
              >
                <option value="all">All Categories</option>
                <option value="Beer">Beer</option>
                <option value="Soft Drinks">Soft Drinks</option>
                <option value="Malt & Energy">Malt & Energy</option>
                <option value="Premium">Premium</option>
                <option value="Water">Water</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  showToast('Broadcasting Master SKU Catalog to all authorized distributors via SAP Bridge...');
                  setTimeout(() => showToast('✅ 18 Products successfully synchronized across all 4 distributor databases!'), 1000);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38BDF8',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={15} />
                Force Sync to All Distributors
              </button>

              <button
                onClick={() => setIsBulkPriceModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#FBBF24',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <TrendingUp size={15} />
                Bulk Price Adjustment
              </button>

              <button
                onClick={() => setIsAddSkuModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
                }}
              >
                <Plus size={16} />
                Add National SKU
              </button>
            </div>
          </div>

          {/* Catalog Table */}
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(5, 14, 34, 0.85)', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 700 }}>SKU & Brand</th>
                  <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 700 }}>Packaging / Volume</th>
                  <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 700 }}>Brewery Purchase Price</th>
                  <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 700 }}>Wholesale Selling Price</th>
                  <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 700 }}>Distributor Margin</th>
                  <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 700 }}>Crate Deposit</th>
                  <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 700 }}>MSRP / Retail Bottle</th>
                  <th style={{ padding: '14px 18px', color: '#94A3B8', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const marginRwf = p.distributorSellingPrice - p.bralirwaPurchasePrice;
                  const marginPct = ((marginRwf / p.bralirwaPurchasePrice) * 100).toFixed(1);

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '14px' }}>{p.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                          SKU: <strong style={{ color: '#E2E8F0' }}>{p.sku}</strong> • Brand: {p.brand}
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            color: '#CBD5E1'
                          }}
                        >
                          {p.packaging}
                        </span>
                        <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '4px' }}>
                          {p.unitsPerCrate} units • {p.bottleVolume}
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#FFFFFF' }} className="tabular-nums">
                        RWF {p.bralirwaPurchasePrice.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#38BDF8' }} className="tabular-nums">
                        RWF {p.distributorSellingPrice.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 800, color: '#34D399' }} className="tabular-nums">
                          +RWF {marginRwf.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>{marginPct}% markup</div>
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#FBBF24' }} className="tabular-nums">
                        RWF {(p.crateDepositValue || 4500).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#E2E8F0' }} className="tabular-nums">
                        RWF {p.recommendedRetailPrice.toLocaleString()} / btl
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => openEditProduct(p)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            backgroundColor: 'rgba(56, 189, 248, 0.12)',
                            color: '#38BDF8',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit Pricing
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: GLOBAL USER DIRECTORY & ROLE GOVERNANCE
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'users' && (
        <div>
          {/* Controls Bar */}
          <div
            className="glass-card"
            style={{
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '320px', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'rgba(5, 14, 34, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '9px 14px',
                  flex: 1
                }}
              >
                <Search size={16} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Search user by name, corporate title, email, or role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '13px',
                    color: '#FFFFFF'
                  }}
                />
              </div>

              <select
                value={userDeptFilter}
                onChange={(e) => setUserDeptFilter(e.target.value)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '13px',
                  backgroundColor: '#07152E',
                  color: '#FFFFFF',
                  fontWeight: 600
                }}
              >
                <option value="all">All Departments</option>
                <option value="Executive">Executive</option>
                <option value="Commercial">Commercial</option>
                <option value="Logistics">Logistics</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Audit">Audit</option>
                <option value="Platform">Platform</option>
              </select>
            </div>

            <div style={{ fontSize: '13px', color: '#94A3B8' }}>
              Total Network Personas: <strong style={{ color: '#FFFFFF' }}>{userList.length} Authenticated Roles</strong>
            </div>
          </div>

          {/* Users Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
            {filteredUsers.map((u) => {
              return (
                <div
                  key={u.id}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <img
                        src={u.avatar}
                        alt={u.name}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: `2px solid ${u.color || '#6366F1'}`
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                          {u.name}
                        </h4>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                          {u.roleTitle}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: `${u.color}22`,
                          color: u.color,
                          border: `1px solid ${u.color}55`
                        }}
                      >
                        {u.department}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          color: '#CBD5E1'
                        }}
                      >
                        PIN: ••••
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.4' }}>
                      <strong>Email:</strong> {u.email}
                      <br />
                      <strong>Phone:</strong> {u.phone}
                    </div>

                    <div
                      style={{
                        marginTop: '10px',
                        padding: '8px 10px',
                        backgroundColor: 'rgba(5, 14, 34, 0.5)',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        color: '#CBD5E1',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <strong style={{ color: '#38BDF8' }}>Security Scope:</strong> {u.securityScope}
                    </div>
                  </div>

                  {/* Superhost Actions */}
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                    <button
                      onClick={() => handleImpersonateUser(u)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(99, 102, 241, 0.4)',
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        color: '#A5B4FC',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <UserCheck size={14} />
                      Log In As User
                    </button>

                    <button
                      onClick={() => {
                        setResettingUser(u);
                        setNewPinValue('1234');
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#E2E8F0',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Reset PIN
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 4: EXTERNAL GATEWAYS & INFRASTRUCTURE
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'integrations' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {/* RRA EBM v2 Gateway */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FileText size={22} color="#34D399" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      RRA EBM v2 Fiscalization Engine
                    </h3>
                    <div style={{ fontSize: '12.5px', color: '#94A3B8' }}>Rwanda Revenue Authority Electronic Billing Machine</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}>
                  ONLINE (100%)
                </span>
              </div>

              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.55)', padding: '14px', borderRadius: '10px', fontSize: '12.5px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>Gateway Endpoint:</span>
                  <code style={{ color: '#38BDF8' }}>https://ebm2.rra.gov.rw/api/v2/fiscal</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>Ping Response Latency:</span>
                  <strong style={{ color: '#34D399' }}>{gatewayLatencies.rra}ms</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>EBM JWT Security Token:</span>
                  <span style={{ color: '#FFFFFF' }}>Valid (Expires in 28 days)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Offline Invoice Queue:</span>
                  <strong style={{ color: '#34D399' }}>0 Pending (Real-time sync)</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handlePingGateway('rra')}
                  disabled={gatewayPinging === 'rra'}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38BDF8',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  {gatewayPinging === 'rra' ? 'Pinging...' : 'Ping EBM Gateway'}
                </button>
                <button
                  onClick={() => showToast('Forced RRA EBM Security Token refresh. New bearer token issued.')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#E2E8F0',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  Refresh Token
                </button>
              </div>
            </div>

            {/* MTN MoMo B2B Corporate Gateway */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Smartphone size={22} color="#FBBF24" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      MTN Mobile Money B2B Gateway
                    </h3>
                    <div style={{ fontSize: '12.5px', color: '#94A3B8' }}>Corporate Merchant Settlement & Open API</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}>
                  CONNECTED
                </span>
              </div>

              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.55)', padding: '14px', borderRadius: '10px', fontSize: '12.5px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>B2B Settlement Account Float:</span>
                  <strong style={{ color: '#FBBF24' }}>RWF 142,850,000</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>Ping Response Latency:</span>
                  <strong style={{ color: '#34D399' }}>{gatewayLatencies.momo}ms</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>Auto-Sweep Threshold:</span>
                  <span style={{ color: '#FFFFFF' }}>RWF 50,000,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Webhook Push Reliability:</span>
                  <strong style={{ color: '#34D399' }}>99.98% successful callbacks</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handlePingGateway('momo')}
                  disabled={gatewayPinging === 'momo'}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38BDF8',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  {gatewayPinging === 'momo' ? 'Pinging...' : 'Test Webhook'}
                </button>
                <button
                  onClick={() => showToast('Simulated instant B2B settlement sweep: RWF 10,000,000 transferred to BK Treasury.')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#E2E8F0',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  Trigger Float Sweep
                </button>
              </div>
            </div>

            {/* Bank of Kigali (BK) Host-to-Host */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <DollarSign size={22} color="#38BDF8" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      Bank of Kigali (BK) Host-to-Host
                    </h3>
                    <div style={{ fontSize: '12.5px', color: '#94A3B8' }}>B2B Escrow Liquidity & Automatic Clearing House</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}>
                  STANDBY
                </span>
              </div>

              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.55)', padding: '14px', borderRadius: '10px', fontSize: '12.5px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>BK B2B Protocol:</span>
                  <span style={{ color: '#FFFFFF' }}>ISO 20022 XML / MT940</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>Ping Response Latency:</span>
                  <strong style={{ color: '#34D399' }}>{gatewayLatencies.bk}ms</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>BRALIRWA Supplier Escrow:</span>
                  <strong style={{ color: '#34D399' }}>RWF 184,500,000 Verified</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Automated Reconciliation:</span>
                  <span style={{ color: '#CBD5E1' }}>Daily at 04:00 CAT & 16:00 CAT</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handlePingGateway('bk')}
                  disabled={gatewayPinging === 'bk'}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38BDF8',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  {gatewayPinging === 'bk' ? 'Pinging...' : 'Verify Host-to-Host'}
                </button>
                <button
                  onClick={() => showToast('BK MT940 electronic bank statement pulled and reconciled.')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#E2E8F0',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  Reconcile Now
                </button>
              </div>
            </div>

            {/* BRALIRWA SAP S/4HANA ERP Bridge */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Activity size={22} color="#A5B4FC" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      BRALIRWA SAP S/4HANA ERP Bridge
                    </h3>
                    <div style={{ fontSize: '12.5px', color: '#94A3B8' }}>Gisenyi Brewery & Kigali Logistics Integration</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}>
                  SYNCED
                </span>
              </div>

              <div style={{ backgroundColor: 'rgba(5, 14, 34, 0.55)', padding: '14px', borderRadius: '10px', fontSize: '12.5px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>SAP Protocol:</span>
                  <span style={{ color: '#FFFFFF' }}>IDoc / OData v4 / RFC</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>Ping Response Latency:</span>
                  <strong style={{ color: '#34D399' }}>{gatewayLatencies.sap}ms</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>Electronic Delivery Notes:</span>
                  <strong style={{ color: '#34D399' }}>12 e-DN Ingested Today</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Brewery Batch Traceability:</span>
                  <span style={{ color: '#38BDF8' }}>Enabled (Lot & Expiry tracking)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handlePingGateway('sap')}
                  disabled={gatewayPinging === 'sap'}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38BDF8',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  {gatewayPinging === 'sap' ? 'Pinging...' : 'Test Brewery Link'}
                </button>
                <button
                  onClick={() => showToast('Pulled 4 new production batch certificates from Gisenyi Brewery.')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#E2E8F0',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  Fetch Batches
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 5: NATIONAL SECURITY, ANTI-FRAUD & BLACKLIST
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'security' && (
        <div>
          {/* Anomaly Overview Header */}
          <div
            className="glass-card"
            style={{
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                National Anti-Fraud Telemetry & Blacklist Registry
              </h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                Cross-tenant fraud monitoring, suspicious credit requests, unauthorized empty returns, and blacklist enforcement
              </p>
            </div>
            <button
              onClick={() => setIsBlacklistModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                color: '#F87171',
                padding: '9px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Ban size={15} />
              Add Entity to Blacklist
            </button>
          </div>

          {/* Active Blacklist Table */}
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(5, 14, 34, 0.6)' }}>
              <strong style={{ fontSize: '14px', color: '#FFFFFF' }}>Enforced National Blacklist ({blacklist.length} Entities)</strong>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(5, 14, 34, 0.85)', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <th style={{ padding: '12px 18px', color: '#94A3B8', fontWeight: 700 }}>Entity Type</th>
                  <th style={{ padding: '12px 18px', color: '#94A3B8', fontWeight: 700 }}>Identifier & Name</th>
                  <th style={{ padding: '12px 18px', color: '#94A3B8', fontWeight: 700 }}>Infraction / Reason</th>
                  <th style={{ padding: '12px 18px', color: '#94A3B8', fontWeight: 700 }}>Date Blacklisted</th>
                  <th style={{ padding: '12px 18px', color: '#94A3B8', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blacklist.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.18)',
                          color: '#F87171',
                          border: '1px solid rgba(239, 68, 68, 0.4)'
                        }}
                      >
                        {b.type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{b.name}</div>
                      <code style={{ fontSize: '11.5px', color: '#38BDF8' }}>{b.identifier}</code>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#CBD5E1', maxWidth: '380px' }}>
                      {b.reason}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94A3B8' }}>
                      {b.dateAdded}
                      <div style={{ fontSize: '11px', color: '#64748B' }}>By {b.addedBy}</div>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleRemoveBlacklist(b.id, b.name)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          backgroundColor: 'rgba(16, 185, 129, 0.12)',
                          color: '#34D399',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Revoke Ban
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cryptographic Audit Trail Stream */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Immutable Cryptographic Audit Trail (Real-Time Feed)
                </h4>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                  SHA-256 verifiable chain of administrative and operational events
                </div>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `bralirwa-audit-export-${Date.now()}.json`;
                  a.click();
                  showToast('Exported Forensic Cryptographic Audit Bundle (JSON)');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#CBD5E1',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                Export Audit Bundle
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {auditLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  style={{
                    backgroundColor: 'rgba(5, 14, 34, 0.55)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12.5px'
                  }}
                >
                  <div>
                    <strong style={{ color: '#38BDF8' }}>{log.action}</strong> •{' '}
                    <span style={{ color: '#E2E8F0' }}>{log.targetEntity}</span>{' '}
                    <span style={{ color: '#94A3B8' }}>({log.targetId})</span>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                      By: <strong style={{ color: '#CBD5E1' }}>{log.userName}</strong> ({log.userRole}) • IP: {log.ipAddress}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <code style={{ fontSize: '11px', color: '#A5B4FC', display: 'block' }}>
                      sha256:{log.id.slice(-8)}...
                    </code>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 6: PLATFORM CONTROLS & DISASTER RECOVERY
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'platform' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {/* System Parameters Card */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <Sliders size={22} color="#38BDF8" />
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    National Fiscal & Commercial Defaults
                  </h3>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>Global platform parameters across Rwanda</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
                <div>
                  <label style={{ display: 'block', color: '#94A3B8', marginBottom: '6px', fontWeight: 600 }}>
                    National RRA VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    value={nationalVatRate}
                    onChange={(e) => setNationalVatRate(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.65)',
                      color: '#FFFFFF',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#94A3B8', marginBottom: '6px', fontWeight: 600 }}>
                    Standard Crate & Bottle Deposit Value (RWF)
                  </label>
                  <input
                    type="number"
                    value={nationalCrateDeposit}
                    onChange={(e) => setNationalCrateDeposit(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.65)',
                      color: '#FFFFFF',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#94A3B8', marginBottom: '6px', fontWeight: 600 }}>
                    Default Credit Terms Limit (Days)
                  </label>
                  <input
                    type="number"
                    value={defaultCreditDays}
                    onChange={(e) => setDefaultCreditDays(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.65)',
                      color: '#FFFFFF',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <button
                  onClick={() => {
                    showToast('National platform parameters saved & applied network-wide!');
                    addAuditLog('UPDATED_SYSTEM_PARAMS', 'PlatformConfig', 'Global', 'Default', `VAT: ${nationalVatRate}%, Deposit: ${nationalCrateDeposit} RWF`);
                  }}
                  style={{
                    backgroundColor: '#6366F1',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Save Global Parameters
                </button>
              </div>
            </div>

            {/* Disaster Recovery & Snapshots */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Database size={22} color="#34D399" />
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      Disaster Recovery & Point-in-Time Snapshots
                    </h3>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Automated daily backups with instant restore verification</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {snapshots.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      backgroundColor: 'rgba(5, 14, 34, 0.55)',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12.5px'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#FFFFFF' }}>{s.name}</strong>
                      <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                        {s.timestamp} • {s.sizeMb} MB • {s.recordCount.toLocaleString()} rows
                      </div>
                      <code style={{ fontSize: '11px', color: '#38BDF8' }}>{s.hash.slice(0, 24)}...</code>
                    </div>
                    <button
                      onClick={() => showToast(`Verified cryptographic integrity for snapshot ${s.id}: 100% Valid.`)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#E2E8F0',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Verify Hash
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleCreateSnapshot}
                  disabled={isTakingSnapshot}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                    color: '#34D399',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: isTakingSnapshot ? 'wait' : 'pointer'
                  }}
                >
                  {isTakingSnapshot ? 'Generating...' : 'Take Immediate Snapshot'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODALS
      ═══════════════════════════════════════════════════════════════ */}

      {/* 1. Provision New Distributor Modal */}
      {isProvisionModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  Provision New Authorized Distributor
                </h3>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                  Register a new multi-tenant distributor entity within Rwanda
                </div>
              </div>
              <button
                onClick={() => setIsProvisionModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProvisionTenant}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    Distributor Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Musanze Highlands Beverage Supply Ltd"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    Tenant Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MHB-RW"
                    value={newTenantCode}
                    onChange={(e) => setNewTenantCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    Primary City / District
                  </label>
                  <select
                    value={newTenantCity}
                    onChange={(e) => setNewTenantCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: '#07152E',
                      color: '#FFFFFF'
                    }}
                  >
                    <option value="Kigali">Kigali</option>
                    <option value="Musanze">Musanze</option>
                    <option value="Rubavu">Rubavu</option>
                    <option value="Huye">Huye</option>
                    <option value="Rwamagana">Rwamagana</option>
                    <option value="Rusizi">Rusizi</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    RRA TIN *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="9-digit TIN (e.g. 109842109)"
                    value={newTenantTin}
                    onChange={(e) => setNewTenantTin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    BRALIRWA License #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BRAL-DIST-2026-088"
                    value={newTenantLicense}
                    onChange={(e) => setNewTenantLicense(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    Subscription Plan
                  </label>
                  <select
                    value={newTenantPlan}
                    onChange={(e) => setNewTenantPlan(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: '#07152E',
                      color: '#FFFFFF'
                    }}
                  >
                    <option value="Enterprise">Enterprise (Multi-depot & full API)</option>
                    <option value="Professional">Professional (Up to 2 depots)</option>
                    <option value="Starter">Starter (Single depot)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={newTenantPhone}
                    onChange={(e) => setNewTenantPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    Initial Primary Depot Name & Storage Capacity
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="e.g. Musanze Central Warehouse"
                      value={newTenantWhName}
                      onChange={(e) => setNewTenantWhName(e.target.value)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: 'rgba(5, 14, 34, 0.7)',
                        color: '#FFFFFF'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Crate Capacity"
                      value={newTenantCapacity}
                      onChange={(e) => setNewTenantCapacity(e.target.value)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: 'rgba(5, 14, 34, 0.7)',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#E2E8F0',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    backgroundColor: '#10B981',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  Provision Distributor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit SKU Pricing Modal */}
      {editingProduct && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  Update Master SKU Pricing
                </h3>
                <div style={{ fontSize: '12.5px', color: '#38BDF8', marginTop: '2px' }}>
                  {editingProduct.name} ({editingProduct.sku})
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                  Brewery Ex-Factory Purchase Price (RWF)
                </label>
                <input
                  type="number"
                  value={editPurchasePrice}
                  onChange={(e) => setEditPurchasePrice(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(5, 14, 34, 0.7)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 700
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                  Distributor Wholesale Selling Price (RWF)
                </label>
                <input
                  type="number"
                  value={editSellingPrice}
                  onChange={(e) => setEditSellingPrice(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(5, 14, 34, 0.7)',
                    color: '#38BDF8',
                    fontSize: '14px',
                    fontWeight: 700
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    Crate Deposit Value (RWF)
                  </label>
                  <input
                    type="number"
                    value={editDepositValue}
                    onChange={(e) => setEditDepositValue(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FBBF24',
                      fontSize: '14px',
                      fontWeight: 700
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    MSRP / Bottle (RWF)
                  </label>
                  <input
                    type="number"
                    value={editRetailPrice}
                    onChange={(e) => setEditRetailPrice(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 700
                    }}
                  />
                </div>
              </div>

              {/* Real-time Preview */}
              <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399', fontWeight: 700 }}>
                  <span>Calculated Distributor Margin:</span>
                  <span>+RWF {(editSellingPrice - editPurchasePrice).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setEditingProduct(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#E2E8F0',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProductPrice}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#38BDF8',
                  border: 'none',
                  color: '#07152E',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Save & Broadcast Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Bulk Pricing Adjustment Modal */}
      {isBulkPriceModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '460px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0', color: '#FFFFFF' }}>
              National Bulk Price Adjustment
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: 0 }}>
              Apply a blanket percentage adjustment across an entire beverage category
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                  Target Category
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: '#07152E',
                    color: '#FFFFFF'
                  }}
                >
                  <option value="Beer">Beer (Primus, Mützig, Heineken, Amstel...)</option>
                  <option value="Soft Drinks">Soft Drinks (Coca-Cola, Fanta, Sprite...)</option>
                  <option value="Malt & Energy">Malt & Energy</option>
                  <option value="all">All Beverages Nationally</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                  Adjustment Percentage (%)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[-5, -2, 2, 3.5, 5, 8].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setBulkAdjustmentPercent(pct)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: bulkAdjustmentPercent === pct ? '1px solid #FBBF24' : '1px solid rgba(255, 255, 255, 0.12)',
                        backgroundColor: bulkAdjustmentPercent === pct ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: bulkAdjustmentPercent === pct ? '#FBBF24' : '#CBD5E1',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {pct > 0 ? `+${pct}%` : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setIsBulkPriceModalOpen(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#E2E8F0',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApplyBulkPriceAdjustment}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#F59E0B',
                  border: 'none',
                  color: '#07152E',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Reset User PIN Modal */}
      {resettingUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
              Reset User Security PIN
            </h3>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px' }}>
              Reset access PIN for <strong style={{ color: '#FFFFFF' }}>{resettingUser.name}</strong> ({resettingUser.roleTitle})
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                New 4-Digit POS / Portal PIN
              </label>
              <input
                type="text"
                maxLength={4}
                value={newPinValue}
                onChange={(e) => setNewPinValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(5, 14, 34, 0.7)',
                  color: '#34D399',
                  fontSize: '18px',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  textAlign: 'center'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setResettingUser(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#E2E8F0',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResetPin}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#10B981',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Confirm PIN Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add Blacklist Modal */}
      {isBlacklistModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#F87171' }}>
              Add Entity to National Blacklist
            </h3>
            <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px' }}>
              Banned entities will be automatically rejected across all distributor orders and deliveries
            </div>

            <form onSubmit={handleAddBlacklist}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    Entity Classification
                  </label>
                  <select
                    value={newBlType}
                    onChange={(e) => setNewBlType(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: '#07152E',
                      color: '#FFFFFF'
                    }}
                  >
                    <option value="Retailer TIN">Retailer TIN (Bar, Hotel, Supermarket)</option>
                    <option value="Delivery Truck">Delivery Truck License Plate</option>
                    <option value="Driver License">Driver License ID</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    Identifier (TIN / Plate / ID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 109842109 or RAD 450 B"
                    value={newBlIdentifier}
                    onChange={(e) => setNewBlIdentifier(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    Entity Name / Trade Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nyabugogo Oasis Lounge"
                    value={newBlName}
                    onChange={(e) => setNewBlName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                    Reason for Ban *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Detail specific fraudulent activity, unreturned crates, or forged receipts..."
                    value={newBlReason}
                    onChange={(e) => setNewBlReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF',
                      fontSize: '12.5px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsBlacklistModalOpen(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#EF4444',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Confirm & Ban Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add Master SKU Modal */}
      {isAddSkuModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '580px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
              Add New National Master SKU
            </h3>
            <div style={{ fontSize: '12.5px', color: '#94A3B8', marginBottom: '16px' }}>
              Register a new product in the national BRALIRWA beverage catalog
            </div>

            <form onSubmit={handleAddSku}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BRAL-HEIN-330"
                    value={newSkuCode}
                    onChange={(e) => setNewSkuCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heineken Silver 33CL"
                    value={newSkuName}
                    onChange={(e) => setNewSkuName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Brand
                  </label>
                  <input
                    type="text"
                    value={newSkuBrand}
                    onChange={(e) => setNewSkuBrand(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={newSkuCategory}
                    onChange={(e) => setNewSkuCategory(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: '#07152E',
                      color: '#FFFFFF'
                    }}
                  >
                    <option value="Beer">Beer</option>
                    <option value="Soft Drinks">Soft Drinks</option>
                    <option value="Malt & Energy">Malt & Energy</option>
                    <option value="Premium">Premium</option>
                    <option value="Water">Water</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Brewery Purchase Price (RWF)
                  </label>
                  <input
                    type="number"
                    value={newSkuPurchase}
                    onChange={(e) => setNewSkuPurchase(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Wholesale Selling Price (RWF)
                  </label>
                  <input
                    type="number"
                    value={newSkuSelling}
                    onChange={(e) => setNewSkuSelling(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      color: '#38BDF8'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddSkuModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#10B981',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Add to Master Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Edit Tenant Plan & Quota Modal */}
      {editingTenant && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
              Configure Tenant Plan & Quota Limits
            </h3>
            <div style={{ fontSize: '13px', color: '#38BDF8', marginBottom: '16px' }}>
              {editingTenant.name} ({editingTenant.code})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                  Subscription Tier
                </label>
                <select
                  value={editingTenant.subscriptionPlan}
                  onChange={(e) => {
                    const plan = e.target.value as any;
                    updateTenant(editingTenant.id, { subscriptionPlan: plan });
                    setEditingTenant({ ...editingTenant, subscriptionPlan: plan });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: '#07152E',
                    color: '#FFFFFF'
                  }}
                >
                  <option value="Enterprise">Enterprise (Unlimited Depots, Full Gateways)</option>
                  <option value="Professional">Professional (Up to 2 Depots, Standard API)</option>
                  <option value="Starter">Starter (Single Depot, Basic Portal)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                  Monthly Crate Allocation Quota
                </label>
                <input
                  type="number"
                  defaultValue={40000}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(5, 14, 34, 0.7)',
                    color: '#FFFFFF'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}>
                  Authorized Concurrent User Seats
                </label>
                <input
                  type="number"
                  defaultValue={25}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(5, 14, 34, 0.7)',
                    color: '#FFFFFF'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setEditingTenant(null)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#38BDF8',
                  border: 'none',
                  color: '#07152E',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Close & Save Quotas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
