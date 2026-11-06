import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Cpu,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SystemErrorTelemetry } from '../types/workcraft';

interface SelfHealingModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetries: SystemErrorTelemetry[];
  onApplyPatch: (id: string) => void;
}

export const SelfHealingModal: React.FC<SelfHealingModalProps> = ({
  isOpen,
  onClose,
  telemetries,
  onApplyPatch,
}) => {
  const [selectedErrorId, setSelectedErrorId] = useState<string>(
    telemetries[0]?.id || 'ERR-902'
  );
  const [isPatching, setIsPatching] = useState(false);
  const [appliedPatches, setAppliedPatches] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentError =
    telemetries.find((t) => t.id === selectedErrorId) || telemetries[0];

  const handleApply = (id: string) => {
    setIsPatching(true);
    setTimeout(() => {
      setIsPatching(false);
      setAppliedPatches((prev) => ({ ...prev, [id]: true }));
      onApplyPatch(id);
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-3xl border border-white/10 bg-[#102019] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/[0.04] border border-white/10 text-[#00FFFF]">
              <Cpu className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#F5F2E9]">Autonomous Self-Healing Telemetry</h3>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                  AUTO-DEPLOYED (0s DOWNTIME)
                </span>
              </div>
              <p className="text-xs font-mono text-white/55 mt-0.5">
                Intercepts React ErrorBoundaries &amp; Go Fiber panics. Patches passing V8 sandbox with &gt;99% confidence auto-deploy with zero founder manual review.
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

        {/* Content Layout */}
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* Left: Intercepted Errors Queue */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/45">
              Live Intercepted Queue ({telemetries.length})
            </p>

            {telemetries.map((t) => {
              const isResolved = appliedPatches[t.id] || t.status === 'AUTO_DEPLOYED';
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedErrorId(t.id)}
                  className={`w-full text-left rounded-xl border p-3 transition ${
                    selectedErrorId === t.id
                      ? 'border-[#00FFFF] bg-white/[0.08] shadow-sm'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#F5F2E9]">[{t.id}]</span>
                    <span
                      className={`text-[9px] font-mono font-bold rounded px-1.5 py-0.5 border ${
                        isResolved
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                      }`}
                    >
                      {isResolved ? 'AUTO-DEPLOYED ✓' : 'PATCH READY'}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-[#00FFFF] mt-1 truncate">
                    {t.component}
                  </p>
                  <p className="text-[10px] text-white/55 truncate">
                    {t.salonName} ({t.salonId})
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Error Details & Gemini Diff Viewer */}
          {currentError && (
            <div className="lg:col-span-2 space-y-4">
              {/* Pinpoint Metadata Card */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="size-3.5 text-amber-400" />
                    <span>Runtime Exception Intercepted &amp; Neutralized</span>
                  </span>
                  <span className="text-[10px] font-mono text-white/55">
                    {currentError.timestamp}
                  </span>
                </div>

                <p className="text-xs font-mono text-[#F5F2E9] font-bold bg-black/50 p-2.5 rounded-lg border border-white/10 break-all">
                  {currentError.error}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono pt-1">
                  <div className="rounded bg-black/40 p-1.5 border border-white/10">
                    <span className="text-white/45 block">Component</span>
                    <span className="text-[#F5F2E9] truncate block">{currentError.component}</span>
                  </div>
                  <div className="rounded bg-black/40 p-1.5 border border-white/10">
                    <span className="text-white/45 block">File &amp; Line</span>
                    <span className="text-[#00FFFF] truncate block">
                      :{currentError.line}
                    </span>
                  </div>
                  <div className="rounded bg-black/40 p-1.5 border border-white/10">
                    <span className="text-white/45 block">Tenant Impact</span>
                    <span className="text-[#F5F2E9] truncate block">{currentError.salonName}</span>
                  </div>
                  <div className="rounded bg-black/40 p-1.5 border border-white/10">
                    <span className="text-white/45 block">AI Confidence</span>
                    <span className="text-emerald-400 font-bold block">
                      {currentError.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Gemini Autonomous Diff & Sandbox Verification */}
              <div className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#00FFFF] flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-[#00FFFF]" />
                    <span>Gemini AI Code Patch &amp; Sandboxed V8 Test</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                    12 / 12 Unit Tests Passing
                  </span>
                </div>

                <div className="rounded-lg bg-black/80 p-3 text-[11px] leading-relaxed border border-white/10 font-mono overflow-x-auto text-emerald-300">
                  <pre>{currentError.diff}</pre>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[10px] font-sans text-white/55">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      Patch auto-deployed to production · Hot-reloaded with 0s downtime.
                    </span>
                  </div>

                  {!(appliedPatches[currentError.id] || currentError.status === 'AUTO_DEPLOYED') && (
                    <button
                      onClick={() => handleApply(currentError.id)}
                      disabled={isPatching}
                      className="flex items-center gap-1.5 rounded-xl bg-[#00FFFF] hover:bg-[#38e8e8] text-[#12241C] px-4 py-2 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-[0_0_10px_rgba(0,255,255,0.4)]"
                    >
                      <Zap className="size-3.5" />
                      <span>{isPatching ? 'Deploying...' : 'Force Re-Deploy'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
