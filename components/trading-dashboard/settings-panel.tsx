'use client';

import { useState } from 'react';

export function SettingsPanel() {
  const [stakeEnabled, setStakeEnabled] = useState(false);
  const [martingaleEnabled, setMartingaleEnabled] = useState(false);
  const [autoSwitchEnabled, setAutoSwitchEnabled] = useState(false);

  return (
    <div className="w-full mb-6">
      {/* Stake Setting */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-[rgb(255,193,7)] text-sm font-bold">STAKE</p>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={stakeEnabled}
            onChange={(e) => setStakeEnabled(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-12 h-6 rounded-full transition-colors ${stakeEnabled ? 'bg-[rgb(0,195,144)]' : 'bg-gray-600'}`}>
            <div className={`w-5 h-5 rounded-full bg-white m-0.5 transition-transform ${stakeEnabled ? 'translate-x-6' : ''}`} />
          </div>
        </label>
      </div>

      {/* Martingale Setting */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-[rgb(255,193,7)] text-sm font-bold">MARTINGALE</p>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={martingaleEnabled}
            onChange={(e) => setMartingaleEnabled(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-12 h-6 rounded-full transition-colors ${martingaleEnabled ? 'bg-[rgb(0,195,144)]' : 'bg-gray-600'}`}>
            <div className={`w-5 h-5 rounded-full bg-white m-0.5 transition-transform ${martingaleEnabled ? 'translate-x-6' : ''}`} />
          </div>
        </label>
      </div>

      {/* Auto Switch Vol Setting */}
      <div className="flex items-center justify-between">
        <p className="text-[rgb(255,193,7)] text-sm font-bold">AUTO SWITCH VOL</p>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={autoSwitchEnabled}
            onChange={(e) => setAutoSwitchEnabled(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-12 h-6 rounded-full transition-colors ${autoSwitchEnabled ? 'bg-[rgb(0,195,144)]' : 'bg-gray-600'}`}>
            <div className={`w-5 h-5 rounded-full bg-white m-0.5 transition-transform ${autoSwitchEnabled ? 'translate-x-6' : ''}`} />
          </div>
        </label>
      </div>
    </div>
  );
}
