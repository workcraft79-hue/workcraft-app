import React from 'react';
import { ShieldCheck, PhoneOff, Radio, Lock, Server, Clock } from 'lucide-react';
import { PortalCard } from './PortalCard';

export const SupportSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Support Routing Primary Card */}
      <PortalCard title="Support Routing Architecture" kicker="SUPPORT ROUTING &amp; PRIVACY SHIELD">
        <div className="space-y-4">
          <p className="text-xs text-white/55 font-sans leading-relaxed">
            Enterprise privacy gateway decoupling the founder's personal contact information from salon tenants. All support requests are mediated through automated triage and routed via isolated tenant SIM channels (+92-300-WORKCRAFT-GW).
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <PhoneOff className="size-4" />
                <span className="font-mono text-xs font-bold uppercase">Zero Personal Disclosure</span>
              </div>
              <p className="text-[11px] text-white/55 font-sans leading-relaxed">
                Salon owners never see or receive founder personal numbers. Outbound messages appear natively from the salon's own dedicated business SIM.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#00FFFF]">
                <Clock className="size-4" />
                <span className="font-mono text-xs font-bold uppercase">15-Min Priority Window</span>
              </div>
              <p className="text-[11px] text-white/55 font-sans leading-relaxed">
                High-intent operational blockers are flagged automatically by Roman Urdu NLP filters for accelerated founder response.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#D9A441]">
                <Radio className="size-4" />
                <span className="font-mono text-xs font-bold uppercase">SIM Socket Gateway</span>
              </div>
              <p className="text-[11px] text-white/55 font-sans leading-relaxed">
                Direct Go-based WebSocket sockets connect to Android hardware dongles in Lahore, eliminating third-party cloud telephony costs ($0 fee).
              </p>
            </div>
          </div>
        </div>
      </PortalCard>

      {/* Support Rules & Policies */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PortalCard title="Support Routing Rules &amp; Safeguards" kicker="TENANT ISOLATION">
          <div className="space-y-3 font-mono text-xs">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[#F5F2E9] font-bold">
                <span>Rule 01: Audio Payload Sanitization</span>
                <span className="text-emerald-400 text-[10px]">ACTIVE</span>
              </div>
              <p className="text-[11px] text-white/55 font-sans">
                Voice notes are compressed to 16kHz mono Opus audio before transit, keeping edge network traffic minimal.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[#F5F2E9] font-bold">
                <span>Rule 02: Automatic Escalation on Dues Lock</span>
                <span className="text-[#D9A441] text-[10px]">ENFORCED</span>
              </div>
              <p className="text-[11px] text-white/55 font-sans">
                If a salon's analytics are locked after the 5th, inbound support queries prioritize payment reconciliation assistance.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[#F5F2E9] font-bold">
                <span>Rule 03: Field Agent Biometric Relay</span>
                <span className="text-emerald-400 text-[10px]">ACTIVE</span>
              </div>
              <p className="text-[11px] text-white/55 font-sans">
                Physical on-site issues are geo-routed to field agent Kamran with automatic SHA-256 dispatch receipts.
              </p>
            </div>
          </div>
        </PortalCard>

        <PortalCard title="Support Dispatch Channels" kicker="COMMUNICATION STATUS">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-black/40 border border-white/10 text-emerald-400 font-mono text-xs">
                  WA
                </span>
                <div>
                  <p className="text-xs font-bold text-[#F5F2E9]">WhatsApp Business SIM Tunnel</p>
                  <p className="text-[10px] font-mono text-white/55">Socket: ws://gateway.workcraft.local:8080</p>
                </div>
              </div>
              <span className="text-emerald-300 font-mono text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                CONNECTED
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-black/40 border border-white/10 text-[#00FFFF] font-mono text-xs">
                  SMS
                </span>
                <div>
                  <p className="text-xs font-bold text-[#F5F2E9]">Inbound Emergency SMS Fallback</p>
                  <p className="text-[10px] font-mono text-white/55">Latency: 1.2s · Active for critical alert triggers</p>
                </div>
              </div>
              <span className="text-[#00FFFF] font-mono text-[10px] font-bold bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded">
                STANDBY
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-[#F5F2E9]">Founder Privacy Guardrail 100% Locked</span>
              </div>
              <span className="text-[10px] font-mono text-[#D9A441]">+92-300-WORKCRAFT-GW</span>
            </div>
          </div>
        </PortalCard>
      </div>
    </div>
  );
};
