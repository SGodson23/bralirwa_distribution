import React from 'react';
import { AppProvider, useApp, NavView } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Toast } from './components/common/Toast';
import { QuickCreateModal } from './components/modals/QuickCreateModal';
import { UniversalSearchModal } from './components/modals/UniversalSearchModal';

// Views
import { ExecutiveDashboard } from './views/ExecutiveDashboard';
import { InventoryModule } from './views/InventoryModule';
import { PurchasesReceivingModule } from './views/PurchasesReceivingModule';
import { SalesOrdersModule } from './views/SalesOrdersModule';
import { QuickOrderModule } from './views/QuickOrderModule';
import { CustomersCRMModule } from './views/CustomersCRMModule';
import { DebtReceivablesModule } from './views/DebtReceivablesModule';
import { EmptiesCratesModule } from './views/EmptiesCratesModule';
import { DeliveriesDispatchModule } from './views/DeliveriesDispatchModule';
import { LiveDeliveryMapModule } from './views/LiveDeliveryMapModule';
import { DriverMobileAppModule } from './views/DriverMobileAppModule';
import { CashReconciliationModule } from './views/CashReconciliationModule';
import { FinanceProfitLossModule } from './views/FinanceProfitLossModule';
import { OperatingExpensesModule } from './views/OperatingExpensesModule';
import { SalesTeamModule } from './views/SalesTeamModule';
import { FleetManagementModule } from './views/FleetManagementModule';
import { DemandForecastModule } from './views/DemandForecastModule';
import { AiAssistantModule } from './views/AiAssistantModule';
import { FraudDetectionModule } from './views/FraudDetectionModule';
import { SmartAlertsModule } from './views/SmartAlertsModule';
import { AuditTrailModule } from './views/AuditTrailModule';
import { SuperAdminModule } from './views/SuperAdminModule';
import { SettingsModule } from './views/SettingsModule';
import { WarehouseManagerDashboard } from './views/WarehouseManagerDashboard';
import { AccountantDashboard } from './views/AccountantDashboard';
import { PrivatePortalGate } from './components/auth/PrivatePortalGate';
import { HomepageModule } from './views/HomepageModule';
import { LoginModule } from './views/LoginModule';

const MainLayout: React.FC = () => {
  const { currentNav, setCurrentNav, isCurrentPortalLocked, activePerspective, unlockPrivatePortal, isAuthenticated } = useApp();

  // Unified Single Page Homepage: Full-page hero background and secure login
  if (currentNav === 'homepage' || currentNav === 'login' || !isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#050E22',
          color: '#FFFFFF',
          margin: 0,
          padding: 0,
          overflowX: 'hidden'
        }}
      >
        <HomepageModule />
        <UniversalSearchModal />
        <Toast />
      </div>
    );
  }

  const renderActiveView = () => {
    if (isCurrentPortalLocked) {
      return (
        <PrivatePortalGate
          currentPerspective={activePerspective}
          onUnlockSuccess={() => unlockPrivatePortal()}
        />
      );
    }

    switch (currentNav) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'inventory':
      case 'products':
        return <InventoryModule />;
      case 'purchases':
        return <PurchasesReceivingModule initialTab="orders" />;
      case 'receiving':
        return <PurchasesReceivingModule initialTab="receiving" />;
      case 'orders':
        return <SalesOrdersModule />;
      case 'quick_order':
        return <QuickOrderModule />;
      case 'customers':
        return <CustomersCRMModule />;
      case 'debt':
        return <DebtReceivablesModule />;
      case 'empties':
        return <EmptiesCratesModule />;
      case 'deliveries':
        return <DeliveriesDispatchModule />;
      case 'delivery_map':
        return <LiveDeliveryMapModule />;
      case 'driver_mobile':
        return <DriverMobileAppModule />;
      case 'reconciliation':
        return <CashReconciliationModule />;
      case 'finance':
        return <FinanceProfitLossModule />;
      case 'expenses':
        return <OperatingExpensesModule />;
      case 'sales_team':
        return <SalesTeamModule />;
      case 'fleet':
        return <FleetManagementModule />;
      case 'forecasting':
        return <DemandForecastModule />;
      case 'assistant':
        return <AiAssistantModule />;
      case 'fraud':
        return <FraudDetectionModule />;
      case 'alerts':
        return <SmartAlertsModule />;
      case 'audit':
        return <AuditTrailModule />;
      case 'super_admin':
        return <SuperAdminModule />;
      case 'settings':
        return <SettingsModule />;
      case 'warehouse_dashboard':
        return <WarehouseManagerDashboard />;
      case 'accountant_dashboard':
        return <AccountantDashboard />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0A1C3E',
        background: 'radial-gradient(circle at 50% 0%, #112B5C 0%, #081734 60%, #050E22 100%)',
        backgroundAttachment: 'fixed',
        color: '#FFFFFF'
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh', background: 'transparent' }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: 'transparent' }}>
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <QuickCreateModal />
      <UniversalSearchModal />
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
