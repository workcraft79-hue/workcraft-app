import React from 'react';
import {
  UsersRound,
  AlertTriangle,
  Receipt,
  WalletCards,
  MapPin,
  Mic,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { TabName } from '../types/workcraft';
import { SALONS } from '../data/portalData';
import { PortalCard } from './PortalCard';

interface OverviewSectionProps {
  payment: boolean;
  setPayment: (val: boolean) => void;
  onOpenCashModal?: () => void;
  go: (tab: TabName) => void;
  setDetailSheet: (detail: string | null) => void;
  onOpenVoiceTicker: () => void;
  onInspectSalon?: (salonName: string) => void;
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
  onInspectSalon,
  activeSalonCount = 24,
  kamranCashHeld = 25000,
  go,
}) => {
  // Query 3: Show ONLY salons needing founder attention today (Pending 10% SLA / Dues After 5th / Connection Check)
  const attentionSalons = [
    ...SALONS.filter(
      (s) => (s.name === 'Seven Cuts Salon' && !payment) || s.status === 'Pending'
    ).map((s) => ({
      name: s.name,
      owner: s.owner,
      location: s.location,
      initials: s.initials,
      reason: '5th-of-Month 10% Fee Pending',
      badge: 'DUE AFTER 5TH',
      urgent: true,
    })),
    {
      name: 'Royal Fade DHA',
      owner: 'Usman',
      location: 'Lahore DHA',
      initials: 'RF',
      reason: 'Bank transfer receipt waiting match',
      badge: 'PAYMENT CHECK',
      urgent: true,
    },
    {
      name: 'Glam Studio F-7',
      owner: 'Fatima',
      location: 'Islamabad F-7',
      initials: 'GS',
      reason: 'WhatsApp reconnection check',
      badge: 'LINE CHECK',
      urgent: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP 4 PLAIN-ENGLISH DAILY CHECK CARDS (QUERY 1 — NO TECH JARGON, NO AGENT HUB) */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {[
          {
            label: 'Online Salons',
            detailKey: 'Salon connections',
            value: `${activeSalonCount} active`,
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
            onClick: () => setDetailSheet('Salon connections'),
          },
          {
            label: 'Dues Pending',
            detailKey: 'Maintenance queue',
            value: payment ? '2 due after 5th' : '3 due after 5th',
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
            onClick: () => setDetailSheet('Maintenance queue'),
          },
          {
            label: 'Cash Held by Agents',
            detailKey: 'Agent cash',
            value: `PKR ${kamranCashHeld.toLocaleString()}`,
            badge: 'AUTO-LIMIT',
            badgeClass: 'text-[#00FFFF] bg-[#00FFFF]/15 border-[#00FFFF]/40',
            borderClass: 'border-[#00FFFF]/30 hover:border-[#00FFFF]/70',
            bgClass: 'bg-[#00FFFF]/[0.05] hover:bg-[#00FFFF]/[0.10]',
            icon: WalletCards,
            iconClass: 'text-[#00FFFF] bg-[#00FFFF]/20 border-[#00FFFF]/40',
            valueClass: 'text-[#00FFFF]',
            labelClass: 'text-[#00FFFF]/80',
            hasPulse: true,
            pulseColor: 'bg-[#00FFFF]',
            onClick: () => go('Revenue'),
          },
          {
            label: 'Monthly Income',
            detailKey: 'Revenue status',
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
            onClick: () => setDetailSheet('Revenue status'),
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`rounded-xl border ${item.borderClass} ${item.bgClass} p-4 text-left transition active:scale-[0.99] group shadow-md`}
            >
              <div className="flex items-center justify-between">
                <span className={`grid size-8 place-items-center rounded-lg border ${item.iconClass}`}>
                  <Icon className="size-4" />
                </span>
                <span
                  className={`font-mono text-xs font-bold tracking-wider px-2 py-0.5 rounded-full border ${item.badgeClass} flex items-center gap-1.5`}
                >
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

      {/* 2. QUERY 2: NEEDS YOUR ATTENTION TODAY (UNREAD VOICE MESSAGES + AGENT CASH HANDOVER ONLY) */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Card A: Unread Salon Owner Voice Messages */}
        <button
          type="button"
          onClick={() => go('Voice')}
          className="rounded-2xl border border-[#00FFFF]/35 bg-[#00FFFF]/[0.05] hover:bg-[#00FFFF]/[0.10] p-4 sm:p-5 text-left transition flex items-center justify-between gap-4 shadow-md group"
        >
          <div className="flex items-start gap-3.5 min-w-0">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-[#00FFFF]/40 bg-[#00FFFF]/15 text-[#00FFFF]">
              <Mic className="size-5" />
            </span>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[#F5F2E9] group-hover:text-[#00FFFF] transition">
                  2 Unread Voice Messages
                </span>
                <span className="rounded-full border border-[#00FFFF]/40 bg-[#00FFFF]/20 px-2 py-0.5 text-[10px] font-mono font-bold text-[#00FFFF]">
                  NEW VOICE
                </span>
              </div>
              <p className="text-xs text-white/70 font-sans truncate">
                From Seven Cuts Salon &amp; Noor Beauty Lounge · Tap to listen &amp; reply
              </p>
              <p className="text-[11px] font-mono text-emerald-300">
                ✓ Deal videos are verified automatically by system
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-xl border border-[#00FFFF]/40 bg-[#00FFFF] px-3 py-2 text-xs font-mono font-bold text-[#12241C] shrink-0">
            <span>Listen</span>
            <ArrowRight className="size-3.5" />
          </span>
        </button>

        {/* Card B: Field Agent Cash Limit & Automatic Commission Settlement (Zero Manual Action) */}
        <div className="rounded-2xl border border-[#D9A441]/40 bg-[#D9A441]/[0.06] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-md">
          <div className="flex items-start gap-3.5 min-w-0">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-[#D9A441]/40 bg-[#D9A441]/15 text-[#D9A441]">
              <WalletCards className="size-5" />
            </span>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[#F5F2E9]">
                  Agent Cash Held: PKR {kamranCashHeld.toLocaleString()} / 50,000
                </span>
                <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                  48H · 2-DEAL CAP
                </span>
              </div>
              <p className="text-xs text-white/70 font-sans leading-relaxed">
                System automatically blocks a 3rd deal past 48h or PKR 50,000, auto-deducts from agent commission if overdue, and notifies the agent.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/35 bg-emerald-500/15 px-3 py-1.5 text-[10px] font-mono font-bold text-emerald-300 shrink-0 self-start sm:self-center">
            <CheckCircle2 className="size-3.5" />
            <span>AUTO-ENFORCED</span>
          </span>
        </div>
      </div>

      {/* 3. CORE EXECUTIVE GRID: SALONS NEEDING ATTENTION TODAY + 1-GLANCE MONEY SUMMARY */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Query 3 — Salons Needing Attention Today */}
        <PortalCard title="Salons Needing Attention Today" kicker="PRIORITY FOLLOW-UP LIST">
          <div className="space-y-3">
            {attentionSalons.map((salon) => (
              <div
                key={salon.name}
                onClick={() => (onInspectSalon ? onInspectSalon(salon.name) : go('Salon Owner Dashboard'))}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 hover:border-[#00FFFF]/40 hover:bg-white/[0.07] transition cursor-pointer"
                title={`Open ${salon.name} Read-Only Health View`}
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-black/40 border border-[#D9A441]/30 text-[10px] font-mono font-bold text-[#D9A441] group-hover:border-[#00FFFF]/50 group-hover:text-[#00FFFF] transition">
                  {salon.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[#F5F2E9] group-hover:text-[#00FFFF] transition">
                    {salon.name}
                  </p>
                  <p className="text-[10px] font-mono text-white/60">
                    {salon.owner} · {salon.location}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-amber-300 font-sans">{salon.reason}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${salon.name}, ${salon.location}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#00FFFF] hover:underline"
                    >
                      <MapPin className="size-3 text-[#D9A441]" />
                      Map
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded px-2.5 py-1 text-[9px] font-mono font-bold border ${
                      salon.urgent
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : 'border-[#00FFFF]/30 bg-[#00FFFF]/10 text-[#00FFFF]'
                    }`}
                  >
                    {salon.badge}
                  </span>
                  <ArrowRight className="size-3.5 text-white/40 group-hover:text-[#00FFFF] group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}

            {/* Link to Full Directory */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3.5 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Remaining {Math.max(1, activeSalonCount - attentionSalons.length)} salons are 100% healthy
              </span>
              <button
                type="button"
                onClick={() => go('Contact / Clients')}
                className="inline-flex items-center gap-1 font-bold text-[#00FFFF] hover:underline"
              >
                <span>View All {activeSalonCount} Salons</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </PortalCard>

        {/* Right Column: Query 5 — 1-Glance Monthly Money Summary + Plain-English WhatsApp Message Queue */}
        <div className="space-y-6">
          <PortalCard title="This Month's Money Summary" kicker="REVENUE & COLLECTIONS AT A GLANCE">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2.5 font-mono">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/25 p-3">
                  <span className="text-[10px] text-white/60 uppercase block">Collected</span>
                  <p className="text-base sm:text-lg font-black text-emerald-300 mt-1">
                    PKR 108,000
                  </p>
                  <span className="text-[9px] text-emerald-200/80 block mt-0.5">24 of 27 Paid</span>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-amber-950/25 p-3">
                  <span className="text-[10px] text-white/60 uppercase block">Due After 5th</span>
                  <p className="text-base sm:text-lg font-black text-amber-300 mt-1">
                    PKR 6,000
                  </p>
                  <span className="text-[9px] text-amber-200/80 block mt-0.5">3 Salons Pending</span>
                </div>

                <div className="rounded-xl border border-[#D9A441]/40 bg-[#D9A441]/10 p-3">
                  <span className="text-[10px] text-white/60 uppercase block">Agent Cash</span>
                  <p className="text-base sm:text-lg font-black text-[#D9A441] mt-1">
                    PKR {kamranCashHeld.toLocaleString()}
                  </p>
                  <span className="text-[9px] text-[#D9A441]/90 block mt-0.5">Kamran Handover</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs">
                <span className="text-white/75 font-sans">
                  Monthly Software &amp; WhatsApp Cost: <strong className="text-emerald-400 font-mono">$0.00 / mo</strong>
                </span>
                <button
                  type="button"
                  onClick={() => go('Revenue')}
                  className="inline-flex items-center gap-1 font-mono font-bold text-[#D9A441] hover:underline shrink-0"
                >
                  <span>Open Full Ledger</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </PortalCard>

          {/* Plain-English WhatsApp Delivery Health (Zero Developer Jargon) */}
          <PortalCard title="WhatsApp Message Queue" kicker="AUTOMATIC SENDING STATUS">
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#F5F2E9] font-mono">1,284</p>
                  <p className="text-[10px] font-mono text-white/55 mt-0.5">
                    booking reminders &amp; VIP deal messages sending safely
                  </p>
                </div>
                <span className="text-sm font-bold text-[#D9A441] font-mono">68% Sent</span>
              </div>

              <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#D9A441] to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(217,164,65,0.6)]"
                  style={{ width: '68%' }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-white/70 font-sans pt-0.5">
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
                  <ShieldCheck className="size-3.5" />
                  <span>Auto-spaced safely so salon WhatsApp lines stay protected</span>
                </span>
                <span className="text-[#00FFFF] font-mono text-[10px] font-bold">
                  <MessageSquare className="size-3 inline mr-1" />
                  100% Delivered
                </span>
              </div>
            </div>
          </PortalCard>
        </div>
      </div>
    </div>
  );
};
