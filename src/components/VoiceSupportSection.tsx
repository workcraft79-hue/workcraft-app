import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { PortalCard } from './PortalCard';
import { VoiceRecorder } from './VoiceRecorder';

export const VoiceSupportSection: React.FC = () => {
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <PortalCard title="Voice Support" kicker="PRIVATE IN-PORTAL TICKETS">
        <VoiceRecorder onUploaded={setUploadedUrl} />
        {uploadedUrl && (
          <p className="mt-3 text-[10px] font-mono text-emerald-300">
            Voice ticket uploaded securely and linked to the support queue.
          </p>
        )}
        <p className="mt-4 text-[10px] font-mono font-bold uppercase tracking-[.18em] text-[#D9A441]">
          Incoming voice feed · newest first
        </p>
        <div className="mt-2 rounded-xl border border-emerald-500/20 bg-black/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white font-mono">
                [WC-101] Hamza · Seven Cuts Salon
              </p>
              <p className="mt-1 text-[10px] font-mono text-emerald-500/70">
                Incoming voice note · received just now · newest first
              </p>
            </div>
            <Volume2 className="size-4 text-[#D9A441]" />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <audio controls className="h-8 w-full" src={uploadedUrl || undefined} />
            <button className="shrink-0 rounded-lg bg-[#D9A441] px-3.5 py-2 text-[10px] font-mono font-bold uppercase text-[#12241C] hover:bg-[#e0b252] transition active:scale-95 shadow-sm">
              Reply via Audio
            </button>
          </div>
        </div>
      </PortalCard>

      <PortalCard title="Support routing" kicker="NO PERSONAL NUMBER DISCLOSURE">
        <div className="space-y-3 text-xs text-emerald-500/70">
          <p className="font-sans leading-relaxed">
            Owners record inside the portal; the dashboard stores only the external media URL,
            not audio bytes in PostgreSQL.
          </p>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-emerald-300">
            <span className="font-mono font-bold text-emerald-400">Privacy Shield Active:</span> Founder identity and personal phone number remain strictly hidden from salon owners.
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-black/30 p-3">
            <p className="font-mono font-bold text-white uppercase text-[11px]">Response target</p>
            <p className="mt-1 text-[10px] font-mono text-emerald-500/70">
              Priority voice tickets are held for a 15-minute founder response window.
            </p>
          </div>
        </div>
      </PortalCard>
    </div>
  );
};
