import React, { useState, useEffect } from 'react';
import { X, Volume2, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';

interface VoiceSupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSupportDrawer: React.FC<VoiceSupportDrawerProps> = ({ isOpen, onClose }) => {
  const [responseTimer, setResponseTimer] = useState(15 * 60 - 45); // 14 min 15 sec
  const [replyAudioUrl, setReplyAudioUrl] = useState<string | null>(null);
  const [replySent, setReplySent] = useState(false);

  // 15-minute countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setResponseTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex justify-end transition-opacity"
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] h-full bg-[#102019] border-l border-emerald-500/20 p-5 overflow-y-auto shadow-2xl flex flex-col space-y-4 animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header with Universal High-Contrast [X] Button */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[.18em] text-[#D9A441]">
                Voice Support Inbox
              </span>
              <span className="size-2 rounded-full bg-[#00FFFF] animate-ping" />
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Private Voice Ticker (2 Unread)
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close voice support drawer"
            className="rounded-lg p-1.5 text-emerald-500/60 hover:text-white transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 15-Minute Response Target Countdown */}
        <div className="rounded-xl border border-emerald-500/20 bg-black/30 p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Clock className="size-4 text-[#00FFFF] shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Priority Response Window</p>
              <p className="text-[10px] font-mono text-emerald-500/60">Founder privacy shielded · No personal number leaked</p>
            </div>
          </div>
          <span className="font-mono text-sm font-bold text-[#00FFFF] bg-black/50 px-2.5 py-1 rounded-lg border border-emerald-500/30 tabular-nums">
            {formatTimer(responseTimer)}
          </span>
        </div>

        {/* Ticket 1: Hamza · Seven Cuts Salon */}
        <div className="rounded-xl border border-emerald-500/20 bg-black/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-mono">[WC-101] Hamza · Seven Cuts Salon</span>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.2 text-[9px] font-mono font-bold text-[#00FFFF]">
                  UNREAD
                </span>
              </div>
              <p className="text-[10px] font-mono text-emerald-500/60 mt-0.5">
                Received 18m ago · Lahore DHA Branch · Voice Note (0:24)
              </p>
            </div>
            <Volume2 className="size-4 text-[#D9A441]" />
          </div>

          {/* Audio Player Container */}
          <div className="bg-black/50 rounded-lg p-2 border border-emerald-500/20 flex items-center gap-2">
            <audio controls className="h-8 w-full" src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" />
          </div>

          <p className="text-[11px] text-emerald-300/90 italic bg-black/20 p-2.5 rounded-lg border border-emerald-500/10 font-sans">
            “Salam Farhan bhai, humara weekend video deal upload kiya tha 58 second ka, check kar lein approved hai ke nahi taake blast schedule ho sake.”
          </p>

          {/* Quick Voice Reply Tool */}
          <div className="pt-2 border-t border-emerald-500/20">
            <p className="text-[10px] font-mono font-bold text-emerald-500/80 uppercase tracking-wider mb-2">
              Send Audio-to-Audio Reply:
            </p>
            <VoiceRecorder onUploaded={(url) => setReplyAudioUrl(url)} />

            {replyAudioUrl && (
              <div className="mt-2.5 flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl text-xs text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span className="font-mono text-xs">Audio response ready</span>
                </div>
                <button
                  onClick={() => {
                    setReplySent(true);
                    setTimeout(() => setReplySent(false), 4000);
                  }}
                  className="px-3 py-1 bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] font-mono font-bold text-[10px] uppercase rounded-lg shadow-sm transition"
                >
                  {replySent ? 'Dispatched ✓' : 'Dispatch Voice'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ticket 2: Ayesha · Noor Beauty Lounge */}
        <div className="rounded-xl border border-emerald-500/20 bg-black/30 p-4 space-y-2 opacity-90">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white font-mono">[WC-102] Ayesha · Noor Beauty Lounge</span>
              <p className="text-[10px] font-mono text-emerald-500/60 mt-0.5">
                Received 42m ago · Karachi Clifton · Voice Note (0:19)
              </p>
            </div>
            <Volume2 className="size-4 text-emerald-500/40" />
          </div>
          <div className="bg-black/50 rounded-lg p-2 border border-emerald-500/20">
            <audio controls className="h-8 w-full" src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" />
          </div>
        </div>

        {/* Privacy Framework Explanation */}
        <div className="mt-auto rounded-xl border border-emerald-500/20 bg-black/30 p-3.5 text-xs text-emerald-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-400 font-mono">
            <ShieldCheck className="size-4" />
            <span>Zero Personal Number Disclosure</span>
          </div>
          <p className="text-[11px] leading-relaxed text-emerald-500/70 font-sans">
            All audio replies are queued through the WORKCRAFT Local Go WebSocket gateway. The salon owner receives an authentic voice note directly from the official salon business line.
          </p>
        </div>
      </aside>
    </div>
  );
};
