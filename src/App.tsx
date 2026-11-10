import React, { useState, useEffect } from 'react';
import {
  House,
  QrCode,
  UsersRound,
  GitFork,
  WalletCards,
  Settings2,
  Mic,
  ShieldCheck,
  Bell,
  Pause,
  Play,
  ArrowRight,
  Menu,
  X,
  Smartphone,
  Scissors,
  Lock,
  AlertOctagon,
  Radio,
} from 'lucide-react';

import { TabName, SystemErrorTelemetry } from './types/workcraft';
import { WATERMARK_URL } from './data/portalData';
import { BrandMark } from './components/BrandMark';
import { OverviewSection } from './components/OverviewSection';
import { VoiceSection } from './components/VoiceSection';
import { SupportSection } from './components/SupportSection';
import { VoiceSupportDrawer } from './components/VoiceSupportDrawer';
import { TabsSection } from './components/TabsSection';
import { DetailSheet } from './components/DetailSheet';
import { FieldAgentHub } from './components/FieldAgentHub';
import { SalonPwaSimulator } from './components/SalonPwaSimulator';
import { SalonOwnerDashboard } from './components/SalonOwnerDashboard';
import { SelfHealingModal } from './components/SelfHealingModal';
import { AiVideoQAModal } from './components/AiVideoQAModal';
import {
  CashPaymentModal,
  FinancialReportModal,
  PaymentRoutingModal,
  NotificationsDrawer,
} from './components/Modals';

const INITIAL_ERRORS: SystemErrorTelemetry[] = [
  {
    id: 'ERR-902',
    component: 'BookingSlotPicker.tsx',
    filePath: 'src/components/BookingSlotPicker.tsx',
    line: 142,
    salonId: 'WC-101',
    salonName: 'Seven Cuts Salon',
    error: "TypeError: Cannot read properties of undefined (reading 'stylist_id')",
    stack: "at BookingSlotPicker.render (src/components/BookingSlotPicker.tsx:142)\nat FiberNode.invokeMount (fiber.go:88)",
    status: 'AUTO_DEPLOYED',
    diff: "- const stylistId = booking.stylist.id;\n+ const stylistId = booking.stylist?.id ?? 'default_stylist_pool';",
    confidence: 99.4,
    timestamp: '2 min ago · V8 Sandbox Tested & Auto-Deployed (0s Downtime)',
  },
  {
    id: 'ERR-884',
    component: 'EasyPaisaWebhookHandler.go',
    filePath: 'backend/gateway/easypaisa.go',
    line: 78,
    salonId: 'WC-102',
    salonName: 'Noor Beauty Lounge',
    error: "panic: runtime error: slice bounds out of range [:12] with capacity 8",
    stack: "goroutine 42 [running]:\ngithub.com/workcraft/gateway.ParseSMSTID(0xc000...)\nmain.go:78",
    status: 'AUTO_DEPLOYED',
    diff: "- tid := smsBody[4:16]\n+ tid := extractRegexTID(smsBody, `\\b\\d{10,12}\\b`)",
    confidence: 99.9,
    timestamp: '14 min ago · Auto-Patched & Hot-Reloaded (0s Downtime)',
  },
];

export default function App() {
  const [activeSalonCount, setActiveSalonCount] = useState(24);
  const [kamranCashHeld, setKamranCashHeld] = useState(25000);
  const [isSelfHealingOpen, setIsSelfHealingOpen] = useState(false);
  const [isVideoQAOpen, setIsVideoQAOpen] = useState(false);
  const [isSalonPwaModalOpen, setIsSalonPwaModalOpen] = useState(false);
  const [telemetries, setTelemetries] = useState<SystemErrorTelemetry[]>(INITIAL_ERRORS);
  const [activeOnboarding, setActiveOnboarding] = useState<{ token: string; salonName: string } | null>({
    token: 'wc_sec_rfade_9821',
    salonName: 'Royal Fade Lounge',
  });
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Founder Command Center Workspace Navigation
  const [activeTab, setActiveTab] = useState<TabName>('Overview');

  // Query 1: Detect WhatsApp direct remote agent enrollment link (/enroll or ?id=...&pin=...)
  const [initialEnrollAgentData, setInitialEnrollAgentData] = useState<{
    id?: string;
    pin?: string;
    name?: string;
    phone?: string;
    city?: string;
  } | null>(null);

  // Pure 3-Role Isolation Architecture (Query 5):
  // - FOUNDER: Central Command, Full Fleet Dossier, Add Agents, Kill-Switches, Full 3-Way Ledger
  // - FIELD_AGENT: Field Operations, Salon Onboarding & QR Pairing, Personal Commission View
  // - SALON_OWNER: Self-Serve Onboarding, WhatsApp Device Link, Live Queue, Catalog, Broadcasts
  const [activeRole, setActiveRole] = useState<'FOUNDER' | 'FIELD_AGENT' | 'SALON_OWNER'>('FOUNDER');

  useEffect(() => {
    try {
      const search = window.location.search;
      const path = window.location.pathname;
      const hash = window.location.hash;
      const params = new URLSearchParams(search);
      
      // Query 5: Social Media Campaign / Facebook Ad Direct Link Detection
      // e.g. /onboard, /join-salon, ?onboard=salon, ?salon_signup=true, ?ref=social
      const isSalonDirectRoute =
        path.includes('/onboard') ||
        path.includes('/salon') ||
        hash.includes('onboard') ||
        params.has('onboard') ||
        params.has('salon_signup') ||
        params.get('role') === 'salon_owner' ||
        params.get('ref') === 'fb' ||
        params.get('ref') === 'social';

      if (isSalonDirectRoute) {
        setActiveRole('SALON_OWNER');
        setActiveTab('Salon Owner Dashboard');
        return;
      }

      // Agent Remote Enrollment Link Detection (/enroll, ?id=...&pin=...)
      const isEnrollRoute = 
        path.includes('/enroll') || 
        hash.includes('enroll') || 
        params.has('enroll') || 
        params.get('role') === 'agent' ||
        (params.has('id') && (params.has('pin') || params.has('auth')));

      if (isEnrollRoute) {
        const id = params.get('id') || undefined;
        const pin = params.get('pin') || params.get('auth') || undefined;
        const phone = params.get('phone') || undefined;
        const name = params.get('name') || undefined;
        const city = params.get('city') || undefined;

        setInitialEnrollAgentData({ id, pin, phone, name, city });
        setActiveRole('FIELD_AGENT');
        setActiveTab('Agent Hub / Onboarding');
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isVoiceDrawerOpen, setIsVoiceDrawerOpen] = useState(false);
  const [paymentRoutingMethod, setPaymentRoutingMethod] = useState<string | null>(null);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGlobalPaused, setIsGlobalPaused] = useState(false);
  const [isSimulatedErrorActive, setIsSimulatedErrorActive] = useState(false);
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [isPaymentPaid, setIsPaymentPaid] = useState(false);
  const [detailSheet, setDetailSheet] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 5000);
  };

  const handleSalonCreated = (salon: { name: string; owner: string; phone: string; location: string; coords: string }) => {
    const token = `wc_sec_${salon.name.toLowerCase().replace(/\s+/g, '')}_${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveOnboarding({ token, salonName: salon.name });
    showToast(`📩 Automated WhatsApp invite dispatched to ${salon.owner} (${salon.name}) via Central SIM Gateway (+92-300-WORKCRAFT-LOCAL)`);
  };

  const handleCashCollected = (amount: number, salonName: string) => {
    setKamranCashHeld((prev) => prev + amount);
    showToast(`💵 PKR ${amount.toLocaleString()} Cash Liability Logged with Biometric Hash · Dual digital receipts pushed to Kamran & ${salonName}`);
  };

  const handlePairingComplete = (salonName: string) => {
    setActiveSalonCount((prev) => prev + 1);
    setIsSalonPwaModalOpen(false);
    showToast(`🎉 ${salonName} Paired Successfully! Active Salon Nodes: ${activeSalonCount + 1}`);
  };

  const handleApplyPatch = (id: string) => {
    setTelemetries((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'AUTO_DEPLOYED' as const } : t))
    );
    showToast(`⚡ Autonomous AI Patch for ${id} verified in V8 Sandbox & hot-deployed with 0s downtime!`);
  };

  const handleVideoApproved = (filename: string) => {
    showToast(`🎬 ${filename} Passed Gemini AI Video QA & Queued for Rate-Limited Broadcast!`);
  };

  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // Dedicated navigation order matching unified founder portal (cleaner sidebar)
  const navItems: [TabName, React.FC<{ className?: string }>][] = [
    ['Overview', House],
    ['Agent Hub / Onboarding', Smartphone],
    ['Salon Owner Dashboard', Scissors],
    ['Contact / Clients', UsersRound],
    ['Flow Builder', GitFork],
    ['Revenue', WalletCards],
    ['Voice', Mic],
    ['Support', ShieldCheck],
    ['Settings', Settings2],
  ];

  const mobileNavItems: [TabName, React.FC<{ className?: string }>, string][] = [
    ['Overview', House, 'Overview'],
    ['Agent Hub / Onboarding', Smartphone, 'Agent Hub'],
    ['Salon Owner Dashboard', Scissors, 'Salon Owner'],
    ['Voice', Mic, 'Voice'],
    ['Revenue', WalletCards, 'Revenue'],
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#12241C] text-[#F5F2E9] font-sans selection:bg-[#D9A441] selection:text-[#12241C]">
      {/* Real-Time Interconnection Toast Banner */}
      {toastNotification && (
        <div className="fixed top-4 right-3 sm:right-6 z-[90] max-w-md rounded-2xl border border-white/20 bg-[#102019]/95 p-3.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-3 text-xs font-mono text-[#00FFFF] flex items-center justify-between gap-3">
          <span>{toastNotification}</span>
          <button
            onClick={() => setToastNotification(null)}
            className="text-white/60 hover:text-white shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Sidebar (Desktop Persistent & Mobile Slide-Over Drawer) */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/10 bg-[#102019] px-5 py-5 transition-transform duration-200 lg:static lg:translate-x-0`}
        >
          {/* Top Logo */}
          <div className="relative flex min-h-[76px] items-center justify-center">
            <BrandMark />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute right-0 top-1 rounded-lg p-1.5 text-white/60 hover:text-white lg:hidden transition"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mt-6 text-[10px] font-mono font-bold uppercase tracking-[.25em] text-white/45">
            WORKSPACE
          </div>

          {/* Main Nav Items */}
          <nav className="mt-3 flex flex-col gap-1.5" aria-label="Main navigation">
            {navItems.map(([name, Icon]) => {
              const isActive = activeTab === name;
              return (
                <button
                  key={name}
                  onClick={() => handleTabChange(name)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[12px] font-mono transition ${
                    isActive
                      ? 'bg-white/[0.06] text-[#F5F2E9] border border-white/10 font-bold'
                      : 'text-white/70 hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  <Icon className="size-[17px] text-[#D9A441]" />
                  <span>{name}</span>
                  {name === 'Voice' && (
                    <span className="ml-auto rounded-full bg-white/[0.08] border border-white/10 px-2 py-0.5 text-[9px] font-bold text-[#00FFFF]">
                      2 unread
                    </span>
                  )}
                  {name === 'Revenue' && (
                    <span className="ml-auto size-2 rounded-full bg-[#D9A441] animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Central SIM Gateway Status */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-[10px] font-mono space-y-1">
            <div className="flex items-center justify-between text-white/55">
              <span>SIM GATEWAY</span>
              <span className="text-emerald-400 font-bold">TUNNEL ON</span>
            </div>
            <p className="text-white/80 font-bold truncate">+92-300-WORKCRAFT-LOCAL</p>
            <p className="text-white/45 flex items-center gap-1">
              <Lock className="size-3 text-[#D9A441]" />
              Founder Identity Isolated
            </p>
          </div>

          {/* SIDEBAR FOOTER TYPOGRAPHY LOCK (Screenshot 1) */}
          <div className="mt-auto border-t border-white/10 p-4 pt-5 pb-2 bg-[#102019]">
            {/* 1. Top: WORKCRAFT Watermark graphic */}
            <div className="mb-3 flex justify-center">
              <img
                src={WATERMARK_URL}
                alt="WORKCRAFT"
                className="h-auto w-[150px] object-contain opacity-90"
              />
            </div>
            {/* 2. Middle: FOUNDER in Cyan (#00FFFF) with bold tracking */}
            {/* 3. Bottom: Farhan Abid in text-[#F5F2E9] font-bold */}
            <div className="text-center">
              <p className="text-xs font-mono font-black tracking-[0.3em] text-[#00FFFF] uppercase">
                FOUNDER
              </p>
              <p className="mt-1 text-sm font-bold text-[#F5F2E9] tracking-wide">
                Farhan Abid
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <button
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu overlay"
          />
        )}

        {/* Main Application Body */}
        <section className="min-w-0 flex-1 flex flex-col pb-24 lg:pb-8">
          {/* Top Bar Header with WORKCRAFT Watermark + DASHBOARD in #00FFFF (Screenshot 1) */}
          <header className="sticky top-0 z-30 grid h-[72px] grid-cols-[auto_1fr_auto] items-center border-b border-white/10 bg-[#12241C]/90 backdrop-blur-md px-4 sm:px-7 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg p-2 text-white/70 hover:text-white lg:hidden transition"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            </div>

            {/* Central Top Bar: Watermark + DASHBOARD (#00FFFF) */}
            <div className="flex flex-col items-center justify-center leading-none">
              <img
                src={WATERMARK_URL}
                alt="WORKCRAFT"
                className="h-auto w-[142px] object-contain opacity-95"
              />
              <span className="mt-1 text-[10px] font-mono font-black tracking-[0.3em] text-[#00FFFF] uppercase drop-shadow-[0_0_6px_rgba(0,255,255,0.4)]">
                DASHBOARD
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="relative rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white/70 hover:border-white/20 hover:text-white transition"
                aria-label="Open notifications"
              >
                <Bell className="size-[17px]" />
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#00FFFF] animate-ping" />
              </button>

              <button
                onClick={() => setIsGlobalPaused(!isGlobalPaused)}
                className={`hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-mono font-bold sm:flex transition hover:border-white/20 ${
                  isGlobalPaused
                    ? 'border-amber-500/40 bg-amber-500/20 text-amber-300 animate-pulse'
                    : 'text-white/80'
                }`}
                aria-pressed={isGlobalPaused}
              >
                {isGlobalPaused ? <Play className="size-3 text-[#D9A441]" /> : <Pause className="size-3 text-[#D9A441]" />}
                <span>{isGlobalPaused ? 'Resume queue' : 'Global pause'}</span>
              </button>
            </div>
          </header>

          {/* Body Content Container */}
          <div className="mx-auto max-w-[1440px] w-full p-4 sm:p-7 flex-1">
            {/* View Mode Header */}
            {/* View Mode Header & Status Bar */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                {/* SYSTEM HEALTH & TELEMETRY STRIP */}
                <div className="flex flex-wrap items-center gap-2 mb-2 font-mono">
                  {/* 1. All Systems Operational (Separate from Self-Healing) */}
                  <div
                    onClick={() => {
                      if (isSimulatedErrorActive || isGlobalPaused) {
                        setIsSelfHealingOpen(true);
                      }
                    }}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-mono transition ${
                      isSimulatedErrorActive || isGlobalPaused
                        ? 'border-red-500/50 bg-red-950/40 text-red-400 font-bold cursor-pointer hover:bg-red-950/60'
                        : 'border-emerald-500/30 bg-emerald-950/30 text-emerald-400 font-bold'
                    }`}
                  >
                    {isSimulatedErrorActive || isGlobalPaused ? (
                      <>
                        <AlertOctagon className="size-3.5 text-red-400 shrink-0 animate-pulse" />
                        <span>
                          System Disrupted / Global Pause ·{' '}
                          <span className="underline text-red-300">
                            Pinpoint: BookingSlotPicker.tsx:142
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="size-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span>All Systems Operational (Load &lt; 10% · Latency 22ms)</span>
                      </>
                    )}
                  </div>

                  {/* 2. Autonomous Self-Healing: Active (Separate Clickable Button) */}
                  <button
                    type="button"
                    onClick={() => setIsSelfHealingOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#00FFFF]/30 bg-[#00FFFF]/10 px-3 py-1.5 text-xs font-mono text-[#00FFFF] hover:border-[#00FFFF]/60 hover:bg-[#00FFFF]/20 transition"
                  >
                    <Radio className="size-3 text-[#00FFFF]" />
                    <span>Autonomous Self-Healing: Active</span>
                  </button>

                  {/* 3. Founder Diagnostic State Simulator Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsSimulatedErrorActive(!isSimulatedErrorActive)}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-mono text-white/50 hover:text-white hover:border-white/20 transition"
                    title="Toggle simulated system disruption to test red banner & pinpoint diagnostic"
                  >
                    <span>{isSimulatedErrorActive ? '✓ Clear Disruption' : '⚡ Simulate Bug Pinpoint'}</span>
                  </button>
                </div>

                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-[#F5F2E9]">
                  {activeTab === 'Agent Hub / Onboarding'
                    ? 'Agent Hub & Touchless Onboarding'
                    : activeTab === 'Salon Owner Dashboard'
                    ? 'Salon Owner Portal & Client Node Inspector'
                    : activeTab === 'Overview'
                    ? 'Operations overview'
                    : activeTab}
                </h2>
                <p className="mt-1 text-sm text-white/55 font-sans">
                  {activeTab === 'Agent Hub / Onboarding'
                    ? 'Unified field lead capture (3 inputs only), GPS auto-pinning, and sequential pairing QR.'
                    : activeTab === 'Salon Owner Dashboard'
                    ? "Live queue, 24/7 AI WhatsApp bot simulator, 1-tap rate editor, Google 5-Star booster, and 10% SLA maintenance."
                    : activeTab === 'Voice'
                    ? 'Private founder audio feed and auto-dialect translation.'
                    : activeTab === 'Support'
                    ? 'Central SIM Gateway routing & founder personal privacy isolation.'
                    : 'Founder control for local salon operations.'}
                </p>
              </div>

              {activeTab === 'Overview' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="items-center gap-2 rounded-xl bg-[#D9A441] px-4 py-2 text-xs font-mono font-bold text-[#12241C] uppercase flex hover:bg-[#e0b252] transition active:scale-95 shadow-sm"
                  >
                    <span>View reports</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Dynamic Unified Content */}
            {activeTab === 'Agent Hub / Onboarding' ? (
              <FieldAgentHub
                onSalonCreated={handleSalonCreated}
                onCashCollected={handleCashCollected}
                onOpenSalonPwa={(token, salon) => {
                  setActiveOnboarding({ token, salonName: salon });
                  setIsSalonPwaModalOpen(true);
                }}
                kamranCashHeld={kamranCashHeld}
                onClose={() => handleTabChange('Overview')}
                initialAutoOpenEnrollment={!!initialEnrollAgentData}
                initialEnrollAgentData={initialEnrollAgentData || undefined}
                userRole={activeRole === 'FIELD_AGENT' ? 'FIELD_AGENT' : 'FOUNDER'}
              />
            ) : activeTab === 'Salon Owner Dashboard' ? (
              <SalonOwnerDashboard onClose={() => handleTabChange('Overview')} />
            ) : activeTab === 'Voice' ? (
              <VoiceSection />
            ) : activeTab === 'Support' ? (
              <SupportSection />
            ) : activeTab === 'Overview' ? (
              <OverviewSection
                payment={isPaymentPaid}
                setPayment={setIsPaymentPaid}
                onOpenCashModal={() => setIsCashModalOpen(true)}
                go={handleTabChange}
                setDetailSheet={setDetailSheet}
                onOpenVoiceTicker={() => setIsVoiceDrawerOpen(true)}
                activeSalonCount={activeSalonCount}
                kamranCashHeld={kamranCashHeld}
                onOpenSelfHealingModal={() => setIsSelfHealingOpen(true)}
                onOpenVideoQAModal={() => setIsVideoQAOpen(true)}
                onOpenSalonPwa={() => setIsSalonPwaModalOpen(true)}
                onSwitchToAgent={() => handleTabChange('Agent Hub / Onboarding')}
                onOpenPairing={() => setIsPairingModalOpen(true)}
              />
            ) : (
              <TabsSection
                active={activeTab}
                go={handleTabChange}
                setPaymentRouting={setPaymentRoutingMethod}
              />
            )}
          </div>
        </section>
      </div>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <nav
        className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-white/10 bg-[#12241C]/95 p-2 shadow-2xl backdrop-blur-lg lg:hidden"
        aria-label="Quick navigation"
      >
        {mobileNavItems.map(([name, Icon, label]) => {
          const isActive = activeTab === name;
          return (
            <button
              key={name}
              onClick={() => handleTabChange(name)}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-mono font-bold transition ${
                isActive
                  ? 'text-[#00FFFF] bg-white/[0.08]'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Global Broadcast Pause Alert */}
      {isGlobalPaused && (
        <div className="fixed inset-x-4 bottom-20 z-50 rounded-xl border border-amber-500/40 bg-amber-500/20 p-3 text-xs font-mono font-bold text-amber-200 shadow-xl lg:bottom-4 lg:left-auto lg:right-4 lg:w-80">
          ⚠️ Global pause is active. New broadcasts are halted; queued messages remain safely held.
        </div>
      )}

      {/* Dedicated Voice Ticker Support Drawer */}
      <VoiceSupportDrawer
        isOpen={isVoiceDrawerOpen}
        onClose={() => setIsVoiceDrawerOpen(false)}
      />

      {/* Detail Bottom Sheet */}
      <DetailSheet
        detail={detailSheet}
        onClose={() => setDetailSheet(null)}
        go={handleTabChange}
        onOpenVoiceTicker={() => setIsVoiceDrawerOpen(true)}
        onOpenCashModal={() => setIsCashModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Modals */}
      <CashPaymentModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
        onSave={() => {
          setIsCashModalOpen(false);
          setIsPaymentPaid(true);
        }}
      />

      <FinancialReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <PaymentRoutingModal
        method={paymentRoutingMethod}
        onClose={() => setPaymentRoutingMethod(null)}
        onSave={() => setPaymentRoutingMethod(null)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenVoiceTicker={() => setIsVoiceDrawerOpen(true)}
      />

      {/* Autonomous Self-Healing Telemetry Modal */}
      <SelfHealingModal
        isOpen={isSelfHealingOpen}
        onClose={() => setIsSelfHealingOpen(false)}
        telemetries={telemetries}
        onApplyPatch={handleApplyPatch}
      />

      {/* Gemini AI Video Validation QA Pipeline Modal */}
      <AiVideoQAModal
        isOpen={isVideoQAOpen}
        onClose={() => setIsVideoQAOpen(false)}
        onVideoApproved={handleVideoApproved}
      />

      {/* Salon PWA Simulator Modal (Founder stays inside Unified Dashboard) */}
      {isSalonPwaModalOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setIsSalonPwaModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl rounded-3xl border border-white/10 bg-[#102019] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-[#00FFFF]">
                  LIVE SIMULATION · SALON OWNER PWA EXPERIENCE
                </p>
                <h3 className="text-lg font-bold text-[#F5F2E9]">
                  {activeOnboarding?.salonName || 'Royal Fade Lounge'} · Mobile Onboarding &amp; Regional Checkout
                </h3>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSalonPwaModalOpen(false);
                }}
                className="size-8 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 transition active:scale-95 shrink-0"
                title="Close Simulator"
                aria-label="Close Simulator"
              >
                <X className="size-4" />
              </button>
            </div>

            <SalonPwaSimulator
              salonName={activeOnboarding?.salonName || 'Royal Fade Lounge'}
              token={activeOnboarding?.token || 'wc_sec_rfade_9821'}
              onPairingComplete={handlePairingComplete}
              onClose={() => setIsSalonPwaModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Dedicated Pairing QR Code Modal */}
      {isPairingModalOpen && (
        <div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setIsPairingModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-[#00FFFF]/40 bg-[#102019] p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4 text-center"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00FFFF]">
                  FOUNDER DASHBOARD PAIRING
                </p>
                <h3 className="text-lg font-bold text-[#F5F2E9]">Terminal Multi-Device QR</h3>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPairingModalOpen(false);
                }}
                className="size-8 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 transition active:scale-95 shrink-0"
                title="Close Pairing Modal"
                aria-label="Close Pairing Modal"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mx-auto grid size-52 place-items-center rounded-2xl bg-white p-5 text-slate-900 shadow-[0_0_24px_rgba(0,255,255,0.2)] border-2 border-[#00FFFF]">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                <rect x="5" y="5" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="4" rx="2" />
                <rect x="11" y="11" width="12" height="12" fill="currentColor" rx="1" />
                <rect x="71" y="5" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="4" rx="2" />
                <rect x="77" y="11" width="12" height="12" fill="currentColor" rx="1" />
                <rect x="5" y="71" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="4" rx="2" />
                <rect x="11" y="77" width="12" height="12" fill="currentColor" rx="1" />
                <circle cx="36" cy="17" r="3" fill="currentColor" />
                <circle cx="50" cy="17" r="3" fill="currentColor" />
                <circle cx="64" cy="17" r="3" fill="currentColor" />
                <circle cx="20" cy="50" r="3" fill="currentColor" />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
                <circle cx="80" cy="50" r="3" fill="currentColor" />
                <circle cx="36" cy="83" r="3" fill="currentColor" />
                <circle cx="50" cy="83" r="3" fill="currentColor" />
                <circle cx="64" cy="83" r="3" fill="currentColor" />
                <rect x="42" y="42" width="16" height="16" fill="#D9A441" rx="2" />
              </svg>
            </div>

            <div className="space-y-1 font-mono">
              <p className="text-xs font-bold text-[#F5F2E9]">
                Scan via WhatsApp ➔ Linked Devices ➔ Link a Device
              </p>
              <p className="text-[11px] text-[#00FFFF]">
                Alternative Alphanumeric Key: <strong>WC-7892-SYS</strong>
              </p>
              <p className="text-[10px] text-white/50">
                SIM Socket: +92-300-WORKCRAFT-LOCAL · Latency: &lt;140ms
              </p>
            </div>

            <button
              onClick={() => {
                setIsPairingModalOpen(false);
                showToast('🎉 Terminal handshake verified! Socket listener ACTIVE with Central SIM Gateway (+92-300-WORKCRAFT-LOCAL)');
              }}
              className="w-full rounded-xl bg-[#00FFFF] hover:bg-[#38e8e8] py-2.5 text-xs font-mono font-bold uppercase text-[#12241C] transition active:scale-95 shadow-md"
            >
              Simulate Test Scan &amp; Handshake
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
