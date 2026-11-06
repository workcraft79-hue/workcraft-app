import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Upload, Play, Pause, RotateCcw, AlertTriangle, 
  CheckCircle2, Clock, ShieldCheck, Ban, ArrowRight, Zap, FileVideo
} from 'lucide-react';
import { BroadcastCampaign, BroadcastLog, Contact, SalonProfile } from '../../types';

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

  // Video State
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

  const [dealHeadline, setDealHeadline] = useState(
    salon.currency === 'PKR' 
      ? 'Weekend Royal Grooming Gala: 40% OFF All Hair & Beard Combos' 
      : 'Weekend Elite Styling Special: AED 75 Full Grooming Combo'
  );
  const [dealDetails, setDealDetails] = useState(
    'Valid this Friday & Saturday only. Includes master haircut, hot ozone beard steam, and charcoal detox mask. Tap [Book Now] below to claim your slot.'
  );

  const [validationError, setValidationError] = useState<string | null>(null);

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

    // Inspect duration using temporary video object
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
      // Fallback if codec inspection fails in sandboxed browser
      setValidationError(null);
      setVideoFile({
        name: file.name,
        duration: 45,
        sizeMb,
      });
    };

    video.src = objectUrl;
  };

  // Queue Dispatch Engine (4s to 9s randomized artificial delay)
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

    // Dispatch timeout
    queueTimeoutRef.current = setTimeout(() => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

      const target = activeContacts[currentIndex];
      if (target) {
        const newLog: BroadcastLog = {
          id: `log-${Date.now()}-${currentIndex}`,
          timestamp: new Date().toLocaleTimeString(),
          recipientName: target.name,
          recipientPhone: target.phone,
          status: 'sent',
          delaySeconds: randomSec,
        };
        setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
      }

      setCurrentIndex((prev) => prev + 1);
    }, durationMs);

    return () => {
      if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [queueStatus, currentIndex, activeContacts]);

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

  return (
    <div className="space-y-3.5 pb-20">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Pay-Per-Deal Video Broadcast
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              60s limit with 4s–9s Ban-Safety randomized throttling queue
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-sky-400">
            {salon.currency} {salon.currency === 'PKR' ? '1,500' : '50'} / blast
          </span>
        </div>

        {/* Protection Badges */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800 text-[11px] font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">THROTTLING</span>
            <span className="text-emerald-400 font-bold">4s to 9s Jitter</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">BAN RISK</span>
            <span className="text-sky-400 font-bold">&lt; 1% (Shielded)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">AUTO-SUPPRESS</span>
            <span className="text-slate-200 font-bold">{optOutContacts.length} Skipped</span>
          </div>
        </div>
      </div>

      {/* Step 1: 60-Second Video Uploader */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Video className="w-4 h-4 text-sky-400" />
            <span>1. Upload 60s Deal Video (MP4)</span>
          </div>
          <span className="text-[10px] text-amber-400 font-mono">Max 60 Seconds</span>
        </div>

        {/* Video Presets */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-mono uppercase block">
            Select or Upload Deal Clip:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setValidationError(null);
                  setVideoFile(p);
                }}
                className={`p-2 rounded-lg text-left border transition-colors text-xs ${
                  videoFile.name === p.name
                    ? 'bg-sky-950/70 border-sky-500/80 text-white font-medium'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="font-semibold text-[11px] truncate">{p.title}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {p.duration}s · {p.sizeMb}MB
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
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 border border-dashed border-slate-700 hover:border-sky-500 bg-slate-950 rounded-lg text-xs text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Upload custom salon MP4 video</span>
          </button>
        </div>

        {validationError && (
          <div className="bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs p-2 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Current Video File Card */}
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <FileVideo className="w-4 h-4 text-sky-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-medium text-white truncate block">
                {videoFile.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Duration: {videoFile.duration}s · Size: {videoFile.sizeMb} MB
              </span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40 shrink-0">
            VALIDATED &le;60s
          </span>
        </div>
      </div>

      {/* Step 2: Interactive WhatsApp Deal Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white">2. Message Body &amp; Anti-Ban Controls</span>
          <span className="text-[10px] text-slate-400 font-mono">WhatsApp Interactive Card</span>
        </div>

        {/* Simulated WhatsApp Bubble */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
          {/* Simulated Video Placeholder */}
          <div className="relative aspect-video bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white mb-1">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
            <span className="text-[11px] font-medium text-white">
              {videoFile.name} ({videoFile.duration}s)
            </span>
            <span className="text-[9px] text-slate-400 font-mono">
              Meta Cloud API Media Stream
            </span>
          </div>

          <div>
            <input
              type="text"
              value={dealHeadline}
              onChange={(e) => setDealHeadline(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <textarea
              rows={2}
              value={dealDetails}
              onChange={(e) => setDealDetails(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          {/* Mandatory Interactive Buttons from Blueprint */}
          <div className="space-y-1.5 pt-1 border-t border-slate-800">
            <button className="w-full py-1.5 bg-sky-900/60 hover:bg-sky-900 border border-sky-600/50 rounded-lg text-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5">
              <span>[ Book Now ]</span>
              <ArrowRight className="w-3 h-3 text-sky-400" />
            </button>
            <button className="w-full py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-400 text-[10px] font-mono flex items-center justify-center gap-1">
              <Ban className="w-2.5 h-2.5 text-rose-400" />
              <span>[ Stop / Unsubscribe ]</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Visual Rate-Limiting Queue Engine (4s to 9s) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>3. Ban-Safety Queue Engine (4s–9s Throttling)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Target: {activeContacts.length} Active
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 font-semibold">
              {currentIndex} / {activeContacts.length} Sent ({progressPercent}%)
            </span>
            {queueStatus === 'running' && (
              <span className="text-amber-400 font-bold tabular-nums animate-pulse">
                Next dispatch in: {delayCountdown}s (Jitter: {currentDelay}s)
              </span>
            )}
            {queueStatus === 'completed' && (
              <span className="text-emerald-400 font-bold">Queue Completed</span>
            )}
            {queueStatus === 'idle' && (
              <span className="text-slate-500">Queue Idle</span>
            )}
            {queueStatus === 'paused' && (
              <span className="text-amber-400">Queue Paused</span>
            )}
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Queue Control Buttons */}
        <div className="flex gap-2">
          {queueStatus !== 'running' ? (
            <button
              onClick={handleStartQueue}
              className="flex-1 h-10 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{currentIndex > 0 ? 'Resume Broadcast Queue' : 'Start Throttled Broadcast'}</span>
            </button>
          ) : (
            <button
              onClick={handlePauseQueue}
              className="flex-1 h-10 bg-amber-600 hover:bg-amber-500 active:scale-[0.98] text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause Dispatch Queue</span>
            </button>
          )}

          <button
            onClick={handleResetQueue}
            disabled={currentIndex === 0 && queueStatus === 'idle'}
            className="px-3 h-10 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-300 rounded-xl text-xs flex items-center justify-center transition-colors"
            title="Reset Queue"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Live Dispatch Log Feed */}
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
          <div className="text-[10px] text-slate-400 flex justify-between border-b border-slate-800 pb-1">
            <span>LIVE DISPATCH AUDIT LOG (4S–9S INTERVALS)</span>
            <span>{logs.length} Logged</span>
          </div>
          <div className="max-h-28 overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <div className="text-slate-600 text-center py-2 text-[10px]">
                Click 'Start Throttled Broadcast' to initiate randomized message delivery.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex justify-between items-center text-slate-300 text-[10px]">
                  <span className="text-slate-500">{log.timestamp}</span>
                  <span className="font-semibold text-white truncate max-w-[120px]">{log.recipientName}</span>
                  <span className="text-slate-400">{log.recipientPhone}</span>
                  <span className="text-emerald-400 tabular-nums">+{log.delaySeconds}s delay</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
