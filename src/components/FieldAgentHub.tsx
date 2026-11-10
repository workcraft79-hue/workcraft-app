import React, { useState } from 'react';
import {
  Smartphone,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  QrCode,
  RotateCcw,
  X,
  Sparkles,
  Wifi,
  Check,
  CreditCard,
  Copy,
  User,
  Fingerprint,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  Scissors,
  Plus,
  Receipt,
  CheckCheck,
  Lock,
  Globe,
  Radio,
  FileCheck,
  Camera,
  Award,
  Ban,
  Power,
  AlertOctagon,
  Flame,
  UserPlus,
  Download,
  Share2,
  FileText,
  Key,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PortalCard } from './PortalCard';
import { AddNewAgentModal } from './AddNewAgentModal';

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
}

interface FieldAgentHubProps {
  onSalonCreated: (salon: { name: string; owner: string; phone: string; location: string; coords: string }) => void;
  onCashCollected?: (amount: number, salonName: string) => void;
  onOpenSalonPwa?: (token: string, salonName: string) => void;
  kamranCashHeld?: number;
  onClose?: () => void;
  initialAutoOpenEnrollment?: boolean;
  initialEnrollAgentData?: {
    id?: string;
    pin?: string;
    name?: string;
    phone?: string;
    city?: string;
  };
  userRole?: 'FOUNDER' | 'FIELD_AGENT';
}

const DEFAULT_MENS_SERVICES: ServiceItem[] = [
  { id: 'm1', name: 'Master Haircut', price: 800, enabled: true },
  { id: 'm2', name: 'Skin Fade Styling', price: 600, enabled: true },
  { id: 'm3', name: 'Beard Sculpt & Line-Up', price: 500, enabled: true },
  { id: 'm4', name: 'Ozone Steam Therapy', price: 400, enabled: true },
  { id: 'm5', name: 'Charcoal Deep Detox Facial', price: 2500, enabled: true },
  { id: 'm6', name: 'Hair Protein & Scalp Massage', price: 1800, enabled: true },
  { id: 'm7', name: 'Hot Towel Royal Shave', price: 500, enabled: true },
  { id: 'm8', name: 'Full Grooming VIP Combo', price: 4500, enabled: true },
];

const DEFAULT_LADIES_SERVICES: ServiceItem[] = [
  { id: 'l1', name: 'Signature Haircut', price: 1500, enabled: true },
  { id: 'l2', name: 'Blowdry & Styling', price: 1000, enabled: true },
  { id: 'l3', name: 'Hydra Glow Cleansing Facial', price: 5000, enabled: true },
  { id: 'l4', name: 'Party Makeup', price: 6000, enabled: true },
  { id: 'l5', name: 'Bridal Hair Styling', price: 3500, enabled: true },
  { id: 'l6', name: 'Keratin Smoothing Treatment', price: 14000, enabled: true },
  { id: 'l7', name: 'Manicure & Pedicure Spa', price: 3500, enabled: true },
  { id: 'l8', name: '24K Gold Glow Facial', price: 6500, enabled: true },
];

export interface CountryConfig {
  code: string;
  name: string;
  currency: 'PKR' | 'USD';
  prefix: string;
  flag: string;
  isDomestic: boolean;
  region: 'PK' | 'EUROPE' | 'MENA' | 'NORTH_AMERICA' | 'GLOBAL';
  dialCode: string;
}

export const detectCountryFromPhone = (phoneStr: string): CountryConfig => {
  const clean = phoneStr.trim();
  if (clean.startsWith('+971')) {
    return { code: 'AE', name: 'UAE (MENA)', currency: 'USD', prefix: '$', flag: '🇦🇪', isDomestic: false, region: 'MENA', dialCode: '+971' };
  }
  if (clean.startsWith('+966')) {
    return { code: 'SA', name: 'Saudi Arabia (MENA)', currency: 'USD', prefix: '$', flag: '🇸🇦', isDomestic: false, region: 'MENA', dialCode: '+966' };
  }
  // Europe Region Prefixes (UK, Germany, France, Italy, Spain, Netherlands, Switzerland, Ireland, etc.)
  if (clean.startsWith('+44')) {
    return { code: 'GB', name: 'United Kingdom (Europe)', currency: 'USD', prefix: '$', flag: '🇬🇧', isDomestic: false, region: 'EUROPE', dialCode: '+44' };
  }
  if (clean.startsWith('+49')) {
    return { code: 'DE', name: 'Germany (Europe / EU)', currency: 'USD', prefix: '$', flag: '🇩🇪', isDomestic: false, region: 'EUROPE', dialCode: '+49' };
  }
  if (clean.startsWith('+33')) {
    return { code: 'FR', name: 'France (Europe / EU)', currency: 'USD', prefix: '$', flag: '🇫🇷', isDomestic: false, region: 'EUROPE', dialCode: '+33' };
  }
  if (clean.startsWith('+39')) {
    return { code: 'IT', name: 'Italy (Europe / EU)', currency: 'USD', prefix: '$', flag: '🇮🇹', isDomestic: false, region: 'EUROPE', dialCode: '+39' };
  }
  if (clean.startsWith('+34')) {
    return { code: 'ES', name: 'Spain (Europe / EU)', currency: 'USD', prefix: '$', flag: '🇪🇸', isDomestic: false, region: 'EUROPE', dialCode: '+34' };
  }
  if (clean.startsWith('+31')) {
    return { code: 'NL', name: 'Netherlands (Europe / EU)', currency: 'USD', prefix: '$', flag: '🇳🇱', isDomestic: false, region: 'EUROPE', dialCode: '+31' };
  }
  if (clean.startsWith('+41')) {
    return { code: 'CH', name: 'Switzerland (Europe)', currency: 'USD', prefix: '$', flag: '🇨🇭', isDomestic: false, region: 'EUROPE', dialCode: '+41' };
  }
  if (clean.startsWith('+353')) {
    return { code: 'IE', name: 'Ireland (Europe / EU)', currency: 'USD', prefix: '$', flag: '🇮🇪', isDomestic: false, region: 'EUROPE', dialCode: '+353' };
  }
  if (clean.startsWith('+1')) {
    return { code: 'US', name: 'USA / North America', currency: 'USD', prefix: '$', flag: '🇺🇸', isDomestic: false, region: 'NORTH_AMERICA', dialCode: '+1' };
  }
  return { code: 'PK', name: 'Pakistan (Domestic Metro)', currency: 'PKR', prefix: 'PKR ', flag: '🇵🇰', isDomestic: true, region: 'PK', dialCode: '+92' };
};

// Regional City Validation Map (Query 1 & 2)
export const REGIONAL_CITY_MAP: Record<string, { country: string; flag: string; cities: string[] }> = {
  PK: { country: 'Pakistan', flag: '🇵🇰', cities: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'] },
  AE: { country: 'United Arab Emirates', flag: '🇦🇪', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain'] },
  SA: { country: 'Saudi Arabia', flag: '🇸🇦', cities: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar', 'Tabuk', 'Taif'] },
  GB: { country: 'United Kingdom', flag: '🇬🇧', cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol'] },
  UK: { country: 'United Kingdom', flag: '🇬🇧', cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol'] },
  DE: { country: 'Germany', flag: '🇩🇪', cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart'] },
  US: { country: 'United States', flag: '🇺🇸', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'San Francisco'] },
  IN: { country: 'India', flag: '🇮🇳', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'] },
};

export const checkCityCountryIntegrity = (city: string, phone: string) => {
  const detected = detectCountryFromPhone(phone);
  const cityClean = city.trim().toLowerCase();
  if (!cityClean) return null;

  // First check if the city belongs to the detected country (e.g. GB or UK for United Kingdom)
  const detectedCountryCities = REGIONAL_CITY_MAP[detected.code]?.cities || [];
  const isLocalCity = detectedCountryCities.some(c => c.toLowerCase() === cityClean || cityClean.includes(c.toLowerCase()) || c.toLowerCase().includes(cityClean));
  if (isLocalCity) {
    return null; // Valid local city, zero conflict
  }

  // Also check alternate codes for the same country (e.g. UK vs GB)
  if (detected.code === 'GB' && REGIONAL_CITY_MAP['UK']?.cities.some(c => c.toLowerCase() === cityClean || cityClean.includes(c.toLowerCase()))) {
    return null;
  }

  // Now check if it belongs to a DIFFERENT country's known city list
  for (const [code, info] of Object.entries(REGIONAL_CITY_MAP)) {
    if (code !== detected.code && !(detected.code === 'GB' && code === 'UK') && !(detected.code === 'UK' && code === 'GB')) {
      const match = info.cities.find(c => c.toLowerCase() === cityClean || cityClean.includes(c.toLowerCase()));
      if (match) {
        return {
          en: `${match} is located in ${info.country} (${info.flag}), not in ${detected.name} (${detected.flag}). Dial code is auto-locked to ${detected.dialCode}.`,
          ur: `${match} ${info.country} (${info.flag}) میں واقع ہے، ${detected.name} (${detected.flag}) میں نہیں۔ ڈائل کوڈ ${detected.dialCode} پر مقفل ہے۔`,
          ar: `مدينة ${match} تقع في ${info.country} (${info.flag}) وليست في ${detected.name} (${detected.flag}). رمز الهاتف مقفل على ${detected.dialCode}.`,
        };
      }
    }
  }
  return null;
};

export interface EnrollmentLanguageOption {
  code: 'en' | 'ur_roman' | 'ar';
  label: string;
  nativeLabel: string;
  flag: string;
  description: string;
}

/**
 * Query 1 Compliance: Dynamically gates enrollment languages by regional phone prefix
 * - PK (+92) / IN (+91): Urdu (اردو) & English ONLY (Arabic hidden)
 * - MENA / Gulf (+971, +966, +965, etc.): Arabic (العربية) & English ONLY (Urdu hidden)
 * - Europe / Western (+44, +1, etc.): English ONLY (Urdu & Arabic hidden)
 */
export const getEnrollmentLanguagesForPhone = (phoneStr: string): EnrollmentLanguageOption[] => {
  const clean = (phoneStr || '').replace(/[\s\-\(\)]/g, '');
  // Pakistan (+92) or India (+91)
  if (
    clean.startsWith('+92') ||
    clean.startsWith('92') ||
    clean.startsWith('03') ||
    clean.startsWith('+91') ||
    clean.startsWith('91')
  ) {
    return [
      { code: 'ur_roman', label: 'Urdu', nativeLabel: 'اردو', flag: '🇵🇰', description: 'اردو میں مکمل فیلڈ اندراج اور تصدیق' },
      { code: 'en', label: 'English', nativeLabel: 'English', flag: '🌐', description: 'Standard English enrollment wizard' },
    ];
  }
  // MENA Region (+971 UAE, +966 KSA, +965 Kuwait, +968 Oman, +974 Qatar, +973 Bahrain, +20 Egypt, +962 Jordan, etc.)
  if (
    clean.startsWith('+971') ||
    clean.startsWith('971') ||
    clean.startsWith('+966') ||
    clean.startsWith('966') ||
    clean.startsWith('+965') ||
    clean.startsWith('965') ||
    clean.startsWith('+968') ||
    clean.startsWith('968') ||
    clean.startsWith('+974') ||
    clean.startsWith('974') ||
    clean.startsWith('+973') ||
    clean.startsWith('973') ||
    clean.startsWith('+20') ||
    clean.startsWith('+962')
  ) {
    return [
      { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇦🇪', description: 'التسجيل الميداني الكامل باللغة العربية' },
      { code: 'en', label: 'English', nativeLabel: 'English', flag: '🌐', description: 'Standard English enrollment wizard' },
    ];
  }
  // Europe / Western (+44 UK, +1 US, +49 Germany, +33 France, +39 Italy, etc.) & Global
  return [
    { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧', description: 'Day-1 Enrollment Wizard in English' },
  ];
};

export interface DialOption {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  expectedDigits: number;
  formatHint: string;
}

export const DIAL_CODE_OPTIONS: DialOption[] = [
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', expectedDigits: 10, formatHint: '10 digits (e.g. 301 8472910)' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', expectedDigits: 9, formatHint: '9 digits (e.g. 50 1234567)' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', expectedDigits: 9, formatHint: '9 digits (e.g. 50 1234567)' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', expectedDigits: 10, formatHint: '10 digits (e.g. 7123 456789)' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', expectedDigits: 10, formatHint: '10 digits (e.g. 212 5550198)' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', expectedDigits: 10, formatHint: '10 digits (e.g. 416 5550198)' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', expectedDigits: 8, formatHint: '8 digits (e.g. 99 123456)' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', expectedDigits: 8, formatHint: '8 digits (e.g. 55 123456)' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', expectedDigits: 8, formatHint: '8 digits (e.g. 91 123456)' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973', expectedDigits: 8, formatHint: '8 digits (e.g. 39 123456)' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', expectedDigits: 10, formatHint: '10 digits (e.g. 151 2345678)' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', expectedDigits: 9, formatHint: '9 digits (e.g. 6 12345678)' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', expectedDigits: 10, formatHint: '10 digits (e.g. 320 1234567)' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', expectedDigits: 9, formatHint: '9 digits (e.g. 612 345678)' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', expectedDigits: 9, formatHint: '9 digits (e.g. 6 12345678)' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', expectedDigits: 9, formatHint: '9 digits (e.g. 87 1234567)' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', expectedDigits: 10, formatHint: '10 digits (e.g. 98200 12345)' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', expectedDigits: 10, formatHint: '10 digits (e.g. 171 2345678)' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90', expectedDigits: 10, formatHint: '10 digits (e.g. 532 1234567)' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', expectedDigits: 9, formatHint: '9 digits (e.g. 12 3456789)' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', expectedDigits: 8, formatHint: '8 digits (e.g. 9123 4567)' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', expectedDigits: 9, formatHint: '9 digits (e.g. 412 345678)' },
];

export type ClientOnboardingLanguage = 'en' | 'ur' | 'ar';

export const ONBOARDING_I18N = {
  en: {
    steps: ['1. Lead & Geo-Pin', '2. Service Menu', '3. Package & Setup Fee', '4. Pairing QR'],
    step1Title: 'Step 1: Salon Lead Capture & Hardware GPS Pinning',
    step1Kicker: 'ON-SITE INITIALIZATION',
    routingLabel: 'Auto-Detected Smart Routing',
    routingDesc: 'Assisted On-Site Session: System alerts are simultaneously pushed to both Salon Owner and Field Agent Terminal.',
    routingBadge: '⚡ Dual Alert Active (Owner + Agent)',
    salonNameLabel: '1. Salon Name *',
    salonNamePlaceholder: 'e.g. Seven Cuts Studio',
    ownerNameLabel: '2. Owner Name *',
    ownerNamePlaceholder: 'e.g. Hamza Tariq',
    phoneLabel: '3. WhatsApp Mobile Number *',
    phoneHint: 'Used for Layer 1 auto-verification & 24/7 Concierge',
    countryDetected: 'Auto-Detected Country / Region',
    addressLabel: '4. Physical Address & Location *',
    addressPlaceholder: 'Shop #, Plaza, Street, Area, City',
    coordsLabel: '5. Hardware GPS Coordinates *',
    captureGps: 'Capture GPS Geotag',
    capturingGps: 'Acquiring GPS...',
    previewTitle: 'Automated WhatsApp Welcome Preview',
    previewBadge: 'Ready for Instant Push',
    step1Next: 'Save & Next: Service Menu →',
    
    step2Title: 'Step 2: Service Menu & Local Pricing Configuration',
    step2Kicker: 'RAPID ON-SITE SETUP',
    step2Desc: 'Configure service offerings for your salon. Add custom services or modify rates to match your printed menu.',
    mensCategory: "Men's Salon & Grooming",
    ladiesCategory: "Ladies' Beauty Parlor",
    addCustomService: '+ Add Custom Service',
    customNamePlaceholder: 'Service name (e.g. Beard Oil Treatment)',
    customPricePlaceholder: 'Price',
    addBtn: 'Add',
    cancelBtn: 'Cancel',
    step2Back: 'Back to Lead Capture',
    step2Next: 'Save & Next: Package Selection →',

    step3Title: 'Step 3: Package & Setup Fee Rail (Digital Clearance)',
    step3Kicker: 'STRICT STATE MACHINE GUARD',
    step3PackageHeading: 'Select Salon Onboarding Package Tier',
    formulaNotice: 'Formula: Monthly maintenance is strictly 10% of package fee / mo',
    oneTimeFeeLabel: 'One-Time Initial Setup Fee',
    monthlyMaintNote: 'Monthly maintenance will strictly be 10% SLA. Zero cash is ever accepted for monthly maintenance.',
    paymentConfirmed: 'Payment Confirmed & Sealed',
    paymentUnverified: 'Unverified · Tap Channel Below',
    layer1Title: 'LAYER 1: SETUP FEE FLEXIBILITY VS. STRICT 10% MAINTENANCE SIM-LOCK',
    layer1Desc: 'Initial setup fee can be cleared from any mobile or authorized payment channel (EasyPaisa, JazzCash, Meezan Bank, or Card). However, all recurring monthly 10% maintenance must strictly originate from the registered salon number via the Central SIM Gateway.',
    boundNumber: 'Bound WhatsApp Account',
    boundOwner: 'Registered Payee',
    featuresTitle: 'Complete Package Features Breakdown (Expandable)',
    expandFeatures: 'Inspect Package Features',
    collapseFeatures: 'Hide Features',
    includedLabel: 'Included',
    notIncludedLabel: 'Not Included',
    verifyBtn: 'Verify Digital Settlement Webhook',
    step3Back: 'Back to Service Menu',
    step3Next: 'Confirm Setup Fee & Launch Pairing QR →',

    step4Title: 'Step 4: Terminal Multi-Device Pairing & Handshake',
    step4Kicker: 'ON-SITE ACTIVATION',
    setupVerified: 'Setup Payment Verified',
    modeLabel: 'Pairing Handshake Delivery Mode:',
    modeQr: 'On-Site QR Camera Scan',
    modeLink: 'Remote Link & PWA',
    scanInstructions: 'Owner opens WhatsApp ➔ Linked Devices ➔ Link a Device ➔ Scan this screen.',
    pairingKeyLabel: 'Terminal Key:',
    tokenBoundBadge: '1:1 Cryptographic Single-Use Node Binding',
    tokenBurned: '🔥 TOKEN BURNED (BOUND)',
    tokenActive: 'ACTIVE (UNCLAIMED)',
    tokenExpl: 'This QR key is cryptographically locked to this salon only. The moment a handshake occurs, the ephemeral token is permanently burned, strictly preventing reuse.',
    remoteLinkTitle: 'Remote Web App & PWA Shortcut',
    remoteLinkDesc: 'For remote salon onboarding or direct link delivery, send this one-tap PWA link to the salon owner:',
    copyLink: 'Copy PWA Portal Link',
    copiedLink: 'Copied to Clipboard!',
    outboundTitle: 'Automated Outbound Dispatch',
    outboundStatus: 'Ready for Instant WhatsApp Push',
    handshakeSuccess: '1:1 Pairing Handshake 100% Successful!',
    handshakeDesc: 'Terminal node is now active on the WORKCRAFT SIM Gateway cluster. Cryptographic key bound strictly to this salon. Zero multi-salon reuse permitted.',
    completeBtn: 'Complete Onboarding & Return to Hub',
    simulateBtn: 'Simulate Salon WhatsApp Handshake',
    step4Back: 'Back to Setup Fee Rail',
  },
  ur: {
    steps: ['1. سیلون معلومات', '2. سروس مینو', '3. پیکیج اور فیس', '4. کیو آر پیئرنگ'],
    step1Title: 'پہلا مرحلہ: سیلون معلومات اور لوکیشن کا اندراج',
    step1Kicker: 'آن سائٹ انسٹالیشن',
    routingLabel: 'خودکار تشخیص اور اسمارٹ الرٹ روٹنگ',
    routingDesc: 'فیلڈ ایجنٹ کی موجودگی خودکار شناخت ہو گئی۔ سسٹم بیک وقت سیلون مالک اور ایجنٹ دونوں کو الرٹ جاری کرے گا۔',
    routingBadge: '⚡ ڈوئل الرٹ فعال (مالک + ایجنٹ)',
    salonNameLabel: '1. سیلون کا نام *',
    salonNamePlaceholder: 'مثلاً: سیون کٹس سٹوڈیو',
    ownerNameLabel: '2. سیلون مالک کا نام *',
    ownerNamePlaceholder: 'مثلاً: حمزہ طارق',
    phoneLabel: '3. واٹس ایپ موبائل نمبر *',
    phoneHint: 'لیئر 1 تصدیق اور 24/7 کسٹمر بکنگ کے لیے استعمال ہوگا',
    countryDetected: 'ملک اور خطہ: خودکار منتخب',
    addressLabel: '4. سیلون کا مکمل پتہ *',
    addressPlaceholder: 'دکان نمبر، پلازہ، گلی/بلاک، علاقہ، شہر',
    coordsLabel: '5. ہارڈ ویئر GPS کوآرڈینیٹس *',
    captureGps: 'GPS لوکیشن حاصل کریں',
    capturingGps: 'لوکیشن حاصل کی جا رہی ہے...',
    previewTitle: 'واٹس ایپ خوش آمدید میسج کا پیش نظارہ',
    previewBadge: 'فوری ارسال کے لیے تیار',
    step1Next: 'محفوظ کریں اور سروس مینو منتخب کریں →',
    
    step2Title: 'دوسرا مرحلہ: سروسز اور ریٹ لسٹ سیٹ اپ',
    step2Kicker: 'فوری آن سائٹ سیٹ اپ',
    step2Desc: 'سیلون کی فراہم کردہ سروسز اور ریٹ منتخب کریں، یا ریٹ کارڈ کے مطابق نئی سروس شامل کریں۔',
    mensCategory: 'مردانہ سیلون (Men\'s Salon)',
    ladiesCategory: 'لیڈیز پارلر (Ladies\' Parlor)',
    addCustomService: '+ نئی سروس شامل کریں',
    customNamePlaceholder: 'سروس کا نام (مثلاً: داڑھی پروٹین ٹریٹمنٹ)',
    customPricePlaceholder: 'قیمت',
    addBtn: 'شامل کریں',
    cancelBtn: 'منسوخ',
    step2Back: 'واپس سیلون معلومات',
    step2Next: 'محفوظ کریں اور پیکیج منتخب کریں →',

    step3Title: 'تیسرا مرحلہ: پیکیج اور سیٹ اپ فیس کی ادائیگی',
    step3Kicker: 'ڈیجیٹل سیکیورٹی انجن',
    step3PackageHeading: 'سیلون آن بورڈنگ پیکیج منتخب کریں',
    formulaNotice: 'فارمولا: ماہانہ دیکھ بھال کی فیس منتخب پیکیج کا ٹھیک 10 فیصد ہوگی',
    oneTimeFeeLabel: 'یک مشت ابتدائی سیٹ اپ فیس',
    monthlyMaintNote: 'ماہانہ دیکھ بھال فیس ٹھیک 10 فیصد ہوگی۔ ماہانہ دیکھ بھال کے لیے نقد رقم ہرگز قبول نہیں کی جائے گی۔',
    paymentConfirmed: 'ادائیگی موصول و محفوظ ہو گئی',
    paymentUnverified: 'غیر تصدیق شدہ · نیچے ادائیگی چینل منتخب کریں',
    layer1Title: 'لیئر 1: سیٹ اپ فیس کی لچک بمقابلہ 10% ماہانہ مینٹیننس کا سم لاک',
    layer1Desc: 'ابتدائی سیٹ اپ فیس کسی بھی موبائل اکاؤنٹ یا بینک سے ادا کی جا سکتی ہے۔ تاہم، تمام آئندہ ماہانہ 10% مینٹیننس لازمی طور پر سیلون کے رجسٹرڈ نمبر سے بذریعہ سینٹرل سم گیٹ وے ہی خودکار طریقے سے ادا ہوگی۔',
    boundNumber: 'رجسٹرڈ واٹس ایپ اکاؤنٹ',
    boundOwner: 'سیلون پارٹنر کا نام',
    featuresTitle: 'پیکیج کی مکمل تفصیلات اور خصوصیات (تفصیل دیکھیں)',
    expandFeatures: 'پیکیج کی تمام خصوصیات دیکھیں',
    collapseFeatures: 'خصوصیات بند کریں',
    includedLabel: 'شامل ہے',
    notIncludedLabel: 'شامل نہیں',
    verifyBtn: 'ڈیجیٹل ادائیگی ویب ہک تصدیق کریں',
    step3Back: 'واپس سروس مینو',
    step3Next: 'سیٹ اپ فیس تصدیق کریں اور پیئرنگ کیو آر شروع کریں ←',

    step4Title: 'چوتھا مرحلہ: واٹس ایپ ڈیوائس لنک اور پیئرنگ',
    step4Kicker: 'آن سائٹ ایکٹیویشن',
    setupVerified: 'سیٹ اپ فیس تصدیق شدہ',
    modeLabel: 'پیئرنگ کنکشن کا طریقہ:',
    modeQr: 'طریقہ A: کیو آر کوڈ کیمرہ اسکین',
    modeLink: 'طریقہ B: ریموٹ لنک اور PWA ایپ',
    scanInstructions: 'سیلون مالک اپنے فون پر واٹس ایپ کھول کر Linked Devices میں جائیں اور یہ اسکرین اسکین کریں۔',
    pairingKeyLabel: 'ٹرمینل سیکیورٹی کوڈ:',
    tokenBoundBadge: '1:1 سنگل یوز کرپٹوگرافک نوڈ بائنڈنگ',
    tokenBurned: '🔥 کوڈ استعمال ہو چکا (سیلون سے منسلک)',
    tokenActive: 'فعال (اسکین کا منتظر)',
    tokenExpl: 'یہ کیو آر کوڈ صرف اسی سیلون کے لیے مخصوص ہے۔ جونہی کنکشن مکمل ہوگا، یہ کوڈ ہمیشہ کے لیے برن ہو جائے گا تاکہ کوئی دوسرا استعمال نہ کر سکے۔',
    remoteLinkTitle: 'ریموٹ ویب پورٹل اور PWA لنک',
    remoteLinkDesc: 'ریموٹ آن بورڈنگ کے لیے یہ ایک کلک والا پورٹل لنک سیلون مالک کے واٹس ایپ پر ارسال کریں:',
    copyLink: 'پورٹل لنک کاپی کریں',
    copiedLink: 'لنک کاپی ہو گیا!',
    outboundTitle: 'خودکار واٹس ایپ خوش آمدید میسج',
    outboundStatus: 'فوری ارسال کے لیے تیار',
    handshakeSuccess: '1:1 پیئرنگ کنکشن 100% کامیاب ہو گیا!',
    handshakeDesc: 'سیلون ٹرمینل اب ورک کرافٹ سم گیٹ وے کلسٹر پر مکمل طور پر لائیو ہے۔ کرپٹوگرافک کی اس سیلون سے کامیابی سے لنک ہو چکی ہے۔',
    completeBtn: 'آن بورڈنگ مکمل کریں اور واپس جائیں',
    simulateBtn: 'سیلون واٹس ایپ کنکشن ٹیسٹ کریں',
    step4Back: 'واپس پیکیج اور فیس',
  },
  ar: {
    steps: ['1. بيانات الصالون', '2. قائمة الخدمات', '3. الباقة والدفع', '4. ربط الباركود'],
    step1Title: 'الخطوة 1: تسجيل بيانات الصالون والموقع الجغرافي',
    step1Kicker: 'الإعداد الميداني المباشر',
    routingLabel: 'التوجيه الذكي التلقائي للتنبيهات',
    routingDesc: 'تم التحقق من حضور الوكيل الميداني تلقائياً. سيتم إرسال تنبيه مزدوج متزامن لمالك الصالون والوكيل.',
    routingBadge: '⚡ تنبيه مزدوج نشط (المالك + الوكيل)',
    salonNameLabel: '1. اسم الصالون *',
    salonNamePlaceholder: 'مثال: صالون سيفن كتس',
    ownerNameLabel: '2. اسم المالك *',
    ownerNamePlaceholder: 'مثال: حمزة طارق',
    phoneLabel: '3. رقم الواتساب المعتمد *',
    phoneHint: 'يُستخدم للمطابقة الآلية في المستوى 1 والرد الذكي 24/7',
    countryDetected: 'البلد والمنطقة: تم التحديد تلقائياً',
    addressLabel: '4. العنوان وموقع الصالون بالتفصيل *',
    addressPlaceholder: 'رقم المحل، المبنى، الشارع، الحي، المدينة',
    coordsLabel: '5. إحداثيات الموقع الجغرافي GPS *',
    captureGps: 'تحديد الموقع GPS',
    capturingGps: 'جاري تحديد الموقع...',
    previewTitle: 'معاينة رسالة الترحيب عبر واتساب',
    previewBadge: 'جاهز للإرسال الفوري',
    step1Next: 'حفظ ومتابعة لقائمة الخدمات ←',

    step2Title: 'الخطوة 2: قائمة الخدمات والأسعار المعتمدة',
    step2Kicker: 'التهيئة السريعة',
    step2Desc: 'حدد قائمة الخدمات والأسعار المعتمدة في الصالون، أو أضف خدمات مخصصة مطابقة لقائمة الأسعار.',
    mensCategory: 'صالون رجالي (Men\'s Salon)',
    ladiesCategory: 'صالون نسائي (Ladies\' Parlor)',
    addCustomService: '+ إضافة خدمة مخصصة',
    customNamePlaceholder: 'اسم الخدمة (مثال: تنظيف بشرة VIP)',
    customPricePlaceholder: 'السعر',
    addBtn: 'إضافة',
    cancelBtn: 'إلغاء',
    step2Back: 'الرجوع لبيانات الصالون',
    step2Next: 'حفظ ومتابعة لاختيار الباقة ←',

    step3Title: 'الخطوة 3: اختيار الباقة وتأكيد رسوم التأسيس',
    step3Kicker: 'محرك الأمان الرقمي',
    step3PackageHeading: 'اختر باقة تأسيس الصالون',
    formulaNotice: 'المعادلة: رسوم الصيانة الشهرية هي 10% بالضبط من قيمة الباقة شهرياً',
    oneTimeFeeLabel: 'رسوم التأسيس لمرة واحدة فقط',
    monthlyMaintNote: 'الصيانة الشهرية 10% بموجب اتفاقية الخدمة. لا يتم قبول أي مدفوعات نقدية للصيانة الشهرية نهائياً.',
    paymentConfirmed: 'تم التحقق من الدفع وتثبيته بنجاح',
    paymentUnverified: 'غير مؤكد · اختر قناة الدفع أدناه',
    layer1Title: 'المستوى 1: مرونة دفع رسوم التأسيس وقفل الصيانة الشهرية على شريحة الصالون',
    layer1Desc: 'يمكن سداد رسوم التأسيس الأولى من أي حساب بنكي أو محفظة معتمدة. بينما تخضع الصيانة الشهرية (10%) لشرط التحويل الحصري من شريحة الصالون المسجلة عبر بوابة SIM المركزية.',
    boundNumber: 'رقم الواتساب المعتمد للدفع',
    boundOwner: 'اسم الشريك المسجل',
    featuresTitle: 'التفاصيل الشاملة ومميزات الباقة (قابلة للتوسيع)',
    expandFeatures: 'عرض كافة مميزات الباقة',
    collapseFeatures: 'إخفاء مميزات الباقة',
    includedLabel: 'مشمول',
    notIncludedLabel: 'غير مشمول',
    verifyBtn: 'التحقق من إشعار الدفع الرقمي',
    step3Back: 'الرجوع لقائمة الخدمات',
    step3Next: 'تأكيد رسوم التثبيت وتشغيل باركود الربط ←',

    step4Title: 'الخطوة 4: ربط جهاز الصالون بالواتساب والاقتران',
    step4Kicker: 'التفعيل النهائي',
    setupVerified: 'تم التحقق من دفع رسوم التأسيس',
    modeLabel: 'نمط إتمام عملية الربط:',
    modeQr: 'النمط أ: مسح رمز الباركود QR',
    modeLink: 'النمط ب: رابط البوابة وتطبيق PWA',
    scanInstructions: 'يفتح مالك الصالون تطبيق واتساب ➔ الأجهزة المرتبطة ➔ ربط جهاز ➔ ومسح هذا الرمز.',
    pairingKeyLabel: 'مفتاح الربط الأمني:',
    tokenBoundBadge: 'ربط أحادي الاستخدام مشفر 1:1',
    tokenBurned: '🔥 تم استهلاك الرمز وتثبيته للصالون',
    tokenActive: 'نشط (بانتظار المسح)',
    tokenExpl: 'هذا الرمز مشفر وخاص بهذا الصالون حصراً. فور الاقتران، يتم إتلاف الرمز فوراً لمنع إعادة استخدامه على أي جهاز آخر.',
    remoteLinkTitle: 'رابط البوابة وتطبيق PWA',
    remoteLinkDesc: 'للتسجيل عن بُعد، أرسل هذا الرابط السريع إلى واتساب مالك الصالون:',
    copyLink: 'نسخ رابط البوابة',
    copiedLink: 'تم النسخ بنجاح!',
    outboundTitle: 'إرسال رسالة الترحيب الآلية',
    outboundStatus: 'جاهز للإرسال الفوري',
    handshakeSuccess: 'تم اقتران الجهاز بنجاح 100%!',
    handshakeDesc: 'تم تفعيل نقطة اتصال الصالون على شبكة WORKCRAFT بنجاح، وربط المفتاح الأمني بالصالون نهائياً.',
    completeBtn: 'إتمام التسجيل والعودة للمركز',
    simulateBtn: 'محاكاة اختبار ربط الواتساب',
    step4Back: 'الرجوع لرسوم التأسيس',
  },
};

export const getLocalizedServiceName = (name: string, lang: ClientOnboardingLanguage) => {
  if (lang === 'en') return name;
  const translations: Record<string, { ur: string; ar: string }> = {
    'Master Haircut': { ur: 'ماسٹر ہیئر کٹ (بالوں کی کٹنگ)', ar: 'قص شعر احترافي (ماستر)' },
    'Skin Fade Styling': { ur: 'اسکن فیڈ اسٹائلنگ (سائیڈ فیڈ)', ar: 'تدريج وتحديد سكن فيد' },
    'Beard Sculpt & Line-Up': { ur: 'داڑھی سیٹنگ اور خط', ar: 'تحديد وتشذيب اللحية' },
    'Ozone Steam Therapy': { ur: 'اوزون اسٹیم تھراپی (بھاپ)', ar: 'جلسة بخار أوزون للوجه' },
    'Charcoal Deep Detox Facial': { ur: 'چارکول ڈیپ ڈیٹاکس فیشل', ar: 'تنظيف عميق بالفحم النشط' },
    'Hair Protein & Scalp Massage': { ur: 'ہیئر پروٹین اور اسکیلپ مساج', ar: 'بروتين شعر وتدليك الفروة' },
    'Hot Towel Royal Shave': { ur: 'ہاٹ ٹاول شاہی شیو', ar: 'حلاقة ملكية بالمنشفة الساخنة' },
    'Full Grooming VIP Combo': { ur: 'فل گرومنگ وی آئی پی کومبو', ar: 'باقة العناية الشاملة VIP' },
    'Signature Haircut': { ur: 'سگنیچر لیڈیز ہیئر کٹ', ar: 'قص شعر نسائي مميز' },
    'Blowdry & Styling': { ur: 'بلو ڈرائی اور اسٹائلنگ', ar: 'سشوار وتسريح شعر' },
    'Hydra Glow Cleansing Facial': { ur: 'ہائیڈرا گلو کلینزنگ فیشل', ar: 'جلسة هيدرافيشل لتنظيف ونضارة البشرة' },
    'Party Makeup': { ur: 'پارٹی میک اپ', ar: 'مكياج مناسبات وسهرات' },
    'Bridal Hair Styling': { ur: 'برائیڈل ہیئر اسٹائلنگ', ar: 'تسريحات شعر للعرائس' },
    'Keratin Smoothing Treatment': { ur: 'کیراٹن اسموتھنگ ٹریٹمنٹ', ar: 'معالجة كيراتين لتنعيم الشعر' },
    'Manicure & Pedicure Spa': { ur: 'مینی کیور اور پیڈی کیور سپا', ar: 'سبا العناية باليدين والقدمين' },
    '24K Gold Glow Facial': { ur: '24K گولڈ گلو فیشل', ar: 'جلسة نضارة بالذهب عيار 24' },
    'Hot Towel Charcoal Facial': { ur: 'چارکول فیشل مع ہاٹ ٹاول', ar: 'تنظيف بشرة بالفحم والمنشفة الساخنة' },
    'Royal Scalp Therapy & Wash': { ur: 'ہیئر واش اور اسکیلپ مساج', ar: 'غسيل شعر وتدليك فروة الرأس' },
    'Beard Color & Sculpting': { ur: 'داڑھی کلرنگ اور اسٹائلنگ', ar: 'صبغ لحية وتشذيب احترافي' },
    'Hydra Deep Cleanse Facial': { ur: 'ہائیڈرا فیشل ڈیپ کلینزنگ', ar: 'جلسة هيدرافيشل لتنظيف المسام' },
    'Bridal Hair Styling & Wash': { ur: 'برائیڈل ہیئر اسٹائلنگ اور واش', ar: 'تصفيف وتسريحات شعر للعرائس' },
    'Luxury HD Bridal Makeup': { ur: 'لگژری ایچ ڈی برائیڈل میک اپ', ar: 'مكياج عرائس سينمائي فاخر' },
  };
  return translations[name]?.[lang] || name;
};

export const getLocalizedPackageName = (name: string, lang: ClientOnboardingLanguage) => {
  if (lang === 'en') return name;
  const translations: Record<string, { ur: string; ar: string }> = {
    'Starter Setup': { ur: 'اسٹارٹر سیٹ اپ', ar: 'باقة التأسيس الأولى' },
    'Growth Automation': { ur: 'گروتھ آٹومیشن', ar: 'باقة النمو الآلي' },
    'VIP Executive': { ur: 'وی آئی پی ایگزیکٹو', ar: 'باقة كبار العملاء VIP' },
    'Custom Enterprise': { ur: 'کسٹم انٹرپرائز', ar: 'الباقة المخصصة للمؤسسات' },
  };
  return translations[name]?.[lang] || name;
};

export interface PackageFeatureDetail {
  title: string;
  included: boolean;
  highlight?: boolean;
}

export const getLocalizedPackageFeatures = (pkgId: string, lang: ClientOnboardingLanguage): PackageFeatureDetail[] => {
  if (lang === 'ur') {
    switch (pkgId) {
      case 'STARTER':
        return [
          { title: '24/7 خودکار واٹس ایپ بکنگ بوٹ', included: true },
          { title: 'ماہانہ 500 گاہک بکنگز کی گنجائش', included: true },
          { title: 'بکنگ کا فوری کنفرمیشن و ریمائنڈر میسج', included: true },
          { title: 'گوگل 5-اسٹار ریویو بوسٹر (غیر فعال)', included: false },
          { title: 'ویڈیو ڈیلز اور وائرل ریلز (غیر فعال)', included: false },
          { title: 'ماہانہ 10% مینٹیننس (مفت ہوسٹنگ و بیک اپ)', included: true },
        ];
      case 'GROWTH':
        return [
          { title: '24/7 خودکار واٹس ایپ بکنگ بوٹ', included: true },
          { title: 'ماہانہ 1,500 گاہک بکنگز کی گنجائش', included: true },
          { title: 'گوگل 5-اسٹار ریویو بوسٹر (سروس کے 30 منٹ بعد خودکار)', included: true, highlight: true },
          { title: 'براہ راست گوگل میپس 5★ فلٹر و ریٹنگ اضافہ', included: true },
          { title: 'ویڈیو ڈیلز اور وائرل ریلز (غیر فعال)', included: false },
          { title: 'ماہانہ 10% مینٹیننس اور 60 منٹ ہیلنگ گارنٹی', included: true },
        ];
      case 'VIP':
        return [
          { title: '24/7 ترجیحی واٹس ایپ بوٹ کلسٹر', included: true },
          { title: 'ماہانہ 3,000 گاہک بکنگز کی گنجائش', included: true },
          { title: 'گوگل 5-اسٹار ریویو بوسٹر (VIP ترجیح)', included: true },
          { title: 'ویڈیو اپلوڈ اور وائرل ڈیلز فیچر انلاکڈ', included: true, highlight: true },
          { title: '1 ویڈیو ڈیل (1,500 روپے) یا 4 ویڈیو ڈیلز (4,000 روپے ماہانہ)', included: true },
          { title: '7 تا 10 دن کا ویڈیو کنورژن آڈٹ', included: true },
          { title: 'ماہانہ 10% مینٹیننس اور ڈیڈیکیٹڈ سپورٹ مینیجر', included: true },
        ];
      case 'CUSTOM':
      default:
        return [
          { title: 'ملٹی سم گیٹ وے اور کسٹم واٹس ایپ راؤٹنگ', included: true },
          { title: 'لامحدود بکنگز اور ملٹی برانچ نیٹ ورک کنٹرول', included: true },
          { title: 'لامحدود گوگل 5-اسٹار پروموشنل مہمات', included: true },
          { title: 'کسٹم ویڈیو پروڈکشن اور سوشل ریلز پروموشن', included: true },
          { title: '24/7 ترجیحی سینئر انجینئر اسٹینڈ بائی (10% SLA)', included: true },
        ];
    }
  }

  if (lang === 'ar') {
    switch (pkgId) {
      case 'STARTER':
        return [
          { title: 'بوت حجز واتساب آلي يعمل على مدار 24/7', included: true },
          { title: 'سعة استيعاب 500 حجز شهرياً', included: true },
          { title: 'إشعار وتأكيد فوري للحجوزات', included: true },
          { title: 'معزز تقييمات جوجل 5 نجوم (غير مدرج)', included: false },
          { title: 'عروض الفيديو والريلز التسويقية (غير مدرج)', included: false },
          { title: 'صيانة شهرية 10% (استضافة وضمان تشغيل)', included: true },
        ];
      case 'GROWTH':
        return [
          { title: 'بوت واتساب فائق السرعة 24/7', included: true },
          { title: 'سعة استيعاب 1,500 حجز شهرياً', included: true },
          { title: 'معزز تقييمات جوجل 5 نجوم التلقائي (بعد 30 دقيقة)', included: true, highlight: true },
          { title: 'رفع التقييم المباشر على خرائط جوجل', included: true },
          { title: 'عروض الفيديو والريلز التسويقية (غير مدرج)', included: false },
          { title: 'صيانة شهرية 10% مع دعم تعافي في أقل من 60 دقيقة', included: true },
        ];
      case 'VIP':
        return [
          { title: 'بوت واتساب عالي الكثافة والأولوية القصوى', included: true },
          { title: 'سعة استيعاب 3,000 حجز شهرياً', included: true },
          { title: 'معزز تقييمات جوجل 5 نجوم الممتاز', included: true },
          { title: 'فتح ميزة عروض وفيديوهات الصالون التسويقية', included: true, highlight: true },
          { title: 'عرض فيديو واحد ($15) أو 4 فيديوهات ($40 شهرياً)', included: true },
          { title: 'تدقيق ومتابعة تفاعل الفيديو لمدة 7-10 أيام', included: true },
          { title: 'صيانة شهرية 10% ومدير حساب مخصص', included: true },
        ];
      case 'CUSTOM':
      default:
        return [
          { title: 'مجموعة بوابات SIM متعددة وتوزيع للفروع', included: true },
          { title: 'حجوزات غير محدودة وتغطية لجميع الفروع', included: true },
          { title: 'حملات تقييمات جوجل غير محدودة', included: true },
          { title: 'إنتاج حملات فيديو مخصصة وترويج احترافي', included: true },
          { title: 'دعم تقني مباشر 24/7 بموجب اتفاقية 10%', included: true },
        ];
    }
  }

  // English (default)
  switch (pkgId) {
    case 'STARTER':
      return [
        { title: '24/7 Autonomous WhatsApp Booking Concierge', included: true },
        { title: '500 salon bookings / month capacity', included: true },
        { title: 'Instant booking confirmation & reminder SMS', included: true },
        { title: 'Google 5-Star Review Booster (Disabled)', included: false },
        { title: 'Viral Video Deals & Reels Feature (Disabled)', included: false },
        { title: 'Monthly 10% Maintenance (Cloud hosting, auto-healing)', included: true },
      ];
    case 'GROWTH':
      return [
        { title: '24/7 Autonomous WhatsApp Booking Concierge', included: true },
        { title: '1,500 salon bookings / month capacity', included: true },
        { title: 'Google 5-Star Review Booster (Auto-prompted 30 mins after checkout)', included: true, highlight: true },
        { title: 'Direct Google Maps 5★ filter & review multiplier', included: true },
        { title: 'Viral Video Deals & Reels Feature (Disabled)', included: false },
        { title: 'Monthly 10% Maintenance with < 60-min recovery SLA', included: true },
      ];
    case 'VIP':
      return [
        { title: 'Priority Multi-Threaded WhatsApp Concierge Cluster', included: true },
        { title: '3,000 salon bookings / month capacity', included: true },
        { title: 'Google 5-Star Review Booster (VIP priority)', included: true },
        { title: 'Viral Video Deals & Reels Feature Unlocked', included: true, highlight: true },
        { title: '1 video deal ($15 / PKR 1.5k) or 4 video deals ($40 / PKR 4k / mo)', included: true },
        { title: '7 to 10 day conversion audit & analytics', included: true },
        { title: 'Monthly 10% Maintenance & dedicated account manager', included: true },
      ];
    case 'CUSTOM':
    default:
      return [
        { title: 'Multi-SIM Cluster & Customized Branch Routing', included: true },
        { title: 'Unlimited salon bookings / multi-branch network', included: true },
        { title: 'Unlimited Google 5-Star campaigns & viral promo broadcast', included: true },
        { title: 'Custom video marketing production & creator coordination', included: true },
        { title: 'Dedicated senior engineer 24/7 standby (10% SLA)', included: true },
      ];
  }
};

export const formatWelcomeMessage = (
  lang: ClientOnboardingLanguage,
  ownerName: string,
  salonName: string,
  pairingKey: string = 'WCL-49201'
) => {
  const safeOwner = ownerName.trim() || 'Partner';
  const safeSalon = salonName.trim() || 'Your Salon';
  const pwaLink = `https://portal.workcraft.local/onboard/${safeSalon.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'salon'}`;

  if (lang === 'en') {
    // English: strictly "Dear Mr. [Name]" (No Assalam-o-Alaikum as per policy)
    return `Dear Mr. ${safeOwner},\n\nWelcome to WORKCRAFT Local. Your terminal for "${safeSalon}" is activated.\n🔑 Terminal Pairing Key: ${pairingKey}\n📲 Web App Link: ${pwaLink}\n\nOur Central SIM Gateway is now operational for your 24/7 automated booking concierge.`;
  }
  if (lang === 'ar') {
    // Arabic: Starts with Assalam-o-Alaikum
    return `السلام علیکم ${safeOwner}!\n\nمرحباً بكم في WORKCRAFT Local. تم تفعيل حساب صالونكم "${safeSalon}".\n🔑 رمز الاقتران (Pairing Key): ${pairingKey}\n📲 رابط البوابة: ${pwaLink}\n\nنظام الرد التلقائي والحجوزات عبر واتساب يعمل الآن 24/7 على مدار الساعة.`;
  }
  // Native Simple Urdu: Starts with Assalam-o-Alaikum
  return `السلام علیکم ${safeOwner}!\n\nورک کرافٹ لوکل میں خوش آمدید۔ آپ کے سیلون "${safeSalon}" کا اکاؤنٹ فعال ہو چکا ہے۔\n🔑 پیئرنگ کوڈ (Pairing Key): ${pairingKey}\n📲 پورٹل لنک: ${pwaLink}\n\nہمارا 24/7 واٹس ایپ آٹو ریپلائی کسٹمر بکنگ سسٹم لائیو ہے۔`;
};

export const FieldAgentHub: React.FC<FieldAgentHubProps> = ({
  onSalonCreated,
  onCashCollected,
  onClose,
  initialAutoOpenEnrollment,
  initialEnrollAgentData,
  userRole = 'FOUNDER',
}) => {
  // Agent Terminal Authentication State
  const [isAgentAuthenticated, setIsAgentAuthenticated] = useState(true);
  const [agentIdInput, setAgentIdInput] = useState('AGT-409');
  const [agentPinInput, setAgentPinInput] = useState('7892');
  const [loginError, setLoginError] = useState<string | null>(null);

  // 4-Step Sequential In-Hub Onboarding State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Lead Information & Phone Configuration
  const [salonName, setSalonName] = useState('Seven Cuts Studio');
  const [ownerName, setOwnerName] = useState('Hamza Tariq');
  const [selectedDialCode, setSelectedDialCode] = useState('+92');
  const [nationalPhone, setNationalPhone] = useState('3018472910');
  const [clientOnboardingLanguage, setClientOnboardingLanguage] = useState<ClientOnboardingLanguage>('ur');
  const t = ONBOARDING_I18N[clientOnboardingLanguage];
  const [coords, setCoords] = useState('31.4705° N, 74.4109° E');
  const [address, setAddress] = useState('Shop #4, Plaza 12, CCA Phase 5 DHA, Lahore');
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [invitePreview, setInvitePreview] = useState<string | null>(null);

  // Searchable Country Dial Code Picker State (Recommendation 1)
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [isDialDropdownOpen, setIsDialDropdownOpen] = useState(false);

  // Expandable Package Feature Details Accordion State (Recommendation 3)
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>('GROWTH');

  // Dynamic Full Phone and Country Detection
  const phone = `${selectedDialCode} ${nationalPhone}`;
  const selectedDialConfig = DIAL_CODE_OPTIONS.find((d) => d.dialCode === selectedDialCode) || DIAL_CODE_OPTIONS[0];
  const detectedCountry = detectCountryFromPhone(phone);

  // Locked Routing Mode: Inside Agent Hub, it is strictly Assisted On-Site Dual Alert
  const onboardingAssistance = 'ASSISTED';

  // Step 4: Alphanumeric Pairing Key (Query 7: WCL-XXXXX) & View Mode (Query 6)
  const [pairingKey, setPairingKey] = useState('WCL-49201');
  const [step4ViewMode, setStep4ViewMode] = useState<'QR_SCAN' | 'DIRECT_LINK'>('QR_SCAN');

  // Step 2: Services & Pricing
  const [serviceCategory, setServiceCategory] = useState<'MENS' | 'LADIES'>('MENS');
  const [mensServices, setMensServices] = useState<ServiceItem[]>(DEFAULT_MENS_SERVICES);
  const [ladiesServices, setLadiesServices] = useState<ServiceItem[]>(DEFAULT_LADIES_SERVICES);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('2000');
  const [isAddingCustomService, setIsAddingCustomService] = useState(false);

  // Step 3: Package & Setup Fee Settlement (Domestic PKR vs International USD)
  const [selectedOnboardingPackage, setSelectedOnboardingPackage] = useState<'STARTER' | 'GROWTH' | 'VIP' | 'CUSTOM'>('STARTER');

  const ONBOARDING_PACKAGES_DOMESTIC = [
    {
      id: 'STARTER',
      name: 'Starter Setup',
      setupFee: 15000,
      monthlyMaint: 1500, // 10%
      currency: 'PKR',
      prefix: 'PKR ',
      bookings: '500 bookings/mo',
      scope: 'WhatsApp Auto-Reply Concierge Only (No Google Reviews, No Video Deals)',
      agentCommission: 3000,
    },
    {
      id: 'GROWTH',
      name: 'Growth Automation',
      setupFee: 20000,
      monthlyMaint: 2000, // 10%
      currency: 'PKR',
      prefix: 'PKR ',
      bookings: '1,500 bookings/mo',
      scope: 'WhatsApp Auto-Reply + Google 5-Star Review Booster',
      agentCommission: 4000,
    },
    {
      id: 'VIP',
      name: 'VIP Executive',
      setupFee: 25000,
      monthlyMaint: 2500, // 10%
      currency: 'PKR',
      prefix: 'PKR ',
      bookings: '3,000 bookings/mo',
      scope: 'WhatsApp Auto-Reply + Google 5-Star Reviews + Video Upload Feature Unlocked (1 video @ 1,500 or 4 videos @ 4,000/mo · 7-10 day validation)',
      agentCommission: 5000,
    },
    {
      id: 'CUSTOM',
      name: 'Custom Enterprise',
      setupFee: 35000,
      monthlyMaint: 3500, // 10%
      currency: 'PKR',
      prefix: 'PKR ',
      bookings: '> 3,000 bookings / Multi-Branch',
      scope: 'Enterprise Multi-SIM & Custom SLA (Video Feature Unlocked: 1 to 4 videos/mo · 10% maintenance)',
      agentCommission: 7000,
    },
  ];

  const ONBOARDING_PACKAGES_INTL = [
    {
      id: 'STARTER',
      name: 'Starter Setup',
      setupFee: 75,
      monthlyMaint: 7.5, // 10%
      currency: 'USD',
      prefix: '$',
      bookings: '500 bookings/mo',
      scope: 'WhatsApp Auto-Reply Concierge Only (No Google Reviews, No Video Deals)',
      agentCommission: 15,
    },
    {
      id: 'GROWTH',
      name: 'Growth Automation',
      setupFee: 110,
      monthlyMaint: 11, // 10%
      currency: 'USD',
      prefix: '$',
      bookings: '1,500 bookings/mo',
      scope: 'WhatsApp Auto-Reply + Google 5-Star Review Booster',
      agentCommission: 22,
    },
    {
      id: 'VIP',
      name: 'VIP Executive',
      setupFee: 160,
      monthlyMaint: 16, // 10%
      currency: 'USD',
      prefix: '$',
      bookings: '3,000 bookings/mo',
      scope: 'WhatsApp Auto-Reply + Google 5-Star Reviews + Video Upload Feature Unlocked (1 video @ $15 or 4 videos @ $40/mo · 7-10 day validation)',
      agentCommission: 32,
    },
    {
      id: 'CUSTOM',
      name: 'Custom Enterprise',
      setupFee: 250,
      monthlyMaint: 25, // 10%
      currency: 'USD',
      prefix: '$',
      bookings: '> 3,000 bookings / Multi-Branch',
      scope: 'Enterprise Multi-SIM & Custom SLA (Video Feature Unlocked: 1 to 4 videos/mo · 10% maintenance)',
      agentCommission: 50,
    },
  ];

  const currentPackageList = detectedCountry.isDomestic ? ONBOARDING_PACKAGES_DOMESTIC : ONBOARDING_PACKAGES_INTL;
  const activePackage = currentPackageList.find(p => p.id === selectedOnboardingPackage) || currentPackageList[0];

  // Query 1 & 2: Interactive Payment Drawer & Method State
  const [setupPaymentMethod, setSetupPaymentMethod] = useState<'EasyPaisa' | 'JazzCash' | 'Bank Transfer (IBFT)' | 'Stripe / Card' | 'Cash Collection'>(
    detectedCountry.isDomestic ? 'EasyPaisa' : 'Stripe / Card'
  );
  const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false);
  const [simWebhookState, setSimWebhookState] = useState<'idle' | 'listening' | 'detected'>('idle');

  // Query 6: State Machine Guard Lock (Strictly FALSE until payment confirmation is verified)
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);

  // Verified Payment Receipt Payload
  const [verifiedPaymentData, setVerifiedPaymentData] = useState<{
    method: string;
    senderDetails: string;
    tid: string;
    amount: number;
    currency: string;
    timestamp: string;
    sha256Proof: string;
    recipientRoute: string;
    commissionAdjusted: boolean;
    commissionAmount: number;
    remainingCashOwed: number;
  } | null>(null);

  // Drawer Form State
  const [drawerSenderDetails, setDrawerSenderDetails] = useState('');
  const [drawerTid, setDrawerTid] = useState('');
  const [drawerIsSubmitting, setDrawerIsSubmitting] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);

  // Elder-Friendly 1-Tap Copy & Quick Actions State (Query 5)
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopyText = (text: string, fieldId: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handlePasteDemoTid = () => {
    const demoTid =
      setupPaymentMethod === 'EasyPaisa'
        ? `EP-${Math.floor(10000000000 + Math.random() * 90000000000)}`
        : setupPaymentMethod === 'JazzCash'
        ? `JC-${Math.floor(10000000000 + Math.random() * 90000000000)}`
        : setupPaymentMethod === 'Bank Transfer (IBFT)'
        ? `RRN-${Math.floor(1000000000 + Math.random() * 9000000000)}`
        : `pi_${Math.random().toString(36).substring(2, 14)}`;
    setDrawerTid(demoTid);
  };

  // Strict Security & Cash Risk Framework
  const MAX_CASH_CEILING = 50000; // PKR 50,000 hard velocity limit
  const [cashLiabilityHeld, setCashLiabilityHeld] = useState<number>(15000); // e.g. from Noor Parlor setup cash
  const [cashLiabilitySalon, setCashLiabilitySalon] = useState('Noor Beauty Lounge');
  const [countdownHours, setCountdownHours] = useState(44); // 48-Hour Alarming Window per deal
  const [countdownMinutes, setCountdownMinutes] = useState(18);

  // Strict Biometric Thumbprint State (Zero PIN Fallback)
  const [isThumbprintVerified, setIsThumbprintVerified] = useState(false);
  const [isScanningThumb, setIsScanningThumb] = useState(false);
  const [thumbprintHash, setThumbprintHash] = useState<string | null>(null);

  // 1-Salon-per-QR Cryptographic Single-Use Binding
  const [isQrBurned, setIsQrBurned] = useState(false);

  // Query 7: Regional Multilingual Language Engine
  const [agentLanguage, setAgentLanguage] = useState<'en' | 'ur' | 'ur_roman' | 'ar'>('en');

  // Query 5 & 6: Editable Day-1 Agent Profile
  const [agentFullName, setAgentFullName] = useState('Kamran Tariq');
  const [agentWhatsApp, setAgentWhatsApp] = useState('+92-301-4567891');
  const [agentIdNumber, setAgentIdNumber] = useState('35202-8491023-1');
  const [agentTerritory, setAgentTerritory] = useState('Lahore West (Gulberg · DHA · Model Town)');
  const [agentSelfieCaptured, setAgentSelfieCaptured] = useState(true);
  const [isCameraCapturing, setIsCameraCapturing] = useState(false);
  const [isProfileThumbScanning, setIsProfileThumbScanning] = useState(false);
  const [profileThumbHash, setProfileThumbHash] = useState('SHA256: 9b8c-02e1-48af-9102-thumb-enrolled');

  // Operating Region & Banking Jurisdiction (Pakistan vs Europe vs MENA vs Global)
  const agentDetectedCountry = detectCountryFromPhone(agentWhatsApp);
  const [agentOperatingRegion, setAgentOperatingRegion] = useState<'PK' | 'EUROPE' | 'MENA_UAE' | 'MENA_SA' | 'GLOBAL'>('PK');

  // Query 8: Optional Guarantor & Legally Enforceable Terms
  const [guarantorName, setGuarantorName] = useState('Tariq Mehmood');
  const [guarantorContact, setGuarantorContact] = useState('+92-300-8419201');
  const [guarantorRelation, setGuarantorRelation] = useState('Elder Brother / Business Reference');
  const [hasAgreedToLegalTerms, setHasAgreedToLegalTerms] = useState(true);
  const [legalBiometricStampHash, setLegalBiometricStampHash] = useState('SHA256: 8f4a-9c02-legal-stamped-pk');
  const [isLegalBiometricScanning, setIsLegalBiometricScanning] = useState(false);

  // Bank & Payout Configuration with Custom Bank & European Sort Code Support
  const [agentPayoutMethod, setAgentPayoutMethod] = useState<'EasyPaisa' | 'JazzCash' | 'Bank Transfer (IBFT)' | 'Raast Instant Pay' | 'International Bank Wire'>('EasyPaisa');
  const [agentBankName, setAgentBankName] = useState('Meezan Bank');
  const [isCustomBank, setIsCustomBank] = useState(false);
  const [customBankInput, setCustomBankInput] = useState('');
  const [agentPayoutAccount, setAgentPayoutAccount] = useState('0302-9847102');
  const [agentPayoutTitle, setAgentPayoutTitle] = useState('Kamran Tariq');
  const [agentIban, setAgentIban] = useState('PK64MEZN0001020304050607');
  const [agentSwiftCode, setAgentSwiftCode] = useState('MEZNPKKA');
  const [agentSortCode, setAgentSortCode] = useState('20-04-15');
  const [agentNextOfKin, setAgentNextOfKin] = useState('Shahid Tariq (Brother)');
  const [payoutSaveStatus, setPayoutSaveStatus] = useState<string | null>(null);

  // Query 16: Biometric Lock for Profile Edits
  const [isBiometricModalOpenForEdit, setIsBiometricModalOpenForEdit] = useState(false);
  const [isBiometricScanningForEdit, setIsBiometricScanningForEdit] = useState(false);

  // Founder Master Kill-Switch (Query 9)
  const [isAgentSuspendedByFounder, setIsAgentSuspendedByFounder] = useState(false);

  // Step 4: In-Person Pairing QR State
  const [isPairingSimulated, setIsPairingSimulated] = useState(false);

  // Active Hub View Toggle: 'ONBOARDING' vs 'FLEET' vs 'LEDGER' vs 'RE_PAIR' (Query 2: Retired redundant Day-1 Profile)
  const [activeHubView, setActiveHubView] = useState<'ONBOARDING' | 'FLEET' | 'LEDGER' | 'RE_PAIR'>('ONBOARDING');
  const [selectedRePairSalon, setSelectedRePairSalon] = useState('Seven Cuts Studio');
  const [isRePairHandshakeActive, setIsRePairHandshakeActive] = useState(false);

  // Query 1: Ledger Perspective (Founder Breakup vs Agent Commission Only)
  const [ledgerPerspective, setLedgerPerspective] = useState<'FOUNDER' | 'AGENT'>('FOUNDER');

  // Query 2, 4, 15: Founder Fleet Command & Central Agent Dossiers
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
  const [selectedDossierAgent, setSelectedDossierAgent] = useState<any | null>(null);
  const [enrolledAgentsList, setEnrolledAgentsList] = useState<Array<{
    id: string;
    pin: string;
    name: string;
    phone: string;
    city: string;
    category: string;
    cnicOrId: string;
    payoutMethod: string;
    payoutAccount: string;
    payoutTitle: string;
    bankName?: string;
    iban?: string;
    swiftCode?: string;
    status: string;
    enrolledAt: string;
    selfieVerified: boolean;
    thumbHash: string;
    legalRemittanceAgreed: boolean;
    legalTermsText: string;
    guarantorName?: string;
    guarantorPhone?: string;
  }>>([
    {
      id: 'AGT-409',
      pin: '7892',
      name: 'Kamran Tariq',
      phone: '+92 301 4567891',
      city: 'Lahore West (Gulberg · DHA · Model Town)',
      category: 'Universal (All Salons, Barbershops & Parlors)',
      cnicOrId: '35202-8491023-1',
      payoutMethod: 'EasyPaisa',
      payoutAccount: '0302-9847102',
      payoutTitle: 'Kamran Tariq',
      bankName: 'Meezan Bank',
      iban: 'PK64MEZN0001020304050607',
      status: 'ACTIVE · ON-FIELD',
      enrolledAt: '12-Oct-2024 · 09:15 PKT',
      selfieVerified: true,
      thumbHash: 'SHA256: 9b8c-02e1-48af-9102-thumb-enrolled',
      legalRemittanceAgreed: true,
      legalTermsText: 'Agreed: Remit physical cash within 48 hours into WORKCRAFT Official Accounts. Subject to legal recovery under Laws of Pakistan.',
      guarantorName: 'Tariq Mehmood',
      guarantorPhone: '+92-300-8419201',
    },
  ]);

  // Day-1 Remote Enrollment Wizard Flow (Queries 5-14, 17-18)
  const [isRemoteEnrollmentWizardOpen, setIsRemoteEnrollmentWizardOpen] = useState(false);
  const [enrollmentLang, setEnrollmentLang] = useState<'en' | 'ur_roman' | 'ar'>('en');
  const [enrollmentStep, setEnrollmentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [enrollAgentName, setEnrollAgentName] = useState('Bilal Sheikh');
  const [enrollAgentPhone, setEnrollAgentPhone] = useState('+92 300 4819204');
  const [enrollAgentCity, setEnrollAgentCity] = useState('Karachi South');
  const [enrollAgentId, setEnrollAgentId] = useState('42101-9482019-3');
  const [enrollSelfieDone, setEnrollSelfieDone] = useState(false);
  const [enrollThumbDone, setEnrollThumbDone] = useState(false);
  const [enrollThumbHash, setEnrollThumbHash] = useState<string | null>(null);
  const [enrollPayoutMethod, setEnrollPayoutMethod] = useState('EasyPaisa');
  const [enrollPayoutTitle, setEnrollPayoutTitle] = useState('Bilal Sheikh');
  const [enrollPayoutAccount, setEnrollPayoutAccount] = useState('0300-4819204');
  const [enrollBankName, setEnrollBankName] = useState('Meezan Bank');
  const [enrollBankMobile, setEnrollBankMobile] = useState('+92 300 4819204');
  const [enrollIban, setEnrollIban] = useState('');
  const [enrollBicSwift, setEnrollBicSwift] = useState('');
  const [enrollNextOfKin, setEnrollNextOfKin] = useState('');
  const [enrollNextOfKinPhone, setEnrollNextOfKinPhone] = useState('');
  const [enrollGuarantorName, setEnrollGuarantorName] = useState('');
  const [enrollGuarantorPhone, setEnrollGuarantorPhone] = useState('');
  const [enrollAgreedTerms, setEnrollAgreedTerms] = useState(false);
  const [enrollLegalBiometricStamped, setEnrollLegalBiometricStamped] = useState(false);
  const [enrollLegalStampHash, setEnrollLegalStampHash] = useState<string | null>(null);
  const [isEnrollThumbScanning, setIsEnrollThumbScanning] = useState(false);
  const [isLegalStampScanning, setIsLegalStampScanning] = useState(false);
  const [cityValidationError, setCityValidationError] = useState<{ en: string; ur: string; ar: string } | null>(null);



  // Query 1: Auto-open enrollment when launched via direct WhatsApp link
  React.useEffect(() => {
    if (initialAutoOpenEnrollment || initialEnrollAgentData) {
      if (initialEnrollAgentData?.name) {
        setEnrollAgentName(initialEnrollAgentData.name);
        setEnrollPayoutTitle(initialEnrollAgentData.name);
      }
      if (initialEnrollAgentData?.phone) {
        setEnrollAgentPhone(initialEnrollAgentData.phone);
        setEnrollPayoutAccount(initialEnrollAgentData.phone);
        setEnrollBankMobile(initialEnrollAgentData.phone);
        const langs = getEnrollmentLanguagesForPhone(initialEnrollAgentData.phone);
        setEnrollmentLang(langs[0].code);
      }
      if (initialEnrollAgentData?.city) setEnrollAgentCity(initialEnrollAgentData.city);
      if (initialEnrollAgentData?.id) setEnrollAgentId(initialEnrollAgentData.id);
      setIsRemoteEnrollmentWizardOpen(true);
      setEnrollmentStep(1);
    }
  }, [initialAutoOpenEnrollment, initialEnrollAgentData]);

  // PWA Home Screen Installation Prompt (Query 18)
  const [showPwaInstallModal, setShowPwaInstallModal] = useState(false);
  const [isPwaInstalledConfirmed, setIsPwaInstalledConfirmed] = useState(false);

  // GPS Auto-Detection Handlers
  const handleCaptureGps = () => {
    setIsCapturingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
          setAddress('DHA Phase 5, Sector C, Lahore (Auto-Detected)');
          setIsCapturingGps(false);
        },
        () => {
          setCoords('31.4705° N, 74.4109° E');
          setAddress('Sector C, CCA Phase 5 DHA, Lahore');
          setIsCapturingGps(false);
        },
        { timeout: 3000 }
      );
    } else {
      setIsCapturingGps(false);
    }
  };

  // Step 1: Dispatch WhatsApp Invitation Link
  const handleDispatchStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonName.trim() || !ownerName.trim()) return;

    // Strict greeting rules: English = Dear Mr. [Name]; Roman Urdu / Arabic = Assalam-o-Alaikum [Name]
    const templateMsg = formatWelcomeMessage(clientOnboardingLanguage, ownerName, salonName, pairingKey);
    setInvitePreview(templateMsg);

    onSalonCreated({
      name: salonName,
      owner: ownerName,
      phone,
      location: address,
      coords,
    });

    setCurrentStep(2);
  };

  // Custom Service Add Handler
  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newItem: ServiceItem = {
      id: `custom_${Date.now()}`,
      name: newServiceName.trim(),
      price: parseInt(newServicePrice, 10) || 1500,
      enabled: true,
    };

    if (serviceCategory === 'MENS') {
      setMensServices((prev) => [...prev, newItem]);
    } else {
      setLadiesServices((prev) => [...prev, newItem]);
    }

    setNewServiceName('');
    setNewServicePrice('2000');
    setIsAddingCustomService(false);
  };

  const handleToggleService = (id: string) => {
    if (serviceCategory === 'MENS') {
      setMensServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
      );
    } else {
      setLadiesServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
      );
    }
  };

  const handleChangePrice = (id: string, price: number) => {
    if (serviceCategory === 'MENS') {
      setMensServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, price } : s))
      );
    } else {
      setLadiesServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, price } : s))
      );
    }
  };

  const activeServices = serviceCategory === 'MENS' ? mensServices : ladiesServices;

  // Open Interactive Payment Drawer
  const handleSelectPaymentMethod = (method: typeof setupPaymentMethod) => {
    // Recommendation 6: Strict Biometric Cash Gating - Zero cash outside Pakistan & Zero cash for self-onboarding
    if (method === 'Cash Collection' && (!detectedCountry.isDomestic || (userRole as string) === 'SALON_OWNER')) {
      return;
    }

    setSetupPaymentMethod(method);
    setDrawerError(null);
    setIsThumbprintVerified(false);

    if (method === 'Cash Collection' && cashLiabilityHeld + activePackage.setupFee > MAX_CASH_CEILING) {
      setDrawerError(`⚠️ PKR 50,000 Cash Velocity Limit Reached! (Held: PKR ${cashLiabilityHeld.toLocaleString()} + Package: PKR ${activePackage.setupFee.toLocaleString()}). You cannot collect cash until current funds are deposited.`);
    }

    const generatedTid = method === 'EasyPaisa'
      ? 'EP-' + Math.floor(10000000000 + Math.random() * 90000000000)
      : method === 'JazzCash'
      ? 'JC-' + Math.floor(10000000000 + Math.random() * 90000000000)
      : method === 'Bank Transfer (IBFT)'
      ? (detectedCountry.isDomestic ? 'RAAST-' + Math.floor(1000000000 + Math.random() * 9000000000) : 'SWIFT-WIRE-' + Math.floor(100000 + Math.random() * 900000))
      : method === 'Stripe / Card'
      ? 'pi_' + Math.random().toString(36).substring(2, 14)
      : 'CASH-THUMB-' + Math.floor(1000 + Math.random() * 9000);

    setDrawerTid(generatedTid);
    setDrawerSenderDetails(ownerName + ' (' + phone + ')');
    setIsPaymentDrawerOpen(true);

    // Recommendation 4: Automated Central SIM Gateway Webhook Simulation
    if (detectedCountry.isDomestic && method !== 'Cash Collection') {
      setSimWebhookState('listening');
      setTimeout(() => {
        setSimWebhookState('detected');
      }, 950);
    } else {
      setSimWebhookState('idle');
    }
  };

  // Submit Payment Drawer Verification (Server-to-Server Ledger Cross-Check Simulation)
  const handleVerifyDrawerPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setDrawerError(null);

    // Strict Setup Fee Rail Requirement: Transaction ID / Reference is mandatory
    if (!drawerTid || !drawerTid.trim()) {
      setDrawerError('Transaction ID (TID) / Raast Reference is strictly required for setup fee settlement verification.');
      return;
    }

    // Recommendation 6: Strict Biometric Thumbprint Check for Cash (Zero PIN Fallback)
    if (setupPaymentMethod === 'Cash Collection') {
      if (!detectedCountry.isDomestic || (userRole as string) === 'SALON_OWNER') {
        setDrawerError('Cash collection is strictly prohibited for international salons or self-onboarding salon owners.');
        return;
      }
      if (!isThumbprintVerified) {
        setDrawerError('Strict Biometric Verification Required: Touch your thumb to the sensor to authorize physical cash receipt.');
        return;
      }
      if (cashLiabilityHeld + activePackage.setupFee > MAX_CASH_CEILING) {
        setDrawerError(`Cannot proceed: PKR 50,000 cash velocity ceiling exceeded (Held: PKR ${cashLiabilityHeld.toLocaleString()}). Deposit current funds first.`);
        return;
      }
    }

    setDrawerIsSubmitting(true);

    // Simulate 4-Layer Ledger Verification (Anti-replay, checksum, amount check, status: paid)
    setTimeout(() => {
      setDrawerIsSubmitting(false);

      const commission = activePackage.agentCommission;
      let newRemainingDebt = cashLiabilityHeld;
      let commissionAdjusted = false;

      // Option A Net-Adjustment
      if (cashLiabilityHeld > 0 && detectedCountry.isDomestic) {
        newRemainingDebt = Math.max(0, cashLiabilityHeld - commission);
        setCashLiabilityHeld(newRemainingDebt);
        commissionAdjusted = true;
      }

      if (setupPaymentMethod === 'Cash Collection' && onCashCollected) {
        onCashCollected(activePackage.setupFee, salonName);
      }

      const isIntl = !detectedCountry.isDomestic;
      const receiptPayload = {
        method: setupPaymentMethod,
        senderDetails: drawerSenderDetails || ownerName,
        tid: drawerTid.trim(),
        amount: activePackage.setupFee,
        currency: activePackage.currency,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sha256Proof: 'sha256:' + (thumbprintHash || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)),
        recipientRoute: isIntl
          ? 'Dual Dispatch via WhatsApp (Salon Owner + Field Agent) · 24-48h Rolling Payout to Meezan IBAN PK64MEZN0001020304050607'
          : 'Central SIM Gateway Dual Dispatch (Salon Owner + Field Agent Kamran Tariq)',
        commissionAdjusted,
        commissionAmount: commission,
        remainingCashOwed: newRemainingDebt,
        status: 'paid' as const,
      };

      setVerifiedPaymentData(receiptPayload);
      setIsPaymentVerified(true); // Unlocks the state machine guard: status: paid!
      setIsPaymentDrawerOpen(false);
      setCurrentStep(4); // Advance to Step 4 QR pairing!
    }, 1100);
  };

  // Monthly Revenue Attribution Ledger for Field Agent Kamran Tariq
  const agentRevenueLedger = [
    {
      month: 'October 2026',
      activeSalons: 8,
      setupCount: 8,
      setupRevenue: 120000,
      maintenanceRevenue: 36000,
      totalRevenue: 156000,
      status: 'Settled via Webhook',
    },
    {
      month: 'September 2026',
      activeSalons: 6,
      setupCount: 6,
      setupRevenue: 90000,
      maintenanceRevenue: 27000,
      totalRevenue: 117000,
      status: 'Settled via Webhook',
    },
    {
      month: 'August 2026',
      activeSalons: 5,
      setupCount: 5,
      setupRevenue: 75000,
      maintenanceRevenue: 22500,
      totalRevenue: 97500,
      status: 'Settled via Webhook',
    },
  ];

  const totalLifetimeAttributed = agentRevenueLedger.reduce((acc, row) => acc + row.totalRevenue, 0);
  const totalSalonsOnboarded = 19;

  if (!isAgentAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8 p-6 sm:p-7 rounded-3xl border border-[#D9A441]/40 bg-[#102019] shadow-2xl space-y-6 animate-in zoom-in-95">
        <div className="text-center space-y-2">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#D9A441]/10 border border-[#D9A441]/30">
            <Lock className="size-8 text-[#D9A441]" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[.22em] text-[#00FFFF] block">
            WORKCRAFT FIELD FORCE · AGENT TERMINAL
          </span>
          <h2 className="text-2xl font-black text-white">Agent Portal Login</h2>
          <p className="text-xs text-white/60 font-sans">
            Enter your assigned Agent ID & Security PIN to access field onboarding and commission adjustments.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (agentIdInput.trim() && agentPinInput.trim()) {
              setIsAgentAuthenticated(true);
              setLoginError(null);
            } else {
              setLoginError('Please enter valid Agent ID and 4-digit PIN');
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-mono font-bold text-white/70 block mb-1">
              Field Agent ID
            </label>
            <input
              type="text"
              required
              value={agentIdInput}
              onChange={(e) => setAgentIdInput(e.target.value)}
              placeholder="e.g. AGT-409"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs font-mono font-bold text-[#00FFFF] focus:outline-none focus:border-[#00FFFF]"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-white/70 block mb-1">
              4-Digit Security PIN
            </label>
            <input
              type="password"
              required
              maxLength={4}
              value={agentPinInput}
              onChange={(e) => setAgentPinInput(e.target.value)}
              placeholder="••••"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs font-mono font-bold text-[#D9A441] tracking-widest focus:outline-none focus:border-[#D9A441]"
            />
          </div>

          {loginError && (
            <p className="text-xs font-mono text-red-400 text-center">{loginError}</p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] py-3 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
          >
            <Lock className="size-4" />
            <span>Unlock Agent Terminal & Pipeline →</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAgentIdInput('AGT-409');
              setAgentPinInput('7892');
              setIsAgentAuthenticated(true);
            }}
            className="w-full text-center text-[11px] font-mono text-[#00FFFF] hover:underline pt-1 block"
          >
            ⚡ Quick Login as Kamran Tariq (Verified Agent)
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. FIELD AGENT COMMAND HUB & OPERATIONAL ACTIONS (QUERIES 4 & 5) */}
      <div className="rounded-2xl border border-white/10 bg-[#102019] p-4 sm:p-5 shadow-lg space-y-4">
        {/* Top Header Row: Operational Hub Branding (Left) & Top-Right Language Switcher + Terminal Controls (Right) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[#00FFFF]/20 to-emerald-500/20 border border-[#00FFFF]/40 text-[#00FFFF]">
              <Smartphone className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-wide">
                  {agentLanguage === 'ur' ? 'فیلڈ ایجنٹ کمانڈ ہب' : agentLanguage === 'ar' ? 'بوابة الوكيل الميداني' : 'Field Agent Command Hub'}
                </h2>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                  LIVE SIM CLUSTER
                </span>
              </div>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                {agentLanguage === 'ur'
                  ? 'سیلون آن بورڈنگ، ڈیوائس پیئرنگ اور فلیٹ کمانڈ پورٹل'
                  : agentLanguage === 'ar'
                  ? 'تهيئة الصالونات والربط الميداني وإدارة الأسطول'
                  : 'Salon Onboarding · Direct QR Pairing · Fleet Registry'}
              </p>
            </div>
          </div>

          {/* Top-Right Language Switcher & Terminal Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center rounded-xl bg-black/60 border border-white/10 p-1 text-xs font-mono">
              <span className="px-1.5 text-white/40 flex items-center gap-1">
                <Globe className="size-3.5 text-[#00FFFF]" />
              </span>
              <button
                type="button"
                onClick={() => {
                  setAgentLanguage('en');
                  setEnrollmentLang('en');
                }}
                className={`px-2.5 py-1 rounded-lg transition ${agentLanguage === 'en' ? 'bg-[#D9A441] text-[#12241C] font-bold' : 'text-white/60 hover:text-white'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgentLanguage('ur');
                  setEnrollmentLang('ur_roman');
                }}
                className={`px-2.5 py-1 rounded-lg transition ${agentLanguage === 'ur' || agentLanguage === 'ur_roman' ? 'bg-[#D9A441] text-[#12241C] font-bold' : 'text-white/60 hover:text-white'}`}
              >
                اردو
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgentLanguage('ar');
                  setEnrollmentLang('ar');
                }}
                className={`px-2.5 py-1 rounded-lg transition ${agentLanguage === 'ar' ? 'bg-[#D9A441] text-[#12241C] font-bold' : 'text-white/60 hover:text-white'}`}
              >
                العربية
              </button>
            </div>

            {/* Lock Terminal */}
            <button
              type="button"
              onClick={() => setIsAgentAuthenticated(false)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-mono text-white/50 hover:text-amber-300 transition flex items-center gap-1 border border-white/10 hover:border-amber-400/40"
              title="Lock Agent Terminal & Logout"
            >
              <Lock className="size-3.5" />
              <span>Lock</span>
            </button>

            {/* PWA Icon */}
            <button
              type="button"
              onClick={() => setShowPwaInstallModal(true)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-mono border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition flex items-center gap-1"
              title="Add Field Agent Hub to Home Screen"
            >
              <Download className="size-3.5" />
              <span>PWA</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-white/50 hover:text-white hover:bg-white/[0.05] transition"
                title="Close Hub"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        </div>

        {/* Standardized Operational Button Sequence (Query 3 & 5):
            - When userRole === 'FOUNDER': Show all 6 operational buttons:
              1. + Add New Field Agent
              2. Agent Enrollment Link
              3. Onboard a Salon & Pairing Terminal
              4. Active Fleet Dossier
              5. Node Repair & Diagnostics
              6. Commission Ledger (Founder 3-way breakdown)
            - When userRole === 'FIELD_AGENT': Strictly hide '+ Add New Field Agent' and 'Active Fleet Dossier'.
              Shows:
              1. Agent Enrollment Link
              2. Onboard a Salon & Pairing Terminal
              3. My Commission Ledger (Agent personal commission only)
              4. Node Repair & Diagnostics
        */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Add New Field Agent (Founder-Only Privilege) */}
          {userRole === 'FOUNDER' && (
            <button
              type="button"
              onClick={() => setIsAddAgentModalOpen(true)}
              className="rounded-xl px-3.5 py-2 text-xs font-mono font-bold bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] shadow-md transition active:scale-95 flex items-center gap-1.5"
              title="Founder: Add New Field Agent & Dispatch WhatsApp Invitation"
            >
              <UserPlus className="size-3.5 text-[#12241C]" />
              <span>+ Add New Field Agent</span>
            </button>
          )}

          {/* 2. Agent Enrollment Link (Accessible to both Founder & Agent) */}
          <button
            type="button"
            onClick={() => setIsRemoteEnrollmentWizardOpen(true)}
            className="rounded-xl px-3.5 py-2 text-xs font-mono font-bold border border-[#00FFFF]/40 bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 text-[#00FFFF] shadow-md transition active:scale-95 flex items-center gap-1.5"
            title="Launch Day-1 Remote Agent Enrollment Wizard"
          >
            <Sparkles className="size-3.5 text-[#00FFFF]" />
            <span>Agent Enrollment Link</span>
          </button>

          {/* 3. Onboard a Salon & Pairing Terminal (Unified Single Flow - Query 3) */}
          <button
            type="button"
            onClick={() => {
              setActiveHubView('ONBOARDING');
              setCurrentStep(1);
            }}
            className={`rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeHubView === 'ONBOARDING'
                ? 'bg-[#00FFFF] text-[#12241C] shadow-md'
                : 'bg-white/[0.04] text-white/70 hover:text-white border border-white/10 hover:border-white/20'
            }`}
            title="Launch 4-Step Salon Lead Onboarding & Instant QR Pairing Handshake"
          >
            <Scissors className="size-3.5" />
            <span>{agentLanguage === 'ur' ? 'سیلون آن بورڈنگ اور پیئرنگ' : agentLanguage === 'ar' ? 'تهيئة الصالون والربط' : 'Onboard a Salon & Pairing'}</span>
          </button>

          {/* 4. Active Fleet Dossier (Founder-Only Privilege) */}
          {userRole === 'FOUNDER' && (
            <button
              type="button"
              onClick={() => setActiveHubView('FLEET')}
              className={`rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                activeHubView === 'FLEET'
                  ? 'bg-[#00FFFF] text-[#12241C] shadow-md'
                  : 'bg-white/[0.04] text-white/70 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              <Smartphone className="size-3.5" />
              <span>{agentLanguage === 'ur' ? 'ایکٹیو فلیٹ ڈوزیئر' : agentLanguage === 'ar' ? 'ملفات الوكلاء' : 'Active Fleet Dossier'}</span>
            </button>
          )}

          {/* 5. Node Repair & Diagnostics */}
          <button
            type="button"
            onClick={() => setActiveHubView('RE_PAIR')}
            className={`rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeHubView === 'RE_PAIR'
                ? 'bg-[#00FFFF] text-[#12241C] shadow-md'
                : 'bg-white/[0.04] text-white/70 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            <ShieldAlert className="size-3.5 text-amber-400" />
            <span>{agentLanguage === 'ur' ? 'ٹرمینل ریپیئر' : agentLanguage === 'ar' ? 'فحص المحطة' : 'Node Repair & Diagnostics'}</span>
          </button>

          {/* 6. Commission Ledger (Contextual Label by Role - Query 4) */}
          <button
            type="button"
            onClick={() => {
              setActiveHubView('LEDGER');
              if (userRole === 'FIELD_AGENT') {
                setLedgerPerspective('AGENT');
              }
            }}
            className={`rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition flex items-center gap-1.5 sm:ml-auto ${
              activeHubView === 'LEDGER'
                ? 'bg-[#00FFFF] text-[#12241C] shadow-md'
                : 'bg-white/[0.04] text-white/70 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            <FileText className="size-3.5" />
            <span>
              {userRole === 'FIELD_AGENT'
                ? agentLanguage === 'ur'
                  ? 'میرا کمیشن لیجر'
                  : agentLanguage === 'ar'
                  ? 'سجل عمولتي'
                  : 'My Commission Ledger'
                : agentLanguage === 'ur'
                ? 'کمیشن لیجر'
                : agentLanguage === 'ar'
                ? 'سجل العمولات'
                : 'Commission Ledger'}
            </span>
          </button>
        </div>
      </div>

      {/* Query 9: Founder Root Kill-Switch Suspended Overlay Screen */}
      {isAgentSuspendedByFounder && (
        <div className="rounded-2xl border-2 border-red-500 bg-red-950/80 p-5 sm:p-6 text-center space-y-3.5 shadow-2xl backdrop-blur-md animate-in zoom-in-95">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-600/30 border border-red-500 text-red-400">
            <AlertOctagon className="size-7" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[.25em] text-red-300 font-bold">
              ROOT DEACTIVATION ORDER ACTIVE · FOUNDER OVERRIDE
            </span>
            <h3 className="text-lg font-black text-white">Agent Terminal Suspended by WORKCRAFT Founder</h3>
            <p className="text-xs text-red-200/80 max-w-lg mx-auto font-sans leading-relaxed">
              Central Command has remotely locked Field Agent <strong>Kamran Tariq (#AGT-409)</strong>. All on-site physical cash collections, new salon leads, and cryptographic QR pairing token generation are frozen.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsAgentSuspendedByFounder(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition border border-white/20 flex items-center gap-2"
            >
              <Power className="size-3.5 text-emerald-400" />
              <span>Founder Restore: Unlock Agent Terminal</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW A: ONBOARDING SEQUENTIAL WIZARD (STEPS 1 - 4) */}
      {/* ========================================================================= */}
      {activeHubView === 'ONBOARDING' && (
        <div className="space-y-6">
          {/* Query 3: Sticky Persistent Tri-Language Switcher (English, Native Urdu, Arabic) */}
          <div className="sticky top-2 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-[#12241C]/95 p-3 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-[#00FFFF]" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {clientOnboardingLanguage === 'ur'
                  ? 'سیلون آن بورڈنگ زبان منتخب کریں (اردو فعال)'
                  : clientOnboardingLanguage === 'ar'
                  ? 'لغة تسجيل الصالون (العربية نشطة)'
                  : 'Salon Onboarding Language (English Active)'}
              </span>
            </div>
            <div className="flex items-center rounded-xl bg-black/60 border border-white/10 p-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setClientOnboardingLanguage('en')}
                className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center gap-1.5 ${
                  clientOnboardingLanguage === 'en'
                    ? 'bg-[#00FFFF] text-[#12241C]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
              <button
                type="button"
                onClick={() => setClientOnboardingLanguage('ur')}
                className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center gap-1.5 ${
                  clientOnboardingLanguage === 'ur'
                    ? 'bg-[#D9A441] text-[#12241C]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>🇵🇰</span>
                <span>اردو (Urdu)</span>
              </button>
              <button
                type="button"
                onClick={() => setClientOnboardingLanguage('ar')}
                className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center gap-1.5 ${
                  clientOnboardingLanguage === 'ar'
                    ? 'bg-emerald-400 text-[#12241C]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>🇦🇪</span>
                <span>العربية</span>
              </button>
            </div>
          </div>

          {/* Top Wizard Steps Progression Bar (Localized) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { num: 1, defaultTitle: 'Lead & Geo-Pin', icon: MapPin },
              { num: 2, defaultTitle: 'Service Menu', icon: Scissors },
              { num: 3, defaultTitle: 'Package & Setup Fee', icon: CreditCard },
              { num: 4, defaultTitle: 'Pairing QR', icon: QrCode },
            ].map((s) => (
              <div
                key={s.num}
                className={`rounded-xl border p-2.5 flex items-center gap-2.5 transition ${
                  currentStep === s.num
                    ? 'border-[#00FFFF] bg-[#00FFFF]/10 text-white font-bold'
                    : currentStep > s.num
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                    : 'border-white/5 bg-white/[0.02] text-white/40'
                }`}
              >
                <span
                  className={`grid size-6 place-items-center rounded-lg text-xs font-mono font-bold ${
                    currentStep === s.num
                      ? 'bg-[#00FFFF] text-[#12241C]'
                      : currentStep > s.num
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {currentStep > s.num ? '✓' : s.num}
                </span>
                <span className="text-xs truncate">{t.steps[s.num - 1] || s.defaultTitle}</span>
              </div>
            ))}
          </div>

          {/* STEP 1: LEAD INFO & HARDWARE GPS PINNING (FULLY LOCALIZED) */}
          {currentStep === 1 && (
            <PortalCard title={t.step1Title} kicker={t.step1Kicker}>
              <form onSubmit={handleDispatchStep1} className="space-y-4">
                {/* Query 1: Smart Recipient Routing & Auto Detection Display */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#D9A441] font-bold">
                        {t.routingLabel}
                      </span>
                      <p className="text-xs text-white/70 font-sans mt-0.5">
                        {t.routingDesc}
                      </p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0">
                      <Radio className="size-3.5 text-emerald-400 animate-pulse" />
                      <span>{t.routingBadge}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase text-[#00FFFF]">
                        {clientOnboardingLanguage === 'ur'
                          ? 'فعال زبان کی کیفیت:'
                          : clientOnboardingLanguage === 'ar'
                          ? 'حالة اللغة النشطة:'
                          : 'Active Language State:'}
                      </span>
                      <p className="text-[11px] text-white/55 font-sans">
                        {clientOnboardingLanguage === 'ur'
                          ? 'تمام فارمز، سروسز مینو اور واٹس ایپ الرٹس اردو میں تبدیل ہیں۔ اوپر موجود بار سے کسی بھی وقت زبان تبدیل کر سکتے ہیں۔'
                          : clientOnboardingLanguage === 'ar'
                          ? 'جميع الحقول وقوائم الخدمات ورسائل الواتساب معرّبة بالكامل. يمكنك تغيير اللغة من الشريط العلوي الثابت بأي وقت.'
                          : 'All input fields, services, and dispatches are fully synchronized. Switch anytime via the persistent top bar.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-[#D9A441] font-bold">
                        {clientOnboardingLanguage === 'ur' ? '🇵🇰 اردو (Urdu)' : clientOnboardingLanguage === 'ar' ? '🇦🇪 العربية (Arabic)' : '🇬🇧 English'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {/* Field 1: Salon Name */}
                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase text-white/55 block mb-1">
                      {t.salonNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t.salonNamePlaceholder}
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-[#F5F2E9] font-sans focus:outline-none focus:border-[#00FFFF]"
                    />
                  </div>

                  {/* Field 2: Owner Name */}
                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase text-white/55 block mb-1">
                      {t.ownerNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t.ownerNamePlaceholder}
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-[#F5F2E9] font-sans focus:outline-none focus:border-[#00FFFF]"
                    />
                  </div>

                  {/* Field 3: WhatsApp Number with Selectable Country Code & Digit Validation */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-mono font-bold uppercase text-white/55">
                        {t.phoneLabel}
                      </label>
                      <span className={`text-[10px] font-mono font-bold ${
                        nationalPhone.replace(/\D/g, '').length === selectedDialConfig.expectedDigits
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}>
                        {nationalPhone.replace(/\D/g, '').length === selectedDialConfig.expectedDigits
                          ? `✓ ${selectedDialConfig.expectedDigits}/${selectedDialConfig.expectedDigits} Digits Valid`
                          : `${nationalPhone.replace(/\D/g, '').length}/${selectedDialConfig.expectedDigits} Digits`}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {/* Searchable & Filterable Country Code Picker (Recommendation 1) */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsDialDropdownOpen(!isDialDropdownOpen)}
                          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-xs font-mono font-bold text-white hover:border-[#00FFFF] transition cursor-pointer"
                        >
                          <span className="text-base leading-none">{selectedDialConfig.flag}</span>
                          <span className="text-[#00FFFF]">{selectedDialCode}</span>
                          <span className="text-[9px] text-white/40">▼</span>
                        </button>

                        {/* Searchable Dropdown Flyout */}
                        {isDialDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1.5 z-50 w-72 max-h-72 rounded-2xl border border-[#00FFFF]/40 bg-[#102019] p-2.5 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
                            {/* Search Box */}
                            <div className="mb-2">
                              <input
                                type="text"
                                autoFocus
                                placeholder="Search country or code (e.g. UAE, +971, UK, +92)..."
                                value={countrySearchQuery}
                                onChange={(e) => setCountrySearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 text-xs font-mono text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FFFF]"
                              />
                            </div>

                            {/* Scrollable list */}
                            <div className="overflow-y-auto space-y-1 flex-1 pr-1">
                              {DIAL_CODE_OPTIONS.filter((d) =>
                                d.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
                                d.dialCode.includes(countrySearchQuery) ||
                                d.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
                              ).map((d) => (
                                <button
                                  key={d.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDialCode(d.dialCode);
                                    setIsDialDropdownOpen(false);
                                    setCountrySearchQuery('');
                                    const detected = detectCountryFromPhone(d.dialCode);
                                    if (!detected.isDomestic) {
                                      setSetupPaymentMethod('Stripe / Card');
                                      if (detected.region === 'MENA') {
                                        setClientOnboardingLanguage('ar');
                                      } else {
                                        setClientOnboardingLanguage('en');
                                      }
                                    } else {
                                      setSetupPaymentMethod('EasyPaisa');
                                      setClientOnboardingLanguage('ur');
                                    }
                                  }}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition text-left ${
                                    selectedDialCode === d.dialCode
                                      ? 'bg-[#00FFFF] text-[#12241C] font-bold'
                                      : 'hover:bg-white/[0.06] text-white/80'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-base">{d.flag}</span>
                                    <span className="truncate">{d.name}</span>
                                  </div>
                                  <span className={selectedDialCode === d.dialCode ? 'text-[#12241C] font-bold shrink-0 ml-1' : 'text-[#00FFFF] font-bold shrink-0 ml-1'}>
                                    {d.dialCode}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Local Phone Input */}
                      <input
                        type="tel"
                        required
                        placeholder={selectedDialConfig.formatHint}
                        value={nationalPhone}
                        onChange={(e) => setNationalPhone(e.target.value)}
                        className={`w-full rounded-xl border bg-white/[0.04] px-3 py-2.5 text-sm font-mono focus:outline-none ${
                          nationalPhone.replace(/\D/g, '').length === selectedDialConfig.expectedDigits
                            ? 'border-emerald-500/40 text-emerald-300 focus:border-emerald-400'
                            : 'border-white/10 text-[#00FFFF] focus:border-[#00FFFF]'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/45 block mt-1">
                      {t.phoneHint}: <strong className="text-white/80">{selectedDialCode} {nationalPhone}</strong> ({selectedDialConfig.name})
                    </span>
                  </div>
                </div>

                {/* Country Detection Banner */}
                <div className="rounded-xl border border-white/10 bg-black/40 p-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-[#00FFFF]" />
                    <span className="text-white/80">
                      {t.countryDetected}: <strong className="text-white">{detectedCountry.name}</strong> ({detectedCountry.currency} Pricing Engine)
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    detectedCountry.isDomestic
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-[#00FFFF]/30 bg-[#00FFFF]/10 text-[#00FFFF]'
                  }`}>
                    {detectedCountry.isDomestic ? 'Domestic Rail (PKR)' : 'International Rail (USD $)'}
                  </span>
                </div>

                {/* GPS Hardware Capture */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-white/55 uppercase flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-[#00FFFF]" />
                      <span>{t.coordsLabel}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCaptureGps}
                      className="text-[10px] font-mono font-bold text-[#00FFFF] hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className={`size-3 ${isCapturingGps ? 'animate-spin' : ''}`} />
                      <span>{isCapturingGps ? t.capturingGps : t.captureGps}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-black/40 p-2 text-xs font-mono">
                    <span className="text-[#F5F2E9] font-bold">{coords}</span>
                    <span className="text-emerald-400 text-[10px]">±3m Pin Accuracy</span>
                  </div>
                </div>

                {/* Field 4: Physical Address */}
                <div>
                  <label className="text-[11px] font-mono font-bold uppercase text-white/55 block mb-1">
                    {t.addressLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.addressPlaceholder}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-[#F5F2E9] font-sans focus:outline-none focus:border-[#00FFFF]"
                  />
                </div>

                {/* Outbound WhatsApp Preview Card */}
                <div className="rounded-xl border border-[#00FFFF]/30 bg-[#00FFFF]/5 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#00FFFF] font-bold uppercase flex items-center gap-1.5">
                      <Sparkles className="size-3.5" />
                      <span>{t.previewTitle}</span>
                    </span>
                    <span className="text-emerald-400 font-bold">{t.previewBadge}</span>
                  </div>
                  <div className="rounded-lg bg-black/60 p-3 text-xs font-mono text-[#F5F2E9] border border-white/10 whitespace-pre-line leading-relaxed">
                    {formatWelcomeMessage(clientOnboardingLanguage, ownerName, salonName, pairingKey)}
                  </div>
                </div>

                {/* Dispatch Action */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] py-3 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
                  >
                    <Send className="size-4" />
                    <span>{t.step1Next}</span>
                  </button>
                </div>
              </form>
            </PortalCard>
          )}

          {/* STEP 2: SERVICE MENU & LOCAL PRICING CONFIGURATION (FULLY LOCALIZED) */}
          {currentStep === 2 && (
            <PortalCard title={t.step2Title} kicker={t.step2Kicker}>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <p className="text-xs text-white/55 font-sans">
                    {t.step2Desc}
                  </p>

                  <div className="flex items-center rounded-xl bg-white/[0.04] border border-white/10 p-1">
                    <button
                      type="button"
                      onClick={() => setServiceCategory('MENS')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition ${
                        serviceCategory === 'MENS'
                          ? 'bg-[#00FFFF] text-[#12241C]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {t.mensCategory}
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceCategory('LADIES')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition ${
                        serviceCategory === 'LADIES'
                          ? 'bg-[#00FFFF] text-[#12241C]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {t.ladiesCategory}
                    </button>
                  </div>
                </div>

                {/* Services List */}
                <div className="space-y-2.5">
                  {activeServices.map((service) => (
                    <div
                      key={service.id}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition ${
                        service.enabled
                          ? 'border-white/10 bg-white/[0.04]'
                          : 'border-white/5 bg-white/[0.01] opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleService(service.id)}
                          className={`size-5 rounded-md border flex items-center justify-center transition ${
                            service.enabled
                              ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                              : 'border-white/20 bg-transparent text-transparent'
                          }`}
                        >
                          <Check className="size-3 stroke-[3]" />
                        </button>
                        <div>
                          <p className={`text-xs font-bold ${service.enabled ? 'text-[#F5F2E9]' : 'text-white/40'}`}>
                            {getLocalizedServiceName(service.name, clientOnboardingLanguage)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-[#D9A441]">{detectedCountry.prefix}</span>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => handleChangePrice(service.id, parseInt(e.target.value, 10) || 0)}
                          className="w-20 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#00FFFF]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Service Form */}
                {isAddingCustomService ? (
                  <form onSubmit={handleAddCustomService} className="rounded-xl border border-white/15 bg-white/[0.03] p-3.5 space-y-3">
                    <p className="text-xs font-mono font-bold text-[#00FFFF] uppercase">
                      {t.addCustomService}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        type="text"
                        required
                        placeholder={t.customNamePlaceholder}
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00FFFF]"
                      />
                      <input
                        type="number"
                        required
                        placeholder={`${t.customPricePlaceholder} (${detectedCountry.prefix})`}
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#00FFFF]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="rounded-lg bg-[#00FFFF] text-[#12241C] px-3.5 py-1.5 text-xs font-mono font-bold hover:bg-[#38e8e8]"
                      >
                        {t.addBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomService(false)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-mono text-white/60 hover:text-white"
                      >
                        {t.cancelBtn}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomService(true)}
                    className="flex items-center gap-2 text-xs font-mono font-bold text-[#00FFFF] hover:underline pt-1"
                  >
                    <Plus className="size-4" />
                    <span>{t.addCustomService}</span>
                  </button>
                )}

                {/* Step 2 Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-white"
                  >
                    <ArrowLeft className="size-4" />
                    <span>{t.step2Back}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-2 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] px-5 py-2.5 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
                  >
                    <span>{t.step2Next}</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </PortalCard>
          )}

          {/* STEP 3: SETUP FEE RAIL & STATE MACHINE LOCK (FULLY LOCALIZED) */}
          {currentStep === 3 && (
            <PortalCard title={t.step3Title} kicker={t.step3Kicker}>
              <div className="space-y-4">
                {/* 4 Packages Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-mono font-bold uppercase text-white/70 block">
                      {t.step3PackageHeading} ({detectedCountry.currency})
                    </label>
                    <span className="text-[10px] font-mono text-[#D9A441] font-bold">
                      {t.formulaNotice}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {currentPackageList.map((pkg) => {
                      const isSelected = selectedOnboardingPackage === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => {
                            setSelectedOnboardingPackage(pkg.id as any);
                            setExpandedPackageId(pkg.id);
                            setIsPaymentVerified(false); // reset verification if package changes
                          }}
                          className={`rounded-xl border p-3 text-left transition flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#00FFFF] bg-white/[0.08] ring-1 ring-[#00FFFF]'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-[#F5F2E9]">
                                {getLocalizedPackageName(pkg.name, clientOnboardingLanguage)}
                              </p>
                              {isSelected && <Check className="size-3.5 text-[#00FFFF]" />}
                            </div>
                            <p className="text-[10px] font-mono font-bold text-[#00FFFF] mt-1">
                              ⚡ {pkg.bookings}
                            </p>
                            <p className="text-[9px] text-white/55 font-sans mt-1">
                              {pkg.scope}
                            </p>
                          </div>
                          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-mono font-bold text-[#D9A441] block">
                                Setup: {pkg.prefix}{pkg.setupFee.toLocaleString()}
                              </span>
                              <span className="text-[9px] font-mono text-emerald-300 block">
                                Maint: {pkg.prefix}{pkg.monthlyMaint.toLocaleString()}/mo (10%)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedPackageId(expandedPackageId === pkg.id ? null : pkg.id);
                              }}
                              className="size-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-[#00FFFF] transition"
                              title="Expand package feature details"
                            >
                              {expandedPackageId === pkg.id ? (
                                <ChevronUp className="size-3.5 text-[#00FFFF]" />
                              ) : (
                                <ChevronDown className="size-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendation 3: Expandable Localized Package Feature Breakdown Accordion */}
                {expandedPackageId && (() => {
                  const targetPkg = currentPackageList.find((p) => p.id === expandedPackageId) || activePackage;
                  const features = getLocalizedPackageFeatures(targetPkg.id, clientOnboardingLanguage);

                  return (
                    <div className="rounded-2xl border border-[#00FFFF]/30 bg-black/40 p-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00FFFF] bg-[#00FFFF]/10 px-2 py-0.5 rounded border border-[#00FFFF]/20">
                            {t.featuresTitle}
                          </span>
                          <span className="text-xs font-bold text-[#F5F2E9]">
                            {getLocalizedPackageName(targetPkg.name, clientOnboardingLanguage)} ({targetPkg.prefix}{targetPkg.setupFee.toLocaleString()} + {targetPkg.prefix}{targetPkg.monthlyMaint.toLocaleString()}/mo)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedPackageId(null)}
                          className="text-[11px] font-mono text-white/50 hover:text-white flex items-center gap-1 self-start sm:self-center"
                        >
                          <span>{t.collapseFeatures}</span>
                          <ChevronUp className="size-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {features.map((feat, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                              feat.included
                                ? feat.highlight
                                  ? 'border-[#00FFFF]/40 bg-[#00FFFF]/5 text-[#F5F2E9]'
                                  : 'border-white/10 bg-white/[0.02] text-white/80'
                                : 'border-white/5 bg-white/[0.01] text-white/35 line-through'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {feat.included ? (
                                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                              ) : (
                                <X className="size-4 text-rose-500/60 shrink-0" />
                              )}
                              <span className={`font-sans ${feat.highlight ? 'font-bold text-[#00FFFF]' : ''}`}>
                                {feat.title}
                              </span>
                            </div>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded shrink-0 ${
                              feat.included
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                : 'bg-white/5 text-white/40'
                            }`}>
                              {feat.included ? t.includedLabel : t.notIncludedLabel}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[10px] font-mono text-white/50">
                        <span>⚡ 10% SLA: Cloud hosting, live menu edits &amp; &lt;60min auto-repair SLA.</span>
                        <span className="text-[#D9A441]">Zero-Cash Policy for recurring monthly fees.</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Selected Package Summary Box */}
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9A441]">
                      {t.oneTimeFeeLabel} · {getLocalizedPackageName(activePackage.name, clientOnboardingLanguage)}
                    </span>
                    <h4 className="text-2xl font-mono font-bold text-[#F5F2E9] mt-0.5">
                      {activePackage.prefix}{activePackage.setupFee.toLocaleString()}
                    </h4>
                    <p className="text-xs text-white/55 font-sans mt-0.5">
                      {t.monthlyMaintNote} ({activePackage.prefix}{activePackage.monthlyMaint.toLocaleString()} / mo).
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {isPaymentVerified ? (
                      <span className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-mono text-emerald-300 font-bold flex items-center gap-1.5 animate-in fade-in">
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        <span>{t.paymentConfirmed}</span>
                      </span>
                    ) : (
                      <span className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
                        <Lock className="size-3.5 text-amber-400" />
                        <span>{t.paymentUnverified}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Layer 1: Mandatory Registered Phone-Bound Guarantee Banner */}
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3.5 space-y-1.5 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-emerald-400" />
                      <span>{t.layer1Title}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#00FFFF] font-bold bg-[#00FFFF]/10 px-2 py-0.5 rounded border border-[#00FFFF]/30">
                      Zero Copy-Pasting Required
                    </span>
                  </div>
                  <p className="text-xs text-white/75 leading-relaxed">
                    {t.layer1Desc}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-white/60 pt-1">
                    <span>{t.boundNumber}: <strong className="text-[#00FFFF]">{phone}</strong></span>
                    <span>{t.boundOwner}: <strong className="text-white">{ownerName}</strong></span>
                  </div>
                </div>

                {/* Payment Rails Selector (Opens Interactive Verification Drawer) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-mono font-bold uppercase text-white/55 block">
                      Select Payment Channel to Verify Settlement
                    </label>
                    <span className="text-[10px] font-mono text-[#00FFFF]">
                      Clicking channel opens secure verification drawer
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(() => {
                      if (!detectedCountry.isDomestic) {
                        return [
                          { name: 'Stripe / Card', note: 'Global 3D-Secure · Apple Pay · 24-48h Wire' },
                          { name: 'Bank Transfer (IBFT)', note: 'Direct SWIFT / IBAN Wire to Meezan PK' },
                        ];
                      }
                      const pkChannels = [
                        { name: 'EasyPaisa', note: 'Merchant Till · Central SIM Webhook' },
                        { name: 'JazzCash', note: 'Corporate Till 789210 · Sub-2s Clearance' },
                        { name: 'Bank Transfer (IBFT)', note: 'Meezan Bank Raast 1LINK Reference' },
                      ];
                      if ((userRole as string) !== 'SALON_OWNER') {
                        pkChannels.push({ name: 'Cash Collection', note: 'Pakistan On-Site Only · Thumbprint Signed' });
                      }
                      return pkChannels;
                    })().map((m) => (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => handleSelectPaymentMethod(m.name as any)}
                        className={`rounded-xl border p-3 text-left transition relative group ${
                          setupPaymentMethod === m.name && isPaymentVerified
                            ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500'
                            : setupPaymentMethod === m.name
                            ? 'border-[#00FFFF] bg-white/[0.08] text-[#00FFFF]'
                            : 'border-white/10 bg-white/[0.02] text-white/55 hover:border-white/30 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <CreditCard className="size-4 text-[#D9A441]" />
                          {setupPaymentMethod === m.name && isPaymentVerified && (
                            <Check className="size-3.5 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-[#F5F2E9]">{m.name}</p>
                        <p className="text-[10px] font-mono text-white/45 mt-0.5">{m.note}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verified Payment Summary Badge (If verified) */}
                {isPaymentVerified && verifiedPaymentData && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 space-y-2 font-mono text-xs text-emerald-200 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                      <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                        <CheckCheck className="size-4 text-emerald-400" />
                        <span>Automated Settlement Proof Generated</span>
                      </span>
                      <span className="text-[10px] text-white/60">{verifiedPaymentData.timestamp}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-white/40 block text-[9px]">CHANNEL</span>
                        <span className="text-white font-bold">{verifiedPaymentData.method}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px]">TRANSACTION ID</span>
                        <span className="text-[#00FFFF] font-bold">{verifiedPaymentData.tid}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px]">ROUTED NOTIFICATION</span>
                        <span className="text-white">{verifiedPaymentData.recipientRoute}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px]">SECURITY DIGEST</span>
                        <span className="text-[#D9A441] text-[10px] truncate block">{verifiedPaymentData.sha256Proof}</span>
                      </div>
                    </div>

                    {/* Option A Commission Auto Net-Adjustment Feedback */}
                    {verifiedPaymentData.commissionAdjusted && (
                      <div className="mt-2 rounded-lg bg-black/40 border border-emerald-500/20 p-2 text-[11px] font-sans text-emerald-300/90 leading-relaxed">
                        <strong>Option A Commission Offset Applied:</strong> Kamran&apos;s commission of PKR {verifiedPaymentData.commissionAmount.toLocaleString()} has been automatically adjusted against his outstanding cash liability for {cashLiabilitySalon}. Remaining cash due to WORKCRAFT: <strong>PKR {verifiedPaymentData.remainingCashOwed.toLocaleString()}</strong>.
                      </div>
                    )}
                  </div>
                )}

                {/* Maintenance Policy & 10% SLA Notice */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold">
                    <AlertTriangle className="size-4 text-amber-400" />
                    <span>Zero-Cash Maintenance Policy: Strictly Digital Self-Pay</span>
                  </div>
                  <p className="text-xs text-white/65 font-sans leading-relaxed">
                    Physical cash is permissible <strong>strictly for initial on-site setup only</strong> (inside Pakistan). All subsequent recurring monthly maintenance ({activePackage.prefix}{activePackage.monthlyMaint.toLocaleString()}/mo) is self-paid digitally by the salon owner via the PWA. Field agents never accept cash for monthly fees.
                  </p>
                </div>

                {/* Continuous Care SLA Card */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#00FFFF] font-bold flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-[#00FFFF]" />
                      Continuous Care &amp; Uptime Guarantee (10% SLA)
                    </span>
                    <span className="text-emerald-400 font-bold">&lt; 60-Minute Resolution SLA</span>
                  </div>
                  <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                    Includes continuous 24/7 WhatsApp auto-reply, autonomous self-healing, real-time menu updates, and guaranteed priority recovery within 60 minutes.
                  </p>
                </div>

                {/* Step 3 Actions with STRICT STATE MACHINE LOCK (Query 6) */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-white"
                  >
                    <ArrowLeft className="size-4" />
                    <span>{t.step3Back}</span>
                  </button>

                  {isPaymentVerified ? (
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 text-xs font-mono font-bold hidden sm:flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="size-3.5 text-emerald-400" />
                        <span>Status: Paid ({verifiedPaymentData?.tid})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D9A441] to-amber-400 hover:from-[#e0b252] hover:to-amber-300 text-[#12241C] px-5 py-2.5 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-[0_0_20px_rgba(217,164,65,0.4)] animate-in fade-in"
                      >
                        <CheckCircle2 className="size-4 text-[#12241C]" />
                        <span>{t.step3Next}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectPaymentMethod(setupPaymentMethod)}
                        className="rounded-xl border border-[#00FFFF]/40 bg-[#00FFFF]/10 text-[#00FFFF] hover:bg-[#00FFFF]/20 px-3.5 py-2 text-xs font-mono font-bold transition flex items-center gap-1.5"
                      >
                        <CreditCard className="size-3.5" />
                        <span>{t.verifyBtn}</span>
                      </button>
                      <button
                        type="button"
                        disabled={true}
                        className="flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 text-white/30 px-5 py-2.5 text-xs font-mono font-bold uppercase cursor-not-allowed select-none opacity-40 shadow-none"
                        title="Strict Payment Gating: The 'Confirm Setup Fee & Launch Pairing QR' button remains strictly disabled until backend transaction verification returns status: paid"
                      >
                        <Lock className="size-3.5 text-amber-400" />
                        <span>Confirm Setup Fee &amp; Launch Pairing QR</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </PortalCard>
          )}

          {/* STEP 4: TERMINAL MULTI-DEVICE PAIRING & HANDSHAKE (FULLY LOCALIZED) */}
          {currentStep === 4 && (
            <PortalCard title={t.step4Title} kicker={t.step4Kicker}>
              <div className="space-y-4">
                {/* Settlement Verified Banner */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span>{t.setupVerified} ({verifiedPaymentData?.tid || 'TRX-OK'})</span>
                  </span>
                  <span className="text-[#00FFFF] font-bold">{salonName}</span>
                </div>

                {/* Handshake Mode Switcher: On-Site QR vs Remote Link & PWA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <span className="text-[11px] font-mono font-bold text-white/70">
                    {t.modeLabel}
                  </span>
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 shrink-0">
                    <button
                      type="button"
                      onClick={() => setStep4ViewMode('QR_SCAN')}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                        step4ViewMode === 'QR_SCAN'
                          ? 'bg-[#00FFFF] text-[#12241C]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <QrCode className="size-3.5" />
                      <span>{t.modeQr}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep4ViewMode('DIRECT_LINK')}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                        step4ViewMode === 'DIRECT_LINK'
                          ? 'bg-[#D9A441] text-[#12241C]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Smartphone className="size-3.5" />
                      <span>{t.modeLink}</span>
                    </button>
                  </div>
                </div>

                {/* Mode A: On-Site QR Scanner */}
                {step4ViewMode === 'QR_SCAN' ? (
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-center space-y-4">
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

                    <div className="space-y-1">
                      <p className="text-xs font-mono font-bold text-[#F5F2E9]">
                        Sequential Pairing Protocol: WhatsApp Multi-Device (Go-Fiber WebSocket)
                      </p>
                      <p className="text-xs font-mono text-[#00FFFF]">
                        {t.pairingKeyLabel} <span className="font-bold underline text-sm tracking-wider text-[#D9A441]">{pairingKey}</span>
                      </p>
                      <p className="text-[11px] text-white/50 font-sans">
                        {t.scanInstructions}
                      </p>
                    </div>

                    {/* Cryptographic Single-Use Burn Token Badge */}
                    <div className="rounded-xl border border-[#00FFFF]/30 bg-[#00FFFF]/5 p-3 text-left space-y-1.5 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#00FFFF] font-bold flex items-center gap-1.5 text-[11px]">
                          <ShieldCheck className="size-3.5" />
                          <span>{t.tokenBoundBadge}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          isQrBurned 
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {isQrBurned ? t.tokenBurned : t.tokenActive}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/60 font-sans leading-relaxed">
                        {t.tokenExpl}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Mode B: Remote Link & PWA Shortcut */
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-4">
                    <div className="rounded-xl border border-[#D9A441]/30 bg-[#D9A441]/10 p-4 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#D9A441] tracking-wider block">
                        {t.remoteLinkTitle}
                      </span>
                      <p className="text-xs text-white/80 font-sans leading-relaxed">
                        {t.remoteLinkDesc}
                      </p>
                      <div className="rounded-lg bg-black/70 p-2.5 font-mono text-xs text-[#00FFFF] break-all border border-white/10 select-all">
                        https://portal.workcraft.local/onboard/{salonName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'salon'}?key={pairingKey}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2 font-mono text-xs">
                      <span className="text-white font-bold block text-[11px]">
                        📱 Salon Owner PWA 1-Tap Home Screen Steps:
                      </span>
                      <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-white/70 font-sans">
                        <li>Open the link in Chrome (Android) or Safari (iOS).</li>
                        <li>Tap the browser menu (⋮ or Share) ➔ <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</li>
                        <li>Enter terminal pairing key: <strong className="text-[#00FFFF] font-mono">{pairingKey}</strong>.</li>
                        <li>The terminal operates with zero App Store friction and full offline fallback.</li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* Outbound Localized Welcome Dispatch Note */}
                <div className="rounded-xl border border-[#00FFFF]/20 bg-black/40 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#00FFFF] font-bold uppercase flex items-center gap-1.5">
                      <Send className="size-3 text-[#00FFFF]" />
                      <span>{t.outboundTitle} ({clientOnboardingLanguage === 'ur' ? 'اردو' : clientOnboardingLanguage === 'ar' ? 'العربية' : 'English'})</span>
                    </span>
                    <span className="text-emerald-400 font-bold">{t.outboundStatus}</span>
                  </div>
                  <div className="rounded-lg bg-black/60 p-3 text-xs font-mono text-[#F5F2E9] border border-white/10 whitespace-pre-line leading-relaxed">
                    {formatWelcomeMessage(clientOnboardingLanguage, ownerName, salonName, pairingKey)}
                  </div>
                </div>

                {/* Handshake Simulation */}
                {isPairingSimulated ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 space-y-2 animate-in zoom-in-95">
                    <div className="flex items-center justify-between text-emerald-300 text-xs font-mono font-bold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        <span>{t.handshakeSuccess}</span>
                      </div>
                      <span className="text-[10px] text-amber-300 font-bold bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
                        🔥 Ephemeral Token Burned
                      </span>
                    </div>
                    <p className="text-xs text-white/70 font-sans leading-relaxed">
                      {t.handshakeDesc}
                    </p>
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          setIsPairingSimulated(false);
                          setIsQrBurned(false);
                          setIsPaymentVerified(false);
                          if (onClose) onClose();
                        }}
                        className="rounded-lg bg-[#D9A441] text-[#12241C] px-4 py-2 text-xs font-mono font-bold uppercase hover:bg-[#e0b252]"
                      >
                        {t.completeBtn}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-white"
                    >
                      <ArrowLeft className="size-4" />
                      <span>{t.step4Back}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPairingSimulated(true);
                        setIsQrBurned(true);
                      }}
                      className="rounded-xl bg-[#00FFFF] hover:bg-[#38e8e8] text-[#12241C] px-5 py-2.5 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md flex items-center gap-2"
                    >
                      <Wifi className="size-4" />
                      <span>{t.simulateBtn} ({pairingKey}) →</span>
                    </button>
                  </div>
                )}
              </div>
            </PortalCard>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW FLEET: FOUNDER FLEET FORCE & CENTRAL AGENT REGISTRY (QUERIES 2, 4, 15) */}
      {/* ========================================================================= */}
      {activeHubView === 'FLEET' && (
        <PortalCard title="Fleet Force Command & Central Agent Registry" kicker="FOUNDER CENTRAL DISPATCH">
          <div className="space-y-5">
            {/* Founder Authority Banner */}
            <div className="rounded-2xl border border-[#D9A441]/40 bg-gradient-to-r from-[#D9A441]/10 via-[#102019] to-[#00FFFF]/5 p-4 sm:p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#D9A441]/20 border border-[#D9A441]/40 text-[#D9A441]">
                    <Smartphone className="size-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#D9A441] font-bold">
                        FOUNDER FLEET FORCE ENGINE
                      </span>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                        {enrolledAgentsList.length} ACTIVE FIELD AGENTS
                      </span>
                      <span className="rounded-full bg-[#00FFFF]/10 border border-[#00FFFF]/30 px-2 py-0.5 text-[9px] font-mono font-bold text-[#00FFFF]">
                        FOUNDER ONLY ACCESS
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      Central Field Force Fleet Command &amp; Dossiers
                    </h3>
                    <p className="text-xs text-white/60 font-mono mt-0.5">
                      Authorizations, Central Day-1 Encrypted Credentials, Hardware Biometric Hashes, and Territory Remittance Compliance.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsRemoteEnrollmentWizardOpen(true)}
                    className="rounded-xl border border-[#00FFFF]/40 bg-[#00FFFF]/10 hover:bg-[#00FFFF]/20 text-[#00FFFF] px-3.5 py-2.5 text-xs font-mono font-bold transition flex items-center gap-1.5"
                  >
                    <Sparkles className="size-3.5" />
                    <span>Test Day-1 Remote Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddAgentModalOpen(true)}
                    className="rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] px-4 py-2.5 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md flex items-center gap-2 shrink-0"
                  >
                    <UserPlus className="size-4" />
                    <span>+ Add New Field Agent</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Registered Field Agents Roster Cards (Query 15: Central Dossier Access) */}
            <div className="grid gap-4 md:grid-cols-2">
              {enrolledAgentsList.map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3.5 hover:border-[#D9A441]/40 transition group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-[#D9A441] to-[#b3822b] text-[#12241C] font-mono font-black text-base shadow">
                          {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        {agent.selfieVerified && (
                          <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full bg-emerald-500 text-black">
                            <Check className="size-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-[#D9A441] transition">
                            {agent.name}
                          </h4>
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                            #{agent.id}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 font-mono mt-0.5">{agent.phone}</p>
                        <p className="text-[11px] text-[#00FFFF] font-mono mt-0.5">{agent.city}</p>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                      {agent.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[9px] text-white/40 block uppercase">Identity / CNIC</span>
                      <span className="font-bold text-white truncate block">{agent.cnicOrId}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 block uppercase">Payout Channel</span>
                      <span className="font-bold text-[#D9A441] truncate block">{agent.payoutMethod}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-white/50 flex items-center gap-1">
                        <Fingerprint className="size-3 text-[#00FFFF]" />
                        <span className="truncate max-w-[150px]">{agent.thumbHash}</span>
                      </span>
                      <span className="text-emerald-400 font-bold">✓ Day-1 Complete</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-white/40 font-mono">
                      Enrolled: {agent.enrolledAt}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Query 6: Per-Agent Isolated Kill-Switch */}
                      <button
                        type="button"
                        onClick={() => {
                          const isSuspended = agent.status.includes('SUSPENDED');
                          const newStatus = isSuspended ? 'ACTIVE · ON-FIELD' : 'SUSPENDED · TERMINAL LOCKED';
                          setEnrolledAgentsList(prev => prev.map(a => a.id === agent.id ? { ...a, status: newStatus } : a));
                          if (agent.name === agentFullName) {
                            setIsAgentSuspendedByFounder(!isSuspended);
                          }
                        }}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold transition flex items-center gap-1 border ${
                          agent.status.includes('SUSPENDED')
                            ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            : 'border-red-500/40 bg-red-950/40 text-red-400 hover:bg-red-500/20 hover:border-red-500'
                        }`}
                        title={agent.status.includes('SUSPENDED') ? `Restore ${agent.name} terminal` : `Isolated Kill-Switch: Suspend ${agent.name}`}
                      >
                        <Power className="size-3" />
                        <span>{agent.status.includes('SUSPENDED') ? 'Restore Agent' : 'Kill-Switch'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedDossierAgent(agent)}
                        className="rounded-lg bg-white/5 hover:bg-white/15 px-3 py-1.5 text-xs font-mono font-bold text-white transition flex items-center gap-1.5 border border-white/10"
                      >
                        <FileText className="size-3 text-[#00FFFF]" />
                        <span>View Dossier</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PortalCard>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: RE-PAIR TERMINAL */}
      {/* ========================================================================= */}
      {activeHubView === 'RE_PAIR' && (
        <PortalCard title="Re-Pair Terminal Session (Hardware Recovery)" kicker="IN-HUB REPAIR">
          <div className="space-y-4">
            <p className="text-xs text-white/55 font-sans leading-relaxed">
              If a salon owner accidentally logs out of WhatsApp Web or changes their Android terminal device, use this sequential in-hub re-pairing tool.
            </p>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <label className="text-xs font-mono font-bold text-white/70 uppercase block">
                Select Connected Salon Node:
              </label>
              <select
                value={selectedRePairSalon}
                onChange={(e) => {
                  setSelectedRePairSalon(e.target.value);
                  setIsRePairHandshakeActive(false);
                }}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs font-mono text-[#F5F2E9] focus:outline-none focus:border-[#00FFFF]"
              >
                <option value="Seven Cuts Studio">Seven Cuts Studio · DHA Phase 5 Lahore</option>
                <option value="Noor Beauty Lounge">Noor Beauty Lounge · Clifton Karachi</option>
                <option value="The Groom Room">The Groom Room · F-6 Islamabad</option>
              </select>

              <div className="flex justify-center p-4">
                <div className="grid size-40 place-items-center rounded-xl bg-white p-3 border-2 border-[#00FFFF]">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                    <rect x="5" y="5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" rx="2" />
                    <rect x="10" y="10" width="12" height="12" fill="currentColor" rx="1" />
                    <rect x="73" y="5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" rx="2" />
                    <rect x="78" y="10" width="12" height="12" fill="currentColor" rx="1" />
                    <rect x="5" y="73" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" rx="2" />
                    <rect x="10" y="78" width="12" height="12" fill="currentColor" rx="1" />
                    <circle cx="34" cy="12" r="2.5" fill="currentColor" />
                    <circle cx="50" cy="12" r="2.5" fill="currentColor" />
                    <rect x="42" y="42" width="16" height="16" fill="#D9A441" rx="2" />
                  </svg>
                </div>
              </div>

              {isRePairHandshakeActive ? (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs font-mono text-emerald-300 space-y-1 animate-in fade-in">
                  <p className="font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span>WebSocket Re-Handshake Verified!</span>
                  </p>
                  <p className="text-[11px] text-white/75 font-sans text-center">
                    {selectedRePairSalon} is back online. Session token renewed on Central SIM Gateway.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRePairHandshakeActive(true)}
                  className="w-full rounded-xl bg-[#00FFFF] hover:bg-[#38e8e8] text-[#12241C] px-5 py-2.5 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
                >
                  Simulate Live Device Scan Handshake →
                </button>
              )}
            </div>
          </div>
        </PortalCard>
      )}

      {/* ========================================================================= */}
      {/* VIEW C: AGENT COMMISSION LEDGER & OPTION A NET-ADJUSTMENT (QUERY 11) */}
      {/* ========================================================================= */}
      {activeHubView === 'LEDGER' && (
        <PortalCard title="Agent Commission Attribution Ledger & Net-Settlement" kicker="OPTION A RECONCILIATION">
          <div className="space-y-4">
            {/* Query 1: Perspective Selector: Founder 3-Way Breakdown vs Agent Commission Only */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/60 p-3.5 rounded-2xl border border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D9A441] font-bold block">
                  LEDGER VIEW PERSPECTIVE (QUERY 1 COMPLIANT)
                </span>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  {ledgerPerspective === 'FOUNDER'
                    ? 'Founder View: Full 3-Way Breakup (Gross Revenue Received · Agent Commission Disbursed · Net WORKCRAFT Retained)'
                    : 'Agent View: Simple & Clear (Gross Deal Value · Commission Earned directly credited to your payment rail)'}
                </p>
              </div>
              {userRole === 'FOUNDER' ? (
                <div className="flex items-center rounded-xl bg-white/[0.04] border border-white/10 p-1 font-mono text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setLedgerPerspective('FOUNDER')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      ledgerPerspective === 'FOUNDER'
                        ? 'bg-[#D9A441] text-[#12241C] shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Founder Breakdown (Gross / Commission / Net)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLedgerPerspective('AGENT')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      ledgerPerspective === 'AGENT'
                        ? 'bg-[#00FFFF] text-[#12241C] shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Agent Commission View
                  </button>
                </div>
              ) : (
                <div className="rounded-xl bg-[#00FFFF]/10 border border-[#00FFFF]/30 px-3 py-1.5 font-mono text-xs text-[#00FFFF] font-bold">
                  ✓ Personal Field Earnings Active
                </div>
              )}
            </div>

            {/* Option A Net-Adjustment Banner with 24-Hour Remittance Countdown */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-4 space-y-3 font-mono">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                <div>
                  <span className="text-[10px] text-amber-300/80 uppercase tracking-wider font-bold">
                    Option A: Automated Commission Net-Adjustment Active
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">
                    Physical Cash Liability Remittance Engine
                  </h4>
                </div>
                <div className="rounded-xl bg-black/60 border border-amber-500/40 px-3 py-1.5 text-right">
                  <span className="text-[9px] text-amber-300/70 block uppercase">Remittance Countdown Window</span>
                  <span className="text-sm font-bold text-amber-300 flex items-center gap-1">
                    <Clock className="size-3.5 text-amber-400 animate-pulse" />
                    <span>{countdownHours}h {countdownMinutes}m remaining</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-black/40 border border-white/10 p-3">
                  <span className="text-white/50 block text-[10px]">PREVIOUS CASH COLLECTED</span>
                  <span className="text-base font-bold text-white mt-0.5 block">PKR 15,000</span>
                  <span className="text-[10px] text-white/50">{cashLiabilitySalon}</span>
                </div>
                <div className="rounded-xl bg-black/40 border border-emerald-500/20 p-3">
                  <span className="text-white/50 block text-[10px]">COMMISSION AUTO-OFFSET</span>
                  <span className="text-base font-bold text-emerald-400 mt-0.5 block">- PKR 3,000</span>
                  <span className="text-[10px] text-emerald-300">Seven Cuts Salon Deal (20%)</span>
                </div>
                <div className="rounded-xl bg-black/40 border border-amber-500/30 p-3">
                  <span className="text-white/50 block text-[10px]">NET CASH DUE TO WORKCRAFT</span>
                  <span className="text-base font-bold text-amber-300 mt-0.5 block">
                    PKR {cashLiabilityHeld.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-amber-300/80">Due into WORKCRAFT Official Accounts</span>
                </div>
              </div>

              <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                <strong>Why Option A is Safer:</strong> Every new onboarding commission automatically reduces the agent&apos;s physical cash custody liability from PKR 15,000 down to PKR {cashLiabilityHeld.toLocaleString()}, protecting WORKCRAFT&apos;s cash balance immediately without waiting for cross-bank transfers.
              </p>
            </div>

            {/* FOUNDER VIEW: 3-WAY BREAKUP (GROSS INFLOW · AGENT COMMISSION · NET WORKCRAFT RETAINED) */}
            {ledgerPerspective === 'FOUNDER' ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                    <span className="text-[10px] text-white/45 uppercase block">Gross Setup Inflow</span>
                    <span className="text-lg font-bold text-white mt-0.5 block">
                      PKR {totalLifetimeAttributed.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-white/50">Total Packages Sold</span>
                  </div>

                  <div className="rounded-xl border border-[#D9A441]/30 bg-[#D9A441]/10 p-3.5">
                    <span className="text-[10px] text-[#D9A441] uppercase block font-bold">Agent Commission Disbursed</span>
                    <span className="text-lg font-bold text-[#D9A441] mt-0.5 block">
                      PKR {Math.round(totalLifetimeAttributed * 0.2).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-white/50">20% Direct Agent Payout</span>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3.5">
                    <span className="text-[10px] text-emerald-300 uppercase block font-bold">Net WORKCRAFT Retained</span>
                    <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
                      PKR {Math.round(totalLifetimeAttributed * 0.8).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-300/80">80% Net Margin Secured</span>
                  </div>
                </div>

                {/* Founder Month-by-Month 3-Way Table */}
                <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden font-mono">
                  <div className="p-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between text-xs">
                    <span className="font-bold text-white uppercase text-[11px]">Founder Executive Settlement Ledger</span>
                    <span className="text-[10px] text-emerald-400 font-bold">80% NET MARGIN ATTRIBUTED</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/[0.02] text-white/50 border-b border-white/10">
                        <tr>
                          <th className="p-3">Month</th>
                          <th className="p-3 text-center">Salons Active</th>
                          <th className="p-3 text-right">Gross Package Inflow</th>
                          <th className="p-3 text-right text-[#D9A441]">Agent Comm (20%)</th>
                          <th className="p-3 text-right text-emerald-400">Net WORKCRAFT Retained (80%)</th>
                          <th className="p-3 text-center">Settlement Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {agentRevenueLedger.map((row) => {
                          const comm = Math.round(row.setupRevenue * 0.2);
                          const netRetained = row.setupRevenue - comm + row.maintenanceRevenue;
                          return (
                            <tr key={row.month} className="hover:bg-white/[0.02] transition">
                              <td className="p-3 font-bold text-[#F5F2E9]">{row.month}</td>
                              <td className="p-3 text-center text-[#00FFFF]">{row.activeSalons} Salons</td>
                              <td className="p-3 text-right text-white/70">PKR {row.setupRevenue.toLocaleString()}</td>
                              <td className="p-3 text-right font-bold text-[#D9A441]">PKR {comm.toLocaleString()}</td>
                              <td className="p-3 text-right font-bold text-emerald-400">PKR {netRetained.toLocaleString()}</td>
                              <td className="p-3 text-center">
                                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-300">
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              /* AGENT VIEW: SIMPLE & CLEAN (COMMISSION EARNED ONLY, NO FOUNDER OVERHEAD SHOWN) */
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                    <span className="text-[10px] text-white/45 uppercase block">Total Deals Closed</span>
                    <span className="text-lg font-bold text-[#00FFFF] mt-0.5 block">
                      19 Salons
                    </span>
                    <span className="text-[10px] text-white/50">{agentTerritory}</span>
                  </div>

                  <div className="rounded-xl border border-[#D9A441]/40 bg-[#D9A441]/10 p-3.5">
                    <span className="text-[10px] text-[#D9A441] uppercase block font-bold">Your Commission Earned</span>
                    <span className="text-lg font-bold text-[#D9A441] mt-0.5 block">
                      PKR 52,000
                    </span>
                    <span className="text-[10px] text-emerald-400">100% Disbursed to {agentPayoutMethod}</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                    <span className="text-[10px] text-white/45 uppercase block">Payout Destination</span>
                    <span className="text-sm font-bold text-white mt-1 block truncate">
                      {agentPayoutAccount} ({agentPayoutMethod})
                    </span>
                    <span className="text-[10px] text-emerald-300">Automated Direct IBFT</span>
                  </div>
                </div>

                {/* Agent Simplified Commission Table */}
                <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden font-mono">
                  <div className="p-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between text-xs">
                    <span className="font-bold text-white uppercase text-[11px]">Your Personal Commission Ledger</span>
                    <span className="text-[10px] text-[#00FFFF] font-bold">DIRECT TO WALLET / BANK</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/[0.02] text-white/50 border-b border-white/10">
                        <tr>
                          <th className="p-3">Month</th>
                          <th className="p-3 text-center">Salons Added</th>
                          <th className="p-3 text-right">Package Tier Sold</th>
                          <th className="p-3 text-right text-[#D9A441]">Your Commission</th>
                          <th className="p-3 text-center">Disbursement Rail</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {agentRevenueLedger.map((row) => {
                          const comm = Math.round(row.setupRevenue * 0.2);
                          return (
                            <tr key={row.month} className="hover:bg-white/[0.02] transition">
                              <td className="p-3 font-bold text-[#F5F2E9]">{row.month}</td>
                              <td className="p-3 text-center text-[#00FFFF]">{row.activeSalons} Salons</td>
                              <td className="p-3 text-right text-white/70">Growth Auto (PKR 20,000)</td>
                              <td className="p-3 text-right font-bold text-[#D9A441]">PKR {comm.toLocaleString()}</td>
                              <td className="p-3 text-center text-white/60">{agentPayoutMethod}</td>
                              <td className="p-3 text-center">
                                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-300">
                                  ✓ Cleared &amp; Disbursed
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PortalCard>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE PAYMENT VERIFICATION DRAWER (QUERIES 1, 2, 3, 4, 6) */}
      {/* ========================================================================= */}
      {isPaymentDrawerOpen && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-3 sm:p-5 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsPaymentDrawerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[520px] rounded-3xl border border-[#00FFFF]/40 bg-[#102019] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6 max-h-[92vh] overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[.2em] text-[#D9A441]">
                  SETTLEMENT CLEARANCE RAIL
                </span>
                <h3 className="mt-1 text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <CreditCard className="size-5 text-[#00FFFF]" />
                  <span>Verify {setupPaymentMethod} Settlement</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaymentDrawerOpen(false);
                }}
                className="size-8 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 transition active:scale-95 shrink-0"
                title="Close Settlement Rail"
                aria-label="Close Settlement Rail"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Official Pre-Configured WORKCRAFT Receiving Destination (Safe & Centralized) */}
            <div className="mt-4 rounded-xl border border-white/10 bg-black/50 p-3.5 space-y-1.5 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-white/50 block">
                Official WORKCRAFT Receiving Destination (Pre-Configured):
              </span>
              {setupPaymentMethod === 'EasyPaisa' && (
                <div className="space-y-0.5">
                  <p className="text-white font-bold text-sm">Merchant Till: 0300-WORKCRAFT</p>
                  <p className="text-emerald-400 text-[11px]">Title: WORKCRAFT Local Official · Telenor Microfinance</p>
                </div>
              )}
              {setupPaymentMethod === 'JazzCash' && (
                <div className="space-y-0.5">
                  <p className="text-white font-bold text-sm">Corporate Till: 789210</p>
                  <p className="text-emerald-400 text-[11px]">Title: WORKCRAFT Local · Mobilink Microfinance Bank</p>
                </div>
              )}
              {setupPaymentMethod === 'Bank Transfer (IBFT)' && (
                <div className="space-y-0.5">
                  <p className="text-white font-bold text-sm">Meezan Bank Ltd Pakistan · A/C: 01020304050607</p>
                  <p className="text-[#00FFFF] text-[11px]">IBAN: PK64MEZN0001020304050607 · SWIFT: MEZNPKKA</p>
                  <p className="text-[10px] text-white/50">
                    {detectedCountry.isDomestic
                      ? '1LINK & Raast Instant Reference Clearance'
                      : 'Direct 24-48h International SWIFT Wire Clearance to Pakistani Meezan Account'}
                  </p>
                </div>
              )}
              {setupPaymentMethod === 'Stripe / Card' && (
                <div className="space-y-0.5">
                  <p className="text-white font-bold text-sm">Stripe 3D-Secure Global Card Processing</p>
                  <p className="text-emerald-400 text-[11px]">Automated 24-48h Rolling Payout to Pakistani Meezan IBAN (PK64MEZN0001020304050607)</p>
                  <p className="text-[10px] text-white/50">Instant terminal activation granted immediately · Card forex conversion handled by issuing bank</p>
                </div>
              )}
              {setupPaymentMethod === 'Cash Collection' && (
                <div className="space-y-0.5">
                  <p className="text-white font-bold text-sm">On-Site Physical Cash Custody: Kamran Tariq</p>
                  <p className="text-amber-300 text-[11px]">Permissible exclusively for initial Pakistan onboarding setup (Hardware Thumbprint Signed)</p>
                  <p className="text-[10px] text-white/50">Held Cash Liability automatically recorded against agent ledger · Zero cash outside Pakistan</p>
                </div>
              )}
            </div>

            {/* Auto-Detected Dual Alert Recipient Routing Mode */}
            <div className="mt-3 rounded-xl border border-[#00FFFF]/30 bg-[#00FFFF]/5 p-2.5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#00FFFF] font-bold flex items-center gap-1.5">
                <Radio className="size-3.5 text-[#00FFFF] animate-pulse" />
                <span>Routing: ASSISTED (Auto-Detected Dual Alert)</span>
              </span>
              <span className="text-white/60 text-[10px]">Owner + Agent WhatsApp Push</span>
            </div>

            {/* Payer Input Form with Layer 1 Registered Phone Binding */}
            <form onSubmit={handleVerifyDrawerPayment} className="mt-3.5 space-y-3.5">
              {/* Layer 1 Phone-Bound Notice: Setup Fee vs Maintenance Policy */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-emerald-400" />
                    <span>Layer 1 Phone Policy</span>
                  </span>
                  <span className="text-white/60 text-[10px]">Setup Flexible · Maintenance Locked</span>
                </div>
                <p className="text-xs text-white/80 font-sans">
                  Registered Salon SIM: <strong className="text-[#00FFFF] font-mono">{phone}</strong> ({ownerName})
                </p>
                <p className="text-[10px] text-white/60 font-sans">
                  Setup fee may be paid from any authorized account. All future recurring 10% monthly maintenance ({activePackage.prefix}{activePackage.monthlyMaint.toLocaleString()}/mo) must strictly originate from registered SIM {phone}.
                </p>
              </div>

              {/* Recommendation 4: Automated Central SIM Gateway Webhook Simulation */}
              {detectedCountry.isDomestic && setupPaymentMethod !== 'Cash Collection' && (
                <div className="p-3 rounded-xl border border-[#00FFFF]/30 bg-[#00FFFF]/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#00FFFF] font-bold flex items-center gap-1.5">
                      <Radio className="size-3.5 text-[#00FFFF] animate-pulse" />
                      <span>Central SIM Gateway Webhook</span>
                    </span>
                    <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Live Listener Active
                    </span>
                  </div>
                  
                  {simWebhookState === 'listening' ? (
                    <p className="text-[11px] text-white/70 font-sans flex items-center gap-2">
                      <RotateCcw className="size-3 animate-spin text-[#00FFFF]" />
                      <span>Listening on SIM cluster for incoming transfer from <strong>{phone}</strong>...</span>
                    </p>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200 space-y-0.5">
                      <p className="font-bold flex items-center gap-1 text-emerald-300">
                        <CheckCircle2 className="size-3.5 text-emerald-400" />
                        <span>Incoming Telco Webhook Auto-Captured:</span>
                      </p>
                      <p className="font-mono text-[10px] text-white/80">
                        Transfer of {activePackage.prefix}{activePackage.setupFee.toLocaleString()} detected from registered SIM {phone} on {setupPaymentMethod}. TID: {drawerTid}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-white/50 font-sans">
                      If paying from another SIM, edit sender details below.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSimWebhookState('listening');
                        setTimeout(() => {
                          const autoTid = setupPaymentMethod === 'EasyPaisa'
                            ? `EP-${Math.floor(10000000000 + Math.random() * 90000000000)}`
                            : setupPaymentMethod === 'JazzCash'
                            ? `JC-${Math.floor(10000000000 + Math.random() * 90000000000)}`
                            : `RAAST-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
                          setDrawerTid(autoTid);
                          setDrawerSenderDetails(`${ownerName} (${phone})`);
                          setSimWebhookState('detected');
                        }, 500);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#00FFFF] text-[10px] font-mono font-bold transition active:scale-95"
                    >
                      ⚡ Re-scan Webhook
                    </button>
                  </div>
                </div>
              )}

              {/* Recommendation 5: International Wire / Stripe Rolling Clearance (24-48h) */}
              {!detectedCountry.isDomestic && (
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-emerald-400" />
                      <span>24-48h Rolling International Settlement Rail</span>
                    </span>
                    <span className="text-[10px] text-[#00FFFF] bg-[#00FFFF]/10 px-2 py-0.5 rounded border border-[#00FFFF]/20">
                      Instant Terminal Activation
                    </span>
                  </div>
                  <p className="text-[11px] text-white/75 font-sans leading-relaxed">
                    Cross-border wire/Stripe funds take 24–48 hours to clear into WORKCRAFT&apos;s Pakistani Meezan Bank account. The terminal is <strong>unlocked immediately with zero downtime</strong>, and a dual confirmation receipt is dispatched via WhatsApp to both salon owner and field agent.
                  </p>
                </div>
              )}

              <div>
                <label className="text-[11px] font-mono font-bold uppercase text-white/60 block mb-1">
                  Payer Sender Phone / Account Details *
                </label>
                <input
                  type="text"
                  required
                  value={drawerSenderDetails || `${ownerName} (${phone})`}
                  onChange={(e) => setDrawerSenderDetails(e.target.value)}
                  placeholder={`e.g. ${ownerName} (${phone}) or alternate bank/mobile`}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-[#00FFFF]"
                />
                <span className="text-[10px] text-white/40 block mt-0.5">
                  Initial setup fee can be paid from any account. Recurring 10% monthly maintenance is strictly bound to registered SIM.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-white/70">
                    Transaction ID (TID) / Raast 1LINK Reference *
                  </label>
                  <span className="text-[10px] font-mono text-[#00FFFF]">
                    Auto-captured from incoming SMS
                  </span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. EP-98412850231 or 1LINK Ref"
                  value={drawerTid}
                  onChange={(e) => setDrawerTid(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-mono text-[#00FFFF] focus:outline-none focus:border-[#00FFFF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold uppercase text-white/60 block mb-1">
                  Required Settlement Amount (Locked)
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${activePackage.prefix} ${activePackage.setupFee.toLocaleString()} (${activePackage.name})`}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-mono font-bold text-[#D9A441] select-none cursor-not-allowed"
                />
              </div>

              {/* Query 8: Dual Cash Risk Guard & Hard PKR 50,000 Ceiling for Cash Collection */}
              {setupPaymentMethod === 'Cash Collection' && (
                <div className="space-y-3">
                  <div className={`rounded-xl border p-3 font-mono text-xs space-y-1.5 ${
                    cashLiabilityHeld + activePackage.setupFee > MAX_CASH_CEILING
                      ? 'border-red-500/50 bg-red-950/40 text-red-200'
                      : 'border-amber-500/30 bg-amber-950/30 text-amber-200'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="size-4 text-amber-400" />
                        <span>Cash Custody Velocity Guard</span>
                      </span>
                      <span>
                        PKR {(cashLiabilityHeld + activePackage.setupFee).toLocaleString()} / {MAX_CASH_CEILING.toLocaleString()} MAX
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-black/60 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          cashLiabilityHeld + activePackage.setupFee > MAX_CASH_CEILING
                            ? 'bg-red-500'
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${Math.min(100, ((cashLiabilityHeld + activePackage.setupFee) / MAX_CASH_CEILING) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-white/70 font-sans">
                      {cashLiabilityHeld + activePackage.setupFee > MAX_CASH_CEILING
                        ? '🚨 Hard limit exceeded! You hold more than PKR 50,000 cash. Cash collection is strictly locked until you deposit current dues at an EasyPaisa shop or Meezan Bank.'
                        : `Current held liability: PKR ${cashLiabilityHeld.toLocaleString()}. 48-Hour Alarming Window active for each deal.`}
                    </p>
                  </div>

                  {/* Query 7: Strict Biometric Hardware Thumbprint Verification (Zero PIN Fallback) */}
                  <div className={`p-4 rounded-2xl border text-center space-y-2.5 transition ${
                    isThumbprintVerified
                      ? 'border-emerald-500/50 bg-emerald-950/30'
                      : 'border-[#00FFFF]/40 bg-[#00FFFF]/5'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/80 font-bold uppercase flex items-center gap-1.5">
                        <Fingerprint className="size-4 text-[#00FFFF]" />
                        <span>Biometric Thumbprint Authorization</span>
                      </span>
                      <span className="text-[9px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        ZERO PIN FALLBACK
                      </span>
                    </div>

                    <div className="flex justify-center py-1">
                      <button
                        type="button"
                        disabled={isScanningThumb || isThumbprintVerified || (cashLiabilityHeld + activePackage.setupFee > MAX_CASH_CEILING)}
                        onClick={() => {
                          setIsScanningThumb(true);
                          setTimeout(() => {
                            setIsScanningThumb(false);
                            setIsThumbprintVerified(true);
                            setThumbprintHash('SHA256: 9b8c-02e1-48af-9102-thumb-verified');
                          }, 900);
                        }}
                        className={`relative grid size-16 place-items-center rounded-2xl border-2 transition active:scale-95 ${
                          isThumbprintVerified
                            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                            : isScanningThumb
                            ? 'border-[#00FFFF] bg-[#00FFFF]/20 text-[#00FFFF] animate-pulse shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                            : 'border-white/20 bg-white/5 text-white/60 hover:border-[#00FFFF] hover:text-[#00FFFF]'
                        }`}
                        title="Touch your thumb to authorize physical cash collection"
                      >
                        <Fingerprint className={`size-8 ${isScanningThumb ? 'animate-bounce' : ''}`} />
                        {isThumbprintVerified && (
                          <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-emerald-500 text-black">
                            <Check className="size-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] font-mono text-center">
                      {isScanningThumb ? (
                        <span className="text-[#00FFFF]">Reading optical hardware sensor...</span>
                      ) : isThumbprintVerified ? (
                        <span className="text-emerald-400 font-bold">✓ Thumbprint Authenticated ({thumbprintHash})</span>
                      ) : (
                        <span className="text-white/65">Press thumb on sensor to sign physical cash custody</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* 4-Layer Anti-Fraud Notice */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-[10px] font-mono text-emerald-300/90 space-y-1">
                <span className="font-bold flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="size-3.5" />
                  <span>4-Layer Server Ledger Verification Active</span>
                </span>
                <p className="font-sans text-white/65 leading-relaxed">
                  System verifies cryptographic TID uniqueness, amount matching, and incoming server ledger events. Edited or duplicated slips are rejected automatically.
                </p>
              </div>

              {drawerError && (
                <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-2.5 text-xs font-mono text-red-300">
                  {drawerError}
                </div>
              )}

              {/* Query 2: Proceed Button to Step 4 QR Pairing */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentDrawerOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 py-3 text-xs font-mono text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={drawerIsSubmitting || (setupPaymentMethod === 'Cash Collection' && cashLiabilityHeld + activePackage.setupFee > MAX_CASH_CEILING)}
                  className="flex-[2] rounded-xl bg-[#00FFFF] hover:bg-[#38e8e8] text-[#12241C] py-3 text-xs font-mono font-black uppercase transition active:scale-95 shadow-[0_0_20px_rgba(0,255,255,0.35)] flex items-center justify-center gap-2"
                >
                  {drawerIsSubmitting ? (
                    <>
                      <RotateCcw className="size-4 animate-spin text-[#12241C]" />
                      <span>Verifying Webhook &amp; Binding...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4 text-[#12241C]" />
                      <span>Verify Webhook &amp; Proceed to Step 4 QR Pairing →</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ADD NEW FIELD AGENT MODAL (FOUNDER ONLY - QUERIES 2, 3, 4) */}
      {/* ========================================================================= */}
      <AddNewAgentModal
        isOpen={isAddAgentModalOpen}
        onClose={() => setIsAddAgentModalOpen(false)}
        onAgentAdded={(newAgent) => {
          setEnrolledAgentsList((prev) => [
            ...prev,
            {
              id: newAgent.id,
              pin: newAgent.pin,
              name: newAgent.name,
              phone: newAgent.phone,
              city: newAgent.city,
              category: newAgent.category,
              cnicOrId: newAgent.phone.startsWith('+92')
                ? '35202-9841201-7'
                : newAgent.phone.startsWith('+971')
                ? '784-1992-8192019-1'
                : 'ID-AUTO-DETECTED',
              payoutMethod: newAgent.phone.startsWith('+92') ? 'EasyPaisa' : 'International Bank Wire',
              payoutAccount: newAgent.phone,
              payoutTitle: newAgent.name,
              status: 'INVITATION DISPATCHED',
              enrolledAt: 'Pending Day-1 Activation',
              selfieVerified: false,
              thumbHash: 'PENDING ENROLLMENT',
              legalRemittanceAgreed: false,
              legalTermsText: 'Pending remote acceptance',
            },
          ]);
        }}
        onOpenRemoteEnrollment={(newAgent) => {
          setEnrollAgentName(newAgent.name);
          setEnrollAgentPhone(newAgent.phone);
          setEnrollAgentCity(newAgent.city);
          const detected = detectCountryFromPhone(newAgent.phone);
          if (detected.code === 'PK') setEnrollAgentId('35202-9841201-7');
          else if (detected.code === 'AE') setEnrollAgentId('784-1992-8192019-1');
          else if (detected.code === 'SA') setEnrollAgentId('2491028491');
          else setEnrollAgentId('GB-8491028-A');
          setEnrollPayoutTitle(newAgent.name);
          setEnrollPayoutAccount(newAgent.phone);

          // Query 1: Default enrollment language to regional preference
          const allowed = getEnrollmentLanguagesForPhone(newAgent.phone);
          setEnrollmentLang(allowed[0].code);

          setEnrollmentStep(1);
          setIsRemoteEnrollmentWizardOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* 2. CENTRAL AGENT DAY-1 DOSSIER MODAL (QUERY 15) */}
      {/* ========================================================================= */}
      {selectedDossierAgent && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-black/85 p-3 sm:p-5 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedDossierAgent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] rounded-3xl border border-[#D9A441]/40 bg-[#102019] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6 max-h-[92vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#D9A441]/20 border border-[#D9A441]/40 text-[#D9A441]">
                  <FileText className="size-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[.2em] text-[#D9A441]">
                    CENTRAL AGENT DOSSIER (QUERY 15)
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    {selectedDossierAgent.name} (#{selectedDossierAgent.id})
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedDossierAgent(null)}
                className="rounded-lg p-1.5 text-white/55 hover:text-white transition"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Dossier Header Info */}
            <div className="flex items-center gap-4 rounded-2xl bg-black/50 border border-white/10 p-3.5">
              <div className="relative shrink-0">
                <div className="size-16 rounded-2xl bg-gradient-to-tr from-[#12241C] to-slate-800 border-2 border-emerald-400 grid place-items-center font-mono font-bold text-lg text-white">
                  {selectedDossierAgent.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-emerald-500 text-black">
                  <Check className="size-3 stroke-[3]" />
                </span>
              </div>
              <div className="min-w-0 flex-1 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{selectedDossierAgent.name}</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {selectedDossierAgent.status}
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-0.5">{selectedDossierAgent.phone}</p>
                <p className="text-[11px] text-[#00FFFF] mt-0.5">{selectedDossierAgent.city}</p>
              </div>
            </div>

            {/* Dossier Detail Fields */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-xl border border-white/10">
                <div>
                  <span className="text-[10px] text-white/40 block uppercase">NATIONAL ID / CNIC</span>
                  <span className="font-bold text-white text-sm">{selectedDossierAgent.cnicOrId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block uppercase">SECURITY PIN</span>
                  <span className="font-bold text-[#D9A441] text-sm">{selectedDossierAgent.pin}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-white/40 block uppercase">OPTICAL THUMBPRINT HARDWARE ENCRYPTION</span>
                  <span className="font-bold text-[#00FFFF] text-xs flex items-center gap-1.5 mt-0.5">
                    <Fingerprint className="size-3.5" />
                    <span>{selectedDossierAgent.thumbHash}</span>
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-black/40 p-3 border border-white/10 space-y-1">
                <span className="text-[10px] text-white/40 block uppercase">COMMISSION PAYOUT ROUTE</span>
                <p className="text-sm font-bold text-[#D9A441]">
                  {selectedDossierAgent.payoutMethod} · {selectedDossierAgent.payoutAccount}
                </p>
                <p className="text-[11px] text-white/60 font-sans">
                  Account Title: <strong>{selectedDossierAgent.payoutTitle}</strong> {selectedDossierAgent.iban && `· IBAN: ${selectedDossierAgent.iban}`}
                </p>
              </div>

              {selectedDossierAgent.guarantorName && (
                <div className="rounded-xl bg-black/40 p-3 border border-white/10 space-y-1">
                  <span className="text-[10px] text-white/40 block uppercase">GUARANTOR REFERENCE (PAKISTAN CASH ONLY)</span>
                  <p className="text-xs text-white">
                    <strong>{selectedDossierAgent.guarantorName}</strong> ({selectedDossierAgent.guarantorPhone})
                  </p>
                </div>
              )}

              <div className="rounded-xl bg-emerald-950/20 p-3 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <ShieldCheck className="size-3.5" />
                  <span>LEGAL REMITTANCE SIGNATURE RECORD</span>
                </span>
                <p className="text-[11px] text-white/80 font-sans leading-relaxed">
                  {selectedDossierAgent.legalTermsText}
                </p>
                <span className="text-[10px] text-emerald-300 block pt-1 border-t border-emerald-500/20">
                  ✓ Digital Timestamp: {selectedDossierAgent.enrolledAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const isSuspended = selectedDossierAgent.status.includes('SUSPENDED');
                  const newStatus = isSuspended ? 'ACTIVE · ON-FIELD' : 'SUSPENDED · TERMINAL LOCKED';
                  setEnrolledAgentsList(prev => prev.map(a => a.id === selectedDossierAgent.id ? { ...a, status: newStatus } : a));
                  setSelectedDossierAgent((prev: any) => prev ? { ...prev, status: newStatus } : null);
                  if (selectedDossierAgent.name === agentFullName) {
                    setIsAgentSuspendedByFounder(!isSuspended);
                  }
                }}
                className={`flex-1 rounded-xl py-2.5 text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-1.5 border ${
                  selectedDossierAgent.status.includes('SUSPENDED')
                    ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                    : 'border-red-500/40 bg-red-950/40 text-red-400 hover:bg-red-500/25'
                }`}
              >
                <Power className="size-3.5" />
                <span>{selectedDossierAgent.status.includes('SUSPENDED') ? 'Restore Agent' : 'Kill-Switch: Suspend'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDossierAgent(null)}
                className="flex-1 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] py-2.5 text-xs font-mono font-bold uppercase transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BIOMETRIC RE-SCAN MODAL FOR PROFILE EDITS (QUERY 16) */}
      {/* ========================================================================= */}
      {isBiometricModalOpenForEdit && (
        <div
          className="fixed inset-0 z-[95] grid place-items-center bg-black/85 p-3 sm:p-5 backdrop-blur-md"
          onClick={() => setIsBiometricModalOpenForEdit(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-3xl border border-[#00FFFF]/40 bg-[#102019] p-6 text-center shadow-2xl animate-in zoom-in-95 duration-150 space-y-4 relative"
          >
            {/* Top-Right [X] Close Button (Query 6) */}
            <button
              type="button"
              onClick={() => setIsBiometricModalOpenForEdit(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-white/55 hover:text-white hover:bg-white/10 transition"
              aria-label="Close biometric gate"
            >
              <X className="size-5" />
            </button>

            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#00FFFF]/10 border border-[#00FFFF]/40 text-[#00FFFF]">
              <Fingerprint className="size-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00FFFF] font-bold">
                BIOMETRIC SECURITY GATE (QUERY 16)
              </span>
              <h3 className="text-lg font-black text-white">
                Authorize Profile &amp; Payout Update
              </h3>
              <p className="text-xs text-white/70 font-sans max-w-sm mx-auto leading-relaxed">
                To prevent unauthorized changes to commission accounts, please touch and hold the hardware optical thumbprint sensor below.
              </p>
            </div>

            {/* Interactive Optical Thumb Sensor */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => {
                  setIsBiometricScanningForEdit(true);
                  setTimeout(() => {
                    setIsBiometricScanningForEdit(false);
                    setIsBiometricModalOpenForEdit(false);
                    setPayoutSaveStatus(`✓ Biometrically Authenticated: Day-1 Credentials & Payout route saved with hardware SHA-256 seal.`);
                  }, 1200);
                }}
                className={`mx-auto size-28 rounded-full border-2 ${
                  isBiometricScanningForEdit
                    ? 'border-[#00FFFF] bg-[#00FFFF]/20 shadow-[0_0_30px_rgba(0,255,255,0.5)] animate-pulse'
                    : 'border-white/20 bg-black/60 hover:border-[#00FFFF]/70 hover:bg-[#00FFFF]/10'
                } transition grid place-items-center relative group`}
              >
                <Fingerprint
                  className={`size-14 ${
                    isBiometricScanningForEdit ? 'text-[#00FFFF] scale-110' : 'text-white/60 group-hover:text-[#00FFFF]'
                  } transition`}
                />
                {isBiometricScanningForEdit && (
                  <div className="absolute inset-0 rounded-full border-t-2 border-[#00FFFF] animate-spin" />
                )}
              </button>
              <span className="text-[10px] font-mono text-white/50 block mt-2">
                {isBiometricScanningForEdit ? 'Authenticating thumbprint sensor...' : 'Tap sensor to verify identity'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsBiometricModalOpenForEdit(false)}
              className="text-xs font-mono text-white/50 hover:text-white underline"
            >
              Cancel Update
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DAY-1 REMOTE AGENT ENROLLMENT WIZARD (QUERIES 5 - 14, 17, 18) */}
      {/* ========================================================================= */}
      {isRemoteEnrollmentWizardOpen && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-3 sm:p-5 backdrop-blur-lg overflow-y-auto"
          onClick={() => setIsRemoteEnrollmentWizardOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[620px] rounded-3xl border border-[#D9A441]/50 bg-[#0d1a14] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6 max-h-[94vh] overflow-y-auto space-y-4"
          >
            {/* Top Bar with Sticky Tri-Language Selector (Query 6) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid size-10 place-items-center rounded-xl bg-[#D9A441]/20 border border-[#D9A441]/40 text-[#D9A441]">
                  <Smartphone className="size-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9A441]">
                    DAY-1 REMOTE AGENT ONBOARDING
                  </span>
                  <h3 className="text-base font-black text-white">
                    {enrollmentLang === 'ur_roman'
                      ? 'Naye Field Agent ka Indiraj'
                      : enrollmentLang === 'ar'
                      ? 'تسجيل الوكيل الميداني الجديد'
                      : 'Field Agent Remote Enrollment'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Regional Allowed Language Switcher (Query 1: PK/IN -> Urdu+English, MENA -> Arabic+English, Europe -> English) */}
                <div className="flex items-center rounded-xl bg-black/60 border border-white/10 p-1 text-xs font-mono">
                  <span className="px-1.5 text-white/40 flex items-center gap-1">
                    <Globe className="size-3.5 text-[#00FFFF]" />
                  </span>
                  {getEnrollmentLanguagesForPhone(enrollAgentPhone).map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setEnrollmentLang(lang.code)}
                      className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                        enrollmentLang === lang.code
                          ? 'bg-[#D9A441] text-[#12241C] font-black shadow-sm'
                          : 'text-white/60 hover:text-white'
                      }`}
                      title={lang.description}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                    </button>
                  ))}
                </div>

                {/* Top-Right [X] Close Button (Query 6) */}
                <button
                  type="button"
                  onClick={() => setIsRemoteEnrollmentWizardOpen(false)}
                  className="rounded-lg p-2 text-white/55 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close Enrollment Wizard"
                  title="Close Wizard"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Stepper Header (1 to 5) */}
            <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-[10px]">
              {[
                { step: 1, label: enrollmentLang === 'ur_roman' ? 'شناخت' : enrollmentLang === 'ar' ? 'الهوية' : 'Identity' },
                { step: 2, label: enrollmentLang === 'ur_roman' ? 'بایومیٹرک' : enrollmentLang === 'ar' ? 'البصمة' : 'Biometric' },
                { step: 3, label: enrollmentLang === 'ur_roman' ? 'بینک/رقم' : enrollmentLang === 'ar' ? 'الدفع' : 'Payout' },
                { step: 4, label: enrollmentLang === 'ur_roman' ? 'اقرار نامہ' : enrollmentLang === 'ar' ? 'الإقرار' : 'Legal' },
                { step: 5, label: enrollmentLang === 'ur_roman' ? 'مبارک' : enrollmentLang === 'ar' ? 'التفعيل' : 'Active' },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`p-1.5 rounded-lg border ${
                    enrollmentStep === s.step
                      ? 'border-[#D9A441] bg-[#D9A441]/20 text-[#D9A441] font-bold'
                      : enrollmentStep > s.step
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                      : 'border-white/5 bg-white/[0.02] text-white/40'
                  }`}
                >
                  <span className="block font-bold">Step {s.step}</span>
                  <span className="truncate block">{s.label}</span>
                </div>
              ))}
            </div>

            {/* STEP 1: IDENTITY & COUNTRY DETECTION (QUERY 7 & 8) */}
            {enrollmentStep === 1 && (
              <div className="space-y-3.5 animate-in fade-in">

                <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-1">
                  <span className="text-[10px] font-mono text-[#00FFFF] font-bold uppercase">
                    {enrollmentLang === 'ur_roman'
                      ? 'بنیادی معلومات'
                      : enrollmentLang === 'ar'
                      ? 'المعلومات الشخصية والبلد'
                      : 'Personal Details & Auto-Detected Country'}
                  </span>
                  <p className="text-xs text-white/70 font-sans">
                    {enrollmentLang === 'ur_roman'
                      ? 'اپنا پورا نام، واٹس ایپ نمبر، اور قومی شناختی کارڈ درج کریں۔'
                      : enrollmentLang === 'ar'
                      ? 'أدخل اسمك الكامل ورقم الواتساب ورقم الهوية المعتمدة.'
                      : 'Enter your full legal name, registered WhatsApp number, and national identity details.'}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-white/60 block mb-1 uppercase font-bold">
                    {enrollmentLang === 'ur_roman' ? 'پورا نام (Full Legal Name)' : enrollmentLang === 'ar' ? 'الاسم الكامل' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={enrollAgentName}
                    onChange={(e) => setEnrollAgentName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#D9A441]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono text-white/60 uppercase font-bold">
                      {enrollmentLang === 'ur_roman' ? 'واٹس ایپ نمبر (WhatsApp)' : enrollmentLang === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number *'}
                    </label>
                    {(() => {
                      const detected = detectCountryFromPhone(enrollAgentPhone);
                      return (
                        <span className="text-[10px] font-mono font-bold text-[#00FFFF] flex items-center gap-1">
                          <span>{detected.flag}</span>
                          <span>{detected.name}</span>
                        </span>
                      );
                    })()}
                  </div>
                  <input
                    type="text"
                    value={enrollAgentPhone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEnrollAgentPhone(val);
                      const detected = detectCountryFromPhone(val);
                      if (detected.code === 'PK') setEnrollAgentId('35202-9841201-7');
                      else if (detected.code === 'AE') setEnrollAgentId('784-1992-8192019-1');
                      else if (detected.code === 'SA') setEnrollAgentId('2491028491');
                      else setEnrollAgentId('GB-8491028-A');

                      // Query 1: Synchronize allowed regional languages
                      const langs = getEnrollmentLanguagesForPhone(val);
                      if (!langs.some((l) => l.code === enrollmentLang)) {
                        setEnrollmentLang(langs[0].code);
                      }
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-mono text-[#00FFFF] focus:outline-none focus:border-[#00FFFF]"
                  />
                </div>

                {/* Dynamic Identity Field Auto-Detected from Country (Query 7) */}
                <div>
                  {(() => {
                    const detected = detectCountryFromPhone(enrollAgentPhone);
                    const isPk = detected.code === 'PK';
                    const isUae = detected.code === 'AE';
                    const isSa = detected.code === 'SA';
                    const labelText = isPk
                      ? (enrollmentLang === 'ur_roman' ? 'قومی شناختی کارڈ نمبر (CNIC Number 13 Digits) *' : 'CNIC Number (e.g. 35202-8491023-1) *')
                      : isUae
                      ? (enrollmentLang === 'ar' ? 'رقم الهوية الإماراتية (Emirates ID 15 Digits) *' : 'Emirates ID (e.g. 784-1988-1234567-1) *')
                      : isSa
                      ? (enrollmentLang === 'ar' ? 'رقم الإقامة / الهوية الوطنية (Iqama ID 10 Digits) *' : 'Iqama / Muqeem ID (10 Digits) *')
                      : 'National ID / UK NINO / European ID / Passport Number *';

                    return (
                      <>
                        <label className="text-[11px] font-mono text-[#D9A441] block mb-1 uppercase font-bold">
                          {labelText}
                        </label>
                        <input
                          type="text"
                          value={enrollAgentId}
                          onChange={(e) => setEnrollAgentId(e.target.value)}
                          placeholder={isPk ? '35202-8491023-1' : isUae ? '784-1988-1234567-1' : isSa ? '2491028491' : 'QQ 12 34 56 A'}
                          className="w-full rounded-xl border border-[#D9A441]/40 bg-white/[0.04] px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#D9A441]"
                        />
                      </>
                    );
                  })()}
                </div>

                {/* Territory / City Field with Country-to-City Validation (Query 2) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono text-white/60 uppercase font-bold">
                      {enrollmentLang === 'ur_roman' ? 'علاقہ / شہر (Assigned Territory)' : enrollmentLang === 'ar' ? 'المدينة / المنطقة' : 'Assigned Territory / City *'}
                    </label>
                    {(() => {
                      const detected = detectCountryFromPhone(enrollAgentPhone);
                      return (
                        <span className="text-[10px] font-mono text-emerald-400">
                          {detected.flag} {detected.name} Dial Auto-Locked ({detected.dialCode})
                        </span>
                      );
                    })()}
                  </div>
                  <input
                    type="text"
                    value={enrollAgentCity}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEnrollAgentCity(val);
                      const err = checkCityCountryIntegrity(val, enrollAgentPhone);
                      setCityValidationError(err);
                    }}
                    placeholder={
                      detectCountryFromPhone(enrollAgentPhone).code === 'AE'
                        ? 'Dubai, Abu Dhabi, Sharjah...'
                        : detectCountryFromPhone(enrollAgentPhone).code === 'SA'
                        ? 'Riyadh, Jeddah, Dammam...'
                        : detectCountryFromPhone(enrollAgentPhone).code === 'PK'
                        ? 'Lahore, Karachi, Islamabad...'
                        : 'London, Manchester...'
                    }
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-sans focus:outline-none transition ${
                      cityValidationError
                        ? 'border-red-500 bg-red-950/20 text-red-200 focus:border-red-400'
                        : 'border-white/10 bg-white/[0.04] text-white focus:border-[#D9A441]'
                    }`}
                  />

                  {/* Inline Geographic Conflict Error Banner (Query 2) */}
                  {cityValidationError && (
                    <div className="mt-2 rounded-xl border border-red-500/50 bg-red-950/60 p-3 space-y-1.5 animate-in fade-in">
                      <div className="flex items-center gap-1.5 text-red-300 font-mono text-xs font-bold">
                        <AlertOctagon className="size-4 shrink-0 text-red-400" />
                        <span>
                          {enrollmentLang === 'ar'
                            ? 'خطأ: تعارض بين رمز الدولة والمدينة المختارة'
                            : enrollmentLang === 'ur_roman'
                            ? 'انتباہ: ڈائل کوڈ اور منتخب شہر میں تضاد'
                            : 'Geographic Dial Code & City Conflict'}
                        </span>
                      </div>
                      <p className="text-xs text-red-200/90 font-sans leading-relaxed">
                        {enrollmentLang === 'ar'
                          ? cityValidationError.ar
                          : enrollmentLang === 'ur_roman'
                          ? cityValidationError.ur
                          : cityValidationError.en}
                      </p>
                    </div>
                  )}

                  {/* Suggested Valid Territory Pills for the Auto-Locked Country */}
                  {(() => {
                    const detected = detectCountryFromPhone(enrollAgentPhone);
                    const validCities = REGIONAL_CITY_MAP[detected.code]?.cities || [];
                    if (validCities.length === 0) return null;
                    return (
                      <div className="mt-2 space-y-1">
                        <span className="text-[10px] font-mono text-white/50 block">
                          {enrollmentLang === 'ar'
                            ? `المدن المعتمدة لـ ${detected.name}:`
                            : enrollmentLang === 'ur_roman'
                            ? `${detected.name} کے تصدیق شدہ اضلاع:`
                            : `Quick-select valid ${detected.name} territories:`}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {validCities.slice(0, 6).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setEnrollAgentCity(c);
                                setCityValidationError(null);
                              }}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition border ${
                                enrollAgentCity.toLowerCase().includes(c.toLowerCase())
                                  ? 'border-[#00FFFF] bg-[#00FFFF]/20 text-[#00FFFF] font-bold'
                                  : 'border-white/10 bg-black/40 text-white/70 hover:text-white hover:border-white/20'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const err = checkCityCountryIntegrity(enrollAgentCity, enrollAgentPhone);
                      if (err) {
                        setCityValidationError(err);
                        return;
                      }
                      setCityValidationError(null);
                      setEnrollmentStep(2);
                    }}
                    className="rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] px-5 py-2.5 text-xs font-mono font-bold uppercase transition flex items-center gap-1.5"
                  >
                    <span>{enrollmentLang === 'ur_roman' ? 'اگلا قدم: بایومیٹرک' : enrollmentLang === 'ar' ? 'التالي: البصمة' : 'Next: Biometric Capture →'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: LIVE SELFIE & HARDWARE BIOMETRIC (QUERY 9) */}
            {enrollmentStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-1">
                  <span className="text-[10px] font-mono text-[#00FFFF] font-bold uppercase">
                    {enrollmentLang === 'ur_roman'
                      ? 'تصویر اور بایومیٹرک تصدیق'
                      : enrollmentLang === 'ar'
                      ? 'التقاط الصورة الشخصية وبصمة الإبهام'
                      : 'Live Photo & Hardware Thumbprint'}
                  </span>
                  <p className="text-xs text-white/70 font-sans">
                    {enrollmentLang === 'ur_roman'
                      ? 'کیمرے کے سامنے چہرہ رکھیں اور نیچے انگوٹھے کے سینسر کو چھوئیں۔'
                      : enrollmentLang === 'ar'
                      ? 'وجه الكاميرا نحو وجهك، ثم المس مستشعر بصمة الإبهام للتحقق.'
                      : 'Capture your live selfie for client identification, and scan your thumbprint to generate an encrypted SHA-256 biometric key.'}
                  </p>
                </div>

                {/* Live Selfie Viewfinder */}
                <div className="rounded-2xl bg-black/60 border border-white/10 p-4 text-center space-y-2">
                  <div className="mx-auto size-32 rounded-2xl border-2 border-[#00FFFF] bg-slate-900 grid place-items-center relative overflow-hidden">
                    {enrollSelfieDone ? (
                      <div className="text-center">
                        <Check className="size-10 text-emerald-400 mx-auto stroke-[3]" />
                        <span className="text-[9px] font-mono text-emerald-300 block mt-1 font-bold">
                          {enrollmentLang === 'ur_roman' ? 'تصویر محفوظ' : enrollmentLang === 'ar' ? 'تم التقاط الصورة' : 'PHOTO VERIFIED'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="size-8 text-[#00FFFF] mx-auto opacity-70 animate-pulse" />
                        <span className="text-[8px] font-mono text-white/60 block mt-1">CAMERA READY</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEnrollSelfieDone(true);
                    }}
                    className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-mono text-white transition flex items-center gap-1.5 mx-auto"
                  >
                    <Camera className="size-3.5 text-[#00FFFF]" />
                    <span>
                      {enrollSelfieDone
                        ? (enrollmentLang === 'ur_roman' ? 'دوبارہ تصویر لیں' : enrollmentLang === 'ar' ? 'إعادة التقاط الصورة' : 'Re-Take Selfie')
                        : (enrollmentLang === 'ur_roman' ? 'تصویر کھینچیں' : enrollmentLang === 'ar' ? 'التقاط الصورة الآن' : 'Snap Live Selfie')}
                    </span>
                  </button>
                </div>

                {/* Hardware Optical Thumbprint Scanner */}
                <div className="rounded-2xl bg-black/60 border border-white/10 p-4 text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEnrollThumbScanning(true);
                      setTimeout(() => {
                        setIsEnrollThumbScanning(false);
                        setEnrollThumbDone(true);
                        setEnrollThumbHash('SHA256: 3c9f-88a1-agent-thumb-enrolled');
                      }, 1000);
                    }}
                    className={`mx-auto size-24 rounded-full border-2 ${
                      isEnrollThumbScanning
                        ? 'border-[#00FFFF] bg-[#00FFFF]/20 shadow-[0_0_25px_rgba(0,255,255,0.4)] animate-pulse'
                        : enrollThumbDone
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400'
                        : 'border-white/20 bg-black/40 hover:border-[#D9A441]'
                    } transition grid place-items-center relative`}
                  >
                    <Fingerprint className={`size-12 ${enrollThumbDone ? 'text-emerald-400' : 'text-[#00FFFF]'}`} />
                    {isEnrollThumbScanning && (
                      <div className="absolute inset-0 rounded-full border-t-2 border-[#00FFFF] animate-spin" />
                    )}
                  </button>

                  <span className="text-xs font-mono text-white/70 block">
                    {isEnrollThumbScanning
                      ? (enrollmentLang === 'ur_roman' ? 'انگوٹھا سکین ہو رہا ہے...' : enrollmentLang === 'ar' ? 'جاري قراءة البصمة...' : 'Reading hardware sensor...')
                      : enrollThumbDone
                      ? (enrollmentLang === 'ur_roman' ? `✓ بایومیٹرک محفوظ: ${enrollThumbHash}` : enrollmentLang === 'ar' ? `✓ تم تسجيل البصمة: ${enrollThumbHash}` : `✓ Thumbprint Stored: ${enrollThumbHash}`)
                      : (enrollmentLang === 'ur_roman' ? 'انگوٹھے کا نشان لگانے کے لیے دبائیں' : enrollmentLang === 'ar' ? 'اضغط للمسح البيومتري' : 'Touch sensor to scan thumbprint')}
                  </span>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setEnrollmentStep(1)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-mono text-white/60 hover:text-white"
                  >
                    {enrollmentLang === 'ur_roman' ? '← پیچھے' : enrollmentLang === 'ar' ? '← السابق' : '← Back'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEnrollSelfieDone(true);
                      setEnrollThumbDone(true);
                      if (!enrollThumbHash) setEnrollThumbHash('SHA256: 3c9f-88a1-agent-thumb-enrolled');
                      setEnrollmentStep(3);
                    }}
                    className="rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] px-5 py-2.5 text-xs font-mono font-bold uppercase transition flex items-center gap-1.5"
                  >
                    <span>{enrollmentLang === 'ur_roman' ? 'اگلا: ادائیگی کا طریقہ ←' : enrollmentLang === 'ar' ? 'التالي: طريقة الدفع ←' : 'Next: Payout Destination →'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LOCAL PAYOUT RAIL & BENEFICIARY/GUARANTOR SPECIFICATION (QUERIES 1, 3, 5, 6, 7, 8) */}
            {enrollmentStep === 3 && (() => {
              const isPk = enrollAgentPhone.startsWith('+92');
              const isUae = enrollAgentPhone.startsWith('+971');
              const isKsa = enrollAgentPhone.startsWith('+966');
              const isMena = isUae || isKsa;
              const isBankSelected = enrollPayoutMethod === 'Bank Transfer' || 
                enrollPayoutMethod === 'Custom Bank' ||
                enrollPayoutMethod.includes('Bank') || 
                enrollPayoutMethod.includes('IBFT') || 
                enrollPayoutMethod.includes('SEPA') || 
                enrollPayoutMethod.includes('Direct') || 
                enrollPayoutMethod.includes('Barclays') || 
                enrollPayoutMethod.includes('Revolut') ||
                enrollPayoutMethod.includes('Wire');
              const showBicSwift = !isPk && !isMena && (enrollPayoutMethod.includes('Wire') || enrollPayoutMethod.includes('SEPA') || enrollPayoutMethod.includes('International'));

              // Query 1: Detect if a user entered a phone number instead of a bank account or IBAN
              const isPhoneFormatInBank = (() => {
                if (!isBankSelected) return false;
                const clean = enrollPayoutAccount.trim().replace(/[\s-]/g, '');
                if (clean.startsWith('03') && clean.length >= 10 && clean.length <= 12 && /^\d+$/.test(clean)) return true;
                if (clean.startsWith('+') && clean.length >= 10 && clean.length <= 15) return true;
                if (/^\d{10,11}$/.test(clean)) return true;
                return false;
              })();

              // Query 2: Country-Specific IBAN Format Validator (length and prefix check)
              const isIbanValidLength = (() => {
                if (!isBankSelected) return true;
                const raw = enrollPayoutAccount.replace(/\s/g, '').toUpperCase();
                if (!raw) return false;
                if (isPk) {
                  return (raw.startsWith('PK') && raw.length === 24) || (/^\d+$/.test(raw) && raw.length >= 14 && raw.length <= 18);
                }
                if (isUae) {
                  return raw.startsWith('AE') && raw.length === 23;
                }
                if (isKsa) {
                  return raw.startsWith('SA') && raw.length === 24;
                }
                if (raw.startsWith('GB')) {
                  return raw.length === 22;
                }
                return raw.length >= 12;
              })();

              return (
                <div className="space-y-3.5 animate-in fade-in">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-1">
                    <span className="text-[10px] font-mono text-[#D9A441] font-bold uppercase">
                      {enrollmentLang === 'ur_roman'
                        ? 'کمیشن کی ادائیگی کا طریقہ'
                        : enrollmentLang === 'ar'
                        ? 'حساب استلام العمولات'
                        : 'Commission Payout Account'}
                    </span>
                    <p className="text-xs text-white/70 font-sans">
                      {enrollmentLang === 'ur_roman'
                        ? 'اپنا اکاؤنٹ منتخب کریں جہاں ہر سیلون کی کمیشن فوری منتقل کی جائے گی۔'
                        : enrollmentLang === 'ar'
                        ? 'اختر وسيلة الدفع التي ستستلم عليها عمولاتك الميدانية فور إتمام الصفقات.'
                        : 'Your commissions will be disbursed automatically to this destination upon every confirmed onboarding.'}
                    </p>
                  </div>

                  {/* Payment Method Selector with Dark Background, High-Contrast Text, and + Add Custom Bank Option (Query 3) */}
                  <div>
                    <label className="text-[11px] font-mono text-white/60 block mb-1 uppercase font-bold">
                      {enrollmentLang === 'ur_roman' ? 'ادائیگی کا ذریعہ *' : enrollmentLang === 'ar' ? 'وسيلة الدفع *' : 'Payment Method *'}
                    </label>
                    <select
                      value={enrollPayoutMethod}
                      onChange={(e) => setEnrollPayoutMethod(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#102019] px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#D9A441]"
                    >
                      {isPk ? (
                        <>
                          <option value="EasyPaisa" className="bg-[#102019] text-white py-1">EasyPaisa Mobile Wallet (Instant)</option>
                          <option value="JazzCash" className="bg-[#102019] text-white py-1">JazzCash Mobile Wallet (Instant)</option>
                          <option value="Bank Transfer" className="bg-[#102019] text-white py-1">Pakistani Bank Account (Direct IBFT)</option>
                          <option value="Raast Instant Pay" className="bg-[#102019] text-white py-1">Raast Instant Pay (State Bank Rail)</option>
                          <option value="Custom Bank" className="bg-[#102019] text-[#D9A441] py-1 font-bold">+ Other / Add Custom Bank</option>
                        </>
                      ) : enrollAgentPhone.startsWith('+971') ? (
                        <>
                          <option value="Wio Bank Direct" className="bg-[#102019] text-white py-1">Wio Bank Business Direct</option>
                          <option value="Emirates NBD" className="bg-[#102019] text-white py-1">Emirates NBD AED Direct</option>
                          <option value="FAB Bank" className="bg-[#102019] text-white py-1">First Abu Dhabi Bank (FAB)</option>
                          <option value="International Bank Wire" className="bg-[#102019] text-white py-1">UAE Central Bank Direct Clearing</option>
                          <option value="Custom Bank" className="bg-[#102019] text-[#D9A441] py-1 font-bold">+ Other / Add Custom UAE Bank</option>
                        </>
                      ) : enrollAgentPhone.startsWith('+966') ? (
                        <>
                          <option value="Al Rajhi Bank" className="bg-[#102019] text-white py-1">Al Rajhi Bank (Saudi SARIE)</option>
                          <option value="STC Pay" className="bg-[#102019] text-white py-1">STC Pay Saudi Mobile Wallet</option>
                          <option value="Saudi National Bank" className="bg-[#102019] text-white py-1">SNB (Saudi National Bank)</option>
                          <option value="Custom Bank" className="bg-[#102019] text-[#D9A441] py-1 font-bold">+ Other / Add Custom Saudi Bank</option>
                        </>
                      ) : (
                        <>
                          <option value="UK Faster Payments" className="bg-[#102019] text-white py-1">UK Faster Payments / BACS (Instant)</option>
                          <option value="Euro SEPA IBAN" className="bg-[#102019] text-white py-1">Euro SEPA Instant IBAN</option>
                          <option value="Revolut Business" className="bg-[#102019] text-white py-1">Revolut Business Account</option>
                          <option value="Barclays Bank" className="bg-[#102019] text-white py-1">Barclays Bank UK</option>
                          <option value="Custom Bank" className="bg-[#102019] text-[#D9A441] py-1 font-bold">+ Other / Add Custom Bank / Credit Union</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Bank Account Mode: 4 Distinct Fields (Title, Bank Name & Branch, Registered Mobile, Account/IBAN) */}
                  {isBankSelected ? (
                    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/40 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#00FFFF] font-bold uppercase">
                          {enrollmentLang === 'ur_roman' ? 'بینک اکاؤنٹ کی تفصیلات (۴ خانے لازمی)' : enrollmentLang === 'ar' ? 'تفاصيل الحساب البنكي (٤ حقول مطلوبة)' : 'Bank Account Details (4 Required Fields)'}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {enrollPayoutMethod === 'Custom Bank' ? 'CUSTOM BANK / IBFT' : 'IBFT / DIRECT'}
                        </span>
                      </div>

                      {/* 1. Account Title (Localized Placeholders by Region) */}
                      <div>
                        <label className="text-[11px] font-mono text-white/70 block mb-1 uppercase font-semibold">
                          {enrollmentLang === 'ur_roman' ? '۱. اکاؤنٹ کا ٹائٹل (اکاؤنٹ ہولڈر کا پورا نام) *' : enrollmentLang === 'ar' ? '١. اسم صاحب الحساب (المستفيد) *' : '1. Beneficiary Account Title *'}
                        </label>
                        <input
                          type="text"
                          value={enrollPayoutTitle}
                          onChange={(e) => setEnrollPayoutTitle(e.target.value)}
                          placeholder={
                            isPk
                              ? enrollmentLang === 'ur_roman' ? 'مثال: محمد کامران طارق' : 'e.g. Muhammad Kamran Tariq'
                              : isUae
                              ? enrollmentLang === 'ar' ? 'مثال: راشد عبد الله المكتوم' : 'e.g. Rashid Abdullah Al-Maktoum'
                              : isKsa
                              ? enrollmentLang === 'ar' ? 'مثال: فيصل بن عبد العزيز القحطاني' : 'e.g. Faisal Abdulaziz Al-Qahtani'
                              : 'e.g. James Edward Smith'
                          }
                          className="w-full rounded-xl border border-white/10 bg-[#102019] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>

                      {/* 2. Bank Name & Branch (with Quick Presets & + Custom Bank Input, Query 3) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-mono text-white/70 uppercase font-semibold">
                            {enrollmentLang === 'ur_roman' ? '۲. بینک کا نام اور برانچ *' : enrollmentLang === 'ar' ? '٢. اسم البنك والفرع *' : '2. Bank Name & Branch *'}
                          </label>
                          <span className="text-[10px] font-mono text-[#D9A441]">
                            {enrollmentLang === 'ur_roman' ? '+ اپنی مرضی کا بینک شامل کریں' : enrollmentLang === 'ar' ? '+ إضافة بنك مخصص' : '+ Any Bank / Credit Union'}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={enrollBankName}
                          onChange={(e) => setEnrollBankName(e.target.value)}
                          placeholder={
                            isPk
                              ? 'مثال: میزان بینک / حبیب بینک / بینک الفلاح / یا کوئی بھی بینک'
                              : isUae
                              ? 'e.g. Emirates NBD / Wio / FAB / ADCB / Mashreq'
                              : isKsa
                              ? 'e.g. Al Rajhi / SNB / Riyad Bank / Alinma'
                              : 'e.g. Barclays / HSBC / Revolut / Monzo / NatWest'
                          }
                          className="w-full rounded-xl border border-white/10 bg-[#102019] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D9A441]"
                        />

                        {/* Quick Bank Presets for Instant Tap */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(isPk
                            ? ['Meezan Bank', 'HBL Bank', 'Bank Alfalah', 'Standard Chartered', 'Faysal Bank', 'Allied Bank']
                            : isUae
                            ? ['Emirates NBD', 'Wio Bank', 'FAB Bank', 'ADCB', 'Mashreq Bank', 'DIB']
                            : isKsa
                            ? ['Al Rajhi Bank', 'SNB Bank', 'Riyad Bank', 'Banque Saudi Fransi']
                            : ['Barclays Bank', 'Revolut Business', 'HSBC UK', 'Lloyds Bank', 'NatWest']
                          ).map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setEnrollBankName(preset)}
                              className={`rounded-lg px-2 py-0.5 text-[10px] font-mono transition border ${
                                enrollBankName === preset
                                  ? 'border-[#D9A441] bg-[#D9A441]/20 text-[#D9A441] font-bold'
                                  : 'border-white/10 bg-black/40 text-white/60 hover:text-white'
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. Registered Mobile Number (Localized Placeholders by Region) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-mono text-white/70 uppercase font-semibold">
                            {enrollmentLang === 'ur_roman' ? '۳. بینک میں رجسٹرڈ موبائل نمبر *' : enrollmentLang === 'ar' ? '٣. رقم الجوال المسجل بالبنك *' : '3. Registered Mobile Number *'}
                          </label>
                          <span className="text-[10px] font-mono text-[#00FFFF]">
                            {isPk ? 'Pakistan Metro (+92)' : isUae ? 'UAE (+971)' : isKsa ? 'Saudi Arabia (+966)' : 'UK / Europe (+44)'}
                          </span>
                        </div>
                        <input
                          type="tel"
                          value={enrollBankMobile}
                          onChange={(e) => setEnrollBankMobile(e.target.value)}
                          placeholder={
                            isPk
                              ? '0300 1234567 or +92 300 1234567 (10 digits)'
                              : isUae
                              ? '050 123 4567 or +971 50 123 4567 (9 digits)'
                              : isKsa
                              ? '055 123 4567 or +966 55 123 4567 (9 digits)'
                              : '07123 456789 or +44 7123 456789 (10 digits)'
                          }
                          className="w-full rounded-xl border border-white/10 bg-[#102019] px-3.5 py-2.5 text-xs font-mono text-[#00FFFF] focus:outline-none focus:border-[#00FFFF]"
                        />
                      </div>

                      {/* 4. Account or IBAN Number with Country-Exact Formatting & Non-Phone Validation (Query 1 & 2) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-mono text-white/70 uppercase font-semibold">
                            {enrollmentLang === 'ur_roman' ? '۴. اکاؤنٹ نمبر یا مکمل IBAN نمبر *' : enrollmentLang === 'ar' ? '٤. رقم الحساب أو الآيبان الكامل *' : '4. Account Number or IBAN *'}
                          </label>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            {isPk
                              ? 'PKxx (24 chars) or 14-16 digit Account'
                              : isUae
                              ? 'AExx (Exact 23 chars IBAN)'
                              : isKsa
                              ? 'SAxx (Exact 24 chars IBAN)'
                              : 'GBxx (Exact 22 chars IBAN) or Account'}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={enrollPayoutAccount}
                          onChange={(e) => {
                            let val = e.target.value.toUpperCase();
                            // If user is typing an IBAN, automatically group in blocks of 4
                            if (val.startsWith('PK') || val.startsWith('AE') || val.startsWith('SA') || val.startsWith('GB') || val.startsWith('DE')) {
                              const raw = val.replace(/[^A-Z0-9]/g, '');
                              const chunks = raw.match(/.{1,4}/g);
                              val = chunks ? chunks.join(' ') : raw;
                            }
                            setEnrollPayoutAccount(val);
                          }}
                          placeholder={
                            isPk
                              ? 'PK64 MEZN 0001 0203 0405 0607 or 16-Digit Account'
                              : isUae
                              ? 'AE07 0331 2345 6789 0123 456 (23 chars)'
                              : isKsa
                              ? 'SA03 8000 0000 6080 1016 7519 (24 chars)'
                              : 'GB29 NWBK 6016 1331 9268 19 (22 chars)'
                          }
                          className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-mono transition focus:outline-none ${
                            isPhoneFormatInBank
                              ? 'border-red-500 bg-red-950/20 text-red-300 focus:border-red-400'
                              : isIbanValidLength
                              ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300 focus:border-emerald-400'
                              : 'border-white/10 bg-[#102019] text-[#00FFFF] focus:border-[#00FFFF]'
                          }`}
                        />

                        {/* Character count / Format guide pill */}
                        <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-white/50">
                          <span>
                            {isPk
                              ? 'Supported: Pakistani Bank Accounts (14-16 digits) or State Bank 24-char IBAN'
                              : isUae
                              ? 'UAE Central Bank format: AE + 2 check digits + 19 account digits (23 chars total)'
                              : isKsa
                              ? 'Saudi SARIE format: SA + 2 check digits + 20 account digits (24 chars total)'
                              : 'UK / European format: GB + 20 alphanumeric chars (22 total) or Sort Code + Account'}
                          </span>
                          <span className={isIbanValidLength ? 'text-emerald-400 font-bold' : 'text-white/40'}>
                            {enrollPayoutAccount.replace(/\s/g, '').length} chars
                          </span>
                        </div>

                        {/* Inline Warning if Agent Entered Phone Number Instead of Account/IBAN (Query 1) */}
                        {isPhoneFormatInBank && (
                          <div className="mt-2 rounded-xl border border-red-500/50 bg-red-950/70 p-3 space-y-1 animate-in fade-in">
                            <div className="flex items-center gap-1.5 text-red-300 font-mono text-xs font-bold">
                              <AlertOctagon className="size-4 shrink-0 text-red-400" />
                              <span>
                                {enrollmentLang === 'ar'
                                  ? 'خطأ: تم إدخال رقم هاتف بدلاً من رقم الحساب البنكي'
                                  : enrollmentLang === 'ur_roman'
                                  ? 'غلط بینک فارمیٹ: فون نمبر درج ہے'
                                  : 'Invalid Bank Format: Phone Number Detected'}
                              </span>
                            </div>
                            <p className="text-xs text-red-200/90 font-sans leading-relaxed">
                              {enrollmentLang === 'ar'
                                ? 'للحسابات البنكية والتحويلات المباشرة يجب إدخال رقم الحساب البنكي أو رقم الآيبان المعتمد (IBAN) وليس رقم الهاتف. رقم الهاتف صالح فقط للمحافظ الإلكترونية.'
                                : enrollmentLang === 'ur_roman'
                                ? 'بینک ٹرانسفر کے لیے اکاؤنٹ نمبر یا 24 ہندسوں کا IBAN درکار ہے، فون نمبر نہیں۔ فون نمبر صرف ایزی پیسہ یا جاز کیش والیٹ کے لیے استعمال ہوتا ہے۔'
                                : 'Bank payout rails require an official Bank Account Number or country IBAN (e.g. PK64MEZN..., AE07..., SA03..., GB29...), not a mobile number. Phone numbers are only valid for mobile wallets.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Mobile Wallet Mode (EasyPaisa / JazzCash / STC Pay) */
                    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/40 p-3.5">
                      <div>
                        <label className="text-[11px] font-mono text-white/70 block mb-1 uppercase font-semibold">
                          {enrollmentLang === 'ur_roman' ? 'والیٹ اکاؤنٹ ٹائٹل (اکاؤنٹ ہولڈر کا نام) *' : enrollmentLang === 'ar' ? 'اسم صاحب المحفظة *' : 'Wallet Account Title *'}
                        </label>
                        <input
                          type="text"
                          value={enrollPayoutTitle}
                          onChange={(e) => setEnrollPayoutTitle(e.target.value)}
                          placeholder="Registered Full Name"
                          className="w-full rounded-xl border border-white/10 bg-[#102019] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-white/70 block mb-1 uppercase font-semibold">
                          {enrollmentLang === 'ur_roman' ? 'موبائل والیٹ نمبر *' : enrollmentLang === 'ar' ? 'رقم المحفظة الإلكترونية *' : 'Registered Mobile Wallet Number *'}
                        </label>
                        <input
                          type="tel"
                          value={enrollPayoutAccount}
                          onChange={(e) => setEnrollPayoutAccount(e.target.value)}
                          placeholder={isPk ? '0300 1234567' : 'Mobile number'}
                          className="w-full rounded-xl border border-white/10 bg-[#102019] px-3.5 py-2.5 text-xs font-mono text-[#00FFFF] focus:outline-none focus:border-[#00FFFF]"
                        />
                      </div>
                    </div>
                  )}

                  {/* BIC/SWIFT Code: ONLY shown for International Wire outside Pakistan and MENA */}
                  {showBicSwift && (
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-1">
                      <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase">
                        BIC / SWIFT CODE (INTERNATIONAL WIRE ONLY)
                      </label>
                      <input
                        type="text"
                        value={enrollBicSwift}
                        onChange={(e) => setEnrollBicSwift(e.target.value)}
                        placeholder="e.g. MEZNPKKA / BARCGB22"
                        className="w-full rounded-xl border border-white/10 bg-[#102019] px-3 py-2 text-xs font-mono text-white/80 focus:outline-none focus:border-[#D9A441]"
                      />
                    </div>
                  )}

                  {/* ROW 1: GUARANTOR DETAILS (Pakistan Only, Strictly NO "optional" or "mandatory" tag) */}
                  {isPk && (
                    <div className="rounded-2xl border border-amber-500/30 bg-black/50 p-3.5 space-y-2.5">
                      <div className="space-y-0.5">
                        <span className="text-xs font-mono font-bold text-[#D9A441] block">
                          {enrollmentLang === 'ur_roman' ? 'ضامن کی تفصیلات' : enrollmentLang === 'ar' ? 'بيانات الضامن' : 'Guarantor Details'}
                        </span>
                        <p className="text-[11px] text-white/60 font-sans">
                          {enrollmentLang === 'ur_roman'
                            ? 'کاروباری یا ذاتی ضامن کا نام اور واٹس ایپ رابطہ'
                            : enrollmentLang === 'ar'
                            ? 'اسم الضامن ورقم الاتصال المعتمد'
                            : 'Business or personal reference guarantor name & direct contact'}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] font-mono text-white/60 block mb-1 uppercase">
                            {enrollmentLang === 'ur_roman' ? 'ضامن کا پورا نام' : enrollmentLang === 'ar' ? 'اسم الضامن' : 'Guarantor Full Name'}
                          </label>
                          <input
                            type="text"
                            value={enrollGuarantorName}
                            onChange={(e) => setEnrollGuarantorName(e.target.value)}
                            placeholder={enrollmentLang === 'ur_roman' ? 'ضامن کا نام درج کریں' : 'Guarantor Name'}
                            className="w-full rounded-xl border border-white/10 bg-[#102019] px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-white/60 block mb-1 uppercase">
                            {enrollmentLang === 'ur_roman' ? 'ضامن کا واٹس ایپ / فون نمبر' : enrollmentLang === 'ar' ? 'رقم هاتف / واتساب الضامن' : 'Phone / WhatsApp'}
                          </label>
                          <input
                            type="tel"
                            value={enrollGuarantorPhone}
                            onChange={(e) => setEnrollGuarantorPhone(e.target.value)}
                            placeholder="0300 1234567"
                            className="w-full rounded-xl border border-white/10 bg-[#102019] px-3 py-2 text-xs font-mono text-[#00FFFF] placeholder-white/30 focus:outline-none focus:border-[#00FFFF]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ROW 2: NEXT OF KIN DETAILS (Marked Optional) */}
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white/80">
                        {enrollmentLang === 'ur_roman'
                          ? 'وارث / قریبی رشتہ دار کی تفصیلات (اختیاری)'
                          : enrollmentLang === 'ar'
                          ? 'بيانات أقرب الأقربين (اختياري)'
                          : 'Next of Kin / Family Reference (Optional)'}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        {enrollmentLang === 'ur_roman' ? 'اختیاری' : enrollmentLang === 'ar' ? 'اختياري' : 'Optional'}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 font-sans">
                      {enrollmentLang === 'ur_roman'
                        ? 'ہنگامی رابطے کے لیے فیملی یا قریبی رشتہ دار کا حوالہ'
                        : enrollmentLang === 'ar'
                        ? 'جهة اتصال للطوارئ في حال تعذر الوصول'
                        : 'Emergency family contact reference'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase">
                          {enrollmentLang === 'ur_roman' ? 'قریبی رشتہ دار کا نام' : enrollmentLang === 'ar' ? 'اسم قريب الدرجة الأولى' : 'Next of Kin Name'}
                        </label>
                        <input
                          type="text"
                          value={enrollNextOfKin}
                          onChange={(e) => setEnrollNextOfKin(e.target.value)}
                          placeholder={enrollmentLang === 'ur_roman' ? 'نام درج کریں' : 'Full Name'}
                          className="w-full rounded-xl border border-white/10 bg-[#102019] px-3 py-2 text-xs text-white/80 placeholder-white/30 focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase">
                          {enrollmentLang === 'ur_roman' ? 'رابطہ نمبر' : enrollmentLang === 'ar' ? 'رقم الاتصال' : 'Contact Phone Number'}
                        </label>
                        <input
                          type="tel"
                          value={enrollNextOfKinPhone}
                          onChange={(e) => setEnrollNextOfKinPhone(e.target.value)}
                          placeholder={isPk ? '0300 9876543' : '+ Phone number'}
                          className="w-full rounded-xl border border-white/10 bg-[#102019] px-3 py-2 text-xs font-mono text-white/80 placeholder-white/30 focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3 Navigation Buttons with Full Localization and Validation Gating */}
                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setEnrollmentStep(2)}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-mono text-white/60 hover:text-white"
                    >
                      {enrollmentLang === 'ur_roman' ? '← پیچھے' : enrollmentLang === 'ar' ? '← السابق' : '← Back'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (isPhoneFormatInBank) return;
                        setEnrollmentStep(4);
                      }}
                      disabled={isPhoneFormatInBank}
                      className={`rounded-xl px-5 py-2.5 text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 ${
                        isPhoneFormatInBank
                          ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                          : 'bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C]'
                      }`}
                    >
                      <span>{enrollmentLang === 'ur_roman' ? 'اگلا: قانونی اقرار نامہ ←' : enrollmentLang === 'ar' ? 'التالي: الشروط القانونية ←' : 'Next: Legal Terms →'}</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* STEP 4: LEGAL REMITTANCE DECLARATION WITH NATIVE NASTALIQ URDU & BIOMETRIC STAMP (QUERIES 9 & 10) */}
            {enrollmentStep === 4 && (
              <div className="space-y-3.5 animate-in fade-in">
                {/* Legal Remittance Agreement with 100% Native Nastaliq Urdu Script */}
                <div className="rounded-2xl border border-amber-500/40 bg-amber-950/25 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                    <span className="text-[11px] font-mono text-[#D9A441] font-bold uppercase flex items-center gap-1.5">
                      <ShieldCheck className="size-4" />
                      <span>
                        {enrollmentLang === 'ur_roman'
                          ? 'قانونی اقرار نامہ اور کیش ہینڈلنگ شرائط'
                          : enrollmentLang === 'ar'
                          ? 'الشروط القانونية وسياسة المدفوعات'
                          : 'Legal Declaration & Remittance Agreement'}
                      </span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded font-bold">
                      {enrollAgentPhone.startsWith('+92') ? '48H CASH SLA' : '100% CASHLESS'}
                    </span>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enrollAgreedTerms}
                      onChange={(e) => setEnrollAgreedTerms(e.target.checked)}
                      className="mt-1 size-4 rounded border-amber-500/50 bg-[#102019] text-[#D9A441] focus:ring-0 shrink-0"
                    />
                    <div className="space-y-1">
                      {enrollAgentPhone.startsWith('+92') ? (
                        enrollmentLang === 'ur_roman' ? (
                          <p className="text-sm text-amber-100 font-sans leading-relaxed text-right dir-rtl">
                            &ldquo;میں اقرار کرتا ہوں کہ تمام وصول شدہ نقدی رقم ۴۸ گھنٹے کے اندر اندر ورک کرافٹ کے آفیشل اکاؤنٹس (ایزی پیسہ، جاز کیش یا بینک اکاؤنٹ) میں جمع کرواؤں گا۔ اگر ۴۸ گھنٹے کے اندر رقم جمع نہ کروائی گئی تو میرا ایجنٹ آئی ڈی فوری طور پر معطل کر دیا جائے گا اور ورک کرافٹ پاکستان کے قوانین کے تحت قانونی چارہ جوئی کا مکمل حق محفوظ رکھتا ہے۔&rdquo;
                          </p>
                        ) : (
                          <p className="text-xs text-amber-200/95 font-sans leading-relaxed">
                            &ldquo;I agree to remit all physical cash collected within 48 hours into WORKCRAFT Official Accounts (EasyPaisa, JazzCash, or Official Bank Accounts). I acknowledge that if dues are not remitted within 48 hours, my Agent ID will be immediately suspended and WORKCRAFT Local reserves the full legal right to initiate formal recovery and legal actions under the laws of Pakistan.&rdquo;
                          </p>
                        )
                      ) : enrollmentLang === 'ar' ? (
                        <p className="text-xs text-amber-200/95 font-sans leading-relaxed text-right dir-rtl">
                          &ldquo;أقر وأوافق على أن WORKCRAFT تطبق سياسة رقمية غير نقدية بنسبة 100% خارج باكستان. يمنع منعاً باتاً استلام أو تداول أي مبالغ نقدية ورقية. يتم سداد جميع رسوم الإعداد والاشتراكات رقمياً ومباشرة لحسابات WORKCRAFT. وأوافق على أن أي مخالفة أو شكوى من صالون شريك ستؤدي إلى إنهاء العقد فوراً وإلغاء صلاحياتي دون إشعار مسبق.&rdquo;
                        </p>
                      ) : (
                        <p className="text-xs text-amber-200/95 font-sans leading-relaxed">
                          &ldquo;I acknowledge and agree that outside Pakistan, WORKCRAFT operates under a strict 100% cashless digital policy. I am strictly prohibited from handling manual physical hard cash. All salon setup and recurring fees must be remitted digitally by salon owners directly to WORKCRAFT. I agree that any violation, misconduct, or salon partner complaint will result in immediate termination of my Agent Agreement, de-enrollment from the platform, and forfeiture of pending claims without prior notice.&rdquo;
                        </p>
                      )}
                    </div>
                  </label>

                  {/* Optical Biometric Legal Stamp Scanner */}
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-xs font-mono">
                      <Fingerprint className="size-5 text-[#00FFFF]" />
                      <div>
                        <span className="text-white font-bold block">
                          {enrollmentLang === 'ur_roman' ? 'قانونی بایومیٹرک مہر' : enrollmentLang === 'ar' ? 'البصمة القانونية' : 'Legal Biometric Stamp'}
                        </span>
                        <span className="text-[10px] text-emerald-400">
                          {enrollLegalStampHash || (enrollmentLang === 'ur_roman' ? 'مہر لگانے کے لیے بٹن دبائیں' : 'Pending biometric signature')}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLegalStampScanning(true);
                        setTimeout(() => {
                          setIsLegalStampScanning(false);
                          setEnrollLegalBiometricStamped(true);
                          setEnrollLegalStampHash('SHA256: 7f81-810a-agent-legal-stamped');
                        }, 900);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition shrink-0"
                    >
                      {isLegalStampScanning ? 'Scanning...' : enrollLegalBiometricStamped ? '✓ Re-Stamp' : 'Stamp Thumbprint'}
                    </button>
                  </div>
                </div>

                {/* Step 4 Navigation Buttons with Full Localization */}
                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setEnrollmentStep(3)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-mono text-white/60 hover:text-white"
                  >
                    {enrollmentLang === 'ur_roman' ? '← پیچھے' : enrollmentLang === 'ar' ? '← السابق' : '← Back'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEnrollAgreedTerms(true);
                      setEnrollLegalBiometricStamped(true);
                      if (!enrollLegalStampHash) setEnrollLegalStampHash('SHA256: 7f81-810a-agent-legal-stamped');
                      // Add to enrolledAgentsList
                      setEnrolledAgentsList((prev) => [
                        ...prev.filter(a => a.name !== enrollAgentName),
                        {
                          id: 'AGT-' + Math.floor(410 + Math.random() * 50),
                          pin: Math.floor(1000 + Math.random() * 9000).toString(),
                          name: enrollAgentName,
                          phone: enrollAgentPhone,
                          city: enrollAgentCity,
                          category: 'Universal (All Salons, Barbershops & Parlors)',
                          cnicOrId: enrollAgentId,
                          payoutMethod: enrollPayoutMethod,
                          payoutAccount: enrollPayoutAccount,
                          payoutTitle: enrollPayoutTitle,
                          bankName: enrollBankName,
                          status: 'ACTIVE · ON-FIELD',
                          enrolledAt: 'Just Now · 100% Verified',
                          selfieVerified: true,
                          thumbHash: enrollThumbHash || 'SHA256: 3c9f-88a1-agent-thumb-enrolled',
                          legalRemittanceAgreed: true,
                          legalTermsText: enrollAgentPhone.startsWith('+92')
                            ? 'Agreed: Remit physical cash within 48h to WORKCRAFT Official Accounts under Pakistani law.'
                            : 'Agreed: 100% cashless digital policy, immediate contract termination on misconduct.',
                          guarantorName: enrollGuarantorName || undefined,
                          guarantorPhone: enrollGuarantorPhone || undefined,
                        },
                      ]);
                      setEnrollmentStep(5);
                    }}
                    className="rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] px-5 py-2.5 text-xs font-mono font-bold uppercase transition flex items-center gap-1.5"
                  >
                    <span>{enrollmentLang === 'ur_roman' ? 'تصدیق اور ایکٹیویشن ←' : enrollmentLang === 'ar' ? 'تأكيد التسجيل والتفعيل ←' : 'Complete Enrollment & Activate →'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: ENROLLMENT CONFIRMED & HOME SCREEN PWA INSTALL (QUERIES 11 & 12) */}
            {enrollmentStep === 5 && (
              <div className="space-y-4 text-center animate-in zoom-in-95">
                <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <CheckCircle2 className="size-10" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                    DAY-1 ENROLLMENT 100% COMPLETE &amp; VERIFIED
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {enrollmentLang === 'ur_roman'
                      ? 'مبارک ہو! آپ کا فیلڈ ایجنٹ اکاؤنٹ ایکٹیو ہے'
                      : enrollmentLang === 'ar'
                      ? 'تهانينا! حساب الوكيل الميداني مفعل بنجاح'
                      : 'Congratulations! Field Agent Terminal Activated'}
                  </h3>
                  <p className="text-xs text-white/70 font-sans max-w-md mx-auto">
                    {enrollmentLang === 'ur_roman'
                      ? `${enrollAgentName}، آپ کے بایومیٹرک اسناد، شناختی کارڈ، اور ادائیگی کا طریقہ سینٹرل سسٹم میں محفوظ کر لیا گیا ہے۔`
                      : enrollmentLang === 'ar'
                      ? `تم تشفير بصمتك البيومترية وبيانات هويتك وحسابك المالي بنجاح في النظام المركزي.`
                      : `${enrollAgentName}, your credentials, biometric thumbprint hash, and automated payout rail have been encrypted into WORKCRAFT Central Cloud.`}
                  </p>
                </div>

                {/* 1-Tap Add to Home Screen Prompt (Query 11) */}
                <div className="rounded-2xl border border-[#00FFFF]/40 bg-gradient-to-r from-[#00FFFF]/10 via-[#102019] to-emerald-500/10 p-4 text-left font-mono space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00FFFF] flex items-center gap-2">
                      <Smartphone className="size-4" />
                      <span>{enrollmentLang === 'ur_roman' ? 'موبائل ہوم اسکرین پر شامل کریں' : enrollmentLang === 'ar' ? 'إضافة إلى الشاشة الرئيسية' : 'Add Field Agent Hub to Home Screen'}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                      PWA ICON READY
                    </span>
                  </div>
                  <p className="text-xs text-white/70 font-sans leading-relaxed">
                    {enrollmentLang === 'ur_roman'
                      ? 'اپنے موبائل کی ہوم اسکرین پر ورک کرافٹ کا آفیشل آئیکن شامل کریں تاکہ روزانہ فیلڈ ورک اور سیلون آن بورڈنگ کے لیے ۱ ٹیپ سے کھول سکیں۔'
                      : enrollmentLang === 'ar'
                      ? 'أضف أيقونة تطبيق الوكيل إلى شاشة هاتفك الرئيسية لفتح بوابتك بلمسة واحدة دون الحاجة إلى متصفح.'
                      : 'Install the Field Agent Hub icon directly on your mobile home screen for instant 1-tap offline-ready field salon onboarding.'}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPwaInstalledConfirmed(true);
                        setShowPwaInstallModal(true);
                      }}
                      className="rounded-xl bg-[#00FFFF] hover:bg-[#33ffff] text-[#12241C] px-4 py-2 text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 shadow"
                    >
                      <Download className="size-3.5" />
                      <span>
                        {isPwaInstalledConfirmed
                          ? (enrollmentLang === 'ur_roman' ? '✓ ہوم اسکرین آئیکن فعال ہو چکا' : enrollmentLang === 'ar' ? '✓ تم التثبيت على الشاشة الرئيسية' : '✓ Added to Home Screen')
                          : (enrollmentLang === 'ur_roman' ? 'ہوم اسکرین پر انسٹال کریں' : enrollmentLang === 'ar' ? 'تثبيت على الشاشة الرئيسية' : 'Install Icon to Phone Home Screen')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Auto-Launch Button into Agent Hub Step 1 Onboarding (Query 12) */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRemoteEnrollmentWizardOpen(false);
                      setActiveHubView('ONBOARDING');
                      setCurrentStep(1);
                    }}
                    className="rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] px-6 py-3 text-xs font-mono font-black uppercase transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Scissors className="size-4" />
                    <span>{enrollmentLang === 'ur_roman' ? 'فیلڈ ہب کھولیں (پہلا سیلون آن بورڈ کریں) ←' : enrollmentLang === 'ar' ? 'فتح البوابة الميدانية وبدء تهيئة الصالونات ←' : 'Launch Field Agent Hub (Step 1 Salon Onboarding) →'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRemoteEnrollmentWizardOpen(false)}
                    className="rounded-xl border border-white/10 px-4 py-3 text-xs font-mono text-white/60 hover:text-white"
                  >
                    {enrollmentLang === 'ur_roman' ? 'بند کریں اور واپس جائیں' : enrollmentLang === 'ar' ? 'إغلاق والعودة' : 'Close & Return'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. STANDALONE PWA INSTALLATION MODAL (QUERY 18) */}
      {/* ========================================================================= */}
      {showPwaInstallModal && (
        <div
          className="fixed inset-0 z-[105] grid place-items-center bg-black/85 p-3 sm:p-5 backdrop-blur-md"
          onClick={() => setShowPwaInstallModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[480px] rounded-3xl border border-emerald-500/40 bg-[#102019] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 space-y-4"
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <Smartphone className="size-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300">
                    PWA HOME SCREEN INSTALLATION
                  </span>
                  <h3 className="text-lg font-black text-white">
                    Add Agent Hub to Home Screen
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowPwaInstallModal(false)}
                className="rounded-lg p-1.5 text-white/55 hover:text-white transition"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Browser security sandboxes on iOS and Android do not permit silent home screen installations without user tap. Follow these 1-tap instructions:
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="rounded-xl bg-black/50 p-3 border border-white/10 space-y-1">
                <span className="text-[#00FFFF] font-bold block">📱 Android (Chrome / Samsung Internet):</span>
                <p className="text-white/70 font-sans text-[11px]">
                  Tap the button below or tap Chrome menu (⋮) ➔ select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>.
                </p>
              </div>

              <div className="rounded-xl bg-black/50 p-3 border border-white/10 space-y-1">
                <span className="text-[#D9A441] font-bold block">🍎 iPhone / iPad (Safari):</span>
                <p className="text-white/70 font-sans text-[11px]">
                  Tap the Safari <strong>Share icon (<Share2 className="size-3 inline" />)</strong> at the bottom bar ➔ scroll and tap <strong>&quot;Add to Home Screen&quot;</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsPwaInstalledConfirmed(true);
                setShowPwaInstallModal(false);
              }}
              className="w-full rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black py-3 text-xs font-mono font-black uppercase transition shadow-lg flex items-center justify-center gap-2"
            >
              <Download className="size-4" />
              <span>Simulate PWA Installation Prompt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
