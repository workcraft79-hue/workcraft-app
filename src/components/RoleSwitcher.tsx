import React from 'react';
import { AppRole } from '../types/workcraft';
import { Crown, Smartphone, Store, Shield } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
  activeSalonCount: number;
  kamranCashHeld: number;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
  activeSalonCount,
  kamranCashHeld,
}) => {
  return (
    <div className="w-full bg-[#102019] border-b border-emerald-500/20 px-3 py-2 sm:px-7">
      <div className="mx-auto max-w-[1440px] flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Role Navigation Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-500/60 hidden sm:inline-block mr-1">
            System Workspace:
          </span>

          {/* 1. Founder Dashboard */}
          <button
            onClick={() => onRoleChange('FOUNDER')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-mono font-bold transition ${
              currentRole === 'FOUNDER'
                ? 'bg-[#00FFFF] text-[#12241C] shadow-[0_0_10px_rgba(0,255,255,0.4)]'
                : 'bg-black/40 text-emerald-500/80 hover:text-white border border-emerald-500/20'
            }`}
          >
            <Crown className="size-3.5" />
            <span>FOUNDER DASHBOARD</span>
          </button>

          {/* 2. Field Agent Hub (Kamran) */}
          <button
            onClick={() => onRoleChange('AGENT_KAMRAN')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-mono font-bold transition ${
              currentRole === 'AGENT_KAMRAN'
                ? 'bg-[#D9A441] text-[#12241C] shadow-[0_0_10px_rgba(217,164,65,0.4)]'
                : 'bg-black/40 text-emerald-500/80 hover:text-white border border-emerald-500/20'
            }`}
          >
            <Smartphone className="size-3.5" />
            <span>FIELD AGENT (KAMRAN)</span>
            <span className="ml-1 rounded-full bg-black/30 px-1.5 py-0.2 text-[9px]">
              PKR {(kamranCashHeld / 1000).toFixed(0)}k
            </span>
          </button>

          {/* 3. Salon Owner PWA Simulator */}
          <button
            onClick={() => onRoleChange('SALON_PWA')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-mono font-bold transition ${
              currentRole === 'SALON_PWA'
                ? 'bg-emerald-400 text-[#12241C] shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                : 'bg-black/40 text-emerald-500/80 hover:text-white border border-emerald-500/20'
            }`}
          >
            <Store className="size-3.5" />
            <span>SALON PWA PORTAL</span>
            <span className="ml-1 rounded-full bg-black/30 px-1.5 py-0.2 text-[9px]">
              {activeSalonCount} Live
            </span>
          </button>
        </div>

        {/* Right: Security & Anonymity Badge */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500/80">
          <span className="flex items-center gap-1 bg-black/40 border border-emerald-500/20 px-2 py-1 rounded-md text-emerald-300">
            <Shield className="size-3 text-[#00FFFF]" />
            <span className="hidden md:inline">FOUNDER PRIVACY:</span>
            <strong className="text-[#00FFFF]">100% ISOLATED</strong>
          </span>
          <span className="hidden lg:inline-block text-emerald-500/60 font-sans">
            Central SIM Gateway: +92-300-WORKCRAFT-GW
          </span>
        </div>
      </div>
    </div>
  );
};
