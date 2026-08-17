import React, { useRef, useState, useEffect } from 'react';
import { Printer, X, Download, CheckCircle, ShieldCheck, HeartPulse, Sliders, Mail, Send, ExternalLink } from 'lucide-react';
import { SaleTransaction } from '../../types';
import { QRCodeRenderer } from '../common/QRCodeRenderer';
import { getReceiptSettings, ReceiptSettings } from '../../utils/receiptSettings';
import { ReceiptCustomizerModal } from './ReceiptCustomizerModal';
import { openGmailWeb, openClientEmail } from '../../utils/emailNotifier';

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
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings>(getReceiptSettings);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customerEmailInput, setCustomerEmailInput] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReceiptSettings(getReceiptSettings());
      setShowEmailInput(false);
      setCustomerEmailInput('');
    }
  }, [isOpen]);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleEmailInvoice = (targetEmail?: string) => {
    const emailToUse = targetEmail || customerEmailInput || prompt('Enter recipient customer email address:');
    if (!emailToUse || !emailToUse.includes('@')) return;

    const itemsSummary = transaction.items.map(i => `  • ${i.quantity}x ${i.product.name} (₱${i.subtotal.toLocaleString()})`).join('\n');
    const subject = `[HENZ Health Care] Official Receipt #${transaction.receiptNumber} - ₱${transaction.grandTotal.toLocaleString()}`;
    const body = `Dear ${transaction.customerName},\n\nThank you for your purchase at HENZ Health Care Products Trading.\n\n========================================\nOFFICIAL SALES INVOICE & RECEIPT\n========================================\nReceipt Number: ${transaction.receiptNumber}\nDate/Time: ${transaction.timestamp}\nBranch: ${transaction.branch}\nCashier: ${transaction.cashierName}\nPayment Method: ${transaction.paymentMethod}\n\nPURCHASED ITEMS:\n${itemsSummary}\n\nSubtotal: PHP ${transaction.subtotal.toLocaleString()}\nDiscount: PHP ${transaction.discountAmount.toLocaleString()}\nVAT (12% incl): PHP ${transaction.taxAmount.toLocaleString()}\nGRAND TOTAL: PHP ${transaction.grandTotal.toLocaleString()}\n\nBIR TIN: 482-910-384-000\nFDA LTO No: CDRRHR-RVI-MDR-84920\n\nThank you for choosing HENZ Health Care Products Trading!\n\nCasa Conching Bldg., Jalandoni St. / USA Gate 5 Gym, Iloilo City\nSupport: support@henzhealthcare.com`;

    openGmailWeb(emailToUse, subject, body);
  };

  const is58mm = receiptSettings.paperWidth === '58mm';
  const isA4 = receiptSettings.paperWidth === 'A4';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white print:static">
        <div className={`bg-[#161b22] text-[#c9d1d9] w-full rounded-2xl shadow-2xl border border-[#30363d] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 print:shadow-none print:border-none print:w-full print:max-w-none ${
          is58mm ? 'max-w-sm' : isA4 ? 'max-w-xl' : 'max-w-md'
        }`}>
          {/* Top Control Bar (Hidden on Print) */}
          <div className="bg-[#0d1117] text-white px-5 py-3 flex items-center justify-between border-b border-[#30363d] print:hidden">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs tracking-wide text-white">Transaction Successful</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                {receiptSettings.paperWidth}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmailInput(prev => !prev)}
                className="flex items-center gap-1 px-2.5 py-1 bg-teal-950/80 hover:bg-teal-900 text-teal-300 rounded-lg text-xs font-medium transition cursor-pointer border border-teal-500/40"
                title="Send Digital Invoice to Customer Email"
              >
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Email Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCustomizerOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition cursor-pointer border border-slate-700"
                title="Customize Thermal Header, TIN, & Disclaimers"
              >
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Format</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-md shadow-emerald-950/40"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#21262d] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Email Customer Bar (Collapsible) */}
          {showEmailInput && (
            <div className="bg-[#1c2128] border-b border-[#30363d] p-3 flex items-center gap-2 animate-in slide-in-from-top-2 duration-150 print:hidden">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <input
                type="email"
                placeholder="customer@school.edu.ph or gmail.com..."
                value={customerEmailInput}
                onChange={(e) => setCustomerEmailInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customerEmailInput) {
                    handleEmailInvoice();
                  }
                }}
                className="flex-1 px-3 py-1 text-xs bg-[#0d1117] text-white border border-[#30363d] rounded-lg focus:outline-none focus:border-teal-500 font-mono"
              />
              <button
                type="button"
                onClick={() => handleEmailInvoice()}
                className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          )}

          {/* Official Thermal / Medical Sales Invoice Paper */}
          <div
            ref={receiptRef}
            className={`p-6 font-mono text-slate-800 leading-relaxed bg-white ${
              is58mm ? 'text-[9.5px] p-4' : 'text-[11px]'
            }`}
          >
            {/* Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300 space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-sm tracking-tight font-sans">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <span>{receiptSettings.storeHeaderTitle}</span>
              </div>
              <p className="text-[10px] text-slate-600 font-sans">
                {receiptSettings.storeSubheader}
              </p>
              <p className="text-[10px] text-slate-500">
                Branch: {transaction.branch}
              </p>
              <p className="text-[9px] text-slate-500">
                Warehouse Hub: Aganan, Pavia, Iloilo City
              </p>
              {receiptSettings.showTin && (
                <p className="text-[9px] text-slate-500">
                  TIN: {receiptSettings.tinNumber}
                </p>
              )}
              {receiptSettings.showFdaLto && (
                <p className="text-[9px] text-slate-500">
                  {receiptSettings.fdaLtoNumber}
                </p>
              )}
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
              {receiptSettings.showCashierName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Cashier:</span>
                  <span>{transaction.cashierName}</span>
                </div>
              )}
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
              {receiptSettings.showQrCode && (
                <div className="flex justify-center">
                  <QRCodeRenderer value={transaction.receiptNumber} size={is58mm ? 75 : 90} />
                </div>
              )}
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-sans">
                {receiptSettings.customFooterNote}
              </p>
              <p className="text-[8px] text-slate-400 font-sans">
                {receiptSettings.returnPolicyNote}
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

      {/* Embedded Receipt Customizer */}
      <ReceiptCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => {
          setIsCustomizerOpen(false);
          setReceiptSettings(getReceiptSettings());
        }}
      />
    </>
  );
};
