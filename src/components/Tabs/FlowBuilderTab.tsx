import React, { useState } from 'react';
import { 
  GitFork, Globe, MessageSquare, ArrowRight, ShieldCheck, 
  Smartphone, Star, CheckCircle, Zap, ChevronRight 
} from 'lucide-react';
import { FlowNode, Language, SalonProfile } from '../../types';
import { FLOW_NODES } from '../../data/mockData';

interface FlowBuilderTabProps {
  salon: SalonProfile;
}

export const FlowBuilderTab: React.FC<FlowBuilderTabProps> = ({ salon }) => {
  const [currentLang, setCurrentLang] = useState<Language>('ur');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('NODE-03');
  const [simulatedSelectedService, setSimulatedSelectedService] = useState<string | null>(null);
  const [simulatedRating, setSimulatedRating] = useState<number | null>(null);

  const selectedNode = FLOW_NODES.find((n) => n.id === selectedNodeId) || FLOW_NODES[0];

  return (
    <div className="space-y-3.5 pb-20">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Tri-Lingual Flow Builder
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero-dashboard state machine (English, Urdu &amp; Arabic)
            </p>
          </div>
          <span className="text-[10px] text-sky-400 font-mono bg-sky-950/70 border border-sky-800/40 px-2 py-0.5 rounded">
            State Router Active
          </span>
        </div>

        {/* Language Switcher Bar */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-800">
          <button
            onClick={() => setCurrentLang('en')}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              currentLang === 'en'
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>English (EN)</span>
          </button>

          <button
            onClick={() => setCurrentLang('ur')}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              currentLang === 'ur'
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span className="font-['Noto_Nastaliq_Urdu']">اردو (Urdu)</span>
          </button>

          <button
            onClick={() => setCurrentLang('ar')}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
              currentLang === 'ar'
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span className="font-['Noto_Sans_Arabic']">العربية (Arabic)</span>
          </button>
        </div>
      </div>

      {/* State Machine Step Navigator */}
      <div className="space-y-1.5">
        <label className="text-[10px] text-slate-400 font-mono uppercase px-1">
          State Machine Conversational Tree:
        </label>
        <div className="space-y-1.5">
          {FLOW_NODES.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  setSimulatedSelectedService(null);
                  setSimulatedRating(null);
                }}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-850 border-sky-500/80 shadow-md ring-1 ring-sky-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-6 h-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                      <span>{node.title[currentLang]}</span>
                      {node.code === '1SCREEN_ANTI_CROP_MENU' && (
                        <span className="text-[9px] text-sky-400 font-mono border border-sky-800/40 bg-sky-950/60 px-1 rounded">
                          Anti-Crop
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      State ID: {node.code}
                    </div>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                  isSelected ? 'text-sky-400 translate-x-0.5' : 'text-slate-600'
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details & Live WhatsApp Phone Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">LIVE STATE SIMULATOR</span>
            <h3 className="text-xs font-bold text-white">
              {selectedNode.title[currentLang]}
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
            Go Engine &lt;10ms
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {selectedNode.description[currentLang]}
        </p>

        {/* WhatsApp Mobile Chat Bubble Preview */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-b border-slate-800 pb-1">
            <span>WhatsApp Payload Preview ({currentLang.toUpperCase()})</span>
            <span>12:04 PM</span>
          </div>

          {/* Chat Bubble Body */}
          <div className={`space-y-2 text-xs ${currentLang === 'ur' || currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
            {selectedNode.messageCard[currentLang].header && (
              <div className="font-bold text-sky-400 text-xs">
                {selectedNode.messageCard[currentLang].header}
              </div>
            )}

            <div className="text-slate-200 leading-relaxed whitespace-pre-line text-[11px]">
              {selectedNode.messageCard[currentLang].body}
            </div>

            {/* Anti-Crop 1-Screen Interactive List Preview */}
            {selectedNode.messageCard[currentLang].sections && (
              <div className="space-y-2 pt-1 border-t border-slate-800">
                {selectedNode.messageCard[currentLang].sections?.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">
                      {sec.title}
                    </span>
                    <div className="space-y-1">
                      {sec.rows.map((row, rIdx) => {
                        const isChosen = simulatedSelectedService === row.title;
                        return (
                          <button
                            key={rIdx}
                            onClick={() => setSimulatedSelectedService(row.title)}
                            className={`w-full p-2 rounded-lg border text-xs text-left transition-all ${
                              isChosen
                                ? 'bg-sky-950/80 border-sky-500 text-white font-medium'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                            }`}
                          >
                            <div className="font-semibold text-[11px] text-white">
                              {row.title}
                            </div>
                            {row.description && (
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {row.description}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Reply Buttons */}
            {selectedNode.messageCard[currentLang].buttons && (
              <div className="space-y-1 pt-1.5 border-t border-slate-800">
                {selectedNode.messageCard[currentLang].buttons?.map((btn, bIdx) => (
                  <button
                    key={bIdx}
                    onClick={() => {
                      if (selectedNode.code === 'SMART_REVIEW_BOOSTER') {
                        setSimulatedRating(bIdx === 0 ? 5 : 3);
                      }
                    }}
                    className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-sky-500 rounded-lg text-sky-300 text-xs font-medium text-center transition-colors active:scale-95"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            )}

            {/* 2-Step Review Booster Resolution Outcome */}
            {selectedNode.code === 'SMART_REVIEW_BOOSTER' && simulatedRating !== null && (
              <div className="mt-2 pt-2 border-t border-slate-800 text-xs">
                {simulatedRating === 5 ? (
                  <div className="bg-emerald-950/80 border border-emerald-800/60 p-2.5 rounded-lg text-emerald-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>5-Star Google Redirect Triggered:</span>
                    </div>
                    <p className="text-[11px] text-emerald-100">
                      Customer redirected to: <code>https://g.page/r/royalcut/review</code> for public 5-star Google review.
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-950/80 border border-amber-800/60 p-2.5 rounded-lg text-amber-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Private Intercept Triggered (1-4 Stars):</span>
                    </div>
                    <p className="text-[11px] text-amber-100">
                      Public Google rating protected! Review feedback sent straight to Salon Owner Malik Tariq's WhatsApp ({salon.ownerPhone}) for private dispute resolution.
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedNode.messageCard[currentLang].footer && (
              <div className="text-[9px] text-slate-500 font-mono text-center pt-1">
                {selectedNode.messageCard[currentLang].footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
