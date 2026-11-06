import React, { useState } from 'react';
import {
  Smartphone,
  Scissors,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Star,
  MessageSquare,
  Settings,
  Plus,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
  QrCode,
  DollarSign,
  User,
  Phone,
  Check,
  Send,
  Lock,
  ArrowUpRight,
} from 'lucide-react';
import { PortalCard } from './PortalCard';

interface BookingRecord {
  id: string;
  clientName: string;
  phone: string;
  service: string;
  price: number;
  timeSlot: string;
  status: 'CONFIRMED' | 'IN_CHAIR' | 'COMPLETED';
}

export interface ClientSalon {
  id: string;
  name: string;
  owner: string;
  phone: string;
  location: string;
  plan: string;
  maint: number;
}

export const CLIENT_SALONS: ClientSalon[] = [
  { id: '1', name: 'Seven Cuts Studio', owner: 'Zubair Khan', phone: '+92 321 8472910', location: 'DHA Phase 5, Lahore', plan: 'Growth Automation', maint: 2000 },
  { id: '2', name: 'Royal Fade Lounge', owner: 'Tariq Butt', phone: '+92 300 9876543', location: 'Gulberg III, Lahore', plan: 'Growth Automation', maint: 2000 },
  { id: '3', name: 'Noor Beauty Lounge', owner: 'Noor Fatima', phone: '+92 333 4567890', location: 'Clifton Block 4, Karachi', plan: 'Starter Setup', maint: 1500 },
  { id: '4', name: 'The Groom Room', owner: 'Hamza Malik', phone: '+92 301 2345678', location: 'F-6 Markaz, Islamabad', plan: 'VIP Executive', maint: 2500 },
];

interface SalonOwnerDashboardProps {
  salonName?: string;
  ownerName?: string;
  phone?: string;
  onOpenSimulator?: () => void;
  onClose?: () => void;
}

export const SalonOwnerDashboard: React.FC<SalonOwnerDashboardProps> = ({
  salonName: initialSalonName = 'Seven Cuts Studio',
  ownerName: initialOwnerName = 'Zubair Khan',
  phone: initialPhone = '+92 321 8472910',
  onOpenSimulator,
  onClose,
}) => {
  const [selectedSalonId, setSelectedSalonId] = useState<string>('1');
  const currentSalon = CLIENT_SALONS.find((s) => s.id === selectedSalonId) || CLIENT_SALONS[0];

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'BOT_CHAT' | 'MENU' | 'MAINTENANCE' | 'REVIEWS'>('QUEUE');
  const [isPwaPromptOpen, setIsPwaPromptOpen] = useState(false);
  const [isPwaInstalled, setIsPwaInstalled] = useState(true);

  // 10% Maintenance Digital Self-Pay & Overdue Masking State (Layer 1 Phone-Bound)
  const [isMaintenanceOverdue, setIsMaintenanceOverdue] = useState(false);
  const [isMaintPaid, setIsMaintPaid] = useState(false);
  const [maintTid, setMaintTid] = useState<string | null>(null);
  const [isPayingMaint, setIsPayingMaint] = useState(false);
  const [maintPaidDate, setMaintPaidDate] = useState<string | null>(null);
  const [maintToast, setMaintToast] = useState<string | null>(null);

  const handleAutoClearMaintenance = () => {
    setIsPayingMaint(true);
    setTimeout(() => {
      const tid = `EP-${Math.floor(10000000000 + Math.random() * 90000000000)}`;
      setIsPayingMaint(false);
      setIsMaintPaid(true);
      setIsMaintenanceOverdue(false);
      setMaintTid(tid);
      setMaintPaidDate(new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
      setMaintToast(`🎉 Gateway Auto-Match Success: Payment of PKR ${currentSalon.maint.toLocaleString()} detected from registered phone (${currentSalon.phone}). Full metrics unmasked & Tier-1 Priority restored!`);
      setTimeout(() => setMaintToast(null), 6000);
    }, 700);
  };

  // Live Queue State
  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      id: 'BK-101',
      clientName: 'Bilal Ahmed',
      phone: '+92 300 1234567',
      service: 'Master Haircut & Skin Fade',
      price: 1200,
      timeSlot: '03:30 PM',
      status: 'CONFIRMED',
    },
    {
      id: 'BK-102',
      clientName: 'Hamza Malik',
      phone: '+92 321 9876543',
      service: 'Royal Beard Sculpt & Ozone Steam',
      price: 800,
      timeSlot: '04:15 PM',
      status: 'IN_CHAIR',
    },
    {
      id: 'BK-103',
      clientName: 'Dr. Usman Qureshi',
      phone: '+92 333 4567890',
      service: 'Charcoal Deep Detox Facial',
      price: 2500,
      timeSlot: '05:00 PM',
      status: 'CONFIRMED',
    },
    {
      id: 'BK-104',
      clientName: 'Saad Farooq',
      phone: '+92 345 6789012',
      service: 'Haircut + Beard Styling Combo',
      price: 1800,
      timeSlot: '05:45 PM',
      status: 'COMPLETED',
    },
  ]);

  // Rate Card State
  const [services, setServices] = useState([
    { id: 's1', name: 'Master Haircut & Skin Fade', price: 1200, active: true },
    { id: 's2', name: 'Royal Beard Sculpt & Ozone Steam', price: 800, active: true },
    { id: 's3', name: 'Charcoal Deep Detox Facial', price: 2500, active: true },
    { id: 's4', name: 'Keratin Hair Protein Treatment', price: 6000, active: true },
    { id: 's5', name: 'Head Massage with Herbal Mint Oil', price: 600, active: false },
  ]);

  // Custom Service Add state
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customServiceName, setCustomServiceName] = useState('');
  const [customServicePrice, setCustomServicePrice] = useState('1500');

  // WhatsApp Chat Simulator State
  const [simChatMessages, setSimChatMessages] = useState([
    { sender: 'CLIENT', text: 'Assalamu Alaikum bhai, aaj 3:30 PM slot khali hai?', time: '03:14 PM' },
    {
      sender: 'BOT',
      text: `Walaikum Assalam! ${currentSalon.name} mein khush aamdeed. 3:30 PM bilkul khali hai. Kon si service leni hai aap ne?`,
      time: '03:14 PM',
    },
    { sender: 'CLIENT', text: 'Skin fade haircut aur beard trim.', time: '03:15 PM' },
    {
      sender: 'BOT',
      text: `MashaAllah! Master Haircut (PKR 1,200) + Beard Sculpt (PKR 800) = Total PKR 2,000. Aap ka slot 3:30 PM par confirm kar diya gaya hai. Hamara address: ${currentSalon.location}.`,
      time: '03:15 PM',
    },
  ]);
  const [customQuery, setCustomQuery] = useState('');

  const handleSendSimQuery = (textToSend?: string) => {
    const text = (textToSend || customQuery).trim();
    if (!text) return;
    setSimChatMessages((prev) => [
      ...prev,
      { sender: 'CLIENT', text, time: 'Just now' },
    ]);
    if (!textToSend) setCustomQuery('');

    setTimeout(() => {
      let botResponse = `Walaikum Assalam! ${currentSalon.name} bot haazir hai. Aap ka appointment fori hold kar liya gaya hai.`;
      const lower = text.toLowerCase();
      if (lower.includes('rate') || lower.includes('price') || lower.includes('list')) {
        botResponse = `Hamari rates: Master Haircut PKR 1,200 · Beard Sculpt PKR 800 · Detox Facial PKR 2,500 · Keratin PKR 6,000. Aap kis time tashreef layenge?`;
      } else if (lower.includes('time') || lower.includes('timing') || lower.includes('kal') || lower.includes('aaj')) {
        botResponse = `${currentSalon.name} rozana subah 11:00 AM se raat 11:00 PM tak khula hai. Aaj sham 4:30 PM aur 6:00 PM par slot khali hai. Kya book karoon?`;
      } else if (lower.includes('shav') || lower.includes('groom') || lower.includes('facial')) {
        botResponse = `Groom VIP Combo (Haircut + Beard + Deep Detox Facial + Mint Head Massage) faqat PKR 4,500 mein dastiyab hai. Google 5-Star rated service!`;
      }
      setSimChatMessages((prev) => [
        ...prev,
        { sender: 'BOT', text: botResponse, time: 'Just now' },
      ]);
    }, 500);
  };

  const handleToggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: newPrice } : s))
    );
  };

  const handleUpdateStatus = (id: string, status: 'CONFIRMED' | 'IN_CHAIR' | 'COMPLETED') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 0. FOUNDER ADMINISTRATIVE PREVIEW BANNER (Clean Isolation - Zero Main Role Switcher) */}
      {onClose && (
        <div className="rounded-2xl border border-[#D9A441]/40 bg-[#D9A441]/10 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs shadow-md">
          <div className="flex items-center gap-2 text-[#D9A441] font-bold">
            <ShieldCheck className="size-4 shrink-0 text-[#D9A441]" />
            <span>👑 Founder Preview Console · Inspecting Client Salon Workspace</span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-white/60 text-[11px]">Inspect Client:</span>
              <select
                value={selectedSalonId}
                onChange={(e) => setSelectedSalonId(e.target.value)}
                className="rounded-xl border border-white/20 bg-black/70 px-3 py-1.5 text-xs text-[#00FFFF] font-bold focus:outline-none focus:border-[#00FFFF]"
              >
                {CLIENT_SALONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.location})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
            >
              <span>Back to Overview</span>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER: SALON BRAND IDENTITY & WHATSAPP GATEWAY HEALTH             */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-white/10 bg-[#102019] p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00FFFF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10B981]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[.22em] text-[#00FFFF]">
                SALON OWNER PWA DASHBOARD · AUTONOMOUS CONCIERGE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              {currentSalon.name}
            </h1>
            <p className="text-xs text-white/60 font-sans mt-0.5">
              Owner: <strong className="text-white/85">{currentSalon.owner}</strong> · Phone:{' '}
              <span className="font-mono text-[#D9A441]">{currentSalon.phone}</span> · {currentSalon.location}
            </p>
          </div>

          {/* Quick Actions (PWA Home Screen + SLA Status + Overdue Simulator) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
            {/* Simulation Toggle for Testing Phase */}
            <button
              type="button"
              onClick={() => {
                setIsMaintenanceOverdue(!isMaintenanceOverdue);
                if (!isMaintenanceOverdue) setIsMaintPaid(false);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                isMaintenanceOverdue
                  ? 'border-amber-500 bg-amber-950/40 text-amber-300 ring-1 ring-amber-500'
                  : 'border-white/20 bg-white/[0.04] text-white/70 hover:text-white'
              }`}
              title="Toggle to test overdue masked metrics mode vs normal live mode"
            >
              <span>{isMaintenanceOverdue ? '⚠️ Overdue Mode: Active' : '🧪 Test Overdue Mode'}</span>
            </button>

            {/* 1-Tap Home Screen Badge */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 text-xs font-mono font-bold text-emerald-300">
              <Smartphone className="size-4 text-emerald-400" />
              <span>PWA Shortcut Active</span>
            </div>

            {/* SLA 10% Maintenance Status */}
            <div className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-mono font-bold ${
              isMaintenanceOverdue
                ? 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                : 'border-[#D9A441]/40 bg-[#D9A441]/10 text-[#D9A441]'
            }`}>
              <ShieldCheck className="size-4 text-[#D9A441]" />
              <span>{isMaintenanceOverdue ? 'Grace Mode (Tier-2)' : '10% SLA Active'}</span>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-1.5 text-white/60 hover:text-white transition"
                title="Close Portal"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Real-Time SIM Gateway Status Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-white/50 block">WHATSAPP TERMINAL</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
              Connected · 24/7 Live
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-white/50 block">MONTHLY 10% SLA</span>
            <span className={`font-bold mt-0.5 block ${isMaintenanceOverdue ? 'text-amber-400' : 'text-[#D9A441]'}`}>
              PKR {currentSalon.maint.toLocaleString()} / mo ({isMaintenanceOverdue ? '⚠️ Overdue (Due Date Passed)' : isMaintPaid ? 'Paid ✓' : 'Due in 26d'})
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-white/50 block">AUTO-REPLY LATENCY</span>
            <span className={`font-bold mt-0.5 block ${isMaintenanceOverdue ? 'text-amber-300 text-[11px]' : 'text-[#00FFFF]'}`}>
              {isMaintenanceOverdue ? 'Tier-2 Standard (3-5s) · Grace Active' : 'Tier-1 Instant (< 2.4 sec)'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-white/50 block">PHONE BINDING (LAYER 1)</span>
            <span className="text-[#00FFFF] font-bold mt-0.5 block truncate" title={currentSalon.phone}>
              Bound: {currentSalon.phone}
            </span>
          </div>
        </div>

        {/* Toast Notification */}
        {maintToast && (
          <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs font-mono text-emerald-200 animate-in fade-in flex items-center justify-between gap-3 shadow-lg">
            <span>{maintToast}</span>
            <button onClick={() => setMaintToast(null)} className="text-white/60 hover:text-white font-bold">✕</button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. HARMONIZED METRIC CARDS WITH LAYER 1 PHONE-BOUND MASKING OVERLAY       */}
      {/* ========================================================================= */}
      <div className="relative">
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 transition-all duration-300 ${
          isMaintenanceOverdue ? 'filter blur-sm opacity-30 select-none pointer-events-none' : ''
        }`}>
          {/* Metric 1: Live Bookings (Emerald) */}
          <div className="rounded-2xl border border-[#10B981]/40 bg-[#102019] p-4 space-y-1 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10B981]">
                TODAY'S APPOINTMENTS
              </span>
              <Calendar className="size-4 text-[#10B981]" />
            </div>
            <p className="text-2xl font-black text-white font-mono">{bookings.length}</p>
            <p className="text-[11px] text-white/55 font-sans">
              Auto-confirmed via WhatsApp · 0 calls needed
            </p>
          </div>

          {/* Metric 2: 10% Maintenance (Amber) */}
          <div className="rounded-2xl border border-[#F59E0B]/40 bg-[#102019] p-4 space-y-1 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F59E0B]">
                10% MONTHLY SLA
              </span>
              <ShieldCheck className="size-4 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-black text-[#D9A441] font-mono">PKR {currentSalon.maint.toLocaleString()}</p>
            <p className="text-[11px] text-white/55 font-sans">
              {isMaintPaid ? 'Paid & Active for 30d ✓' : 'Due every 30 days · Zero agent cash'}
            </p>
          </div>

          {/* Metric 3: WhatsApp Bot Messages (Cyan) */}
          <div className="rounded-2xl border border-[#00FFFF]/40 bg-[#102019] p-4 space-y-1 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00FFFF]">
                AUTONOMOUS REPLIES
              </span>
              <MessageSquare className="size-4 text-[#00FFFF]" />
            </div>
            <p className="text-2xl font-black text-[#00FFFF] font-mono">89</p>
            <p className="text-[11px] text-white/55 font-sans">
              Customer inquiries answered in Urdu &amp; English
            </p>
          </div>

          {/* Metric 4: Google 5-Star Reviews (Gold) */}
          <div className="rounded-2xl border border-[#D9A441]/40 bg-[#102019] p-4 space-y-1 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9A441]">
                GOOGLE REVIEWS
              </span>
              <Star className="size-4 text-[#D9A441] fill-[#D9A441]" />
            </div>
            <p className="text-2xl font-black text-[#D9A441] font-mono">4.9 ★</p>
            <p className="text-[11px] text-white/55 font-sans">
              +31 Positive reviews boosted automatically
            </p>
          </div>
        </div>

        {/* Graceful Layer 1 Masking Overlay for Defaulting Salons */}
        {isMaintenanceOverdue && (
          <div className="absolute inset-0 z-20 rounded-3xl border border-amber-500/50 bg-black/85 backdrop-blur-md p-5 flex flex-col items-center justify-center text-center space-y-3.5 shadow-2xl animate-in fade-in">
            <div className="size-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 grid place-items-center text-amber-400">
              <Lock className="size-6" />
            </div>
            <div className="max-w-xl space-y-1">
              <h3 className="text-base font-black text-white">
                Live Metrics Temporarily Masked · 10% Maintenance Due
              </h3>
              <p className="text-xs text-white/75 font-sans leading-relaxed">
                Your WhatsApp Concierge is active and booking clients on <strong>Tier-2 Grace Queue</strong>. Send <strong>PKR {currentSalon.maint.toLocaleString()}</strong> from your registered salon SIM (<span className="text-[#00FFFF] font-mono font-bold">{currentSalon.phone}</span>) to instantly unmask full live metrics.
              </p>
              <p className="text-[11px] text-amber-300/85 font-sans">
                آسانی کیلئے: آپ کو کچھ ٹائپ کرنے کی ضرورت نہیں۔ رقم اسی رجسٹرڈ نمبر سے بھیجیں، سسٹم خودبخود لائیو کر دے گا۔
              </p>
            </div>
            <button
              type="button"
              disabled={isPayingMaint}
              onClick={handleAutoClearMaintenance}
              className="rounded-xl bg-gradient-to-r from-[#D9A441] to-amber-400 hover:from-[#e0b252] hover:to-amber-300 text-[#12241C] px-5 py-2.5 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-lg flex items-center gap-2"
            >
              {isPayingMaint ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  <span>Simulating SIM Gateway Webhook Match...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4 text-[#12241C]" />
                  <span>⚡ Simulate Gateway Auto-Match from {currentSalon.phone} (Pay PKR {currentSalon.maint.toLocaleString()}) →</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE SECTION TABS                                               */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 overflow-x-auto">
        {[
          { id: 'QUEUE' as const, label: "Today's Live Queue", icon: Calendar, badge: bookings.length },
          { id: 'BOT_CHAT' as const, label: '24/7 Bot Simulator', icon: MessageSquare, badge: 'Live' },
          { id: 'MENU' as const, label: 'Service Rates & Menu', icon: Scissors, badge: `${services.length} items` },
          { id: 'MAINTENANCE' as const, label: '10% Maintenance SLA', icon: ShieldCheck, badge: 'Due 26d' },
          { id: 'REVIEWS' as const, label: 'Google Review Booster', icon: Star, badge: '4.9 ★' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition shrink-0 ${
                isActive
                  ? 'bg-white/[0.08] text-[#00FFFF] border border-[#00FFFF]/40 shadow-[0_0_15px_rgba(0,255,255,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[9px] text-white/70">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. TAB 1: TODAY'S LIVE BOOKING QUEUE                                      */}
      {/* ========================================================================= */}
      {activeTab === 'QUEUE' && (
        <PortalCard title="Today's Live Client Queue" kicker="AUTONOMOUS WHATSAPP BOOKINGS">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-sans text-white/60">
              <p>
                Clients who scheduled appointments via your salon WhatsApp number. Automatically held in the cloud.
              </p>
              <button
                type="button"
                onClick={() => {
                  const newClient: BookingRecord = {
                    id: `BK-${Date.now().toString().slice(-3)}`,
                    clientName: 'Tariq Mehmood (Walk-in)',
                    phone: '+92 301 5556677',
                    service: 'Master Haircut & Beard Sculpt',
                    price: 2000,
                    timeSlot: '06:15 PM',
                    status: 'CONFIRMED',
                  };
                  setBookings((prev) => [...prev, newClient]);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] px-3 py-1.5 text-xs font-mono font-bold uppercase transition shrink-0"
              >
                <Plus className="size-3.5" />
                <span>Add Walk-In</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="grid size-10 place-items-center rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs font-bold text-[#D9A441] shrink-0">
                      {booking.timeSlot.split(' ')[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{booking.clientName}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold ${
                            booking.status === 'CONFIRMED'
                              ? 'bg-cyan-950/60 text-[#00FFFF] border border-cyan-500/30'
                              : booking.status === 'IN_CHAIR'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30 animate-pulse'
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 font-sans mt-0.5">{booking.service}</p>
                      <p className="text-[11px] font-mono text-white/45 mt-0.5">
                        Client Phone: {booking.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-sm font-mono font-bold text-[#D9A441] mr-2">
                      PKR {booking.price.toLocaleString()}
                    </span>

                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'IN_CHAIR')}
                        className="rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 text-[10px] font-mono font-bold text-amber-300 transition"
                      >
                        Seat in Chair →
                      </button>
                    )}

                    {booking.status === 'IN_CHAIR' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                        className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 text-[10px] font-mono font-bold text-emerald-300 transition"
                      >
                        Mark Done ✓
                      </button>
                    )}

                    <a
                      href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-white/60 hover:text-[#00FFFF] transition"
                      title="Open Client WhatsApp"
                    >
                      <MessageSquare className="size-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PortalCard>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 2: 24/7 BOT SIMULATOR & TEST CHAT                                  */}
      {/* ========================================================================= */}
      {activeTab === 'BOT_CHAT' && (
        <PortalCard title="24/7 WhatsApp AI Concierge Preview" kicker="REAL-TIME AUTO-REPLY">
          <div className="space-y-4">
            <p className="text-xs text-white/60 font-sans leading-relaxed">
              This preview shows exactly how WORKCRAFT answers your customers in Roman Urdu, Urdu, and English 24/7 without you having to touch your phone.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3 max-h-[380px] overflow-y-auto">
              {simChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'CLIENT' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'CLIENT'
                        ? 'bg-white/[0.06] border border-white/10 text-white'
                        : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[9px] font-mono opacity-60 mb-1">
                      <span>{msg.sender === 'CLIENT' ? 'Customer' : 'WORKCRAFT Concierge Bot'}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 1-Tap Test Prompt Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <span className="text-white/50 text-[10px] uppercase block w-full sm:w-auto">1-Tap Prompts:</span>
              {[
                'Assalamu Alaikum, rate list dikhayein',
                'Haircut aur facial ka timing?',
                'Groom VIP combo package details?',
                'Kal sham 5 PM appointment free hai?',
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSendSimQuery(prompt)}
                  className="rounded-lg border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#00FFFF] px-2.5 py-1 text-[11px] text-white/80 transition text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>

            {/* Test Input Box */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendSimQuery(); }} className="flex items-center gap-2">
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Type customer query: e.g. 'Bhai haircut ka rate kya hai?' or 'Kal 2 baje time?'"
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#00FFFF]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#00FFFF] hover:bg-[#38e8e8] text-[#12241C] px-4 py-2.5 text-xs font-mono font-bold uppercase transition flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="size-3.5" />
              </button>
            </form>
          </div>
        </PortalCard>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 3: SERVICE RATES & MENU EDITOR                                     */}
      {/* ========================================================================= */}
      {activeTab === 'MENU' && (
        <PortalCard title="Service Rates & WhatsApp Menu" kicker="SYNCED TO WHATSAPP BOT">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans text-white/60">
              <p>
                When you change any price or toggle a service here, your WhatsApp bot instantly updates its responses to customers.
              </p>
              <button
                type="button"
                onClick={() => setIsAddingCustom(!isAddingCustom)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] px-3.5 py-1.5 text-xs font-mono font-bold uppercase transition shrink-0"
              >
                <Plus className="size-3.5" />
                <span>{isAddingCustom ? 'Close' : 'Add Custom Service'}</span>
              </button>
            </div>

            {/* Custom Service Input Form */}
            {isAddingCustom && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!customServiceName.trim()) return;
                  const newSvc = {
                    id: `custom_${Date.now()}`,
                    name: customServiceName.trim(),
                    price: parseInt(customServicePrice, 10) || 1000,
                    active: true,
                  };
                  setServices((prev) => [...prev, newSvc]);
                  setCustomServiceName('');
                  setCustomServicePrice('1500');
                  setIsAddingCustom(false);
                }}
                className="p-3.5 rounded-2xl border border-[#D9A441]/40 bg-black/50 space-y-3 animate-in fade-in"
              >
                <span className="text-[10px] font-mono font-bold uppercase text-[#D9A441] block">
                  Add New Salon Service (Instant Bot Sync):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Service Name (e.g. Groom Signature Beard Oil Treatment)"
                      value={customServiceName}
                      onChange={(e) => setCustomServiceName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D9A441]"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      required
                      placeholder="Price in PKR"
                      value={customServicePrice}
                      onChange={(e) => setCustomServicePrice(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-mono font-bold text-[#D9A441] focus:outline-none focus:border-[#D9A441]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#D9A441] text-[#12241C] text-xs font-mono font-bold uppercase hover:bg-[#e0b252]"
                  >
                    Save &amp; Sync to Bot ✓
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {services.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-3.5 flex items-center justify-between gap-3 transition ${
                    item.active
                      ? 'border-white/15 bg-white/[0.03]'
                      : 'border-white/5 bg-black/40 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={() => handleToggleService(item.id)}
                      className="size-4 rounded border-white/20 bg-black/40 text-[#00FFFF] focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <p className="text-[10px] font-mono text-white/45">
                        {item.active ? 'Available in WhatsApp Bot' : 'Disabled / Hidden'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/60">PKR</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleUpdatePrice(item.id, parseInt(e.target.value, 10) || 0)}
                      className="w-24 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 text-xs font-mono font-bold text-[#D9A441] focus:outline-none focus:border-[#00FFFF]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono text-white/45 text-center pt-2">
              All menu modifications are pushed to the Central SIM Gateway in &lt; 1.2 seconds.
            </p>
          </div>
        </PortalCard>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB 4: 10% MONTHLY MAINTENANCE SLA PORTAL                              */}
      {/* ========================================================================= */}
      {activeTab === 'MAINTENANCE' && (
        <PortalCard title="10% Monthly Maintenance SLA Tracker" kicker="NO CASH COLLECTED BY AGENTS">
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono font-bold text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-400" />
                  <span>{currentSalon.plan} · 10% SLA Active</span>
                </span>
                <span className="text-base font-mono font-bold text-[#D9A441]">
                  PKR {currentSalon.maint.toLocaleString()} / month
                </span>
              </div>
              <p className="text-xs text-white/70 font-sans leading-relaxed">
                Your monthly maintenance fee is strictly 10% of your initial package setup fee (PKR 20,000 package ➔ PKR 2,000/mo). Field agents are never authorized to collect physical cash for monthly maintenance.
              </p>
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-white/60">
                <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-white/40 block text-[9px]">BILLING CYCLE</span>
                  <span className={isMaintPaid ? 'text-emerald-400 font-bold' : ''}>
                    {isMaintPaid ? 'Paid & Active ✓' : 'Active · Next due in 26d'}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-white/40 block text-[9px]">UPTIME GUARANTEE</span>
                  <span className="text-emerald-400">99.98% 24/7 SLA</span>
                </div>
                <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-white/40 block text-[9px]">DISASTER RECOVERY</span>
                  <span className="text-[#00FFFF]">&lt; 60 min response</span>
                </div>
              </div>
            </div>

            {/* Direct Digital Self-Pay Box */}
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase block">
                  Digital Self-Pay Channel (Instant Automated Receipt):
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ZERO AGENT CASH
                </span>
              </div>

              {isMaintPaid ? (
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 space-y-2 animate-in zoom-in-95">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-emerald-400" />
                      <span>10% Monthly Maintenance Cleared via Webhook!</span>
                    </span>
                    <span className="text-[#00FFFF] font-bold">TID: {maintTid}</span>
                  </div>
                  <p className="text-xs text-white/75 font-sans leading-relaxed">
                    Settlement verified by WORKCRAFT Central Bank Gateway on {maintPaidDate}. Digital receipt pushed to salon owner's WhatsApp. Uptime SLA renewed for 30 days.
                  </p>
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsMaintPaid(false)}
                      className="text-[10px] font-mono text-white/50 hover:text-white underline"
                    >
                      Reset simulation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-white/60 font-sans">
                    Tap any verified digital channel below to simulate direct salon owner payment:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      disabled={isPayingMaint}
                      onClick={() => {
                        setIsPayingMaint(true);
                        setTimeout(() => {
                          setIsPayingMaint(false);
                          setIsMaintPaid(true);
                          setMaintTid('EP-' + Math.floor(1000000000 + Math.random() * 9000000000));
                          setMaintPaidDate(new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
                        }, 800);
                      }}
                      className="p-3 rounded-xl border border-emerald-500/30 bg-white/[0.03] hover:bg-emerald-950/30 hover:border-emerald-500 text-left transition group active:scale-95"
                    >
                      <p className="font-bold text-emerald-300 group-hover:text-emerald-200">EasyPaisa Till</p>
                      <p className="text-[10px] text-white/50 mt-0.5">WORKCRAFT · 789210</p>
                      <span className="text-[9px] text-emerald-400 font-bold block mt-1">Tap to Pay PKR {currentSalon.maint.toLocaleString()} →</span>
                    </button>
                    <button
                      type="button"
                      disabled={isPayingMaint}
                      onClick={() => {
                        setIsPayingMaint(true);
                        setTimeout(() => {
                          setIsPayingMaint(false);
                          setIsMaintPaid(true);
                          setMaintTid('JC-' + Math.floor(1000000000 + Math.random() * 9000000000));
                          setMaintPaidDate(new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
                        }, 800);
                      }}
                      className="p-3 rounded-xl border border-amber-500/30 bg-white/[0.03] hover:bg-amber-950/30 hover:border-amber-500 text-left transition group active:scale-95"
                    >
                      <p className="font-bold text-[#D9A441] group-hover:text-amber-200">JazzCash Merchant</p>
                      <p className="text-[10px] text-white/50 mt-0.5">WORKCRAFT · 0300-WORKCRAFT</p>
                      <span className="text-[9px] text-[#D9A441] font-bold block mt-1">Tap to Pay PKR {currentSalon.maint.toLocaleString()} →</span>
                    </button>
                    <button
                      type="button"
                      disabled={isPayingMaint}
                      onClick={() => {
                        setIsPayingMaint(true);
                        setTimeout(() => {
                          setIsPayingMaint(false);
                          setIsMaintPaid(true);
                          setMaintTid('RRN-' + Math.floor(100000 + Math.random() * 900000));
                          setMaintPaidDate(new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
                        }, 800);
                      }}
                      className="p-3 rounded-xl border border-cyan-500/30 bg-white/[0.03] hover:bg-cyan-950/30 hover:border-[#00FFFF] text-left transition group active:scale-95"
                    >
                      <p className="font-bold text-[#00FFFF] group-hover:text-cyan-200">Meezan Bank IBFT</p>
                      <p className="text-[10px] text-white/50 mt-0.5">PK64MEZN0001020304050607</p>
                      <span className="text-[9px] text-[#00FFFF] font-bold block mt-1">Tap to Pay PKR {currentSalon.maint.toLocaleString()} →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PortalCard>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB 5: GOOGLE 5-STAR REVIEW BOOSTER                                     */}
      {/* ========================================================================= */}
      {activeTab === 'REVIEWS' && (
        <PortalCard title="Google Maps 5-Star Review Booster" kicker="AUTONOMOUS REPUTATION">
          <div className="space-y-4">
            <p className="text-xs text-white/60 font-sans leading-relaxed">
              15 minutes after a client completes an appointment, WORKCRAFT automatically sends a polite thank-you message with your Google Maps 5-star review link.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
                <span className="text-[10px] font-mono text-white/50 uppercase block">Review Trigger Status</span>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-300">Booster Active (15 Min Delay)</span>
                </div>
                <p className="text-[11px] text-white/50 font-sans">
                  Target: Google Maps · Royal Fade Lounge, DHA Phase 5
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
                <span className="text-[10px] font-mono text-white/50 uppercase block">Total Reviews Generated</span>
                <p className="text-xl font-bold font-mono text-[#D9A441]">31 Verified Reviews</p>
                <p className="text-[11px] text-white/50 font-sans">
                  Average customer satisfaction rating: 4.9 / 5.0
                </p>
              </div>
            </div>
          </div>
        </PortalCard>
      )}
    </div>
  );
};
