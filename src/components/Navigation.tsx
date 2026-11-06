import React from 'react';
import { QrCode, Users, Video, GitFork, DollarSign } from 'lucide-react';

export type TabId = 'pairing' | 'contacts' | 'broadcast' | 'flow' | 'revenue';

interface NavigationProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  contactsCount: number;
  hasRedAlert: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  contactsCount,
  hasRedAlert,
}) => {
  const tabs = [
    {
      id: 'pairing' as TabId,
      label: 'QR Pairing',
      icon: QrCode,
    },
    {
      id: 'contacts' as TabId,
      label: 'Contacts',
      badge: contactsCount > 0 ? String(contactsCount) : undefined,
      icon: Users,
    },
    {
      id: 'broadcast' as TabId,
      label: 'Broadcast',
      icon: Video,
    },
    {
      id: 'flow' as TabId,
      label: 'Flows',
      icon: GitFork,
    },
    {
      id: 'revenue' as TabId,
      label: 'Revenue',
      alert: hasRedAlert,
      icon: DollarSign,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 items-stretch h-14">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors relative ${
                isActive
                  ? 'text-sky-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.alert && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
                {tab.badge && !tab.alert && (
                  <span className="absolute -top-1.5 -right-3 text-[9px] font-mono px-1 py-0.2 bg-slate-800 border border-slate-700 text-slate-300 rounded leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-sky-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
