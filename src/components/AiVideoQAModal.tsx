import React, { useState } from 'react';
import {
  X,
  Video,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Layers,
  Send,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface AiVideoQAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoApproved: (title: string) => void;
}

interface TestScenario {
  id: string;
  name: string;
  filename: string;
  duration: number; // in seconds
  aspectRatio: string;
  resolution: string;
  contentTheme: string;
  expectedResult: 'PASS' | 'FAIL_DURATION' | 'FAIL_ASPECT' | 'FAIL_CONTENT';
  failureReason?: string;
  adviceMessage?: string;
}

export const AiVideoQAModal: React.FC<AiVideoQAModalProps> = ({
  isOpen,
  onClose,
  onVideoApproved,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<'BASIC' | 'GROWTH'>('GROWTH');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('sc-pass');
  const [qaVerdict, setQaVerdict] = useState<{
    status: 'PASSED' | 'REJECTED';
    title: string;
    details: string;
    advice?: string;
    dispatchedToWhatsApp?: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const scenarios: TestScenario[] = [
    {
      id: 'sc-pass',
      name: 'Valid Vertical Bridal Promo',
      filename: 'seven_cuts_weekend_deal.mp4',
      duration: 58,
      aspectRatio: '9:16 Vertical',
      resolution: '1080x1920 (HD)',
      contentTheme: 'Bridal & Hair Styling Deal Offer',
      expectedResult: 'PASS',
    },
    {
      id: 'sc-duration',
      name: 'Duration Exceeded (78s)',
      filename: 'long_salon_vlog_raw.mp4',
      duration: 78,
      aspectRatio: '9:16 Vertical',
      resolution: '1080x1920',
      contentTheme: 'Salon Walkthrough',
      expectedResult: 'FAIL_DURATION',
      failureReason: 'Duration exceeds maximum 60-second limit (78 seconds detected).',
      adviceMessage:
        'Aap ki video 78 seconds ki hai. WhatsApp status aur promo blast ke liye maximum 60 seconds allowed hain. Please isay trim kar ke dubara upload karein.',
    },
    {
      id: 'sc-aspect',
      name: 'Horizontal Format (16:9)',
      filename: 'horizontal_landscape_clip.mp4',
      duration: 45,
      aspectRatio: '16:9 Landscape',
      resolution: '480p (Low Quality)',
      contentTheme: 'Haircut Montage',
      expectedResult: 'FAIL_ASPECT',
      failureReason: 'Invalid aspect ratio and low resolution.',
      adviceMessage:
        'Video horizontal ya low quality hai. Kripya mobile vertical format (9:16) HD mein upload karein taake customer mobile screen par crop na ho.',
    },
    {
      id: 'sc-content',
      name: 'Non-Salon Spam Content',
      filename: 'random_car_clip.mp4',
      duration: 30,
      aspectRatio: '9:16 Vertical',
      resolution: '1080p HD',
      contentTheme: 'Automotive footage / unrelated audio',
      expectedResult: 'FAIL_CONTENT',
      failureReason: 'Gemini semantic classifier: zero salon keywords or visual match.',
      adviceMessage:
        'AI Sanity Check Failed: Content does not match registered salon grooming services.',
    },
  ];

  const currentScenario =
    scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setQaVerdict(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      if (currentScenario.expectedResult === 'PASS') {
        setQaVerdict({
          status: 'PASSED',
          title: 'QA APPROVED · AUTO-SCHEDULED INTO BROADCAST QUEUE',
          details: `Duration: ${currentScenario.duration}s (≤60s OK) · Aspect Ratio: 9:16 Vertical HD OK · Semantic Theme: Verified Authentic Salon Service.`,
        });
        onVideoApproved(currentScenario.filename);
      } else {
        setQaVerdict({
          status: 'REJECTED',
          title: 'AUTO-REJECTED · WHATSAPP ADVISORY DISPATCHED',
          details: currentScenario.failureReason || 'Validation checks failed.',
          advice: currentScenario.adviceMessage,
          dispatchedToWhatsApp: true,
        });
      }
    }, 1100);
  };

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#102019] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/[0.04] border border-white/10 text-[#D9A441]">
              <Video className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#F5F2E9]">100% Autonomous AI Video QA Pipeline</h3>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                  ZERO FOUNDER INTERVENTION
                </span>
              </div>
              <p className="text-xs font-mono text-white/55 mt-0.5">
                Promo deals are auto-analyzed by Gemini. Valid videos enter broadcast queue instantly; invalid videos trigger automated WhatsApp fix requests to owner.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/55 hover:text-white transition"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Video Deal Packages Selector */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#D9A441] uppercase">
                Active Salon Deal Video Package
              </span>
              <span className="text-[10px] font-mono text-white/55">
                Self-serve purchase via salon owner portal
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedPackage('BASIC')}
                className={`rounded-xl border p-3 text-left transition ${
                  selectedPackage === 'BASIC'
                    ? 'border-[#00FFFF] bg-white/[0.08] shadow-sm'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F5F2E9]">Basic Video Deal (1x / mo)</span>
                  <span className="text-xs font-mono font-bold text-[#D9A441]">PKR 1,500</span>
                </div>
                <p className="text-[10px] text-white/55 mt-1">
                  1 vertical promo video per month · up to 1,500 client broadcast quota
                </p>
              </button>

              <button
                onClick={() => setSelectedPackage('GROWTH')}
                className={`rounded-xl border p-3 text-left transition ${
                  selectedPackage === 'GROWTH'
                    ? 'border-[#00FFFF] bg-white/[0.08] shadow-sm'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F5F2E9]">Growth Video Deal (4x / mo)</span>
                  <span className="text-xs font-mono font-bold text-[#D9A441]">PKR 4,000</span>
                </div>
                <p className="text-[10px] text-white/55 mt-1">
                  Weekly promo blasts (4 videos) · VIP client priority slotting
                </p>
              </button>
            </div>
          </div>

          {/* Test Simulation Scenarios */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white/45 uppercase tracking-wider">
                Select Uploaded Video Scenario to Validate
              </span>
              <span className="text-[10px] font-mono text-white/55">
                Automated Gemini Verification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scenarios.map((sc) => {
                const isSelected = activeScenarioId === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setActiveScenarioId(sc.id);
                      setQaVerdict(null);
                    }}
                    className={`rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? 'border-[#00FFFF] bg-white/[0.08] shadow-sm'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F5F2E9] truncate">
                        {sc.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold rounded px-1.5 py-0.5 border ${
                          sc.expectedResult === 'PASS'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                            : 'border-red-500/30 bg-red-500/10 text-red-300'
                        }`}
                      >
                        {sc.expectedResult === 'PASS' ? 'VALID' : 'REJECTABLE'}
                      </span>
                    </div>

                    <div className="mt-2 space-y-0.5 text-[10px] font-mono text-white/55">
                      <p>File: <span className="text-white/80">{sc.filename}</span></p>
                      <p>Specs: {sc.duration}s · {sc.aspectRatio} · {sc.resolution}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inspector Panel for Selected Video */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/55 uppercase font-bold">Inspection Target</span>
              <span className="text-[#00FFFF] font-bold">{currentScenario.filename}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-white/[0.03] p-2 border border-white/10">
                <span className="text-white/45 text-[10px] block">Duration</span>
                <span className={`font-bold ${currentScenario.duration > 60 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {currentScenario.duration}s {currentScenario.duration <= 60 ? '✓' : '✗'}
                </span>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2 border border-white/10">
                <span className="text-white/45 text-[10px] block">Aspect Ratio</span>
                <span className={`font-bold ${currentScenario.aspectRatio.includes('9:16') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {currentScenario.aspectRatio}
                </span>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2 border border-white/10">
                <span className="text-white/45 text-[10px] block">Resolution</span>
                <span className={`font-bold ${currentScenario.resolution.includes('HD') ? 'text-emerald-400' : 'text-amber-300'}`}>
                  {currentScenario.resolution}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] py-3 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="size-4 animate-spin text-[#12241C]" />
                    <span>Gemini Running Frame &amp; Audio Sanity Check...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 text-[#12241C]" />
                    <span>Simulate Autonomous Gemini Video QA Check</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QA Verdict Banner */}
          {qaVerdict && (
            <div
              className={`rounded-2xl border p-4 space-y-2.5 animate-in fade-in duration-200 ${
                qaVerdict.status === 'PASSED'
                  ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-200'
                  : 'border-red-500/30 bg-red-950/30 text-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {qaVerdict.status === 'PASSED' ? (
                    <CheckCircle2 className="size-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="size-5 text-red-400" />
                  )}
                  <span className="font-mono text-xs font-bold tracking-wider">
                    {qaVerdict.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/55">Autonomous Response</span>
              </div>

              <p className="text-xs leading-relaxed font-sans">{qaVerdict.details}</p>

              {qaVerdict.advice && (
                <div className="rounded-xl border border-white/10 bg-black/50 p-3 space-y-1 text-xs">
                  <p className="text-[10px] font-mono font-bold text-[#00FFFF] uppercase flex items-center gap-1.5">
                    <Send className="size-3" />
                    <span>Automated WhatsApp Dispatch Sent to Salon Owner (+92-300-WORKCRAFT-LOCAL)</span>
                  </p>
                  <p className="font-sans italic text-white/90">“{qaVerdict.advice}”</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
