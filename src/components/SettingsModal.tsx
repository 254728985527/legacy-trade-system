import React, { useState } from 'react';
import { ConnectionStatus } from '../types';
import { RefreshCw, Server, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appId: string;
  serverUrl: string;
  onSave: (appId: string, serverUrl: string) => void;
  connectionStatus: ConnectionStatus;
  pingMs: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  appId,
  serverUrl,
  onSave,
  connectionStatus,
  pingMs,
}) => {
  const [inputAppId, setInputAppId] = useState(appId);
  const [inputServerUrl, setInputServerUrl] = useState(serverUrl);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(inputAppId, inputServerUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.4)] rounded-2xl p-6 max-w-md w-full shadow-[0_0_30px_rgba(212,175,55,0.2)] font-sans relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="font-['Cinzel',serif] font-extrabold text-xl text-[#F4CB4B] mb-1 flex items-center gap-2">
          <Server size={20} className="text-[#D4AF37]" /> DERIV API SETTINGS
        </h3>
        <p className="text-xs text-gray-400 mb-4 font-mono">
          Configure custom Deriv App ID and server endpoint for real WebSocket data.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
          <div>
            <label className="block text-gray-300 font-bold mb-1">DERIV APP ID</label>
            <input
              type="text"
              value={inputAppId}
              onChange={(e) => setInputAppId(e.target.value)}
              placeholder="1089"
              className="w-full bg-[#111] border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4CB4B]"
            />
            <span className="text-[10px] text-gray-500 mt-1 block">
              Default public App ID: 1089 or 61048
            </span>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">SERVER URL</label>
            <input
              type="text"
              value={inputServerUrl}
              onChange={(e) => setInputServerUrl(e.target.value)}
              placeholder="ws.derivws.com"
              className="w-full bg-[#111] border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4CB4B]"
            />
          </div>

          <div className="p-3 bg-[#111] border border-gray-800 rounded-lg flex items-center justify-between text-gray-300">
            <div>
              <div className="text-[10px] text-gray-400">STATUS</div>
              <div className="font-bold text-[#22c55e] uppercase">{connectionStatus}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400">LATENCY</div>
              <div className="font-bold text-[#F4CB4B]">{pingMs} ms</div>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-800 text-gray-300 hover:bg-[#151515] font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#F4CB4B] text-black font-extrabold hover:bg-[#e2bb3d] transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(244,203,75,0.3)]"
            >
              <RefreshCw size={14} /> Reconnect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
