import React, { useRef } from 'react';
import { Printer, X, Download, CheckCircle, ShieldCheck, HeartPulse } from 'lucide-react';
import { SaleTransaction } from '../../types';
import { QRCodeRenderer } from '../common/QRCodeRenderer';

interface ReceiptModalProps {
  transaction: SaleTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const receiptRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-[#161b22] text-[#c9d1d9] w-full max-w-md rounded-2xl shadow-2xl border border-[#30363d] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 print:shadow-none print:border-none print:w-full print:max-w-none">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-[#0d1117] text-white px-5 py-3 flex items-center justify-between border-b border-[#30363d] print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs tracking-wide text-white">Transaction Successful</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-md shadow-emerald-950/40"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#21262d] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Thermal / Medical Sales Invoice Paper */}
        <div ref={receiptRef} className="p-6 font-mono text-[11px] text-slate-800 leading-relaxed bg-white">
          {/* Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300 space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-sm tracking-tight font-sans">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <span>HENZ HEALTH CARE PRODUCTS TRADING</span>
            </div>
            <p className="text-[10px] text-slate-600 font-sans">
              Medical Supplies • Clinical Kits • Hospital Essentials
            </p>
            <p className="text-[10px] text-slate-500">
              Branch: {transaction.branch}
            </p>
            <p className="text-[9px] text-slate-500">
              Warehouse Hub: Aganan, Pavia, Iloilo City
            </p>
            <p className="text-[9px] text-slate-500">
              TIN: 298-410-912-000 • FDA LTO/CPR Compliance Applied
            </p>
          </div>

          {/* Meta Information */}
          <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Receipt No:</span>
              <span className="font-bold text-slate-900">{transaction.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date/Time:</span>
              <span>{transaction.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cashier:</span>
              <span>{transaction.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-900">{transaction.customerName} ({transaction.customerType})</span>
            </div>
            {transaction.preOrderRefCode && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Pre-Order Code:</span>
                <span>{transaction.preOrderRefCode}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="py-2.5 border-b border-dashed border-slate-300">
            <div className="flex justify-between text-[10px] font-bold text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
              <span>ITEM / LOT / EXP</span>
              <span className="text-right">TOTAL</span>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5 print:max-h-none">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-900 line-clamp-1 flex-1 pr-2">
                      {item.product.name}
                    </span>
                    <span className="font-bold text-slate-900 shrink-0">
                      ₱{item.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>
                      {item.quantity} x ₱{item.unitPrice} / {item.product.unit}
                    </span>
                    <span className="text-[8.5px] text-slate-400">
                      {item.product.batchNumber} | Exp:{item.product.expiryDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Calculation */}
          <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({transaction.totalItemCount} pcs):</span>
              <span>₱{transaction.subtotal.toLocaleString()}</span>
            </div>

            {transaction.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount Privilege:</span>
                <span>-₱{transaction.discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>VATable Sales (12% incl):</span>
              <span>₱{Math.round(transaction.grandTotal / 1.12).toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>VAT Amount (12%):</span>
              <span>₱{transaction.taxAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>TOTAL AMOUNT DUE:</span>
              <span className="text-emerald-800">₱{transaction.grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Breakdown */}
          <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Mode:</span>
              <span className="font-bold text-slate-900">{transaction.paymentMethod}</span>
            </div>

            {transaction.paymentMethod === 'Cash' && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Tendered:</span>
                  <span>₱{(transaction.amountTendered || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Change Due:</span>
                  <span>₱{(transaction.changeDue || 0).toLocaleString()}</span>
                </div>
              </>
            )}

            {transaction.referenceNumber && (
              <div className="flex justify-between text-slate-700">
                <span>Ref Number:</span>
                <span className="font-mono">{transaction.referenceNumber}</span>
              </div>
            )}

            {transaction.bankName && (
              <div className="flex justify-between text-slate-700">
                <span>Bank:</span>
                <span>{transaction.bankName}</span>
              </div>
            )}
          </div>

          {/* QR Verification & Footnote */}
          <div className="pt-3 text-center space-y-2">
            <div className="flex justify-center">
              <QRCodeRenderer value={transaction.receiptNumber} size={90} />
            </div>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-sans">
              Thank you for trusting HENZ Health Care!
            </p>
            <p className="text-[8px] text-slate-400 font-sans">
              Returns and exchanges of sealed medical goods accepted within 7 days with this official receipt.
            </p>
          </div>
        </div>

        {/* Footer (Hidden on Print) */}
        <div className="bg-[#0d1117] px-5 py-3 border-t border-[#30363d] flex justify-between items-center print:hidden">
          <span className="text-xs text-gray-400">Stock updated automatically</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-md shadow-emerald-950/40"
          >
            New Transaction
          </button>
        </div>
      </div>
    </div>
  );
};
