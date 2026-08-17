import React, { useState } from 'react';
import {
  CreditCard,
  ClipboardList,
  PackageCheck,
  Boxes,
  ClockAlert,
  BarChart3,
  Building2,
  Flame,
  Volume2,
  PlusCircle,
  Share2,
  Lock,
  LogOut,
  Sparkles,
  Database,
  Stethoscope,
  Activity,
  HeartPulse,
  Clock,
  MessageSquare,
  Receipt,
  Palette,
  Sliders,
} from 'lucide-react';
import { usePOS, ActiveNavView, BRANCH_MAIN, BRANCH_USA } from '../../context/POSContext';
import { soundEffects } from '../../utils/audio';
import { EmailNotificationModal } from '../admin/EmailNotificationModal';
import { BranchSettingsModal } from '../admin/BranchSettingsModal';
import { ReceiptCustomizerModal } from '../pos/ReceiptCustomizerModal';
import { ThemeSelectorModal } from './ThemeSelectorModal';
import { AppTheme, getSavedTheme, saveTheme } from '../../utils/theme';

export const HeaderNav: React.FC = () => {
  const {
    userRole,
    setUserRole,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    setIsShareModalOpen,
    setIsDatabaseModalOpen,
    logoutAdmin,
    activeView,
    setActiveView,
    activeBranch,
    setActiveBranch,
    preOrders,
    isJulyPeakSeasonMode,
    setIsJulyPeakSeasonMode,
    heldCarts,
    addNewCart,
  } = usePOS();

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(getSavedTheme);

  const pendingPreOrdersCount = preOrders.filter(
    (p) => p.orderStatus === 'Pending' || p.orderStatus === 'Preparing'
  ).length;

  const adminNavItems: { id: ActiveNavView; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'pos', label: 'POS Checkout', icon: CreditCard, badge: heldCarts.length > 1 ? heldCarts.length : undefined },
    { id: 'prep-queue', label: 'Order Packing Desk', icon: PackageCheck, badge: pendingPreOrdersCount > 0 ? pendingPreOrdersCount : undefined },
    { id: 'inventory', label: 'Product Inventory', icon: Boxes },
    { id: 'expiry', label: 'FDA Expiry & FEFO', icon: ClockAlert },
    { id: 'reports', label: 'Sales & Analytics', icon: BarChart3 },
    { id: 'checklist-portal', label: 'Customer View', icon: ClipboardList },
  ];

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        {/* Top Clinical Utility Ribbon */}
        <div className="bg-slate-950 text-slate-300 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold tracking-wide text-teal-400">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              HENZ HEALTH CARE PRODUCTS TRADING
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden md:inline text-[11px]">
              Main Branch (Casa Conching) & USA Branch (San Agustin Gate 5)
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Unified Database Status Button */}
            <button
              id="open-db-monitor-btn"
              onClick={() => setIsDatabaseModalOpen(true)}
              className="flex items-center gap-1.5 text-[11px] text-teal-300 hover:text-white px-2.5 py-0.5 rounded-lg bg-teal-950/70 border border-teal-500/40 hover:bg-teal-900/60 transition cursor-pointer font-medium shadow-sm"
              title="View 1 Central Database Architecture & 2-Branch Status"
            >
              <Database className="w-3 h-3 text-teal-400" />
              <span className="hidden sm:inline">1 Central DB</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            </button>

            {/* Customer Email Alerts & Invoices Button */}
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="flex items-center gap-1 text-[11px] text-teal-300 hover:text-white px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-teal-500/50 transition cursor-pointer font-medium"
              title="Customer Email Notifications, Digital Receipts & Pickup Invoices"
            >
              <MessageSquare className="w-3 h-3 text-teal-400" />
              <span className="hidden md:inline">Email Alerts</span>
            </button>

            {/* Branch Settings Button */}
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-teal-500/50 transition cursor-pointer font-medium"
              title="Store & Branch Hours / Locations"
            >
              <Building2 className="w-3 h-3 text-teal-400" />
              <span className="hidden lg:inline">Branch Settings</span>
            </button>

            {/* Thermal Receipt Customizer Button */}
            <button
              onClick={() => setIsReceiptModalOpen(true)}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-teal-500/50 transition cursor-pointer font-medium"
              title="Thermal Receipt & Invoice Layout (58mm/80mm)"
            >
              <Receipt className="w-3 h-3 text-teal-400" />
              <span className="hidden lg:inline">Receipt Format</span>
            </button>

            {/* Theme Selector Button */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-teal-500/50 transition cursor-pointer font-medium"
              title="Color Theme & Palette Mode"
            >
              <Palette className="w-3 h-3 text-teal-400" />
              <span className="hidden sm:inline">Theme</span>
            </button>

            {/* Share Pre-Order Link Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1 text-[11px] text-teal-300 hover:text-white px-2.5 py-0.5 rounded-lg bg-teal-950/60 border border-teal-500/40 hover:bg-teal-800/40 transition cursor-pointer font-medium"
              title="Share Customer Pre-Order Link (QR & URL)"
            >
              <Share2 className="w-3 h-3 text-teal-400" />
              <span>Share</span>
            </button>

            {/* Peak Season Mode Toggle */}
            <button
              onClick={() => setIsJulyPeakSeasonMode((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
                isJulyPeakSeasonMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
              title="July Peak Season School Opening Surge Mode"
            >
              <Flame className={`w-3 h-3 ${isJulyPeakSeasonMode ? 'text-amber-400 fill-amber-400' : ''}`} />
              <span className="hidden sm:inline">July Peak</span>
              {isJulyPeakSeasonMode && <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded font-bold">ON</span>}
            </button>

            {/* Branch Switcher */}
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-700">
              <Building2 className="w-3.5 h-3.5 text-teal-400 ml-1.5 mr-1" />
              <select
                value={activeBranch}
                onChange={(e) => setActiveBranch(e.target.value as any)}
                className="bg-transparent text-[11px] text-slate-200 font-medium py-0.5 px-1.5 pr-2 focus:outline-none cursor-pointer max-w-[140px] sm:max-w-none truncate"
              >
                <option value={BRANCH_MAIN} className="bg-slate-900 text-white">
                  Main (Casa Conching)
                </option>
                <option value={BRANCH_USA} className="bg-slate-900 text-white">
                  USA (Gate 5 Gym)
                </option>
              </select>
            </div>

            {/* Auth State Button */}
            {isAdminAuthenticated ? (
              <div className="flex items-center gap-1.5 pl-1 border-l border-slate-700">
                <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30 hidden sm:inline">
                  Admin: Active
                </span>
                <button
                  onClick={logoutAdmin}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-500/40 transition cursor-pointer"
                  title="Log out of Admin Mode"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                title="Staff / Cashier / Admin Login"
              >
                <Lock className="w-3 h-3 text-teal-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-md shadow-teal-950/50">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-lg leading-tight tracking-tight">
                  HENZ Health Care
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                  {userRole === 'user' ? 'Customer Pre-Order Portal' : 'Admin POS & Operations'}
                </span>
              </div>
              <p className="text-[11px] text-teal-400 uppercase tracking-widest font-semibold hidden sm:block">
                {activeBranch.includes('USA Branch')
                  ? 'USA Branch • In front of USA Gate 5 (Gym)'
                  : 'Main Branch • Casa Conching Bldg., Jalandoni St'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs based on Role */}
          {userRole === 'user' ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-semibold text-white block">Medical Supplies Pre-Order Checklist</span>
                <span className="text-[11px] text-teal-400 font-medium">Pay Now (GCash/Bank) or Pay Later (Store Pickup)</span>
              </div>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition cursor-pointer shadow-md shadow-teal-950/40"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </button>
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition cursor-pointer shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>Admin Login</span>
              </button>
            </div>
          ) : (
            <nav className="flex items-center overflow-x-auto pb-1 md:pb-0 gap-1 sm:gap-1.5 scrollbar-none">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-950/40 border border-teal-500'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-white text-teal-950'
                            : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Quick Add Cart Tab Shortcut */}
              <button
                onClick={() => {
                  setActiveView('pos');
                  addNewCart();
                }}
                className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition border border-dashed border-slate-700 cursor-pointer"
                title="Open new customer cart tab"
              >
                <PlusCircle className="w-4 h-4 text-teal-400" />
                <span className="hidden xl:inline">+ New Cart</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Global Modals for Email Alerts, Branches, Receipt, & Theme */}
      <EmailNotificationModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
      <BranchSettingsModal isOpen={isBranchModalOpen} onClose={() => setIsBranchModalOpen(false)} />
      <ReceiptCustomizerModal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} />
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onThemeSelect={(t) => setCurrentTheme(t)}
      />
    </>
  );
};



