import React, { useState, useMemo } from 'react';
import {
  Download,
  CheckCircle2,
  QrCode,
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Check,
  Plus,
  Video,
  Clock,
  Upload,
  PhoneCall,
  AlertOctagon,
  Sparkle,
  Sliders,
  Lock,
  Globe,
  Languages,
  X,
} from 'lucide-react';
import { PortalCard } from './PortalCard';
import { SalonOwnerDashboard } from './SalonOwnerDashboard';
import { ServiceItem } from '../types/workcraft';

export type SalonLanguage = 'URDU' | 'ARABIC' | 'ROMAN_URDU' | 'ENGLISH';
export type RegionalTier = 'PAKISTAN' | 'MENA' | 'EUROPE_GLOBAL';

export const detectRegionalTier = (regionCode: string): RegionalTier => {
  if (regionCode === '+92') return 'PAKISTAN';
  if (regionCode === '+971' || regionCode === '+966') return 'MENA';
  if (regionCode === '+44' || regionCode === '+1') return 'EUROPE_GLOBAL';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('Karachi') || tz.includes('Pakistan')) return 'PAKISTAN';
    if (tz.includes('Dubai') || tz.includes('Riyadh') || tz.includes('Qatar') || tz.includes('Kuwait')) return 'MENA';
    if (tz.includes('London') || tz.includes('Europe') || tz.includes('America')) return 'EUROPE_GLOBAL';
  } catch (e) {
    // default
  }
  return 'PAKISTAN';
};

interface SalonPwaSimulatorProps {
  salonName?: string;
  token?: string;
  onPairingComplete: (salonName: string) => void;
  onClose?: () => void;
}

export const SalonPwaSimulator: React.FC<SalonPwaSimulatorProps> = ({
  salonName = 'Royal Fade Lounge',
  token = 'wc_sec_rfade_9821',
  onPairingComplete,
  onClose,
}) => {
  // 3-Tier Regional Language Engine (Pakistan vs MENA vs Europe/Global)
  const [selectedRegion, setSelectedRegion] = useState<'+92' | '+971' | '+44' | '+91'>('+92');
  const [regionalTier, setRegionalTier] = useState<RegionalTier>(() => detectRegionalTier('+92'));
  const [selectedLanguage, setSelectedLanguage] = useState<SalonLanguage>('URDU');
  const [isLanguageGateOpen, setIsLanguageGateOpen] = useState(true);

  const handleSwitchRegion = (newRegion: '+92' | '+971' | '+44') => {
    setSelectedRegion(newRegion);
    const newTier = detectRegionalTier(newRegion);
    setRegionalTier(newTier);
    if (newTier === 'PAKISTAN') {
      setSelectedLanguage('URDU');
    } else if (newTier === 'MENA') {
      setSelectedLanguage('ARABIC');
    } else {
      setSelectedLanguage('ENGLISH');
    }
  };

  // PWA Step State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Install PWA, 2: Menu Setup, 3: Localized Payment, 4: QR Pairing
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [isDashboardLaunched, setIsDashboardLaunched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'MENS' | 'LADIES'>('MENS');

  // Pre-populated Service Menus
  const [mensServices, setMensServices] = useState<ServiceItem[]>([
    { id: 'm1', name: 'Classic Hair Cut & Wash', price: 800, enabled: true },
    { id: 'm2', name: 'Beard Trim & Contouring', price: 400, enabled: true },
    { id: 'm3', name: 'Charcoal Deep Cleansing Facial', price: 2000, enabled: true },
    { id: 'm4', name: 'Hair Color / Camo', price: 1500, enabled: true },
    { id: 'm5', name: 'Head Massage (Mint Oil)', price: 500, enabled: false },
    { id: 'm6', name: 'Groom Signature Package', price: 12000, enabled: true },
  ]);

  const [ladiesServices, setLadiesServices] = useState<ServiceItem[]>([
    { id: 'l1', name: 'Signature Party Makeup & Styling', price: 4500, enabled: true },
    { id: 'l2', name: 'Barat / Walima Bridal Package', price: 35000, enabled: true },
    { id: 'l3', name: 'Hydra-Facial & Skin Polish', price: 3500, enabled: true },
    { id: 'l4', name: 'Keratin Hair Rebonding / Smoothing', price: 12000, enabled: true },
    { id: 'l5', name: 'Mani-Pedi Classic Spa', price: 2000, enabled: false },
    { id: 'l6', name: 'Full Face Threading & Waxing', price: 1200, enabled: true },
  ]);

  // Regional Payment State
  const [paymentMethod, setPaymentMethod] = useState('EasyPaisa');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  // Custom Service Add State
  const [isAddingService, setIsAddingService] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('1500');

  // Remote 8-Digit WhatsApp Pairing vs In-Person QR State
  const [pairingMode, setPairingMode] = useState<'REMOTE_CODE' | 'VISUAL_QR'>('REMOTE_CODE');
  const [pairingCode] = useState('WKC-7921');
  const [enteredCode, setEnteredCode] = useState('WKC-7921');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isHomeShortcutInstalled, setIsHomeShortcutInstalled] = useState(false);

  // 7-Day Free Trial & First-Time Initial Purchase Package State
  const [trialMode, setTrialMode] = useState<'EXPIRED_DAY8' | 'ACTIVE_TRIAL'>('EXPIRED_DAY8');
  const [selectedPackageTier, setSelectedPackageTier] = useState<'STARTER' | 'GROWTH' | 'VIP' | 'CUSTOM'>('GROWTH');
  const [isTestingSandboxUnlocked, setIsTestingSandboxUnlocked] = useState(true);

  const PACKAGES = [
    {
      id: 'STARTER',
      name: 'Starter Setup',
      setupPrice: 15000,
      monthlyMaint: 1500, // 10%
      setupPriceUsd: 75,
      monthlyMaintUsd: 7.5, // 10%
      maintFormula: '10% of Setup (PKR 1,500/mo or $7.50/mo)',
      bookingsLimit: '500 bookings/mo',
      description: 'Single WhatsApp SIM Gateway · WhatsApp Auto-Reply Concierge · Up to 500 bookings/mo',
      badge: 'ENTRY LEVEL',
    },
    {
      id: 'GROWTH',
      name: 'Growth Automation',
      setupPrice: 20000,
      monthlyMaint: 2000, // 10%
      setupPriceUsd: 110,
      monthlyMaintUsd: 11.0, // 10%
      maintFormula: '10% of Setup (PKR 2,000/mo or $11.00/mo)',
      bookingsLimit: '1,500 bookings/mo',
      description: 'Dual SIM Hot-Swap · WhatsApp Auto-Reply + Google 5-Star Review Booster · Up to 1,500 bookings/mo',
      badge: 'RECOMMENDED',
    },
    {
      id: 'VIP',
      name: 'VIP Executive',
      setupPrice: 25000,
      monthlyMaint: 2500, // 10%
      setupPriceUsd: 160,
      monthlyMaintUsd: 16.0, // 10%
      maintFormula: '10% of Setup (PKR 2,500/mo or $16.00/mo)',
      bookingsLimit: '3,000 bookings/mo',
      description: 'Single purchase unlocks Video Upload Feature · WhatsApp Auto-Reply + Google Reviews · Video Deals (1 @ 1,500 or 4 @ 4,000/mo)',
      badge: 'ALL INCLUSIVE',
    },
    {
      id: 'CUSTOM',
      name: 'Custom Enterprise',
      setupPrice: 35000,
      monthlyMaint: 3500, // 10%
      setupPriceUsd: 250,
      monthlyMaintUsd: 25.0, // 10%
      maintFormula: '10% Formula on Custom Quote ($25.00/mo)',
      bookingsLimit: '> 3,000 bookings / Multi-Branch',
      description: 'Multi-Branch Chains · Dedicated SIM Rack · Video Upload Unlocked (1 to 4/mo or weekly pacing)',
      badge: 'MULTI-BRANCH',
    },
  ];

  const currentPackagePrice = PACKAGES.find((p) => p.id === selectedPackageTier)?.setupPrice || 20000;
  const currentPackage = PACKAGES.find((p) => p.id === selectedPackageTier) || PACKAGES[1];

  // Multilingual Copy Dictionary
  const T = {
    URDU: {
      langName: 'اردو',
      flag: '🇵🇰',
      headerTitle: `${salonName} · سیلون آن بورڈنگ پورٹل`,
      tagline: 'واٹس ایپ خودکار بکنگ اور ڈیجیٹل سیلون مینجمنٹ',
      step1: '1. ایپ انسٹال کریں',
      step2: '2. سروسز اور ریٹ لسٹ',
      step3: '3. پیکج اور 10% مینٹیننس',
      step4: '4. واٹس ایپ جوڑیں',
      installTitle: 'موبائل اسکرین پر ورک کرافٹ ایپ محفوظ کریں',
      installDesc: 'ایپ اسٹور یا پلے اسٹور کے بغیر فوری انسٹال۔ سیلون کے ٹیبلٹ یا موبائل پر 1-ٹیپ میں تیز رفتار پروگریسو ایپ چلتی ہے۔',
      installBtn: isPwaInstalled ? 'انسٹالیشن مکمل ہوگئی ✓' : '1-ٹیپ میں موبائل اسکرین پر شامل کریں',
      menuTitle: 'کاروباری کیٹیگری اور سروسز کی ریٹ لسٹ',
      menuDesc: 'مینس یا لیڈیز کیٹیگری منتخب کریں۔ اپنی سروسز کے ریٹ درج کریں، واٹس ایپ بوٹ خود بخود اردو اور انگلش میں یہی قیمتیں گاہک کو بتائے گا۔',
      mensTab: "مینس باربر / سیلون",
      ladiesTab: "لیڈیز پارلر / بیوٹی لاؤنج",
      addService: "+ نئی کسٹم سروس شامل کریں",
      saveMenuBtn: "ریٹ لسٹ محفوظ کریں اور ادائیگی پر جائیں →",
      payTitle: 'پیکج کا انتخاب اور 10 فیصد ماہانہ مینٹیننس فیس',
      payDesc: 'اپنے سیلون کے حجم کے مطابق پیکج منتخب کریں۔ ماہانہ مینٹیننس فیس ٹھیک 10 فیصد ہوگی جو خودکار طریقے سے ادا ہوگی۔',
      maintHighlight: '10% ماہانہ مینٹیننس کیوں ضروری ہے؟',
      maintExplain: '10% ماہانہ فیس آپ کے واٹس ایپ آٹو ریپلائی کو 24 گھنٹے فعال رکھتی ہے اور کسی بھی خرابی پر 60 منٹ کے اندر فنی مدد فراہم کرتی ہے۔ فیلڈ ایجنٹ مینٹیننس کیش نہیں لیتا، ادائیگی صرف ڈیجیٹل ہوگی۔',
      payBtn: 'ادائیگی تصدیق کریں اور کیو آر اسکین پر جائیں →',
      pairTitle: 'سیلون کا واٹس ایپ منسلک کریں (کیو آر کوڈ اسکین)',
      pairDesc: 'اپنے سیلون کے موبائل میں واٹس ایپ کھولیں ➔ تھری ڈاٹس پر ٹیپ کریں ➔ Linked Devices ➔ Link a Device دبائیں اور اس کیو آر کوڈ کو اسکین کریں۔',
      scanSimulate: 'سیلون واٹس ایپ اسکین کی تصدیق کریں →',
      pairSuccess: 'ماشاءاللہ! واٹس ایپ کنکشن کامیابی سے جڑ گیا!',
      pairSuccessDesc: 'اب آپ کا سیلون ورک کرافٹ کلاؤڈ گیٹ وے پر آن لائن ہے۔ گاہکوں کے پیغامات کا خودکار جواب فوری طور پر شروع ہو چکا ہے۔',
      finishBtn: 'سیلون پورٹل مکمل کریں',
    },
    ARABIC: {
      langName: 'العربية',
      flag: '🇦🇪',
      headerTitle: `${salonName} · بوابة صالون وورك كرافت`,
      tagline: 'نظام حجز واتساب التلقائي وإدارة الصالون',
      step1: '1. تثبيت التطبيق',
      step2: '2. قائمة الخدمات',
      step3: '3. الباقة والصيانة 10%',
      step4: '4. ربط واتساب',
      installTitle: 'إضافة تطبيق وورك كرافت للشاشة الرئيسية بنقرة واحدة',
      installDesc: 'تطبيق ويب تقدمي سريع يعمل مباشرة دون الحاجة لمتجر التطبيقات أو تنزيلات بطيئة.',
      installBtn: isPwaInstalled ? 'تم التثبيت بنجاح ✓' : 'تثبيت بنقرة واحدة على الشاشة',
      menuTitle: 'اختيار فئة الصالون وقائمة الخدمات والأسعار',
      menuDesc: 'حدد فئة الصالون وأدخل أسعار الخدمات. يتعلم روبوت واتساب الأسعار المحددة تلقائيًا.',
      mensTab: "صالون حلاقة رجالي",
      ladiesTab: "صالون وسبا نسائي",
      addService: "+ إضافة خدمة مخصصة",
      saveMenuBtn: "حفظ القائمة والمتابعة للدفع →",
      payTitle: 'اختيار الباقة ورسوم الصيانة الشهرية (10%)',
      payDesc: 'اختر الباقة المناسبة لصالونك. تبلغ رسوم الصيانة الشهرية 10% فقط من سعر الباقة.',
      maintHighlight: 'لماذا رسوم الصيانة الشهرية 10%؟',
      maintExplain: 'تضمن رسوم الصيانة 10% استمرار الرد الآلي على واتساب على مدار الساعة وحل أي مشكلة تقنية خلال أقل من 60 دقيقة.',
      payBtn: 'تأكيد الدفع والانتقال لمسح كود QR →',
      pairTitle: 'ربط واتساب الصالون عبر رمز الاستجابة السريعة QR',
      pairDesc: 'افتح واتساب على هاتف الصالون ➔ الأجهزة المرتبطة ➔ ربط جهاز ➔ امسح رمز QR الظاهر أمامك.',
      scanSimulate: 'محاكاة مسح رمز QR على واتساب →',
      pairSuccess: 'تم ربط واتساب الصالون بنجاح!',
      pairSuccessDesc: 'صالونك متصل الآن بالشبكة السحابية، وبدأ الرد الآلي على استفسارات وحجوزات العملاء فوراً.',
      finishBtn: 'إتمام الإعداد والدخول للوحة التحكم',
    },
    ROMAN_URDU: {
      langName: 'Roman Urdu',
      flag: '💬',
      headerTitle: `${salonName} · Salon Onboarding Portal`,
      tagline: 'WhatsApp auto-reply booking aur digital management',
      step1: '1. App Install',
      step2: '2. Services & Menu',
      step3: '3. Package & 10% Maint',
      step4: '4. WhatsApp Pairing',
      installTitle: 'Mobile Home Screen par WORKCRAFT app add karein',
      installDesc: 'Play Store ya APK download ke baghair foran install. Salon ke phone ya tablet par 1-tap mein high speed app chalti hai.',
      installBtn: isPwaInstalled ? 'Installation Mukammal ✓' : '1-Tap Install to Home Screen',
      menuTitle: 'Salon Category aur Services ki Rate List',
      menuDesc: "Men's ya Ladies category select karein aur services ke rates set karein. WhatsApp bot khud ba khud Roman Urdu aur English mein customer ko yehi prices bataye ga.",
      mensTab: "Men's Barber / Grooming",
      ladiesTab: "Ladies' Parlor / Lounge",
      addService: '+ Add Custom Service to Menu',
      saveMenuBtn: 'Save Menu & Proceed to Payment →',
      payTitle: 'Package Selection & 10% Monthly Maintenance',
      payDesc: 'Apne salon ke mutabiq package select karein. Monthly maintenance theek 10% hogi jo digital self-pay hogi.',
      maintHighlight: '10% Monthly Maintenance kyun zaroori hai?',
      maintExplain: '10% monthly maintenance fee aap ke WhatsApp auto-reply ko 24 ghantay active rakhti hai aur kisi bhi maslay par 60 min mein technical recovery deti hai. Field agent cash nahi leta.',
      payBtn: 'Confirm Payment & Launch QR Scan →',
      pairTitle: 'Salon ka WhatsApp Jorain (QR Code Scan)',
      pairDesc: 'Salon ke mobile mein WhatsApp kholein ➔ Linked Devices ➔ Link a Device dabayein aur is QR code ko scan karein.',
      scanSimulate: 'Simulate WhatsApp QR Scan →',
      pairSuccess: 'MashaAllah! WhatsApp Connection Kamyab!',
      pairSuccessDesc: 'Aap ka salon ab WORKCRAFT cloud par live hai. Customer bookings ka auto-reply shuru ho chuka hai.',
      finishBtn: 'Complete Onboarding & Enter Portal',
    },
    ENGLISH: {
      langName: 'English',
      flag: '🇬🇧',
      headerTitle: `${salonName} · Direct Owner Portal`,
      tagline: 'Autonomous WhatsApp booking concierge & salon management',
      step1: '1. Install PWA',
      step2: '2. Service Menu',
      step3: '3. Package & 10% Maint',
      step4: '4. Pair WhatsApp',
      installTitle: 'Add WORKCRAFT to Mobile Home Screen',
      installDesc: 'No App Store or Play Store downloads needed. High-speed progressive web app with offline client holding capabilities.',
      installBtn: isPwaInstalled ? 'Installation Complete ✓' : '1-Tap Install to Home Screen',
      menuTitle: 'Business Category & Local Service Menu',
      menuDesc: 'Select your salon category and verify your service rates. The AI concierge automatically uses these exact prices.',
      mensTab: "Men's Barber / Grooming",
      ladiesTab: "Ladies' Parlor / Lounge",
      addService: '+ Add Custom Service to Menu',
      saveMenuBtn: 'Save Menu & Proceed to Payment →',
      payTitle: 'Initial Package Purchase & 10% Maintenance Engine',
      payDesc: 'Select the package tier suited for your salon volume. Monthly recurring maintenance is strictly 10% of package setup fee.',
      maintHighlight: 'Why the 10% Monthly Maintenance SLA Matters',
      maintExplain: 'The 10% monthly maintenance fee guarantees 24/7 continuous WhatsApp auto-reply, free menu updates, and recovery in under 60 minutes. Field agents never collect cash.',
      payBtn: 'Confirm Payment & Launch QR Handshake →',
      pairTitle: 'Multi-Device WhatsApp Terminal Pairing',
      pairDesc: 'Open WhatsApp on your salon phone ➔ Linked Devices ➔ Link a Device and scan the QR code below in under 5 seconds.',
      scanSimulate: 'Simulate Salon WhatsApp QR Scan →',
      pairSuccess: 'Pairing Handshake 100% Successful!',
      pairSuccessDesc: 'Your salon is now live on the WORKCRAFT SIM Gateway cluster. Customer auto-replies and booking holding queues are active.',
      finishBtn: 'Complete Onboarding & Enter Portal',
    },
  }[selectedLanguage];

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const item: ServiceItem = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      price: parseInt(customPrice, 10) || 1000,
      enabled: true,
    };
    if (selectedCategory === 'MENS') {
      setMensServices((prev) => [...prev, item]);
    } else {
      setLadiesServices((prev) => [...prev, item]);
    }
    setCustomName('');
    setCustomPrice('1500');
    setIsAddingService(false);
  };

  const handleToggleService = (id: string, isMens: boolean) => {
    if (isMens) {
      setMensServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
      );
    } else {
      setLadiesServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
      );
    }
  };

  const handleChangePrice = (id: string, price: number, isMens: boolean) => {
    if (isMens) {
      setMensServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, price } : s))
      );
    } else {
      setLadiesServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, price } : s))
      );
    }
  };

  const handleInstallPwa = () => {
    setIsPwaInstalled(true);
    setTimeout(() => setStep(2), 600);
  };

  const handleConfirmPayment = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setIsPaymentConfirmed(true);
      setStep(4);
      onPairingComplete(salonName);
    }, 1200);
  };

  const activeServices = selectedCategory === 'MENS' ? mensServices : ladiesServices;

  // 3-Tier Dynamic Regional Language Sets
  const regionalLanguages = useMemo(() => {
    if (regionalTier === 'PAKISTAN') {
      return [
        {
          id: 'URDU' as const,
          label: 'اردو (Urdu)',
          flag: '🇵🇰',
          badge: 'سیلون مالکان کے لیے آسان اردو',
          desc: 'واٹس ایپ خودکار بکنگ، ریٹ لسٹ اور 10% مینٹیننس سیٹ اپ',
        },
        {
          id: 'ROMAN_URDU' as const,
          label: 'Roman Urdu',
          flag: '💬',
          badge: 'Aasan Roman Urdu',
          desc: 'Mobile par aasan WhatsApp booking aur service setup',
        },
        {
          id: 'ENGLISH' as const,
          label: 'English',
          flag: '🇬🇧',
          badge: 'Official English',
          desc: 'Complete salon concierge setup in standard English',
        },
      ];
    }
    if (regionalTier === 'MENA') {
      return [
        {
          id: 'ARABIC' as const,
          label: 'العربية (Arabic)',
          flag: '🇦🇪',
          badge: 'الواجهة العربية الميسرة للخليج',
          desc: 'إعداد حجز واتساب التلقائي وقائمة الخدمات للصالونات في دول الخليج',
        },
        {
          id: 'ENGLISH' as const,
          label: 'English',
          flag: '🇬🇧',
          badge: 'International Standard',
          desc: 'Direct multi-currency salon setup in standard English',
        },
      ];
    }
    // EUROPE_GLOBAL
    return [
      {
        id: 'ENGLISH' as const,
        label: 'English',
        flag: '🇬🇧',
        badge: 'Global Standard',
        desc: 'Autonomous WhatsApp booking concierge & terminal multi-device sync',
      },
    ];
  }, [regionalTier]);

  const regionGateMeta = {
    PAKISTAN: {
      badge: '🇵🇰 PAKISTAN MARKET · AUTO-DETECTED (+92)',
      greeting: 'Assalamu Alaikum · Welcome',
      urduSub: 'سیلون آن بورڈنگ کے لیے اپنی زبان منتخب کریں',
      subDesc: 'آسان اردو، رومن اردو یا انگلش میں خودکار واٹس ایپ سیٹ اپ مکمل کریں',
    },
    MENA: {
      badge: '🇦🇪 MENA / GULF REGION · AUTO-DETECTED (+971 / +966)',
      greeting: 'مرحبًا بكم · Welcome',
      urduSub: 'اختر لغتك المفضلة لبدء إعداد صالونك',
      subDesc: 'الواجهة العربية المخصصة لدول مجلس التعاون أو الإنجليزية الدولية',
    },
    EUROPE_GLOBAL: {
      badge: '🇬🇧 EUROPE & GLOBAL · AUTO-DETECTED (+44 / +1)',
      greeting: 'Welcome to WORKCRAFT',
      urduSub: 'Autonomous Salon Concierge Onboarding',
      subDesc: 'Direct WhatsApp multi-device gateway setup in international English',
    },
  }[regionalTier];

  if (isDashboardLaunched) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
          <span className="text-[#00FFFF] font-bold">💈 SALON OWNER MOBILE APP · ACTIVE TERMINAL</span>
          <button
            type="button"
            onClick={() => setIsDashboardLaunched(false)}
            className="text-white/50 hover:text-white underline text-[11px]"
          >
            ← Back to Onboarding Steps
          </button>
        </div>
        <SalonOwnerDashboard salonName={salonName} onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto relative">
      {/* ========================================================================= */}
      {/* 1. SOCIAL MEDIA & PUBLIC ONBOARDING GREETING & 3-TIER REGIONAL GATE       */}
      {/*    Pakistan: Urdu / Roman Urdu / English                                  */}
      {/*    MENA: Arabic / English                                                 */}
      {/*    Europe / Global: English                                               */}
      {/* ========================================================================= */}
      {isLanguageGateOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/85 p-3 sm:p-5 backdrop-blur-md overflow-y-auto">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[520px] rounded-3xl border border-[#D9A441]/40 bg-[#102019] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6 relative"
          >
            {/* Modal Top Close Button */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="text-[10px] font-mono text-white/50 uppercase font-bold">Language Selection / زبان کا انتخاب</span>
              <button
                type="button"
                onClick={() => setIsLanguageGateOpen(false)}
                className="size-8 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 transition active:scale-95"
                title="Close Language Selection"
                aria-label="Close Language Selection"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Quick Regional Market Switcher Bar */}
            <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-black/40 border border-white/10 mb-4">
              <button
                type="button"
                onClick={() => handleSwitchRegion('+92')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold transition flex items-center justify-center gap-1 ${
                  regionalTier === 'PAKISTAN'
                    ? 'bg-[#00FFFF]/20 border border-[#00FFFF]/50 text-[#00FFFF] shadow-[0_0_10px_rgba(0,255,255,0.15)]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>🇵🇰 Pakistan (+92)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchRegion('+971')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold transition flex items-center justify-center gap-1 ${
                  regionalTier === 'MENA'
                    ? 'bg-[#D9A441]/20 border border-[#D9A441]/50 text-[#D9A441] shadow-[0_0_10px_rgba(217,164,65,0.15)]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>🇦🇪 UAE / MENA (+971)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchRegion('+44')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold transition flex items-center justify-center gap-1 ${
                  regionalTier === 'EUROPE_GLOBAL'
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>🇬🇧 Europe / Global (+44)</span>
              </button>
            </div>

            <div className="text-center space-y-1.5 pb-4 border-b border-white/10">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-white/10 px-2.5 py-0.5 mb-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#D9A441]">
                  {regionGateMeta.badge}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {regionGateMeta.greeting}
              </h2>
              <p className="text-xs text-[#00FFFF] font-sans font-medium">
                {regionGateMeta.urduSub}
              </p>
              <p className="text-[11px] text-white/55 font-sans pt-0.5">
                {regionGateMeta.subDesc}
              </p>
            </div>

            {/* Filtered 3-Tier Language Cards */}
            <div className="mt-4 space-y-2.5">
              {regionalLanguages.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(lang.id);
                    setIsLanguageGateOpen(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between group ${
                    selectedLanguage === lang.id
                      ? 'border-[#00FFFF] bg-white/[0.08] shadow-[0_0_15px_rgba(0,255,255,0.15)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-[#00FFFF] transition">
                          {lang.label}
                        </span>
                        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-white/60">
                          {lang.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/55 font-sans mt-0.5">{lang.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-white/40 group-hover:text-[#00FFFF] transition shrink-0" />
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-white/45">
                Region: <strong className="text-white/70">{selectedRegion}</strong> · Language: <strong className="text-[#00FFFF]">{selectedLanguage}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsLanguageGateOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] px-4 py-2 text-xs font-mono font-bold uppercase transition"
              >
                <span>Continue →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIMULATION BANNER HEADER WITH ALWAYS-ACCESSIBLE LANGUAGE SWITCHER */}
      <div className="rounded-2xl border border-white/10 bg-[#102019] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9A441]">
              {T.headerTitle}
            </span>
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] font-mono font-bold text-white/70 border border-white/10">
              Token: {token}
            </span>
          </div>
          <p className="text-xs text-white/60 font-sans mt-0.5">{T.tagline}</p>
        </div>

        {/* Language Switcher Pill + Step Progress */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Quick Language Toggle */}
          <button
            type="button"
            onClick={() => setIsLanguageGateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#00FFFF]/30 bg-[#00FFFF]/10 px-2.5 py-1 text-xs font-mono font-bold text-[#00FFFF] hover:bg-[#00FFFF]/20 transition"
            title="Change Onboarding Language"
          >
            <Globe className="size-3.5" />
            <span>{T.flag} {T.langName}</span>
          </button>

          {/* 4-Step Progress Indicator */}
          <div className="flex items-center gap-1 font-mono text-[10px]">
            {[
              { num: 1, label: T.step1 },
              { num: 2, label: T.step2 },
              { num: 3, label: T.step3 },
              { num: 4, label: T.step4 },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-1 px-2 py-1 rounded-md border ${
                  step === s.num
                    ? 'border-[#00FFFF] bg-white/[0.08] text-[#00FFFF] font-bold'
                    : step > s.num
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/5 text-white/40'
                }`}
              >
                <span>{s.num}.</span>
                <span className="hidden md:inline">{s.label.split('.')[1] || s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: 1-TAP PWA INSTALLATION BANNER */}
      {step === 1 && (
        <PortalCard title={T.step1} kicker="1-TAP MOBILE EXPERIENCE">
          <div className="space-y-5 text-center py-4">
            <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-white/[0.04] border border-white/10 shadow-[0_0_25px_rgba(0,255,255,0.15)]">
              <Smartphone className="size-10 text-[#00FFFF]" />
            </div>

            <div className="max-w-md mx-auto space-y-1.5">
              <h4 className="text-lg font-bold text-[#F5F2E9]">{T.installTitle}</h4>
              <p className="text-xs text-white/55 font-sans leading-relaxed">{T.installDesc}</p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleInstallPwa}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] px-6 py-3.5 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
              >
                <Download className="size-4" />
                <span>{T.installBtn}</span>
              </button>
            </div>

            <p className="text-[10px] font-mono text-white/45">
              Android Chrome · iOS Safari · Samsung Internet
            </p>
          </div>
        </PortalCard>
      )}

      {/* STEP 2: CATEGORY & SERVICE MENU SELECTION */}
      {step === 2 && (
        <PortalCard title={T.step2} kicker="SERVICE MENU">
          <div className="space-y-5">
            <p className="text-xs text-white/55 font-sans leading-relaxed">{T.menuDesc}</p>

            {/* Category Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedCategory('MENS')}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-mono font-bold transition border ${
                  selectedCategory === 'MENS'
                    ? 'border-[#00FFFF] bg-white/[0.08] text-[#00FFFF]'
                    : 'border-white/10 bg-white/[0.02] text-white/55 hover:text-white'
                }`}
              >
                <span>{T.mensTab}</span>
              </button>
              <button
                onClick={() => setSelectedCategory('LADIES')}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-mono font-bold transition border ${
                  selectedCategory === 'LADIES'
                    ? 'border-[#D9A441] bg-white/[0.08] text-[#D9A441]'
                    : 'border-white/10 bg-white/[0.02] text-white/55 hover:text-white'
                }`}
              >
                <span>{T.ladiesTab}</span>
              </button>
            </div>

            {/* Pre-Populated Checklist Rows */}
            <div className="space-y-2.5">
              {activeServices.map((service) => (
                <div
                  key={service.id}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition ${
                    service.enabled
                      ? 'border-white/15 bg-white/[0.04]'
                      : 'border-white/5 bg-black/30 opacity-60'
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                    <input
                      type="checkbox"
                      checked={service.enabled}
                      onChange={() => handleToggleService(service.id, selectedCategory === 'MENS')}
                      className="size-4 rounded border-white/20 bg-black/40 text-[#00FFFF] focus:ring-0"
                    />
                    <span className="text-xs font-bold text-[#F5F2E9]">{service.name}</span>
                  </label>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-white/55">PKR</span>
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) =>
                        handleChangePrice(
                          service.id,
                          parseInt(e.target.value, 10) || 0,
                          selectedCategory === 'MENS'
                        )
                      }
                      className="w-24 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 text-xs font-mono font-bold text-[#D9A441] focus:outline-none focus:border-[#00FFFF]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Service Form */}
            {!isAddingService ? (
              <button
                type="button"
                onClick={() => setIsAddingService(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] py-2.5 text-xs font-mono font-bold text-[#D9A441] hover:border-[#D9A441] hover:bg-white/[0.04] transition"
              >
                <Plus className="size-4" />
                <span>{T.addService}</span>
              </button>
            ) : (
              <form onSubmit={handleAddCustomService} className="rounded-xl border border-[#D9A441]/40 bg-black/40 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#D9A441] uppercase">
                    New Service ({selectedCategory === 'MENS' ? T.mensTab : T.ladiesTab})
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingService(false)}
                    className="text-xs font-mono text-white/50 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono text-white/55 block mb-1">Service Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Keratin Beard Glow or Express Bleach"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[#F5F2E9] focus:outline-none focus:border-[#00FFFF]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/55 block mb-1">Price (PKR)</label>
                    <input
                      type="number"
                      required
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-mono font-bold text-[#D9A441] focus:outline-none focus:border-[#00FFFF]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] px-4 py-2 text-xs font-mono font-bold uppercase transition"
                >
                  Append Service
                </button>
              </form>
            )}

            <button
              onClick={() => setStep(3)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] py-3 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
            >
              <span>{T.saveMenuBtn}</span>
            </button>
          </div>
        </PortalCard>
      )}

      {/* STEP 3: PACKAGE SELECTION & 10% MONTHLY MAINTENANCE */}
      {step === 3 && (
        <PortalCard title={T.payTitle} kicker="10% MAINTENANCE FORMULA">
          <div className="space-y-5">
            <p className="text-xs text-white/55 font-sans leading-relaxed">{T.payDesc}</p>

            {/* 4 Packages Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PACKAGES.map((pkg) => {
                const isSelected = selectedPackageTier === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackageTier(pkg.id as any)}
                    className={`rounded-xl border p-3.5 text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#00FFFF] bg-white/[0.08] ring-1 ring-[#00FFFF]'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#F5F2E9]">{pkg.name}</p>
                        {isSelected && <Check className="size-3.5 text-[#00FFFF]" />}
                      </div>
                      <p className="text-[10px] font-mono font-bold text-[#00FFFF] mt-1">
                        ⚡ {pkg.bookingsLimit}
                      </p>
                      <p className="text-[9px] text-white/55 font-sans mt-1 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-white/10">
                      <span className="text-xs font-mono font-bold text-[#D9A441] block">
                        {regionalTier === 'PAKISTAN'
                          ? `PKR ${pkg.setupPrice.toLocaleString()}`
                          : regionalTier === 'MENA'
                          ? `$${pkg.setupPriceUsd} USD (~${Math.round(pkg.setupPriceUsd * 3.67)} AED)`
                          : `$${pkg.setupPriceUsd} USD (~£${Math.round(pkg.setupPriceUsd * 0.79)})`}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-300 block mt-0.5">
                        {regionalTier === 'PAKISTAN'
                          ? `Maint: PKR ${pkg.monthlyMaint.toLocaleString()} / mo (10%)`
                          : `Maint: $${pkg.monthlyMaintUsd.toFixed(2)} / mo (10%)`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Clear 10% Maintenance Explanation Card */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span>{T.maintHighlight}</span>
                </span>
                <span className="text-xs font-mono text-[#D9A441] font-bold">
                  {regionalTier === 'PAKISTAN'
                    ? `PKR ${currentPackage.monthlyMaint.toLocaleString()} / mo (10%)`
                    : `$${currentPackage.monthlyMaintUsd.toFixed(2)} USD / mo (10%)`}
                </span>
              </div>
              <p className="text-xs text-white/70 font-sans leading-relaxed">{T.maintExplain}</p>
            </div>

            {/* Payment Method Selector */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-white/50 block">
                  Digital Payment Channel:
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">
                  {regionalTier === 'PAKISTAN' ? '🇵🇰 State Bank / Raast Compliant' : '🌐 Stripe Global Gateway'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {(regionalTier === 'PAKISTAN'
                  ? ['EasyPaisa', 'JazzCash', 'Meezan Bank (IBFT)']
                  : regionalTier === 'MENA'
                  ? ['Stripe / Card', 'Bank Wire (IBAN)', 'Apple Pay / Digital']
                  : ['Stripe / Card', 'SEPA / UK Wire', 'Digital Multi-Currency']
                ).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2.5 rounded-lg border text-center transition text-[11px] ${
                      paymentMethod === method
                        ? 'border-[#00FFFF] bg-white/[0.08] text-[#00FFFF] font-bold'
                        : 'border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {/* Query 1: Auto-Detected Self-Serve Recipient Routing */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#00FFFF] font-bold flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-[#00FFFF]" />
                  <span>Routing: SELF_SERVE (Auto-Detected)</span>
                </span>
                <span className="text-white/60 text-[10px]">Direct Owner WhatsApp Alert Only</span>
              </div>
            </div>

            {/* Pay Action */}
            <button
              onClick={handleConfirmPayment}
              disabled={isPaymentProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] py-3.5 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
            >
              {isPaymentProcessing ? (
                <span>Verifying Digital Webhook...</span>
              ) : (
                <>
                  <span>{T.payBtn}</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </PortalCard>
      )}

      {/* STEP 4: TERMINAL MULTI-DEVICE PAIRING (8-DIGIT OTP VS VISUAL QR) */}
      {step === 4 && (
        <PortalCard title={T.pairTitle} kicker="MULTI-DEVICE GATEWAY HANDSHAKE">
          <div className="space-y-5 text-center">
            {/* Pairing Mode Switcher */}
            <div className="flex items-center justify-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setPairingMode('REMOTE_CODE')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                  pairingMode === 'REMOTE_CODE'
                    ? 'bg-[#00FFFF]/20 border border-[#00FFFF]/50 text-[#00FFFF] shadow-[0_0_12px_rgba(0,255,255,0.15)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Smartphone className="size-3.5" />
                <span>8-Digit Code (Single Phone)</span>
              </button>
              <button
                type="button"
                onClick={() => setPairingMode('VISUAL_QR')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                  pairingMode === 'VISUAL_QR'
                    ? 'bg-[#D9A441]/20 border border-[#D9A441]/50 text-[#D9A441] shadow-[0_0_12px_rgba(217,164,65,0.15)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <QrCode className="size-3.5" />
                <span>Visual QR (Agent / Tablet)</span>
              </button>
            </div>

            {/* 1. REMOTE SOLO ONBOARDING: 8-DIGIT WHATSAPP PAIRING CODE */}
            {pairingMode === 'REMOTE_CODE' && (
              <div className="space-y-4 max-w-lg mx-auto text-left animate-in fade-in duration-200">
                <div className="rounded-2xl border border-[#00FFFF]/30 bg-[#00FFFF]/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00FFFF]">
                    <Sparkles className="size-4" />
                    <span>WhatsApp 8-Digit Pairing Code Generated</span>
                  </div>
                  <p className="text-xs text-white/70 font-sans leading-relaxed">
                    Because you are onboarding directly from your mobile phone, you don't need a second screen. Enter this 8-digit code in your WhatsApp Linked Devices to authorize the WORKCRAFT cloud concierge.
                  </p>
                </div>

                {/* 8-Digit Display Card */}
                <div className="rounded-2xl border border-white/10 bg-black/60 p-5 text-center space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-[.2em] text-white/45 block">
                    YOUR SINGLE-USE PAIRING CODE
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-[#00FFFF] drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                    {pairingCode}
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCopiedCode(true);
                        setTimeout(() => setIsCopiedCode(false), 2500);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] px-4 py-2 text-xs font-mono font-bold text-white transition"
                    >
                      {isCopiedCode ? <Check className="size-3.5 text-emerald-400" /> : <Smartphone className="size-3.5 text-[#00FFFF]" />}
                      <span>{isCopiedCode ? 'Copied to Clipboard! ✓' : 'Copy 8-Digit Code'}</span>
                    </button>
                  </div>

                  {/* Query 3: 1:1 Single-Use Node Binding Badge */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-left">
                    <span className="text-[#00FFFF] flex items-center gap-1 font-bold">
                      <ShieldCheck className="size-3 text-[#00FFFF]" />
                      <span>1:1 Single-Salon Binding (Burned on Handshake)</span>
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {isCodeVerified ? '🔥 BURNED & BOUND' : 'ACTIVE'}
                    </span>
                  </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs font-mono space-y-2">
                  <span className="text-[10px] font-bold text-[#D9A441] uppercase block">
                    3-Step Remote Pairing:
                  </span>
                  <ol className="list-decimal list-inside space-y-1.5 text-white/75 font-sans">
                    <li>Open WhatsApp on this mobile phone.</li>
                    <li>Tap <strong>Settings ➔ Linked Devices ➔ Link a Device</strong>.</li>
                    <li>Tap <strong>"Link with phone number instead"</strong> and enter <strong className="text-[#00FFFF]">{pairingCode}</strong>.</li>
                  </ol>
                </div>

                {/* Handshake Verification */}
                <div className="space-y-2 pt-1">
                  {!isCodeVerified ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsVerifyingCode(true);
                        setTimeout(() => {
                          setIsVerifyingCode(false);
                          setIsCodeVerified(true);
                        }, 1200);
                      }}
                      disabled={isVerifyingCode}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00FFFF] hover:bg-[#38e8e8] text-[#12241C] py-3.5 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
                    >
                      {isVerifyingCode ? (
                        <span>Authenticating WhatsApp Handshake...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          <span>Verify 8-Digit Code & Connect Terminal ➔</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 space-y-3 animate-in zoom-in-95">
                      <div className="flex items-center gap-2 text-emerald-300 font-mono font-bold text-xs">
                        <CheckCircle2 className="size-5 text-emerald-400" />
                        <span>MashaAllah! WhatsApp Terminal 100% Paired!</span>
                      </div>
                      <p className="text-xs text-white/70 font-sans leading-relaxed">
                        Your salon's WhatsApp is now connected to WORKCRAFT SIM Gateway cluster. Auto-replies and bookings are live.
                      </p>

                      {/* 1-Tap Mobile Home Screen Pop-up */}
                      <div className="rounded-xl border border-white/15 bg-black/40 p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid size-10 place-items-center rounded-xl bg-[#D9A441] text-[#12241C] font-mono font-black text-sm shrink-0 shadow-md">
                            WC
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">WORKCRAFT Salon Portal</p>
                            <p className="text-[10px] text-white/55 font-sans">
                              {isHomeShortcutInstalled ? 'App icon created on mobile home screen' : '1-Tap shortcut for mobile desktop'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsHomeShortcutInstalled(true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shrink-0 ${
                            isHomeShortcutInstalled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-[#D9A441] text-[#12241C] hover:bg-[#e0b252]'
                          }`}
                        >
                          {isHomeShortcutInstalled ? 'Installed ✓' : 'Install PWA'}
                        </button>
                      </div>

                      {/* Launch Salon Owner Dashboard Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsDashboardLaunched(true);
                          onPairingComplete(salonName);
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#12241C] py-3.5 text-xs font-mono font-black uppercase transition active:scale-95 shadow-lg"
                      >
                        <span>Launch {salonName} Dashboard →</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. IN-PERSON QR SCAN (AGENT TABLET / LAPTOP) */}
            {pairingMode === 'VISUAL_QR' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-xs text-white/55 font-sans leading-relaxed max-w-lg mx-auto">
                  {T.pairDesc}
                </p>

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
                    <rect x="42" y="42" width="16" height="16" fill="#D9A441" rx="3" />
                  </svg>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDashboardLaunched(true);
                      onPairingComplete(salonName);
                    }}
                    className="rounded-xl bg-[#00FFFF] hover:bg-[#38e8e8] text-[#12241C] px-6 py-3 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
                  >
                    {T.finishBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        </PortalCard>
      )}
    </div>
  );
};
