import React from 'react';
import {
  UsersRound,
  AlertTriangle,
  Receipt,
  Radio,
  MapPin,
  Archive,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { TabName } from '../types/workcraft';
import { SALONS } from '../data/portalData';
import { PortalCard } from './PortalCard';

interface OverviewSectionProps {
  payment: boolean;
  setPayment: (val: boolean) => void;
  onOpenCashModal: () => void;
  go: (tab: TabName) => void;
  setDetailSheet: (detail: string | null) => void;
  onOpenVoiceTicker: () => void;
  activeSalonCount?: number;
  kamranCashHeld?: number;
  onOpenSelfHealingModal?: () => void;
  onOpenVideoQAModal?: () => void;
  onOpenSalonPwa?: () => void;
  onSwitchToAgent?: () => void;
  onOpenPairing?: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  payment,
  setDetailSheet,
  activeSalonCount = 24,
  go,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. TOP STAT SUMMARY CARDS - UNIFIED 100% STATUS COLOR PALETTES (LIVE, ACTION, ONLINE, SETTLED) */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {[
          {
            label: 'Salon connections',
            value: `${activeSalonCount} online`,
            badge: 'LIVE',
            badgeClass: 'text-[#10B981] bg-[#10B981]/15 border-[#10B981]/40',
            borderClass: 'border-[#10B981]/30 hover:border-[#10B981]/70',
            bgClass: 'bg-[#10B981]/[0.05] hover:bg-[#10B981]/[0.10]',
            icon: UsersRound,
            iconClass: 'text-[#10B981] bg-[#10B981]/20 border-[#10B981]/40',
            valueClass: 'text-[#10B981]',
            labelClass: 'text-[#10B981]/80',
            hasPulse: true,
            pulseColor: 'bg-[#10B981]',
          },
          {
            label: 'Maintenance queue',
            value: '3 due today',
            badge: 'ACTION',
            badgeClass: 'text-red-400 bg-red-500/15 border-red-500/40',
            borderClass: 'border-red-500/30 hover:border-red-500/70',
            bgClass: 'bg-red-500/[0.05] hover:bg-red-500/[0.10]',
            icon: AlertTriangle,
            iconClass: 'text-red-400 bg-red-500/20 border-red-500/40',
            valueClass: 'text-red-400',
            labelClass: 'text-red-400/80',
            hasPulse: true,
            pulseColor: 'bg-red-500',
          },
          {
            label: 'SIM Gateway Socket',
            value: '99.9% Uptime',
            badge: 'ONLINE',
            badgeClass: 'text-[#00FFFF] bg-[#00FFFF]/15 border-[#00FFFF]/40',
            borderClass: 'border-[#00FFFF]/30 hover:border-[#00FFFF]/70',
            bgClass: 'bg-[#00FFFF]/[0.05] hover:bg-[#00FFFF]/[0.10]',
            icon: Radio,
            iconClass: 'text-[#00FFFF] bg-[#00FFFF]/20 border-[#00FFFF]/40',
            valueClass: 'text-[#00FFFF]',
            labelClass: 'text-[#00FFFF]/80',
            hasPulse: true,
            pulseColor: 'bg-[#00FFFF]',
          },
          {
            label: 'Revenue status',
            value: 'PKR 108k verified',
            badge: 'SETTLED',
            badgeClass: 'text-[#D9A441] bg-[#D9A441]/15 border-[#D9A441]/40',
            borderClass: 'border-[#D9A441]/30 hover:border-[#D9A441]/70',
            bgClass: 'bg-[#D9A441]/[0.05] hover:bg-[#D9A441]/[0.10]',
            icon: Receipt,
            iconClass: 'text-[#D9A441] bg-[#D9A441]/20 border-[#D9A441]/40',
            valueClass: 'text-[#D9A441]',
            labelClass: 'text-[#D9A441]/80',
            hasPulse: false,
            pulseColor: 'bg-[#D9A441]',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => setDetailSheet(item.label)}
              className={`rounded-xl border ${item.borderClass} ${item.bgClass} p-4 text-left transition active:scale-[0.99] group shadow-md`}
            >
              <div className="flex items-center justify-between">
                <span className={`grid size-8 place-items-center rounded-lg border ${item.iconClass}`}>
                  <Icon className="size-4" />
                </span>
                <span className={`font-mono text-xs font-bold tracking-wider px-2 py-0.5 rounded-full border ${item.badgeClass} flex items-center gap-1.5`}>
                  {item.hasPulse && <span className={`size-1.5 rounded-full ${item.pulseColor} animate-pulse`} />}
                  {item.badge}
                </span>
              </div>
              <p className={`mt-3 text-xl font-bold font-mono tracking-tight truncate ${item.valueClass} transition`}>
                {item.value}
              </p>
              <p className={`mt-0.5 text-[10px] font-mono font-bold uppercase tracking-wider truncate ${item.labelClass}`}>
                {item.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* 2. CORE EXECUTIVE DASHBOARD GRID: NETWORK TERMINAL ROSTER & BROADCAST QUEUE */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Network Terminal Roster */}
        <PortalCard title="Network Terminal Roster" kicker="REAL-TIME ACTIVE CONNECTIONS">
          <div className="space-y-3">
            {SALONS.map((salon) => (
              <div
                key={salon.name}
                onClick={() => go('Salon Owner Dashboard')}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 hover:border-[#00FFFF]/40 hover:bg-white/[0.07] transition cursor-pointer"
                title={`Open ${salon.name} Console`}
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-black/40 border border-[#D9A441]/30 text-[10px] font-mono font-bold text-[#D9A441] group-hover:border-[#00FFFF]/50 group-hover:text-[#00FFFF] transition">
                  {salon.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[#F5F2E9] group-hover:text-[#00FFFF] transition">{salon.name}</p>
                  <p className="text-[10px] font-mono text-white/55">
                    {salon.owner} · {salon.location}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${salon.name}, ${salon.location}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#00FFFF] hover:underline"
                  >
                    <MapPin className="size-3 text-[#D9A441]" />
                    Directions
                  </a>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded px-2.5 py-1 text-[9px] font-mono font-bold border ${
                      (salon.name === 'Seven Cuts Salon' && !payment) || salon.status === 'Pending'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    }`}
                  >
                    {salon.name === 'Seven Cuts Salon'
                      ? payment
                        ? 'Active · Paid'
                        : 'Pending 10% SLA'
                      : salon.status === 'Paid'
                      ? 'Active · Paid'
                      : 'Pending 10% SLA'}
                  </span>
                  <ArrowRight className="size-3.5 text-white/40 group-hover:text-[#00FFFF] group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}

            {/* Roster Telemetry Summary Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3.5 text-[11px] font-mono text-white/55">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                24 terminal nodes active · 10% SLA monitored
              </span>
              <span className="flex items-center gap-1.5 text-white/50">
                <Archive className="size-3.5" />
                12 archived terminals preserved
              </span>
            </div>
          </div>
        </PortalCard>

        {/* Right Column: Broadcast Queue & Safe Jitter Meter */}
        <PortalCard title="Broadcast Queue & Safe Jitter Meter" kicker="HARDWARE SIM GATEWAY">
          <div className="space-y-4">
            {/* Top Queue Counters */}
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-bold text-[#F5F2E9] font-mono">1,284</p>
                <p className="text-[10px] font-mono text-white/55 mt-0.5">
                  messages queued · 4–9s safe anti-ban cadence
                </p>
              </div>
              <span className="text-base font-bold text-[#D9A441] font-mono">68% Dispatched</span>
            </div>

            {/* Progress Bar with Amber Glow Fill */}
            <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#D9A441] to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(217,164,65,0.6)]"
                style={{ width: '68%' }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-white/55 pt-0.5">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Core customer messaging: 100% Active
              </span>
              <span className="text-[#00FFFF] font-bold">ETA 24 min</span>
            </div>

            {/* Telemetry Spec Grid */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#F5F2E9] flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  Anti-Ban Rate Limiter Guard
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  PROTECTED
                </span>
              </div>
              <p className="text-[11px] text-white/65 leading-relaxed font-sans">
                Outbound WhatsApp blasts are spaced with randomized 4–9 second jitter delays over the Central Android SIM Gateway. Ensures zero number bans and zero monthly carrier toll fees ($0/mo base stack).
              </p>
            </div>

            {/* SIM Gateway Telemetry Status */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[10px] uppercase text-white/55 font-bold">Central Socket</p>
                <p className="text-emerald-300 font-bold mt-0.5 flex items-center gap-1">
                  <Zap className="size-3 text-emerald-400" />
                  +92-300-WORKCRAFT
                </p>
                <p className="text-[9px] text-white/45 mt-0.5">Go-Fiber whatsmeow</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[10px] uppercase text-white/55 font-bold">Delivery Success</p>
                <p className="text-[#00FFFF] font-bold mt-0.5">100.0% Verified</p>
                <p className="text-[9px] text-white/45 mt-0.5">0 carrier drops</p>
              </div>
            </div>
          </div>
        </PortalCard>
      </div>

    </div>
  );
};
