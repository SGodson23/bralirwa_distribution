export type UserRole =
  | 'distributor_owner'
  | 'general_manager'
  | 'accountant'
  | 'warehouse_manager'
  | 'storekeeper'
  | 'sales_manager'
  | 'salesperson'
  | 'logistics_manager'
  | 'driver'
  | 'cashier'
  | 'auditor'
  | 'platform_admin';

export interface Tenant {
  id: string;
  name: string;
  code: string;
  licenseNumber: string;
  tinNumber: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  subscriptionPlan: 'Starter' | 'Professional' | 'Enterprise';
  status: 'active' | 'suspended' | 'trial';
  createdAt: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  province: string;
  district: string;
  warehouses: Warehouse[];
}

export interface Warehouse {
  id: string;
  branchId: string;
  name: string;
  code: string;
  capacityCrates: number;
  managerName: string;
  phone: string;
  address: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  phone: string;
  avatar: string;
  tenantId: string;
  branchId: string;
  assignedWarehouseId?: string;
  assignedTruckId?: string;
}

export type ProductCategory = 'Beer' | 'Soft Drinks' | 'Water' | 'Malt & Energy' | 'Premium';
export type PackagingType = 'RGB Crate (24x50cl)' | 'RGB Crate (24x33cl)' | 'RGB Crate (24x30cl)' | 'PET Shrink (12x50cl)' | 'PET Shrink (24x30cl)' | 'Keg (30L)' | 'Can Tray (24x33cl)';

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  brand: string;
  category: ProductCategory;
  packaging: PackagingType;
  unitsPerCrate: number;
  bottleVolume: string;
  bralirwaPurchasePrice: number; // Purchase price per crate from BRALIRWA (RWF)
  distributorSellingPrice: number; // Wholesale selling price to bars/retailers (RWF)
  recommendedRetailPrice: number; // Suggested bar selling price per bottle (RWF)
  crateDepositValue: number; // Deposit value per crate (RWF)
  bottleDepositValue: number; // Deposit value per empty bottle (RWF)
  taxRate: number; // VAT % (18% Rwanda)
  isActive: boolean;
  imageUrl?: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  onHandCrates: number;
  reservedCrates: number;
  availableCrates: number;
  damagedCrates: number;
  dailyAverageSalesCrates: number;
  minLevelCrates: number;
  maxLevelCrates: number;
  reorderPointCrates: number;
  stockCoverDays: number;
  batchNumber: string;
  expiryDate: string;
  status: 'healthy' | 'low_stock' | 'critical' | 'overstock';
}

export type POStatus = 'draft' | 'pending_approval' | 'ordered_bralirwa' | 'in_transit' | 'partially_received' | 'received' | 'cancelled';

export interface PurchaseOrderItem {
  productId: string;
  orderedCrates: number;
  unitPrice: number;
  totalAmount: number;
  receivedCrates?: number;
  damagedCrates?: number;
  varianceCrates?: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: 'BRALIRWA Plc - Gisenyi Brewery' | 'BRALIRWA Plc - Kigali Depot';
  warehouseId: string;
  requestedBy: string;
  approvedBy?: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: POStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  bralirwaInvoiceNumber?: string;
  deliveryNoteNumber?: string;
  notes?: string;
  receivingReport?: GoodsReceiptReport;
}

export interface GoodsReceiptReport {
  receiptDate: string;
  receivedBy: string;
  driverName: string;
  truckPlate: string;
  orderedTotal: number;
  deliveredTotal: number;
  damagedTotal: number;
  acceptedTotal: number;
  varianceTotal: number;
  discrepancyReason?: string;
  inspectorSignature: string;
}

export type CustomerCategory = 'Bar' | 'Restaurant' | 'Hotel' | 'Supermarket' | 'Nightclub' | 'Wholesaler' | 'Event / Catering';

export interface Customer {
  id: string;
  accountNumber: string;
  name: string;
  tradeName: string;
  category: CustomerCategory;
  tinNumber: string;
  contactPerson: string;
  phone: string;
  email: string;
  district: string;
  sector: string;
  address: string;
  gpsCoordinates: { lat: number; lng: number };
  assignedSalespersonId: string;
  creditLimit: number;
  currentExposure: number;
  availableCredit: number;
  paymentTermsDays: number; // e.g. 7, 14, 30 days
  outstandingCrates: number; // Empties held
  crateDepositHeld: number; // RWF
  paymentBehaviorScore: 'A+' | 'A' | 'B' | 'C' | 'Risky';
  status: 'active' | 'blocked' | 'watch_list';
  totalRevenueYTD: number;
  averageOrderValue: number;
  lastOrderDate: string;
}

export type OrderStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'picking'
  | 'loaded'
  | 'dispatched'
  | 'delivered'
  | 'paid'
  | 'closed'
  | 'cancelled';

export type PaymentMethod = 'Cash' | 'MTN MoMo' | 'Airtel Money' | 'Bank Transfer (BK)' | 'Credit' | 'Mixed';

export interface SalesOrderItem {
  productId: string;
  productName: string;
  quantityCrates: number;
  unitPrice: number;
  depositPerCrate: number;
  subtotal: number;
  depositSubtotal: number;
  discount: number;
  lineTotal: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  warehouseId: string;
  salespersonId: string;
  salespersonName: string;
  orderDate: string;
  deliveryDate: string;
  status: OrderStatus;
  items: SalesOrderItem[];
  subtotal: number;
  crateDepositTotal: number;
  discountTotal: number;
  taxAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  emptyCratesExpected: number;
  emptyCratesReturned: number;
  deliveryId?: string;
  assignedTruck?: string;
  assignedDriver?: string;
  creditOverlimitApprovedBy?: string;
  notes?: string;
}

export interface CrateLedgerEntry {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  orderNumber: string;
  deliveryNumber: string;
  cratesOut: number;
  cratesReturned: number;
  bottlesLostOrDamaged: number;
  balanceOwed: number;
  depositAmount: number;
  driverName: string;
  reference: string;
}

export interface EmptiesGlobalSummary {
  totalDistributorCrates: number;
  inWarehouse: number;
  atCustomers: number;
  inTrucks: number;
  damaged: number;
  missingInDispute: number;
  totalAssetValueRWF: number;
}

export type DeliveryStatus = 'ready' | 'loading' | 'dispatched' | 'in_transit' | 'delivered' | 'failed' | 'rescheduled';

export interface DeliveryStop {
  id: string;
  stopSequence: number;
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  gps: { lat: number; lng: number };
  cratesToDeliver: number;
  emptyCratesToCollect: number;
  paymentDue: number;
  paymentCollected: number;
  paymentMethodCollected: PaymentMethod;
  cratesReturned: number;
  status: 'pending' | 'arrived' | 'completed' | 'failed';
  failureReason?: string;
  arrivalTime?: string;
  completionTime?: string;
  proofOfDelivery?: {
    signatureName: string;
    signatureTimestamp: string;
    photoAttached: boolean;
    gpsVerified: boolean;
    cashReceiptNumber?: string;
  };
}

export interface DeliveryRun {
  id: string;
  deliveryNumber: string;
  routeCode: string;
  routeName: string;
  truckPlate: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  dispatchDate: string;
  status: DeliveryStatus;
  totalStops: number;
  completedStops: number;
  cratesLoaded: number;
  cratesDelivered: number;
  emptyCratesReturned: number;
  totalValue: number;
  cashCollected: number;
  momoCollected: number;
  fuelEstimatedLiters: number;
  distanceKm: number;
  stops: DeliveryStop[];
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  capacityCrates: number;
  assignedDriverId: string;
  assignedDriverName: string;
  status: 'active' | 'maintenance' | 'offline' | 'available';
  currentMileageKm: number;
  fuelLevelPercent: number;
  insuranceExpiryDate: string;
  technicalControlExpiryDate: string;
  nextServiceKm: number;
  lastServiceDate: string;
}

export interface CashReconciliationDaily {
  id: string;
  date: string;
  branchId: string;
  reconciledBy: string;
  approvedBy?: string;
  expectedCash: number;
  expectedMoMo: number;
  expectedBank: number;
  expectedCredit: number;
  expectedTotal: number;
  actualCashCounted: number;
  actualMoMoCounted: number;
  actualBankCounted: number;
  actualTotalCounted: number;
  variance: number;
  discrepancyExplanation?: string;
  status: 'draft' | 'pending_approval' | 'reconciled' | 'disputed';
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: 'Fuel' | 'Salaries' | 'Vehicle Maintenance' | 'Warehouse Rent' | 'Utilities' | 'Insurance' | 'Marketing' | 'Internet & IT' | 'Equipment' | 'Miscellaneous';
  amount: number;
  description: string;
  paidTo: string;
  paidFrom: 'Cash Drawer' | 'Bank Account (BK)' | 'MoMo Corporate';
  approvedBy: string;
  receiptNumber: string;
  vehiclePlate?: string;
}

export interface ProfitAndLoss {
  period: string;
  grossRevenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  grossMarginPercent: number;
  operatingExpenses: {
    fuel: number;
    salaries: number;
    vehicleMaintenance: number;
    rent: number;
    utilities: number;
    insurance: number;
    marketing: number;
    other: number;
    totalExpenses: number;
  };
  netOperatingProfit: number;
  netMarginPercent: number;
}

export interface DemandForecastItem {
  productId: string;
  productName: string;
  brand: string;
  currentStockCrates: number;
  dailyRunRate: number;
  predicted7DayDemand: number;
  shortageRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedReorderCrates: number;
  urgencyDaysLeft: number;
  reasoning: string;
}

export interface FraudAnomalyAlert {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  description: string;
  involvedUser: string;
  estimatedRiskValueRWF: number;
  module: 'Inventory' | 'Sales' | 'Cash Reconciliation' | 'Crates' | 'Discounts';
  status: 'open' | 'investigating' | 'resolved';
}

export interface SmartAlert {
  id: string;
  category: 'inventory' | 'finance' | 'debt' | 'delivery' | 'crates' | 'fleet' | 'security';
  priority: 'critical' | 'high' | 'medium' | 'info';
  title: string;
  description: string;
  timestamp: string;
  actionLabel?: string;
  actionTarget?: string;
  read: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  targetEntity: string;
  targetId: string;
  previousValue: string;
  newValue: string;
  approvedBy?: string;
  ipAddress: string;
}

export interface SalespersonMetric {
  id: string;
  name: string;
  phone: string;
  territory: string;
  monthlyTargetRWF: number;
  actualRevenueRWF: number;
  achievementPercentage: number;
  collectionsRWF: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  cratesOwedByPortfolio: number;
}

export interface ConnectedDashboardEvent {
  id: string;
  timestamp: string;
  sourceRole: 'owner' | 'warehouse_manager' | 'accountant';
  sourceLabel: string;
  actionTitle: string;
  description: string;
  impactWarehouse?: string;
  impactFinance?: string;
  impactOwner?: string;
  status: 'synced' | 'pending_approval' | 'executed';
}

export interface ExecutiveApprovalItem {
  id: string;
  type: 'credit_overlimit' | 'bulk_po_release' | 'breakage_writeoff' | 'liquidity_sweep';
  title: string;
  entityName: string;
  referenceId: string;
  requestedByRole: 'accountant' | 'warehouse_manager';
  requestedByName: string;
  timestamp: string;
  amountRWF: number;
  cratesCount?: number;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  rationale: string;
  status: 'pending' | 'approved' | 'rejected';
  resolvedAt?: string;
  decisionNotes?: string;
}

export interface UnbilledGRN {
  id: string;
  grnNumber: string;
  poNumber: string;
  date: string;
  warehouseId: string;
  warehouseName: string;
  receivedBy: string;
  supplier: string;
  cratesReceived: number;
  estimatedAmountRWF: number;
  inputVatRWF: number;
  status: 'pending_invoice_match' | 'matched_posted' | 'disputed';
  invoiceReference?: string;
}

export interface UserCredentialProfile {
  id: string;
  role: UserRole;
  name: string;
  roleTitle: string;
  department: string;
  email: string;
  phone: string;
  pin: string;
  color: string;
  badge: string;
  avatar: string;
  portalHash: string;
  targetNav: string;
  securityScope: string;
  allowedNavs: string[];
}

export type PrivateRoleCredential = UserCredentialProfile;


