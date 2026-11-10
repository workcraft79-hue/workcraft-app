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
  Globe,
  ChevronDown,
} from 'lucide-react';

import { TabName } from './types/workcraft';
import { WATERMARK_URL } from './data/portalData';
import { BrandMark } from './components/BrandMark';
import { OverviewSection } from './components/OverviewSection';
import { VoiceSection } from './components/VoiceSection';
import { VoiceSupportDrawer } from './components/VoiceSupportDrawer';
import { TabsSection } from './components/TabsSection';
import { DetailSheet } from './components/DetailSheet';
import { FieldAgentHub } from './components/FieldAgentHub';
import { SalonPwaSimulator } from './components/SalonPwaSimulator';
import { SalonOwnerDashboard } from './components/SalonOwnerDashboard';
import { SilentSelfHealingBoundary } from './components/SilentSelfHealingBoundary';
import {
  FinancialReportModal,
  PaymentRoutingModal,
  NotificationsDrawer,
} from './components/Modals';

export default function App() {
  const [activeSalonCount, setActiveSalonCount] = useState(24);
  const [kamranCashHeld, setKamranCashHeld] = useState(25000);
  const [isSalonPwaModalOpen, setIsSalonPwaModalOpen] = useState(false);
  const [activeOnboarding, setActiveOnboarding] = useState<{ token: string; salonName: string } | null>({
    token: 'wc_sec_rfade_9821',
    salonName: 'Royal Fade Lounge',
  });
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [inspectSalonName, setInspectSalonName] = useState<string | undefined>(undefined);
  const [hasCompletedSalonOnboarding, setHasCompletedSalonOnboarding] = useState(true);
  const [onboardedSalonName, setOnboardedSalonName] = useState<string | undefined>(undefined);

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

  // Pure 3-Role Isolation Architecture:
  // - FOUNDER: Central Command, Fleet Dossier, Salons Health, 3-Way Ledger
  // - FIELD_AGENT: Strictly Field Agent Hub / Enrollment / Commission Ledger / Node Repair
  // - SALON_OWNER: Social Ad Links land in Onboarding First -> Then Private Salon Owner Dashboard Only
  const [activeRole, setActiveRole] = useState<'FOUNDER' | 'FIELD_AGENT' | 'SALON_OWNER'>('FOUNDER');

  useEffect(() => {
    try {
      const search = window.location.search;
      const path = window.location.pathname;
      const hash = window.location.hash;
      const params = new URLSearchParams(search);

      // Social Media Campaign / Direct Signup Link Detection:
      // Route straight into Onboarding First unless ?paired=true
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
        const isAlreadyPaired = params.get('paired') === 'true';
        const customName = params.get('salon') || params.get('salon_name') || undefined;
        if (customName) setOnboardedSalonName(customName);
        setHasCompletedSalonOnboarding(isAlreadyPaired);
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
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGlobalPaused, setIsGlobalPaused] = useState(false);
  const [pausedCountries, setPausedCountries] = useState<Record<'PK' | 'AE' | 'SA' | 'EU' | 'GLOBAL', boolean>>({
    PK: false,
    AE: false,
    SA: false,
    EU: false,
    GLOBAL: false,
  });
  const [isCountryPauseOpen, setIsCountryPauseOpen] = useState(false);
  const [whatsAppHealth, setWhatsAppHealth] = useState<'HEALTHY' | 'ISSUE'>('HEALTHY');
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [isPaymentPaid, setIsPaymentPaid] = useState(false);
  const [detailSheet, setDetailSheet] = useState<string | null>(null);

  // Query 1: Role-aware mobile home-screen shortcut title & manifest without altering in-app logos
  useEffect(() => {
    const shortcutLabel =
      activeRole === 'FIELD_AGENT'
        ? 'WorkCraft Agent'
        : activeRole === 'SALON_OWNER'
        ? 'WorkCraft Salon'
        : 'WorkCraft';

    document.title = `${shortcutLabel} - Mobile Portal`;

    const appleTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (appleTitleMeta) {
      appleTitleMeta.setAttribute('content', shortcutLabel);
    }

    let createdObjectUrl: string | null = null;
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      if (activeRole === 'FOUNDER') {
        manifestLink.setAttribute('href', '/manifest.json');
      } else {
        const origin = window.location.origin;
        const dynamicManifest = {
          id: activeRole === 'FIELD_AGENT' ? '/?role=agent' : '/?role=salon_owner&paired=true',
          name: `${shortcutLabel} - Mobile Portal`,
          short_name: shortcutLabel,
          start_url: activeRole === 'FIELD_AGENT' ? '/?role=agent' : '/?role=salon_owner&paired=true',
          scope: '/',
          display: 'standalone',
          background_color: '#102019',
          theme_color: '#102019',
          icons: [
            { src: `${origin}/pwa-192x192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: `${origin}/pwa-512x512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: `${origin}/icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          ],
        };
        createdObjectUrl = URL.createObjectURL(
          new Blob([JSON.stringify(dynamicManifest)], { type: 'application/manifest+json' })
        );
        manifestLink.setAttribute('href', createdObjectUrl);
      }
    }

    return () => {
      if (createdObjectUrl) URL.revokeObjectURL(createdObjectUrl);
    };
  }, [activeRole]);

  const COUNTRY_PAUSE_LIST: { code: 'PK' | 'AE' | 'SA' | 'EU' | 'GLOBAL'; label: string; flag: string }[] = [
    { code: 'PK', label: 'Pakistan', flag: '🇵🇰' },
    { code: 'AE', label: 'UAE', flag: '🇦🇪' },
    { code: 'SA', label: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'EU', label: 'UK & Europe', flag: '🇬🇧' },
    { code: 'GLOBAL', label: 'Global', flag: '🌍' },
  ];

  const activePausedCountryList = COUNTRY_PAUSE_LIST.filter((c) => pausedCountries[c.code]);

  const toggleCountryPause = (code: 'PK' | 'AE' | 'SA' | 'EU' | 'GLOBAL') => {
    setPausedCountries((prev) => {
      const nextVal = !prev[code];
      const countryName = COUNTRY_PAUSE_LIST.find((c) => c.code === code)?.label || code;
      showToast(
        nextVal
          ? `⏸️ ${countryName} broadcasts paused. All other countries continue running normally.`
          : `▶️ ${countryName} broadcasts resumed cleanly.`
      );
      return { ...prev, [code]: nextVal };
    });
  };

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 5000);
  };

  const handleSalonCreated = (salon: { name: string; owner: string; phone: string; location: string; coords: string }) => {
    const token = `wc_sec_${salon.name.toLowerCase().replace(/\s+/g, '')}_${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveOnboarding({ token, salonName: salon.name });
    showToast(`📩 Automated WhatsApp invite dispatched to ${salon.owner} (${salon.name})`);
  };

  const handleCashCollected = (amount: number, salonName: string) => {
    setKamranCashHeld((prev) => prev + amount);
    showToast(`💵 PKR ${amount.toLocaleString()} Cash Held Logged with Biometric Seal · Receipts sent to agent & ${salonName}`);
  };

  const handlePairingComplete = (salonName: string) => {
    setActiveSalonCount((prev) => prev + 1);
    setIsSalonPwaModalOpen(false);
    setOnboardedSalonName(salonName);
    setHasCompletedSalonOnboarding(true);
    showToast(`🎉 ${salonName} Paired Successfully! Welcome to your Salon Owner Dashboard.`);
  };

  const handleInspectSalon = (salonName: string) => {
    setInspectSalonName(salonName);
    setActiveTab('Salon Owner Dashboard');
    setIsSidebarOpen(false);
  };

  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // Strict 3-Role Sidebar & Bottom Navigation Isolation (Query 1)
  const navItems: [TabName, React.FC<{ className?: string }>][] =
    activeRole === 'SALON_OWNER'
      ? [['Salon Owner Dashboard', Scissors]]
      : activeRole === 'FIELD_AGENT'
      ? [['Agent Hub / Onboarding', Smartphone]]
      : [
          ['Overview', House],
          ['Agent Hub / Onboarding', Smartphone],
          ['Salon Owner Dashboard', Scissors],
          ['Contact / Clients', UsersRound],
          ['Revenue', WalletCards],
          ['Voice', Mic],
          ['Settings', Settings2],
        ];

  const mobileNavItems: [TabName, React.FC<{ className?: string }>, string][] =
    activeRole === 'SALON_OWNER'
      ? [['Salon Owner Dashboard', Scissors, 'My Salon']]
      : activeRole === 'FIELD_AGENT'
      ? [['Agent Hub / Onboarding', Smartphone, 'Agent Hub']]
      : [
          ['Overview', House, 'Overview'],
          ['Agent Hub / Onboarding', Smartphone, 'Agent Hub'],
          ['Salon Owner Dashboard', Scissors, 'Salon Node'],
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

          {/* Plain-English System Line Status (Query 5: Green Healthy vs Red Issue) */}
          <div
            className={`mt-4 rounded-xl border p-3 text-[10px] font-mono space-y-1 transition ${
              whatsAppHealth === 'ISSUE'
                ? 'border-rose-500/50 bg-rose-950/35'
                : 'border-emerald-500/30 bg-emerald-950/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white/65">WHATSAPP LINE</span>
              <span
                className={`inline-flex items-center gap-1.5 font-bold ${
                  whatsAppHealth === 'ISSUE' ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                <span
                  className={`size-2 rounded-full ${
                    whatsAppHealth === 'ISSUE'
                      ? 'bg-rose-500 animate-ping'
                      : 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                  }`}
                />
                {whatsAppHealth === 'ISSUE' ? 'ISSUE' : 'HEALTHY'}
              </span>
            </div>
            <p className="text-white/85 font-bold truncate">
              {whatsAppHealth === 'ISSUE' ? 'Disconnected / Blocked' : 'Connected & Healthy'}
            </p>
            <p className="text-white/45 flex items-center gap-1">
              <Lock className="size-3 text-[#D9A441]" />
              Founder Number Hidden
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
                {activeRole === 'FOUNDER'
                  ? 'FOUNDER'
                  : activeRole === 'FIELD_AGENT'
                  ? 'FIELD AGENT'
                  : 'SALON PARTNER'}
              </p>
              <p className="mt-1 text-sm font-bold text-[#F5F2E9] tracking-wide">
                {activeRole === 'FOUNDER'
                  ? 'Farhan Abid'
                  : activeRole === 'FIELD_AGENT'
                  ? initialEnrollAgentData?.name || 'Authorized Agent'
                  : onboardedSalonName || 'Private Salon Portal'}
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
          {/* Top Bar Header with WORKCRAFT Watermark + DASHBOARD in #00FFFF */}
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
                {activeRole === 'FIELD_AGENT'
                  ? 'AGENT PORTAL'
                  : activeRole === 'SALON_OWNER'
                  ? hasCompletedSalonOnboarding
                    ? 'SALON PORTAL'
                    : 'SALON SIGNUP'
                  : 'DASHBOARD'}
              </span>
            </div>

            {/* Right Controls (Founder-only Bell, Global Pause & Country-by-Country Breakup; hidden from Agents & Salons) */}
            <div className="flex items-center justify-end gap-2 min-w-[36px] relative">
              {activeRole === 'FOUNDER' ? (
                <>
                  <button
                    onClick={() => setIsNotificationsOpen(true)}
                    className="relative rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white/70 hover:border-white/20 hover:text-white transition"
                    aria-label="Open notifications"
                  >
                    <Bell className="size-[17px]" />
                    <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#00FFFF] animate-ping" />
                  </button>

                  {/* Query 2: Global Pause + Country-by-Country Breakup Dropdown directly underneath */}
                  <div className="relative">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setIsGlobalPaused(!isGlobalPaused)}
                        className={`flex items-center gap-1.5 rounded-l-lg border border-white/10 bg-white/[0.04] px-2.5 sm:px-3 py-2 text-[10px] font-mono font-bold transition hover:border-white/20 ${
                          isGlobalPaused
                            ? 'border-amber-500/50 bg-amber-500/20 text-amber-300 animate-pulse'
                            : 'text-white/80'
                        }`}
                        aria-pressed={isGlobalPaused}
                      >
                        {isGlobalPaused ? (
                          <Play className="size-3 text-[#D9A441]" />
                        ) : (
                          <Pause className="size-3 text-[#D9A441]" />
                        )}
                        <span className="hidden sm:inline">
                          {isGlobalPaused ? 'Resume queue' : 'Global pause'}
                        </span>
                        <span className="sm:hidden">{isGlobalPaused ? 'Resume' : 'Pause'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsCountryPauseOpen(!isCountryPauseOpen)}
                        className={`flex items-center gap-1 rounded-r-lg border border-l-0 border-white/10 bg-white/[0.04] px-2 py-2 text-[10px] font-mono font-bold transition hover:border-white/20 ${
                          activePausedCountryList.length > 0
                            ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                            : 'text-white/70'
                        }`}
                        aria-expanded={isCountryPauseOpen}
                        title="Pause by Country Breakup"
                      >
                        <Globe className="size-3 text-[#00FFFF]" />
                        {activePausedCountryList.length > 0 && (
                          <span className="rounded bg-amber-400 text-[#12241C] px-1 text-[9px] font-black">
                            {activePausedCountryList.length}
                          </span>
                        )}
                        <ChevronDown className="size-3" />
                      </button>
                    </div>

                    {isCountryPauseOpen && (
                      <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/15 bg-[#102019] p-3 shadow-2xl z-50 space-y-2">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-[10px] font-mono font-bold uppercase text-[#00FFFF]">
                            Country-by-Country Pause
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsCountryPauseOpen(false)}
                            className="text-white/50 hover:text-white"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-white/60 font-sans leading-snug">
                          Pause a single market (e.g., UAE only) while all other countries keep running normally.
                        </p>
                        <div className="space-y-1.5 font-mono text-xs">
                          {COUNTRY_PAUSE_LIST.map((country) => {
                            const isCountryPaused = pausedCountries[country.code];
                            return (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => toggleCountryPause(country.code)}
                                className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                                  isCountryPaused
                                    ? 'border-amber-500/50 bg-amber-500/15 text-amber-200'
                                    : 'border-white/10 bg-black/35 text-white/80 hover:border-white/25'
                                }`}
                              >
                                <span className="flex items-center gap-2 font-bold text-[11px]">
                                  <span>{country.flag}</span>
                                  <span>{country.label}</span>
                                </span>
                                <span
                                  className={`rounded px-2 py-0.5 text-[9px] font-black uppercase ${
                                    isCountryPaused
                                      ? 'bg-amber-400 text-[#12241C]'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  }`}
                                >
                                  {isCountryPaused ? 'PAUSED' : 'LIVE'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/35 bg-emerald-950/30 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-300">
                  <ShieldCheck className="size-3.5" />
                  <span className="hidden sm:inline">Private Session</span>
                </span>
              )}
            </div>
          </header>

          {/* Body Content Container */}
          <div className="mx-auto max-w-[1440px] w-full p-4 sm:p-7 flex-1">
            {/* View Mode Header */}
            {/* View Mode Header & Status Bar */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                {/* QUERY 5: GREEN HEALTHY vs RED ISSUE WHATSAPP HEALTH BOX + QUERY 2 COUNTRY PAUSE PILLS */}
                <div className="flex flex-wrap items-center gap-2 mb-2 font-mono">
                  <div
                    className={`inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-mono font-bold transition shadow-sm ${
                      whatsAppHealth === 'ISSUE'
                        ? 'border-rose-500/70 bg-rose-950/55 text-rose-200'
                        : 'border-emerald-500/50 bg-emerald-950/45 text-emerald-300'
                    }`}
                  >
                    <span className="relative flex size-2.5 shrink-0">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                          whatsAppHealth === 'ISSUE' ? 'bg-rose-500' : 'bg-emerald-400'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full size-2.5 ${
                          whatsAppHealth === 'ISSUE'
                            ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                            : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                        }`}
                      />
                    </span>
                    <span>
                      {whatsAppHealth === 'ISSUE'
                        ? 'WhatsApp Line Issue: Disconnected / Blocked'
                        : 'WhatsApp Line: Connected & Healthy'}
                    </span>
                  </div>

                  {activeRole === 'FOUNDER' && (
                    <button
                      type="button"
                      onClick={() =>
                        setWhatsAppHealth((prev) => (prev === 'HEALTHY' ? 'ISSUE' : 'HEALTHY'))
                      }
                      className="rounded-lg border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1.5 text-[10px] text-white/75 transition"
                      title="Preview Green Healthy vs Red Issue alert state"
                    >
                      {whatsAppHealth === 'HEALTHY' ? 'Test Red Issue' : 'Restore Green Healthy'}
                    </button>
                  )}

                  {isGlobalPaused && (
                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-950/45 px-3 py-1.5 text-[11px] font-bold text-amber-300">
                      <Pause className="size-3" />
                      <span>All Countries Paused</span>
                    </div>
                  )}

                  {!isGlobalPaused && activePausedCountryList.length > 0 && (
                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/40 px-3 py-1.5 text-[11px] font-bold text-amber-200">
                      <span>
                        Paused: {activePausedCountryList.map((c) => `${c.flag} ${c.label}`).join(', ')} (Others Active)
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-[#F5F2E9]">
                  {activeTab === 'Agent Hub / Onboarding'
                    ? 'Field Agent Command Hub'
                    : activeTab === 'Salon Owner Dashboard'
                    ? activeRole === 'FOUNDER'
                      ? 'Salon Health & Package View'
                      : 'Salon Owner Dashboard'
                    : activeTab === 'Overview'
                    ? 'Founder Daily Overview'
                    : activeTab}
                </h2>
                <p className="mt-1 text-sm text-white/55 font-sans">
                  {activeTab === 'Agent Hub / Onboarding'
                    ? 'Manage field agents by country, track agent commissions, and repair salon connections.'
                    : activeTab === 'Salon Owner Dashboard'
                    ? activeRole === 'FOUNDER'
                      ? 'Read-only view of each salon package, 5th-of-month payment status, and onboarding language.'
                      : 'Live queue, hands-free voice alerts, rate editor, upgrades, video deals, and window poster PDF.'
                    : activeTab === 'Voice'
                    ? 'Listen to salon owner voice messages and reply automatically in their language.'
                    : activeTab === 'Settings'
                    ? 'All system protections run automatically and report directly to your Founder WhatsApp number.'
                    : 'Your daily business snapshot: online salons, pending dues, agent cash, and unread voice messages.'}
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

            {/* Dynamic Unified Content Wrapped in Silent Auto-Recovery Error Boundaries */}
            {activeTab === 'Agent Hub / Onboarding' ? (
              <SilentSelfHealingBoundary
                areaName="Field Agent Hub"
                onSilentRecovered={(d) => showToast(`🛡️ Auto-recovered ${d.areaName} seamlessly`)}
              >
                <FieldAgentHub
                  onSalonCreated={handleSalonCreated}
                  onCashCollected={handleCashCollected}
                  onOpenSalonPwa={(token, salon) => {
                    setActiveOnboarding({ token, salonName: salon });
                    setIsSalonPwaModalOpen(true);
                  }}
                  kamranCashHeld={kamranCashHeld}
                  onClose={activeRole === 'FOUNDER' ? () => handleTabChange('Overview') : undefined}
                  initialAutoOpenEnrollment={!!initialEnrollAgentData}
                  initialEnrollAgentData={initialEnrollAgentData || undefined}
                  userRole={activeRole === 'FIELD_AGENT' ? 'FIELD_AGENT' : 'FOUNDER'}
                />
              </SilentSelfHealingBoundary>
            ) : activeTab === 'Salon Owner Dashboard' ? (
              <SilentSelfHealingBoundary
                areaName="Salon Portal"
                onSilentRecovered={(d) => showToast(`🛡️ Auto-recovered ${d.areaName} seamlessly`)}
              >
                {activeRole === 'SALON_OWNER' && !hasCompletedSalonOnboarding ? (
                  <div className="max-w-4xl mx-auto space-y-4">
                    <div className="rounded-2xl border border-[#00FFFF]/35 bg-[#00FFFF]/[0.06] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-[#00FFFF] block">
                          WELCOME TO WORKCRAFT LOCAL · STEP-BY-STEP SIGNUP
                        </span>
                        <p className="text-xs text-white/80 font-sans mt-0.5">
                          Complete the 4 quick onboarding steps below (language, services &amp; rates, payment, and WhatsApp link) to unlock your private Salon Owner Dashboard &amp; printable PDF window poster.
                        </p>
                      </div>
                      <span className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-300 shrink-0">
                        4-Step Onboarding First
                      </span>
                    </div>
                    <SalonPwaSimulator
                      salonName={onboardedSalonName || activeOnboarding?.salonName || 'My Beauty & Grooming Salon'}
                      token={activeOnboarding?.token || 'wc_social_signup'}
                      onPairingComplete={handlePairingComplete}
                    />
                  </div>
                ) : (
                  <SalonOwnerDashboard
                    selectedSalonName={onboardedSalonName || inspectSalonName}
                    isFounderInspector={activeRole === 'FOUNDER'}
                    onClose={activeRole === 'FOUNDER' ? () => handleTabChange('Overview') : undefined}
                  />
                )}
              </SilentSelfHealingBoundary>
            ) : (
              <SilentSelfHealingBoundary
                areaName="Founder Workspace"
                onSilentRecovered={(d) => showToast(`🛡️ Auto-recovered ${d.areaName} cleanly`)}
              >
                {activeTab === 'Voice' ? (
                  <VoiceSection />
                ) : activeTab === 'Overview' ? (
                  <OverviewSection
                    payment={isPaymentPaid}
                    setPayment={setIsPaymentPaid}
                    go={handleTabChange}
                    setDetailSheet={setDetailSheet}
                    onOpenVoiceTicker={() => setIsVoiceDrawerOpen(true)}
                    onInspectSalon={handleInspectSalon}
                    activeSalonCount={activeSalonCount}
                    kamranCashHeld={kamranCashHeld}
                    onOpenSalonPwa={() => setIsSalonPwaModalOpen(true)}
                    onSwitchToAgent={() => handleTabChange('Agent Hub / Onboarding')}
                    onOpenPairing={() => setIsPairingModalOpen(true)}
                  />
                ) : (
                  <TabsSection
                    active={activeTab}
                    go={handleTabChange}
                    setPaymentRouting={setPaymentRoutingMethod}
                    onInspectSalon={handleInspectSalon}
                  />
                )}
              </SilentSelfHealingBoundary>
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

      {/* Global / Country Broadcast Pause Alert */}
      {(isGlobalPaused || activePausedCountryList.length > 0) && (
        <div className="fixed inset-x-4 bottom-20 z-50 rounded-xl border border-amber-500/40 bg-amber-500/20 p-3 text-xs font-mono font-bold text-amber-200 shadow-xl backdrop-blur-md lg:bottom-4 lg:left-auto lg:right-4 lg:w-80">
          {isGlobalPaused
            ? '⚠️ Global pause is active. New broadcasts across all countries are safely held.'
            : `⚠️ Paused for ${activePausedCountryList.map((c) => `${c.flag} ${c.label}`).join(', ')}. Remaining countries continue running normally.`}
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
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Modals */}
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
                Central SIM Protection Active · Instant Connection
              </p>
            </div>

            <button
              onClick={() => {
                setIsPairingModalOpen(false);
                showToast('🎉 WhatsApp device linked cleanly! Messages and reminders are protected.');
              }}
              className="w-full rounded-xl bg-[#00FFFF] hover:bg-[#38e8e8] py-2.5 text-xs font-mono font-bold uppercase text-[#12241C] transition active:scale-95 shadow-md"
            >
              Confirm Device Link ✓
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
