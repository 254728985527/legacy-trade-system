import React from 'react';
import { ConnectionStatus } from '../types';
import { Radio, Settings, Volume2, VolumeX, Zap } from 'lucide-react';

interface HeaderProps {
  connectionStatus: ConnectionStatus;
  pingMs: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  connectionStatus,
  pingMs,
  soundEnabled,
  setSoundEnabled,
  onOpenSettings,
}) => {
  return (
    <header className="mb-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Status & Settings */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(212,175,55,0.35)] bg-[#111] text-[#D4AF37] text-xs font-mono font-bold">
            <Zap size={13} className="text-[#F4CB4B]" />
            <span>DERIV WS DIRECT</span>
          </div>

          <button
            id="btn-toggle-sound"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg border border-[rgba(212,175,55,0.35)] bg-[#0a0a0a] text-[#D4AF37] hover:bg-[#151515] transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-gray-500" />}
          </button>

          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="p-2 rounded-lg border border-[rgba(212,175,55,0.35)] bg-[#0a0a0a] text-[#D4AF37] hover:bg-[#151515] transition-colors cursor-pointer"
            title="Deriv Connection Settings"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Center Title */}
        <div className="text-center flex-1">
          <h1 className="font-['Cinzel',serif] font-extrabold text-2xl md:text-3xl lg:text-4xl tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#FFE9A8] via-[#D4AF37] to-[#8a6a1c] drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3">
            <span>♛</span>
            <span>LAST DIGIT PREDICTION</span>
            <span>♛</span>
          </h1>
          <div className="font-mono text-[11px] tracking-[5px] text-[#D4AF37] mt-0.5 uppercase font-semibold">
            REAL-TIME AI ANALYSIS
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 font-mono text-[11px] text-[#8b8b8b]">
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_6px_#3b82f6]"></i> LIVE / CURRENT DIGIT
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_#22c55e]"></i> HIGHEST %
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-full bg-[#eab308] shadow-[0_0_6px_#eab308]"></i> 2ND HIGHEST %
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-[0_0_6px_#ef4444]"></i> LOWEST %
            </span>
          </div>
        </div>

        {/* Right Live Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 border border-[#22c55e] rounded-lg font-mono font-bold text-xs text-[#22c55e] bg-[rgba(34,197,94,0.08)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]"></span>
            </span>
            <span>LIVE</span>
            <span className="text-[10px] text-gray-400 border-l border-gray-700 pl-2 font-normal flex items-center gap-1">
              <Zap size={10} className="text-[#F4CB4B]" />
              {pingMs > 0 ? `${pingMs}ms` : '1s'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
