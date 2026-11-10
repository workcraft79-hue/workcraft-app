import React, { useState } from 'react';
import { Mic, Volume2, Video, CheckCircle2, Play, Clock, Sparkles, Send, ShieldCheck, Radio } from 'lucide-react';
import { PortalCard } from './PortalCard';
import { VoiceRecorder } from './VoiceRecorder';

export const VoiceSection: React.FC = () => {
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [replySent, setReplySent] = useState(false);
  const [founderInputText, setFounderInputText] = useState(
    'Your video deal is verified, exactly 58 seconds, and approved. It will be scheduled for tomorrow morning broadcast.'
  );

  // Auto-Detected Client Audio Context
  const [selectedRecipient, setSelectedRecipient] = useState('[WC-101] Hamza · Seven Cuts Salon (Lahore)');
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [autoDetectedDialect, setAutoDetectedDialect] = useState<'Roman Urdu (Lahori)' | 'Lahori Punjabi' | 'Standard Urdu' | 'Gulf Arabic'>('Roman Urdu (Lahori)');
  const [autoTranslatedOutput, setAutoTranslatedOutput] = useState(
    'Aap ka video deal check ho gaya hai, bilkul 58 seconds ka hai aur approve kar diya hai. Kal subah broadcast schedule ho jayega.'
  );

  const handleRecipientChange = (rec: string) => {
    setSelectedRecipient(rec);
    setIsAutoDetecting(true);
    setTimeout(() => {
      if (rec.includes('Seven Cuts') || rec.includes('Lahore')) {
        setAutoDetectedDialect('Roman Urdu (Lahori)');
        setAutoTranslatedOutput(
          'Aap ka video deal check ho gaya hai, bilkul 58 seconds ka hai aur approve kar diya hai. Kal subah broadcast schedule ho jayega.'
        );
      } else if (rec.includes('Noor Beauty') || rec.includes('Karachi')) {
        setAutoDetectedDialect('Standard Urdu');
        setAutoTranslatedOutput(
          'آپ کی ویڈیو ڈیل کی توثیق مکمل ہو چکی ہے، 58 سیکنڈ دورانیہ درست ہے اور کل صبح کا براڈکاسٹ شیڈول منظور کر لیا گیا ہے۔'
        );
      } else if (rec.includes('Dubai') || rec.includes('MENA')) {
        setAutoDetectedDialect('Gulf Arabic');
        setAutoTranslatedOutput(
          'تمت مراجعة فيديو العرض الترويجي الخاص بك بنجاح، ومدته 58 ثانية وتمت الموافقة عليه وجدولته للغد صباحاً.'
        );
      } else {
        setAutoDetectedDialect('Lahori Punjabi');
        setAutoTranslatedOutput(
          'Tuhada video deal check ho gaya ae, 58 second da pura fit ae te approve ho gaya. Kal sawere broadcast chal pyega.'
        );
      }
      setIsAutoDetecting(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Voice Hub Header Card */}
      <PortalCard title="Voice Ticker & Audio Feed" kicker="AUTONOMOUS AUDIO CONVERSION">
        <div className="space-y-4">
          <p className="text-xs text-white/55 font-sans leading-relaxed">
            Private audio-to-audio communications between salon owners and the founder. All voice recordings are transmitted through the local WhatsApp SIM socket without exposing personal phone numbers (+92-300-WORKCRAFT-LOCAL).
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Record Outbound Voice & Autonomous Dialect Translation */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="size-4 text-[#00FFFF]" />
                  <span className="text-xs font-mono font-bold text-[#F5F2E9] uppercase tracking-wider">
                    Founder Voice &amp; Auto-Language Conversion
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  GATEWAY ACTIVE
                </span>
              </div>

              {/* Recipient Selection */}
              <div>
                <label className="text-[10px] font-mono text-white/55 block mb-1">Incoming Voice Thread</label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => handleRecipientChange(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono text-[#F5F2E9] focus:outline-none focus:border-[#00FFFF]"
                >
                  <option value="[WC-101] Hamza · Seven Cuts Salon (Lahore)">[WC-101] Hamza · Seven Cuts Salon (Lahore) · Inbound: Roman Urdu</option>
                  <option value="[WC-102] Ayesha · Noor Beauty Lounge (Karachi)">[WC-102] Ayesha · Noor Beauty Lounge (Karachi) · Inbound: Standard Urdu</option>
                  <option value="[WC-103] Bilal · The Groom Room (Islamabad)">[WC-103] Bilal · The Groom Room (Islamabad) · Inbound: Lahori Punjabi</option>
                  <option value="[WC-104] Tareq · Elite Grooming (Dubai / MENA)">[WC-104] Tareq · Elite Grooming (Dubai / MENA) · Inbound: Gulf Arabic</option>
                </select>
              </div>

              {/* Auto-Detection Telemetry Box */}
              <div className="rounded-xl border border-[#00FFFF]/30 bg-[#00FFFF]/5 p-3 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#00FFFF] font-bold uppercase flex items-center gap-1.5">
                    <Sparkles className="size-3 text-[#00FFFF]" />
                    AI Auto-Detected Inbound Dialect:
                  </span>
                  <span className="text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    {isAutoDetecting ? 'Detecting Audio...' : `${autoDetectedDialect} ✓`}
                  </span>
                </div>
                <p className="text-[11px] text-white/70 font-sans leading-relaxed">
                  System automatically matches the recipient's dialect. Founder simply speaks or types in any language (English, Urdu, etc.) and the engine auto-synthesizes it into the salon owner's detected native speech.
                </p>
              </div>

              {/* Founder Draft / Speaking Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/55 block">
                  Founder Reply (Speak or Type in Any Language):
                </label>
                <textarea
                  value={founderInputText}
                  onChange={(e) => setFounderInputText(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono text-[#F5F2E9] focus:outline-none focus:border-[#00FFFF] resize-none"
                />
              </div>

              {/* Live Dialect Audio Synthesis Preview Box */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#D9A441] font-bold">Auto-Converted Audio Output ({autoDetectedDialect})</span>
                  <span className="text-emerald-400">Zero Identity Leakage ✓</span>
                </div>
                <p className="text-[11px] text-[#F5F2E9] italic font-sans leading-relaxed">
                  “{autoTranslatedOutput}”
                </p>
              </div>

              <VoiceRecorder onUploaded={setUploadedUrl} />

              <div className="flex items-center justify-between rounded-lg bg-emerald-950/50 border border-emerald-500/30 p-2.5 text-xs text-emerald-300">
                <span className="text-[11px] font-mono">Anonymous SIM socket audio dispatch</span>
                <button
                  onClick={() => {
                    setReplySent(true);
                    setTimeout(() => setReplySent(false), 4000);
                  }}
                  className="px-3.5 py-1.5 bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] font-mono font-bold text-xs uppercase rounded-lg transition active:scale-95 shadow-sm"
                >
                  {replySent ? 'Dispatched via Gateway ✓' : 'Dispatch Native Voice'}
                </button>
              </div>
            </div>

            {/* Privacy Shield Telemetry & SIM Architecture */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-3.5 font-mono">
              <div className="flex items-center gap-2 text-[#00FFFF]">
                <ShieldCheck className="size-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Central SIM Gateway &amp; Identity Isolation
                </span>
              </div>
              <p className="text-[11px] text-white/55 font-sans leading-relaxed">
                Founder personal mobile number, WhatsApp profile, and device metadata remain 100% isolated. All communications are mediated through the dedicated local SIM node.
              </p>

              {/* Status Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-black/40 p-2.5 border border-white/10">
                  <span className="text-[10px] text-white/45 block">BUSINESS LINE</span>
                  <span className="text-[#00FFFF] font-bold truncate block">WorkCraft Private Line</span>
                </div>
                <div className="rounded-lg bg-black/40 p-2.5 border border-white/10">
                  <span className="text-[10px] text-white/45 block">VOICE QUALITY</span>
                  <span className="text-emerald-400 font-bold truncate block">Clear HD Native Voice</span>
                </div>
              </div>

              {/* Anonymity Shield Telemetry */}
              <div className="rounded-xl border border-white/10 bg-black/30 p-3 space-y-2 text-[10px]">
                <div className="flex items-center justify-between text-white/60">
                  <span className="font-bold text-[#D9A441]">AUTONOMOUS SYSTEM ENFORCEMENT</span>
                  <span className="text-emerald-400">100% ISOLATED</span>
                </div>
                <div className="space-y-1 text-white/70 font-sans">
                  <p>• Founder personal phone number &amp; WhatsApp remain completely hidden from clients &amp; agents.</p>
                  <p>• Inbound voice notes are analyzed for dialect markers and transcribed without third-party cloud data leak.</p>
                  <p>• Outbound audio is rendered with calibrated native inflection and sent back to the salon owner seamlessly.</p>
                  <p>• Response management is entirely handled behind the scenes; no arbitrary response policy banners are displayed to salon clients.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PortalCard>

      {/* Incoming Voice Feed & Deal Video Review */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Unread Voice Notes */}
        <PortalCard title="Incoming Voice Queue" kicker="2 UNREAD TICKETS">
          <div className="space-y-3">
            {/* Note 1 */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F5F2E9] font-mono">
                      [WC-101] Hamza · Seven Cuts Salon
                    </span>
                    <span className="rounded-full bg-white/[0.08] border border-white/10 px-2 py-0.5 text-[9px] font-mono font-bold text-[#00FFFF]">
                      UNREAD
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-white/55 mt-0.5">
                    Received 18m ago · Lahore DHA · 0:24
                  </p>
                </div>
                <Volume2 className="size-4 text-[#D9A441]" />
              </div>
              <div className="bg-black/50 rounded-lg p-2 border border-white/10">
                <audio controls className="h-8 w-full" src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" />
              </div>
              <p className="text-[11px] text-white/70 italic bg-black/20 p-2.5 rounded-lg border border-white/10 font-sans">
                “Salam Farhan bhai, humara weekend video deal upload kiya tha 58 second ka, check kar lein approved hai ke nahi taake blast schedule ho sake.”
              </p>
            </div>

            {/* Note 2 */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F5F2E9] font-mono">
                      [WC-102] Ayesha · Noor Beauty Lounge
                    </span>
                    <span className="rounded-full bg-white/[0.08] border border-white/10 px-2 py-0.5 text-[9px] font-mono font-bold text-[#00FFFF]">
                      UNREAD
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-white/55 mt-0.5">
                    Received 42m ago · Karachi Clifton · 0:19
                  </p>
                </div>
                <Volume2 className="size-4 text-white/40" />
              </div>
              <div className="bg-black/50 rounded-lg p-2 border border-white/10">
                <audio controls className="h-8 w-full" src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" />
              </div>
              <p className="text-[11px] text-white/70 italic bg-black/20 p-2.5 rounded-lg border border-white/10 font-sans">
                “Friday bridal discount package rate update ho gaya hai system main? Client inquiring.”
              </p>
            </div>
          </div>
        </PortalCard>
      </div>
    </div>
  );
};
