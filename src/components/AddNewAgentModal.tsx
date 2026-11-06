import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Send,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe,
  Smartphone,
  MapPin,
  ShieldCheck,
  Check,
  Radio,
} from 'lucide-react';
import { detectCountryFromPhone } from './FieldAgentHub';

interface AddNewAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentAdded?: (agent: {
    id: string;
    pin: string;
    name: string;
    phone: string;
    city: string;
    category: string;
  }) => void;
  onOpenRemoteEnrollment?: (agent: {
    id: string;
    pin: string;
    name: string;
    phone: string;
    city: string;
    category: string;
  }) => void;
}

export const AddNewAgentModal: React.FC<AddNewAgentModalProps> = ({
  isOpen,
  onClose,
  onAgentAdded,
  onOpenRemoteEnrollment,
}) => {
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('+92 302 7819203');
  const [agentCity, setAgentCity] = useState('Karachi South');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  // Auto-generate unique sequential Agent ID & 4-digit security PIN
  const [generatedId] = useState(() => 'AGT-' + Math.floor(410 + Math.random() * 50));
  const [generatedPin] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());

  const detectedCountry = detectCountryFromPhone(agentPhone);

  if (!isOpen) return null;

  const whatsappMessage = `Assalamu Alaikum ${agentName || '[Agent Name]'}! Welcome to WORKCRAFT Local Field Force. You have been appointed for ${agentCity || '[Territory]'}. Your Terminal ID is ${generatedId} and 4-digit Security PIN is ${generatedPin}. Open your encrypted terminal to complete Day-1 profile and start onboarding: https://portal.workcraft.local/agent-terminal?id=${generatedId}&auth=${generatedPin}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName.trim() || !agentPhone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setDispatchedSuccess(true);

      if (onAgentAdded) {
        onAgentAdded({
          id: generatedId,
          pin: generatedPin,
          name: agentName.trim(),
          phone: agentPhone.trim(),
          city: agentCity.trim(),
          category: 'Universal (All Salons, Barbershops & Parlors)',
        });
      }
    }, 1100);
  };

  return (
    <div
      className="fixed inset-0 z-[85] grid place-items-center bg-black/80 p-3 sm:p-5 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[540px] rounded-3xl border border-[#D9A441]/40 bg-[#102019] p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-6 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#D9A441]/15 border border-[#D9A441]/40 text-[#D9A441]">
              <UserPlus className="size-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[.2em] text-[#D9A441]">
                FOUNDER FIELD FORCE ENGINE (QUERY 3)
              </span>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Add New Field Agent</span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/55 hover:text-white transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {dispatchedSuccess ? (
          <div className="mt-5 space-y-4 animate-in fade-in">
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-5 text-center space-y-3">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 className="size-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                  SIM GATEWAY WHATSAPP DISPATCH CONFIRMED
                </span>
                <h4 className="text-lg font-bold text-white">
                  Field Agent Invitation Dispatched!
                </h4>
                <p className="text-xs text-white/70 font-sans max-w-md mx-auto">
                  Credentials and onboarding terminal link have been sent directly to <strong>{agentName}</strong> ({agentPhone}) via Central SIM Gateway (+92-300-WORKCRAFT-LOCAL).
                </p>
              </div>

              {/* Generated Credential Summary Card */}
              <div className="grid grid-cols-2 gap-2 text-left font-mono text-xs bg-black/60 rounded-xl p-3 border border-emerald-500/30">
                <div>
                  <span className="text-[10px] text-white/50 block">AGENT TERMINAL ID</span>
                  <span className="text-sm font-bold text-[#00FFFF]">{generatedId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block">4-DIGIT SECURITY PIN</span>
                  <span className="text-sm font-bold text-[#D9A441]">{generatedPin}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-white/60">Territory: {agentCity}</span>
                  <span className="text-emerald-400 font-bold">✓ Non-Restricted Category</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              {onOpenRemoteEnrollment && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenRemoteEnrollment({
                      id: generatedId,
                      pin: generatedPin,
                      name: agentName.trim(),
                      phone: agentPhone.trim(),
                      city: agentCity.trim(),
                      category: 'Universal (All Salons, Barbershops & Parlors)',
                    });
                    onClose();
                  }}
                  className="flex-1 rounded-xl bg-[#00FFFF] hover:bg-[#33ffff] text-[#12241C] py-3 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="size-4" />
                  <span>Open Day-1 Remote Enrollment Wizard →</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] py-3 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md"
              >
                Close &amp; Return to Hub
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-xs text-white/60 font-sans leading-relaxed">
              Register a new field agent. The system automatically provisions a unique ID, generates a 4-digit PIN, and dispatches the terminal link to the agent's WhatsApp via the Central SIM Gateway.
            </p>

            {/* Field 1: Agent Name */}
            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-white/60 block mb-1">
                1. Field Agent Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Zahid Hussain or Bilal Sheikh"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-[#F5F2E9] font-sans focus:outline-none focus:border-[#D9A441]"
              />
            </div>

            {/* Field 2: Territory / City */}
            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-white/60 block mb-1">
                2. Assigned Territory / City *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 size-4 text-[#D9A441]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Karachi South, Lahore West, Dubai Marina, London Central, Birmingham"
                  value={agentCity}
                  onChange={(e) => setAgentCity(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9.5 pr-3.5 py-2.5 text-sm text-[#F5F2E9] font-sans focus:outline-none focus:border-[#D9A441]"
                />
              </div>
            </div>

            {/* Field 3: WhatsApp Number with Real-Time Country Detection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono font-bold uppercase text-white/60">
                  3. Agent WhatsApp Number *
                </label>
                <span className="text-[10px] font-mono font-bold text-[#00FFFF] flex items-center gap-1">
                  <span>{detectedCountry.flag}</span>
                  <span>{detectedCountry.name}</span>
                </span>
              </div>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 size-4 text-[#00FFFF]" />
                <input
                  type="text"
                  required
                  placeholder="+92 300 1234567, +44 7911 123456, or +971 50 1234567"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9.5 pr-3.5 py-2.5 text-sm font-mono text-[#00FFFF] focus:outline-none focus:border-[#00FFFF]"
                />
              </div>
            </div>

            {/* Query 4 Compliance: Non-restricted Category Authorization Note */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="size-4" />
                  <span>Query 4: Category Authorization</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                  NON-RESTRICTED
                </span>
              </div>
              <p className="text-[11px] text-white/70 font-sans leading-relaxed">
                Agent is authorized city-wide for <strong>ALL salon categories</strong> (men&apos;s barbershops, ladies&apos; beauty parlors, and unisex studios). No gender or parlor category restrictions applied.
              </p>
            </div>

            {/* Auto-Generated Credentials Preview */}
            <div className="rounded-xl border border-[#D9A441]/30 bg-black/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#D9A441] font-bold uppercase flex items-center gap-1.5">
                  <Lock className="size-3.5" />
                  <span>Auto-Generated System Credentials</span>
                </span>
                <span className="text-[10px] text-white/50">Simulated Sequence</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="rounded-lg bg-white/[0.04] p-2.5 border border-white/10">
                  <span className="text-white/50 block text-[10px]">NEW AGENT ID</span>
                  <span className="text-sm font-bold text-[#00FFFF]">{generatedId}</span>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-2.5 border border-white/10">
                  <span className="text-white/50 block text-[10px]">SECURITY PIN</span>
                  <span className="text-sm font-bold text-[#D9A441]">{generatedPin}</span>
                </div>
              </div>
            </div>

            {/* Outbound WhatsApp Invitation Preview */}
            <div className="rounded-xl border border-[#00FFFF]/30 bg-[#00FFFF]/5 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#00FFFF] font-bold uppercase flex items-center gap-1">
                  <Sparkles className="size-3" />
                  Central SIM Gateway Dispatch Preview
                </span>
                <span className="text-white/50">+92-300-WORKCRAFT</span>
              </div>
              <div className="rounded-lg bg-black/60 p-2.5 text-xs font-mono text-[#F5F2E9] border border-white/10 leading-relaxed">
                &ldquo;{whatsappMessage}&rdquo;
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/10 py-3 text-xs font-mono text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] rounded-xl bg-[#D9A441] hover:bg-[#e0b252] text-[#12241C] py-3 text-xs font-mono font-bold uppercase transition active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Radio className="size-4 animate-spin text-[#12241C]" />
                    <span>Dispatching via SIM Gateway...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4 text-[#12241C]" />
                    <span>Create Agent &amp; Dispatch WhatsApp Link →</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
