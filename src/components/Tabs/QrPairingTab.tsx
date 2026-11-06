import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Smartphone, ShieldCheck, CheckCircle2, 
  Wifi, Zap, Lock, Terminal, Radio, AlertCircle 
} from 'lucide-react';
import { PairingState, SalonProfile } from '../../types';

interface QrPairingTabProps {
  salon: SalonProfile;
  pairingState: PairingState;
  setPairingState: React.Dispatch<React.SetStateAction<PairingState>>;
}

export const QrPairingTab: React.FC<QrPairingTabProps> = ({
  salon,
  pairingState,
  setPairingState,
}) => {
  const [logs, setLogs] = useState<string[]>([
    `[go:engine] Worker pool ready with 32 goroutines`,
    `[supabase] RLS tenant context verified: ${salon.id}`,
    `[whatsmeow] Socket listener bound to 0.0.0.0:8080`,
  ]);

  // Timer countdown for QR refresh
  useEffect(() => {
    if (pairingState.status !== 'qr_ready') return;

    const timer = setInterval(() => {
      setPairingState((prev) => {
        if (prev.expiresInSeconds <= 1) {
          // Regenerate new QR
          const newKey = 'wm_sess_' + Math.random().toString(36).substring(2, 10);
          setLogs((l) => [
            `[whatsmeow] QR expired. Regenerated new Noise handshake token`,
            ...l.slice(0, 10)
          ]);
          return {
            ...prev,
            sessionKey: newKey,
            expiresInSeconds: 20,
            qrPayload: `2@${newKey},${Date.now()},WORKCRAFT_SALON_${salon.id}`
          };
        }
        return {
          ...prev,
          expiresInSeconds: prev.expiresInSeconds - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pairingState.status, salon.id, setPairingState]);

  // Simulate scanning QR
  const handleScanSimulation = () => {
    setPairingState((prev) => ({ ...prev, status: 'authenticating' }));
    setLogs((l) => [
      `[whatsmeow] QR Scanned by client ${salon.phone}`,
      `[noise] Exchanging Curve25519 public keys`,
      ...l
    ]);

    setTimeout(() => {
      setPairingState((prev) => ({
        ...prev,
        status: 'connected',
        connectedAt: new Date().toLocaleTimeString(),
        deviceName: `${salon.name} Shop Terminal (Android SIM)`,
        phoneNumber: salon.phone,
        uptimeSeconds: 0,
      }));
      setLogs((l) => [
        `[whatsmeow] Authentication SUCCESS. Multi-device session persisted to Supabase`,
        `[engine] Inbound webhook listener ACTIVE (zero message fee mode)`,
        ...l
      ]);
    }, 1600);
  };

  const handleDisconnect = () => {
    setPairingState((prev) => ({
      ...prev,
      status: 'qr_ready',
      expiresInSeconds: 20,
      sessionKey: 'wm_sess_' + Math.random().toString(36).substring(2, 10),
    }));
    setLogs((l) => [
      `[whatsmeow] Session terminated. Generating fresh onboarding QR`,
      ...l
    ]);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Salon WhatsApp Onboarding
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Proprietary Go WebSocket pairing via <span className="text-sky-400 font-mono">whatsmeow</span>
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold font-mono ${
              pairingState.status === 'connected' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                pairingState.status === 'connected' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`} />
              {pairingState.status === 'connected' ? 'SOCKET LIVE' : 'PAIRING PENDING'}
            </span>
          </div>
        </div>

        {/* Telemetry Micro Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">API COST</span>
            <span className="text-emerald-400 font-bold">$0.00 / free</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">GO LATENCY</span>
            <span className="text-sky-400 font-bold tabular-nums">&lt;8ms</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">SUPABASE RLS</span>
            <span className="text-slate-200 font-bold">Isolated</span>
          </div>
        </div>
      </div>

      {/* Main QR Code Card */}
      {pairingState.status !== 'connected' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <span className="font-medium text-slate-300">Scan to Pair Salon Terminal</span>
            <span className="font-mono text-sky-400 tabular-nums">
              Expires in: {pairingState.expiresInSeconds}s
            </span>
          </div>

          {/* SVG WhatsApp Web-Style QR Code Container */}
          <div className="relative mx-auto w-56 h-56 bg-white p-3 rounded-2xl shadow-inner flex flex-col items-center justify-center">
            {pairingState.status === 'authenticating' ? (
              <div className="flex flex-col items-center justify-center space-y-2 text-slate-800">
                <RefreshCw className="w-8 h-8 text-sky-600 animate-spin" />
                <span className="text-xs font-bold">Exchanging Keys...</span>
                <span className="text-[10px] text-slate-500 font-mono">Verifying Noise Protocol</span>
              </div>
            ) : (
              <>
                {/* Crisp SVG QR Mockup with Authenticated Pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  {/* Outer corner finders */}
                  <rect x="5" y="5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" rx="2" />
                  <rect x="10" y="10" width="12" height="12" fill="currentColor" rx="1" />

                  <rect x="73" y="5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" rx="2" />
                  <rect x="78" y="10" width="12" height="12" fill="currentColor" rx="1" />

                  <rect x="5" y="73" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" rx="2" />
                  <rect x="10" y="78" width="12" height="12" fill="currentColor" rx="1" />

                  {/* QR Data Matrix Dots */}
                  <circle cx="34" cy="12" r="2.5" fill="currentColor" />
                  <circle cx="42" cy="12" r="2.5" fill="currentColor" />
                  <circle cx="50" cy="12" r="2.5" fill="currentColor" />
                  <circle cx="58" cy="12" r="2.5" fill="currentColor" />
                  <circle cx="66" cy="12" r="2.5" fill="currentColor" />

                  <circle cx="34" cy="20" r="2.5" fill="currentColor" />
                  <circle cx="50" cy="20" r="2.5" fill="currentColor" />
                  <circle cx="66" cy="20" r="2.5" fill="currentColor" />

                  <circle cx="12" cy="35" r="2.5" fill="currentColor" />
                  <circle cx="20" cy="35" r="2.5" fill="currentColor" />
                  <circle cx="28" cy="35" r="2.5" fill="currentColor" />
                  <circle cx="36" cy="35" r="2.5" fill="currentColor" />
                  <circle cx="44" cy="35" r="2.5" fill="currentColor" />
                  <circle cx="56" cy="35" r="2.5" fill="currentColor" />
                  <circle cx="70" cy="35" r="2.5" fill="currentColor" />
                  <circle cx="84" cy="35" r="2.5" fill="currentColor" />

                  <circle cx="12" cy="45" r="2.5" fill="currentColor" />
                  <circle cx="28" cy="45" r="2.5" fill="currentColor" />
                  <circle cx="72" cy="45" r="2.5" fill="currentColor" />
                  <circle cx="86" cy="45" r="2.5" fill="currentColor" />

                  <circle cx="14" cy="55" r="2.5" fill="currentColor" />
                  <circle cx="30" cy="55" r="2.5" fill="currentColor" />
                  <circle cx="40" cy="55" r="2.5" fill="currentColor" />
                  <circle cx="60" cy="55" r="2.5" fill="currentColor" />
                  <circle cx="70" cy="55" r="2.5" fill="currentColor" />
                  <circle cx="84" cy="55" r="2.5" fill="currentColor" />

                  <circle cx="35" cy="72" r="2.5" fill="currentColor" />
                  <circle cx="45" cy="72" r="2.5" fill="currentColor" />
                  <circle cx="55" cy="72" r="2.5" fill="currentColor" />
                  <circle cx="65" cy="72" r="2.5" fill="currentColor" />
                  <circle cx="75" cy="72" r="2.5" fill="currentColor" />
                  <circle cx="85" cy="72" r="2.5" fill="currentColor" />

                  <circle cx="35" cy="85" r="2.5" fill="currentColor" />
                  <circle cx="45" cy="85" r="2.5" fill="currentColor" />
                  <circle cx="60" cy="85" r="2.5" fill="currentColor" />
                  <circle cx="75" cy="85" r="2.5" fill="currentColor" />
                  <circle cx="88" cy="85" r="2.5" fill="currentColor" />

                  {/* Center Lock Badge */}
                  <rect x="42" y="42" width="16" height="16" fill="#0284c7" rx="3" />
                  <path d="M47 49v-1.5a3 3 0 0 1 6 0V49m-4.5 4h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>

                {/* Expiry bar indicator at bottom of QR */}
                <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-sky-600 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(pairingState.expiresInSeconds / 20) * 100}%` }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 text-xs text-slate-300 max-w-xs mx-auto space-y-1.5 text-left bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>How to pair the salon line:</span>
            </div>
            <ol className="list-decimal list-inside text-slate-400 space-y-1 text-[11px] leading-relaxed">
              <li>Open WhatsApp on salon Android/iPhone</li>
              <li>Go to <strong>Settings</strong> &gt; <strong>Linked Devices</strong></li>
              <li>Tap <strong>Link a Device</strong> and point camera here</li>
            </ol>
          </div>

          {/* Action Simulator */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handleScanSimulation}
              disabled={pairingState.status === 'authenticating'}
              className="w-full h-11 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Simulate Scan via Salon Phone</span>
            </button>
          </div>
        </div>
      ) : (
        /* Connected State View */
        <div className="bg-slate-900 border border-emerald-900/40 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white truncate">
                {salon.name} Connected
              </h3>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>{salon.phone}</span>
                <span>·</span>
                <span className="text-emerald-400">Goroutines: 18</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Session Protocol</span>
              <span className="font-mono text-slate-200">Noise XX Handshake (Curve25519)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Connected Terminal</span>
              <span className="font-mono text-slate-200">{pairingState.deviceName}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Tenant Isolation (RLS)</span>
              <span className="font-mono text-emerald-400">Enforced (Salon ID Match)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Zero-Cost Rate</span>
              <span className="font-mono text-sky-400">$0.00 Meta Message Fees</span>
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full py-2 px-3 text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-900/50 rounded-xl transition-colors"
          >
            Disconnect & Re-Pair Device
          </button>
        </div>
      )}

      {/* Real-time Go Engine Log Terminal */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px]">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5 mb-2">
          <span className="flex items-center gap-1.5 text-slate-300 font-semibold text-[10px]">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            Go Microservice Log Feed
          </span>
          <span className="text-[10px] text-slate-500">Auto-stream</span>
        </div>
        <div className="space-y-1 text-slate-400 max-h-32 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-tight truncate">
              <span className="text-slate-400">{(idx + 1).toString().padStart(2, '0')}</span> {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
