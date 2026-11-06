import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert, X } from 'lucide-react';
import { SalonProfile } from '../types';

interface RedAlertBannerProps {
  salon: SalonProfile;
  onPayNow: () => void;
  onDismiss?: () => void;
}

export const RedAlertBanner: React.FC<RedAlertBannerProps> = ({
  salon,
  onPayNow,
  onDismiss
}) => {
  if (salon.paymentStatus !== 'overdue_red_alert') {
    return null;
  }

  return (
    <div className="bg-rose-950/90 border-b border-rose-600/40 px-3.5 py-2.5 text-rose-100 backdrop-blur-md transition-all">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2 pt-0.5">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs">
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-white uppercase text-[11px]">
              <span>⚠️ RED ALERT</span>
              <span className="text-rose-400 font-normal">·</span>
              <span className="text-rose-300 font-normal">Account Suspended</span>
            </div>
            <p className="mt-0.5 text-rose-200/90 leading-tight">
              Monthly maintenance fee of <strong className="text-white font-semibold">{salon.currency} {salon.monthlyFee.toLocaleString()}</strong> is overdue by {salon.daysOverdue} days. Automated WhatsApp dispatch and support are paused.
            </p>
          </div>
        </div>

        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-rose-300 hover:text-white p-1 rounded transition-colors shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-rose-800/40 pt-1.5">
        <span className="text-[10px] text-rose-300 font-mono">
          Lockout: Socket paused · +PKR 5,000 reconnect fee in 48h
        </span>
        <button
          onClick={onPayNow}
          className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] px-2.5 py-1 rounded shadow-sm transition-all whitespace-nowrap active:scale-95"
        >
          <span>Pay & Clear Lockout</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
