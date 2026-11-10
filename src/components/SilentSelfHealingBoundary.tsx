import React from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

interface SilentSelfHealingBoundaryProps {
  areaName: string;
  children: React.ReactNode;
  onSilentRecovered?: (detail: { areaName: string; message: string; timestamp: string }) => void;
}

interface SilentSelfHealingBoundaryState {
  hasError: boolean;
  recoverCount: number;
}

export class SilentSelfHealingBoundary extends React.Component<
  SilentSelfHealingBoundaryProps,
  SilentSelfHealingBoundaryState
> {
  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: SilentSelfHealingBoundaryProps) {
    super(props);
    this.state = { hasError: false, recoverCount: 0 };
  }

  static getDerivedStateFromError(): Partial<SilentSelfHealingBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onSilentRecovered?.({
      areaName: this.props.areaName,
      message: error.message || 'Recovered view glitch automatically',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    // Silently auto-recover within 800ms so field agents, salon owners, and founders never see a broken screen
    this.resetTimer = setTimeout(() => {
      this.setState((prev) => ({
        hasError: false,
        recoverCount: prev.recoverCount + 1,
      }));
    }, 800);
  }

  componentWillUnmount() {
    if (this.resetTimer) clearTimeout(this.resetTimer);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-emerald-500/30 bg-[#102019] p-6 text-center space-y-2.5 max-w-md mx-auto my-8">
          <div className="mx-auto size-10 rounded-xl border border-emerald-500/40 bg-emerald-500/15 grid place-items-center text-emerald-300">
            <RefreshCw className="size-5 animate-spin" />
          </div>
          <p className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-400" />
            <span>Refreshing {this.props.areaName}...</span>
          </p>
          <p className="text-xs text-white/65 font-sans">
            System detected a display hiccup and restored your screen automatically.
          </p>
        </div>
      );
    }

    return <React.Fragment key={this.state.recoverCount}>{this.props.children}</React.Fragment>;
  }
}
