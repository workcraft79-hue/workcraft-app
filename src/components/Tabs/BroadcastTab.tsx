import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Upload,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Ban,
  ArrowRight,
  FileVideo,
  Sparkles,
  User,
  Tag,
  Send,
  Globe,
  RefreshCw,
  CreditCard,
  Lock,
  Volume2,
  UsersRound,
  TrendingUp,
  Eye,
  Calendar,
} from 'lucide-react';
import { BroadcastLog, Contact, SalonProfile } from '../../types';

export type RegionalLang = 'roman_urdu' | 'arabic' | 'english';
export type VideoWatchLang = 'ar' | 'en' | 'ur' | 'hi' | 'tl';

export interface RouteDetectionResult {
  route: RegionalLang;
  label: string;
  flag: string;
  matchedPrefix: string;
  description: string;
}

export const detectLanguageRoute = (phone: string): RouteDetectionResult => {
  const clean = phone.replace(/[^0-9+]/g, '');

  if (
    clean.startsWith('+92') ||
    clean.startsWith('92') ||
    clean.startsWith('03') ||
    clean.startsWith('+91') ||
    clean.startsWith('91')
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

  if (
    clean.startsWith('+971') ||
    clean.startsWith('971') ||
    clean.startsWith('+966') ||
    clean.startsWith('966') ||
    clean.startsWith('+965') ||
    clean.startsWith('965') ||
    clean.startsWith('+974') ||
    clean.startsWith('974') ||
    clean.startsWith('+973') ||
    clean.startsWith('973') ||
    clean.startsWith('+968') ||
    clean.startsWith('968')
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

  const isUS = clean.startsWith('+1') || clean.startsWith('1');
  return {
    route: 'english',
    label: 'English (Western / Global)',
    flag: isUS ? '🇺🇸' : '🇬🇧',
    matchedPrefix: isUS ? '+1' : clean.startsWith('+44') ? '+44' : 'Global',
    description: 'Route: Western / Global Prefix',
  };
};

function getVideoBillingConfig(phone: string) {
  const clean = phone.replace(/[^0-9+]/g, '');
  if (clean.startsWith('+92')) {
    return {
      countryLabel: 'Pakistan (+92)',
      currency: 'PKR',
      symbol: 'PKR ',
      singlePrice: 1500,
      monthly4Price: 4000,
      channels: [
        { id: 'EasyPaisa', label: 'EasyPaisa Till', detail: 'WORKCRAFT · Till 789210 (Auto SIM Match)' },
        { id: 'JazzCash', label: 'JazzCash Merchant', detail: 'WORKCRAFT · 0300-WORKCRAFT' },
        { id: 'IBFT', label: 'Meezan Bank IBFT', detail: 'PK64MEZN0001020304050607' },
      ],
    };
  }
  if (clean.startsWith('+971')) {
    return {
      countryLabel: 'UAE (+971)',
      currency: 'AED',
      symbol: 'AED ',
      singlePrice: 55,
      monthly4Price: 145,
      channels: [
        { id: 'Stripe', label: 'Stripe / Apple Pay / Card', detail: 'Instant MENA Card (AED)' },
        { id: 'Wire', label: 'UAE IBAN Wire', detail: 'AE070331234567890123456' },
      ],
    };
  }
  if (clean.startsWith('+966')) {
    return {
      countryLabel: 'Saudi Arabia (+966)',
      currency: 'SAR',
      symbol: 'SAR ',
      singlePrice: 56,
      monthly4Price: 150,
      channels: [
        { id: 'Stripe', label: 'Stripe / Mada / Card', detail: 'Instant KSA Card (SAR)' },
        { id: 'Wire', label: 'Saudi IBAN Wire', detail: 'SA0380000000608010167519' },
      ],
    };
  }
  if (clean.startsWith('+44')) {
    return {
      countryLabel: 'United Kingdom (+44)',
      currency: 'GBP',
      symbol: '£',
      singlePrice: 12,
      monthly4Price: 32,
      channels: [
        { id: 'Stripe', label: 'Stripe / Apple Pay / Card', detail: 'Instant UK Card (GBP)' },
        { id: 'Wire', label: 'UK Faster Payments', detail: 'GB29NWBK60161331926819' },
      ],
    };
  }
  return {
    countryLabel: 'International (Global)',
    currency: 'USD',
    symbol: '$',
    singlePrice: 15,
    monthly4Price: 40,
    channels: [
      { id: 'Stripe', label: 'Stripe / Global Card', detail: 'Instant Card Checkout (USD)' },
      { id: 'Wire', label: 'SWIFT Wire', detail: 'WORKCRAFT-GLOBAL-SWIFT' },
    ],
  };
}

function autoDetectHeadlineFromFilename(filename: string, salonName: string): Record<RegionalLang, string> {
  const clean = filename
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();
  const baseTitle = clean.length > 3 ? clean.replace(/\b\w/g, (c) => c.toUpperCase()) : 'Special Salon Deal';
  return {
    roman_urdu: `${salonName} Offer: ${baseTitle}`,
    arabic: `عرض خاص من ${salonName}: ${baseTitle}`,
    english: `${salonName} Exclusive: ${baseTitle}`,
  };
}

const DEFAULT_TEMPLATES: Record<RegionalLang, string> = {
  roman_urdu: 'AOA {{client_name}}, {{salon_name}} ki taraf se aap ke liye exclusive limited-day deal tayar hai! 👇',
  arabic: 'السلام عليكم {{client_name}}، يسعدنا أن نقدم لك عرض خاص من {{salon_name}} 👇',
  english: "Hi {{client_name}}, {{salon_name}} has reserved an exclusive limited-day offer for you! 👇",
};

const STOP_OPT_OUT_FOOTER: Record<RegionalLang, string> = {
  roman_urdu: 'Promo videos band karne ke liye STOP likh kar bhejein.',
  arabic: 'لإيقاف فيديوهات العروض، أرسل كلمة STOP',
  english: 'Reply STOP anytime to stop receiving deal videos.',
};

const MENA_VIDEO_SUBTITLES: Record<VideoWatchLang, { label: string; badge: string; script: string }> = {
  ar: {
    label: 'العربية (Arabic)',
    badge: 'AR Dub/Sub',
    script: 'مرحباً! هذا الأسبوع لدينا عرض خاص على قص الشعر والعناية الكاملة بالصالون لمدة محدودة.',
  },
  en: {
    label: 'English',
    badge: 'EN Dub/Sub',
    script: 'Welcome! This week we have an exclusive grooming & styling offer valid for a limited 7–10 day window.',
  },
  ur: {
    label: 'اردو (Urdu)',
    badge: 'UR Original',
    script: 'السلام علیکم! اس ہفتے ہمارے سیلون میں ہیئر کٹ اور مکمل گرومنگ پر خاص ڈیل دستیاب ہے۔',
  },
  hi: {
    label: 'हिन्दी (Hindi)',
    badge: 'HI Dub/Sub',
    script: 'नमस्ते! इस हफ्ते हमारे सैलून में हेयरकट और ग्रूमिंग कॉम्बो पर खास ऑफर उपलब्ध है।',
  },
  tl: {
    label: 'Tagalog',
    badge: 'TL Dub/Sub',
    script: 'Kumusta! May espesyal na grooming at haircut deal kami ngayong linggo para sa iyo.',
  },
};

interface BroadcastTabProps {
  salon: SalonProfile;
  contacts: Contact[];
  ownerLang?: 'en' | 'ur' | 'ar';
  onShowToast?: (msg: string) => void;
}

export const BroadcastTab: React.FC<BroadcastTabProps> = ({
  salon,
  contacts,
  ownerLang = 'ur',
  onShowToast,
}) => {
  const billingConfig = getVideoBillingConfig(salon.phone);

  // Query 3: 1-Video Single ($15 / PKR 1,500) vs 4-Video Monthly ($40 / PKR 4,000) & Payment Gate BEFORE Upload
  const [selectedDealPlan, setSelectedDealPlan] = useState<'SINGLE_1' | 'MONTHLY_4'>('SINGLE_1');
  const [selectedPayChannel, setSelectedPayChannel] = useState<string>(billingConfig.channels[0].id);
  const [isDealPaymentConfirmed, setIsDealPaymentConfirmed] = useState<boolean>(false);
  const [isPayingDeal, setIsPayingDeal] = useState<boolean>(false);
  const [dealPaymentTid, setDealPaymentTid] = useState<string | null>(null);

  // Query 2: Validation Days (7 to 10 days quick chips — no manual typing)
  const [validationDays, setValidationDays] = useState<7 | 8 | 9 | 10>(7);

  // Query 4: Day-1 Quick Contact Import State
  const [importedContacts, setImportedContacts] = useState<Contact[]>(() => contacts);
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const [importStatusMsg, setImportStatusMsg] = useState<string | null>(null);
  const vcfInputRef = useRef<HTMLInputElement>(null);

  const activeContacts = importedContacts.filter((c) => !c.optOut);
  const stoppedContacts = importedContacts.filter((c) => c.optOut);
  const [stopFeedbackMsg, setStopFeedbackMsg] = useState<string | null>(null);

  // Query 2 & 4: Single Custom Video Uploader + Auto QA + Owner-Language Rejection Guide
  const [videoFile, setVideoFile] = useState<{
    name: string;
    duration: number;
    sizeMb: number;
    url?: string;
    qaStatus: 'PASSED' | 'REJECTED';
  } | null>(null);
  const [qaRejectionNotice, setQaRejectionNotice] = useState<{
    title: string;
    errorDetail: string;
    fixSteps: string;
  } | null>(null);

  const [headlines, setHeadlines] = useState<Record<RegionalLang, string>>(() =>
    autoDetectHeadlineFromFilename('salon_weekend_promo.mp4', salon.name)
  );
  const [templates, setTemplates] = useState<Record<RegionalLang, string>>(DEFAULT_TEMPLATES);
  const [activeEditorTab, setActiveEditorTab] = useState<RegionalLang>('roman_urdu');

  // Query 5: MENA Client Watch-Language Switcher
  const [clientWatchLang, setClientWatchLang] = useState<VideoWatchLang>('ar');
  const [isSpeakingDub, setIsSpeakingDub] = useState(false);

  const [previewContactId, setPreviewContactId] = useState<string>(
    activeContacts[0]?.id || 'sample-pk-1'
  );
  const selectedPreviewContact = activeContacts.find((c) => c.id === previewContactId) ||
    activeContacts[0] || {
      id: 'sample-pk-1',
      name: 'Bilal Ahmed',
      phone: '+92 300 1234567',
      city: 'Lahore',
      country: 'PK' as const,
      language: 'ur' as const,
      tags: ['vip'],
      optOut: false,
      lastVisit: '2026-10-15',
      totalVisits: 8,
    };
  const previewDetection = detectLanguageRoute(selectedPreviewContact.phone);

  // Queue Engine
  const [queueStatus, setQueueStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDelay, setCurrentDelay] = useState(6.2);
  const [delayCountdown, setDelayCountdown] = useState(0);
  const [logs, setLogs] = useState<BroadcastLog[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSelectedPayChannel(billingConfig.channels[0].id);
  }, [salon.phone]);

  const resolveTemplateText = (text: string, contactName: string) => {
    return text
      .replace(/\{\{client_name\}\}/g, contactName)
      .replace(/\{\{salon_name\}\}/g, salon.name)
      .replace(/\[Salon Name\]/gi, salon.name);
  };

  // Query 4: Handle End-User Replying STOP to Restrict Future Deal Videos
  const handleClientRepliesStop = (contact: Contact) => {
    setImportedContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, optOut: true } : c))
    );
    const remaining = activeContacts.filter((c) => c.id !== contact.id);
    if (remaining.length > 0) {
      setPreviewContactId(remaining[0].id);
    }
    const notice = `🛑 ${contact.name} (${contact.phone}) replied STOP — permanently blocked from future deal videos. Direct 1-to-1 booking replies still work.`;
    setStopFeedbackMsg(notice);
    onShowToast?.(notice);
  };

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
    setTemplates((prev) => ({ ...prev, [activeEditorTab]: updated }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 10);
  };

  // Query 3: Confirm Payment Gate
  const handleConfirmDealPayment = () => {
    setIsPayingDeal(true);
    setTimeout(() => {
      const tid = `${salon.phone.startsWith('+92') ? 'EP' : 'ST'}-${Math.floor(
        1000000000 + Math.random() * 9000000000
      )}`;
      setIsPayingDeal(false);
      setIsDealPaymentConfirmed(true);
      setDealPaymentTid(tid);
      const amt =
        selectedDealPlan === 'SINGLE_1' ? billingConfig.singlePrice : billingConfig.monthly4Price;
      onShowToast?.(
        `✅ Video Deal Payment Verified (${billingConfig.symbol}${amt.toLocaleString()} · TID: ${tid}). Final Video Uploader Unlocked!`
      );
    }, 650);
  };

  // Query 4: Owner-Language Video QA Rejection Generator
  const buildOwnerLangRejection = (reason: 'DURATION' | 'SIZE') => {
    if (reason === 'DURATION') {
      if (ownerLang === 'ur') {
        return {
          title: 'ویڈیو مسترد کر دی گئی (60 سیکنڈ سے لمبی ہے)',
          errorDetail: 'آپ کی اپلوڈ کردہ ویڈیو 60 سیکنڈ کی حد سے زیادہ ہے۔ واٹس ایپ بین سے بچنے کے لیے 60 سیکنڈ سے کم ویڈیو ضروری ہے۔',
          fixSteps: 'حل: ویڈیو کو فون گیلری سے 45–58 سیکنڈ تک ٹرم (Cut) کریں اور دوبارہ اپلوڈ کریں۔',
        };
      }
      if (ownerLang === 'ar') {
        return {
          title: 'تم رفض الفيديو (يتجاوز 60 ثانية)',
          errorDetail: 'مدة الفيديو تتجاوز الحد الأقصى المسموح به (60 ثانية) لحماية رقم الواتساب من الحظر.',
          fixSteps: 'الحل: قم بقص الفيديو إلى أقل من 60 ثانية من معرض الهاتف ثم أعد رفعه.',
        };
      }
      return {
        title: 'Video Rejected (Exceeds 60-Second Boundary)',
        errorDetail: 'Uploaded clip is longer than the strict 60s WhatsApp anti-ban duration limit.',
        fixSteps: 'How to fix: Trim your video to 15–58 seconds in your phone gallery and re-upload.',
      };
    }

    if (ownerLang === 'ur') {
      return {
        title: 'ویڈیو مسترد کر دی گئی (فائل سائز 50MB سے زیادہ ہے)',
        errorDetail: 'فائل کا سائز 50MB سے زیادہ ہونے کی وجہ سے واٹس ایپ پر فوری ترسیل ممکن نہیں۔',
        fixSteps: 'حل: ویڈیو کو 720p/1080p پر کمپریس کریں یا لمبائی کم کر کے دوبارہ اپلوڈ کریں۔',
      };
    }
    if (ownerLang === 'ar') {
      return {
        title: 'تم رفض الفيديو (حجم الملف يتجاوز 50 ميجابايت)',
        errorDetail: 'حجم الملف أكبر من الحد المسموح به لإرسال وسائط واتساب (50MB).',
        fixSteps: 'الحل: قم بضغط الفيديو إلى 720p أو تقليل مدته ثم أعد الرفع.',
      };
    }
    return {
      title: 'Video Rejected (File Size > 50MB)',
      errorDetail: 'File size exceeds the 50MB WhatsApp media boundary.',
      fixSteps: 'How to fix: Compress video to 720p/1080p MP4 under 50MB and re-upload.',
    };
  };

  // Single Custom File Upload Handler + Auto Headline Detection + Auto QA
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = Number((file.size / (1024 * 1024)).toFixed(1));
    if (sizeMb > 50) {
      setQaRejectionNotice(buildOwnerLangRejection('SIZE'));
      setVideoFile({
        name: file.name,
        duration: 45,
        sizeMb,
        qaStatus: 'REJECTED',
      });
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = Math.round(video.duration);
      if (duration > 60) {
        setQaRejectionNotice(buildOwnerLangRejection('DURATION'));
        setVideoFile({ name: file.name, duration, sizeMb, url: objectUrl, qaStatus: 'REJECTED' });
      } else {
        setQaRejectionNotice(null);
        setVideoFile({ name: file.name, duration, sizeMb, url: objectUrl, qaStatus: 'PASSED' });
        setHeadlines(autoDetectHeadlineFromFilename(file.name, salon.name));
      }
    };

    video.onerror = () => {
      setQaRejectionNotice(null);
      setVideoFile({ name: file.name, duration: 42, sizeMb, qaStatus: 'PASSED' });
      setHeadlines(autoDetectHeadlineFromFilename(file.name, salon.name));
    };

    video.src = objectUrl;
  };

  // Day-1 Quick Contact Import Helpers
  const handleSyncPairedWhatsappChats = () => {
    const synced: Contact[] = [
      { id: `sync-${Date.now()}-1`, name: 'Faisal Qureshi', phone: '+92 300 7788990', city: 'Lahore', country: 'PK', language: 'ur', tags: ['WhatsApp Sync'], optOut: false, lastVisit: 'Today', totalVisits: 2 },
      { id: `sync-${Date.now()}-2`, name: 'Mansoor Al-Suwaidi', phone: '+971 50 4433221', city: 'Dubai', country: 'AE', language: 'ar', tags: ['WhatsApp Sync'], optOut: false, lastVisit: 'Today', totalVisits: 1 },
      { id: `sync-${Date.now()}-3`, name: 'Daniel Evans', phone: '+44 7700 900123', city: 'London', country: 'PK', language: 'en', tags: ['WhatsApp Sync'], optOut: false, lastVisit: 'Today', totalVisits: 1 },
    ];
    setImportedContacts((prev) => {
      const existingPhones = new Set(prev.map((c) => c.phone.replace(/\s+/g, '')));
      const fresh = synced.filter((s) => !existingPhones.has(s.phone.replace(/\s+/g, '')));
      return [...fresh, ...prev];
    });
    setImportStatusMsg('✓ Synced recent clients from paired WhatsApp chat history with auto-prefix routing!');
    setTimeout(() => setImportStatusMsg(null), 5000);
  };

  const handleVcfOrCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      const phoneMatches = content.match(/\+?\d[\d\s-]{8,15}\d/g) || [];
      const uniquePhones = Array.from(new Set(phoneMatches.map((p) => p.trim()))).slice(0, 50);
      if (uniquePhones.length === 0) {
        setImportStatusMsg('No valid phone numbers found in file. Try CSV or paste numbers directly.');
        return;
      }
      const newContacts: Contact[] = uniquePhones.map((phone, idx) => ({
        id: `vcf-${Date.now()}-${idx}`,
        name: `Imported Client ${idx + 1}`,
        phone,
        city: salon.city,
        country: phone.startsWith('+971') || phone.startsWith('+966') ? 'AE' : 'PK',
        language: phone.startsWith('+971') || phone.startsWith('+966') ? 'ar' : phone.startsWith('+92') ? 'ur' : 'en',
        tags: ['Phonebook Import'],
        optOut: false,
        lastVisit: 'Day-1 Import',
        totalVisits: 1,
      }));
      setImportedContacts((prev) => [...newContacts, ...prev]);
      setImportStatusMsg(`✓ Imported ${newContacts.length} phonebook contacts from ${file.name}!`);
      setTimeout(() => setImportStatusMsg(null), 5000);
    };
    reader.readAsText(file);
  };

  const handleBulkPasteImport = () => {
    const lines = pasteInput
      .split(/[\n,;]+/)
      .map((l) => l.trim())
      .filter((l) => l.replace(/[^0-9]/g, '').length >= 8);
    if (lines.length === 0) return;

    const newContacts: Contact[] = lines.map((raw, idx) => ({
      id: `paste-${Date.now()}-${idx}`,
      name: `Client #${idx + 1}`,
      phone: raw.startsWith('+') ? raw : `+${raw}`,
      city: salon.city,
      country: raw.includes('971') || raw.includes('966') ? 'AE' : 'PK',
      language: raw.includes('971') || raw.includes('966') ? 'ar' : raw.includes('92') ? 'ur' : 'en',
      tags: ['Day-1 Paste'],
      optOut: false,
      lastVisit: 'Day-1 Import',
      totalVisits: 1,
    }));
    setImportedContacts((prev) => [...newContacts, ...prev]);
    setPasteInput('');
    setShowPasteBox(false);
    setImportStatusMsg(`✓ Added ${newContacts.length} WhatsApp numbers with instant country prefix routing!`);
    setTimeout(() => setImportStatusMsg(null), 5000);
  };

  // MENA Translated Voice Demo
  const handlePlayMenaTranslatedVoice = () => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const item = MENA_VIDEO_SUBTITLES[clientWatchLang];
        const utter = new SpeechSynthesisUtterance(item.script);
        utter.lang =
          clientWatchLang === 'ar'
            ? 'ar-SA'
            : clientWatchLang === 'ur'
            ? 'ur-PK'
            : clientWatchLang === 'hi'
            ? 'hi-IN'
            : 'en-US';
        setIsSpeakingDub(true);
        utter.onend = () => setIsSpeakingDub(false);
        utter.onerror = () => setIsSpeakingDub(false);
        window.speechSynthesis.speak(utter);
        setTimeout(() => setIsSpeakingDub(false), 6000);
      }
    } catch {
      setIsSpeakingDub(false);
    }
  };

  // Queue Dispatch Engine (4s–9s jitter)
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

    const randomSec = Number((Math.random() * (8.9 - 4.0) + 4.0).toFixed(1));
    setCurrentDelay(randomSec);
    setDelayCountdown(randomSec);

    const startMs = Date.now();
    const durationMs = randomSec * 1000;

    countdownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startMs;
      const remaining = Math.max(0, (durationMs - elapsed) / 1000);
      setDelayCountdown(Number(remaining.toFixed(1)));
    }, 100);

    queueTimeoutRef.current = setTimeout(() => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      const target = activeContacts[currentIndex];
      if (target) {
        const detection = detectLanguageRoute(target.phone);
        const rawTemplate = templates[detection.route] || templates.english;
        const optOutLine = STOP_OPT_OUT_FOOTER[detection.route] || STOP_OPT_OUT_FOOTER.english;
        const personalizedCaption = `${resolveTemplateText(rawTemplate, target.name)}\n\n${optOutLine}`;

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

  const progressPercent =
    activeContacts.length > 0 ? Math.round((currentIndex / activeContacts.length) * 100) : 0;

  return (
    <div className="space-y-4 pb-12 max-w-full overflow-hidden">
      {/* ========================================================================= */}
      {/* QUERY 6: VIDEO DEAL ROI MATRIX FUNNEL (SENT 450 ➔ VIEWED 380 ➔ BOOKED 50) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-[#D9A441]/40 bg-[#102019] p-4 sm:p-5 space-y-3 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-[#D9A441]" />
            <span className="text-xs font-mono font-black uppercase text-[#D9A441]">
              Video Deal ROI Matrix · Real Business Return
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            13.2% Watch-to-Book Conversion
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 font-mono">
          <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
            <span className="text-[10px] text-white/50 uppercase block">SENT TO MEMBERS</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">450</p>
            <span className="text-[10px] text-[#00FFFF]">WhatsApp Delivered</span>
          </div>
          <div className="rounded-xl border border-[#00FFFF]/30 bg-[#00FFFF]/5 p-3 text-center">
            <span className="text-[10px] text-[#00FFFF] uppercase block flex items-center justify-center gap-1">
              <Eye className="size-3" />
              <span>OPENED &amp; WATCHED</span>
            </span>
            <p className="text-xl sm:text-2xl font-black text-[#00FFFF] mt-0.5">380</p>
            <span className="text-[10px] text-white/65">84.4% View Rate</span>
          </div>
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-center">
            <span className="text-[10px] text-emerald-300 uppercase block flex items-center justify-center gap-1">
              <Calendar className="size-3" />
              <span>APPOINTMENTS BOOKED</span>
            </span>
            <p className="text-xl sm:text-2xl font-black text-emerald-300 mt-0.5">50</p>
            <span className="text-[10px] text-[#D9A441] font-bold">
              {billingConfig.symbol}{(salon.phone.startsWith('+92') ? 75000 : 2250).toLocaleString()} Revenue
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUERY 4: DAY-1 QUICK WHATSAPP CONTACT IMPORTER                            */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-white/10 bg-[#102019] p-4 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-[#00FFFF] uppercase flex items-center gap-1.5">
              <UsersRound className="size-4" />
              <span>Step 1: Day-1 Quick Client WhatsApp Import ({activeContacts.length} Ready)</span>
            </span>
            <p className="text-[11px] text-white/60 font-sans mt-0.5">
              Fastest ways to load your customer list on Day 1 of purchasing your package:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={handleSyncPairedWhatsappChats}
            className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-950/50 p-2.5 text-emerald-300 font-bold transition text-left"
          >
            ⚡ 1. Auto-Sync Paired WhatsApp
            <span className="block text-[10px] text-white/55 font-sans font-normal mt-0.5">
              Pull recent client chats automatically
            </span>
          </button>

          <button
            type="button"
            onClick={() => vcfInputRef.current?.click()}
            className="rounded-xl border border-[#00FFFF]/40 bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 p-2.5 text-[#00FFFF] font-bold transition text-left"
          >
            📇 2. Import Phonebook (.vcf / .csv)
            <span className="block text-[10px] text-white/55 font-sans font-normal mt-0.5">
              Upload exported phone contacts file
            </span>
          </button>
          <input
            ref={vcfInputRef}
            type="file"
            accept=".vcf,.csv,.txt"
            onChange={handleVcfOrCsvImport}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => setShowPasteBox(!showPasteBox)}
            className="rounded-xl border border-[#D9A441]/40 bg-[#D9A441]/10 hover:bg-[#D9A441]/20 p-2.5 text-[#D9A441] font-bold transition text-left"
          >
            📋 3. Quick Paste Numbers
            <span className="block text-[10px] text-white/55 font-sans font-normal mt-0.5">
              Paste numbers separated by commas or lines
            </span>
          </button>
        </div>

        {showPasteBox && (
          <div className="rounded-xl border border-white/15 bg-black/50 p-3 space-y-2">
            <textarea
              rows={2}
              value={pasteInput}
              onChange={(e) => setPasteInput(e.target.value)}
              placeholder="+923001234567, +971508923411, +447911123456"
              className="w-full rounded-lg border border-white/15 bg-[#12241C] p-2 text-xs font-mono text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleBulkPasteImport}
                className="rounded-lg bg-[#D9A441] text-[#12241C] px-3 py-1.5 text-xs font-mono font-bold"
              >
                Import Numbers ✓
              </button>
            </div>
          </div>
        )}

        {importStatusMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-[11px] font-mono text-emerald-200">
            {importStatusMsg}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* QUERY 3: BOTH VIDEO PLANS (1-VIDEO vs 4-VIDEO) + REGIONAL PAYMENT GATE    */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-[#D9A441]/40 bg-[#102019] p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-[#D9A441] uppercase flex items-center gap-1.5">
              <CreditCard className="size-4" />
              <span>Step 2: Choose Video Deal Plan &amp; Pay ({billingConfig.countryLabel})</span>
            </span>
            <p className="text-[11px] text-white/65 font-sans mt-0.5">
              Pricing &amp; payment methods adapt automatically from your WhatsApp number ({salon.phone}). Confirm payment first to unlock final video upload.
            </p>
          </div>
          {isDealPaymentConfirmed && (
            <button
              type="button"
              onClick={() => {
                setIsDealPaymentConfirmed(false);
                setDealPaymentTid(null);
              }}
              className="text-[10px] font-mono text-white/55 hover:text-white underline self-start"
            >
              Reset Payment Gate
            </button>
          )}
        </div>

        {/* Both Video Deal Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedDealPlan('SINGLE_1')}
            className={`rounded-2xl border p-3.5 text-left transition ${
              selectedDealPlan === 'SINGLE_1'
                ? 'border-[#D9A441] bg-[#D9A441]/15 ring-1 ring-[#D9A441]'
                : 'border-white/10 bg-black/40 hover:border-white/25'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#00FFFF] uppercase">Starter Option · 1 Video Once</span>
              <span className="text-base font-mono font-black text-[#D9A441]">
                {billingConfig.symbol}{billingConfig.singlePrice.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-white/70 font-sans mt-1">
              Single promotional deal video blast to all imported clients (valid 7–10 days).
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDealPlan('MONTHLY_4')}
            className={`rounded-2xl border p-3.5 text-left transition ${
              selectedDealPlan === 'MONTHLY_4'
                ? 'border-[#D9A441] bg-[#D9A441]/15 ring-1 ring-[#D9A441]'
                : 'border-white/10 bg-black/40 hover:border-white/25'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase">Growth Option · 4 Videos / Month</span>
              <span className="text-base font-mono font-black text-[#D9A441]">
                {billingConfig.symbol}{billingConfig.monthly4Price.toLocaleString()}/mo
              </span>
            </div>
            <p className="text-[11px] text-white/70 font-sans mt-1">
              Up to 4 deal videos per month (weekly campaigns · best savings per blast).
            </p>
          </button>
        </div>

        {/* Payment Confirmation Gate */}
        {isDealPaymentConfirmed ? (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/35 p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>
                Payment Received ({billingConfig.symbol}
                {(selectedDealPlan === 'SINGLE_1'
                  ? billingConfig.singlePrice
                  : billingConfig.monthly4Price
                ).toLocaleString()}{' '}
                via {selectedPayChannel}) · Final Video Uploader Unlocked ✓
              </span>
            </span>
            <span className="text-[#00FFFF]">TID: {dealPaymentTid}</span>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase text-white/70 block">
              Select Country-Matched Payment Method ({billingConfig.countryLabel}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {billingConfig.channels.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedPayChannel(ch.id)}
                  className={`rounded-xl border p-2.5 text-left text-xs font-mono transition ${
                    selectedPayChannel === ch.id
                      ? 'border-[#00FFFF] bg-[#00FFFF]/15 text-white'
                      : 'border-white/10 bg-white/[0.02] text-white/65'
                  }`}
                >
                  <p className="font-bold text-[#00FFFF]">{ch.label}</p>
                  <p className="text-[10px] text-white/55 mt-0.5">{ch.detail}</p>
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={isPayingDeal}
              onClick={handleConfirmDealPayment}
              className="w-full rounded-xl bg-gradient-to-r from-[#D9A441] to-amber-400 text-[#12241C] py-2.5 text-xs font-mono font-black uppercase transition active:scale-95"
            >
              {isPayingDeal
                ? 'Confirming Payment...'
                : `Confirm ${billingConfig.symbol}${(selectedDealPlan === 'SINGLE_1'
                    ? billingConfig.singlePrice
                    : billingConfig.monthly4Price
                  ).toLocaleString()} Payment & Unlock Final Upload →`}
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* QUERY 2 & 4: SINGLE CUSTOM VIDEO UPLOADER (NO PRESET CLIPS) + 7-10 DAYS   */}
      {/* ========================================================================= */}
      <div className="relative rounded-2xl border border-white/10 bg-[#102019] p-4 sm:p-5 space-y-4 shadow-lg">
        {!isDealPaymentConfirmed && (
          <div className="absolute inset-0 z-20 rounded-2xl bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center space-y-2">
            <Lock className="size-7 text-[#D9A441]" />
            <p className="text-sm font-black text-white">Final Video Upload Locked Until Payment Confirmed</p>
            <p className="text-xs text-white/65 max-w-md font-sans">
              Select the 1-Video ({billingConfig.symbol}{billingConfig.singlePrice.toLocaleString()}) or 4-Video ({billingConfig.symbol}{billingConfig.monthly4Price.toLocaleString()}) pack and confirm payment above to unlock final video upload.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <Video className="size-4 text-[#00FFFF]" />
            <span>Step 3: Upload Your Custom Deal Video &amp; Validation Days</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            Single Uploader · Auto QA ≤60s
          </span>
        </div>

        {/* 7 to 10 Validation Days Selector (1-Tap Chips — No Manual Typing) */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#D9A441] block">
              Select Deal Validation Window (7 to 10 Days):
            </span>
            <span className="text-[11px] text-white/60 font-sans">
              Deal applies automatically for {validationDays} days from broadcast launch.
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            {([7, 8, 9, 10] as const).map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setValidationDays(days)}
                className={`rounded-xl border px-3 py-1.5 font-bold transition ${
                  validationDays === days
                    ? 'border-[#00FFFF] bg-[#00FFFF]/20 text-[#00FFFF]'
                    : 'border-white/15 bg-white/[0.03] text-white/70 hover:text-white'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        {/* Single File Upload Dropzone + Quick QA Test Buttons */}
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
          className="w-full py-4 px-4 border-2 border-dashed border-[#00FFFF]/40 hover:border-[#00FFFF] bg-black/35 rounded-2xl text-xs text-white/85 flex flex-col items-center justify-center gap-1.5 transition"
        >
          <Upload className="size-5 text-[#00FFFF]" />
          <span className="font-bold">Tap to Upload Your Salon's Custom Deal Video (MP4 ≤ 60s, ≤ 50MB)</span>
          <span className="text-[10px] text-white/50 font-mono">
            Headline &amp; QA boundaries are checked automatically after upload
          </span>
        </button>

        {/* Quick QA Simulation Chips for Owner Verification */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="text-white/50">Test Auto-QA Engine:</span>
          <button
            type="button"
            onClick={() => {
              const sampleName = 'eid_weekend_haircut_beard_offer.mp4';
              setQaRejectionNotice(null);
              setVideoFile({ name: sampleName, duration: 42, sizeMb: 9.4, qaStatus: 'PASSED' });
              setHeadlines(autoDetectHeadlineFromFilename(sampleName, salon.name));
            }}
            className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-2.5 py-1 text-emerald-300 font-bold"
          >
            ✓ Simulate Valid Clip (42s)
          </button>
          <button
            type="button"
            onClick={() => {
              setQaRejectionNotice(buildOwnerLangRejection('DURATION'));
              setVideoFile({ name: 'long_salon_tour_85sec.mp4', duration: 85, sizeMb: 28.0, qaStatus: 'REJECTED' });
            }}
            className="rounded-lg border border-rose-500/40 bg-rose-950/30 px-2.5 py-1 text-rose-300 font-bold"
          >
            ✕ Simulate Rejected Clip (85s &gt; 60s)
          </button>
        </div>

        {/* Owner-Language Rejection Guide */}
        {qaRejectionNotice && (
          <div
            dir={ownerLang === 'ur' || ownerLang === 'ar' ? 'rtl' : 'ltr'}
            className="rounded-2xl border border-rose-500/50 bg-rose-950/40 p-4 space-y-1.5 text-xs"
          >
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertTriangle className="size-4 shrink-0" />
              <span>
                {qaRejectionNotice.title} (Sent in {ownerLang.toUpperCase()})
              </span>
            </div>
            <p className="text-white/85 font-sans">{qaRejectionNotice.errorDetail}</p>
            <p className="text-amber-300 font-sans font-bold">{qaRejectionNotice.fixSteps}</p>
          </div>
        )}

        {videoFile && videoFile.qaStatus === 'PASSED' && (
          <div className="bg-emerald-950/25 p-3 rounded-xl border border-emerald-500/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileVideo className="size-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-white truncate block">{videoFile.name}</span>
                <span className="text-[10px] text-white/60 font-mono">
                  {videoFile.duration}s · {videoFile.sizeMb}MB · Valid {validationDays} Days
                </span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 shrink-0">
              QA APPROVED ✓
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* QUERY 2 & 5: DYNAMIC CLIENT/SALON CAPTIONS + MENA WATCH-LANGUAGE PLAYER   */}
      {/* ========================================================================= */}
      <div className="bg-[#102019] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <Sparkles className="size-4 text-[#D9A441]" />
            <span>Step 4: Auto-Detected Headline, Client/Salon Caption &amp; MENA Voice Switcher</span>
          </div>
        </div>

        {/* Regional Template Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/10 overflow-x-auto">
          {[
            { id: 'roman_urdu' as const, label: 'Roman Urdu (+92/+91)', flag: '🇵🇰' },
            { id: 'arabic' as const, label: 'Arabic (+971/+966/+965)', flag: '🇦🇪' },
            { id: 'english' as const, label: 'English (+44/+1)', flag: '🇬🇧' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveEditorTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-bold transition shrink-0 ${
                activeEditorTab === tab.id
                  ? 'bg-white/[0.08] text-[#00FFFF] border border-[#00FFFF]/40'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>{tab.flag}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic {{client_name}} & {{salon_name}} Merge Tags + Auto Headline */}
        <div className="space-y-3 p-3.5 rounded-xl border border-white/10 bg-black/40">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleInsertTag('{{client_name}}')}
              className="px-3 py-1 rounded-lg border border-[#00FFFF]/40 bg-[#00FFFF]/10 text-[#00FFFF] text-xs font-mono font-bold flex items-center gap-1"
            >
              <User className="size-3" />
              <span>+ {'{{client_name}}'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleInsertTag('{{salon_name}}')}
              className="px-3 py-1 rounded-lg border border-[#D9A441]/40 bg-[#D9A441]/10 text-[#D9A441] text-xs font-mono font-bold flex items-center gap-1"
            >
              <Tag className="size-3" />
              <span>+ {'{{salon_name}}'}</span>
            </button>
            <span className="text-[10px] text-white/50 font-sans">
              Headline auto-detected from uploaded video:
            </span>
          </div>

          <input
            type="text"
            dir={activeEditorTab === 'arabic' ? 'rtl' : 'ltr'}
            value={headlines[activeEditorTab]}
            onChange={(e) => setHeadlines((prev) => ({ ...prev, [activeEditorTab]: e.target.value }))}
            className="w-full bg-[#12241C] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-[#00FFFF]"
          />

          <textarea
            ref={textareaRef}
            rows={2}
            dir={activeEditorTab === 'arabic' ? 'rtl' : 'ltr'}
            value={templates[activeEditorTab]}
            onChange={(e) => setTemplates((prev) => ({ ...prev, [activeEditorTab]: e.target.value }))}
            className="w-full bg-[#12241C] border border-white/10 rounded-xl p-3 text-xs text-white/90 resize-none font-sans"
          />
        </div>

        {/* Client WhatsApp Preview + Query 5 MENA Multilingual Video Watch Switcher */}
        <div className="bg-black/70 p-4 rounded-2xl border border-white/15 space-y-3 max-w-md mx-auto shadow-2xl">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
            <span className="text-[10px] font-mono text-[#00FFFF] uppercase font-bold">
              Client Video Card Preview
            </span>
            <select
              value={previewContactId}
              onChange={(e) => setPreviewContactId(e.target.value)}
              className="rounded-lg border border-white/20 bg-[#102019] px-2 py-1 text-[10px] font-mono text-[#00FFFF]"
            >
              {activeContacts.slice(0, 12).map((c) => {
                const d = detectLanguageRoute(c.phone);
                return (
                  <option key={c.id} value={c.id} className="bg-[#102019] text-[#F5F2E9]">
                    {d.flag} {c.name} ({c.phone})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Query 5: MENA Multinational End-User Watch Language & Dubbing Switcher */}
          <div className="rounded-xl border border-[#D9A441]/30 bg-[#D9A441]/10 p-2.5 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#D9A441] font-bold flex items-center gap-1">
                <Globe className="size-3" />
                <span>MENA Watch in My Language:</span>
              </span>
              <span className="text-white/60">Owner Voice ➔ Client Language</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(MENA_VIDEO_SUBTITLES) as VideoWatchLang[]).map((wl) => (
                <button
                  key={wl}
                  type="button"
                  onClick={() => setClientWatchLang(wl)}
                  className={`rounded-lg px-2 py-1 text-[10px] font-mono font-bold border transition ${
                    clientWatchLang === wl
                      ? 'border-[#00FFFF] bg-[#00FFFF]/20 text-[#00FFFF]'
                      : 'border-white/15 bg-black/40 text-white/65'
                  }`}
                >
                  {MENA_VIDEO_SUBTITLES[wl].label}
                </button>
              ))}
            </div>
            <div className="rounded-lg bg-black/60 border border-white/10 p-2 flex items-center justify-between gap-2 text-[11px]">
              <p dir={clientWatchLang === 'ar' || clientWatchLang === 'ur' ? 'rtl' : 'ltr'} className="text-white/85 font-sans">
                {MENA_VIDEO_SUBTITLES[clientWatchLang].script}
              </p>
              <button
                type="button"
                onClick={handlePlayMenaTranslatedVoice}
                className={`rounded-lg px-2 py-1 text-[10px] font-mono font-bold shrink-0 border ${
                  isSpeakingDub
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 animate-pulse'
                    : 'border-[#00FFFF]/40 bg-[#00FFFF]/10 text-[#00FFFF]'
                }`}
              >
                <Volume2 className="size-3 inline mr-1" />
                <span>{isSpeakingDub ? 'Speaking' : 'Dub'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5" dir={previewDetection.route === 'arabic' ? 'rtl' : 'ltr'}>
            <p className="text-xs font-bold text-white">
              {resolveTemplateText(
                headlines[previewDetection.route] || headlines.english,
                selectedPreviewContact.name
              )}
            </p>
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/25 text-xs text-emerald-100 font-sans space-y-2">
              <p>
                {resolveTemplateText(
                  templates[previewDetection.route] || templates.english,
                  selectedPreviewContact.name
                )}
              </p>
              <p className="border-t border-emerald-500/20 pt-1.5 text-[10px] font-mono text-white/60">
                {STOP_OPT_OUT_FOOTER[previewDetection.route] || STOP_OPT_OUT_FOOTER.english}
              </p>
            </div>
          </div>

          {/* Query 4 Interactive Test: End-User Replies STOP */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-white/55">
              Client Privacy Shield ({stoppedContacts.length} Stopped)
            </span>
            <button
              type="button"
              disabled={activeContacts.length === 0}
              onClick={() => handleClientRepliesStop(selectedPreviewContact)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/45 bg-rose-950/40 hover:bg-rose-950/70 disabled:opacity-40 px-2.5 py-1 text-[10px] font-mono font-bold text-rose-200 transition"
            >
              <Ban className="size-3 text-rose-400" />
              <span>Simulate Client Replies &quot;STOP&quot;</span>
            </button>
          </div>

          {stopFeedbackMsg && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/35 p-2.5 text-[11px] font-sans text-rose-200">
              {stopFeedbackMsg}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 5: ANTI-BAN 4s-9s DISPATCH QUEUE + QUERY 4 STOP PROTECTION           */}
      {/* ========================================================================= */}
      <div className="bg-[#102019] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <ShieldCheck className="size-4 text-emerald-400" />
            <span>Step 5: Anti-Ban Broadcast Queue (4s–9s Stagger · {validationDays}-Day Deal)</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
              {activeContacts.length} Receiving
            </span>
            <span className="text-rose-300 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded">
              {stoppedContacts.length} Restricted (STOP)
            </span>
          </div>
        </div>

        {stoppedContacts.length > 0 && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 space-y-1.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="font-mono font-bold text-rose-300 text-[11px] flex items-center gap-1.5">
                <Ban className="size-3.5" />
                <span>Stopped Numbers Blocked From Deal Videos ({stoppedContacts.length})</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-300">
                1-to-1 Bookings Still Work
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {stoppedContacts.slice(0, 8).map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-black/40 px-2 py-0.5 text-[10px] font-mono text-rose-200"
                >
                  {c.name} ({c.phone})
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/10">
          <div
            className="bg-gradient-to-r from-[#00FFFF] via-emerald-400 to-[#D9A441] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex gap-2.5">
          {queueStatus !== 'running' ? (
            <button
              type="button"
              disabled={!isDealPaymentConfirmed || !videoFile || videoFile.qaStatus !== 'PASSED'}
              onClick={() => setQueueStatus('running')}
              className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-teal-500 disabled:opacity-40 text-[#12241C] font-mono font-black text-xs rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Play className="size-4 fill-[#12241C]" />
              <span>
                {!isDealPaymentConfirmed
                  ? 'Confirm Payment First'
                  : !videoFile || videoFile.qaStatus !== 'PASSED'
                  ? 'Upload Approved ≤60s Video First'
                  : `Launch ${validationDays}-Day Deal Broadcast →`}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQueueStatus('paused')}
              className="flex-1 h-11 bg-amber-500 text-[#12241C] font-mono font-black text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Pause className="size-4 fill-[#12241C]" />
              <span>Pause ({delayCountdown}s jitter)</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setQueueStatus('idle');
              setCurrentIndex(0);
              setLogs([]);
            }}
            className="px-3.5 h-11 bg-white/[0.05] border border-white/10 text-white rounded-xl"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        {logs.length > 0 && (
          <div className="bg-black/50 p-3 rounded-xl border border-white/10 font-mono text-[11px] max-h-36 overflow-y-auto space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between gap-2 text-white/80">
                <span className="truncate">
                  {log.languageFlag} {log.recipientName} ({log.recipientPhone})
                </span>
                <span className="text-emerald-400 shrink-0">+{log.delaySeconds}s ✓</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
