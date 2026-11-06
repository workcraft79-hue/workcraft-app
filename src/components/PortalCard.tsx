import React from 'react';
import { X } from 'lucide-react';

interface PortalCardProps {
  title: string;
  kicker: string;
  kickerColor?: string;
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const PortalCard: React.FC<PortalCardProps> = ({
  title,
  kicker,
  kickerColor,
  className = '',
  children,
  onClose,
}) => {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#102019] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:border-white/20 relative ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-[10px] font-mono font-bold uppercase tracking-[.18em] ${
              kickerColor || 'text-[#D9A441]'
            }`}
          >
            {kicker}
          </p>
          <h3 className="mt-1 text-lg font-bold text-[#F5F2E9] tracking-tight">{title}</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/55 hover:text-white hover:bg-white/[0.06] transition"
            aria-label="Close card"
          >
            <X className="size-5" />
          </button>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
};
