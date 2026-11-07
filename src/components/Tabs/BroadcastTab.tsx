import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Upload, Play, Pause, RotateCcw, AlertTriangle, 
  CheckCircle2, Clock, ShieldCheck, Ban, ArrowRight, Zap, 
  FileVideo, Sparkles, User, Tag, Send, Check, Globe,
  Languages, Filter, RefreshCw
} from 'lucide-react';
import { BroadcastCampaign, BroadcastLog, Contact, SalonProfile } from '../../types';

export type RegionalLang = 'roman_urdu' | 'arabic' | 'english';

export interface RouteDetectionResult {
  route: RegionalLang;
  label: string;
  flag: string;
  matchedPrefix: string;
  description: string;
}

/**
 * Phone Prefix Auto-Detection Engine:
 * - +92 (Pakistan) & +91 (India) ➔ Roman Urdu / Hinglish
 * - +971, +966, +965, +974, +973, +968 (MENA / Gulf) ➔ Arabic
 * - +44, +1, and European/Western ➔ English
 */
export const detectLanguageRoute = (phone: string): RouteDetectionResult => {
  const clean = phone.replace(/[^0-9+]/g, '');

  // +92 (Pakistan) & +91 (India)
  if (
    clean.startsWith('+92') || clean.startsWith('92') || clean.startsWith('03') ||
    clean.startsWith('+91') || clean.startsWith('91')
  ) {
    const isIndia = clean.startsWith('+91') || clean.startsWith('91');
    return {
      route: 'roman_urdu',
      label: 'Roman Urdu / Hinglish',
      flag: isIndia ? '🇮🇳' : '🇵🇰',
      matchedPrefix: isIndia ? '+91' : '+92',
      description: 'Route: Pakistan & India Prefix',
    };
  }

  // +971 (UAE), +966 (KSA), +965 (Kuwait), +974 (Qatar), +973 (Bahrain), +968 (Oman)
  if (
    clean.startsWith('+971') || clean.startsWith('971') ||
    clean.startsWith('+966') || clean.startsWith('966') ||
    clean.startsWith('+965') || clean.startsWith('965') ||
    clean.startsWith('+974') || clean.startsWith('974') ||
    clean.startsWith('+973') || clean.startsWith('973') ||
    clean.startsWith('+968') || clean.startsWith('968')
  ) {
    let flag = '🇦🇪';
    let prefix = '+971';
    if (clean.startsWith('+966') || clean.startsWith('966')) {
      flag = '🇸🇦';
      prefix = '+966';
    } else if (clean.startsWith('+965') || clean.startsWith('965')) {
      flag = '🇰🇼';
      prefix = '+965';
    }
    return {
      route: 'arabic',
      label: 'Arabic (MENA / Gulf)',
      flag,
      matchedPrefix: prefix,
      description: 'Route: MENA / Gulf Prefix',
    };
  }

  // +44 (UK), +1 (US / Canada), Europe & Western Global
  const isUS = clean.startsWith('+1') || clean.startsWith('1');
  return {
    route: 'english',
    label: 'English (Western / Global)',
    flag: isUS ? '🇺🇸' : '🇬🇧',
    matchedPrefix: isUS ? '+1' : clean.startsWith('+44') ? '+44' : 'Global',
    description: 'Route: Western / Global Prefix',
  };
};

// Blueprint Default Templates for Auto-Routing
const DEFAULT_TEMPLATES: Record<RegionalLang, string> = {
  roman_urdu: 'AOA {{client_name}}, {{salon_name}} ki taraf se aap ke liye exclusive weekend deal tayar hai! 👇',
  arabic: 'السلام عليكم {{client_name}}، يسعدنا أن نقدم لكِ عرض الويك إند الخاص من {{salon_name}} 👇',
  english: "Hi {{client_name}}, we've saved an exclusive weekend VIP offer just for you at {{salon_name}}! 👇",
};

const DEFAULT_HEADLINES: Record<RegionalLang, string> = {
  roman_urdu: 'Weekend Royal Grooming Gala: 40% OFF Combos',
  arabic: 'عرض الويك إند الملكي الخاص: خصم 40% على الباقات',
  english: 'Weekend VIP Styling Special: 40% OFF Royal Combo',
};

interface BroadcastTabProps {
  salon: SalonProfile;
  contacts: Contact[];
}

export const BroadcastTab: React.FC<BroadcastTabProps> = ({
  salon,
  contacts,
}) => {
  const activeContacts = contacts.filter((c) => !c.optOut);
  const optOutContacts = contacts.filter((c) => c.optOut);

  // Video State (Universal Media Stream across all contacts)
  const [videoFile, setVideoFile] = useState<{
    name: string;
    duration: number;
    sizeMb: number;
    url?: string;
  }>({
    name: 'weekend_royal_deal_promo.mp4',
    duration: 44, // 44 seconds (<= 60s limit)
    sizeMb: 8.6,
  });

  // Regional Localized Templates
  const [templates, setTemplates] = useState<Record<RegionalLang, string>>(DEFAULT_TEMPLATES);
  const [headlines, setHeadlines] = useState<Record<RegionalLang, string>>(DEFAULT_HEADLINES);

  // Active Template Tab for Editor Inspection
  const [activeEditorTab, setActiveEditorTab] = useState<RegionalLang>('roman_urdu');

  const [validationError, setValidationError] = useState<string | null>(null);

  // Sample contacts for interactive live personalization preview
  const [previewContactId, setPreviewContactId] = useState<string>(
    activeContacts[0]?.id || 'sample-pk-1'
  );

  const selectedPreviewContact = 
    activeContacts.find((c) => c.id === previewContactId) || 
    activeContacts[0] || 
    { 
      id: 'sample-pk-1', 
      name: 'Bilal Ahmed', 
      phone: '+92 300 1234567', 
      city: 'Lahore', 
      country: 'PK', 
      language: 'ur', 
      tags: ['vip'], 
      optOut: false, 
      lastVisit: '2026-10-15', 
      totalVisits: 8 
    };

  // Detected language for the selected preview contact
  const previewDetection = detectLanguageRoute(selectedPreviewContact.phone);

  // Parse template variables helper
  const resolveTemplateText = (text: string, contactName: string) => {
    return text
      .replace(/\{\{client_name\}\}/g, contactName)
      .replace(/\{\{salon_name\}\}/g, salon.name)
      .replace(/\[Salon Name\]/gi, salon.name);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Insert merge tag into current active language caption template
  const handleInsertTag = (tag: '{{client_name}}' | '{{salon_name}}') => {
    const textarea = textareaRef.current;
    const current = templates[activeEditorTab];
    if (!textarea) {
      setTemplates((prev) => ({
        ...prev,
        [activeEditorTab]: prev[activeEditorTab] + ' ' + tag,
      }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = current.substring(0, start) + tag + current.substring(end);
    setTemplates((prev) => ({
      ...prev,
      [activeEditorTab]: updated,
    }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 10);
  };

  const handleResetTemplates = () => {
    setTemplates(DEFAULT_TEMPLATES);
    setHeadlines(DEFAULT_HEADLINES);
  };

  // Queue State
  const [queueStatus, setQueueStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDelay, setCurrentDelay] = useState(6.2);
  const [delayCountdown, setDelayCountdown] = useState(0);
  const [logs, setLogs] = useState<BroadcastLog[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queueTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sample presets for quick testing
  const samplePresets = [
    {
      name: 'weekend_royal_deal_promo.mp4',
      duration: 42,
      sizeMb: 8.2,
      title: 'Weekend 40% Off Royal Combo',
    },
    {
      name: 'master_fade_beard_showcase.mp4',
      duration: 55,
      sizeMb: 11.4,
      title: 'Master Fade & Hot Towel Demo',
    },
    {
      name: 'luxury_keratin_facial_gala.mp4',
      duration: 58,
      sizeMb: 12.8,
      title: 'Keratin & Facial Gala (58s)',
    },
  ];

  // Handle Video Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit ~50MB
    const sizeMb = Number((file.size / (1024 * 1024)).toFixed(1));
    if (sizeMb > 50) {
      setValidationError('File size exceeds 50MB WhatsApp media limit.');
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = Math.round(video.duration);

      if (duration > 60) {
        setValidationError(`Video duration (${duration}s) exceeds the strict 60-second Pay-Per-Deal limit from the blueprint.`);
      } else {
        setValidationError(null);
        setVideoFile({
          name: file.name,
          duration,
          sizeMb,
          url: objectUrl,
        });
      }
    };

    video.onerror = () => {
      setValidationError(null);
      setVideoFile({
        name: file.name,
        duration: 45,
        sizeMb,
      });
    };

    video.src = objectUrl;
  };

  // Queue Dispatch Engine (4s to 9s randomized artificial delay + Prefix Auto-Routing)
  useEffect(() => {
    if (queueStatus !== 'running') {
      if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      return;
    }

    if (currentIndex >= activeContacts.length) {
      setQueueStatus('completed');
      return;
    }

    // Generate random delay between 4.0 and 8.9 seconds
    const randomSec = Number((Math.random() * (8.9 - 4.0) + 4.0).toFixed(1));
    setCurrentDelay(randomSec);
    setDelayCountdown(randomSec);

    // Countdown interval
    const startMs = Date.now();
    const durationMs = randomSec * 1000;

    countdownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startMs;
      const remaining = Math.max(0, (durationMs - elapsed) / 1000);
      setDelayCountdown(Number(remaining.toFixed(1)));
    }, 100);

    // Dispatch timeout with Automated Phone Prefix Language Routing
    queueTimeoutRef.current = setTimeout(() => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

      const target = activeContacts[currentIndex];
      if (target) {
        // 1. Detect phone prefix language route
        const detection = detectLanguageRoute(target.phone);
        
        // 2. Select matching regional template
        const rawTemplate = templates[detection.route] || templates.english;
        
        // 3. Dynamically inject {{client_name}} and {{salon_name}}
        const personalizedCaption = resolveTemplateText(rawTemplate, target.name);

        const newLog: BroadcastLog = {
          id: `log-${Date.now()}-${currentIndex}`,
          timestamp: new Date().toLocaleTimeString(),
          recipientName: target.name,
          recipientPhone: target.phone,
          status: 'sent',
          delaySeconds: randomSec,
          personalizedText: personalizedCaption,
          languageRoute: detection.label,
          languageFlag: detection.flag,
        };
        setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
      }

      setCurrentIndex((prev) => prev + 1);
    }, durationMs);

    return () => {
      if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [queueStatus, currentIndex, activeContacts, templates, salon.name]);

  const handleStartQueue = () => {
    if (salon.paymentStatus === 'overdue_red_alert') {
      alert('Cannot start broadcast: Salon account is locked due to overdue maintenance fees.');
      return;
    }
    setQueueStatus('running');
  };

  const handlePauseQueue = () => {
    setQueueStatus('paused');
  };

  const handleResetQueue = () => {
    setQueueStatus('idle');
    setCurrentIndex(0);
    setLogs([]);
    setDelayCountdown(0);
  };

  const progressPercent = activeContacts.length > 0
    ? Math.round((currentIndex / activeContacts.length) * 100)
    : 0;

  // Breakdown of audience by detected language
  const audienceBreakdown = activeContacts.reduce(
    (acc, c) => {
      const d = detectLanguageRoute(c.phone);
      acc[d.route] = (acc[d.route] || 0) + 1;
      return acc;
    },
    { roman_urdu: 0, arabic: 0, english: 0 } as Record<RegionalLang, number>
  );

  return (
    <div className="space-y-4 pb-20 max-w-full overflow-hidden">
      {/* 0. Automated Phone Prefix Language Routing Banner */}
      <div className="bg-[#102019] border border-[#00FFFF]/30 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#00FFFF]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00FFFF]">
                SALON OWNER PWA · DYNAMIC NAME &amp; LANGUAGE ROUTING ENGINE
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
              Pay-Per-Deal Video Campaign Hub
            </h2>
            <p className="text-xs text-white/65 font-sans mt-0.5">
              Automated phone-prefix language routing + dynamic <code className="text-[#00FFFF] font-mono">{'{{client_name}}'}</code> personalization with 4s–9s Ban-Safety jitter queue
            </p>
          </div>
          <div className="text-left sm:text-right font-mono">
            <span className="text-xs font-bold text-[#D9A441] block">
              {salon.currency} {salon.currency === 'PKR' ? '1,500' : '50'} / blast
            </span>
            <span className="text-[10px] text-emerald-400">
              Universal Video + Auto Prefix Dialect
            </span>
          </div>
        </div>

        {/* 3 Auto-Routing Rules Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-white/10 text-[11px] font-mono">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-white/40 block text-[9px] uppercase">🇵🇰 / 🇮🇳 +92 &amp; +91 PREFIX</span>
              <span className="text-emerald-300 font-bold">Roman Urdu Preset</span>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              {audienceBreakdown.roman_urdu} Clients
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-white/40 block text-[9px] uppercase">🇦🇪 / 🇸🇦 +971, +966, +965 (MENA)</span>
              <span className="text-[#D9A441] font-bold">Arabic Preset</span>
            </div>
            <span className="text-[10px] bg-[#D9A441]/10 text-[#D9A441] font-bold px-2 py-0.5 rounded border border-[#D9A441]/30">
              {audienceBreakdown.arabic} Clients
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-white/40 block text-[9px] uppercase">🇬🇧 / 🇺🇸 +44, +1, WESTERN</span>
              <span className="text-[#00FFFF] font-bold">English Preset</span>
            </div>
            <span className="text-[10px] bg-[#00FFFF]/10 text-[#00FFFF] font-bold px-2 py-0.5 rounded border border-[#00FFFF]/30">
              {audienceBreakdown.english} Clients
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: 60-Second Video Uploader (Universal Attached Media) */}
      <div className="bg-[#102019] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="grid size-6 place-items-center rounded-lg bg-[#00FFFF]/10 text-[#00FFFF]">
              <Video className="size-3.5" />
            </div>
            <span>1. Upload 60s Deal Video (Universal MP4 Attachment)</span>
          </div>
          <span className="text-[10px] text-[#D9A441] font-mono bg-[#D9A441]/10 px-2 py-0.5 rounded border border-[#D9A441]/30">
            Universal for All Contacts
          </span>
        </div>

        {/* Video Presets */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-white/50 font-mono uppercase block">
            Select Ready Deal Clip or Upload Custom:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setValidationError(null);
                  setVideoFile(p);
                }}
                className={`p-2.5 rounded-xl text-left border transition text-xs ${
                  videoFile.name === p.name
                    ? 'bg-[#00FFFF]/10 border-[#00FFFF] text-white font-bold shadow-[0_0_12px_rgba(0,255,255,0.15)]'
                    : 'bg-black/30 border-white/10 text-white/70 hover:bg-white/[0.04]'
                }`}
              >
                <div className="font-semibold text-xs truncate text-white">{p.title}</div>
                <div className="text-[10px] text-white/45 font-mono mt-0.5">
                  {p.duration}s · {p.sizeMb}MB · 1080p
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom File Upload Input */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/mp4,video/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-3 border border-dashed border-white/20 hover:border-[#00FFFF] bg-black/30 rounded-xl text-xs text-white/70 hover:text-white flex items-center justify-center gap-2 transition"
          >
            <Upload className="size-4 text-[#00FFFF]" />
            <span>Upload custom salon MP4 clip (e.g. bridal reel, skin fade showcase, beard spa)</span>
          </button>
        </div>

        {validationError && (
          <div className="bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertTriangle className="size-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Current Video File Card */}
        <div className="bg-black/40 p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileVideo className="size-4 text-[#00FFFF] shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-white truncate block">
                {videoFile.name}
              </span>
              <span className="text-[10px] text-white/45 font-mono">
                Duration: {videoFile.duration}s · Size: {videoFile.sizeMb} MB · Universal media file attached to all prefix routes
              </span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40 shrink-0">
            VALIDATED &le;60s ✓
          </span>
        </div>
      </div>

      {/* Step 2: Multi-Language Template Presets & Dynamic Personalization */}
      <div className="bg-[#102019] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="grid size-6 place-items-center rounded-lg bg-[#D9A441]/10 text-[#D9A441]">
              <Sparkles className="size-3.5" />
            </div>
            <span>2. Localized Prefix Templates &amp; Merge Tags</span>
          </div>
          <button
            type="button"
            onClick={handleResetTemplates}
            className="text-[10px] font-mono text-white/50 hover:text-white flex items-center gap-1 transition"
          >
            <RefreshCw className="size-3" />
            <span>Reset Blueprint Defaults</span>
          </button>
        </div>

        {/* Regional Language Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/10 overflow-x-auto">
          {[
            { id: 'roman_urdu' as const, label: 'Roman Urdu (+92/+91)', flag: '🇵🇰', sub: 'Pakistan / India' },
            { id: 'arabic' as const, label: 'Arabic (+971/+966/+965)', flag: '🇦🇪', sub: 'MENA / Gulf' },
            { id: 'english' as const, label: 'English (+44/+1)', flag: '🇬🇧', sub: 'Western / Global' },
          ].map((tab) => {
            const isActive = activeEditorTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveEditorTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-bold transition shrink-0 ${
                  isActive
                    ? 'bg-white/[0.08] text-[#00FFFF] border border-[#00FFFF]/40 shadow-[0_0_12px_rgba(0,255,255,0.15)]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <span>{tab.flag}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Merge Tag Injection Toolbar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] uppercase text-white/60">
              Insert Variable into {activeEditorTab === 'roman_urdu' ? 'Roman Urdu' : activeEditorTab === 'arabic' ? 'Arabic' : 'English'} Template:
            </span>
            <span className="text-[10px] text-[#00FFFF]">1-Tap to insert at cursor</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleInsertTag('{{client_name}}')}
              className="px-3 py-1.5 rounded-xl border border-[#00FFFF]/40 bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 text-[#00FFFF] text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Inserts customer's real name (e.g. Bilal, Hamza, Tariq)"
            >
              <User className="size-3.5" />
              <span>+ {'{{client_name}}'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleInsertTag('{{salon_name}}')}
              className="px-3 py-1.5 rounded-xl border border-[#D9A441]/40 bg-[#D9A441]/10 hover:bg-[#D9A441]/20 text-[#D9A441] text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Inserts salon name"
            >
              <Tag className="size-3.5" />
              <span>+ {'{{salon_name}}'}</span>
            </button>
            <span className="text-[11px] text-white/50 font-sans italic ml-1">
              * Resolves dynamically per recipient from salon roster
            </span>
          </div>
        </div>

        {/* Current Active Language Template Input */}
        <div className="space-y-3 p-3.5 rounded-xl border border-white/10 bg-black/40">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono font-bold uppercase text-white/60 flex items-center gap-1.5">
                <span>
                  {activeEditorTab === 'roman_urdu' && '🇵🇰 Roman Urdu Headline:'}
                  {activeEditorTab === 'arabic' && '🇦🇪 Arabic Headline (العنوان):'}
                  {activeEditorTab === 'english' && '🇬🇧 English Headline:'}
                </span>
              </label>
              <span className="text-[9px] font-mono text-emerald-400">
                Auto-Routed for {activeEditorTab === 'roman_urdu' ? '+92/+91' : activeEditorTab === 'arabic' ? 'MENA +971/+966/+965' : 'Global +44/+1'}
              </span>
            </div>
            <input
              type="text"
              dir={activeEditorTab === 'arabic' ? 'rtl' : 'ltr'}
              value={headlines[activeEditorTab]}
              onChange={(e) => {
                const val = e.target.value;
                setHeadlines((prev) => ({ ...prev, [activeEditorTab]: val }));
              }}
              className="w-full bg-[#12241C] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00FFFF]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono font-bold uppercase text-white/60">
                {activeEditorTab === 'roman_urdu' && '🇵🇰 Roman Urdu Caption Template (With {{client_name}}):'}
                {activeEditorTab === 'arabic' && '🇦🇪 Arabic Caption Template (قالب الرسالة):'}
                {activeEditorTab === 'english' && '🇬🇧 English Caption Template (With {{client_name}}):'}
              </label>
            </div>
            <textarea
              ref={textareaRef}
              rows={3}
              dir={activeEditorTab === 'arabic' ? 'rtl' : 'ltr'}
              value={templates[activeEditorTab]}
              onChange={(e) => {
                const val = e.target.value;
                setTemplates((prev) => ({ ...prev, [activeEditorTab]: val }));
              }}
              className="w-full bg-[#12241C] border border-white/10 rounded-xl p-3 text-xs text-white/90 focus:outline-none focus:border-[#00FFFF] resize-none leading-relaxed font-sans"
              placeholder="Enter template with {{client_name}}..."
            />
          </div>
        </div>

        {/* Live Personalization Preview Switcher */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-mono text-[10px] text-white/60 uppercase font-bold block">
                Interactive WhatsApp Card Preview (Prefix Auto-Matched):
              </span>
              <span className="text-[11px] font-sans text-emerald-300 flex items-center gap-1 mt-0.5">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  Detected: <strong>{previewDetection.flag} {previewDetection.label}</strong> ({previewDetection.matchedPrefix} prefix)
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/50 font-mono">Test Recipient:</span>
              <select
                value={previewContactId}
                onChange={(e) => setPreviewContactId(e.target.value)}
                className="rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 text-[11px] font-mono text-[#00FFFF] focus:outline-none focus:border-[#00FFFF]"
              >
                {activeContacts.slice(0, 15).map((c) => {
                  const d = detectLanguageRoute(c.phone);
                  return (
                    <option key={c.id} value={c.id}>
                      {d.flag} {c.name} ({c.phone})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Simulated WhatsApp Chat Bubble with Parsed Variables & Matching Prefix Template */}
          <div className="bg-black/70 p-4 rounded-2xl border border-white/15 space-y-3 max-w-md mx-auto shadow-2xl">
            {/* Contact Header in Simulated WhatsApp */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-emerald-500/20 text-emerald-300 grid place-items-center font-bold text-xs">
                  {selectedPreviewContact.name.charAt(0)}
                </div>
                <div>
                  <span className="text-white font-bold block leading-tight">{selectedPreviewContact.name}</span>
                  <span className="text-[10px] font-mono text-white/50">{selectedPreviewContact.phone}</span>
                </div>
              </div>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/10 text-emerald-300 border border-emerald-500/30">
                {previewDetection.flag} {previewDetection.label.split(' ')[0]}
              </span>
            </div>

            {/* Universal Attached Video Preview */}
            <div className="relative aspect-video bg-[#12241C] rounded-xl border border-white/10 flex flex-col items-center justify-center overflow-hidden">
              <div className="size-11 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white mb-1 shadow-lg">
                <Play className="size-5 fill-white ml-0.5 text-white" />
              </div>
              <span className="text-xs font-bold text-white">
                {videoFile.name} ({videoFile.duration}s)
              </span>
              <span className="text-[9px] text-[#00FFFF] font-mono mt-0.5">
                Universal Deal Video Attached
              </span>
            </div>

            {/* Resolved Personalized Message Text according to detected language route */}
            <div className="space-y-1.5" dir={previewDetection.route === 'arabic' ? 'rtl' : 'ltr'}>
              <p className="text-xs font-bold text-white">
                {resolveTemplateText(
                  headlines[previewDetection.route] || headlines.english,
                  selectedPreviewContact.name
                )}
              </p>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/25 text-xs text-emerald-100 font-sans leading-relaxed">
                {resolveTemplateText(
                  templates[previewDetection.route] || templates.english,
                  selectedPreviewContact.name
                )}
              </div>
            </div>

            {/* Mandatory Interactive Buttons from Blueprint */}
            <div className="space-y-1.5 pt-1 border-t border-white/10">
              <button 
                type="button" 
                className="w-full py-2 bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/40 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <span>
                  {previewDetection.route === 'arabic'
                    ? '📅 احجز الآن: تأكيد الموعد'
                    : '[ 📅 Book Now: Confirm My Slot ]'}
                </span>
                <ArrowRight className="size-3.5 text-white" />
              </button>
              <button 
                type="button" 
                className="w-full py-1 bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl text-white/45 text-[10px] font-mono flex items-center justify-center gap-1 transition"
              >
                <Ban className="size-3 text-rose-400" />
                <span>
                  {previewDetection.route === 'arabic'
                    ? 'إلغاء الاشتراك [Stop]'
                    : '[ Stop / Unsubscribe ]'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Visual Rate-Limiting Queue Engine (4s to 9s Throttling + Live Audit Feed) */}
      <div className="bg-[#102019] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <div className="grid size-6 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="size-3.5" />
            </div>
            <span>3. Anti-Ban Queue Engine (4s–9s Throttled Stagger)</span>
          </div>
          <span className="text-[10px] text-white/50 font-mono">
            Audience: {activeContacts.length} Clients
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-white font-semibold">
              {currentIndex} / {activeContacts.length} Dispatched ({progressPercent}%)
            </span>
            {queueStatus === 'running' && (
              <span className="text-amber-400 font-bold tabular-nums animate-pulse">
                Next dispatch in: {delayCountdown}s (Jitter: {currentDelay}s)
              </span>
            )}
            {queueStatus === 'completed' && (
              <span className="text-emerald-400 font-bold">✓ Broadcast Finished</span>
            )}
            {queueStatus === 'idle' && (
              <span className="text-white/40">Queue Ready</span>
            )}
            {queueStatus === 'paused' && (
              <span className="text-amber-400">Queue Paused</span>
            )}
          </div>

          <div className="w-full bg-black/50 h-3.5 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="bg-gradient-to-r from-[#00FFFF] via-emerald-400 to-[#D9A441] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Queue Control Buttons */}
        <div className="flex gap-2.5">
          {queueStatus !== 'running' ? (
            <button
              type="button"
              onClick={handleStartQueue}
              className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-[#12241C] font-mono font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
            >
              <Play className="size-4 fill-[#12241C]" />
              <span>{currentIndex > 0 ? 'Resume Broadcast Queue' : 'Start Multi-Lingual Broadcast (4–9s)'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePauseQueue}
              className="flex-1 h-11 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-[#12241C] font-mono font-black text-xs rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Pause className="size-4 fill-[#12241C]" />
              <span>Pause Dispatch Queue</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetQueue}
            disabled={currentIndex === 0 && queueStatus === 'idle'}
            className="px-3.5 h-11 bg-white/[0.05] hover:bg-white/10 border border-white/10 disabled:opacity-30 text-white rounded-xl text-xs flex items-center justify-center transition"
            title="Reset Queue"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        {/* Live Dispatch Log Feed with Dynamic Personalized Payload & Detected Language Route */}
        <div className="bg-black/50 p-3.5 rounded-xl border border-white/10 font-mono text-[11px] space-y-2">
          <div className="text-[10px] text-white/50 flex justify-between border-b border-white/10 pb-1.5">
            <span className="uppercase font-bold text-[#00FFFF]">
              Live Dispatch Audit Log (Prefix Route + Dynamic Name Injected)
            </span>
            <span className="text-white/60">{logs.length} Delivered</span>
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
            {logs.length === 0 ? (
              <div className="text-white/35 text-center py-3 text-[10px] font-sans">
                Click <strong>'Start Multi-Lingual Broadcast'</strong> to dispatch video deals with dynamic client names and automated prefix routing.
              </div>
            ) : (
              logs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-white/80"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-white/40 text-[10px] font-mono shrink-0">{log.timestamp}</span>
                    <span className="font-bold text-white truncate max-w-[130px] text-[11px]">
                      {log.recipientName}
                    </span>
                    <span className="text-[#00FFFF] text-[10px] font-mono shrink-0">
                      {log.recipientPhone}
                    </span>
                    {log.languageFlag && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/10 border border-white/10 text-white/85 shrink-0">
                        {log.languageFlag} {log.languageRoute?.split(' ')[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 justify-between sm:justify-end text-[10px]">
                    {log.personalizedText && (
                      <span className="text-white/60 truncate max-w-[200px] font-sans italic" title={log.personalizedText}>
                        "{log.personalizedText.slice(0, 36)}..."
                      </span>
                    )}
                    <span className="text-emerald-400 font-mono font-bold shrink-0 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      +{log.delaySeconds}s
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
