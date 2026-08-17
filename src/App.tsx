/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { HeaderNav } from './components/common/HeaderNav';
import { POSTerminal } from './components/pos/POSTerminal';
import { DigitalChecklistPortal } from './components/checklist/DigitalChecklistPortal';
import { OrderPrepQueue } from './components/prep/OrderPrepQueue';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { ExpiryTrackingView } from './components/expiry/ExpiryTrackingView';
import { ReportsView } from './components/reports/ReportsView';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { SharePreOrderModal } from './components/common/SharePreOrderModal';
import { UnifiedDatabaseModal } from './components/database/UnifiedDatabaseModal';

const MainLayout: React.FC = () => {
  const {
    activeView,
    userRole,
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    isShareModalOpen,
    setIsShareModalOpen,
  } = usePOS();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-600 selection:text-white">
      {/* Top Main Navigation Header with Role Switcher */}
      <HeaderNav />

      {/* Main Content Area Routing */}
      <main className="flex-1 pb-10">
        {userRole === 'user' ? (
          // In customer mode, only the Pre-Order Checklist Portal is rendered without requiring login
          <DigitalChecklistPortal />
        ) : (
          // In admin mode, full POS and store management suite is available
          <>
            {activeView === 'pos' && <POSTerminal />}
            {activeView === 'checklist-portal' && <DigitalChecklistPortal />}
            {activeView === 'prep-queue' && <OrderPrepQueue />}
            {activeView === 'inventory' && <InventoryManagement />}
            {activeView === 'expiry' && <ExpiryTrackingView />}
            {activeView === 'reports' && <ReportsView />}
          </>
        )}
      </main>

      {/* Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
      />

      {/* Share Pre-Order Portal Link Modal */}
      <SharePreOrderModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Unified Database Architecture & 2-Branch Status Modal */}
      <UnifiedDatabaseModal />

      {/* System Footer Bar */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 px-4 text-center text-xs text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 justify-center">
            <span className="font-bold text-white">HENZ Health Care Products Trading</span>
            <span className="text-slate-600">•</span>
            <span>Medical Supplies & Clinical Kits Retail Management</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 justify-center">
            <span>Main Branch (Casa Conching) & USA Branch (Univ. of San Agustin Gate 5)</span>
            <span>•</span>
            <span className="text-teal-400 font-semibold">FDA Regulatory Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <MainLayout />
    </POSProvider>
  );
}
