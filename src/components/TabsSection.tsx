import React, { useState } from 'react';
import {
  Archive,
  CreditCard,
  Search,
  Eye,
  CheckCircle2,
  ShieldCheck,
  X,
  Smartphone,
} from 'lucide-react';
import { TabName } from '../types/workcraft';
import { SALONS, ARCHIVED_SALONS } from '../data/portalData';
import { PortalCard } from './PortalCard';

interface TabsSectionProps {
  active: TabName;
  go: (tab: TabName) => void;
  setPaymentRouting: (method: string) => void;
  onInspectSalon?: (salonName: string) => void;
}

export const TabsSection: React.FC<TabsSectionProps> = ({
  active,
  go,
  setPaymentRouting,
  onInspectSalon,
}) => {
  // Contact search state (Query 3)
  const [clientSearch, setClientSearch] = useState('');

  // Founder alert report phone state (Query 4)
  const [founderAlertPhone, setFounderAlertPhone] = useState('+92 321 0000000');
  const [savedPhoneToast, setSavedPhoneToast] = useState(false);

  // Selected Salon for Deep Dive Dossier
  const [selectedSalonDetail, setSelectedSalonDetail] = useState<{
    name: string;
    owner: string;
    phone: string;
    location: string;
    gps: string;
    startDate: string;
    monthsActive: number;
    monthsPaid: number;
    totalRevenue: number;
    setupFee: number;
    monthlyFee: number;
    history: { month: string; amount: number; method: string; txn: string; status: string }[];
  } | null>(null);

  const [reactivationSuccessMsg, setReactivationSuccessMsg] = useState<string | null>(null);

  const handleOpenSalonDossier = (salonName: string) => {
    if (salonName === 'Seven Cuts Salon') {
      setSelectedSalonDetail({
        name: 'Seven Cuts Salon',
        owner: 'Hamza Tariq',
        phone: '+92 300 4567890',
        location: 'Sector C, CCA Phase 5 DHA, Lahore',
        gps: '31.4705° N, 74.4109° E',
        startDate: '12 May 2026',
        monthsActive: 6,
        monthsPaid: 6,
        totalRevenue: 24000,
        setupFee: 15000,
        monthlyFee: 1500, // 10% Starter maintenance
        history: [
          { month: 'October 2026', amount: 1500, method: 'EasyPaisa Auto-Webhook', txn: 'EP-95412', status: 'Settled & Verified' },
          { month: 'September 2026', amount: 1500, method: 'EasyPaisa Auto-Webhook', txn: 'EP-92338', status: 'Settled & Verified' },
          { month: 'August 2026', amount: 1500, method: 'EasyPaisa Auto-Webhook', txn: 'EP-90114', status: 'Settled & Verified' },
          { month: 'July 2026', amount: 1500, method: 'Direct IBFT Meezan Bank', txn: 'MB-41002', status: 'Settled & Verified' },
          { month: 'June 2026', amount: 1500, method: 'JazzCash Direct Wallet', txn: 'JC-99201', status: 'Settled & Verified' },
          { month: 'May 2026', amount: 16500, method: 'EasyPaisa (Setup + May Maint)', txn: 'EP-88219', status: 'Settled & Verified' },
        ],
      });
    } else {
      setSelectedSalonDetail({
        name: salonName,
        owner: 'Registered Owner',
        phone: '+92 300 1234567',
        location: 'Lahore / Karachi Metro',
        gps: '31.5204° N, 74.3587° E',
        startDate: '18 June 2026',
        monthsActive: 5,
        monthsPaid: 5,
        totalRevenue: 22500,
        setupFee: 15000,
        monthlyFee: 1500, // 10% maintenance
        history: [
          { month: 'October 2026', amount: 1500, method: 'EasyPaisa', txn: 'EP-77412', status: 'Settled' },
          { month: 'September 2026', amount: 1500, method: 'JazzCash', txn: 'JC-66338', status: 'Settled' },
          { month: 'August 2026', amount: 1500, method: 'Bank IBFT', txn: 'BK-55114', status: 'Settled' },
          { month: 'July 2026', amount: 1500, method: 'EasyPaisa', txn: 'EP-44002', status: 'Settled' },
          { month: 'June 2026', amount: 16500, method: 'EasyPaisa (Setup + June)', txn: 'EP-33219', status: 'Settled' },
        ],
      });
    }
  };

  const handleSimulateAutoReactivation = () => {
    setReactivationSuccessMsg(
      'Payment of PKR 1,500 detected via EasyPaisa webhook! Metric box reactivated instantly · Continuous Care SLA active (<60 min recovery) · WhatsApp dispatch: "Assalamu Alaikum! We have received your 10% maintenance payment. Your Workcraft metric box and automated booking services are fully active."'
    );
    setTimeout(() => setReactivationSuccessMsg(null), 6000);
  };

  const getTitle = () => {
    switch (active) {
      case 'Contact / Clients':
        return 'Client directory & archive';
      case 'Revenue':
        return 'Automated maintenance payments & financial ledger';
      case 'Pairing':
        return 'Live salon pairing handshake';
      case 'Flow Builder':
        return 'Tri-lingual routing state machine';
      case 'Settings':
        return 'System settings & runtime config';
      default:
        return active;
    }
  };

  return (
    <PortalCard title={getTitle()} kicker="WORKCRAFT LOCAL" onClose={() => go('Overview')}>
      <div className="flex flex-col gap-5 text-sm text-[#F5F2E9]">
        {/* 1. Contact / Clients Tab */}
        {active === 'Contact / Clients' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-black/40 border border-white/10 text-[#D9A441]">
                  <Archive className="size-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#F5F2E9]">Active Salon Partners</h4>
                  <p className="text-[11px] font-mono text-white/55">
                    Click any salon (e.g. Seven Cuts Salon) to view start date, months paid, lifetime revenue, and auto-reactivation.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono font-bold text-emerald-300">
                {SALONS.length} LIVE
              </span>
            </div>

            {/* Search Bar across all active salons (Query 3) */}
            <div className="relative">
              <Search className="size-4 text-white/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Search salon name, owner, or city..."
                className="w-full rounded-xl border border-white/15 bg-black/40 pl-10 pr-4 py-2.5 text-xs font-mono text-[#F5F2E9] placeholder:text-white/40 focus:border-[#00FFFF] focus:outline-none"
              />
            </div>

            {/* Client Rows / Salon Cards */}
            <div className="space-y-2.5">
              {SALONS.filter(
                (s) =>
                  !clientSearch.trim() ||
                  s.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                  s.owner.toLowerCase().includes(clientSearch.toLowerCase()) ||
                  s.location.toLowerCase().includes(clientSearch.toLowerCase())
              ).map((salon, idx) => (
                <div
                  key={salon.name}
                  className="w-full text-left rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-[#00FFFF]/40 hover:bg-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-black/40 border border-white/10 text-xs font-mono font-bold text-[#D9A441]">
                      {salon.initials}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#00FFFF]">
                          [WC-{101 + idx}]
                        </span>
                        <h5 className="text-base font-semibold text-[#F5F2E9] tracking-tight">
                          {salon.name}
                        </h5>
                      </div>
                      <p className="mt-0.5 text-xs font-mono text-white/55">
                        Owner: {salon.owner} · {salon.location} · {salon.plan}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                    <span
                      className={`font-mono text-xs px-2.5 py-0.5 rounded-full border ${
                        salon.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {salon.status === 'Paid' ? 'Paid ✓' : 'Due After 5th'}
                    </span>
                    <button
                      type="button"
                      onClick={() => (onInspectSalon ? onInspectSalon(salon.name) : go('Salon Owner Dashboard'))}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#D9A441]/40 bg-[#D9A441]/10 hover:bg-[#D9A441]/20 px-3 py-1.5 text-xs font-mono font-bold text-[#D9A441] transition"
                    >
                      <Eye className="size-3.5" />
                      <span>Inspect Salon</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenSalonDossier(salon.name)}
                      className="rounded-lg border border-white/10 bg-white/[0.04] hover:border-[#00FFFF] px-3 py-1.5 text-xs font-mono text-[#00FFFF] transition"
                    >
                      Billing &amp; Receipts →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DEEP-DIVE SALON OWNER DOSSIER MODAL */}
            {selectedSalonDetail && (
              <div
                className="fixed inset-0 z-[80] grid place-items-center bg-black/85 p-4 backdrop-blur-md"
                onClick={() => setSelectedSalonDetail(null)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-2xl rounded-3xl border border-[#00FFFF]/30 bg-[#102019] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto space-y-5"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#00FFFF]">[WC-101]</span>
                        <h3 className="text-xl font-bold text-[#F5F2E9]">{selectedSalonDetail.name}</h3>
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                          VERIFIED PARTNER
                        </span>
                      </div>
                      <p className="text-xs font-mono text-white/55 mt-1">
                        Owner: {selectedSalonDetail.owner} · WhatsApp: {selectedSalonDetail.phone}
                      </p>
                      <p className="text-[11px] font-mono text-white/45 mt-0.5">
                        Location: {selectedSalonDetail.location} ({selectedSalonDetail.gps})
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSalonDetail(null);
                      }}
                      className="size-8 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 transition active:scale-95 shrink-0"
                      title="Close Dossier Modal"
                      aria-label="Close Dossier Modal"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {/* Feedback Banner */}
                  {reactivationSuccessMsg && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs font-mono text-emerald-300 space-y-1 animate-in fade-in">
                      <p className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                        <span>System Auto-Reactivation Triggered</span>
                      </p>
                      <p className="text-[11px] text-white/80 font-sans leading-relaxed">
                        {reactivationSuccessMsg}
                      </p>
                    </div>
                  )}

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <span className="text-[10px] text-white/45 uppercase block">Services Started</span>
                      <span className="text-xs font-bold text-[#F5F2E9] mt-0.5 block truncate">
                        {selectedSalonDetail.startDate}
                      </span>
                      <span className="text-[9px] text-[#00FFFF]">{selectedSalonDetail.monthsActive} Months Active</span>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <span className="text-[10px] text-white/45 uppercase block">Months Paid</span>
                      <span className="text-base font-bold text-emerald-400 mt-0.5 block">
                        {selectedSalonDetail.monthsPaid} / {selectedSalonDetail.monthsActive} Paid
                      </span>
                      <span className="text-[9px] text-emerald-300">100% On-Time Record</span>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <span className="text-[10px] text-white/45 uppercase block">Lifetime Revenue</span>
                      <span className="text-base font-bold text-[#D9A441] mt-0.5 block">
                        PKR {selectedSalonDetail.totalRevenue.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-white/45">Setup + Recurring</span>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <span className="text-[10px] text-white/45 uppercase block">Monthly Tier</span>
                      <span className="text-xs font-bold text-[#F5F2E9] mt-0.5 block">
                        PKR {selectedSalonDetail.monthlyFee.toLocaleString()} / mo
                      </span>
                      <span className="text-[9px] text-[#00FFFF]">Self-Paid Direct</span>
                    </div>
                  </div>

                  {/* 6-Month Operational & Revenue Review Status (Promo on hold as decided) */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white/70 flex items-center gap-1.5 uppercase tracking-wider">
                        6-Month Operational &amp; Revenue Audit Status
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        100% COMPLIANT
                      </span>
                    </div>
                    <p className="text-xs text-[#F5F2E9] font-sans leading-relaxed">
                      <strong>{selectedSalonDetail.name}</strong> has maintained continuous on-time payments across {selectedSalonDetail.monthsPaid} active billing cycles. Total revenue generated to date: <strong className="text-[#D9A441] font-mono">PKR {selectedSalonDetail.totalRevenue.toLocaleString()}</strong>.
                    </p>
                    <p className="text-[11px] text-white/45 font-mono">
                      * Operational Policy: Promotional deals and marketing bonus programs are on hold. The founder will review aggregate 6-month revenue performance before deciding on promo launches.
                    </p>
                  </div>

                  {/* Disconnected Salon & Instant Auto-Reactivation Flow with Native Dialect Support */}
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#00FFFF] uppercase">
                        Autonomous Payment Detection &amp; Native Welcome Dispatch
                      </span>
                      <span className="text-[9px] text-emerald-400">TOUCHLESS ENGINE</span>
                    </div>
                    <p className="text-xs text-white/70 font-sans leading-relaxed">
                      If the salon owner is remote (or in MENA / abroad) and maintenance charges were disconnected post-5th:
                      <br />
                      <strong>No agent physical visit is required.</strong> As soon as the owner pays via EasyPaisa, JazzCash, IBFT, or Stripe/Tap, the system automatically detects the payment, clears the analytics lock, activates the metric box, and pushes the welcome-back message in the owner's preferred dialect starting with <em>“Assalam o alaikum”</em>:
                    </p>

                    <div className="rounded-lg bg-black/60 border border-white/10 p-3 text-[11px] font-mono text-emerald-300 space-y-1">
                      <p className="text-white/45 text-[10px] uppercase font-bold">Auto-Generated Native WhatsApp Template (Strict Greeting Rule):</p>
                      <p className="italic font-sans">
                        “Assalamu Alaikum {selectedSalonDetail.owner}! Aap ki 10% maintenance payment PKR {selectedSalonDetail.monthlyFee.toLocaleString()} receive ho gayi hai. Continuous Care SLA (&lt;60 min recovery) active hai aur booking lines dubara open ho chuki hain. Aap ka metric box ab live hai.”
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSimulateAutoReactivation}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00FFFF] hover:bg-[#38e8e8] text-[#12241C] py-2.5 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
                    >
                      <span>Simulate Auto-Detection &amp; Metric Box Reactivation</span>
                    </button>
                  </div>

                  {/* Complete Month-by-Month Financial Ledger */}
                  <div className="space-y-2 font-mono">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/55 font-bold uppercase tracking-wider">
                        Payment History Ledger ({selectedSalonDetail.history.length} Months)
                      </span>
                      <span className="text-[#D9A441] font-bold">
                        Total Settled: PKR {selectedSalonDetail.totalRevenue.toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {selectedSalonDetail.history.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-2.5"
                        >
                          <div>
                            <span className="text-[#F5F2E9] font-bold">{h.month}</span>
                            <span className="text-white/45 text-[11px] block">
                              {h.method} · Ref: {h.txn}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[#D9A441] font-bold block">
                              PKR {h.amount.toLocaleString()}
                            </span>
                            <span className="text-emerald-400 text-[10px]">{h.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Archived Salon Profiles Container */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mt-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <p className="text-xs font-mono font-bold text-[#F5F2E9] uppercase tracking-wider">
                  Archived / Restorable Profiles (12 Profiles)
                </p>
                <span className="text-[10px] font-mono text-white/55">
                  Historical templates preserved
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 mt-3">
                {ARCHIVED_SALONS.slice(0, 4).map((arch) => (
                  <div
                    key={arch.name}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 p-2.5"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#F5F2E9]">{arch.name}</p>
                      <p className="text-[10px] font-mono text-white/55">
                        {arch.owner} · {arch.plan}
                      </p>
                    </div>
                    <button
                      onClick={() => go('Pairing')}
                      className="text-[10px] font-mono font-bold text-[#D9A441] hover:underline"
                    >
                      Reactivate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Revenue Tab */}
        {active === 'Revenue' && (
          <div className="space-y-6">
            {/* Top Financial Stat Highlights */}
            <div className="grid gap-3.5 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-mono uppercase tracking-wider text-white/55">
                  Total Verified MRR
                </p>
                <p className="mt-2 text-2xl font-bold font-mono text-[#D9A441]">
                  PKR 108,000
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/55">24 of 27 Paid</span>
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                    Verified
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-mono uppercase tracking-wider text-white/55">
                  In-Hand Cash Held (Kamran)
                </p>
                <p className="mt-2 text-2xl font-bold font-mono text-[#D9A441]">
                  PKR 25,000
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/55">Target: 48h Handover</span>
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-300 border border-amber-500/40">
                    Liability
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-mono uppercase tracking-wider text-white/55">
                  Server &amp; WhatsApp Rent
                </p>
                <p className="mt-2 text-2xl font-bold font-mono text-emerald-300">
                  $0.00 / mo
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/55">Self-Hosted Android SIM</span>
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Verification Gateways */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#D9A441] uppercase tracking-wider">
                Automated Webhook Channels &amp; Reconciliation
              </h4>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { name: 'EasyPaisa Webhook', desc: 'Auto-unlocks salon analytics instantly upon incoming SMS payload matching tenant ID.', status: 'Webhook Ready' },
                  { name: 'JazzCash Webhook', desc: 'Simulates transaction regex string parser with fallback to manual founder review.', status: 'Webhook Ready' },
                  { name: 'Stripe Connect (Overseas 20/80 Split)', desc: 'Same-currency direct split outside Pakistan: 20% paid straight to Agent local bank/Stripe in deal currency, 80% to WorkCraft (zero double FX conversion loss).', status: 'Direct Split' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setPaymentRouting(item.name)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-white/20 group"
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="size-5 text-[#D9A441] group-hover:scale-105 transition-transform" />
                      <span className="rounded bg-white/[0.06] px-2 py-0.5 text-[10px] font-mono text-[#F5F2E9] border border-white/10">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-bold text-[#F5F2E9]">{item.name}</p>
                    <p className="mt-1 text-[11px] text-white/55 font-sans leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Pairing Tab */}
        {active === 'Pairing' && (
          <div className="space-y-4">
            <div className="mx-auto grid size-52 place-items-center rounded-2xl bg-white p-5 text-[#12241C] shadow-[0_0_24px_rgba(0,255,255,0.2)] border-2 border-[#00FFFF]">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                <rect x="5" y="5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" rx="2" />
                <rect x="10" y="10" width="12" height="12" fill="currentColor" rx="1" />
                <rect x="73" y="5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" rx="2" />
                <rect x="78" y="10" width="12" height="12" fill="currentColor" rx="1" />
                <rect x="5" y="73" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" rx="2" />
                <rect x="10" y="78" width="12" height="12" fill="currentColor" rx="1" />
                <circle cx="34" cy="12" r="2.5" fill="currentColor" />
                <circle cx="50" cy="12" r="2.5" fill="currentColor" />
                <circle cx="66" cy="12" r="2.5" fill="currentColor" />
                <circle cx="12" cy="34" r="2.5" fill="currentColor" />
                <circle cx="12" cy="50" r="2.5" fill="currentColor" />
                <circle cx="12" cy="66" r="2.5" fill="currentColor" />
                <rect x="42" y="42" width="16" height="16" fill="#D9A441" rx="2" />
              </svg>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs font-mono font-bold text-[#F5F2E9]">
                Scan with WhatsApp on Salon Terminal
              </p>
              <p className="text-[11px] font-mono text-emerald-400">
                Active Alphanumeric Pairing Key: <span className="text-[#00FFFF] font-bold">WC-7892-SYS</span>
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white/55 text-center space-y-1 font-mono">
              <p className="text-[#F5F2E9] font-bold">WhatsApp Device Link Ready</p>
              <p className="text-[10px] text-[#00FFFF]">Central SIM Protection Active · Instant Connection</p>
            </div>
          </div>
        )}

        {/* 4. Settings Tab (Query 4: 100% Autonomous Self-Reporting — Zero Manual Switches) */}
        {(active === 'Settings' || active === 'Flow Builder') && (
          <div className="space-y-6">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-300">
                  <ShieldCheck className="size-4" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                    Auto-Managed System Protection (Zero Manual Work Needed)
                  </h4>
                </div>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                  100% AUTOMATIC
                </span>
              </div>
              <p className="text-xs text-white/75 font-sans leading-relaxed">
                You do not need to turn switches on or off manually. The system detects issues, sends reminders, switches backup lines, and protects client bookings automatically—and simply sends a clean summary report to your Founder number.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#D9A441] uppercase tracking-wider">
                What the System Handles Automatically For You
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: '5th-of-Month Reminders & Overdue Lock',
                    desc: 'Automatically reminds salons 2 days before month end, on the 3rd, and on the 5th—and reports overdue salons to you.',
                  },
                  {
                    title: 'Backup SIM & Connection Guard',
                    desc: 'If any WhatsApp phone line slows down or disconnects, the system shifts messages to the backup line automatically.',
                  },
                  {
                    title: 'Automatic Deal Video Check & Broadcast',
                    desc: 'Checks every uploaded salon video against quality rules and approves or guides the owner automatically in their language.',
                  },
                  {
                    title: 'Customer Chat & Founder Privacy Shield',
                    desc: 'Locks exact salon prices so customers never get wrong rates, and keeps your personal phone number 100% hidden.',
                  },
                ].map((rule) => (
                  <div
                    key={rule.title}
                    className="rounded-xl border border-white/10 bg-black/35 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#F5F2E9]">{rule.title}</span>
                      <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300 shrink-0">
                        AUTO-RUNS ✓
                      </span>
                    </div>
                    <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Single Founder Alert Phone Field */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#00FFFF] uppercase tracking-wider">
                Where the System Sends Your Founder Reports
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <label className="text-xs font-bold text-white/65 font-mono flex-1">
                  FOUNDER WHATSAPP NUMBER (SYSTEM REPORTS ONLY)
                  <input
                    value={founderAlertPhone}
                    onChange={(e) => setFounderAlertPhone(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#102019] px-3 py-2.5 text-sm text-[#F5F2E9] font-mono focus:border-[#00FFFF] focus:outline-none"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSavedPhoneToast(true);
                    setTimeout(() => setSavedPhoneToast(false), 3000);
                  }}
                  className="rounded-xl bg-[#D9A441] hover:bg-[#e0b252] px-5 py-2.5 text-xs font-mono font-bold text-[#12241C] uppercase transition active:scale-95 shrink-0"
                >
                  {savedPhoneToast ? 'Saved ✓' : 'Update Report Number'}
                </button>
              </div>
              {savedPhoneToast && (
                <p className="text-xs font-mono text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" />
                  System will send automatic daily summaries &amp; overdue alerts to {founderAlertPhone}.
                </p>
              )}
            </div>

            {/* Query 1 Visual Review Panel: Mobile Home-Screen Shortcut Icon (Isolated strictly inside Settings) */}
            <div className="rounded-xl border border-[#D9A441]/35 bg-black/45 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#D9A441]">
                  <Smartphone className="size-4" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                    Mobile Home-Screen Shortcut Icon Review
                  </h4>
                </div>
                <span className="rounded-full bg-[#D9A441]/15 border border-[#D9A441]/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#D9A441]">
                  FOR FOUNDER REVIEW · HOME SCREEN ONLY
                </span>
              </div>
              <p className="text-xs text-white/65 font-sans leading-relaxed">
                This Gold Bullion &quot;W&quot; + crisp WORKCRAFT shortcut icon appears strictly when installed on a phone home screen (never modifying your dashboard headers or footers):
              </p>
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { role: 'Founder App', label: 'WorkCraft' },
                  { role: 'Field Agent App', label: 'WorkCraft Agent' },
                  { role: 'Salon Owner App', label: 'WorkCraft Salon' },
                ].map((item) => (
                  <div
                    key={item.role}
                    className="rounded-xl border border-white/10 bg-[#102019] p-3 flex flex-col items-center text-center gap-2"
                  >
                    <img
                      src="/icon.svg"
                      alt={`${item.label} Mobile Shortcut Icon`}
                      className="size-[60px] rounded-2xl shadow-[0_6px_18px_rgba(0,0,0,0.65)] border border-[#D9A441]/40"
                    />
                    <div>
                      <p className="text-[11px] font-sans font-bold text-white leading-tight">
                        {item.label}
                      </p>
                      <p className="text-[9px] font-mono text-white/45 mt-0.5">{item.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalCard>
  );
};
