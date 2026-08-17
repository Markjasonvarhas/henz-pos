import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Scan,
  QrCode,
  ClipboardCheck,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Flame,
  AlertTriangle,
  Package,
  Layers,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Product, ProductCategory, SaleTransaction } from '../../types';
import { MultiCartTabs } from './MultiCartTabs';
import { QuickKitSelector } from './QuickKitSelector';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { ScanPreOrderQRModal } from './ScanPreOrderQRModal';
import { BatchChecklistImportModal } from './BatchChecklistImportModal';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { soundEffects } from '../../utils/audio';

export const POSTerminal: React.FC = () => {
  const {
    products,
    activeBranch,
    heldCarts,
    activeCartIndex,
    currentCartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCurrentCart,
    isJulyPeakSeasonMode,
    recentCompletedSale,
    setRecentCompletedSale,
  } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyFastMoving, setOnlyFastMoving] = useState(false);
  const [onlyShortShelfLife, setOnlyShortShelfLife] = useState(false);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPreOrderQROpen, setIsPreOrderQROpen] = useState(false);
  const [isBatchChecklistOpen, setIsBatchChecklistOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement | null>(null);

  const currentCart = heldCarts[activeCartIndex] || {
    id: 'default',
    name: 'Order #1',
    items: [],
    customerType: 'Student',
  };

  const categories: string[] = [
    'All',
    'Diagnostic & Monitoring',
    'Surgical Instruments',
    'Wound Care & Dressings',
    'PPE & Infection Control',
    'Syringes & Needles',
    'Sterilization & Antiseptics',
    'IV Therapy & Fluids',
    'Hospital & Clinic Supplies',
  ];

  // Auto-focus barcode input on load
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // Global Hardware USB/Bluetooth Barcode Scanner Listener
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is actively typing in a normal textarea or search box, don't hijack unless it's the barcode scanner fast-burst
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      const isBarcodeInput = target === barcodeInputRef.current;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime;
      lastKeyTime = currentTime;

      // Hardware scanners type characters very quickly (< 45ms per char)
      if (e.key === 'Enter') {
        if (buffer.length >= 3) {
          const scannedCode = buffer.trim();
          const match = products.find(
            (p) =>
              p.barcode === scannedCode ||
              p.sku.toLowerCase() === scannedCode.toLowerCase()
          );

          if (match) {
            e.preventDefault();
            addToCart(match, 1);
            setBarcodeInput('');
            buffer = '';
            return;
          }
        }
        buffer = '';
      } else if (e.key.length === 1) {
        // Reset buffer if delay is too long (human typing) unless it's fast
        if (timeDiff > 100 && !isBarcodeInput) {
          buffer = '';
        }
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products, addToCart]);

  // Handle hardware USB barcode scanner or keyboard input from form
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = barcodeInput.trim();
    if (!query) return;

    const match = products.find(
      (p) =>
        p.barcode === query ||
        p.sku.toLowerCase() === query.toLowerCase() ||
        p.name.toLowerCase() === query.toLowerCase()
    );

    if (match) {
      addToCart(match, 1);
      setBarcodeInput('');
    } else {
      soundEffects.playErrorBeep();
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      (p.genericName && p.genericName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesFast = !onlyFastMoving || p.isFastMoving;
    const matchesShelf = !onlyShortShelfLife || p.shelfLifeType === 'short';

    return matchesSearch && matchesCat && matchesFast && matchesShelf;
  });

  const cartSubtotal = currentCartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItemUnits = currentCartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isMainBranch = activeBranch.includes('Main Branch');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      {/* July Peak Season Banner & Fast Actions */}
      {isJulyPeakSeasonMode && (
        <div className="bg-gradient-to-r from-amber-950/80 via-[#161b22] to-emerald-950/80 border border-amber-500/30 text-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <span className="p-1.5 bg-amber-500/20 rounded-lg border border-amber-500/30">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
            </span>
            <div>
              <span className="font-bold text-amber-200">July Peak Season School Opening Mode Active</span>
              <span className="text-gray-300 block text-[11px]">
                High-Volume 50+ Item Checklist Processing • Multi-Cart Serving Enabled
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreOrderQROpen(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-950/50 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-white" />
              <span>Scan Customer Pre-Order QR</span>
            </button>

            <button
              onClick={() => setIsBatchChecklistOpen(true)}
              className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-gray-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border border-[#30363d]"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bulk Checklist Adder</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick 1-Click Kit Selector */}
      <QuickKitSelector />

      {/* Main Cashier Workspace (Split View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Product Search, Barcode Input, & Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Top Barcode Input & Scanner Controls */}
          <div className="bg-[#161b22] p-3 rounded-xl border border-[#30363d] shadow-md flex flex-wrap sm:flex-nowrap gap-2 items-center">
            <form onSubmit={handleBarcodeSubmit} className="relative flex-1 min-w-[200px]">
              <Scan className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scan / Type Barcode or SKU (e.g. 480651234001)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0a0b0d] text-[#c9d1d9] border border-[#30363d] rounded-lg focus:outline-none focus:border-emerald-500 font-mono placeholder:text-gray-500"
              />
            </form>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5 text-emerald-400" />
              <span>Camera Scan</span>
            </button>

            <button
              onClick={() => setIsPreOrderQROpen(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-emerald-950/40"
            >
              <QrCode className="w-3.5 h-3.5 text-white" />
              <span>Scan QR Slip</span>
            </button>
          </div>

          {/* Search, Category Filters, & Fast Moving Flags */}
          <div className="bg-[#161b22] p-3 rounded-xl border border-[#30363d] shadow-md space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 60+ medical supplies..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0a0b0d] text-[#c9d1d9] border border-[#30363d] rounded-lg focus:outline-none focus:border-emerald-500 placeholder:text-gray-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setOnlyFastMoving((prev) => !prev)}
                  className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                    onlyFastMoving
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-[#0a0b0d] text-gray-400 border-[#30363d] hover:bg-[#21262d] hover:text-gray-200'
                  }`}
                >
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>Fast Moving</span>
                </button>

                <button
                  onClick={() => setOnlyShortShelfLife((prev) => !prev)}
                  className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                    onlyShortShelfLife
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-[#0a0b0d] text-gray-400 border-[#30363d] hover:bg-[#21262d] hover:text-gray-200'
                  }`}
                >
                  <Clock className="w-3 h-3 text-rose-400" />
                  <span>Short Shelf Life</span>
                </button>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                      : 'bg-[#0a0b0d] text-gray-400 border-[#30363d] hover:bg-[#21262d] hover:text-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid / Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const currentStock = isMainBranch ? p.stockMainBranch : p.stockUsaBranch;
              const isLowStock = currentStock <= p.minStockLevel;

              return (
                <div
                  key={p.id}
                  onClick={() => addToCart(p, 1)}
                  className="bg-[#161b22] p-3 rounded-xl border border-[#30363d] hover:border-emerald-500/70 hover:bg-[#1f242c] transition flex flex-col justify-between cursor-pointer group relative shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono text-gray-500 group-hover:text-gray-400">
                        {p.barcode}
                      </span>
                      {p.isFastMoving && (
                        <span className="text-[9px] font-bold text-amber-300 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/30">
                          Fast Moving
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 line-clamp-2 leading-snug">
                      {p.name}
                    </h4>

                    {p.genericName && (
                      <p className="text-[10px] text-gray-400 line-clamp-1 italic mt-0.5">
                        {p.genericName}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#30363d] flex items-end justify-between">
                    <div>
                      <div className="text-sm font-extrabold text-emerald-400 font-mono">
                        ₱{p.price.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-gray-400 block">/ {p.unit}</span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          currentStock === 0
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : isLowStock
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {currentStock} in stock
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Multi-Cart, Live Order Summary & Checkout (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-[#161b22] rounded-2xl border border-[#30363d] shadow-lg overflow-hidden min-h-[600px]">
          {/* Multi-Cart Tabs (Hold & Resume up to multiple orders) */}
          <MultiCartTabs />

          {/* Cart Header Info */}
          <div className="p-3.5 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {currentCart.name}
              </span>
              <span className="text-[10px] font-semibold bg-[#21262d] text-gray-300 border border-[#30363d] px-2 py-0.5 rounded-full">
                {currentCart.customerType || 'Student'}
              </span>
            </div>

            {currentCartItems.length > 0 && (
              <button
                onClick={clearCurrentCart}
                className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cart</span>
              </button>
            )}
          </div>

          {/* Cart Line Items Table */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-[#30363d]">
            {currentCartItems.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-500 space-y-2">
                <Package className="w-10 h-10 text-gray-600 stroke-1" />
                <p className="text-xs font-medium text-gray-400">Active cart is empty</p>
                <p className="text-[11px] text-gray-500 max-w-xs">
                  Scan a barcode, select preset kit, or click products to ring up items.
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setIsBatchChecklistOpen(true)}
                    className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-200 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    + Bulk Add Checklist
                  </button>
                </div>
              </div>
            ) : (
              currentCartItems.map((item) => (
                <div key={item.product.id} className="pt-2 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.product.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                      <span>₱{item.unitPrice} / {item.product.unit}</span>
                      <span>•</span>
                      <span className="font-mono text-gray-500">{item.product.sku}</span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-[#0a0b0d] border border-[#30363d] rounded-lg p-0.5 shrink-0">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-300 hover:bg-[#21262d] rounded cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold font-mono text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-300 hover:bg-[#21262d] rounded cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right shrink-0 min-w-[70px]">
                    <div className="text-xs font-bold text-white font-mono">
                      ₱{item.subtotal.toLocaleString()}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[10px] text-gray-500 hover:text-rose-400 transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Calculation & Pay Button */}
          <div className="p-4 bg-[#0d1117] border-t border-[#30363d] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Total Items Units:</span>
                <span className="font-bold text-white">{totalItemUnits} units ({currentCartItems.length} lines)</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Subtotal (VAT incl):</span>
                <span className="font-bold text-white font-mono">₱{cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#30363d]">
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Total Amount Due</span>
                <span className="text-2xl font-black text-white font-mono tracking-tighter">₱{cartSubtotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={currentCartItems.length === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                currentCartItems.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                  : 'bg-[#21262d] text-gray-500 border border-[#30363d] cursor-not-allowed'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Charge & Complete Sale (₱{cartSubtotal.toLocaleString()})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <ScanPreOrderQRModal
        isOpen={isPreOrderQROpen}
        onClose={() => setIsPreOrderQROpen(false)}
      />

      <BatchChecklistImportModal
        isOpen={isBatchChecklistOpen}
        onClose={() => setIsBatchChecklistOpen(false)}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={(tx) => {
          setRecentCompletedSale(tx);
          setIsReceiptModalOpen(true);
        }}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        transaction={recentCompletedSale}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
};
