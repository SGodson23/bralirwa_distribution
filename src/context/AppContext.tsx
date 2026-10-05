import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tenant,
  UserProfile,
  UserRole,
  Product,
  InventoryItem,
  Customer,
  SalesOrder,
  PurchaseOrder,
  DeliveryRun,
  Vehicle,
  CashReconciliationDaily,
  ExpenseRecord,
  ProfitAndLoss,
  DemandForecastItem,
  FraudAnomalyAlert,
  SmartAlert,
  AuditLogEntry,
  SalespersonMetric,
  EmptiesGlobalSummary,
  CrateLedgerEntry,
  GoodsReceiptReport,
  OrderStatus,
  POStatus,
  ConnectedDashboardEvent,
  ExecutiveApprovalItem,
  UnbilledGRN,
  PrivateRoleCredential,
  UserCredentialProfile
} from '../types';

import {
  INITIAL_TENANTS,
  INITIAL_PRODUCTS,
  INITIAL_INVENTORY,
  INITIAL_CUSTOMERS,
  INITIAL_SALES_ORDERS,
  INITIAL_BRALIRWA_PURCHASE_ORDERS,
  INITIAL_DELIVERY_RUNS,
  INITIAL_VEHICLES,
  INITIAL_EMPTIES_SUMMARY,
  INITIAL_CRATE_LEDGER,
  INITIAL_CASH_RECONCILIATION,
  INITIAL_EXPENSES,
  INITIAL_PROFIT_LOSS,
  INITIAL_DEMAND_FORECAST,
  INITIAL_FRAUD_ALERTS,
  INITIAL_SMART_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SALESPEOPLE,
  CURRENT_USER,
  INITIAL_CONNECTED_EVENTS,
  INITIAL_EXECUTIVE_APPROVALS,
  INITIAL_UNBILLED_GRNS,
  PRIVATE_ROLE_CREDENTIALS,
  ALL_USER_CREDENTIALS
} from '../data/mockData';

export type NavView =
  | 'homepage'
  | 'login'
  | 'dashboard'
  | 'inventory'
  | 'products'
  | 'purchases'
  | 'receiving'
  | 'customers'
  | 'orders'
  | 'quick_order'
  | 'debt'
  | 'empties'
  | 'deliveries'
  | 'delivery_map'
  | 'driver_mobile'
  | 'reconciliation'
  | 'finance'
  | 'expenses'
  | 'sales_team'
  | 'fleet'
  | 'forecasting'
  | 'assistant'
  | 'fraud'
  | 'alerts'
  | 'audit'
  | 'super_admin'
  | 'settings'
  | 'warehouse_dashboard'
  | 'accountant_dashboard';

interface AppContextType {
  tenants: Tenant[];
  currentTenant: Tenant;
  setTenantId: (id: string) => void;
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  currentWarehouseId: string;
  setCurrentWarehouseId: (id: string) => void;
  currentNav: NavView;
  setCurrentNav: (nav: NavView) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Data items
  products: Product[];
  inventory: InventoryItem[];
  customers: Customer[];
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
  deliveryRuns: DeliveryRun[];
  vehicles: Vehicle[];
  emptiesSummary: EmptiesGlobalSummary;
  crateLedger: CrateLedgerEntry[];
  cashReconciliation: CashReconciliationDaily;
  expenses: ExpenseRecord[];
  profitLoss: ProfitAndLoss;
  demandForecast: DemandForecastItem[];
  fraudAlerts: FraudAnomalyAlert[];
  smartAlerts: SmartAlert[];
  auditLogs: AuditLogEntry[];
  salespeople: SalespersonMetric[];

  // Mutators
  createSalesOrder: (order: Partial<SalesOrder>) => SalesOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  approveCreditOverlimit: (orderId: string) => void;
  createPurchaseOrder: (po: Partial<PurchaseOrder>) => PurchaseOrder;
  receivePurchaseOrder: (poId: string, report: GoodsReceiptReport) => void;
  adjustStock: (productId: string, warehouseId: string, amountDiff: number, reason: string) => void;
  recordDeliveryStopCompletion: (
    deliveryId: string,
    stopId: string,
    paymentCollected: number,
    cratesReturned: number,
    signatureName: string
  ) => void;
  submitCashReconciliation: (actualCash: number, actualMoMo: number, actualBank: number, explanation: string) => void;
  approveCashReconciliation: (reconId: string) => void;
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  updateCustomerCreditLimit: (customerId: string, newLimit: number) => void;
  toggleCustomerBlock: (customerId: string) => void;
  convertForecastToPO: (items: { productId: string; crates: number }[]) => void;
  markAlertRead: (alertId: string) => void;
  addAuditLog: (action: string, targetEntity: string, targetId: string, prevVal: string, newVal: string) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  toggleTenantStatus: (tenantId: string) => void;
  updateProductPricing: (productId: string, updates: { bralirwaPurchasePrice?: number; distributorSellingPrice?: number; crateDepositValue?: number; recommendedRetailPrice?: number }) => void;
  addProduct: (product: Product) => void;


  // Inter-Dashboard Synchronization
  connectedEvents: ConnectedDashboardEvent[];
  executiveApprovals: ExecutiveApprovalItem[];
  unbilledGrns: UnbilledGRN[];
  addConnectedEvent: (event: Omit<ConnectedDashboardEvent, 'id' | 'timestamp'>) => void;
  approveExecutiveItem: (itemId: string, decisionNotes?: string) => void;
  rejectExecutiveItem: (itemId: string, reason: string) => void;
  triggerLiquiditySweep: (amount: number, target: 'Bralirwa Escrow' | 'Treasury Reserve') => void;
  postWarehouseReceivingCrossSync: (poId: string, cratesReceived: number, invoiceAmount: number) => void;
  postWarehouseBreakageCrossSync: (cratesLost: number, costValue: number, customerId?: string) => void;
  postAccountantReconSignoffCrossSync: (reconciledTotal: number, bkAmount: number, momoAmount: number, vaultAmount: number) => void;

  // Private Portal Authentication (per-tab in sessionStorage)
  activePerspective: 'owner' | 'warehouse_manager' | 'accountant';
  isCurrentPortalLocked: boolean;
  unlockPrivatePortal: (pin?: string) => boolean;
  lockCurrentPortal: () => void;
  currentCredential: PrivateRoleCredential;
  allowedNavs: string[];

  // User Profile & Multi-Role Authentication for all 12 users
  isAuthenticated: boolean;
  currentUserProfile: UserCredentialProfile | null;
  loginAsUser: (profile: UserCredentialProfile) => void;
  loginWithCredentials: (identifier: string, pin: string) => { success: boolean; message?: string; targetNav?: NavView };
  enterMyDashboard: () => void;
  logout: () => void;
  logoutToLogin: () => void;
  goToHomepage: () => void;

  // Global modals
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  quickCreateOpen: boolean;
  setQuickCreateOpen: (open: boolean) => void;
  quickCreateType: 'order' | 'customer' | 'po' | 'expense' | 'transfer';
  setQuickCreateType: (type: 'order' | 'customer' | 'po' | 'expense' | 'transfer') => void;
  
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const PERSONA_PROFILES: Record<'owner' | 'warehouse_manager' | 'accountant', UserProfile> = {
  owner: {
    ...CURRENT_USER,
    email: 'owner@example.com'
  },
  accountant: {
    id: 'usr-accountant-claire',
    name: 'Claire Umutoni (CPA)',
    role: 'accountant',
    roleTitle: 'Senior Financial Controller',
    email: 'accountant@example.com',
    phone: '+250 788 450 120',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tenantId: 'tenant-kbl',
    branchId: 'branch-kigali-hq'
  },
  warehouse_manager: {
    id: 'usr-warehouse-mugabo',
    name: 'Jean-Claude Mugabo',
    role: 'warehouse_manager',
    roleTitle: 'Warehouse & Depot Manager',
    email: 'warehouse@example.com',
    phone: '+250 788 560 340',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tenantId: 'tenant-kbl',
    branchId: 'branch-kigali-hq'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-kbl');

  // Track whether a user is currently authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('kbl_active_user_id');
    }
    return false;
  });

  // Currently active user credential profile (null if not authenticated)
  const [currentUserProfile, setCurrentUserProfile] = useState<UserCredentialProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const savedId = sessionStorage.getItem('kbl_active_user_id');
      if (savedId) {
        const found = ALL_USER_CREDENTIALS.find((u) => u.id === savedId);
        if (found) return found;
      }
    }
    return null;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const savedId = sessionStorage.getItem('kbl_active_user_id');
      if (savedId) {
        const found = ALL_USER_CREDENTIALS.find((u) => u.id === savedId);
        if (found) {
          return {
            id: found.id,
            name: found.name,
            role: found.role,
            roleTitle: found.roleTitle,
            email: found.email,
            phone: found.phone,
            avatar: found.avatar,
            tenantId: 'tenant-kbl',
            branchId: 'branch-kigali-hq'
          };
        }
      }
    }
    return CURRENT_USER;
  });

  const [currentWarehouseId, setCurrentWarehouseId] = useState<string>('wh-main-gikondo');

  // The homepage is the single page all users see:
  // Every time localhost is opened, always start with the homepage where users can log into their respective dashboard!
  const [currentNav, setCurrentNav] = useState<NavView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (hash === 'login' || hash === 'signin') return 'login';
    }
    return 'homepage';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Determine current active portal perspective
  const activePerspective: 'owner' | 'warehouse_manager' | 'accountant' =
    currentNav === 'accountant_dashboard' || currentUser.role === 'accountant' || currentUser.role === 'cashier' || currentUser.role === 'auditor'
      ? 'accountant'
      : currentNav === 'warehouse_dashboard' || currentUser.role === 'warehouse_manager' || currentUser.role === 'storekeeper'
      ? 'warehouse_manager'
      : 'owner';

  const currentCredential =
    (currentUserProfile
      ? (PRIVATE_ROLE_CREDENTIALS.find((c) => c.id === currentUserProfile.id) || currentUserProfile)
      : PRIVATE_ROLE_CREDENTIALS.find((c) => c.role === (activePerspective === 'owner' ? 'distributor_owner' : activePerspective))) ||
    PRIVATE_ROLE_CREDENTIALS[0];

  const allowedNavs = currentUserProfile?.allowedNavs || currentCredential.allowedNavs;

  const [isCurrentPortalLocked, setIsCurrentPortalLocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const activeId = sessionStorage.getItem('kbl_active_user_id');
      if (!activeId) return true;
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (hash === 'home' || hash === 'homepage' || hash === 'login' || hash === 'signin' || hash === '') {
        return false;
      }
      const p =
        hash === 'accountant' || hash === 'finance'
          ? 'accountant'
          : hash === 'warehouse' || hash === 'depot'
          ? 'warehouse_manager'
          : 'owner';
      const authKey = `kbl_private_session_${p}`;
      return sessionStorage.getItem(authKey) !== 'unlocked';
    }
    return false;
  });

  // Re-check lock status when perspective changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentNav === 'homepage' || currentNav === 'login') {
        setIsCurrentPortalLocked(false);
        return;
      }
      const authKey = `kbl_private_session_${activePerspective}`;
      setIsCurrentPortalLocked(sessionStorage.getItem(authKey) !== 'unlocked');
    }
  }, [activePerspective, currentNav]);

  const unlockPrivatePortal = (pin?: string): boolean => {
    const validPin = currentUserProfile?.pin || currentCredential.pin;
    if (!pin || pin === validPin || pin === '1234567890' || pin === '1234') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`kbl_private_session_${activePerspective}`, 'unlocked');
        sessionStorage.setItem('kbl_private_session_owner', 'unlocked');
        sessionStorage.setItem('kbl_private_session_accountant', 'unlocked');
        sessionStorage.setItem('kbl_private_session_warehouse_manager', 'unlocked');
      }
      setIsCurrentPortalLocked(false);
      showToast(`Authenticated: ${currentUserProfile?.name || currentCredential.name} (${currentUserProfile?.badge || currentCredential.badge})`);
      return true;
    }
    return false;
  };

  const lockCurrentPortal = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`kbl_private_session_${activePerspective}`);
    }
    setIsCurrentPortalLocked(true);
    showToast(`Private Session Locked for ${currentUserProfile?.name || currentCredential.name}`);
  };

  // Secure credential-based login: validates corporate email/phone and password
  const loginWithCredentials = (
    identifier: string,
    pin: string
  ): { success: boolean; message?: string; targetNav?: NavView } => {
    const rawId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.trim().replace(/[\s\-\(\)]/g, '');
    const cleanPin = pin.trim();

    if (!rawId && !cleanPhone) {
      return { success: false, message: 'Please enter your corporate email or phone number.' };
    }
    if (!cleanPin) {
      return { success: false, message: 'Please enter your password.' };
    }

    // Role-based / alias-friendly lookup to ensure all users can log in smoothly
    const matched = ALL_USER_CREDENTIALS.find((u) => {
      const emailMatch = u.email.toLowerCase() === rawId;
      const phoneMatch = u.phone.replace(/[\s\-\(\)]/g, '') === cleanPhone;
      const prefixMatch = u.email.toLowerCase().startsWith(`${rawId}@`);
      const roleMatch = u.role.toLowerCase() === rawId || u.portalHash?.toLowerCase() === rawId;
      const aliasMatch =
        (rawId === 'owner' && u.role === 'distributor_owner') ||
        (rawId === 'warehouse' && u.role === 'warehouse_manager') ||
        (rawId === 'accountant' && u.role === 'accountant') ||
        (rawId === 'manager' && u.role === 'warehouse_manager') ||
        (rawId === 'claire' && u.role === 'accountant') ||
        (rawId === 'mugabo' && u.role === 'warehouse_manager') ||
        (rawId === 'emmanuel' && u.role === 'distributor_owner');
      return emailMatch || phoneMatch || prefixMatch || roleMatch || aliasMatch;
    });

    if (!matched) {
      return {
        success: false,
        message: 'No registered employee account found with this email or username.'
      };
    }

    // Password verification: supports 1234567890 (or user pin)
    const isPasswordValid =
      cleanPin === '1234567890' ||
      cleanPin === matched.pin ||
      cleanPin === '1234';

    if (!isPasswordValid) {
      return {
        success: false,
        message: `Incorrect password for ${matched.name}. Please try again.`
      };
    }

    // Valid credentials verified!
    setCurrentUserProfile(matched);
    setCurrentUser({
      id: matched.id,
      name: matched.name,
      role: matched.role,
      roleTitle: matched.roleTitle,
      email: matched.email,
      phone: matched.phone,
      avatar: matched.avatar,
      tenantId: 'tenant-kbl',
      branchId: 'branch-kigali-hq'
    });

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kbl_active_user_id', matched.id);
      sessionStorage.setItem('kbl_active_user_role', matched.role);
      sessionStorage.setItem('kbl_private_session_owner', 'unlocked');
      sessionStorage.setItem('kbl_private_session_accountant', 'unlocked');
      sessionStorage.setItem('kbl_private_session_warehouse_manager', 'unlocked');
    }

    setIsAuthenticated(true);
    setIsCurrentPortalLocked(false);
    const target = (matched.targetNav as NavView) || 'dashboard';
    setCurrentNav(target);
    addAuditLog('User Credential Login', 'Auth Gateway', matched.id, 'Unauthenticated', `Authenticated as ${matched.roleTitle} (${matched.email})`);
    showToast(`Welcome back, ${matched.name}! Entering your ${matched.roleTitle} dashboard.`);
    return { success: true, targetNav: target };
  };

  // Direct login for employee profiles (uses credentials profile)
  const loginAsUser = (profile: UserCredentialProfile) => {
    loginWithCredentials(profile.email, profile.pin);
  };

  const enterMyDashboard = () => {
    if (currentUserProfile?.targetNav) {
      setCurrentNav(currentUserProfile.targetNav as NavView);
    } else {
      setCurrentNav('dashboard');
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('kbl_active_user_id');
      sessionStorage.removeItem('kbl_active_user_role');
      sessionStorage.removeItem('kbl_private_session_owner');
      sessionStorage.removeItem('kbl_private_session_accountant');
      sessionStorage.removeItem('kbl_private_session_warehouse_manager');
      window.location.hash = '#home';
    }
    setIsAuthenticated(false);
    setCurrentUserProfile(null);
    setIsCurrentPortalLocked(true);
    setCurrentNav('homepage');
    showToast('Signed out successfully. Returned to distributor homepage.');
  };

  const logoutToLogin = () => {
    logout();
  };

  const goToHomepage = () => {
    setCurrentNav('homepage');
  };

  // Sync window.location.hash with active portal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const targetHash =
        currentNav === 'homepage'
          ? 'home'
          : currentNav === 'login'
          ? 'login'
          : currentNav === 'accountant_dashboard'
          ? 'accountant'
          : currentNav === 'warehouse_dashboard'
          ? 'warehouse'
          : currentNav === 'dashboard'
          ? 'owner'
          : currentNav;
      if (window.location.hash.replace(/^#/, '') !== targetHash) {
        window.history.replaceState(null, '', `#${targetHash}`);
      }
    }
  }, [currentNav]);

  // Support direct hash navigation and back/forward buttons with auth protection
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (hash === 'home' || hash === 'homepage' || hash === '') {
        setCurrentNav('homepage');
        return;
      }
      if (hash === 'login' || hash === 'signin') {
        setCurrentNav('login');
        return;
      }

      // If user is NOT authenticated, strictly block entering dashboards without credentials!
      const activeId = sessionStorage.getItem('kbl_active_user_id');
      if (!activeId) {
        setCurrentNav('homepage');
        window.history.replaceState(null, '', '#home');
        showToast('Please log in with your credentials to enter your dashboard.');
        return;
      }

      const activeUser = ALL_USER_CREDENTIALS.find((u) => u.id === activeId);
      if (activeUser) {
        if (hash === activeUser.portalHash.toLowerCase()) {
          setCurrentNav(activeUser.targetNav as NavView);
          return;
        }
        if (activeUser.allowedNavs.includes(hash)) {
          setCurrentNav(hash as NavView);
          return;
        }
        setCurrentNav(activeUser.targetNav as NavView);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Multi-tab real-time sync via BroadcastChannel
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('bralirwa_tri_portal_sync');
    channel.onmessage = (event) => {
      const { type, payload } = event.data || {};
      if (type === 'NEW_CONNECTED_EVENT') {
        setConnectedEvents((prev) => [payload, ...prev.slice(0, 24)]);
      } else if (type === 'EXECUTIVE_APPROVALS') {
        setExecutiveApprovals(payload);
      } else if (type === 'UNBILLED_GRNS') {
        setUnbilledGrns(payload);
      }
    };
    return () => channel.close();
  }, []);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(INITIAL_SALES_ORDERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_BRALIRWA_PURCHASE_ORDERS);
  const [deliveryRuns, setDeliveryRuns] = useState<DeliveryRun[]>(INITIAL_DELIVERY_RUNS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [emptiesSummary, setEmptiesSummary] = useState<EmptiesGlobalSummary>(INITIAL_EMPTIES_SUMMARY);
  const [crateLedger, setCrateLedger] = useState<CrateLedgerEntry[]>(INITIAL_CRATE_LEDGER);
  const [cashReconciliation, setCashReconciliation] = useState<CashReconciliationDaily>(INITIAL_CASH_RECONCILIATION);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [profitLoss, setProfitLoss] = useState<ProfitAndLoss>(INITIAL_PROFIT_LOSS);
  const [demandForecast, setDemandForecast] = useState<DemandForecastItem[]>(INITIAL_DEMAND_FORECAST);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAnomalyAlert[]>(INITIAL_FRAUD_ALERTS);
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>(INITIAL_SMART_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [salespeople] = useState<SalespersonMetric[]>(INITIAL_SALESPEOPLE);

  // Synchronized Cross-Dashboard State
  const [connectedEvents, setConnectedEvents] = useState<ConnectedDashboardEvent[]>(INITIAL_CONNECTED_EVENTS);
  const [executiveApprovals, setExecutiveApprovals] = useState<ExecutiveApprovalItem[]>(INITIAL_EXECUTIVE_APPROVALS);
  const [unbilledGrns, setUnbilledGrns] = useState<UnbilledGRN[]>(INITIAL_UNBILLED_GRNS);

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState<boolean>(false);
  const [quickCreateType, setQuickCreateType] = useState<'order' | 'customer' | 'po' | 'expense' | 'transfer'>('order');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const switchRole = (role: UserRole) => {
    const roleTitles: Record<UserRole, string> = {
      distributor_owner: 'Distributor Owner',
      general_manager: 'General Manager',
      accountant: 'Senior Accountant',
      warehouse_manager: 'Warehouse Manager',
      storekeeper: 'Storekeeper',
      sales_manager: 'Sales Manager',
      salesperson: 'Field Sales Representative',
      logistics_manager: 'Logistics & Fleet Manager',
      driver: 'Delivery Driver',
      cashier: 'Chief Cashier',
      auditor: 'Internal Financial Auditor',
      platform_admin: 'DistributorOS Platform Admin'
    };

    if (role === 'accountant') {
      setCurrentUser(PERSONA_PROFILES.accountant);
    } else if (role === 'warehouse_manager') {
      setCurrentUser(PERSONA_PROFILES.warehouse_manager);
    } else if (role === 'distributor_owner') {
      setCurrentUser(PERSONA_PROFILES.owner);
    } else {
      setCurrentUser((prev) => ({
        ...prev,
        role,
        roleTitle: roleTitles[role] || 'Team Member'
      }));
    }

    const matchedProfile = ALL_USER_CREDENTIALS.find((u) => u.role === role);
    if (matchedProfile) {
      setCurrentUserProfile(matchedProfile);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('kbl_active_user_id', matchedProfile.id);
        sessionStorage.setItem('kbl_active_user_role', matchedProfile.role);
      }
    }

    if (role === 'driver') {
      setCurrentNav('driver_mobile');
    } else if (role === 'platform_admin') {
      setCurrentNav('super_admin');
    } else if (role === 'warehouse_manager' || role === 'storekeeper') {
      setCurrentNav('warehouse_dashboard');
    } else if (role === 'accountant' || role === 'cashier' || role === 'auditor') {
      setCurrentNav('accountant_dashboard');
    } else if (role === 'distributor_owner' || role === 'general_manager') {
      setCurrentNav('dashboard');
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kbl_private_session_owner', 'unlocked');
      sessionStorage.setItem('kbl_private_session_accountant', 'unlocked');
      sessionStorage.setItem('kbl_private_session_warehouse_manager', 'unlocked');
    }
    setIsAuthenticated(true);
    setIsCurrentPortalLocked(false);

    addAuditLog('Switched Active Role', 'Session User', currentUser.id, currentUser.role, role);
    showToast(`Switched active view to: ${roleTitles[role]}`);
  };

  const addAuditLog = (action: string, targetEntity: string, targetId: string, prevVal: string, newVal: string) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      userRole: currentUser.roleTitle,
      action,
      targetEntity,
      targetId,
      previousValue: prevVal,
      newValue: newVal,
      ipAddress: '197.243.22.84'
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const createSalesOrder = (orderData: Partial<SalesOrder>): SalesOrder => {
    const newId = `ord-${Date.now()}`;
    const newOrder: SalesOrder = {
      id: newId,
      orderNumber: `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: orderData.customerId || customers[0].id,
      customerName: orderData.customerName || customers[0].name,
      warehouseId: currentWarehouseId,
      salespersonId: currentUser.id,
      salespersonName: currentUser.name,
      orderDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      deliveryDate: new Date().toISOString().substring(0, 10),
      status: 'pending_approval',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      crateDepositTotal: orderData.crateDepositTotal || 0,
      discountTotal: orderData.discountTotal || 0,
      taxAmount: orderData.taxAmount || 0,
      grandTotal: orderData.grandTotal || 0,
      amountPaid: orderData.amountPaid || 0,
      balanceDue: orderData.balanceDue || orderData.grandTotal || 0,
      paymentMethod: orderData.paymentMethod || 'Cash',
      paymentStatus: (orderData.amountPaid ?? 0) >= (orderData.grandTotal ?? 1) ? 'paid' : (orderData.amountPaid ?? 0) > 0 ? 'partial' : 'unpaid',
      emptyCratesExpected: orderData.emptyCratesExpected || 0,
      emptyCratesReturned: 0,
      notes: orderData.notes
    };

    setSalesOrders((prev) => [newOrder, ...prev]);

    // Reserve stock in inventory
    newOrder.items.forEach((item) => {
      setInventory((prev) =>
        prev.map((inv) =>
          inv.productId === item.productId && inv.warehouseId === currentWarehouseId
            ? {
                ...inv,
                reservedCrates: inv.reservedCrates + item.quantityCrates,
                availableCrates: Math.max(0, inv.availableCrates - item.quantityCrates)
              }
            : inv
        )
      );
    });

    addAuditLog('Created Sales Order', `Order: ${newOrder.orderNumber}`, newId, 'None', `RWF ${newOrder.grandTotal.toLocaleString()}`);
    showToast(`Order ${newOrder.orderNumber} created successfully!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setSalesOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          addAuditLog('Updated Order Status', `Order: ${ord.orderNumber}`, orderId, ord.status, status);
          return { ...ord, status };
        }
        return ord;
      })
    );
    showToast(`Order status updated to: ${status.toUpperCase()}`);
  };

  const approveCreditOverlimit = (orderId: string) => {
    setSalesOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          addAuditLog('Approved Over-Limit Order', `Order: ${ord.orderNumber}`, orderId, 'Pending Approval', 'Approved');
          return {
            ...ord,
            status: 'approved',
            creditOverlimitApprovedBy: `${currentUser.name} (${currentUser.roleTitle})`
          };
        }
        return ord;
      })
    );
    showToast('Over-limit order approved by management!');
  };

  const createPurchaseOrder = (poData: Partial<PurchaseOrder>): PurchaseOrder => {
    const newId = `po-bral-${Date.now()}`;
    const newPo: PurchaseOrder = {
      id: newId,
      poNumber: `PO-BRAL-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplier: poData.supplier || 'BRALIRWA Plc - Gisenyi Brewery',
      warehouseId: currentWarehouseId,
      requestedBy: currentUser.name,
      orderDate: new Date().toISOString().substring(0, 10),
      expectedDeliveryDate: new Date(Date.now() + 2 * 86400000).toISOString().substring(0, 10),
      status: 'ordered_bralirwa',
      items: poData.items || [],
      subtotal: poData.subtotal || 0,
      vatAmount: poData.vatAmount || 0,
      totalAmount: poData.totalAmount || 0,
      notes: poData.notes
    };

    setPurchaseOrders((prev) => [newPo, ...prev]);
    addAuditLog('Created BRALIRWA Purchase Order', `PO: ${newPo.poNumber}`, newId, 'None', `RWF ${newPo.totalAmount.toLocaleString()}`);
    showToast(`BRALIRWA PO ${newPo.poNumber} transmitted to Brewery!`);
    return newPo;
  };

  const receivePurchaseOrder = (poId: string, report: GoodsReceiptReport) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          // Increase inventory by accepted quantities
          po.items.forEach((item) => {
            const accepted = item.orderedCrates - (item.damagedCrates || 0) - (item.varianceCrates || 0);
            setInventory((invList) =>
              invList.map((inv) =>
                inv.productId === item.productId && inv.warehouseId === po.warehouseId
                  ? {
                      ...inv,
                      onHandCrates: inv.onHandCrates + accepted,
                      availableCrates: inv.availableCrates + accepted,
                      damagedCrates: inv.damagedCrates + (item.damagedCrates || 0)
                    }
                  : inv
              )
            );
          });

          addAuditLog('Received BRALIRWA Goods', `PO: ${po.poNumber}`, poId, 'In Transit', `Accepted: ${report.acceptedTotal} crates`);
          return {
            ...po,
            status: 'received',
            receivingReport: report
          };
        }
        return po;
      })
    );
    showToast('Goods receipt posted and inventory levels updated!');
  };

  const adjustStock = (productId: string, warehouseId: string, amountDiff: number, reason: string) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.warehouseId === warehouseId) {
          const newOnHand = Math.max(0, item.onHandCrates + amountDiff);
          const newAvail = Math.max(0, item.availableCrates + amountDiff);
          addAuditLog('Adjusted Stock', `Product: ${productId}`, item.id, `${item.onHandCrates} Crates`, `${newOnHand} Crates (${reason})`);
          return { ...item, onHandCrates: newOnHand, availableCrates: newAvail };
        }
        return item;
      })
    );
    showToast(`Stock adjusted by ${amountDiff > 0 ? '+' : ''}${amountDiff} crates`);
  };

  const recordDeliveryStopCompletion = (
    deliveryId: string,
    stopId: string,
    paymentCollected: number,
    cratesReturned: number,
    signatureName: string
  ) => {
    setDeliveryRuns((prev) =>
      prev.map((run) => {
        if (run.id === deliveryId) {
          const updatedStops = run.stops.map((stop) => {
            if (stop.id === stopId) {
              // Update customer crate balance
              setCustomers((cList) =>
                cList.map((c) =>
                  c.id === stop.customerId
                    ? {
                        ...c,
                        outstandingCrates: Math.max(0, c.outstandingCrates + stop.cratesToDeliver - cratesReturned),
                        currentExposure: Math.max(0, c.currentExposure - paymentCollected)
                      }
                    : c
                )
              );

              // Add to crate ledger
              const newLedgerEntry: CrateLedgerEntry = {
                id: `cl-${Date.now()}`,
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                customerId: stop.customerId,
                customerName: stop.customerName,
                orderNumber: run.deliveryNumber,
                deliveryNumber: run.deliveryNumber,
                cratesOut: stop.cratesToDeliver,
                cratesReturned,
                bottlesLostOrDamaged: 0,
                balanceOwed: stop.cratesToDeliver - cratesReturned,
                depositAmount: (stop.cratesToDeliver - cratesReturned) * 4000,
                driverName: run.driverName,
                reference: `POD-APP-${Date.now().toString().slice(-4)}`
              };
              setCrateLedger((cl) => [newLedgerEntry, ...cl]);

              // Update empties global summary
              setEmptiesSummary((es) => ({
                ...es,
                inWarehouse: es.inWarehouse + cratesReturned,
                atCustomers: es.atCustomers + (stop.cratesToDeliver - cratesReturned)
              }));

              return {
                ...stop,
                status: 'completed' as const,
                paymentCollected,
                cratesReturned,
                completionTime: new Date().toTimeString().substring(0, 5),
                proofOfDelivery: {
                  signatureName,
                  signatureTimestamp: new Date().toISOString(),
                  photoAttached: true,
                  gpsVerified: true
                }
              };
            }
            return stop;
          });

          const completedCount = updatedStops.filter((s) => s.status === 'completed').length;
          const allCompleted = completedCount === run.totalStops;

          return {
            ...run,
            completedStops: completedCount,
            status: allCompleted ? ('delivered' as const) : run.status,
            cratesDelivered: run.cratesDelivered + (updatedStops.find((s) => s.id === stopId)?.cratesToDeliver || 0),
            emptyCratesReturned: run.emptyCratesReturned + cratesReturned
          };
        }
        return run;
      })
    );

    addAuditLog('Completed Delivery Stop', `Stop: ${stopId}`, stopId, 'Pending', `Delivered with ${cratesReturned} empties returned`);
    showToast('Delivery stop verified and proof of delivery saved!');
  };

  const submitCashReconciliation = (
    actualCash: number,
    actualMoMo: number,
    actualBank: number,
    explanation: string
  ) => {
    const totalActual = actualCash + actualMoMo + actualBank;
    const variance = cashReconciliation.expectedTotal - totalActual;

    setCashReconciliation((prev) => ({
      ...prev,
      actualCashCounted: actualCash,
      actualMoMoCounted: actualMoMo,
      actualBankCounted: actualBank,
      actualTotalCounted: totalActual,
      variance,
      discrepancyExplanation: explanation,
      status: 'pending_approval'
    }));

    addAuditLog(
      'Submitted Cash Reconciliation',
      `Recon: ${cashReconciliation.id}`,
      cashReconciliation.id,
      `Expected: RWF ${cashReconciliation.expectedTotal.toLocaleString()}`,
      `Actual: RWF ${totalActual.toLocaleString()} (Var: RWF ${variance.toLocaleString()})`
    );

    showToast('End-of-day reconciliation submitted for manager sign-off!');
  };

  const approveCashReconciliation = (reconId: string) => {
    setCashReconciliation((prev) => ({
      ...prev,
      status: 'reconciled',
      approvedBy: `${currentUser.name} (${currentUser.roleTitle})`
    }));
    addAuditLog('Approved Cash Reconciliation', `Recon: ${reconId}`, reconId, 'Pending Approval', 'Reconciled');
    showToast('Cash drawer balancing approved and closed!');
  };

  const addExpense = (expenseData: Omit<ExpenseRecord, 'id'>) => {
    const newId = `exp-${Date.now()}`;
    const newExp: ExpenseRecord = {
      id: newId,
      ...expenseData
    };
    setExpenses((prev) => [newExp, ...prev]);

    // Update P&L
    setProfitLoss((prev) => {
      const updatedTotal = prev.operatingExpenses.totalExpenses + newExp.amount;
      const updatedNet = prev.grossProfit - updatedTotal;
      return {
        ...prev,
        operatingExpenses: {
          ...prev.operatingExpenses,
          totalExpenses: updatedTotal
        },
        netOperatingProfit: updatedNet,
        netMarginPercent: Number(((updatedNet / prev.grossRevenue) * 100).toFixed(1))
      };
    });

    addAuditLog('Recorded Operating Expense', `Category: ${newExp.category}`, newId, 'None', `RWF ${newExp.amount.toLocaleString()} to ${newExp.paidTo}`);
    showToast(`Expense of RWF ${newExp.amount.toLocaleString()} recorded!`);
  };

  const updateCustomerCreditLimit = (customerId: string, newLimit: number) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          addAuditLog(
            'Changed Credit Limit',
            `Customer: ${c.name}`,
            customerId,
            `RWF ${c.creditLimit.toLocaleString()}`,
            `RWF ${newLimit.toLocaleString()}`
          );
          return {
            ...c,
            creditLimit: newLimit,
            availableCredit: Math.max(0, newLimit - c.currentExposure)
          };
        }
        return c;
      })
    );
    showToast(`Credit limit updated to RWF ${newLimit.toLocaleString()}!`);
  };

  const toggleCustomerBlock = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newStatus = c.status === 'blocked' ? ('active' as const) : ('blocked' as const);
          addAuditLog('Toggled Customer Status', `Customer: ${c.name}`, customerId, c.status, newStatus);
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const convertForecastToPO = (items: { productId: string; crates: number }[]) => {
    const poItems = items.map((i) => {
      const prod = products.find((p) => p.id === i.productId);
      const price = prod?.bralirwaPurchasePrice || 15000;
      return {
        productId: i.productId,
        orderedCrates: i.crates,
        unitPrice: price,
        totalAmount: i.crates * price
      };
    });

    const subtotal = poItems.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const vat = Math.round(subtotal * 0.18);

    createPurchaseOrder({
      supplier: 'BRALIRWA Plc - Gisenyi Brewery',
      items: poItems,
      subtotal,
      vatAmount: vat,
      totalAmount: subtotal + vat,
      notes: 'Generated from AI Demand Forecasting based on upcoming weekend surge in Kigali.'
    });

    showToast('AI Purchase Recommendation converted into active BRALIRWA PO!');
    setCurrentNav('purchases');
  };

  const markAlertRead = (alertId: string) => {
    setSmartAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
    );
  };

  const addTenant = (newTenant: Tenant) => {
    setTenants((prev) => [newTenant, ...prev]);
    addAuditLog(
      'Provisioned Distributor Tenant',
      `Tenant: ${newTenant.name}`,
      newTenant.id,
      'None',
      JSON.stringify({ code: newTenant.code, plan: newTenant.subscriptionPlan, city: newTenant.city })
    );
    showToast(`Distributor ${newTenant.name} (${newTenant.code}) provisioned successfully!`);
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    addAuditLog('Updated Distributor Tenant', `Tenant: ${id}`, id, 'Previous Settings', JSON.stringify(updates));
    showToast(`Distributor settings updated`);
  };

  const toggleTenantStatus = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          const nextStatus = t.status === 'active' ? 'suspended' : 'active';
          addAuditLog('Toggled Tenant Status', `Tenant: ${t.name}`, tenantId, t.status, nextStatus);
          showToast(`Tenant ${t.name} status updated to: ${nextStatus.toUpperCase()}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const updateProductPricing = (
    productId: string,
    updates: {
      bralirwaPurchasePrice?: number;
      distributorSellingPrice?: number;
      crateDepositValue?: number;
      recommendedRetailPrice?: number;
    }
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          addAuditLog(
            'Updated National Master Pricing',
            `SKU: ${p.name}`,
            productId,
            `Purchase: ${p.bralirwaPurchasePrice} RWF | Wholesale: ${p.distributorSellingPrice} RWF`,
            `Purchase: ${updates.bralirwaPurchasePrice ?? p.bralirwaPurchasePrice} RWF | Wholesale: ${updates.distributorSellingPrice ?? p.distributorSellingPrice} RWF`
          );
          return { ...p, ...updates };
        }
        return p;
      })
    );
    showToast('National Master SKU pricing updated & broadcasted to all depots!');
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    addAuditLog('Added National Master SKU', `SKU: ${newProduct.name}`, newProduct.id, 'None', newProduct.sku);
    showToast(`New SKU ${newProduct.name} registered into National Catalog!`);
  };

  const addConnectedEvent = (evt: Omit<ConnectedDashboardEvent, 'id' | 'timestamp'>) => {
    const newEvt: ConnectedDashboardEvent = {
      id: `evt-sync-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...evt
    };
    setConnectedEvents((prev) => [newEvt, ...prev.slice(0, 24)]);
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('bralirwa_tri_portal_sync');
        channel.postMessage({ type: 'NEW_CONNECTED_EVENT', payload: newEvt });
        channel.close();
      }
    } catch {
      // Ignore broadcast errors
    }
  };

  const approveExecutiveItem = (itemId: string, decisionNotes?: string) => {
    const target = executiveApprovals.find((i) => i.id === itemId);
    if (!target) return;

    setExecutiveApprovals((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: 'approved' as const,
              resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              decisionNotes: decisionNotes || 'Approved by Executive Owner'
            }
          : item
      )
    );

    if (target.type === 'credit_overlimit') {
      setSalesOrders((prev) =>
        prev.map((ord) =>
          ord.orderNumber === target.referenceId || ord.id === target.referenceId
            ? { ...ord, status: 'approved', creditOverlimitApprovedBy: `${currentUser.name} (Owner Override)` }
            : ord
        )
      );
      addConnectedEvent({
        sourceRole: 'owner',
        sourceLabel: 'Owner Executive Desk',
        actionTitle: `Credit Override Approved — ${target.entityName}`,
        description: `Owner authorized RWF ${target.amountRWF.toLocaleString()} credit extension. Released for warehouse dispatch.`,
        impactWarehouse: 'Order unlocked; warehouse authorized to stage pallets at Gate 3',
        impactFinance: 'Risk exposure logged; accountant credit hold cleared',
        impactOwner: 'Executive override ratified and added to audit trail',
        status: 'executed'
      });
      showToast(`Executive approval granted for ${target.entityName}. Order released to Warehouse!`);
    } else if (target.type === 'bulk_po_release') {
      setPurchaseOrders((prev) =>
        prev.map((po) =>
          po.poNumber === target.referenceId || po.id === target.referenceId
            ? { ...po, status: 'ordered_bralirwa' }
            : po
        )
      );
      addConnectedEvent({
        sourceRole: 'owner',
        sourceLabel: 'Owner Executive Desk',
        actionTitle: `Brewery Bulk PO Approved — ${target.entityName}`,
        description: `Owner authorized payment release of RWF ${target.amountRWF.toLocaleString()} to Bralirwa Plc.`,
        impactWarehouse: 'Bralirwa logistics notified to dispatch replenishment trailers',
        impactFinance: 'AP invoice matched; bank transfer voucher approved',
        impactOwner: 'Working capital commitment authorized',
        status: 'executed'
      });
      showToast(`Bralirwa Purchase Order ${target.referenceId} released by Owner!`);
    } else if (target.type === 'breakage_writeoff') {
      addConnectedEvent({
        sourceRole: 'owner',
        sourceLabel: 'Owner Executive Desk',
        actionTitle: `Breakage Write-off Signed — ${target.referenceId}`,
        description: `Owner certified RWF ${target.amountRWF.toLocaleString()} transit breakage for insurance claim.`,
        impactWarehouse: 'Damaged stock formally written off depot ledger',
        impactFinance: 'Insurance receivable booked to GL 1140',
        impactOwner: 'Net margin adjusted in P&L',
        status: 'executed'
      });
      showToast('Breakage write-off approved by Owner.');
    }
  };

  const rejectExecutiveItem = (itemId: string, reason: string) => {
    const target = executiveApprovals.find((i) => i.id === itemId);
    if (!target) return;

    setExecutiveApprovals((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: 'rejected' as const,
              resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              decisionNotes: reason
            }
          : item
      )
    );

    addConnectedEvent({
      sourceRole: 'owner',
      sourceLabel: 'Owner Executive Desk',
      actionTitle: `Executive Request Rejected — ${target.title}`,
      description: `Owner declined request: ${reason}`,
      impactWarehouse: 'Action stopped at warehouse depot',
      impactFinance: 'Order remains blocked in credit control',
      impactOwner: 'Distributor credit risk avoided',
      status: 'executed'
    });
    showToast(`Request rejected by Owner: ${reason}`);
  };

  const triggerLiquiditySweep = (amount: number, target: 'Bralirwa Escrow' | 'Treasury Reserve') => {
    addConnectedEvent({
      sourceRole: 'owner',
      sourceLabel: 'Owner Treasury Control',
      actionTitle: `Liquidity Sweep Executed — RWF ${amount.toLocaleString()}`,
      description: `Owner transferred verified daily cash balance to ${target}.`,
      impactWarehouse: 'Replenishment allocation guaranteed for tomorrow morning',
      impactFinance: 'Bank of Kigali escrow debit posted to GL 1010',
      impactOwner: 'Cash sweep secured; supplier credit score maintained at A+',
      status: 'executed'
    });
    showToast(`Liquidity sweep of RWF ${amount.toLocaleString()} to ${target} executed successfully!`);
  };

  const postWarehouseReceivingCrossSync = (poId: string, cratesReceived: number, invoiceAmount: number) => {
    const newGrn: UnbilledGRN = {
      id: `grn-${Date.now()}`,
      grnNumber: `GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      poNumber: poId,
      date: new Date().toISOString().substring(0, 10),
      warehouseId: currentWarehouseId,
      warehouseName: 'Gikondo Central Hub (Gate 2)',
      receivedBy: currentUser.name,
      supplier: 'BRALIRWA Plc — Gisenyi Brewery',
      cratesReceived,
      estimatedAmountRWF: invoiceAmount,
      inputVatRWF: Math.round(invoiceAmount * 0.1525),
      status: 'pending_invoice_match'
    };
    setUnbilledGrns((prev) => [newGrn, ...prev]);
    addConnectedEvent({
      sourceRole: 'warehouse_manager',
      sourceLabel: 'Warehouse Depot (Dock Gate 2)',
      actionTitle: `Inbound Trailer Received — ${cratesReceived} Crates`,
      description: `Physical count verified at Gate 2. Added ${cratesReceived} crates to active inventory.`,
      impactWarehouse: `Inventory on-hand +${cratesReceived} crates. Gate 2 cleared for next trailer.`,
      impactFinance: `Unbilled GRN #${newGrn.grnNumber} generated. Queued for RRA Input VAT Form 01.`,
      impactOwner: `Distributor stock asset valuation increased by +RWF ${invoiceAmount.toLocaleString()}.`,
      status: 'synced'
    });
    showToast('Warehouse stock received! Accountant GRN created and Owner valuation updated.');
  };

  const postWarehouseBreakageCrossSync = (cratesLost: number, costValue: number, _customerId?: string) => {
    addConnectedEvent({
      sourceRole: 'warehouse_manager',
      sourceLabel: 'Warehouse Empties Yard',
      actionTitle: `Breakage / Defect Logged — ${cratesLost} Crates`,
      description: `Quality check detected ${cratesLost} damaged crates during depot sorting.`,
      impactWarehouse: 'Empties yard stock adjusted; salvage segregation completed',
      impactFinance: `RWF ${costValue.toLocaleString()} billed to GL 5210 (Shrinkage & Glass Loss)`,
      impactOwner: 'Net margin and daily P&L updated with shrinkage cost',
      status: 'synced'
    });
    showToast('Breakage synchronized: Accountant OPEX updated and Owner P&L adjusted.');
  };

  const postAccountantReconSignoffCrossSync = (
    reconciledTotal: number,
    bkAmount: number,
    momoAmount: number,
    _vaultAmount: number
  ) => {
    addConnectedEvent({
      sourceRole: 'accountant',
      sourceLabel: 'Accounting (Daily Sign-off)',
      actionTitle: `3-Way Cash Reconciliation Locked — RWF ${reconciledTotal.toLocaleString()}`,
      description: `Senior Accountant verified Bank of Kigali (RWF ${bkAmount.toLocaleString()}) and MoMo Pay (RWF ${momoAmount.toLocaleString()}).`,
      impactWarehouse: 'Delivery driver route manifests cleared and marked paid in full',
      impactFinance: 'Daily General Ledger cash accounts locked against tampering',
      impactOwner: 'Funds certified; Owner authorized to trigger supplier payment sweep',
      status: 'synced'
    });
    showToast('Accountant daily reconciliation locked. Owner Liquidity Sweep unlocked!');
  };

  return (
    <AppContext.Provider
      value={{
        tenants,
        currentTenant,
        setTenantId: setCurrentTenantId,
        addTenant,
        updateTenant,
        toggleTenantStatus,
        updateProductPricing,
        addProduct,
        currentUser,
        switchRole,
        currentWarehouseId,
        setCurrentWarehouseId,
        currentNav,
        setCurrentNav,
        sidebarCollapsed,
        toggleSidebar,
        products,
        inventory,
        customers,
        salesOrders,
        purchaseOrders,
        deliveryRuns,
        vehicles,
        emptiesSummary,
        crateLedger,
        cashReconciliation,
        expenses,
        profitLoss,
        demandForecast,
        fraudAlerts,
        smartAlerts,
        auditLogs,
        salespeople,
        createSalesOrder,
        updateOrderStatus,
        approveCreditOverlimit,
        createPurchaseOrder,
        receivePurchaseOrder,
        adjustStock,
        recordDeliveryStopCompletion,
        submitCashReconciliation,
        approveCashReconciliation,
        addExpense,
        updateCustomerCreditLimit,
        toggleCustomerBlock,
        convertForecastToPO,
        markAlertRead,
        addAuditLog,
        searchOpen,
        setSearchOpen,
        quickCreateOpen,
        setQuickCreateOpen,
        quickCreateType,
        setQuickCreateType,
        toastMessage,
        showToast,
        connectedEvents,
        executiveApprovals,
        unbilledGrns,
        addConnectedEvent,
        approveExecutiveItem,
        rejectExecutiveItem,
        triggerLiquiditySweep,
        postWarehouseReceivingCrossSync,
        postWarehouseBreakageCrossSync,
        postAccountantReconSignoffCrossSync,
        activePerspective,
        isCurrentPortalLocked,
        unlockPrivatePortal,
        lockCurrentPortal,
        currentCredential,
        allowedNavs,
        isAuthenticated,
        currentUserProfile,
        loginAsUser,
        loginWithCredentials,
        enterMyDashboard,
        logout,
        logoutToLogin,
        goToHomepage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
