import React, { useState } from 'react';
import { 
  DollarSign, ShieldAlert, CheckCircle2, Clock, AlertTriangle, 
  ArrowRight, CreditCard, Receipt, RefreshCw, Zap, X 
} from 'lucide-react';
import { MaintenanceInvoice, PackageTier, SalonProfile } from '../../types';
import { INITIAL_INVOICES } from '../../data/mockData';

interface RevenueTabProps {
  salon: SalonProfile;
  setSalon: React.Dispatch<React.SetStateAction<SalonProfile>>;
  onPayNow: () => void;
}

export const RevenueTab: React.FC<RevenueTabProps> = ({
  salon,
  setSalon,
  onPayNow,
}) => {
  const [invoices, setInvoices] = useState<MaintenanceInvoice[]>(INITIAL_INVOICES);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'easypaisa' | 'jazzcash' | 'bank' | 'card'>('easypaisa');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Simulation controls to test different states of the blueprint
  const handleSetState = (status: 'paid' | 'grace_period' | 'overdue_red_alert') => {
    if (status === 'overdue_red_alert') {
      setSalon((prev) => ({
        ...prev,
        paymentStatus: 'overdue_red_alert',
        daysOverdue: 4,
        gracePeriodDaysLeft: 0,
        isLockedOut: true,
      }));
    } else if (status === 'grace_period') {
      setSalon((prev) => ({
        ...prev,
        paymentStatus: 'grace_period',
        daysOverdue: 1,
        gracePeriodDaysLeft: 2,
        isLockedOut: false,
      }));
    } else {
      setSalon((prev) => ({
        ...prev,
        paymentStatus: 'paid',
        daysOverdue: 0,
        gracePeriodDaysLeft: 3,
        isLockedOut: false,
      }));
    }
  };

  // Complete Payment Action
  const handleConfirmPayment = () => {
    const newInvoice: MaintenanceInvoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      month: 'October 2026',
      amount: salon.monthlyFee,
      currency: salon.currency,
      issueDate: '2026-10-28',
      dueDate: '2026-10-30',
      status: 'paid',
      paidOn: new Date().toISOString().split('T')[0],
      paymentMethod: 
        selectedMethod === 'easypaisa' ? 'EasyPaisa Merchant #0300-8472910' :
        selectedMethod === 'jazzcash' ? 'JazzCash Direct Wallet' :
        selectedMethod === 'bank' ? 'Habib Bank (HBL) Transfer' : 'Debit/Credit Card',
      transactionRef: 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    };

    setInvoices([newInvoice, ...invoices]);
    setSalon((prev) => ({
      ...prev,
      paymentStatus: 'paid',
      daysOverdue: 0,
      isLockedOut: false,
      lastPaymentDate: new Date().toISOString().split('T')[0],
    }));

    setIsPayModalOpen(false);
    setPaymentSuccessMsg(`Payment of ${salon.currency} ${salon.monthlyFee.toLocaleString()} confirmed. Red Alert cleared & WhatsApp line restored!`);
    setTimeout(() => setPaymentSuccessMsg(null), 5000);
  };

  // Package Tier change
  const handlePackageTierChange = (tier: PackageTier) => {
    const fees: Record<PackageTier, { pkr: number; aed: number }> = {
      essential: { pkr: 1500, aed: 50 },
      growth: { pkr: 2000, aed: 75 },
      enterprise: { pkr: 2500, aed: 100 },
    };

    const monthly = salon.currency === 'PKR' ? fees[tier].pkr : fees[tier].aed;
    setSalon((prev) => ({
      ...prev,
      packageTier: tier,
      monthlyFee: monthly,
    }));
  };

  return (
    <div className="space-y-3.5 pb-20">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Revenue &amp; Maintenance Control
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated 2-Day billing cycle &amp; Red Alert lockout policy
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-sky-400">
            {salon.currency} {salon.monthlyFee.toLocaleString()} / mo
          </span>
        </div>

        {/* Current Status Badge */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Account Standing:</span>
            {salon.paymentStatus === 'paid' && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active (Paid)
              </span>
            )}
            {salon.paymentStatus === 'grace_period' && (
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                Grace Period ({salon.gracePeriodDaysLeft}d left)
              </span>
            )}
            {salon.paymentStatus === 'overdue_red_alert' && (
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1 font-mono animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                RED ALERT OVERDUE
              </span>
            )}
          </div>

          {salon.paymentStatus === 'overdue_red_alert' && (
            <button
              onClick={() => setIsPayModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium px-2.5 py-1 rounded-lg transition-colors active:scale-95"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>

      {paymentSuccessMsg && (
        <div className="bg-emerald-950/80 border border-emerald-800/60 p-2.5 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{paymentSuccessMsg}</span>
        </div>
      )}

      {/* Blueprint Commercial Structure Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white">Commercial Tier (Blueprint v2.4)</span>
          <span className="text-[10px] text-slate-400 font-mono">PKR / AED Multi-Currency</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => handlePackageTierChange('essential')}
            className={`p-2 rounded-xl text-left border transition-all text-xs ${
              salon.packageTier === 'essential'
                ? 'bg-sky-950/70 border-sky-500 text-white font-medium shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <div className="font-bold text-[11px]">Pkg 1: Essential</div>
            <div className="text-[10px] text-sky-400 font-mono mt-0.5">
              {salon.currency === 'PKR' ? 'PKR 1,500/mo' : 'AED 50/mo'}
            </div>
            <div className="text-[9px] text-slate-400 mt-1 line-clamp-1">
              Bot + 200 Import
            </div>
          </button>

          <button
            onClick={() => handlePackageTierChange('growth')}
            className={`p-2 rounded-xl text-left border transition-all text-xs ${
              salon.packageTier === 'growth'
                ? 'bg-sky-950/70 border-sky-500 text-white font-medium shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <div className="font-bold text-[11px]">Pkg 2: Growth</div>
            <div className="text-[10px] text-sky-400 font-mono mt-0.5">
              {salon.currency === 'PKR' ? 'PKR 2,000/mo' : 'AED 75/mo'}
            </div>
            <div className="text-[9px] text-slate-400 mt-1 line-clamp-1">
              + Missed Call &amp; Video
            </div>
          </button>

          <button
            onClick={() => handlePackageTierChange('enterprise')}
            className={`p-2 rounded-xl text-left border transition-all text-xs ${
              salon.packageTier === 'enterprise'
                ? 'bg-sky-950/70 border-sky-500 text-white font-medium shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <div className="font-bold text-[11px]">Pkg 3: Enterprise</div>
            <div className="text-[10px] text-sky-400 font-mono mt-0.5">
              {salon.currency === 'PKR' ? 'PKR 2,500/mo' : 'AED 100/mo'}
            </div>
            <div className="text-[9px] text-slate-400 mt-1 line-clamp-1">
              + 2-Step Review Booster
            </div>
          </button>
        </div>
      </div>

      {/* Blueprint Billing Simulation Playground */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>Interactive Policy Simulator</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Test Blueprint Rules</span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          Test the automated billing policy states from Section 7 of the blueprint:
        </p>

        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            onClick={() => handleSetState('paid')}
            className={`py-2 px-1 rounded-lg text-center text-xs font-medium border transition-colors ${
              salon.paymentStatus === 'paid'
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="block font-semibold text-[11px]">Active (Paid)</span>
            <span className="text-[9px] text-slate-500 font-mono">Normal Socket</span>
          </button>

          <button
            onClick={() => handleSetState('grace_period')}
            className={`py-2 px-1 rounded-lg text-center text-xs font-medium border transition-colors ${
              salon.paymentStatus === 'grace_period'
                ? 'bg-amber-950/80 border-amber-600 text-amber-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="block font-semibold text-[11px]">Grace (T+2)</span>
            <span className="text-[9px] text-slate-500 font-mono">3-Day Grace</span>
          </button>

          <button
            onClick={() => handleSetState('overdue_red_alert')}
            className={`py-2 px-1 rounded-lg text-center text-xs font-medium border transition-colors ${
              salon.paymentStatus === 'overdue_red_alert'
                ? 'bg-rose-950 border-rose-600 text-rose-200 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-rose-400 hover:bg-rose-950/30'
            }`}
          >
            <span className="block font-bold text-[11px]">RED ALERT (T+4)</span>
            <span className="text-[9px] text-rose-400 font-mono">Suspended</span>
          </button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-slate-400" />
            <span>Billing Ledger &amp; Receipts</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">EasyPaisa / JazzCash / Bank</span>
        </div>

        <div className="divide-y divide-slate-800">
          {invoices.map((inv) => (
            <div key={inv.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span>{inv.month}</span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                    PAID
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {inv.paymentMethod} · {inv.transactionRef}
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-white font-mono block">
                  {inv.currency} {inv.amount.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  Paid {inv.paidOn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-4 text-slate-100 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Clear Overdue Fee</h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>INVOICE DUE:</span>
                <span className="text-white font-bold">{salon.currency} {salon.monthlyFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>BENEFICIARY:</span>
                <span className="text-sky-400 font-bold">WORKCRAFT Engine Systems</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>RESTORATION:</span>
                <span className="text-emerald-400">Instant Automated Unlock</span>
              </div>
            </div>

            {/* Select Gateway */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400 block font-mono text-[10px] uppercase">
                Select Local Payment Channel:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('easypaisa')}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                    selectedMethod === 'easypaisa'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-emerald-400">EasyPaisa</div>
                  <div className="text-[10px] text-slate-400 font-mono">0300-8472910</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('jazzcash')}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                    selectedMethod === 'jazzcash'
                      ? 'bg-amber-950/60 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-amber-400">JazzCash</div>
                  <div className="text-[10px] text-slate-400 font-mono">0321-4455667</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank')}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                    selectedMethod === 'bank'
                      ? 'bg-sky-950/60 border-sky-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-sky-400">Bank Transfer</div>
                  <div className="text-[10px] text-slate-400 font-mono">HBL / ENBD IBAN</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                    selectedMethod === 'card'
                      ? 'bg-purple-950/60 border-purple-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-purple-400">Debit / Card</div>
                  <div className="text-[10px] text-slate-400 font-mono">Direct Gateway</div>
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm &amp; Unlock</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
