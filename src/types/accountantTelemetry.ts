// Telemetry and Financial Data Model for Independent Beverage Distributors

export interface AccountantManualTelemetry {
  distributorName: string;
  distributorTin: string;
  financialPeriod: string;
  periodStatus: 'OPEN' | 'CLOSING_IN_PROGRESS' | 'CLOSED';
  lastReconciledDate: string;

  // 8 Primary Prompt KPIs (RWF)
  totalSales: number;           // Prompt: RWF 84.2M
  cashCollected: number;        // Prompt: RWF 71.5M
  customerReceivables: number;  // Prompt: RWF 28.4M
  supplierPayables: number;     // Prompt: RWF 19.2M
  inventoryValue: number;       // Prompt: RWF 42.6M
  grossProfit: number;          // Prompt: RWF 18.7M
  operatingExpenses: number;     // Prompt: RWF 6.4M
  netProfit: number;            // Prompt: RWF 12.3M

  // Sales & Margins
  grossSales: number;
  salesDiscounts: number;
  salesReturns: number;
  netSales: number;
  cogsAmount: number;
  grossMarginPercent: number;

  // Multi-Supplier Breakdown
  bralirwaPurchased: number;    // Prompt: RWF 42,500,000
  bralirwaPaid: number;         // Prompt: RWF 35,000,000
  bralirwaOutstanding: number;  // Prompt: RWF 7,500,000
  packagingPayable: number;
  fuelPayable: number;
  maintenancePayable: number;
  officeSuppliesPayable: number;

  // Inventory Financials
  inventoryCost: number;
  inventorySalesValue: number;
  potentialGrossProfit: number;
  inventoryTurnoverRatio: number;
  damagedStockValue: number;
  expiredStockValue: number;

  // Cash & Bank
  openingCash: number;
  cashSales: number;
  customerCollectionsCash: number;
  expensesPaidInCash: number;
  cashDepositedToBank: number;
  closingCashSystem: number;
  physicalCashCounted: number;
  cashVariance: number;
  cashReconStatus: 'BALANCED' | 'MINOR_VARIANCE' | 'INVESTIGATING';
  cashVarianceExplanation: string;

  bankBKBalance: number;
  bankBKLabel: string;
  bankBKUnreconciled: number;
  equityEscrowBalance: number;
  equityEscrowLabel: string;
  momoBalance: number;
  momoLabel: string;
  imClearingBalance: number;
  imClearingLabel: string;
  totalLiquidCash: number;

  // Fleet & Logistics Spend
  monthlyDeliveryCost: number;
  costPerDelivery: number;
  costPerRoute: number;
  costPerVehicle: number;
  fuelTotalCost: number;
  driverPaymentsCost: number;
  fleetMaintenanceCost: number;

  // Tax Management
  vatRatePercent: number;
  whtRatePercent: number;
  taxableSales: number;
  outputTax: number;
  taxablePurchases: number;
  inputTax: number;
  netTaxPayable: number;

  // General Ledger & Balance Sheet
  generalLedgerBalanced: boolean;
  totalDebitsCreditsText: string;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  balanceSheetBalanced: boolean;

  // OpEx Breakdown
  opexFuel: number;
  opexSalaries: number;
  opexRent: number;
  opexMaintenance: number;
  opexUtilities: number;
  opexTransport: number;
  opexMarketing: number;
  opexOther: number;

  // Audit Details
  leadAccountantName: string;
  cpaRegistration: string;
  shiftRemarks: string;
  lastEditedText: string;
  lastEditedTimestamp: string;

  // Compatibility aliases for ExecutiveDashboard
  status: 'BALANCED' | 'IN_REVIEW' | 'FLAGGED';
  vaultCashBalance: number;
  vaultCashLabel: string;
  escrowBalance: number;
  escrowLabel: string;
  expectedRevenue: number;
  actualCashCounted: number;
  actualMoMoCounted: number;
  actualBankCounted: number;
  actualTotalCounted: number;
  reconVariance: number;
  reconStatus: 'reconciled' | 'pending_approval' | 'disputed';
  reconExplanation: string;
  reconciledByName: string;
  grossRevenueMTD: number;
  cogsMTD: number;
  grossProfitMTD: number;
  totalOpexMTD: number;
  netEbitdaMTD: number;
  netMarginPercent: number;
  totalTradeDebt: number;
  overdueDebt30Days: number;
  highRiskDebtorsCount: number;
  badDebtProvision: number;
  dsoAverageDays: number;
  taxableTurnoverBox01: number;
  outputVatBox02: number;
  allowablePurchasesBox03: number;
  inputVatBox04: number;
  netVatPayableBox05: number;
}

export const DEFAULT_ACCOUNTANT_TELEMETRY: AccountantManualTelemetry = {
  distributorName: 'ABC Beverages Distribution Ltd.',
  distributorTin: '109844219',
  financialPeriod: 'October 2026',
  periodStatus: 'OPEN',
  lastReconciledDate: '2026-10-01 18:00',

  // 8 Primary Prompt KPIs (Exact figures from prompt)
  totalSales: 84200000,          // RWF 84.2M
  cashCollected: 71500000,       // RWF 71.5M
  customerReceivables: 28400000, // RWF 28.4M
  supplierPayables: 19200000,    // RWF 19.2M
  inventoryValue: 42600000,      // RWF 42.6M
  grossProfit: 18700000,         // RWF 18.7M
  operatingExpenses: 6400000,    // RWF 6.4M
  netProfit: 12300000,           // RWF 12.3M

  // Sales & Margins
  grossSales: 86400000,
  salesDiscounts: 1500000,
  salesReturns: 700000,
  netSales: 84200000,
  cogsAmount: 65500000,
  grossMarginPercent: 22.2,

  // Multi-Supplier Breakdown
  bralirwaPurchased: 42500000,   // Prompt: RWF 42.5M
  bralirwaPaid: 35000000,        // Prompt: RWF 35.0M
  bralirwaOutstanding: 7500000,  // Prompt: RWF 7.5M
  packagingPayable: 3400000,
  fuelPayable: 4200000,
  maintenancePayable: 2600000,
  officeSuppliesPayable: 1500000,

  // Inventory Financials
  inventoryCost: 42600000,
  inventorySalesValue: 54800000,
  potentialGrossProfit: 12200000,
  inventoryTurnoverRatio: 4.2,
  damagedStockValue: 850000,
  expiredStockValue: 0,

  // Cash & Bank
  openingCash: 5200000,
  cashSales: 38400000,
  customerCollectionsCash: 33100000,
  expensesPaidInCash: 1200000,
  cashDepositedToBank: 68000000,
  closingCashSystem: 7500000,
  physicalCashCounted: 7250000,
  cashVariance: -250000,
  cashReconStatus: 'MINOR_VARIANCE',
  cashVarianceExplanation: 'Late route return float from Rwamagana route #3 being verified.',

  bankBKBalance: 42800000,
  bankBKLabel: 'Bank of Kigali Operating Acc (00040-1288)',
  bankBKUnreconciled: 850000,
  equityEscrowBalance: 18500000,
  equityEscrowLabel: 'Equity Bank - BRALIRWA Escrow LC',
  momoBalance: 7200000,
  momoLabel: 'MTN MoMo Pay Merchant (Code: 849201)',
  imClearingBalance: 3000000,
  imClearingLabel: 'I&M Bank Float & Clearing',
  totalLiquidCash: 71500000,

  // Fleet & Logistics Spend
  monthlyDeliveryCost: 4120000,
  costPerDelivery: 18500,
  costPerRoute: 44000,
  costPerVehicle: 1030000,
  fuelTotalCost: 2450000,
  driverPaymentsCost: 1100000,
  fleetMaintenanceCost: 570000,

  // Tax Management
  vatRatePercent: 18,
  whtRatePercent: 3,
  taxableSales: 71355932,
  outputTax: 12844068,
  taxablePurchases: 55508475,
  inputTax: 9991525,
  netTaxPayable: 2852543,

  // General Ledger & Balance Sheet
  generalLedgerBalanced: true,
  totalDebitsCreditsText: 'RWF 142,500,000 (Balanced)',
  totalAssets: 156400000,
  totalLiabilities: 47600000,
  totalEquity: 108800000,
  balanceSheetBalanced: true,

  // OpEx Breakdown
  opexFuel: 2450000,
  opexSalaries: 2200000,
  opexRent: 800000,
  opexMaintenance: 570000,
  opexUtilities: 180000,
  opexTransport: 100000,
  opexMarketing: 50000,
  opexOther: 50000,

  // Audit Details
  leadAccountantName: 'Jean-Paul Habimana, CPA',
  cpaRegistration: 'ICPAR/2021/0492',
  shiftRemarks: 'Monthly reconciliation active. Synchronized with Emmanuel (Owner).',
  lastEditedText: 'Accountant Verified',
  lastEditedTimestamp: 'Today at 09:30 AM',

  // Compatibility aliases
  status: 'BALANCED',
  vaultCashBalance: 7250000,
  vaultCashLabel: 'Depot Safe & Cashier Vault',
  escrowBalance: 18500000,
  escrowLabel: 'Equity Escrow LC',
  expectedRevenue: 84200000,
  actualCashCounted: 7250000,
  actualMoMoCounted: 7200000,
  actualBankCounted: 42800000,
  actualTotalCounted: 71500000,
  reconVariance: -250000,
  reconStatus: 'reconciled',
  reconExplanation: 'Rwamagana route return float verified',
  reconciledByName: 'Jean-Paul Habimana, CPA',
  grossRevenueMTD: 84200000,
  cogsMTD: 65500000,
  grossProfitMTD: 18700000,
  totalOpexMTD: 6400000,
  netEbitdaMTD: 12300000,
  netMarginPercent: 14.6,
  totalTradeDebt: 28400000,
  overdueDebt30Days: 11200000,
  highRiskDebtorsCount: 3,
  badDebtProvision: 850000,
  dsoAverageDays: 14.2,
  taxableTurnoverBox01: 71355932,
  outputVatBox02: 12844068,
  allowablePurchasesBox03: 55508475,
  inputVatBox04: 9991525,
  netVatPayableBox05: 2852543
};
