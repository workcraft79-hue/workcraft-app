import React from 'react';
import { Smartphone, Monitor, ChevronDown, Radio, ShieldCheck } from 'lucide-react';
import { PairingState, SalonProfile } from '../types';

interface HeaderProps {
  salon: SalonProfile;
  salons: SalonProfile[];
  onSelectSalon: (salon: SalonProfile) => void;
  pairingState: PairingState;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  salon,
  salons,
  onSelectSalon,
  pairingState,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-3.5 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-2">
        {/* Zone 1: Clean Wordmark */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center font-black text-white text-xs tracking-wider shadow-sm shadow-sky-600/30 shrink-0">
            W
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-white whitespace-nowrap truncate">
              WORKCRAFT <span className="text-sky-400 font-semibold">Local</span>
            </h1>
            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 font-mono">
              <span>Go Engine</span>
              <span>·</span>
              <span className="text-emerald-400">whatsmeow</span>
            </p>
          </div>
        </div>

        {/* Zone 2: Branch Selector & Telemetry */}
        <div className="flex items-center gap-2">
          {/* Salon Branch Switcher */}
          <div className="relative">
            <select
              value={salon.id}
              onChange={(e) => {
                const found = salons.find((s) => s.id === e.target.value);
                if (found) onSelectSalon(found);
              }}
              className="appearance-none bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer max-w-[130px] sm:max-w-[170px] truncate"
              title="Switch Active Salon Branch"
            >
              {salons.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                  {s.name} ({s.currency})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Device Frame Viewport Toggle */}
          <button
            onClick={onToggleMobileFrame}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              isMobileFrame
                ? 'bg-sky-950/80 border-sky-600/60 text-sky-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle between 375px Mobile Frame View & Full Width View"
          >
            {isMobileFrame ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                <span className="whitespace-nowrap">375px Shell</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                <span className="whitespace-nowrap">Full View</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
