import React from 'react';
import {
  X,
  Radio,
  Clock,
  AlertTriangle,
  CheckCircle2,
  UsersRound,
  WalletCards,
  Mic,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MapPin,
  Smartphone,
  Lock,
} from 'lucide-react';
import { TabName } from '../types/workcraft';

interface DetailSheetProps {
  detail: string | null;
  onClose: () => void;
  go: (tab: TabName) => void;
  onOpenVoiceTicker?: () => void;
  onOpenCashModal?: () => void;
  onOpenReportModal?: () => void;
}

export const DetailSheet: React.FC<DetailSheetProps> = ({
  detail,
  onClose,
  go,
  onOpenVoiceTicker,
  onOpenCashModal,
  onOpenReportModal,
}) => {
  const [reminderDispatched, setReminderDispatched] = React.useState(false);
  if (!detail) return null;

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end bg-black/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-t-3xl border border-white/10 bg-[#102019] p-5 pb-8 shadow-2xl max-w-2xl mx-auto animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-[#D9A441]">
                OPERATIONAL TELEMETRY &amp; DRILL-DOWN
              </p>
              {detail === 'Salon connections' && (
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#10B981]/40 text-[#10B981] bg-[#10B981]/15">
                  LIVE
                </span>
              )}
              {detail === 'Maintenance queue' && (
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-red-500/40 text-red-400 bg-red-500/15">
                  ACTION
                </span>
              )}
              {detail === 'SIM Gateway Socket' && (
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#00FFFF]/40 text-[#00FFFF] bg-[#00FFFF]/15">
                  ONLINE
                </span>
              )}
              {detail === 'Revenue status' && (
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#D9A441]/40 text-[#D9A441] bg-[#D9A441]/15">
                  SETTLED
                </span>
              )}
            </div>
            <h3 className="mt-1 text-xl font-bold text-[#F5F2E9] tracking-tight">{detail}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close detail sheet"
            className="p-1.5 rounded-lg text-white/55 hover:text-white transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 1. Salon Connections (24 online - LIVE) */}
        {detail === 'Salon connections' && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-2 font-mono">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[10px] text-white/55 uppercase">Connected Nodes</p>
                <p className="mt-1 text-lg font-bold text-[#F5F2E9]">24 / 27 Online</p>
                <span className="text-[9px] text-emerald-400 font-bold">88.9% Live</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[10px] text-white/55 uppercase">WebSocket Latency</p>
                <p className="mt-1 text-lg font-bold text-[#00FFFF]">142 ms</p>
                <span className="text-[9px] text-emerald-400 font-bold">Sub-200ms Target</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[10px] text-white/55 uppercase">Cluster Uptime</p>
                <p className="mt-1 text-lg font-bold text-emerald-400">99.98%</p>
                <span className="text-[9px] text-emerald-400 font-bold">0 Dropouts</span>
              </div>
            </div>

            {/* City Distribution */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-2 font-mono">
              <p className="text-xs font-bold text-[#F5F2E9] uppercase tracking-wider">
                Geographic Terminal Distribution
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-black/40 p-2 border border-white/10">
                  <span className="text-white/55 block text-[10px]">Lahore (DHA/Gulberg)</span>
                  <span className="text-[#F5F2E9] font-bold">10 Terminals</span>
                </div>
                <div className="rounded-lg bg-black/40 p-2 border border-white/10">
                  <span className="text-white/55 block text-[10px]">Karachi (Clifton)</span>
                  <span className="text-[#F5F2E9] font-bold">9 Terminals</span>
                </div>
                <div className="rounded-lg bg-black/40 p-2 border border-white/10">
                  <span className="text-white/55 block text-[10px]">Islamabad (F-6/7)</span>
                  <span className="text-[#F5F2E9] font-bold">5 Terminals</span>
                </div>
              </div>
            </div>

            {/* Live Socket Stream */}
            <div className="space-y-2 font-mono">
              <p className="text-xs font-bold text-white/55 uppercase tracking-wider">
                Recent Socket Heartbeats
              </p>
              {[
                { name: 'Seven Cuts Salon', loc: 'Lahore DHA', ping: '118ms', time: '12s ago', status: 'LIVE' },
                { name: 'Noor Beauty Lounge', loc: 'Karachi Clifton', ping: '164ms', time: '45s ago', status: 'LIVE' },
                { name: 'The Groom Room', loc: 'Islamabad F-6', ping: '139ms', time: '1m ago', status: 'LIVE' },
              ].map((node) => (
                <div key={node.name} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[#F5F2E9] font-bold">{node.name}</span>
                    <span className="text-white/55 text-[10px]">({node.loc})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#00FFFF] text-[11px] font-bold">{node.ping}</span>
                    <span className="text-white/55 text-[10px]">{node.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Maintenance Queue (3 due today - ACTION) */}
        {detail === 'Maintenance queue' && (
          <div className="mt-4 space-y-4 font-mono">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase">3 Salons Due Today (5th of Month)</span>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  PKR 6,000 (10% SLA)
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-sans leading-relaxed">
                Grace period active until 11:59 PM. Core WhatsApp responder remains operational; analytics graphs automatically lock if payment remains unconfirmed after the 5th.
              </p>
            </div>

            {/* Query 1: Autonomous Cron Engine Status */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-bold">Autonomous Cron Engine: ACTIVE</span>
              </div>
              <span className="text-[10px] text-white/60">Fires Daily @ 09:00 AM via Central SIM</span>
            </div>

            {/* Salons with Pending Dues (10% Maintenance Tiers) */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-white/55 uppercase tracking-wider">
                Pending Salons in Maintenance Window
              </p>
              {[
                { name: 'Seven Cuts Salon', owner: 'Hamza', city: 'Lahore', amount: 'PKR 1,500', tier: 'Starter (10%)', method: 'EasyPaisa SMS Webhook expected' },
                { name: 'Royal Fade DHA', owner: 'Usman', city: 'Lahore', amount: 'PKR 2,000', tier: 'Growth (10%)', method: 'Direct Bank IBFT receipt pending' },
                { name: 'Glam Studio F-7', owner: 'Fatima', city: 'Islamabad', amount: 'PKR 2,500', tier: 'VIP (10%)', method: 'Self-serve payment link dispatched' },
              ].map((s) => (
                <div key={s.name} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F5F2E9]">{s.name}</span>
                      <span className="text-[10px] text-white/55 font-sans">· {s.owner} ({s.city})</span>
                    </div>
                    <p className="text-[10px] text-white/55 font-sans mt-0.5">{s.method} · <span className="text-[#00FFFF]">{s.tier}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#D9A441]">{s.amount}</span>
                    <span className="block text-[9px] text-amber-300">Due Today</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Query 1: Manual Test Override Button with Clear Distinction */}
            <div className="pt-2 space-y-1.5">
              <button
                type="button"
                onClick={() => setReminderDispatched(true)}
                className={`w-full rounded-xl py-2.5 text-xs font-mono font-bold uppercase transition text-center shadow-sm ${
                  reminderDispatched
                    ? 'bg-emerald-500 text-black'
                    : 'bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C]'
                }`}
              >
                {reminderDispatched
                  ? '✓ Manual Test Reminders Dispatched via Central SIM!'
                  : '🧪 Test Manual WhatsApp Payment Reminder Dispatch →'}
              </button>
              <p className="text-[10px] text-white/50 text-center font-sans">
                Automatic background cron runs daily at 09:00 AM; click above only to force an immediate test reminder.
              </p>
            </div>
          </div>
        )}

        {/* 3. SIM Gateway Socket Status (READY / ONLINE) */}
        {(detail === 'SIM Gateway Socket' || detail === 'Voice notes' || detail === 'Voice support' || detail === 'Voice messages' || detail === 'Voice queue' || detail === 'Voice') && (
          <div className="mt-4 space-y-4 font-mono">
            <div className="rounded-xl border border-[#00FFFF]/30 bg-[#00FFFF]/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00FFFF] uppercase">
                  Central SIM Socket Gateway (+92-300-WORKCRAFT-LOCAL)
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                  100% ONLINE · ZERO SPAM BLOCKS
                </span>
              </div>
              <p className="text-xs text-white/70 font-sans leading-relaxed">
                Dedicated hardware business SIM router. All customer booking dialogues, slot confirmations, and reminder broadcasts route exclusively through this verified business socket.
              </p>
            </div>

            {/* 3 Infrastructure Telemetry Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-[10px] text-white/45 uppercase block">Founder Identity</span>
                <span className="text-xs font-bold text-emerald-400 mt-1 block">100% Isolated</span>
                <span className="text-[9px] text-white/50">0 Personal Number Exposure</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-[10px] text-white/45 uppercase block">Safe Jitter Cadence</span>
                <span className="text-xs font-bold text-[#00FFFF] mt-1 block">4–9s Delay</span>
                <span className="text-[9px] text-white/50">Anti-Ban Rate Limited</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                <span className="text-[10px] text-white/45 uppercase block">Hardware Latency</span>
                <span className="text-xs font-bold text-[#D9A441] mt-1 block">18 ms</span>
                <span className="text-[9px] text-white/50">Local Android Bridge</span>
              </div>
            </div>

            {/* Live Socket Feed */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-white/55 uppercase tracking-wider">
                Live Gateway Activity Log
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-black/40 p-2 border border-white/5">
                  <span className="text-emerald-400 font-bold">✓ Outbound WhatsApp slot confirmed</span>
                  <span className="text-white/45 text-[10px]">Seven Cuts · 14s ago</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-black/40 p-2 border border-white/5">
                  <span className="text-[#00FFFF] font-bold">⚡ Inbound Roman Urdu query parsed</span>
                  <span className="text-white/45 text-[10px]">Noor Beauty · 38s ago</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-black/40 p-2 border border-white/5">
                  <span className="text-white/70 font-bold">🔄 Bridge keep-alive ping acknowledged</span>
                  <span className="text-white/45 text-[10px]">Socket 8080 · 1m ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Revenue Status (PKR 156k verified - SETTLED with Query 2 Current Month Breakup) */}
        {detail === 'Revenue status' && (
          <div className="mt-4 space-y-4 font-mono">
            <div className="rounded-xl border border-[#D9A441]/40 bg-white/[0.03] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#D9A441] uppercase">Current Month Collection Summary</span>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  PKR 156,000 VERIFIED
                </span>
              </div>
              <p className="text-xs text-white/55 font-sans leading-relaxed">
                Total inflows cleared via 100% automated direct digital payment rails. Zero cloud SaaS platform tolls or third-party telephony taxes incurred.
              </p>
            </div>

            {/* Query 2: Current Month Dual Breakup */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#F5F2E9] uppercase tracking-wider">
                  Current Month Revenue Breakup
                </p>
                <span className="text-[10px] text-[#00FFFF] font-bold">26 Active Partners</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* 1. Onboarding Setup Inflow */}
                <div className="rounded-xl border border-[#00FFFF]/30 bg-[#00FFFF]/5 p-3 space-y-1">
                  <span className="text-[10px] text-white/50 uppercase block">New Salons Onboarded</span>
                  <p className="text-lg font-bold text-[#00FFFF]">PKR 120,000</p>
                  <p className="text-[10px] text-white/70 font-sans">
                    8 Salons onboarded this month (@ PKR 15k–25k Setup fee)
                  </p>
                </div>

                {/* 2. Monthly Maintenance SLA Inflow */}
                <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-3 space-y-1">
                  <span className="text-[10px] text-white/50 uppercase block">Paid 10% Maintenance</span>
                  <p className="text-lg font-bold text-[#10B981]">PKR 36,000</p>
                  <p className="text-[10px] text-white/70 font-sans">
                    18 Salons settled current month 10% SLA fee
                  </p>
                </div>
              </div>

              {/* Inflow Distribution Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] text-white/60">
                  <span>Revenue Composition:</span>
                  <span>77% Setup · 23% Recurring</span>
                </div>
                <div className="h-2 w-full rounded-full bg-black/60 overflow-hidden flex border border-white/10 p-0.5">
                  <div className="h-full bg-[#00FFFF] rounded-l-full" style={{ width: '77%' }} title="New Setup Fee: 77%" />
                  <div className="h-full bg-emerald-400 rounded-r-full" style={{ width: '23%' }} title="Monthly 10% Maintenance: 23%" />
                </div>
              </div>
            </div>

            {/* Channel Breakdown */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#F5F2E9] uppercase tracking-wider">
                  Settled Digital Channels
                </p>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                  100% ZERO AGENT CASH VERIFIED
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg">
                  <span className="text-[#F5F2E9]">EasyPaisa SMS Webhooks (14 Salons)</span>
                  <span className="text-[#D9A441] font-bold">PKR 78,000</span>
                </div>
                <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg">
                  <span className="text-[#F5F2E9]">Direct Bank Transfer / IBFT (7 Salons)</span>
                  <span className="text-[#D9A441] font-bold">PKR 48,000</span>
                </div>
                <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg">
                  <span className="text-[#F5F2E9]">JazzCash SMS Webhook (5 Salons)</span>
                  <span className="text-[#D9A441] font-bold">PKR 30,000</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
