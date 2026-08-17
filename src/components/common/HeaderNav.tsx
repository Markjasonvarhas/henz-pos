import React from 'react';
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
  ShieldAlert,
  Share2,
  Lock,
  LogOut,
  Sparkles,
  ExternalLink,
  Database,
} from 'lucide-react';
import { usePOS, ActiveNavView, BRANCH_MAIN, BRANCH_USA } from '../../context/POSContext';
import { soundEffects } from '../../utils/audio';

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

  const pendingPreOrdersCount = preOrders.filter(
    (p) => p.orderStatus === 'Pending' || p.orderStatus === 'Preparing'
  ).length;

  const adminNavItems: { id: ActiveNavView; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'pos', label: 'POS Checkout', icon: CreditCard, badge: heldCarts.length > 1 ? heldCarts.length : undefined },
    { id: 'prep-queue', label: 'Order Packing Desk', icon: PackageCheck, badge: pendingPreOrdersCount > 0 ? pendingPreOrdersCount : undefined },
    { id: 'inventory', label: 'Product Inventory (CRUD)', icon: Boxes },
    { id: 'expiry', label: 'FDA Expiry & FEFO', icon: ClockAlert },
    { id: 'reports', label: 'Sales & Peak Analytics', icon: BarChart3 },
    { id: 'checklist-portal', label: 'Customer View', icon: ClipboardList },
  ];

  return (
    <header className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-30 shadow-md">
      {/* Top Utility Ribbon */}
      <div className="bg-[#0a0b0d] text-[#c9d1d9] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-[#30363d]/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold tracking-wide text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            HENZ HEALTH CARE PRODUCTS TRADING
          </div>
          <span className="text-[#30363d] hidden sm:inline">|</span>
          <span className="text-gray-400 hidden md:inline text-[11px]">
            Main Branch & USA Branch (San Agustin Gate 5)
          </span>
          <span className="text-[#30363d] hidden md:inline">|</span>
          <span className="text-gray-500 text-[11px] font-mono hidden lg:inline">
            FDA CPR Reg. • Medical Supplies
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Unified Database Status Button */}
          <button
            id="open-db-monitor-btn"
            onClick={() => setIsDatabaseModalOpen(true)}
            className="flex items-center gap-1.5 text-[11px] text-teal-300 hover:text-white px-2.5 py-0.5 rounded-lg bg-teal-950/70 border border-teal-500/40 hover:bg-teal-900/60 transition cursor-pointer font-medium shadow-sm"
            title="View 1 Central Database Architecture & 2-Branch Status"
          >
            <Database className="w-3 h-3 text-teal-400" />
            <span className="hidden sm:inline">1 Unified DB • 2 Branches</span>
            <span className="sm:hidden">1 DB</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </button>

          {/* Share Pre-Order Link Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white px-2.5 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-800/40 transition cursor-pointer font-medium"
            title="Share Customer Pre-Order Link (QR & URL)"
          >
            <Share2 className="w-3 h-3 text-emerald-400" />
            <span>Share Link</span>
          </button>

          {/* Sound Beeper Test */}
          <button
            onClick={() => soundEffects.playScanBeep()}
            title="Test Barcode Beeper"
            className="flex items-center gap-1 text-[11px] text-gray-300 hover:text-white px-2 py-0.5 rounded bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] transition cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Beep</span>
          </button>

          {/* Peak Season Mode Toggle */}
          <button
            onClick={() => setIsJulyPeakSeasonMode((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
              isJulyPeakSeasonMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-[#21262d] text-gray-400 hover:text-gray-200 border border-[#30363d]'
            }`}
            title="July Peak Season School Opening Surge Mode"
          >
            <Flame className={`w-3 h-3 ${isJulyPeakSeasonMode ? 'text-amber-400 fill-amber-400' : ''}`} />
            <span>July Peak</span>
            {isJulyPeakSeasonMode && <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded font-bold">ON</span>}
          </button>

          {/* Branch Switcher */}
          <div className="flex items-center bg-[#0a0b0d] rounded-lg p-0.5 border border-[#30363d]">
            <Building2 className="w-3.5 h-3.5 text-emerald-400 ml-1.5 mr-1" />
            <select
              value={activeBranch}
              onChange={(e) => setActiveBranch(e.target.value as any)}
              className="bg-transparent text-[11px] text-gray-200 font-medium py-0.5 px-1.5 pr-2 focus:outline-none cursor-pointer max-w-[150px] sm:max-w-none truncate"
            >
              <option value={BRANCH_MAIN} className="bg-[#161b22] text-white">
                Main Branch (Casa Conching)
              </option>
              <option value={BRANCH_USA} className="bg-[#161b22] text-white">
                USA Branch (USA Gate 5 Gym)
              </option>
            </select>
          </div>

          {/* Auth State Button */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1.5 pl-1 border-l border-[#30363d]">
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 hidden sm:inline">
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
              className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#21262d] hover:bg-[#30363d] text-gray-300 hover:text-white border border-[#30363d] transition cursor-pointer"
              title="Staff / Cashier / Admin Login"
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-md shadow-emerald-950/50">
            H
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-lg leading-tight tracking-tight">
                HENZ Health Care
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {userRole === 'user' ? 'Customer Pre-Order Portal' : 'Admin POS & Operations'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-500 uppercase tracking-widest font-semibold hidden sm:block">
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
              <span className="text-[11px] text-emerald-400 font-medium">Pay Now (GCash/Bank) or Pay Later (Store Pickup)</span>
            </div>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer shadow-md shadow-emerald-950/40"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Portal Link</span>
            </button>
            <button
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] text-gray-300 hover:text-white hover:bg-[#30363d] border border-[#30363d] transition cursor-pointer shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
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
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-500'
                      : 'text-gray-300 hover:text-white hover:bg-[#21262d] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-white text-emerald-900'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
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
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#21262d] rounded-lg transition border border-dashed border-[#30363d] cursor-pointer"
              title="Open new customer cart tab"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline">+ New Order</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};


