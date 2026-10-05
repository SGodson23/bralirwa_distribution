import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Boxes,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Crown,
  ShieldCheck,
  XCircle,
  Building2,
  Lock,
  Zap,
  ArrowRight,
  Filter,
  Download,
  RefreshCw,
  Landmark,
  Wallet,
  Send,
  Eye,
  Check,
  X,
  MapPin,
  Activity,
  Award,
  Layers,
  Printer,
  FileCheck2,
  BarChart3,
  SlidersHorizontal,
  PackageCheck,
  Users,
  CreditCard,
  ShieldAlert,
  Bot,
  Settings,
  Scale,
  Receipt,
  FileSpreadsheet,
  PieChart,
  UserPlus,
  HelpCircle,
  BadgeAlert,
  Building,
  KeyRound,
  History,
  TrendingDown,
  Smartphone,
  Gauge,
  Search,
  Fuel,
  Wrench,
  UserCheck,
  Percent,
  CheckSquare,
  AlertOctagon,
  Flame,
  FileQuestion,
  ChevronUp
} from 'lucide-react';
import { SimpleExecutiveCommand } from '../components/executive/SimpleExecutiveCommand';
import { PurchasesReceivingCard } from '../components/purchases/PurchasesReceivingCard';
import { ClientsOverviewCard } from '../components/commercial/ClientsOverviewCard';
import { ExecutiveApprovalItem, Customer, Product, Vehicle, SalespersonMetric } from '../types';
import { ALL_USER_CREDENTIALS } from '../data/mockData';
import { DEFAULT_ACCOUNTANT_TELEMETRY, AccountantManualTelemetry } from '../types/accountantTelemetry';

export const ExecutiveDashboard: React.FC = () => {
  const {
    currentUser,
    currentTenant,
    salesOrders,
    inventory,
    customers,
    products,
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
    setCurrentNav,
    setQuickCreateOpen,
    setQuickCreateType,
    executiveApprovals,
    approveExecutiveItem,
    rejectExecutiveItem,
    triggerLiquiditySweep,
    createPurchaseOrder,
    showToast
  } = useApp();

  // Multi-depot operations filter (Company specific depots)
  const [selectedDepot, setSelectedDepot] = useState<'all' | 'wh-main-gikondo' | 'wh-remera-depot' | 'wh-nyamata-depot'>('all');

  // Direct Feature Quick-Jump (1 to 30)
  const [jumpFeatureId, setJumpFeatureId] = useState<string>('');

  // Sales timeframes & metrics
  const [salesTimeframe, setSalesTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [salesMetric, setSalesMetric] = useState<'revenue' | 'crates' | 'margin'>('revenue');

  // Profitability dimension toggle (Product, Customer, Route, Salesperson)
  const [profitDimension, setProfitDimension] = useState<'product' | 'customer' | 'route' | 'salesperson'>('product');

  // Customer Management Filter (All, Active, Inactive)
  const [customerFilter, setCustomerFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Liquidity Sweep Interactive Drawer / Modal
  const [showSweepModal, setShowSweepModal] = useState<boolean>(false);
  const [sweepAmount, setSweepAmount] = useState<number>(14800000);
  const [sweepTarget, setSweepTarget] = useState<'Bralirwa Escrow' | 'Treasury Reserve'>('Bralirwa Escrow');
  const [sweepSource, setSweepSource] = useState<'MoMo' | 'Vault' | 'BK'>('MoMo');
  const [isSweeping, setIsSweeping] = useState<boolean>(false);

  // Board Summary Export Modal
  const [showBoardModal, setShowBoardModal] = useState<boolean>(false);
  const [showApprovalsModal, setShowApprovalsModal] = useState<boolean>(false);
  const showDeepDive = false;

  // Quick Brewery PO Modal
  const [quickPOModalOpen, setQuickPOModalOpen] = useState<boolean>(false);
  const [selectedPOProduct, setSelectedPOProduct] = useState<Product | null>(null);
  const [poCratesToOrder, setPoCratesToOrder] = useState<number>(400);

  // Approval Inspection State
  const [inspectingItem, setInspectingItem] = useState<ExecutiveApprovalItem | null>(null);

  // AI Assistant Chat State
  const [aiQueryInput, setAiQueryInput] = useState<string>('');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: `Hello ${currentUser.name}. I am your distribution AI operations advisor. You can ask me questions about profit variances, customer credit risk, brewery replenishment needs, or losses.`,
      time: '08:00 AM'
    }
  ]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Live Pulse state
  const [livePulse, setLivePulse] = useState<string>('Live (1.2s sync)');
  useEffect(() => {
    const timer = setInterval(() => {
      setLivePulse(`Live (${(Math.random() * 0.8 + 0.8).toFixed(1)}s sync)`);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Live Warehouse Manager Floor Telemetry (filled & edited manually by Warehouse Manager in his dashboard)
  const [managerFloorTelemetry, setManagerFloorTelemetry] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kbl_warehouse_telemetry');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
    return {
      status: 'GOOD',
      stockValueText: 'RWF 96.4M',
      lowStockText: '4 products',
      lowStockProducts: 'Primus, Turbo, Vitaló, Fanta',
      lossDamageText: 'RWF 320K',
      lossDamageDetails: '24 crates (0.33% breakage rate)',
      stockAccuracyText: '98.7%',
      stockAccuracyDetails: '±14 crates physical audit variance',
      alertText: 'Primus may run out in 1.8 days',
      depotBayFillText: 'Live Depot Telemetry • Gikondo Central Logistics Hub • 14,820 / 25,000 Crates (79.4% Bay Fill)',
      shiftNotes: 'Morning Bralirwa replenishment from Gisenyi Brewery verified and unloaded with intact seals. Temperature buffer 4°C verified. All bays restacked.',
      inspectorName: 'Jean-Claude Mugabo (Warehouse Manager)',
      lastEditedText: 'Manager Verified'
    };
  });

  // Live Accountant Financial Telemetry (filled & edited manually by Senior Accountant in their portal)
  const [accountantTelemetry, setAccountantTelemetry] = useState<AccountantManualTelemetry>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kbl_accountant_telemetry');
      if (saved) {
        try {
          return { ...DEFAULT_ACCOUNTANT_TELEMETRY, ...JSON.parse(saved) };
        } catch (e) {
          // ignore
        }
      }
    }
    return DEFAULT_ACCOUNTANT_TELEMETRY;
  });

  // Keep manager floor telemetry and accountant financial telemetry synchronized in real time
  useEffect(() => {
    const handleStorageChange = () => {
      const savedWarehouse = localStorage.getItem('kbl_warehouse_telemetry');
      if (savedWarehouse) {
        try {
          setManagerFloorTelemetry(JSON.parse(savedWarehouse));
        } catch (e) {
          // ignore
        }
      }
      const savedAccountant = localStorage.getItem('kbl_accountant_telemetry');
      if (savedAccountant) {
        try {
          setAccountantTelemetry(JSON.parse(savedAccountant));
        } catch (e) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter calculations based on selected depot
  const totalStockValue = inventory.reduce((sum, item) => {
    const prod = products.find((p) => p.id === item.productId);
    return sum + item.onHandCrates * (prod?.bralirwaPurchasePrice || 14200);
  }, 0);
  const totalCratesOnHand = inventory.reduce((sum, item) => sum + item.onHandCrates, 0);
  const totalOutstandingDebt = customers.reduce((sum, c) => sum + c.currentExposure, 0);
  const totalCreditLimit = customers.reduce((sum, c) => sum + c.creditLimit, 0);
  const emptiesCount = emptiesSummary?.atCustomers || 6140;
  const cashCollectedToday = cashReconciliation?.actualTotalCounted || 14240000;
  const todayRevenue = salesOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0) || 21850000;
  const grossProfitEstimate = Math.round(todayRevenue * 0.211);
  const operatingExpensesToday = 1420000;
  const netProfitEstimate = grossProfitEstimate - operatingExpensesToday;
  const deliveriesCompleted = deliveryRuns.filter((d) => d.status === 'delivered').length || 8;
  const totalDeliveries = deliveryRuns.length || 10;
  const totalBreakageLosses = 275000;
  const unreadAlertsCount = smartAlerts.filter((a) => !a.read).length || 3;

  // Pending Approvals
  const pendingApprovals = executiveApprovals.filter((a) => a.status === 'pending');

  // Handle Quick Jump to any section or feature
  const handleScrollTo = (elementId: string) => {
    setJumpFeatureId(elementId);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // AI Prompt handler
  const handleAiQuestion = (question: string) => {
    setAiChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: question, time: 'Just now' }
    ]);
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = '';
      if (question.includes('profit fall') || question.includes('Why did profit')) {
        reply =
          'Gross margin dropped by 1.4% this week primarily due to higher diesel costs on the Rwamagana route (+RWF 320,000) and promotional discounts of 3.5% granted on Amstel Malt to secure the Chez Lando account. Net profitability remains healthy at 19.7%.';
      } else if (question.includes('Who owes us') || question.includes('debt')) {
        reply =
          'Top 3 accounts with highest debt exposure:\n1. Simba Supermarket Gishushu: RWF 7.4M (Current limit: RWF 8.0M - Promised RWF 1.5M by Friday)\n2. Kigali Serena Hotel: RWF 5.2M (Current limit: RWF 6.0M - Verified)\n3. Envy Club Kimihurura: RWF 3.1M (60+ days overdue - recommend immediate credit lock).';
      } else if (question.includes('reorder') || question.includes('What should')) {
        reply =
          'Critical replenishment needed:\n• Primus 50CL RGB: Only 1.8 days cover remaining at Gikondo Hub. Recommend 600 crates.\n• Mützig 50CL RGB: Projected weekend shortfall of 350 crates.\nDraft PO-2026-0883 can be auto-submitted to Bralirwa with 1 click.';
      } else if (question.includes('losing money') || question.includes('loss')) {
        reply =
          'Loss drivers this month:\n• Road Transit Breakages: RWF 217,000 on Kimironko cobblestone route (Sanlam claim filed).\n• Customer Overdue Glass Float: 74 unreturned crates at Papyrus Bar (RWF 296,000 capital value at risk).\n• Cashier variance: RWF 120,000 pending reconciliation from Tuesday evening vault deposit.';
      } else {
        reply = `Analysis completed for "${question}". All operations across Kigali Beverage Logistics Ltd are tracking at 92/100 Health Score. Cash flow is positive and brewery credit headroom is RWF 37.5M.`;
      }

      setAiChatHistory((prev) => [
        ...prev,
        { sender: 'assistant', text: reply, time: 'Just now' }
      ]);
      setIsAiThinking(false);
    }, 900);
  };

  // Execute Sweep
  const handleExecuteSweep = () => {
    setIsSweeping(true);
    setTimeout(() => {
      triggerLiquiditySweep(sweepAmount, sweepTarget);
      setIsSweeping(false);
      setShowSweepModal(false);
      showToast(`Successfully swept RWF ${sweepAmount.toLocaleString()} to ${sweepTarget}!`);
    }, 1200);
  };

  // Batch approve low risk
  const handleBatchApproveLowRisk = () => {
    const lowRiskItems = pendingApprovals.filter((a) => a.riskScore === 'LOW');
    lowRiskItems.forEach((item) => approveExecutiveItem(item.id));
    showToast(`Batch approved ${lowRiskItems.length} low-risk operations.`);
  };

  // Chart data
  const chartDataDaily = [
    { label: '08:00', revenue: 2400000, crates: 160, margin: 510000 },
    { label: '10:00', revenue: 5800000, crates: 380, margin: 1220000 },
    { label: '12:00', revenue: 9200000, crates: 610, margin: 1940000 },
    { label: '14:00', revenue: 14600000, crates: 970, margin: 3080000 },
    { label: '16:00', revenue: 18400000, crates: 1220, margin: 3880000 },
    { label: '18:00', revenue: 21850000, crates: 1450, margin: 4610000 }
  ];

  const chartDataWeekly = [
    { label: 'Mon', revenue: 18200000, crates: 1200, margin: 3840000 },
    { label: 'Tue', revenue: 19400000, crates: 1290, margin: 4100000 },
    { label: 'Wed', revenue: 21850000, crates: 1450, margin: 4610000 },
    { label: 'Thu', revenue: 20100000, crates: 1340, margin: 4240000 },
    { label: 'Fri', revenue: 28400000, crates: 1890, margin: 5990000 },
    { label: 'Sat', revenue: 34200000, crates: 2280, margin: 7210000 },
    { label: 'Sun', revenue: 16500000, crates: 1100, margin: 3480000 }
  ];

  const chartDataMonthly = [
    { label: 'Week 1', revenue: 135000000, crates: 9000, margin: 28500000 },
    { label: 'Week 2', revenue: 142000000, crates: 9460, margin: 29900000 },
    { label: 'Week 3', revenue: 158000000, crates: 10530, margin: 33300000 },
    { label: 'Week 4', revenue: 164000000, crates: 10930, margin: 34600000 }
  ];

  const chartDataYearly = [
    { label: '2023', revenue: 1420000000, crates: 95000, margin: 298000000 },
    { label: '2024', revenue: 1680000000, crates: 112000, margin: 354000000 },
    { label: '2025', revenue: 1940000000, crates: 129000, margin: 409000000 },
    { label: '2026 YTD', revenue: 1480000000, crates: 98000, margin: 312000000 }
  ];

  const activeChartData =
    salesTimeframe === 'daily'
      ? chartDataDaily
      : salesTimeframe === 'weekly'
      ? chartDataWeekly
      : salesTimeframe === 'monthly'
      ? chartDataMonthly
      : chartDataYearly;

  const maxVal = Math.max(
    ...activeChartData.map((d) =>
      salesMetric === 'revenue' ? d.revenue : salesMetric === 'crates' ? d.crates : d.margin
    )
  );

  // Complete List of All 30 Features for Direct Scroll Jump
  const ALL_30_FEATURES = [
    { id: 'feat-1', num: 1, title: 'Executive Dashboard' },
    { id: 'feat-2', num: 2, title: 'Sales Overview' },
    { id: 'feat-3', num: 3, title: 'Profitability Engine' },
    { id: 'feat-4', num: 4, title: 'Inventory Overview' },
    { id: 'feat-5', num: 5, title: 'Purchases & Receiving' },
    { id: 'feat-6', num: 6, title: 'Clients (Commercial)' },
    { id: 'feat-7', num: 7, title: 'Credit & Debt Management' },
    { id: 'feat-8', num: 8, title: 'Cash & Payment Management' },
    { id: 'feat-9', num: 9, title: 'Daily Reconciliation' },
    { id: 'feat-10', num: 10, title: 'Expenses & OpEx' },
    { id: 'feat-11', num: 11, title: 'Crates & Empty Bottles' },
    { id: 'feat-12', num: 12, title: 'Loss & Damage Control' },
    { id: 'feat-13', num: 13, title: 'Delivery Management' },
    { id: 'feat-14', num: 14, title: 'Fleet Management' },
    { id: 'feat-15', num: 15, title: 'Live Delivery Tracking' },
    { id: 'feat-16', num: 16, title: 'Employee Management' },
    { id: 'feat-17', num: 17, title: 'Sales Team Performance' },
    { id: 'feat-18', num: 18, title: 'Driver Performance' },
    { id: 'feat-19', num: 19, title: 'Approval Center' },
    { id: 'feat-20', num: 20, title: 'Alerts & Risk Center' },
    { id: 'feat-21', num: 21, title: 'AI Business Assistant' },
    { id: 'feat-22', num: 22, title: 'Forecasting & Replenishment' },
    { id: 'feat-23', num: 23, title: 'Reports Suite (10 Reports)' },
    { id: 'feat-24', num: 24, title: 'Audit Trail' },
    { id: 'feat-25', num: 25, title: 'User & Permissions' },
    { id: 'feat-26', num: 26, title: 'Security Center' },
    { id: 'feat-27', num: 27, title: 'Company Settings' },
    { id: 'feat-28', num: 28, title: 'Daily Owner Brief' },
    { id: 'feat-29', num: 29, title: 'Business Health Score' },
    { id: 'feat-30', num: 30, title: 'Owner Activity Feed' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '80px' }}>

      {/* =========================================================================
          SIMPLIFIED EXECUTIVE COMMAND SECTION (AS REQUESTED BY OWNER)
          ========================================================================= */}
      <SimpleExecutiveCommand
        userName="Emmanuel"
        depotName="ABC Distribution Depot"
        dateStr="October 1, 2026"
        salesToday="RWF 18.4M"
        salesGrowth="+8.2%"
        profitAmount={`RWF ${(accountantTelemetry.netEbitdaMTD / 1000000).toFixed(1)}M`}
        profitPeriod="Net EBITDA MTD"
        cashAmount={`RWF ${(accountantTelemetry.totalLiquidCash / 1000000).toFixed(1)}M`}
        cashPeriod="Liquid Treasury"
        debtAmount={`RWF ${(accountantTelemetry.totalTradeDebt / 1000000).toFixed(1)}M`}
        debtOverdue={`${(accountantTelemetry.overdueDebt30Days / 1000000).toFixed(1)}M overdue`}
        stockHealthyCount={18}
        stockLowCount={4}
        stockCriticalCount={2}
        deliveriesCompletedCount={76}
        deliveriesInTransitCount={8}
        deliveriesFailedCount={2}
        cratesOutsideCount={486}
        cratesAtRiskValue="RWF 7.2M at Risk"
        pendingApprovalsCount={pendingApprovals.length || 3}
        onViewReports={() => setShowBoardModal(true)}
        onViewApprovals={() => setShowApprovalsModal(true)}
        onViewInventory={() => setCurrentNav('inventory')}
        onAttentionClick={(type) => {
          if (type === 'primus') {
            const primusProduct = products.find((p) => p.name.includes('Primus')) || products[0];
            setSelectedPOProduct(primusProduct);
            setPoCratesToOrder(600);
            setQuickPOModalOpen(true);
          } else if (type === 'debt') {
            setShowBoardModal(true);
          } else if (type === 'crates') {
            setCurrentNav('empties');
          }
        }}
      />


      {showDeepDive && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

      {/* =========================================================================================
          SECTION 2: COMMERCIAL, SALES VELOCITY, PROFITABILITY ENGINE & CRM
          (Features 2, 3, 6, 17)
          ========================================================================================= */}
      <div id="sec-sales" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* SUBHEADING 1: CLIENTS (FEATURE 6) & SALES OVERVIEW (FEATURE 2) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 390px) 1fr', gap: '20px', alignItems: 'stretch' }}>
          {/* Feature 6: Clients Overview Card (First Subheading under Commercial) */}
          <div id="feat-6" style={{ display: 'flex' }}>
            <ClientsOverviewCard
              style={{ width: '100%' }}
              onViewClients={() => setCurrentNav('customers')}
            />
          </div>

          {/* FEATURE 2: Sales Overview (Daily, Weekly, Monthly, Yearly) */}
          <div
            id="feat-2"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Feature 2 • Sales Overview & Growth Trends (Daily, Weekly, Monthly, Yearly)
                </h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0' }}>
                  Sales volume comparisons with previous periods & growth trajectory
                </p>
              </div>

              {/* Timeframe & Metric Toggle */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', backgroundColor: 'rgba(15, 23, 42, 0.7)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  {(['revenue', 'crates', 'margin'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSalesMetric(m)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11.5px',
                        fontWeight: salesMetric === m ? 700 : 500,
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: salesMetric === m ? '#16A36A' : 'transparent',
                        color: salesMetric === m ? '#FFFFFF' : '#94A3B8',
                        cursor: 'pointer'
                      }}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', backgroundColor: 'rgba(15, 23, 42, 0.7)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSalesTimeframe(t)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11.5px',
                        fontWeight: salesTimeframe === t ? 700 : 500,
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: salesTimeframe === t ? '#D5A021' : 'transparent',
                        color: salesTimeframe === t ? '#FFFFFF' : '#94A3B8',
                        cursor: 'pointer'
                      }}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bars */}
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '10px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {activeChartData.map((d, i) => {
                const val = salesMetric === 'revenue' ? d.revenue : salesMetric === 'crates' ? d.crates : d.margin;
                const heightPercent = Math.max(16, Math.round((val / maxVal) * 100));

                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8' }} className="tabular-nums">
                      {salesMetric === 'revenue' ? `${(d.revenue / 1000000).toFixed(1)}M` : `${d.crates}`}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '46px',
                        height: `${heightPercent * 1.5}px`,
                        background: 'linear-gradient(180deg, #10B981 0%, #065F46 100%)',
                        borderRadius: '6px 6px 0 0'
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FEATURE 3: Profitability (Product, Customer Tier, Route, Salesperson) */}
        <div
          id="feat-3"
          style={{
            padding: '22px 24px',
            backgroundColor: 'rgba(8, 22, 50, 0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Feature 3 • Comprehensive Profitability Engine (Gross & Net Margins)
              </h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                Analyze margins across Products, Retail Customers, Delivery Routes, and Sales Reps
              </span>
            </div>

            {/* Dimension Switcher */}
            <div style={{ display: 'flex', backgroundColor: 'rgba(2, 6, 23, 0.8)', padding: '2px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              {(['product', 'customer', 'route', 'salesperson'] as const).map((dim) => (
                <button
                  key={dim}
                  onClick={() => setProfitDimension(dim)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontWeight: profitDimension === dim ? 700 : 500,
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: profitDimension === dim ? '#D5A021' : 'transparent',
                    color: profitDimension === dim ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer'
                  }}
                >
                  By {dim.charAt(0).toUpperCase() + dim.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Profit Dimension Breakdown Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            {profitDimension === 'product' && [
              { name: 'Primus 50CL RGB', margin: 'RWF 2,600 / cr', marginPct: '15.5%', gross: 'RWF 14.1M', net: 'RWF 11.2M', detail: 'High volume anchor SKU' },
              { name: 'Mützig 50CL RGB', margin: 'RWF 3,100 / cr', marginPct: '14.4%', gross: 'RWF 12.0M', net: 'RWF 9.8M', detail: 'Premium lager volume' },
              { name: 'Heineken 33CL RGB', margin: 'RWF 4,300 / cr', marginPct: '15.1%', gross: 'RWF 9.2M', net: 'RWF 7.9M', detail: 'Highest crate margin' },
              { name: 'Turbo King 50CL RGB', margin: 'RWF 2,600 / cr', marginPct: '15.9%', gross: 'RWF 5.1M', net: 'RWF 4.2M', detail: 'Dark beer demographic' }
            ].map((p, idx) => (
              <div key={idx} style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '13.5px', color: '#FFFFFF' }}>{p.name}</strong>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981' }}>{p.gross} Gross</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94A3B8', marginTop: '4px' }}>
                  <span>Margin: <strong style={{ color: '#FBBF24' }}>{p.margin}</strong> ({p.marginPct})</span>
                  <span>Net Profit: <strong style={{ color: '#38BDF8' }}>{p.net}</strong></span>
                </div>
              </div>
            ))}

            {profitDimension === 'customer' && [
              { name: 'Kigali Serena Hotel', gross: 'RWF 4.8M', net: 'RWF 4.1M', marginPct: '18.4%', detail: 'A-Tier Hospitality (Heineken & Amstel)' },
              { name: 'Simba Supermarket Gishushu', gross: 'RWF 3.9M', net: 'RWF 3.2M', marginPct: '16.2%', detail: 'A-Tier Supermarket chain' },
              { name: 'Chez Lando Hotel & Restaurant', gross: 'RWF 2.7M', net: 'RWF 2.3M', marginPct: '15.8%', detail: 'B-Tier Commercial account' },
              { name: 'Papyrus Restaurant Kimihurura', gross: 'RWF 1.8M', net: 'RWF 1.4M', marginPct: '14.9%', detail: 'Nightlife venue' }
            ].map((c, idx) => (
              <div key={idx} style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '13.5px', color: '#FFFFFF' }}>{c.name}</strong>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981' }}>{c.gross} Profit</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94A3B8', marginTop: '4px' }}>
                  <span>{c.detail}</span>
                  <span>Margin: <strong style={{ color: '#FBBF24' }}>{c.marginPct}</strong></span>
                </div>
              </div>
            ))}

            {profitDimension === 'route' && [
              { name: 'Kiyovu & Downtown Corridor', gross: 'RWF 6.8M', net: 'RWF 5.4M', marginPct: '17.2%', detail: 'Low fuel consumption route' },
              { name: 'Remera & Kisimenti Strip', gross: 'RWF 5.9M', net: 'RWF 4.6M', marginPct: '16.5%', detail: 'High crate volume turnover' },
              { name: 'Kacyiru & Kimihurura Nightlife', gross: 'RWF 4.2M', net: 'RWF 3.5M', marginPct: '18.1%', detail: 'High premium beer margin' },
              { name: 'Nyamirambo & Gitega Outlets', gross: 'RWF 3.1M', net: 'RWF 2.4M', marginPct: '15.0%', detail: 'High cash collection rate' }
            ].map((r, idx) => (
              <div key={idx} style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '13.5px', color: '#FFFFFF' }}>{r.name}</strong>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981' }}>{r.gross} Profit</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94A3B8', marginTop: '4px' }}>
                  <span>{r.detail}</span>
                  <span>Net Margin: <strong style={{ color: '#38BDF8' }}>{r.marginPct}</strong></span>
                </div>
              </div>
            ))}

            {profitDimension === 'salesperson' && salespeople.slice(0, 4).map((rep) => (
              <div key={rep.id} style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '13.5px', color: '#FFFFFF' }}>{rep.name}</strong>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981' }}>
                    RWF {(((rep.actualRevenueRWF || 0) * 0.21) / 1000000).toFixed(2)}M Margin
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94A3B8', marginTop: '4px' }}>
                  <span>Territory: {rep.territory}</span>
                  <span>Target Met: <strong style={{ color: (rep.achievementPercentage || 0) >= 100 ? '#10B981' : '#F59E0B' }}>{rep.achievementPercentage || 0}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clients Directory & FEATURE 17: Sales Team Performance */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Clients Directory & Credit Status */}
          <div
            id="clients-directory"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Clients Directory & Credit Exposure
                </h3>
                <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>186 Active Clients • 38 Inactive</span>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {(['all', 'active', 'inactive'] as const).map((cf) => (
                  <button
                    key={cf}
                    onClick={() => setCustomerFilter(cf)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: customerFilter === cf ? 700 : 500,
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: customerFilter === cf ? '#38BDF8' : 'rgba(255,255,255,0.06)',
                      color: customerFilter === cf ? '#FFFFFF' : '#CBD5E1',
                      cursor: 'pointer'
                    }}
                  >
                    {cf.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {customers.slice(0, 4).map((c) => (
                <div key={c.id} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>{c.tradeName} • Last purchase: 2 days ago (80 crates)</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: c.currentExposure > c.creditLimit ? '#EF4444' : '#FFFFFF' }}>
                      RWF {c.currentExposure.toLocaleString()} Debt
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#10B981' }}>Credit Limit: RWF {c.creditLimit.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 17: Sales Team Performance */}
          <div
            id="feat-17"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Feature 17 • Sales Team Performance & Rep Quotas
              </h3>
              <span style={{ fontSize: '11.5px', color: '#38BDF8', fontWeight: 700 }}>Collections & Discounts</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {salespeople.slice(0, 4).map((rep) => (
                <div key={rep.id} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>{rep.name}</strong>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: (rep.achievementPercentage || 0) >= 100 ? '#10B981' : '#F59E0B' }}>
                      {rep.achievementPercentage || 0}% Target
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
                    <span>Territory: {rep.territory}</span>
                    <span>Actual: RWF {(((rep.actualRevenueRWF || 0)) / 1000000).toFixed(1)}M</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
                    <span>Cash Collected: 94.2%</span>
                    <span>Avg Discount: 1.8% • +4 New Outlets</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================================
          SECTION 3: INVENTORY, BREWERY SUPPLY, EMPTIES & LOSS CONTROL
          (Features 4, 5, 22, 11, 12)
          ========================================================================================= */}
      <div id="sec-inventory" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* FEATURE 4: Inventory Overview */}
        <div
          id="feat-4"
          style={{
            padding: '22px 24px',
            backgroundColor: 'rgba(8, 22, 50, 0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Feature 4 • Inventory Overview (Current, Reserved, Damaged, Overstock & Days Cover)
              </h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0' }}>
                Safety stock protection across company warehouses
              </p>
            </div>
            <button onClick={() => setCurrentNav('inventory')} className="btn btn-secondary btn-sm">
              Full Stock Ledger →
            </button>
          </div>

          {/* Warehouse Manager Floor Verified Data Banner */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(22, 163, 106, 0.12)',
              borderRadius: '12px',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              marginBottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                    backgroundColor: 'rgba(22, 163, 106, 0.25)',
                    color: '#34D399',
                    border: '1px solid rgba(52, 211, 153, 0.5)'
                  }}
                >
                  <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                  LIVE WAREHOUSE FLOOR COMMAND • MANAGER VERIFIED
                </span>
                <span style={{ fontSize: '12.5px', color: '#CBD5E1' }}>
                  Floor Inspector: <strong style={{ color: '#FFFFFF' }}>{managerFloorTelemetry.inspectorName}</strong>
                </span>
                <span style={{ fontSize: '11px', color: '#CBD5E1' }}>
                  ({managerFloorTelemetry.lastEditedText})
                </span>
              </div>

              <button
                onClick={() => setCurrentNav('warehouse_dashboard')}
                style={{
                  padding: '7px 15px',
                  backgroundColor: '#16A36A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(22, 163, 106, 0.35)'
                }}
              >
                <span>Open Warehouse Floor Command</span>
                <ArrowRight size={13} color="#FFFFFF" />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
              <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11px' }}>Floor Health Status:</span>
                <strong style={{ color: managerFloorTelemetry.status === 'GOOD' ? '#34D399' : managerFloorTelemetry.status === 'FAIR' ? '#FBBF24' : '#F87171', fontSize: '13px' }}>
                  {managerFloorTelemetry.status} STATUS
                </strong>
              </div>

              <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11px' }}>Physical Stock Accuracy:</span>
                <strong style={{ color: '#38BDF8', fontSize: '13px' }}>
                  {managerFloorTelemetry.stockAccuracyText}
                </strong>
                <span style={{ display: 'block', fontSize: '10.5px', color: '#CBD5E1' }}>{managerFloorTelemetry.stockAccuracyDetails}</span>
              </div>

              <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11px' }}>Loss & Damage Log:</span>
                <strong style={{ color: '#FBBF24', fontSize: '13px' }}>
                  {managerFloorTelemetry.lossDamageText}
                </strong>
                <span style={{ display: 'block', fontSize: '10.5px', color: '#CBD5E1' }}>{managerFloorTelemetry.lossDamageDetails}</span>
              </div>

              <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11px' }}>Critical Runway Alert:</span>
                <strong style={{ color: '#F87171', fontSize: '13px' }}>
                  {managerFloorTelemetry.alertText}
                </strong>
              </div>
            </div>

            {managerFloorTelemetry.shiftNotes && (
              <div style={{ fontSize: '11.5px', color: '#CBD5E1', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '8px' }}>
                <strong style={{ color: '#FFFFFF' }}>Manager Daily Inspection Remarks: </strong>
                <span>"{managerFloorTelemetry.shiftNotes}"</span>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '12px' }}>
            {inventory.slice(0, 6).map((item) => {
              const p = products.find((prod) => prod.id === item.productId);
              const coverColor = item.stockCoverDays < 2.0 ? '#EF4444' : item.stockCoverDays < 3.5 ? '#F59E0B' : '#10B981';

              return (
                <div key={item.id} style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{p?.name || item.productId}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{p?.packaging}</div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: coverColor, backgroundColor: `${coverColor}22`, padding: '2px 8px', borderRadius: '6px' }}>
                      {item.stockCoverDays}d Cover
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px' }}>
                    <span style={{ color: '#94A3B8' }}>On Hand Stock:</span>
                    <strong style={{ color: '#FFFFFF' }}>{item.onHandCrates.toLocaleString()} Crates</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '3px', color: '#94A3B8' }}>
                    <span>Reserved: {Math.round(item.onHandCrates * 0.12)} cr</span>
                    <span>Damaged: {Math.round(item.onHandCrates * 0.005)} cr</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '2px', color: '#64748B' }}>
                    <span>Reorder Point: {item.reorderPointCrates} cr</span>
                    <span>Status: {item.stockCoverDays < 2.0 ? '⚠️ Low Stock' : item.stockCoverDays > 14.0 ? 'Overstock' : 'Optimal'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FEATURE 5: Purchases & Receiving & FEATURE 22: Demand Forecasting */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Feature 5: Purchases & Receiving */}
          <div id="feat-5">
            <PurchasesReceivingCard
              onOpenReceivingTerminal={() => setCurrentNav('receiving')}
            />
          </div>

          {/* Feature 22: AI Demand Forecasting */}
          <div
            id="feat-22"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Feature 22 • Predictive Forecasting (Sales & Cash-Flow)
                </h3>
                <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 700 }}>Expected Stockouts & Collection Forecast</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {demandForecast.slice(0, 3).map((fc, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                    <span>{fc.productName}</span>
                    <span style={{ color: '#10B981' }}>+{fc.recommendedReorderCrates} cr suggested</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: '3px 0 0' }}>{fc.reasoning}</p>
                </div>
              ))}

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#CBD5E1' }}>14-Day Debt Collection Forecast:</span>
                <strong style={{ color: '#10B981' }}>RWF 31.6M Expected</strong>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 11: Crates & Empties Asset + FEATURE 12: Loss & Damage Control */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Feature 11: Crates & Empty Bottles */}
          <div
            id="feat-11"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(213, 160, 33, 0.35)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px' }}>
              Feature 11 • Crates & Empty Bottle Float Asset Control (Glass Capital)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Crates in Depot Warehouse:</span>
                <strong style={{ color: '#FFFFFF' }}>14,200 crates</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>With Retail Customers (At Outlets):</span>
                <strong style={{ color: '#FBBF24' }}>{emptiesCount.toLocaleString()} crates</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Loaded On Active Delivery Trucks:</span>
                <strong style={{ color: '#38BDF8' }}>1,850 crates</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Missing / Overdue Customer Returns:</span>
                <strong style={{ color: '#EF4444' }}>74 crates (Papyrus & Envy Club)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Damaged Crates (Awaiting Brewery Swap):</span>
                <strong style={{ color: '#F59E0B' }}>26 crates</strong>
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Financial Capital Value Locked:</span>
                <strong style={{ color: '#10B981', fontSize: '14px' }}>RWF {(emptiesCount * 4000).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Feature 12: Loss & Damage Control */}
          <div
            id="feat-12"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.35)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px' }}>
              Feature 12 • Loss, Damage, Theft & Discrepancy Control
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Transit Road Breakages (Monthly):</span>
                <strong style={{ color: '#EF4444' }}>14 crates (RWF 217,000)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Depot Bay Handling Damage:</span>
                <strong style={{ color: '#F59E0B' }}>4 crates (RWF 58,000)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Expired Products in Stock:</span>
                <strong style={{ color: '#10B981' }}>0 crates (Earliest Expiry: 74 days)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Theft & Discrepancies:</span>
                <strong style={{ color: '#10B981' }}>0 crates (100% Audit Verified)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Internal Shrinkage Rate:</span>
                <strong style={{ color: '#10B981' }}>0.18% (Ceiling: 0.50%)</strong>
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Pending Insurance Recoveries:</span>
                <strong style={{ color: '#38BDF8' }}>RWF 217,000 (Sanlam Claim #SN-881)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================================
          SECTION 4: FINANCIAL TREASURY, DEBT AGING & OPEX BREAKDOWN
          (Features 7, 8, 9, 10)
          ========================================================================================= */}
      <div id="sec-finance" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* FEATURE 7: Credit & Debt Management */}
        <div
          id="feat-7"
          style={{
            padding: '22px 24px',
            backgroundColor: 'rgba(8, 22, 50, 0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Feature 7 • Credit & Debt Management (Aging Buckets & Payment Promises)
              </h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0' }}>
                Total Receivables: RWF 41,800,000 • Overdue: RWF 10,200,000 • Total Limits: RWF 62,000,000
              </p>
            </div>
            <button onClick={() => setCurrentNav('debt')} className="btn btn-secondary btn-sm">
              Open Debt Center →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '14px' }}>
            <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '11px', color: '#A7F3D0', fontWeight: 700 }}>0–7 DAYS (HEALTHY)</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#10B981', marginTop: '2px' }}>RWF 18.2M</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Within normal grace window</div>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: '11px', color: '#FDE68A', fontWeight: 700 }}>8–30 DAYS (ATTENTION)</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#FBBF24', marginTop: '2px' }}>RWF 13.4M</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Follow-up reminders sent</div>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ fontSize: '11px', color: '#FCA5A5', fontWeight: 700 }}>31–60 DAYS (OVERDUE)</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#EF4444', marginTop: '2px' }}>RWF 7.1M</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Credit limit hold applied</div>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(153, 27, 27, 0.25)', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
              <div style={{ fontSize: '11px', color: '#FCA5A5', fontWeight: 800 }}>60+ DAYS (HIGH RISK)</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#F87171', marginTop: '2px' }}>RWF 3.1M</div>
              <div style={{ fontSize: '11px', color: '#FCA5A5' }}>Legal recovery notice active</div>
            </div>
          </div>

          {/* Payment Promises & Top Debtors */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#FBBF24', marginBottom: '8px' }}>
              CUSTOMER PAYMENT PROMISES LOG:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {[
                { name: 'Simba Supermarket Gishushu', owed: 'RWF 7.4M', promise: 'RWF 1.5M by Friday Oct 3', status: 'Confirmed by Director' },
                { name: 'Kigali Serena Hotel', owed: 'RWF 5.2M', promise: 'RWF 2.0M by Monday Oct 6', status: 'PO Voucher Approved' },
                { name: 'Chez Lando Restaurant', owed: 'RWF 2.1M', promise: 'RWF 800K by Thursday Oct 2', status: 'Cashier Pickup' }
              ].map((prom, i) => (
                <div key={i} style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)', fontSize: '11.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFFFFF', fontWeight: 700 }}>
                    <span>{prom.name}</span>
                    <span style={{ color: '#EF4444' }}>{prom.owed}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', marginTop: '3px' }}>
                    <span>Promise: {prom.promise}</span>
                    <span style={{ color: '#94A3B8' }}>{prom.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Command Telemetry Widget (Loaded from Accountant's manual inputs) */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            borderRadius: '14px',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(56, 189, 248, 0.25)',
                  color: '#38BDF8',
                  border: '1px solid rgba(56, 189, 248, 0.5)'
                }}
              >
                <span className="pulse-indicator" style={{ width: '6px', height: '6px' }} />
                LIVE FINANCIAL COMMAND • ACCOUNTANT VERIFIED
              </span>
              <span style={{ fontSize: '12.5px', color: '#CBD5E1' }}>
                Lead Accountant: <strong style={{ color: '#FFFFFF' }}>{accountantTelemetry.leadAccountantName} ({accountantTelemetry.cpaRegistration})</strong>
              </span>
              <span style={{ fontSize: '11px', color: '#CBD5E1' }}>
                ({accountantTelemetry.lastEditedTimestamp})
              </span>
            </div>

            <button
              onClick={() => setCurrentNav('accountant_dashboard')}
              style={{
                padding: '7px 15px',
                backgroundColor: '#3478F6',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(52, 120, 246, 0.35)'
              }}
            >
              <span>Open Accountant Financial Portal</span>
              <ArrowRight size={13} color="#FFFFFF" />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
            <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11px' }}>General Ledger Audit:</span>
              <strong style={{ color: accountantTelemetry.status === 'BALANCED' ? '#34D399' : '#FBBF24', fontSize: '13px' }}>
                {accountantTelemetry.status} STATUS
              </strong>
              <span style={{ display: 'block', fontSize: '10.5px', color: '#CBD5E1' }}>Zero Posting Variance</span>
            </div>

            <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11px' }}>Liquid Treasury Position:</span>
              <strong style={{ color: '#38BDF8', fontSize: '13px' }}>
                RWF {(accountantTelemetry.totalLiquidCash / 1000000).toFixed(1)}M
              </strong>
              <span style={{ display: 'block', fontSize: '10.5px', color: '#CBD5E1' }}>
                BK: {(accountantTelemetry.bankBKBalance / 1000000).toFixed(1)}M • MoMo: {(accountantTelemetry.momoBalance / 1000000).toFixed(1)}M
              </span>
            </div>

            <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11px' }}>Daily Cash Reconciliation:</span>
              <strong style={{ color: accountantTelemetry.reconVariance === 0 ? '#34D399' : '#F87171', fontSize: '13px' }}>
                {accountantTelemetry.reconVariance === 0 ? 'BALANCED' : `VAR RWF ${accountantTelemetry.reconVariance.toLocaleString()}`}
              </strong>
              <span style={{ display: 'block', fontSize: '10.5px', color: '#CBD5E1' }}>
                Actual: RWF {(accountantTelemetry.actualTotalCounted / 1000000).toFixed(1)}M
              </span>
            </div>

            <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11px' }}>Net EBITDA MTD:</span>
              <strong style={{ color: '#34D399', fontSize: '13px' }}>
                RWF {(accountantTelemetry.netEbitdaMTD / 1000000).toFixed(1)}M ({accountantTelemetry.netMarginPercent}%)
              </strong>
              <span style={{ display: 'block', fontSize: '10.5px', color: '#CBD5E1' }}>
                Gross Margin: {accountantTelemetry.grossMarginPercent}%
              </span>
            </div>
          </div>

          {accountantTelemetry.shiftRemarks && (
            <div style={{ fontSize: '11.5px', color: '#CBD5E1', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '8px' }}>
              <strong style={{ color: '#FFFFFF' }}>Accountant Daily Sign-Off Remarks: </strong>
              <span>"{accountantTelemetry.shiftRemarks}"</span>
            </div>
          )}
        </div>

        {/* FEATURE 8: Cash & Payment Management + FEATURE 9: Daily Reconciliation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Feature 8: Cash & Payment Management */}
          <div
            id="feat-8"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Feature 8 • Cash, Mobile Money & Bank Payments
              </h3>
              <button onClick={() => setShowSweepModal(true)} className="btn btn-primary btn-sm">
                ⚡ Treasury Sweep
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <span style={{ color: '#CBD5E1' }}>Bank of Kigali Main Operations:</span>
                <strong style={{ color: '#FFFFFF' }}>RWF {accountantTelemetry.bankBKBalance.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <span style={{ color: '#CBD5E1' }}>MTN Mobile Money Merchant Pool:</span>
                <strong style={{ color: '#FBBF24' }}>RWF {accountantTelemetry.momoBalance.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <span style={{ color: '#CBD5E1' }}>Physical Cashier Safe Vault:</span>
                <strong style={{ color: '#10B981' }}>RWF {accountantTelemetry.vaultCashBalance.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                <span style={{ color: '#CBD5E1' }}>Bralirwa Replenishment Escrow:</span>
                <strong style={{ color: '#38BDF8' }}>RWF {accountantTelemetry.escrowBalance.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Feature 9: Daily Reconciliation */}
          <div
            id="feat-9"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(213, 160, 33, 0.35)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px' }}>
              Feature 9 • Daily Cashier Reconciliation & Variances
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Expected Money:</span>
                <strong style={{ color: '#FFFFFF' }}>RWF {accountantTelemetry.expectedRevenue.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Actual Money Collected:</span>
                <strong style={{ color: '#10B981' }}>RWF {accountantTelemetry.actualTotalCounted.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Cash Shortages:</span>
                <strong style={{ color: '#EF4444' }}>
                  {accountantTelemetry.reconVariance < 0 ? `- RWF ${Math.abs(accountantTelemetry.reconVariance).toLocaleString()}` : '—'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Cash Overages:</span>
                <strong style={{ color: '#10B981' }}>
                  {accountantTelemetry.reconVariance > 0 ? `+ RWF ${accountantTelemetry.reconVariance.toLocaleString()}` : '+ RWF 0'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Unresolved Variances:</span>
                <strong style={{ color: '#FBBF24' }}>
                  {accountantTelemetry.reconVariance !== 0 ? `RWF ${Math.abs(accountantTelemetry.reconVariance).toLocaleString()} (Under Review)` : '0 RWF (Balanced)'}
                </strong>
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '6px', fontSize: '11px', color: '#10B981' }}>
                ✓ Reconciled & certified by {accountantTelemetry.leadAccountantName} ({accountantTelemetry.cpaRegistration}).
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 10: Expenses (Fuel, salaries, rent, maintenance, utilities, transport, marketing, other) */}
        <div
          id="feat-10"
          style={{
            padding: '22px 24px',
            backgroundColor: 'rgba(8, 22, 50, 0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Feature 10 • Operating Expenses Breakdown (OpEx)
              </h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Total OpEx MTD: RWF 14,280,000 (All Categories)</span>
            </div>
            <button onClick={() => setCurrentNav('expenses')} className="btn btn-secondary btn-sm">
              OpEx Ledger →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {[
              { category: 'Truck Fuel & Diesel', amount: 'RWF 4,120,000', pct: '28.8%', status: 'Within Quota' },
              { category: 'Staff Salaries', amount: 'RWF 5,200,000', pct: '36.4%', status: 'Paid Sep 28' },
              { category: 'Depot Rent & Leases', amount: 'RWF 2,400,000', pct: '16.8%', status: 'Current' },
              { category: 'Vehicle Maintenance', amount: 'RWF 1,480,000', pct: '10.4%', status: 'RAD 245 H' },
              { category: 'Depot Utilities', amount: 'RWF 1,080,000', pct: '7.6%', status: 'Gikondo' },
              { category: 'Subcontract Transport', amount: 'RWF 650,000', pct: '4.5%', status: 'Auxiliary Trucks' },
              { category: 'Retailer Marketing', amount: 'RWF 420,000', pct: '2.9%', status: 'Bar Signage' },
              { category: 'Other OpEx & Misc', amount: 'RWF 280,000', pct: '1.9%', status: 'Office & Admin' }
            ].map((exp, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{exp.category}</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 2px' }}>{exp.amount}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#38BDF8' }}>
                  <span>{exp.pct}</span>
                  <span>{exp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================================
          SECTION 5: LOGISTICS, DISPATCH, LIVE RADAR & FLEET MANAGEMENT
          (Features 13, 15, 14, 18)
          ========================================================================================= */}
      <div id="sec-logistics" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* FEATURE 13: Delivery Management + FEATURE 15: Live Delivery Tracking */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Feature 15: Live Delivery Radar */}
          <div
            id="feat-15"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} color="#38BDF8" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Feature 15 • Live GPS Delivery Telematics & Route Progress
                </h3>
              </div>
              <button onClick={() => setCurrentNav('delivery_map')} className="btn btn-primary btn-sm">
                View Full Map →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { truck: 'Truck 01 • RAD 245 H', driver: 'Bosco Nshimiyimana', route: 'Nyarugenge & Kiyovu', stops: '18/20 (90%)', value: 'RWF 6.4M' },
                { truck: 'Truck 02 • RAC 109 B', driver: 'Faustin Karisa', route: 'Remera & Kimironko', stops: '14/18 (77%)', value: 'RWF 5.8M' },
                { truck: 'Truck 03 • RAE 802 K', driver: 'Eric Mugabo', route: 'Gisozi & Kacyiru', stops: '11/15 (73%)', value: 'RWF 4.2M' }
              ].map((t, idx) => (
                <div key={idx} style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                    <span>{t.truck} ({t.driver})</span>
                    <span style={{ color: '#10B981' }}>{t.stops}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94A3B8', marginTop: '3px' }}>
                    <span>Territory: {t.route}</span>
                    <span>Route Cargo Value: <strong style={{ color: '#FBBF24' }}>{t.value}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 13: Delivery Management Status */}
          <div
            id="feat-13"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 14px' }}>
              Feature 13 • Delivery Dispatch Board (All 6 Lifecycle States)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 700 }}>SCHEDULED</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>12 runs</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(56, 189, 248, 0.1)' }}>
                <div style={{ fontSize: '10.5px', color: '#BAE6FD', fontWeight: 700 }}>IN TRANSIT</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#38BDF8', marginTop: '2px' }}>34 stops</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <div style={{ fontSize: '10.5px', color: '#A7F3D0', fontWeight: 700 }}>COMPLETED</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#10B981', marginTop: '2px' }}>58 stops</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <div style={{ fontSize: '10.5px', color: '#FCA5A5', fontWeight: 700 }}>FAILED</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#EF4444', marginTop: '2px' }}>0 stops</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <div style={{ fontSize: '10.5px', color: '#FDE68A', fontWeight: 700 }}>DELAYED</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#FBBF24', marginTop: '2px' }}>4 stops</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(147, 51, 234, 0.1)' }}>
                <div style={{ fontSize: '10.5px', color: '#E9D5FF', fontWeight: 700 }}>RESCHEDULED</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#C084FC', marginTop: '2px' }}>1 stop</div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 14: Fleet Management + FEATURE 18: Driver Performance */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Feature 14: Fleet Management */}
          <div
            id="feat-14"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Feature 14 • Fleet Management (Trucks, Fuel, Mileage, Insurance & Inspection)
              </h3>
              <button onClick={() => setCurrentNav('fleet')} className="btn btn-secondary btn-sm">
                Full Fleet →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {vehicles.slice(0, 3).map((v) => (
                <div key={v.id} style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>{v.plateNumber} • {v.model}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                      Driver: {v.assignedDriverName || 'Spare'} • Odometer: 142,800 km • Fuel: 24.5 L/100km
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                      Insurance: Sanlam (Exp: Dec 2026) • Inspection: Police Contrôle Technique (Valid)
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', backgroundColor: v.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: v.status === 'active' ? '#10B981' : '#F59E0B' }}>
                      {v.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 18: Driver Performance */}
          <div
            id="feat-18"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 14px' }}>
              Feature 18 • Driver Performance Scorecard
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Bosco Nshimiyimana', delivered: 18, failed: 0, cash: 'RWF 4.2M', empties: 120, fuel: '24.2 L', complaints: 0, score: '99.4%' },
                { name: 'Faustin Karisa', delivered: 14, failed: 0, cash: 'RWF 3.8M', empties: 95, fuel: '25.0 L', complaints: 0, score: '97.8%' },
                { name: 'Eric Mugabo', delivered: 11, failed: 0, cash: 'RWF 2.9M', empties: 80, fuel: '23.8 L', complaints: 0, score: '98.5%' }
              ].map((d, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{d.name}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                      Cash: {d.cash} • Empties: {d.empties} cr • Complaints: {d.complaints}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>{d.delivered} Stops Done</div>
                    <div style={{ fontSize: '11px', color: '#38BDF8' }}>Score: {d.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================================
          SECTION 6: GOVERNANCE, APPROVALS, SECURITY & COMPLIANCE
          (Features 19, 20, 24, 26)
          ========================================================================================= */}
      <div id="sec-governance" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* FEATURE 19: Approval Center (All 8 Request Types) */}
        <div
          id="feat-19"
          style={{
            padding: '22px 24px',
            backgroundColor: 'rgba(8, 22, 50, 0.85)',
            borderRadius: '16px',
            border: '1.5px solid rgba(56, 189, 248, 0.35)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Feature 19 • Executive Approval Center
              </h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                Credit Increases • Large Discounts • Stock Adjustments • Write-Offs • Refunds • Expenses • Large Purchases • Debt Write-offs
              </span>
            </div>
            {pendingApprovals.length > 0 && (
              <button onClick={handleBatchApproveLowRisk} className="btn btn-primary btn-sm">
                ⚡ Batch Approve Low-Risk ({pendingApprovals.filter((a) => a.riskScore === 'LOW').length})
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
            {executiveApprovals.map((item) => (
              <div key={item.id} style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>{item.title}</span>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0' }}>{item.entityName}</div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>Requested by {item.requestedByName}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF' }}>RWF {item.amountRWF.toLocaleString()}</div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: item.riskScore === 'HIGH' ? '#EF4444' : '#10B981' }}>
                      Risk: {item.riskScore}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '11.5px', color: '#CBD5E1', margin: '8px 0', backgroundColor: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px' }}>
                  {item.rationale}
                </p>

                {item.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button
                      onClick={() => approveExecutiveItem(item.id)}
                      style={{ flex: 1, padding: '7px', borderRadius: '6px', backgroundColor: '#16A36A', color: '#FFFFFF', border: 'none', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setInspectingItem(item)}
                      style={{ padding: '7px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.15)', fontSize: '11.5px', cursor: 'pointer' }}
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => rejectExecutiveItem(item.id, 'Declined by Owner.')}
                      style={{ padding: '7px 12px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)', fontSize: '11.5px', cursor: 'pointer' }}
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: item.status === 'approved' ? '#10B981' : '#F87171', fontWeight: 700, marginTop: '8px' }}>
                    {item.status === 'approved' ? '✓ Approved & Released' : '✕ Declined'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FEATURE 20: Alerts & Risk Center + FEATURE 26: Security Center */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Feature 20: Alerts & Risk Center */}
          <div
            id="feat-20"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Feature 20 • Alerts & Operational Risk Center
              </h3>
              <button onClick={() => setCurrentNav('alerts')} className="btn btn-secondary btn-sm">
                View All Alerts →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { title: 'Critical Low Stock: Primus 50CL', severity: 'critical', desc: 'Cover below 2 days at Gikondo Hub. Reorder suggested.' },
                { title: 'Overdue Debt Risk: Envy Club', severity: 'warning', desc: 'RWF 3.1M unpaid for 60+ days. Automatic credit suspension.' },
                { title: 'Missing Cash Variance: Cashier Safe', severity: 'warning', desc: 'RWF 120,000 variance detected on Tuesday reconciliations.' },
                { title: 'Crate Loss Risk: Papyrus Bar', severity: 'info', desc: '42 unreturned crates overdue by 14 days.' }
              ].map((a, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF' }}>
                    <span>{a.title}</span>
                    <span style={{ color: a.severity === 'critical' ? '#EF4444' : a.severity === 'warning' ? '#FBBF24' : '#38BDF8', fontSize: '10px', textTransform: 'uppercase' }}>
                      {a.severity}
                    </span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: '3px 0 0' }}>{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 26: Security Center */}
          <div
            id="feat-26"
            style={{
              padding: '22px 24px',
              backgroundColor: 'rgba(8, 22, 50, 0.85)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 14px' }}>
              Feature 26 • Security Center & Active Workstations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Active Sessions:</span>
                <strong style={{ color: '#10B981' }}>3 Connected Workstations (Depots & HQ)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>MFA Security:</span>
                <strong style={{ color: '#10B981' }}>Enforced for all Manager Accounts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Failed Logins (24h):</span>
                <strong style={{ color: '#10B981' }}>0 Failed Attempts (Clear)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Suspicious Access:</span>
                <strong style={{ color: '#10B981' }}>None Detected</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Session Encryption:</span>
                <strong style={{ color: '#38BDF8' }}>AES-256 TLS 1.3 Active</strong>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 24: Audit Trail (Who changed what, previous value, new value, who approved) */}
        <div
          id="feat-24"
          style={{
            padding: '22px 24px',
            backgroundColor: 'rgba(8, 22, 50, 0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Feature 24 • Immutable Audit Trail (Who Changed What, Previous vs New Value & Approvals)
              </h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Strict RRA EBM & internal compliance logging</span>
            </div>
            <button onClick={() => setCurrentNav('audit')} className="btn btn-secondary btn-sm">
              Full Audit Vault →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { user: 'Jean-Claude Mugabo', action: 'Stock Adjustment (Gate 2)', prev: '13,400 crates', next: '14,200 crates', approvedBy: 'Owner Kagabo', time: '11:42 AM' },
              { user: 'Claire Umutoni (CPA)', action: 'Credit Limit Extended (Simba)', prev: 'RWF 6.0M', next: 'RWF 8.4M', approvedBy: 'Owner Kagabo', time: '10:15 AM' },
              { user: 'Aline Uwase', action: 'Daily Vault Cash Drop', prev: 'RWF 0 verified', next: 'RWF 14.2M reconciled', approvedBy: 'Controller Claire', time: '08:50 AM' }
            ].map((log, i) => (
              <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <strong style={{ color: '#FFFFFF' }}>{log.action}</strong>
                  <span style={{ color: '#94A3B8', marginLeft: '6px' }}>by {log.user}</span>
                  <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>
                    Prev: <span style={{ color: '#F87171' }}>{log.prev}</span> &rarr; New: <span style={{ color: '#10B981' }}>{log.next}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#38BDF8', fontWeight: 600 }}>Approved by {log.approvedBy}</div>
                  <div style={{ color: '#64748B', fontSize: '11px' }}>{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================================
          SECTION 7: STRATEGIC AI INTELLIGENCE, REPORTS, TEAM & COMPANY SETTINGS
          (Features 21, 23, 16, 25, 27)
          ========================================================================================= */}
      <div id="sec-intelligence" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* FEATURE 21: AI Business Assistant */}
        <div
          id="feat-21"
          style={{
            padding: '24px',
            backgroundColor: 'rgba(8, 22, 50, 0.85)',
            borderRadius: '16px',
            border: '1.5px solid rgba(213, 160, 33, 0.4)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot size={22} color="#FBBF24" />
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  Feature 21 • AI Business Assistant (Owner Strategy Intelligence)
                </h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0' }}>
                  Ask questions about profit changes, customer risk, stock replenishment, or losses
                </p>
              </div>
            </div>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
              Connected to ERP Ledger
            </span>
          </div>

          {/* Quick Prompt Chips (All 4 User-Requested Prompts) */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              'Why did profit fall?',
              'Who owes us the most?',
              'What should we reorder?',
              'Where are we losing money?'
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleAiQuestion(q)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(213, 160, 33, 0.15)',
                  border: '1px solid rgba(213, 160, 33, 0.35)',
                  color: '#FDE68A',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                💬 “{q}”
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div
            style={{
              minHeight: '180px',
              maxHeight: '320px',
              overflowY: 'auto',
              backgroundColor: 'rgba(2, 6, 23, 0.7)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {aiChatHistory.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '4px'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    backgroundColor: msg.sender === 'user' ? '#1E3A8A' : 'rgba(255, 255, 255, 0.06)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>{msg.time}</span>
              </div>
            ))}
            {isAiThinking && (
              <div style={{ color: '#FBBF24', fontSize: '12px', fontStyle: 'italic' }}>
                Analyzing ERP distribution records...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Ask anything about your distribution business (sales, margin, debt, drivers, breakages)..."
              value={aiQueryInput}
              onChange={(e) => setAiQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && aiQueryInput.trim()) {
                  handleAiQuestion(aiQueryInput.trim());
                  setAiQueryInput('');
                }
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(2, 6, 23, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              onClick={() => {
                if (aiQueryInput.trim()) {
                  handleAiQuestion(aiQueryInput.trim());
                  setAiQueryInput('');
                }
              }}
              className="btn btn-primary"
            >
              <Send size={15} />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* FEATURE 23: Executive Reports */}
        <div
          id="feat-23"
          style={{
            padding: '22px 24px',
            backgroundColor: 'rgba(8, 22, 50, 0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 14px' }}>
            Feature 23 • One-Click Executive Reports & Statements Suite (All 10 Categories)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {[
              { name: '1. Sales & Growth Trends', format: 'PDF / CSV' },
              { name: '2. Inventory Stock Valuation', format: 'Excel / CSV' },
              { name: '3. Monthly P&L Audit', format: 'PDF / RRA' },
              { name: '4. Debt Aging & Receivables', format: 'PDF / Bank' },
              { name: '5. Cash & Bank Collections', format: 'Excel' },
              { name: '6. OpEx Breakdown', format: 'PDF' },
              { name: '7. Crates & Glass Deposit Float', format: 'Excel' },
              { name: '8. Retail Customers Performance', format: 'CSV' },
              { name: '9. Fleet & Fuel Efficiency', format: 'PDF' },
              { name: '10. Employee & Rep Targets', format: 'PDF' }
            ].map((rep, idx) => (
              <button
                key={idx}
                onClick={() => showToast(`Generating ${rep.name}... Download ready.`)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: '11.5px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700 }}>{rep.name}</div>
                <div style={{ color: '#38BDF8', fontSize: '10px', marginTop: '3px' }}>Format: {rep.format}</div>
              </button>
            ))}
          </div>
        </div>

        {/* FEATURE 16: Employee Management & FEATURE 25: User & Permission Management */}
        <div
          id="feat-16"
          style={{
            padding: '22px 24px',
            backgroundColor: 'rgba(8, 22, 50, 0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Features 16 & 25 • Employee Management, Roster & Warehouse Permissions
              </h3>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                12 Active Authorized Profiles for {currentTenant.name} • 98.4% Biometric Depot Attendance
              </span>
            </div>
            <button
              onClick={() => showToast('Staff invitation dispatched. New profile credential generated.')}
              className="btn btn-primary btn-sm"
            >
              <UserPlus size={14} />
              <span>Add Employee / Assign Role</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {ALL_USER_CREDENTIALS.map((usr) => (
              <div key={usr.id} style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={usr.avatar} alt={usr.name} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {usr.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>{usr.roleTitle}</div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                    {usr.department}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Email: <strong style={{ color: '#CBD5E1' }}>{usr.email}</strong></span>
                  <span style={{ color: '#10B981' }}>Active • Gikondo Depot</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURE 27: Company Settings */}
        <div
          id="feat-27"
          style={{
            padding: '22px 24px',
            backgroundColor: 'rgba(8, 22, 50, 0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Feature 27 • Company Profile, Tax & Depot Configurations
            </h3>
            <button onClick={() => setCurrentNav('settings')} className="btn btn-secondary btn-sm">
              Edit Settings
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', fontSize: '12px' }}>
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ color: '#94A3B8' }}>Company Legal Entity:</div>
              <strong style={{ color: '#FFFFFF', fontSize: '13px' }}>{currentTenant.name}</strong>
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ color: '#94A3B8' }}>Rwanda Revenue Authority TIN:</div>
              <strong style={{ color: '#FFFFFF', fontSize: '13px' }}>{currentTenant.tinNumber}</strong>
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ color: '#94A3B8' }}>BRALIRWA License:</div>
              <strong style={{ color: '#FBBF24', fontSize: '13px' }}>{currentTenant.licenseNumber}</strong>
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ color: '#94A3B8' }}>Physical Address:</div>
              <strong style={{ color: '#FFFFFF', fontSize: '13px' }}>{currentTenant.address}</strong>
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ color: '#94A3B8' }}>Tax Configuration:</div>
              <strong style={{ color: '#10B981', fontSize: '13px' }}>VAT 18% Standard • Withholding 3% • RRA EBM V2</strong>
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ color: '#94A3B8' }}>Executive Approval Limit:</div>
              <strong style={{ color: '#FBBF24', fontSize: '13px' }}>Owner Auto-clearance &gt; RWF 5,000,000</strong>
            </div>
          </div>
        </div>
      </div>
      </div>
      )}

      {/* =========================================================================
          MODALS & FLYOUT PANELS
          ========================================================================= */}

      {/* 1. Treasury Sweep Modal */}
      {showSweepModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={20} color="#FBBF24" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Execute Treasury Sweep
                </h3>
              </div>
              <button onClick={() => setShowSweepModal(false)} className="btn-ghost">
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: '#94A3B8', marginBottom: '16px' }}>
              Sweep liquid operational receipts into the dedicated Bralirwa Replenishment Escrow or Corporate Reserve.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                  Source Account:
                </label>
                <select
                  value={sweepSource}
                  onChange={(e) => setSweepSource(e.target.value as any)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#09152C', border: '1px solid #1E3B70', color: '#FFFFFF' }}
                >
                  <option value="MoMo">MTN Mobile Money Merchant Pool (Bal: RWF 14.8M)</option>
                  <option value="Vault">Cashier Safe Vault (Bal: RWF 6.42M)</option>
                  <option value="BK">Bank of Kigali Main Account (Bal: RWF 48.25M)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                  Target Destination:
                </label>
                <select
                  value={sweepTarget}
                  onChange={(e) => setSweepTarget(e.target.value as any)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#09152C', border: '1px solid #1E3B70', color: '#FFFFFF' }}
                >
                  <option value="Bralirwa Escrow">Bralirwa Replenishment Escrow (Gisenyi Plant PO Pre-fund)</option>
                  <option value="Treasury Reserve">High-Yield Treasury Reserve</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                  Amount to Sweep (RWF):
                </label>
                <input
                  type="number"
                  value={sweepAmount}
                  onChange={(e) => setSweepAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#09152C', border: '1px solid #1E3B70', color: '#FFFFFF', fontSize: '14px', fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSweepModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleExecuteSweep} disabled={isSweeping} className="btn btn-primary">
                {isSweeping ? 'Sweeping Funds...' : 'Authorize Sweep'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Board Statement Modal */}
      {showBoardModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Board Executive Statement
                </h3>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>{currentTenant.name} • Certified Distribution Audit</span>
              </div>
              <button onClick={() => setShowBoardModal(false)} className="btn-ghost">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#040C1A', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Period Invoiced Revenue:</span>
                <strong style={{ color: '#FFFFFF' }}>RWF {todayRevenue.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Gross Operating Profit:</span>
                <strong style={{ color: '#10B981' }}>RWF {grossProfitEstimate.toLocaleString()} (21.1%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Net Operating Profit:</span>
                <strong style={{ color: '#38BDF8' }}>RWF {netProfitEstimate.toLocaleString()} (15.2%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Total Stock Capital:</span>
                <strong style={{ color: '#FFFFFF' }}>RWF {totalStockValue.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Receivables Exposure:</span>
                <strong style={{ color: '#F87171' }}>RWF {totalOutstandingDebt.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Crates & Glass Asset Float:</span>
                <strong style={{ color: '#FBBF24' }}>RWF {(emptiesCount * 4000).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Audit Compliance Score:</span>
                <strong style={{ color: '#10B981' }}>92 / 100 (Unqualified Audit Clean)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setShowBoardModal(false)} className="btn btn-secondary">
                Close
              </button>
              <button
                onClick={() => {
                  showToast('Board Statement exported to PDF.');
                  setShowBoardModal(false);
                }}
                className="btn btn-primary"
              >
                <Download size={14} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Direct Brewery PO Modal */}
      {quickPOModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Direct Brewery PO Release (BRALIRWA PLC)
              </h3>
              <button onClick={() => setQuickPOModalOpen(false)} className="btn-ghost">
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Select Product:</label>
                <select
                  value={selectedPOProduct?.id || products[0]?.id}
                  onChange={(e) => {
                    const prod = products.find((p) => p.id === e.target.value);
                    setSelectedPOProduct(prod || null);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#09152C', border: '1px solid #1E3B70', color: '#FFFFFF' }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.packaging})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Crates to Order:</label>
                <input
                  type="number"
                  value={poCratesToOrder}
                  onChange={(e) => setPoCratesToOrder(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#09152C', border: '1px solid #1E3B70', color: '#FFFFFF', fontSize: '14px', fontWeight: 700 }}
                />
              </div>

              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Estimated Total:</span>
                  <strong style={{ color: '#FBBF24' }}>
                    RWF {((selectedPOProduct?.bralirwaPurchasePrice || 14200) * poCratesToOrder).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setQuickPOModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  createPurchaseOrder({
                    supplier: 'BRALIRWA Plc - Gisenyi Brewery',
                    items: [
                      {
                        productId: selectedPOProduct?.id || products[0]?.id,
                        orderedCrates: poCratesToOrder,
                        unitPrice: selectedPOProduct?.bralirwaPurchasePrice || 14200,
                        totalAmount: (selectedPOProduct?.bralirwaPurchasePrice || 14200) * poCratesToOrder
                      }
                    ],
                    totalAmount: (selectedPOProduct?.bralirwaPurchasePrice || 14200) * poCratesToOrder,
                    status: 'ordered_bralirwa'
                  });
                  setQuickPOModalOpen(false);
                  showToast(`PO issued to Bralirwa for ${poCratesToOrder} crates!`);
                }}
                className="btn btn-primary"
              >
                Submit PO to Brewery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Inspection Modal */}
      {inspectingItem && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>
                  Inspection Desk
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {inspectingItem.title}
                </h3>
              </div>
              <button onClick={() => setInspectingItem(null)} className="btn-ghost">
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#09152C', border: '1px solid #1E3B70', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Entity:</span>
                <strong style={{ color: '#FFFFFF' }}>{inspectingItem.entityName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Requested Amount:</span>
                <strong style={{ color: '#FBBF24' }}>RWF {inspectingItem.amountRWF.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Requested By:</span>
                <strong style={{ color: '#FFFFFF' }}>{inspectingItem.requestedByName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Risk Assessment:</span>
                <strong style={{ color: inspectingItem.riskScore === 'HIGH' ? '#EF4444' : '#10B981' }}>{inspectingItem.riskScore} RISK</strong>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', color: '#CBD5E1' }}>
                <strong>Justification:</strong> {inspectingItem.rationale}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => {
                  rejectExecutiveItem(inspectingItem.id, 'Declined upon inspection by Owner.');
                  setInspectingItem(null);
                }}
                className="btn btn-secondary"
                style={{ color: '#F87171' }}
              >
                Decline
              </button>
              <button
                onClick={() => {
                  approveExecutiveItem(inspectingItem.id);
                  setInspectingItem(null);
                }}
                className="btn btn-primary"
              >
                Approve & Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Executive Approvals Center Modal */}
      {showApprovalsModal && (
        <div className="modal-backdrop" onClick={() => setShowApprovalsModal(false)}>
          <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} color="#10B981" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Executive Approvals Desk
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(213, 160, 33, 0.2)',
                    color: '#FBBF24',
                    border: '1px solid rgba(213, 160, 33, 0.4)'
                  }}
                >
                  {pendingApprovals.length} Pending
                </span>
              </div>
              <button onClick={() => setShowApprovalsModal(false)} className="btn-ghost">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', marginBottom: '16px' }}>
              {pendingApprovals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94A3B8' }}>
                  No pending approvals. All operations are authorized.
                </div>
              ) : (
                pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <strong style={{ fontSize: '13.5px', color: '#FFFFFF' }}>{item.title}</strong>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                          {item.entityName} • Requested by {item.requestedByName} ({item.requestedByRole})
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: item.riskScore === 'HIGH' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: item.riskScore === 'HIGH' ? '#EF4444' : '#10B981'
                        }}
                      >
                        {item.riskScore} RISK
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#CBD5E1', backgroundColor: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '6px' }}>
                      {item.rationale}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span className="tabular-nums font-display" style={{ fontSize: '13.5px', fontWeight: 800, color: '#FBBF24', letterSpacing: '-0.02em', fontFamily: "var(--font-display), 'Manrope', sans-serif" }}>
                        RWF {item.amountRWF.toLocaleString()}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            rejectExecutiveItem(item.id, 'Declined by Owner from Approvals Desk.');
                            showToast('Operation declined.');
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '5px 12px', fontSize: '11.5px', color: '#F87171' }}
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => {
                            approveExecutiveItem(item.id);
                            showToast('Operation approved & executed!');
                          }}
                          className="btn btn-primary"
                          style={{ padding: '5px 14px', fontSize: '11.5px' }}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
              <button
                onClick={() => {
                  handleBatchApproveLowRisk();
                  showToast('Low risk operations batch approved.');
                }}
                className="btn btn-secondary"
                style={{ fontSize: '12px' }}
              >
                Batch Approve Low-Risk
              </button>
              <button onClick={() => setShowApprovalsModal(false)} className="btn btn-secondary" style={{ fontSize: '12px' }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
