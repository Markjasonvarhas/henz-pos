import React, { useState } from 'react';
import {
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  CheckCircle2,
  X,
  Printer,
  Sparkles,
  User,
  GraduationCap,
  Building2,
  Receipt,
  Percent,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePOS } from '../../context/POSContext';
import { PaymentMethod, SaleTransaction } from '../../types';
import { QRCodeRenderer } from '../common/QRCodeRenderer';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (transaction: SaleTransaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { heldCarts, activeCartIndex, completeSale } = usePOS();
  const currentCart = heldCarts[activeCartIndex];

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [customerName, setCustomerName] = useState(currentCart?.customerName || '');
  const [customerType, setCustomerType] = useState<SaleTransaction['customerType']>(
    currentCart?.customerType || 'Student'
  );
  const [cashierName, setCashierName] = useState('Elena (Cashier 1)');
  const [discountPercent, setDiscountPercent] = useState<number>(
    currentCart?.customerType === 'Student' ? 5 : 0
  );
  const [cashTendered, setCashTendered] = useState<string>('');
  const [gcashRef, setGcashRef] = useState('');
  const [selectedBank, setSelectedBank] = useState('BDO Unibank');
  const [bankRef, setBankRef] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !currentCart || currentCart.items.length === 0) return null;

  const rawSubtotal = currentCart.items.reduce((acc, item) => acc + item.subtotal, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, rawSubtotal - discountAmount);

  const numTendered = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, numTendered - grandTotal);
  const isCashSufficient = paymentMethod !== 'Cash' || numTendered >= grandTotal;

  const handleProcessPayment = () => {
    setErrorMessage(null);

    if (paymentMethod === 'Cash' && numTendered < grandTotal) {
      setErrorMessage(`Tendered cash (₱${numTendered}) is less than total amount due (₱${grandTotal}).`);
      return;
    }

    if (paymentMethod === 'GCash' && !gcashRef.trim()) {
      setErrorMessage('Please enter the GCash Transaction Reference Number (from customer app).');
      return;
    }

    if (paymentMethod === 'Bank Payment' && !bankRef.trim()) {
      setErrorMessage('Please enter the Bank Transfer Reference Number.');
      return;
    }

    const tx = completeSale({
      customerName: customerName.trim() || `${customerType} Customer`,
      customerType,
      paymentMethod,
      amountTendered: paymentMethod === 'Cash' ? numTendered : grandTotal,
      referenceNumber: paymentMethod === 'GCash' ? gcashRef.trim() : paymentMethod === 'Bank Payment' ? bankRef.trim() : undefined,
      bankName: paymentMethod === 'Bank Payment' ? selectedBank : undefined,
      discountAmount,
      cashierName,
    });

    if (tx) {
      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#34d399', '#0284c7'],
        });
      } catch {
        // ignore
      }

      onClose();
      if (onPaymentSuccess) onPaymentSuccess(tx);
    }
  };

  const setExactCash = () => {
    setCashTendered(String(grandTotal));
  };

  const addCashAmount = (amount: number) => {
    const current = parseFloat(cashTendered) || 0;
    setCashTendered(String(current + amount));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#161b22] text-[#c9d1d9] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#30363d] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0d1117] text-white px-6 py-4 flex items-center justify-between border-b border-[#30363d]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Payment & Receipt Finalization</h3>
              <p className="text-xs text-gray-400">
                HENZ Health Care Products Trading • Medical POS Checkout
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#21262d] transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-500/15 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/40 flex items-center justify-between">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Customer & Cashier Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0d1117] p-3.5 rounded-xl border border-[#30363d]">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">
                Customer Name / Clinic:
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Maria Santos / St. Paul BSN"
                className="w-full px-2.5 py-1.5 text-xs bg-[#0a0b0d] text-[#c9d1d9] border border-[#30363d] rounded-lg focus:outline-none focus:border-emerald-500 font-medium placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">
                Customer Category:
              </label>
              <div className="flex gap-1">
                {(['Student', 'Clinic', 'Walk-in', 'Wholesale'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setCustomerType(type);
                      if (type === 'Student') setDiscountPercent(5);
                    }}
                    className={`flex-1 py-1 text-[10px] font-bold rounded border transition cursor-pointer ${
                      customerType === type
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                        : 'bg-[#0a0b0d] text-gray-400 border-[#30363d] hover:bg-[#21262d] hover:text-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">
                Discount Privileges:
              </label>
              <div className="flex items-center gap-1.5">
                {[0, 5, 8, 10].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercent(pct)}
                    className={`px-2 py-1 text-[11px] font-bold rounded border transition cursor-pointer ${
                      discountPercent === pct
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                        : 'bg-[#0a0b0d] text-gray-400 border-[#30363d] hover:bg-[#21262d] hover:text-gray-200'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Amount Due Summary Card */}
          <div className="bg-gradient-to-r from-emerald-950 via-[#161b22] to-emerald-950 text-white p-4 rounded-xl border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <div className="text-xs text-emerald-300 flex items-center gap-2">
                <span>{currentCart.items.length} unique items ({currentCart.items.reduce((a,b)=>a+b.quantity, 0)} units)</span>
                {discountAmount > 0 && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                    Saved ₱{discountAmount.toLocaleString()} ({discountPercent}% Discount)
                  </span>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5 font-mono text-emerald-400">
                ₱{grandTotal.toLocaleString()}
              </div>
            </div>

            <div className="text-right text-xs text-gray-400 sm:border-l sm:border-[#30363d] sm:pl-4">
              <div>Subtotal: <span className="font-mono text-gray-200">₱{rawSubtotal.toLocaleString()}</span></div>
              <div>VAT (12% Included): <span className="font-mono text-gray-200">₱{Math.round(grandTotal * 0.12).toLocaleString()}</span></div>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Select Mode of Payment:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                  paymentMethod === 'Cash'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500 font-bold'
                    : 'border-[#30363d] bg-[#0d1117] hover:bg-[#21262d] text-gray-300'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-400" />
                <span className="text-xs">Cash Tender</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('GCash')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                  paymentMethod === 'GCash'
                    ? 'border-blue-500 bg-blue-950/40 text-blue-200 ring-1 ring-blue-500 font-bold'
                    : 'border-[#30363d] bg-[#0d1117] hover:bg-[#21262d] text-gray-300'
                }`}
              >
                <Smartphone className="w-5 h-5 text-blue-400" />
                <span className="text-xs">GCash (QR / Ref)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Bank Payment')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                  paymentMethod === 'Bank Payment'
                    ? 'border-indigo-500 bg-indigo-950/40 text-indigo-200 ring-1 ring-indigo-500 font-bold'
                    : 'border-[#30363d] bg-[#0d1117] hover:bg-[#21262d] text-gray-300'
                }`}
              >
                <Building className="w-5 h-5 text-indigo-400" />
                <span className="text-xs">Bank Transfer</span>
              </button>
            </div>
          </div>

          {/* Payment Specific Inputs */}
          {paymentMethod === 'Cash' && (
            <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-300">
                  Enter Amount Tendered (₱):
                </label>
                <button
                  type="button"
                  onClick={setExactCash}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  Exact Amount (₱{grandTotal.toLocaleString()})
                </button>
              </div>

              <input
                type="number"
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                placeholder={`₱${grandTotal}`}
                autoFocus
                className="w-full px-4 py-2.5 text-lg font-bold bg-[#0a0b0d] border border-[#30363d] rounded-xl focus:outline-none focus:border-emerald-500 text-white font-mono placeholder:text-gray-600"
              />

              {/* Quick Cash Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[100, 200, 500, 1000, 2000, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCashTendered(String(val))}
                    className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg text-xs font-bold text-gray-200 cursor-pointer"
                  >
                    ₱{val.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Change Calculation Box */}
              <div className="pt-2 border-t border-[#30363d] flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-400">Change Due:</span>
                <span
                  className={`text-lg font-mono font-extrabold ${
                    changeDue > 0 ? 'text-emerald-400' : 'text-gray-500'
                  }`}
                >
                  ₱{changeDue.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'GCash' && (
            <div className="bg-[#0d1117] p-4 rounded-xl border border-blue-500/30 flex flex-col sm:flex-row items-center gap-4">
              <div className="shrink-0 text-center bg-white p-2 rounded-xl">
                <QRCodeRenderer value={`HENZ-GCASH-PAY-${grandTotal}-PHP`} size={110} />
                <span className="text-[10px] text-slate-900 font-bold block mt-1">
                  Scan to Pay GCash
                </span>
              </div>
              <div className="flex-1 space-y-2 w-full">
                <div>
                  <span className="text-xs font-bold text-blue-300 block">
                    HENZ Health Care Trading GCash Merchant
                  </span>
                  <p className="text-[11px] text-gray-400">
                    Account: 0917-555-HENZ (0917-555-4369)
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">
                    GCash Reference No. (Required):
                  </label>
                  <input
                    type="text"
                    value={gcashRef}
                    onChange={(e) => setGcashRef(e.target.value)}
                    placeholder="e.g. 982103491823"
                    className="w-full px-3 py-1.5 text-xs bg-[#0a0b0d] text-[#c9d1d9] border border-blue-500/40 rounded-lg focus:outline-none focus:border-blue-400 font-mono placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'Bank Payment' && (
            <div className="bg-[#0d1117] p-4 rounded-xl border border-indigo-500/30 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-indigo-300 mb-1">
                    Depository Bank:
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#0a0b0d] text-[#c9d1d9] border border-indigo-500/40 rounded-lg focus:outline-none focus:border-indigo-400 font-medium"
                  >
                    <option value="BDO Unibank" className="bg-[#161b22] text-white">BDO Unibank (Iloilo Branch)</option>
                    <option value="Bank of the Philippine Islands (BPI)" className="bg-[#161b22] text-white">BPI (Iloilo City)</option>
                    <option value="Landbank of the Philippines" className="bg-[#161b22] text-white">Landbank (Pavia Hub)</option>
                    <option value="Metrobank" className="bg-[#161b22] text-white">Metrobank (Iloilo Main)</option>
                    <option value="UnionBank of the Philippines" className="bg-[#161b22] text-white">UnionBank Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-indigo-300 mb-1">
                    Bank Reference / Transaction ID:
                  </label>
                  <input
                    type="text"
                    value={bankRef}
                    onChange={(e) => setBankRef(e.target.value)}
                    placeholder="e.g. BDO-TRX-98214"
                    className="w-full px-3 py-1.5 text-xs bg-[#0a0b0d] text-[#c9d1d9] border border-indigo-500/40 rounded-lg focus:outline-none focus:border-indigo-400 font-mono placeholder:text-gray-600"
                  />
                </div>
              </div>
              <div className="text-[11px] text-indigo-300 bg-[#0a0b0d] p-2 rounded border border-indigo-500/30">
                HENZ Health Care Trading Account No.: <span className="font-mono font-bold text-white">0048-2910-4491</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#0d1117] px-6 py-4 border-t border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-gray-300 rounded-xl text-xs font-bold transition border border-[#30363d] cursor-pointer"
          >
            Back to Cart
          </button>

          <button
            type="button"
            onClick={handleProcessPayment}
            disabled={!isCashSufficient}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              isCashSufficient
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                : 'bg-[#21262d] text-gray-500 border border-[#30363d] cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Sale & Print Receipt (₱{grandTotal.toLocaleString()})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
