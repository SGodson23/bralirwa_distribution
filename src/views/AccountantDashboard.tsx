import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scale,
  Landmark,
  Receipt,
  FileSpreadsheet,
  BadgePercent,
  CreditCard,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Search,
  Plus,
  X,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  TrendingUp,
  TrendingDown,
  Layers,
  ChevronRight,
  PenSquare,
  Save,
  RotateCcw,
  DollarSign,
  AlertTriangle,
  Lock,
  Unlock,
  Wallet,
  Calendar,
  Clock,
  ArrowRight,
  Sliders,
  Sparkles,
  Eye,
  RefreshCw,
  FileText,
  CheckSquare,
  Send,
  Building,
  AlertCircle,
  Truck,
  Package,
  ShoppingCart,
  Users,
  ArrowLeftRight,
  Shield,
  Download,
  Filter,
  BarChart3,
  Coins,
  Database
} from 'lucide-react';
import { ExpenseRecord, Customer, Product, Vehicle } from '../types';
import { AccountantManualTelemetry, DEFAULT_ACCOUNTANT_TELEMETRY } from '../types/accountantTelemetry';

// Re-export for any modules expecting them here
export type { AccountantManualTelemetry };
export { DEFAULT_ACCOUNTANT_TELEMETRY };

export const AccountantDashboard: React.FC = () => {
  const {
    currentUser,
    salesOrders,
    inventory,
    customers,
    products,
    vehicles,
    expenses,
    addExpense,
    addAuditLog,
    addConnectedEvent,
    showToast,
    setCurrentNav,
    submitCashReconciliation
  } = useApp();

  // Primary Telemetry State (Persisted in localStorage for cross-portal live sync)
  const [telemetry, setTelemetry] = useState<AccountantManualTelemetry>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kbl_accountant_telemetry');
      if (saved) {
        try {
          return { ...DEFAULT_ACCOUNTANT_TELEMETRY, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Failed to parse accountant telemetry', e);
        }
      }
    }
    return DEFAULT_ACCOUNTANT_TELEMETRY;
  });

  // Manual Data Entry Studio Modal State
  const [isEditingStudioOpen, setIsEditingStudioOpen] = useState(false);
  const [draftTelemetry, setDraftTelemetry] = useState<AccountantManualTelemetry>(telemetry);
  const [activeStudioTab, setActiveStudioTab] = useState<'kpis' | 'revenue' | 'suppliers' | 'inventory' | 'cash_bank' | 'opex' | 'taxes'>('kpis');

  // Navigation & Timeframes
  const [mainTab, setMainTab] = useState<
    | 'overview'
    | 'sales_revenue'
    | 'receivables'
    | 'payables'
    | 'bralirwa_purchases'
    | 'inventory_value'
    | 'cash_management'
    | 'bank_management'
    | 'expenses'
    | 'delivery_fleet'
    | 'profitability'
    | 'tax_management'
    | 'financial_statements'
    | 'general_ledger'
    | 'reports'
  >('overview');
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual'>('Monthly');

  // Action Modals State
  const [isCustomerPaymentModalOpen, setIsCustomerPaymentModalOpen] = useState(false);
  const [isSupplierPaymentModalOpen, setIsSupplierPaymentModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isCreateJournalModalOpen, setIsCreateJournalModalOpen] = useState(false);
  const [isStatementPreviewOpen, setIsStatementPreviewOpen] = useState(false);
  const [statementCustomer, setStatementCustomer] = useState<string>('ABC Bar & Grill');
  const [isPeriodCloseModalOpen, setIsPeriodCloseModalOpen] = useState(false);

  // Form Fields
  const [paymentCustomer, setPaymentCustomer] = useState('ABC Bar & Grill');
  const [paymentAmount, setPaymentAmount] = useState<number>(1500000);
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer (BK)' | 'MTN MoMo Pay' | 'Depot Cash'>('Bank Transfer (BK)');

  const [supplierName, setSupplierName] = useState('BRALIRWA PLC');
  const [supplierAmount, setSupplierAmount] = useState<number>(7500000);

  const [expenseCategory, setExpenseCategory] = useState<ExpenseRecord['category']>('Fuel');
  const [expenseAmount, setExpenseAmount] = useState<number>(350000);
  const [expenseVendor, setExpenseVendor] = useState('SP Rwanda Ltd');
  const [expenseDesc, setExpenseDesc] = useState('Diesel refill - Truck RAD 412 B');

  const [journalDebitAcc, setJournalDebitAcc] = useState('1200 - Accounts Receivable');
  const [journalCreditAcc, setJournalCreditAcc] = useState('4000 - Commercial Beverage Sales');
  const [journalAmount, setJournalAmount] = useState<number>(2400000);
  const [journalRef, setJournalRef] = useState('JV-2026-10-09');

  const [alertsDismissed, setAlertsDismissed] = useState<string[]>([]);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  // Keep synchronized with Owner / Executive Dashboard
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kbl_accountant_telemetry' && e.newValue) {
        try {
          setTelemetry(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Format currency helpers
  const formatRwf = (val: number) => `RWF ${Math.round(val).toLocaleString()}`;
  const formatMillions = (val: number) => `RWF ${(val / 1000000).toFixed(1)}M`;

  // Save changes from Manual Studio
  const handleSaveAndSync = () => {
    const derivedNetProfit = draftTelemetry.grossProfit - draftTelemetry.operatingExpenses;
    const updated: AccountantManualTelemetry = {
      ...draftTelemetry,
      netProfit: derivedNetProfit,
      netEbitdaMTD: derivedNetProfit,
      totalLiquidCash: draftTelemetry.cashCollected,
      totalTradeDebt: draftTelemetry.customerReceivables,
      lastEditedTimestamp: 'Just now',
      lastEditedText: `Edited by ${currentUser?.name || 'Senior Accountant'}`
    };

    setTelemetry(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kbl_accountant_telemetry', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }

    addConnectedEvent({
      sourceRole: 'accountant',
      sourceLabel: 'Senior Accountant Command',
      actionTitle: 'Financial Figures Synchronized',
      description: `Books published by ${currentUser?.name || 'Accountant'}. Net Sales: ${formatMillions(updated.totalSales)}, Net Profit: ${formatMillions(updated.netProfit)}.`,
      impactFinance: 'Real-time P&L updated',
      impactOwner: 'Executive metrics synchronized',
      status: 'synced'
    });

    addAuditLog(
      'UPDATE',
      'FINANCIAL_TELEMETRY',
      'DISTRIBUTOR-FIN-2026-10',
      'Previous Telemetry',
      `Net Sales: ${formatMillions(updated.totalSales)}, Net Profit: ${formatMillions(updated.netProfit)}`
    );

    showToast('Financial figures saved and synchronized with Owner Dashboard!');
    setIsEditingStudioOpen(false);
  };

  // Reset to Baseline
  const handleResetDefaults = () => {
    setDraftTelemetry(DEFAULT_ACCOUNTANT_TELEMETRY);
    setTelemetry(DEFAULT_ACCOUNTANT_TELEMETRY);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kbl_accountant_telemetry', JSON.stringify(DEFAULT_ACCOUNTANT_TELEMETRY));
      window.dispatchEvent(new Event('storage'));
    }
    showToast('Reset financial figures to standard ERP baseline.');
  };

  // Record Customer Payment
  const handleRecordCustomerPayment = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      showToast('Please enter a valid payment amount');
      return;
    }
    setTelemetry(prev => {
      const newCash = prev.cashCollected + paymentAmount;
      const newAR = Math.max(0, prev.customerReceivables - paymentAmount);
      const updated = { ...prev, cashCollected: newCash, customerReceivables: newAR, totalTradeDebt: newAR };
      if (typeof window !== 'undefined') {
        localStorage.setItem('kbl_accountant_telemetry', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      }
      return updated;
    });

    addAuditLog('CREATE', 'CUSTOMER_PAYMENT', paymentCustomer, 'Unpaid', `Payment of ${formatRwf(paymentAmount)} recorded via ${paymentMethod}`);
    showToast(`Payment of ${formatRwf(paymentAmount)} recorded for ${paymentCustomer}!`);
    setIsCustomerPaymentModalOpen(false);
  };

  // Record Supplier Payment
  const handleRecordSupplierPayment = () => {
    if (!supplierAmount || supplierAmount <= 0) {
      showToast('Please enter a valid amount');
      return;
    }
    setTelemetry(prev => {
      const newAP = Math.max(0, prev.supplierPayables - supplierAmount);
      const newBralirwaPaid = supplierName.includes('BRALIRWA') ? prev.bralirwaPaid + supplierAmount : prev.bralirwaPaid;
      const newBralirwaOut = supplierName.includes('BRALIRWA') ? Math.max(0, prev.bralirwaPurchased - newBralirwaPaid) : prev.bralirwaOutstanding;
      const updated = { ...prev, supplierPayables: newAP, bralirwaPaid: newBralirwaPaid, bralirwaOutstanding: newBralirwaOut };
      if (typeof window !== 'undefined') {
        localStorage.setItem('kbl_accountant_telemetry', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      }
      return updated;
    });

    addAuditLog('CREATE', 'SUPPLIER_PAYMENT', supplierName, 'Due', `Payment of ${formatRwf(supplierAmount)} posted`);
    showToast(`Disbursement of ${formatRwf(supplierAmount)} to ${supplierName} posted!`);
    setIsSupplierPaymentModalOpen(false);
  };

  // Add Expense
  const handleAddExpense = () => {
    if (!expenseAmount || expenseAmount <= 0) {
      showToast('Please enter an expense amount');
      return;
    }
    addExpense({
      date: new Date().toISOString().split('T')[0],
      category: expenseCategory,
      description: expenseDesc,
      amount: expenseAmount,
      paidTo: expenseVendor,
      paidFrom: 'Bank Account (BK)',
      approvedBy: currentUser?.name || 'Jean-Paul Habimana, CPA',
      receiptNumber: 'REC-' + Date.now().toString().slice(-5)
    });

    setTelemetry(prev => {
      const newOpex = prev.operatingExpenses + expenseAmount;
      const newProfit = prev.grossProfit - newOpex;
      const updated = { ...prev, operatingExpenses: newOpex, netProfit: newProfit, totalOpexMTD: newOpex, netEbitdaMTD: newProfit };
      if (typeof window !== 'undefined') {
        localStorage.setItem('kbl_accountant_telemetry', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      }
      return updated;
    });

    showToast(`Expense of ${formatRwf(expenseAmount)} added for ${expenseCategory}!`);
    setIsAddExpenseModalOpen(false);
  };

  // Post Journal
  const handlePostJournal = () => {
    if (!journalAmount || journalAmount <= 0) {
      showToast('Please enter an amount');
      return;
    }
    addAuditLog('CREATE', 'JOURNAL_ENTRY', journalRef, 'Draft', `Debit ${journalDebitAcc}: ${formatRwf(journalAmount)}, Credit ${journalCreditAcc}`);
    showToast(`Journal voucher ${journalRef} posted successfully!`);
    setIsCreateJournalModalOpen(false);
  };

  // Period Lock / Unlock
  const handleClosePeriod = () => {
    setTelemetry(prev => {
      const updated = { ...prev, periodStatus: 'CLOSED' as const };
      if (typeof window !== 'undefined') {
        localStorage.setItem('kbl_accountant_telemetry', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      }
      return updated;
    });
    addAuditLog('EXECUTE', 'ACCOUNTING_PERIOD', telemetry.financialPeriod, 'OPEN', 'CLOSED');
    showToast(`Period ${telemetry.financialPeriod} locked.`);
    setIsPeriodCloseModalOpen(false);
  };

  const handleReopenPeriod = () => {
    setTelemetry(prev => {
      const updated = { ...prev, periodStatus: 'OPEN' as const };
      if (typeof window !== 'undefined') {
        localStorage.setItem('kbl_accountant_telemetry', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      }
      return updated;
    });
    showToast(`Period ${telemetry.financialPeriod} reopened.`);
  };

  // Financial Alerts
  const financialAlerts = [
    { id: 'a1', text: '12 customer invoices are overdue (Total: RWF 11.2M)', severity: 'high', tab: 'receivables' as const },
    { id: 'a2', text: 'BRALIRWA payable of RWF 7,500,000 is due in 4 days', severity: 'high', tab: 'bralirwa_purchases' as const },
    { id: 'a3', text: 'Cash variance of RWF 250,000 detected between physical count and records', severity: 'medium', tab: 'cash_management' as const },
    { id: 'a4', text: 'Bank reconciliation has 8 unmatched transactions on Bank of Kigali', severity: 'medium', tab: 'bank_management' as const },
    { id: 'a5', text: 'Customer ABC Bar has exceeded its credit limit (Balance: RWF 4.2M / Limit: 4.0M)', severity: 'high', tab: 'receivables' as const },
    { id: 'a6', text: 'Inventory worth RWF 850,000 has been marked damaged during unloading', severity: 'low', tab: 'inventory_value' as const }
  ];
  const activeAlerts = financialAlerts.filter(a => !alertsDismissed.includes(a.id));

  // Multi-Supplier Payables Mock Table
  const supplierPayables = [
    { name: 'BRALIRWA PLC', cat: 'Primary Beverage', inv: 'BRAL-INV-9812', po: 'PO-104', due: '2026-10-06', amount: 42500000, paid: 35000000, out: 7500000, status: 'DUE IN 4 DAYS' },
    { name: 'Rwanda Packaging & Crates Ltd', cat: 'Packaging & Glass', inv: 'RPC-INV-4410', po: 'PO-098', due: '2026-10-14', amount: 4800000, paid: 1400000, out: 3400000, status: 'CURRENT' },
    { name: 'SP Rwanda Ltd', cat: 'Fleet Fuel', inv: 'SP-DSL-88219', po: 'PO-109', due: '2026-10-09', amount: 4200000, paid: 0, out: 4200000, status: 'DUE SOON' },
    { name: 'Rwanda Motors Ltd', cat: 'Fleet Maintenance', inv: 'RWM-SVC-204', po: 'PO-102', due: '2026-09-28', amount: 2600000, paid: 0, out: 2600000, status: 'OVERDUE' },
    { name: 'Kigali Tech Supplies', cat: 'Depot Office', inv: 'KTO-INV-1102', po: 'PO-111', due: '2026-10-22', amount: 1500000, paid: 0, out: 1500000, status: 'CURRENT' }
  ];

  // Customer Receivables Table
  const customerDebtors = [
    { name: 'ABC Bar & Grill', type: 'Bar', inv: 'INV-4412', date: '12-Sep', due: '26-Sep', amount: 4200000, paid: 0, bal: 4200000, days: 6, status: 'OVERDUE 30D', limit: 4000000 },
    { name: 'Kigali Serena Hotel', type: 'Hotel', inv: 'INV-4480', date: '25-Sep', due: '09-Oct', amount: 6800000, paid: 2000000, bal: 4800000, days: 0, status: 'DUE THIS WEEK', limit: 12000000 },
    { name: 'Simba Supermarket Kimihurura', type: 'Supermarket', inv: 'INV-4510', date: '28-Sep', due: '02-Oct', amount: 5400000, paid: 0, bal: 5400000, days: 0, status: 'DUE TODAY', limit: 8000000 },
    { name: 'Inka Steakhouse', type: 'Restaurant', inv: 'INV-4320', date: '14-Aug', due: '28-Aug', amount: 3200000, paid: 500000, bal: 2700000, days: 35, status: 'OVERDUE 30D', limit: 3000000 },
    { name: 'Nyamirambo Wholesaler', type: 'Wholesaler', inv: 'INV-4210', date: '20-Jul', due: '03-Aug', amount: 8500000, paid: 3000000, bal: 5500000, days: 60, status: 'OVERDUE 60D', limit: 10000000 },
    { name: 'Chez Lando Bistro', type: 'Bar', inv: 'INV-4100', date: '10-Jun', due: '24-Jun', amount: 5800000, paid: 0, bal: 5800000, days: 100, status: 'OVERDUE 90D', limit: 5000000 }
  ];

  // Fleet Costs
  const fleetVehicles = [
    { plate: 'RAD 412 B', model: 'Isuzu Forward 10T', driver: 'Emmanuel Nshuti', fuel: 980000, maint: 320000, total: 1420000, crates: 4200, costPerCrate: 338 },
    { plate: 'RAC 889 K', model: 'Fuso Canter 5T', driver: 'Claude Bizimana', fuel: 690000, maint: 150000, total: 1080000, crates: 3100, costPerCrate: 348 },
    { plate: 'RAE 521 M', model: 'Isuzu NPR 4T', driver: 'Alex Hakizimana', fuel: 460000, maint: 50000, total: 890000, crates: 2400, costPerCrate: 370 },
    { plate: 'RAA 310 P', model: 'Toyota Dyna 3T', driver: 'Jean Bosco Mugisha', fuel: 320000, maint: 0, total: 730000, crates: 1950, costPerCrate: 374 }
  ];

  // Customer Profitability Table
  const customerProfitability = [
    { name: 'ABC Bar & Grill', rev: 2500000, cogs: 1700000, gp: 800000, delivery: 120000, other: 50000, net: 630000, margin: 25.2 },
    { name: 'Kigali Serena Hotel', rev: 8400000, cogs: 6300000, gp: 2100000, delivery: 280000, other: 120000, net: 1700000, margin: 20.2 },
    { name: 'Simba Supermarket', rev: 9600000, cogs: 7680000, gp: 1920000, delivery: 310000, other: 90000, net: 1520000, margin: 15.8 },
    { name: 'Inka Steakhouse', rev: 3800000, cogs: 2850000, gp: 950000, delivery: 140000, other: 60000, net: 750000, margin: 19.7 },
    { name: 'Nyamirambo Wholesaler', rev: 16500000, cogs: 13860000, gp: 2640000, delivery: 450000, other: 150000, net: 2040000, margin: 12.3 }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070F21',
        color: '#FFFFFF',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '80px'
      }}
    >
      {/* ========================================================================= */}
      {/* 1. ULTRA-PREMIUM EXECUTIVE HEADER                                         */}
      {/* ========================================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(8, 21, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '16px 28px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Left: Distributor Branding & Tenant Scope */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#08152E',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Building2 size={24} color="#34D399" />
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  border: '2px solid #08152E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1
                  style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    margin: 0
                  }}
                >
                  {telemetry.distributorName}
                </h1>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34D399',
                    border: '1px solid rgba(16, 185, 129, 0.35)'
                  }}
                >
                  Independent Distributor
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#94A3B8',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  TIN: {telemetry.distributorTin}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
                  <Calendar size={14} color="#34D399" />
                  Fiscal Period: <strong style={{ color: '#FFFFFF', fontWeight: 700 }}>{telemetry.financialPeriod}</strong>
                </span>
                <span style={{ color: '#64748B' }}>•</span>
                <span>
                  {telemetry.periodStatus === 'OPEN' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#34D399', fontWeight: 600 }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34D399' }} />
                      Books Open
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#FBBF24', fontWeight: 600 }}>
                      <Lock size={13} color="#FBBF24" />
                      Period Closed & Certified
                    </span>
                  )}
                </span>
                <span style={{ color: '#64748B' }}>•</span>
                <span>
                  Depot: <span style={{ fontFamily: 'monospace', color: '#E2E8F0' }}>KGL-CENTRAL-01</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Controls & Manual Data Entry Studio Launcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Timeframe Selector */}
            <div
              style={{
                backgroundColor: 'rgba(11, 23, 51, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '3px',
                display: 'flex',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              {(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: timeframe === tf ? '#10B981' : 'transparent',
                    color: timeframe === tf ? '#04151F' : '#94A3B8',
                    fontWeight: timeframe === tf ? 800 : 500
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Financial Alerts Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(11, 23, 51, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#CBD5E1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  position: 'relative'
                }}
                title="Financial Alerts"
              >
                <AlertTriangle size={15} color="#FBBF24" />
                {activeAlerts.length > 0 && (
                  <span
                    style={{
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '10px'
                    }}
                  >
                    {activeAlerts.length}
                  </span>
                )}
              </button>

              {isAlertsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '8px',
                    width: '340px',
                    backgroundColor: '#091938',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                    padding: '16px',
                    zIndex: 100
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Financial Risk Center ({activeAlerts.length})
                    </span>
                    <button
                      onClick={() => setIsAlertsOpen(false)}
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto' }}>
                    {activeAlerts.map(alert => (
                      <div
                        key={alert.id}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          fontSize: '11.5px',
                          backgroundColor: alert.severity === 'high' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          border: alert.severity === 'high' ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
                          color: '#FFFFFF'
                        }}
                      >
                        <p style={{ margin: '0 0 6px 0' }}>{alert.text}</p>
                        <button
                          onClick={() => {
                            setMainTab(alert.tab);
                            setIsAlertsOpen(false);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#38BDF8',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          Resolve & View →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accountant Profile Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(11, 23, 51, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: '12px'
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  backgroundColor: '#10B981',
                  color: '#04151F',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px'
                }}
              >
                JH
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{telemetry.leadAccountantName}</div>
                <div style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>{telemetry.cpaRegistration}</div>
              </div>
            </div>

            {/* Period Lock / Reopen Button */}
            {telemetry.periodStatus === 'OPEN' ? (
              <button
                onClick={() => setIsPeriodCloseModalOpen(true)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(11, 23, 51, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#E2E8F0',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Lock size={13} color="#FBBF24" />
                <span>Close Period</span>
              </button>
            ) : (
              <button
                onClick={handleReopenPeriod}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.18)',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  color: '#FBBF24',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Unlock size={13} color="#FBBF24" />
                <span>Reopen Period</span>
              </button>
            )}

            {/* MANUAL DATA ENTRY STUDIO LAUNCHER (PRIMARY BUTTON) */}
            <button
              onClick={() => {
                setDraftTelemetry(telemetry);
                setIsEditingStudioOpen(true);
              }}
              style={{
                padding: '9px 18px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                letterSpacing: '-0.01em',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <PenSquare size={16} />
              <span>Manual Data Entry Studio</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FROSTED GLASS QUICK ACTIONS BAR                                        */}
      {/* ========================================================================= */}
      <div
        style={{
          backgroundColor: 'rgba(9, 23, 51, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '10px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          overflowX: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#94A3B8', whiteSpace: 'nowrap' }}>
          <Coins size={15} color="#34D399" />
          <span>Quick Accounting Actions:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => setIsCustomerPaymentModalOpen(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#A7F3D0',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={13} /> Record Customer Payment
          </button>

          <button
            onClick={() => {
              showToast('Opening Commercial Invoicing Engine...');
              setCurrentNav('orders');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#BAE6FD',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={13} /> Create Invoice
          </button>

          <button
            onClick={() => setIsAddExpenseModalOpen(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#FECDD3',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={13} /> Add Expense
          </button>

          <button
            onClick={() => setIsSupplierPaymentModalOpen(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              color: '#E9D5FF',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CreditCard size={13} /> Record Supplier Payment
          </button>

          <button
            onClick={() => setIsCreateJournalModalOpen(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              color: '#A5F3FC',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileSpreadsheet size={13} /> Create Journal
          </button>

          <button
            onClick={() => setMainTab('bank_management')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Landmark size={13} color="#38BDF8" /> Reconcile Bank
          </button>

          <button
            onClick={() => setMainTab('reports')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={13} color="#34D399" /> Financial Reports
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. THE 8 CORE PRIMARY KPI CARDS (PROMPT REQUIRED EXACT METRICS)           */}
      {/* ========================================================================= */}
      <section style={{ padding: '24px 28px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <h2 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFFFFF', margin: 0 }}>
              Financial Command Overview — 8 Core Pillars
            </h2>
          </div>
          <span style={{ fontSize: '11.5px', color: '#94A3B8', fontFamily: 'monospace' }}>
            Double-Entry Certified: <strong style={{ color: '#34D399', fontWeight: 800 }}>{telemetry.totalDebitsCreditsText}</strong>
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}
        >
          {/* 1. TOTAL SALES: RWF 84.2M */}
          <div
            className="executive-kpi-card"
            style={{
              borderTop: '3px solid #38BDF8',
              background: 'linear-gradient(145deg, rgba(14, 38, 77, 0.9) 0%, rgba(8, 20, 42, 0.95) 100%)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#7DD3FC', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingCart size={15} color="#38BDF8" /> TOTAL SALES
              </span>
              <button
                onClick={() => {
                  setDraftTelemetry(telemetry);
                  setActiveStudioTab('revenue');
                  setIsEditingStudioOpen(true);
                }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                title="Edit Total Sales"
              >
                <PenSquare size={14} color="#38BDF8" />
              </button>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', margin: '4px 0' }}>
              {formatMillions(telemetry.totalSales)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '8px' }}>
              <span style={{ color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ArrowUpRight size={14} /> +14.2% vs target
              </span>
              <span style={{ fontFamily: 'monospace', color: '#94A3B8' }}>{formatRwf(telemetry.totalSales)}</span>
            </div>
          </div>

          {/* 2. CASH COLLECTED: RWF 71.5M */}
          <div
            className="executive-kpi-card"
            style={{
              borderTop: '3px solid #10B981',
              background: 'linear-gradient(145deg, rgba(13, 44, 42, 0.85) 0%, rgba(8, 20, 42, 0.95) 100%)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#A7F3D0', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Coins size={15} color="#10B981" /> CASH COLLECTED
              </span>
              <button
                onClick={() => {
                  setDraftTelemetry(telemetry);
                  setActiveStudioTab('cash_bank');
                  setIsEditingStudioOpen(true);
                }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                title="Edit Cash Collected"
              >
                <PenSquare size={14} color="#10B981" />
              </button>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#34D399', letterSpacing: '-0.02em', margin: '4px 0' }}>
              {formatMillions(telemetry.cashCollected)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '8px' }}>
              <span style={{ color: '#34D399', fontWeight: 700 }}>
                {((telemetry.cashCollected / telemetry.totalSales) * 100).toFixed(1)}% Collection Rate
              </span>
              <span style={{ fontFamily: 'monospace', color: '#94A3B8' }}>{formatRwf(telemetry.cashCollected)}</span>
            </div>
          </div>

          {/* 3. CUSTOMER RECEIVABLES: RWF 28.4M */}
          <div
            className="executive-kpi-card"
            style={{
              borderTop: '3px solid #F59E0B',
              background: 'linear-gradient(145deg, rgba(46, 34, 14, 0.85) 0%, rgba(8, 20, 42, 0.95) 100%)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#FDE68A', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={15} color="#F59E0B" /> CUSTOMER RECEIVABLES
              </span>
              <button
                onClick={() => {
                  setDraftTelemetry(telemetry);
                  setActiveStudioTab('kpis');
                  setIsEditingStudioOpen(true);
                }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                title="Edit Receivables"
              >
                <PenSquare size={14} color="#F59E0B" />
              </button>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#FBBF24', letterSpacing: '-0.02em', margin: '4px 0' }}>
              {formatMillions(telemetry.customerReceivables)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '8px' }}>
              <span style={{ color: '#FBBF24', fontWeight: 700 }}>
                {formatMillions(telemetry.overdueDebt30Days)} Overdue (30d+)
              </span>
              <button
                onClick={() => setMainTab('receivables')}
                style={{ background: 'none', border: 'none', color: '#38BDF8', cursor: 'pointer', fontWeight: 700, padding: 0 }}
              >
                Inspect AR →
              </button>
            </div>
          </div>

          {/* 4. SUPPLIER PAYABLES: RWF 19.2M */}
          <div
            className="executive-kpi-card"
            style={{
              borderTop: '3px solid #A855F7',
              background: 'linear-gradient(145deg, rgba(38, 18, 56, 0.85) 0%, rgba(8, 20, 42, 0.95) 100%)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#E9D5FF', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={15} color="#A855F7" /> SUPPLIER PAYABLES
              </span>
              <button
                onClick={() => {
                  setDraftTelemetry(telemetry);
                  setActiveStudioTab('suppliers');
                  setIsEditingStudioOpen(true);
                }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                title="Edit Payables"
              >
                <PenSquare size={14} color="#A855F7" />
              </button>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#C084FC', letterSpacing: '-0.02em', margin: '4px 0' }}>
              {formatMillions(telemetry.supplierPayables)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '8px' }}>
              <span style={{ color: '#E9D5FF', fontWeight: 700 }}>
                BRALIRWA: {formatMillions(telemetry.bralirwaOutstanding)}
              </span>
              <span style={{ color: '#94A3B8' }}>4 Other Vendors</span>
            </div>
          </div>

          {/* 5. INVENTORY VALUE: RWF 42.6M */}
          <div
            className="executive-kpi-card"
            style={{
              borderTop: '3px solid #06B6D4',
              background: 'linear-gradient(145deg, rgba(10, 36, 56, 0.85) 0%, rgba(8, 20, 42, 0.95) 100%)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#A5F3FC', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Package size={15} color="#06B6D4" /> INVENTORY VALUE
              </span>
              <button
                onClick={() => {
                  setDraftTelemetry(telemetry);
                  setActiveStudioTab('inventory');
                  setIsEditingStudioOpen(true);
                }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                title="Edit Inventory"
              >
                <PenSquare size={14} color="#06B6D4" />
              </button>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#22D3EE', letterSpacing: '-0.02em', margin: '4px 0' }}>
              {formatMillions(telemetry.inventoryValue)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '8px' }}>
              <span style={{ color: '#22D3EE', fontWeight: 700 }}>
                Turnover: {telemetry.inventoryTurnoverRatio}x / mo
              </span>
              <span style={{ color: '#94A3B8' }}>Sales: {formatMillions(telemetry.inventorySalesValue)}</span>
            </div>
          </div>

          {/* 6. GROSS PROFIT: RWF 18.7M */}
          <div
            className="executive-kpi-card"
            style={{
              borderTop: '3px solid #14B8A6',
              background: 'linear-gradient(145deg, rgba(12, 42, 46, 0.85) 0%, rgba(8, 20, 42, 0.95) 100%)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#99F6E4', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={15} color="#14B8A6" /> GROSS PROFIT
              </span>
              <button
                onClick={() => {
                  setDraftTelemetry(telemetry);
                  setActiveStudioTab('revenue');
                  setIsEditingStudioOpen(true);
                }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                title="Edit Gross Profit"
              >
                <PenSquare size={14} color="#14B8A6" />
              </button>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#2DD4BF', letterSpacing: '-0.02em', margin: '4px 0' }}>
              {formatMillions(telemetry.grossProfit)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '8px' }}>
              <span style={{ color: '#2DD4BF', fontWeight: 700 }}>
                Gross Margin: {telemetry.grossMarginPercent}%
              </span>
              <span style={{ fontFamily: 'monospace', color: '#94A3B8' }}>COGS: {formatMillions(telemetry.cogsAmount)}</span>
            </div>
          </div>

          {/* 7. OPERATING EXPENSES: RWF 6.4M */}
          <div
            className="executive-kpi-card"
            style={{
              borderTop: '3px solid #F43F5E',
              background: 'linear-gradient(145deg, rgba(46, 16, 26, 0.85) 0%, rgba(8, 20, 42, 0.95) 100%)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#FECDD3', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={15} color="#F43F5E" /> OPERATING EXPENSES
              </span>
              <button
                onClick={() => {
                  setDraftTelemetry(telemetry);
                  setActiveStudioTab('opex');
                  setIsEditingStudioOpen(true);
                }}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                title="Edit OpEx"
              >
                <PenSquare size={14} color="#F43F5E" />
              </button>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#FB7185', letterSpacing: '-0.02em', margin: '4px 0' }}>
              {formatMillions(telemetry.operatingExpenses)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '8px' }}>
              <span style={{ color: '#CBD5E1', fontWeight: 600 }}>
                Fleet: {formatMillions(telemetry.fuelTotalCost)}
              </span>
              <span style={{ color: '#94A3B8' }}>Salaries: {formatMillions(telemetry.opexSalaries)}</span>
            </div>
          </div>

          {/* 8. NET PROFIT: RWF 12.3M */}
          <div
            className="executive-kpi-card"
            style={{
              borderTop: '3px solid #10B981',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              background: 'linear-gradient(145deg, rgba(10, 46, 32, 0.95) 0%, rgba(6, 24, 18, 0.98) 100%)',
              boxShadow: '0 16px 40px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#6EE7B7', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Scale size={15} color="#34D399" /> NET PROFIT
              </span>
              <button
                onClick={() => {
                  setDraftTelemetry(telemetry);
                  setActiveStudioTab('revenue');
                  setIsEditingStudioOpen(true);
                }}
                style={{ background: 'none', border: 'none', color: '#34D399', cursor: 'pointer', padding: '2px' }}
                title="Edit Net Profit"
              >
                <PenSquare size={14} color="#34D399" />
              </button>
            </div>
            <div style={{ fontSize: '30px', fontWeight: 900, color: '#34D399', letterSpacing: '-0.02em', margin: '4px 0' }}>
              {formatMillions(telemetry.netProfit)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '8px' }}>
              <span style={{ color: '#34D399', fontWeight: 800 }}>
                Net Margin: {((telemetry.netProfit / telemetry.totalSales) * 100).toFixed(1)}%
              </span>
              <span style={{ fontFamily: 'monospace', color: '#6EE7B7', fontWeight: 700 }}>{formatRwf(telemetry.netProfit)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WORKSPACE PILL NAVIGATION TABS                                         */}
      {/* ========================================================================= */}
      <nav style={{ padding: '24px 28px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '8px',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'overview', label: '10-Second Health', icon: Scale },
            { id: 'sales_revenue', label: 'Sales & Revenue', icon: ShoppingCart },
            { id: 'receivables', label: 'Customer Receivables (AR)', icon: Users },
            { id: 'payables', label: 'Supplier Payables (AP)', icon: Building },
            { id: 'bralirwa_purchases', label: 'BRALIRWA Purchases', icon: Package },
            { id: 'inventory_value', label: 'Inventory Valuation', icon: Database },
            { id: 'cash_management', label: 'Cash Management', icon: Coins },
            { id: 'bank_management', label: 'Bank Accounts', icon: Landmark },
            { id: 'expenses', label: 'Operating Expenses', icon: Layers },
            { id: 'delivery_fleet', label: 'Fleet & Delivery Costs', icon: Truck },
            { id: 'profitability', label: 'Profitability Engine', icon: TrendingUp },
            { id: 'tax_management', label: 'RRA EBM V2 Tax', icon: BadgePercent },
            { id: 'financial_statements', label: 'Financial Statements', icon: FileSpreadsheet },
            { id: 'general_ledger', label: 'General Ledger', icon: FileText },
            { id: 'reports', label: 'Reports Suite', icon: Download }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = mainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id as typeof mainTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: isActive ? '#10B981' : 'rgba(11, 23, 51, 0.7)',
                  color: isActive ? '#04151F' : '#94A3B8',
                  boxShadow: isActive ? '0 4px 16px rgba(16, 185, 129, 0.35)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} color={isActive ? '#04151F' : '#94A3B8'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 5. TABBED WORKSPACES CONTENT                                              */}
      {/* ========================================================================= */}
      <main style={{ padding: '24px 28px', flex: 1 }}>
        
        {/* TAB 1: EXECUTIVE HEALTH (THE 10 OBJECTIVES) */}
        {mainTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '24px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={20} color="#34D399" />
                    10-Second Financial Health Command Assessment
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                    Comprehensive operational answers for the independent beverage distributor.
                  </p>
                </div>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34D399',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  General Ledger: Balanced (Zero Variance)
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                  paddingTop: '18px'
                }}
              >
                {[
                  { q: '1. How much sold?', v: formatMillions(telemetry.totalSales), sub: 'Net commercial sales', color: '#FFFFFF' },
                  { q: '2. Money collected?', v: formatMillions(telemetry.cashCollected), sub: '84.9% collection rate', color: '#34D399' },
                  { q: '3. What customers owe?', v: formatMillions(telemetry.customerReceivables), sub: '42 active accounts', color: '#FBBF24' },
                  { q: '4. What we owe suppliers?', v: formatMillions(telemetry.supplierPayables), sub: 'BRALIRWA: RWF 7.5M', color: '#C084FC' },
                  { q: '5. What inventory is worth?', v: formatMillions(telemetry.inventoryValue), sub: 'Turnover: 4.8x/mo', color: '#22D3EE' },
                  { q: '6. How much spent?', v: formatMillions(telemetry.operatingExpenses), sub: 'Fleet & warehouse', color: '#FB7185' },
                  { q: '7. How profitable?', v: formatMillions(telemetry.netProfit), sub: '14.6% net margin', color: '#34D399' },
                  { q: '8. Cash & Bank available?', v: formatMillions(telemetry.totalLiquidCash), sub: 'BK, MoMo, Vault', color: '#38BDF8' },
                  { q: '9. Attention required?', v: `${activeAlerts.length} Flagged Items`, sub: '12 overdue AR / 1 AP', color: '#FBBF24' },
                  { q: '10. Balance sheet health?', v: 'A = L + E', sub: `Assets: ${formatMillions(telemetry.totalAssets)}`, color: '#2DD4BF' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(5, 14, 34, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {item.q}
                    </span>
                    <div style={{ fontSize: '19px', fontWeight: 900, marginTop: '4px', color: item.color }}>
                      {item.v}
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash Flow Cycle & Treasury Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div
                style={{
                  borderRadius: '18px',
                  background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '24px',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
                  gridColumn: 'span 2'
                }}
              >
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ArrowLeftRight size={18} color="#34D399" />
                  Independent Distributor Cash-to-Cash Cycle Flow
                </h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 16px 0' }}>
                  BRALIRWA / Supplier Purchase → Distributor Inventory → Customer Sales → Cash Collections → Net Distributor Profit.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', textAlign: 'center' }}>
                  <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>1. Purchases (COGS)</span>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', margin: '4px 0' }}>{formatMillions(telemetry.cogsAmount)}</div>
                    <span style={{ fontSize: '10.5px', color: '#C084FC' }}>BRALIRWA & Packaging</span>
                  </div>
                  <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>2. Warehouse Stock</span>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#22D3EE', margin: '4px 0' }}>{formatMillions(telemetry.inventoryValue)}</div>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>Depot On-Hand</span>
                  </div>
                  <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>3. Customer Sales</span>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#38BDF8', margin: '4px 0' }}>{formatMillions(telemetry.totalSales)}</div>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>Bars & Retailers</span>
                  </div>
                  <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>4. Cash Collected</span>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#34D399', margin: '4px 0' }}>{formatMillions(telemetry.cashCollected)}</div>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>Bank & MoMo Inflows</span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(5, 14, 34, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ fontSize: '12.5px', color: '#CBD5E1' }}>
                    <strong style={{ color: '#FFFFFF' }}>Gross Margin ({telemetry.grossMarginPercent}%)</strong>: {formatMillions(telemetry.grossProfit)}
                    <span style={{ color: '#64748B', margin: '0 8px' }}>•</span>
                    <strong style={{ color: '#FB7185' }}>OpEx ({((telemetry.operatingExpenses / telemetry.totalSales) * 100).toFixed(1)}%)</strong>: {formatMillions(telemetry.operatingExpenses)}
                  </div>
                  <div
                    style={{
                      padding: '6px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      color: '#34D399',
                      fontSize: '12px',
                      fontWeight: 900
                    }}
                  >
                    Net Distributor Profit: {formatMillions(telemetry.netProfit)}
                  </div>
                </div>
              </div>

              {/* Liquid Treasury Breakdown */}
              <div
                style={{
                  borderRadius: '18px',
                  background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '24px',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Wallet size={16} color="#34D399" />
                      Liquid Treasury Rails
                    </h3>
                    <button onClick={() => setMainTab('bank_management')} style={{ background: 'none', border: 'none', color: '#38BDF8', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      Manage →
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Bank of Kigali Operating</div>
                        <div style={{ fontSize: '10.5px', color: '#94A3B8', fontFamily: 'monospace' }}>Acc: 00041-0982</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>{formatRwf(telemetry.bankBKBalance)}</div>
                        <span style={{ fontSize: '10.5px', color: '#FBBF24' }}>{telemetry.bankBKUnreconciled} items to match</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Equity Replenishment Escrow</div>
                        <div style={{ fontSize: '10.5px', color: '#94A3B8', fontFamily: 'monospace' }}>Bralirwa Replenishment</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>{formatRwf(telemetry.equityEscrowBalance)}</div>
                        <span style={{ fontSize: '10.5px', color: '#34D399' }}>Reconciled</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>MTN Corporate MoMo Gateway</div>
                        <div style={{ fontSize: '10.5px', color: '#94A3B8', fontFamily: 'monospace' }}>Merchant: 884102</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>{formatRwf(telemetry.momoBalance)}</div>
                        <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>Direct collections</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Physical Depot Vault Cash</div>
                        <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>Physical safe count</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>{formatRwf(telemetry.physicalCashCounted)}</div>
                        <span style={{ fontSize: '10.5px', color: '#FBBF24' }}>Variance: {formatRwf(telemetry.cashVariance)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Total Liquid Treasury</span>
                  <span style={{ fontSize: '17px', fontWeight: 900, color: '#34D399', fontFamily: 'monospace' }}>{formatRwf(telemetry.totalLiquidCash)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SALES & REVENUE */}
        {mainTab === 'sales_revenue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '24px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingCart size={18} color="#38BDF8" />
                    Sales & Revenue Ledger ({timeframe})
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                    Gross sales, promotional discounts, customer returns, net distributor revenue, and cost of goods sold.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDraftTelemetry(telemetry);
                    setActiveStudioTab('revenue');
                    setIsEditingStudioOpen(true);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <PenSquare size={13} color="#34D399" />
                  <span>Edit Revenue Parameters</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', paddingTop: '18px' }}>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Gross Invoiced Sales</span>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', margin: '4px 0' }}>{formatRwf(telemetry.grossSales)}</div>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>1,240 deliveries</span>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Discounts Granted</span>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#FBBF24', margin: '4px 0' }}>-{formatRwf(telemetry.salesDiscounts)}</div>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>Bulk & prompt terms</span>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Returns & Breakages</span>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#FB7185', margin: '4px 0' }}>-{formatRwf(telemetry.salesReturns)}</div>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>Credited to customer AR</span>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase' }}>Net Commercial Sales</span>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#34D399', margin: '4px 0' }}>{formatRwf(telemetry.netSales)}</div>
                  <span style={{ fontSize: '10.5px', color: '#10B981', fontWeight: 700 }}>Prompt: RWF 84.2M</span>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Cost of Goods (COGS)</span>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#CBD5E1', margin: '4px 0' }}>-{formatRwf(telemetry.cogsAmount)}</div>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>Beverage stock at cost</span>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase' }}>Gross Profit</span>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#34D399', margin: '4px 0' }}>{formatRwf(telemetry.grossProfit)}</div>
                  <span style={{ fontSize: '10.5px', color: '#34D399', fontWeight: 800 }}>Margin: {telemetry.grossMarginPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER RECEIVABLES (AR) */}
        {mainTab === 'receivables' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              {[
                { label: 'Total AR', val: formatMillions(telemetry.customerReceivables), sub: '42 accounts', color: '#FFFFFF' },
                { label: 'Current', val: 'RWF 12.4M', sub: '0-15 days', color: '#34D399' },
                { label: 'Due Today', val: 'RWF 5.4M', sub: 'Simba Kimihurura', color: '#38BDF8' },
                { label: 'Due This Week', val: 'RWF 4.8M', sub: 'Kigali Serena', color: '#22D3EE' },
                { label: 'Overdue Total', val: 'RWF 11.2M', sub: '12 invoices', color: '#FBBF24' },
                { label: '30+ Days', val: 'RWF 4.2M', sub: 'Inka Steakhouse', color: '#F59E0B' },
                { label: '60+ Days', val: 'RWF 5.5M', sub: 'Nyamirambo Whs', color: '#FB7185' },
                { label: '90+ Days', val: 'RWF 1.5M', sub: 'Bad debt reserve', color: '#F43F5E' }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>{item.label}</span>
                  <div style={{ fontSize: '15px', fontWeight: 900, marginTop: '3px', color: item.color }}>{item.val}</div>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>{item.sub}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '24px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="#FBBF24" />
                  Customer Trade Accounts Receivable (AR)
                </h3>
                <button
                  onClick={() => setIsCustomerPaymentModalOpen(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    backgroundColor: '#10B981',
                    border: 'none',
                    color: '#04151F',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} /> Record Payment
                </button>
              </div>

              <div className="table-wrapper" style={{ marginTop: '16px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Type</th>
                      <th>Invoice #</th>
                      <th style={{ textAlign: 'right' }}>Invoiced</th>
                      <th style={{ textAlign: 'right' }}>Paid</th>
                      <th style={{ textAlign: 'right' }}>Balance Due</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerDebtors.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                          {item.name}
                          <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 400 }}>Limit: {formatRwf(item.limit)}</div>
                        </td>
                        <td>
                          <span className="badge badge-neutral">{item.type}</span>
                        </td>
                        <td style={{ fontFamily: 'monospace', color: '#94A3B8' }}>{item.inv}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{formatRwf(item.amount)}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#34D399' }}>{formatRwf(item.paid)}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#FBBF24' }}>{formatRwf(item.bal)}</td>
                        <td>
                          <span className="badge badge-warning">{item.status}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setPaymentCustomer(item.name);
                              setPaymentAmount(item.bal);
                              setIsCustomerPaymentModalOpen(true);
                            }}
                            className="btn btn-sm btn-primary"
                            style={{ marginRight: '6px' }}
                          >
                            Pay
                          </button>
                          <button
                            onClick={() => {
                              setStatementCustomer(item.name);
                              setIsStatementPreviewOpen(true);
                            }}
                            className="btn btn-sm btn-secondary"
                          >
                            Statement
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUPPLIER PAYABLES (MULTI-SUPPLIER) */}
        {mainTab === 'payables' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '24px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={18} color="#C084FC" />
                    Multi-Supplier Accounts Payable (AP)
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                    The distributor purchases from BRALIRWA, Packaging, Fuel, Fleet Maintenance, and Depot Supplies.
                  </p>
                </div>
                <button
                  onClick={() => setIsSupplierPaymentModalOpen(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    backgroundColor: '#A855F7',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CreditCard size={14} /> Record Supplier Payment
                </button>
              </div>

              <div className="table-wrapper" style={{ marginTop: '16px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Supplier</th>
                      <th>Category</th>
                      <th>Invoice #</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                      <th style={{ textAlign: 'right' }}>Paid</th>
                      <th style={{ textAlign: 'right' }}>Outstanding</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierPayables.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 800, color: '#FFFFFF' }}>{item.name}</td>
                        <td style={{ color: '#94A3B8' }}>{item.cat}</td>
                        <td style={{ fontFamily: 'monospace', color: '#94A3B8' }}>{item.inv}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{formatRwf(item.amount)}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#34D399' }}>{formatRwf(item.paid)}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#C084FC' }}>{formatRwf(item.out)}</td>
                        <td style={{ color: '#E2E8F0' }}>{item.due}</td>
                        <td>
                          <span className="badge" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.35)' }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setSupplierName(item.name);
                              setSupplierAmount(item.out);
                              setIsSupplierPaymentModalOpen(true);
                            }}
                            className="btn btn-sm btn-secondary"
                            style={{ color: '#C084FC', borderColor: 'rgba(168, 85, 247, 0.35)' }}
                          >
                            Pay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BRALIRWA PURCHASES */}
        {mainTab === 'bralirwa_purchases' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '24px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={18} color="#34D399" />
                    BRALIRWA PURCHASES — OCTOBER 2026
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                    BRALIRWA is the primary supplier. The distributor owns and reconciles their own purchasing records.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSupplierName('BRALIRWA PLC');
                    setSupplierAmount(telemetry.bralirwaOutstanding);
                    setIsSupplierPaymentModalOpen(true);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    backgroundColor: '#10B981',
                    border: 'none',
                    color: '#04151F',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CreditCard size={14} /> Disburse RWF 7.5M to BRALIRWA
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', paddingTop: '18px' }}>
                <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Purchased (October)</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', margin: '6px 0' }}>{formatRwf(telemetry.bralirwaPurchased)}</div>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>Prompt: RWF 42,500,000</span>
                </div>
                <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase' }}>Paid to BRALIRWA</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#34D399', margin: '6px 0' }}>{formatRwf(telemetry.bralirwaPaid)}</div>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>Prompt: RWF 35,000,000</span>
                </div>
                <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>Outstanding Balance</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#FBBF24', margin: '6px 0' }}>{formatRwf(telemetry.bralirwaOutstanding)}</div>
                  <span style={{ fontSize: '11.5px', color: '#FBBF24', fontWeight: 700 }}>Prompt: RWF 7,500,000 (Due Oct 6)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: INVENTORY VALUATION */}
        {mainTab === 'inventory_value' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Total Inventory Cost</span>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: '6px 0' }}>{formatRwf(telemetry.inventoryCost)}</div>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>Prompt: RWF 42.6M</span>
            </div>
            <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase' }}>Inventory Sales Value</span>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#38BDF8', margin: '6px 0' }}>{formatRwf(telemetry.inventorySalesValue)}</div>
              <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>Realizable revenue</span>
            </div>
            <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase' }}>Potential Gross Profit</span>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#34D399', margin: '6px 0' }}>{formatRwf(telemetry.potentialGrossProfit)}</div>
              <span style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 700 }}>22.2% potential margin</span>
            </div>
            <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>Stock Turnover Rate</span>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#FBBF24', margin: '6px 0' }}>{telemetry.inventoryTurnoverRatio}x / mo</div>
              <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>Average holding 6.2 days</span>
            </div>
          </div>
        )}

        {/* TAB 7: CASH MANAGEMENT */}
        {mainTab === 'cash_management' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '24px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Coins size={18} color="#34D399" />
                    Cash Position & Physical Vault Reconciliation
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>Reconcile physical depot cash with system records.</p>
                </div>
                <button
                  onClick={() => {
                    setDraftTelemetry(telemetry);
                    setActiveStudioTab('cash_bank');
                    setIsEditingStudioOpen(true);
                  }}
                  className="btn btn-primary"
                >
                  Enter Physical Cash Count
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', paddingTop: '18px' }}>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Opening Cash</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>{formatRwf(telemetry.openingCash)}</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase' }}>+ Cash Sales</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>+{formatRwf(telemetry.cashSales)}</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase' }}>+ AR Collections</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>+{formatRwf(telemetry.customerCollectionsCash)}</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#FB7185', textTransform: 'uppercase' }}>- Cash Expenses</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FB7185', marginTop: '4px' }}>-{formatRwf(telemetry.expensesPaidInCash)}</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#C084FC', textTransform: 'uppercase' }}>- Bank Deposits</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#C084FC', marginTop: '4px' }}>-{formatRwf(telemetry.cashDepositedToBank)}</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>= System Cash</span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>{formatRwf(telemetry.closingCashSystem)}</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>Physical Vault</span>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#FBBF24', marginTop: '4px' }}>{formatRwf(telemetry.physicalCashCounted)}</div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(5, 14, 34, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                    Physical Cash Variance: <span style={{ fontFamily: 'monospace', color: '#FBBF24' }}>{formatRwf(telemetry.cashVariance)}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{telemetry.cashVarianceExplanation}</div>
                </div>
                <button
                  onClick={() => {
                    submitCashReconciliation(
                      telemetry.physicalCashCounted,
                      telemetry.momoBalance,
                      telemetry.bankBKBalance,
                      telemetry.cashVarianceExplanation
                    );
                    showToast('Daily physical cash reconciliation signed-off and locked into ledger!');
                  }}
                  className="btn btn-primary"
                >
                  Sign-Off & Lock Daily Cash
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: BANK MANAGEMENT */}
        {mainTab === 'bank_management' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#CBD5E1' }}>Bank of Kigali Operating</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '6px 0', fontFamily: 'monospace' }}>{formatRwf(telemetry.bankBKBalance)}</div>
                <span style={{ fontSize: '11px', color: '#FBBF24' }}>{telemetry.bankBKUnreconciled} items to match</span>
              </div>
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#CBD5E1' }}>Equity Replenishment Escrow</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '6px 0', fontFamily: 'monospace' }}>{formatRwf(telemetry.equityEscrowBalance)}</div>
                <span style={{ fontSize: '11px', color: '#34D399' }}>Reconciled with Bralirwa</span>
              </div>
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#CBD5E1' }}>MTN Corporate MoMo</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '6px 0', fontFamily: 'monospace' }}>{formatRwf(telemetry.momoBalance)}</div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Direct merchant inflows</span>
              </div>
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#CBD5E1' }}>I&M Cash Transit</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '6px 0', fontFamily: 'monospace' }}>{formatRwf(telemetry.imClearingBalance)}</div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Clearing account</span>
              </div>
            </div>

            <div
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Bank Feed Auto-Matching Terminal</h4>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>8 Bank of Kigali transactions detected without ERP match.</p>
              </div>
              <button
                onClick={() => {
                  setTelemetry(prev => ({ ...prev, bankBKUnreconciled: 0 }));
                  showToast('Bank of Kigali statement feed reconciled! 8 transactions matched with zero discrepancy.');
                }}
                className="btn btn-primary"
              >
                Auto-Match 8 Transactions
              </button>
            </div>
          </div>
        )}

        {/* TAB 9: OPERATING EXPENSES */}
        {mainTab === 'expenses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="#FB7185" />
                  Distributor Operating Expense Register
                </h3>
                <button onClick={() => setIsAddExpenseModalOpen(true)} className="btn btn-danger">
                  <Plus size={14} /> Add New Expense
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', paddingTop: '18px' }}>
                {[
                  { l: 'Fuel', v: formatRwf(telemetry.opexFuel) },
                  { l: 'Salaries', v: formatRwf(telemetry.opexSalaries) },
                  { l: 'Rent', v: formatRwf(telemetry.opexRent) },
                  { l: 'Maintenance', v: formatRwf(telemetry.opexMaintenance) },
                  { l: 'Utilities', v: formatRwf(telemetry.opexUtilities) },
                  { l: 'Transport', v: formatRwf(telemetry.opexTransport) },
                  { l: 'Marketing', v: formatRwf(telemetry.opexMarketing) },
                  { l: 'Other', v: formatRwf(telemetry.opexOther) }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>{item.l}</span>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>{item.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: FLEET & DELIVERY COSTS */}
        {mainTab === 'delivery_fleet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Monthly Delivery Cost</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '4px 0' }}>{formatRwf(telemetry.monthlyDeliveryCost)}</div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Total fleet spend</span>
              </div>
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase' }}>Cost Per Delivery</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#38BDF8', margin: '4px 0' }}>{formatRwf(telemetry.costPerDelivery)}</div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>849 drop-offs</span>
              </div>
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#22D3EE', textTransform: 'uppercase' }}>Cost Per Route</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#22D3EE', margin: '4px 0' }}>{formatRwf(telemetry.costPerRoute)}</div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>4 routes/day</span>
              </div>
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(9, 23, 51, 0.85)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#C084FC', textTransform: 'uppercase' }}>Cost Per Vehicle</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#C084FC', margin: '4px 0' }}>{formatRwf(telemetry.costPerVehicle)}</div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Across 4 trucks</span>
              </div>
            </div>

            <div
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '24px'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0' }}>Fleet Vehicle Operational Accounting</h3>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Plate</th>
                      <th>Model</th>
                      <th>Driver</th>
                      <th style={{ textAlign: 'right' }}>Fuel</th>
                      <th style={{ textAlign: 'right' }}>Maintenance</th>
                      <th style={{ textAlign: 'right' }}>Monthly Cost</th>
                      <th style={{ textAlign: 'right' }}>Crates</th>
                      <th style={{ textAlign: 'right' }}>Cost / Crate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fleetVehicles.map((t, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 800, color: '#34D399' }}>{t.plate}</td>
                        <td style={{ color: '#FFFFFF' }}>{t.model}</td>
                        <td style={{ color: '#CBD5E1' }}>{t.driver}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{formatRwf(t.fuel)}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#94A3B8' }}>{formatRwf(t.maint)}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#FFFFFF' }}>{formatRwf(t.total)}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#38BDF8' }}>{t.crates.toLocaleString()}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#34D399' }}>{formatRwf(t.costPerCrate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: PROFITABILITY ENGINE */}
        {mainTab === 'profitability' && (
          <div
            style={{
              borderRadius: '18px',
              background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0' }}>Customer Profitability & Net Contribution</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th style={{ textAlign: 'right' }}>Revenue</th>
                    <th style={{ textAlign: 'right' }}>COGS</th>
                    <th style={{ textAlign: 'right' }}>Gross Profit</th>
                    <th style={{ textAlign: 'right' }}>Delivery Cost</th>
                    <th style={{ textAlign: 'right' }}>Other OpEx</th>
                    <th style={{ textAlign: 'right' }}>Net Contribution</th>
                    <th style={{ textAlign: 'right' }}>Net Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {customerProfitability.map((c, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 800, color: '#FFFFFF' }}>{c.name}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{formatRwf(c.rev)}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#94A3B8' }}>{formatRwf(c.cogs)}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#38BDF8' }}>{formatRwf(c.gp)}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#FB7185' }}>{formatRwf(c.delivery)}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#94A3B8' }}>{formatRwf(c.other)}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#34D399' }}>{formatRwf(c.net)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: '#34D399' }}>{c.margin}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 12: TAX MANAGEMENT & RRA FORM 01 */}
        {mainTab === 'tax_management' && (
          <div
            style={{
              borderRadius: '18px',
              background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BadgePercent size={18} color="#FBBF24" />
              Rwanda Revenue Authority (RRA) Form 01 VAT Return Preview
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8' }}>Box 01: Taxable Turnover (18%)</span>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', margin: '6px 0' }}>{formatRwf(telemetry.taxableSales)}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#FBBF24' }}>Box 02: Output VAT Payable</span>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#FBBF24', margin: '6px 0' }}>{formatRwf(telemetry.outputTax)}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8' }}>Box 04: Deductible Input VAT</span>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#38BDF8', margin: '6px 0' }}>-{formatRwf(telemetry.inputTax)}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#34D399' }}>Box 05: Net VAT Remittance</span>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#34D399', margin: '6px 0' }}>{formatRwf(telemetry.netTaxPayable)}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 13: FINANCIAL STATEMENTS */}
        {mainTab === 'financial_statements' && (
          <div
            style={{
              borderRadius: '18px',
              background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0' }}>Balance Sheet Diagnostic</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#34D399' }}>TOTAL ASSETS</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '6px 0' }}>{formatRwf(telemetry.totalAssets)}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#FB7185' }}>TOTAL LIABILITIES</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FB7185', margin: '6px 0' }}>{formatRwf(telemetry.totalLiabilities)}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8' }}>TOTAL EQUITY</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#38BDF8', margin: '6px 0' }}>{formatRwf(telemetry.totalEquity)}</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#34D399' }}>ACCOUNTING EQUALITY</span>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#34D399', margin: '6px 0' }}>BALANCED (A = L + E)</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 14: GENERAL LEDGER */}
        {mainTab === 'general_ledger' && (
          <div
            style={{
              borderRadius: '18px',
              background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0' }}>Standard Double-Entry General Ledger</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 16px 0' }}>Chart of accounts fully configured for independent distributor ERP.</p>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Account Code</th>
                    <th>Account Title</th>
                    <th>Type</th>
                    <th style={{ textAlign: 'right' }}>Debit (RWF)</th>
                    <th style={{ textAlign: 'right' }}>Credit (RWF)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { code: '1010', title: 'Depot Vault Cash', type: 'Asset', dr: telemetry.physicalCashCounted, cr: 0 },
                    { code: '1020', title: 'Bank of Kigali Operating', type: 'Asset', dr: telemetry.bankBKBalance, cr: 0 },
                    { code: '1030', title: 'MTN MoMo Collections', type: 'Asset', dr: telemetry.momoBalance, cr: 0 },
                    { code: '1200', title: 'Trade Accounts Receivable', type: 'Asset', dr: telemetry.customerReceivables, cr: 0 },
                    { code: '1300', title: 'Beverage Inventory at Cost', type: 'Asset', dr: telemetry.inventoryCost, cr: 0 },
                    { code: '2000', title: 'Trade Accounts Payable (BRALIRWA & Others)', type: 'Liability', dr: 0, cr: telemetry.supplierPayables },
                    { code: '4000', title: 'Commercial Beverage Sales Revenue', type: 'Revenue', dr: 0, cr: telemetry.totalSales },
                    { code: '5000', title: 'Cost of Goods Sold (COGS)', type: 'Expense', dr: telemetry.cogsAmount, cr: 0 },
                    { code: '6000', title: 'Distributor Operating Expenses', type: 'Expense', dr: telemetry.operatingExpenses, cr: 0 }
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 800, color: '#38BDF8' }}>{row.code}</td>
                      <td style={{ fontWeight: 700, color: '#FFFFFF' }}>{row.title}</td>
                      <td><span className="badge badge-neutral">{row.type}</span></td>
                      <td style={{ textAlign: 'right', fontFamily: 'monospace', color: row.dr > 0 ? '#FFFFFF' : '#64748B' }}>
                        {row.dr > 0 ? formatRwf(row.dr) : '-'}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'monospace', color: row.cr > 0 ? '#FFFFFF' : '#64748B' }}>
                        {row.cr > 0 ? formatRwf(row.cr) : '-'}
                      </td>
                      <td><span className="badge badge-success">Balanced</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 15: REPORTS SUITE */}
        {mainTab === 'reports' && (
          <div
            style={{
              borderRadius: '18px',
              background: 'linear-gradient(180deg, #091938 0%, #061229 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} color="#34D399" />
              Financial Reporting & Certified Exports Suite
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Monthly Profit & Loss (P&L)', desc: 'Net Sales, COGS, Gross Profit, OpEx, and Net Profit.' },
                { title: 'Customer AR Aging Schedule', desc: 'Breakdown of debtors across 0-30d, 31-60d, 61-90d, 90d+.' },
                { title: 'BRALIRWA October Reconciliation', desc: 'Purchases, payments, and outstanding balances.' },
                { title: 'RRA EBM V2 Tax Return Form 01', desc: 'Taxable turnover, input tax, and output tax.' }
              ].map((r, idx) => (
                <div key={idx} style={{ padding: '18px', borderRadius: '12px', backgroundColor: 'rgba(5, 14, 34, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>{r.title}</h4>
                  <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: '0 0 12px 0' }}>{r.desc}</p>
                  <button
                    onClick={() => showToast(`Generating certified PDF report for ${r.title}...`)}
                    className="btn btn-sm btn-secondary"
                  >
                    <Download size={13} /> Download Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 6. MANUAL DATA ENTRY STUDIO MODAL (THE ACCOUNTANT EDITING SUITE)          */}
      {/* ========================================================================= */}
      {isEditingStudioOpen && (
        <div className="modal-backdrop">
          <div className="modal-content modal-content-xl" style={{ border: '2px solid rgba(16, 185, 129, 0.4)' }}>
            
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(5, 14, 34, 0.7)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#10B981', color: '#04151F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PenSquare size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Manual Data Entry Studio — Financial Numbers Control
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                    Type in or override figures. All updates synchronize live to the Owner Dashboard.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditingStudioOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Studio Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', overflowX: 'auto', backgroundColor: 'rgba(8, 20, 42, 0.6)' }}>
              {[
                { id: 'kpis', label: '8 Core KPIs' },
                { id: 'revenue', label: 'Sales & Revenue' },
                { id: 'suppliers', label: 'Suppliers & BRALIRWA' },
                { id: 'inventory', label: 'Inventory Financials' },
                { id: 'cash_bank', label: 'Cash & Banks' },
                { id: 'opex', label: 'Operating Expenses' },
                { id: 'taxes', label: 'RRA Taxes' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveStudioTab(t.id as any)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: activeStudioTab === t.id ? '#10B981' : 'transparent',
                    color: activeStudioTab === t.id ? '#04151F' : '#94A3B8'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Studio Inputs */}
            <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
              {activeStudioTab === 'kpis' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <label className="label">TOTAL SALES (RWF)</label>
                    <input
                      type="number"
                      value={draftTelemetry.totalSales}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setDraftTelemetry(prev => ({
                          ...prev,
                          totalSales: val,
                          grossSales: val,
                          grossProfit: val - prev.cogsAmount,
                          netProfit: val - prev.cogsAmount - prev.operatingExpenses
                        }));
                      }}
                      className="input"
                      style={{ fontFamily: 'monospace', fontWeight: 800 }}
                    />
                  </div>
                  <div>
                    <label className="label">CASH COLLECTED (RWF)</label>
                    <input
                      type="number"
                      value={draftTelemetry.cashCollected}
                      onChange={e => setDraftTelemetry(prev => ({ ...prev, cashCollected: Number(e.target.value) }))}
                      className="input"
                      style={{ fontFamily: 'monospace', fontWeight: 800 }}
                    />
                  </div>
                  <div>
                    <label className="label">CUSTOMER RECEIVABLES (RWF)</label>
                    <input
                      type="number"
                      value={draftTelemetry.customerReceivables}
                      onChange={e => setDraftTelemetry(prev => ({ ...prev, customerReceivables: Number(e.target.value) }))}
                      className="input"
                      style={{ fontFamily: 'monospace', fontWeight: 800 }}
                    />
                  </div>
                  <div>
                    <label className="label">SUPPLIER PAYABLES (RWF)</label>
                    <input
                      type="number"
                      value={draftTelemetry.supplierPayables}
                      onChange={e => setDraftTelemetry(prev => ({ ...prev, supplierPayables: Number(e.target.value) }))}
                      className="input"
                      style={{ fontFamily: 'monospace', fontWeight: 800 }}
                    />
                  </div>
                  <div>
                    <label className="label">INVENTORY VALUE (RWF)</label>
                    <input
                      type="number"
                      value={draftTelemetry.inventoryValue}
                      onChange={e => setDraftTelemetry(prev => ({ ...prev, inventoryValue: Number(e.target.value) }))}
                      className="input"
                      style={{ fontFamily: 'monospace', fontWeight: 800 }}
                    />
                  </div>
                  <div>
                    <label className="label">COST OF GOODS SOLD (COGS)</label>
                    <input
                      type="number"
                      value={draftTelemetry.cogsAmount}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setDraftTelemetry(prev => ({
                          ...prev,
                          cogsAmount: val,
                          grossProfit: prev.totalSales - val,
                          netProfit: prev.totalSales - val - prev.operatingExpenses
                        }));
                      }}
                      className="input"
                      style={{ fontFamily: 'monospace', fontWeight: 800 }}
                    />
                  </div>
                  <div>
                    <label className="label">OPERATING EXPENSES (RWF)</label>
                    <input
                      type="number"
                      value={draftTelemetry.operatingExpenses}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setDraftTelemetry(prev => ({
                          ...prev,
                          operatingExpenses: val,
                          netProfit: prev.grossProfit - val
                        }));
                      }}
                      className="input"
                      style={{ fontFamily: 'monospace', fontWeight: 800 }}
                    />
                  </div>
                  <div>
                    <label className="label" style={{ color: '#34D399' }}>DERIVED NET PROFIT</label>
                    <div style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.85)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399', fontWeight: 900, fontFamily: 'monospace' }}>
                      {formatRwf(draftTelemetry.grossProfit - draftTelemetry.operatingExpenses)}
                    </div>
                  </div>
                </div>
              )}

              {activeStudioTab === 'suppliers' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label className="label">BRALIRWA Purchased (October)</label>
                    <input
                      type="number"
                      value={draftTelemetry.bralirwaPurchased}
                      onChange={e => setDraftTelemetry(prev => ({ ...prev, bralirwaPurchased: Number(e.target.value) }))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">BRALIRWA Paid (RWF)</label>
                    <input
                      type="number"
                      value={draftTelemetry.bralirwaPaid}
                      onChange={e => setDraftTelemetry(prev => ({ ...prev, bralirwaPaid: Number(e.target.value) }))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label" style={{ color: '#C084FC' }}>BRALIRWA Outstanding Balance</label>
                    <div style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: 'rgba(5, 14, 34, 0.85)', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#C084FC', fontWeight: 800, fontFamily: 'monospace' }}>
                      {formatRwf(draftTelemetry.bralirwaPurchased - draftTelemetry.bralirwaPaid)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Studio Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(5, 14, 34, 0.9)'
              }}
            >
              <button
                onClick={handleResetDefaults}
                className="btn btn-secondary"
              >
                <RotateCcw size={14} /> Reset to Baseline
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setIsEditingStudioOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAndSync}
                  className="btn btn-primary"
                >
                  <Save size={14} /> Save & Sync to Owner Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RECORD CUSTOMER PAYMENT */}
      {isCustomerPaymentModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coins size={16} color="#34D399" /> Record Customer Payment
              </h3>
              <button onClick={() => setIsCustomerPaymentModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="label">Customer Account</label>
                <select
                  value={paymentCustomer}
                  onChange={e => setPaymentCustomer(e.target.value)}
                  className="select"
                >
                  {customerDebtors.map((c, idx) => (
                    <option key={idx} value={c.name}>{c.name} (Balance: {formatRwf(c.bal)})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Amount (RWF)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="input"
                  style={{ fontFamily: 'monospace', fontWeight: 800 }}
                />
              </div>
              <div>
                <label className="label">Payment Rail</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="select"
                >
                  <option value="Bank Transfer (BK)">Bank Transfer (Bank of Kigali)</option>
                  <option value="MTN MoMo Pay">MTN Corporate MoMo Pay (Merchant: 884102)</option>
                  <option value="Depot Cash">Physical Depot Cash Safe</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setIsCustomerPaymentModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleRecordCustomerPayment} className="btn btn-primary">
                Post Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RECORD SUPPLIER PAYMENT */}
      {isSupplierPaymentModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={16} color="#C084FC" /> Record Supplier Payment
              </h3>
              <button onClick={() => setIsSupplierPaymentModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="label">Supplier</label>
                <select
                  value={supplierName}
                  onChange={e => setSupplierName(e.target.value)}
                  className="select"
                >
                  {supplierPayables.map((s, idx) => (
                    <option key={idx} value={s.name}>{s.name} (Due: {formatRwf(s.out)})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Disbursement Amount (RWF)</label>
                <input
                  type="number"
                  value={supplierAmount}
                  onChange={e => setSupplierAmount(Number(e.target.value))}
                  className="input"
                  style={{ fontFamily: 'monospace', fontWeight: 800 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setIsSupplierPaymentModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleRecordSupplierPayment} className="btn btn-primary" style={{ backgroundColor: '#A855F7', borderColor: '#A855F7' }}>
                Post Disbursement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXPENSE */}
      {isAddExpenseModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} color="#FB7185" /> Add Operating Expense
              </h3>
              <button onClick={() => setIsAddExpenseModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="label">Category</label>
                <select
                  value={expenseCategory}
                  onChange={e => setExpenseCategory(e.target.value as any)}
                  className="select"
                >
                  <option value="Fuel">Fuel (Diesel for Fleet)</option>
                  <option value="Vehicle Maintenance">Fleet & Truck Maintenance</option>
                  <option value="Salaries">Depot & Driver Salaries</option>
                  <option value="Warehouse Rent">Warehouse & Hub Rent</option>
                  <option value="Utilities">Utilities (Cold-chain Electricity & Water)</option>
                </select>
              </div>
              <div>
                <label className="label">Amount (RWF)</label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(Number(e.target.value))}
                  className="input"
                  style={{ fontFamily: 'monospace', fontWeight: 800 }}
                />
              </div>
              <div>
                <label className="label">Vendor / Description</label>
                <input
                  type="text"
                  value={expenseDesc}
                  onChange={e => setExpenseDesc(e.target.value)}
                  className="input"
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setIsAddExpenseModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleAddExpense} className="btn btn-danger">
                Post Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: POST JOURNAL */}
      {isCreateJournalModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={16} color="#38BDF8" /> Create Journal Voucher
              </h3>
              <button onClick={() => setIsCreateJournalModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="label">Debit Account</label>
                <input
                  type="text"
                  value={journalDebitAcc}
                  onChange={e => setJournalDebitAcc(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Credit Account</label>
                <input
                  type="text"
                  value={journalCreditAcc}
                  onChange={e => setJournalCreditAcc(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Amount (RWF)</label>
                <input
                  type="number"
                  value={journalAmount}
                  onChange={e => setJournalAmount(Number(e.target.value))}
                  className="input"
                  style={{ fontFamily: 'monospace', fontWeight: 800 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setIsCreateJournalModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handlePostJournal} className="btn btn-primary">
                Post Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PERIOD CLOSE */}
      {isPeriodCloseModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ padding: '24px', maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color="#FBBF24" /> Close Fiscal Period
              </h3>
              <button onClick={() => setIsPeriodCloseModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              Are you sure you want to close and lock the books for <strong>{telemetry.financialPeriod}</strong>?
              This will certify all journal vouchers, lock customer balances, and freeze the P&L statement.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setIsPeriodCloseModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleClosePeriod} className="btn btn-primary" style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#04151F' }}>
                Lock & Certify Period
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountantDashboard;
