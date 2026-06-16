'use client';

import { useState } from 'react';
import { Play, Square } from 'lucide-react';

interface TradeControlsPanelProps {
  baseStake: number;
  onStakeChange: (stake: number) => void;
  martingaleEnabled: boolean;
  onMartingaleToggle: (enabled: boolean) => void;
  martingaleMultiplier: number;
  onMultiplierChange: (multiplier: number) => void;
  martingaleDigit?: number;
  onMartingaleDigitChange?: (digit: number) => void;
  autoTradeEnabled: boolean;
  onAutoTradeToggle: (enabled: boolean) => void;
  onBuyClick: () => void;
}

export function TradeControlsPanel({
  baseStake,
  onStakeChange,
  martingaleEnabled,
  onMartingaleToggle,
  martingaleMultiplier,
  onMultiplierChange,
  martingaleDigit = 5,
  onMartingaleDigitChange,
  autoTradeEnabled,
  onAutoTradeToggle,
  onBuyClick,
}: TradeControlsPanelProps) {
  const [stakeInput, setStakeInput] = useState(baseStake.toString());
  const [multiplierInput, setMultiplierInput] = useState(martingaleMultiplier.toString());
  const [digitInput, setDigitInput] = useState(martingaleDigit.toString());

  return (
    <div className="w-full bg-gradient-to-b from-[rgb(30,36,47)] to-[rgb(20,24,31)] rounded-lg p-5 mb-6">
      {/* STAKE Section */}
      <div className="mb-6">
        <label className="flex items-center gap-3 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={true}
            disabled
            className="w-4 h-4"
          />
          <p className="text-[rgb(255,193,7)] text-sm font-bold">STAKE</p>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={stakeInput}
            onChange={(e) => {
              setStakeInput(e.target.value);
              onStakeChange(parseFloat(e.target.value) || 0);
            }}
            className="flex-1 bg-[rgb(40,46,57)] text-white px-3 py-2 rounded border border-[rgb(255,193,7,0.2)] focus:border-[rgb(255,193,7)] focus:outline-none transition-colors"
            placeholder="Enter stake amount"
          />
          <span className="text-gray-400 text-sm">USD</span>
        </div>
        <p className="text-gray-500 text-xs mt-2">Current stake: ${baseStake.toFixed(2)}</p>
      </div>

      {/* MARTINGALE Section */}
      <div className="mb-6 pb-6 border-b border-[rgb(255,255,255,0.08)]">
        <label className="flex items-center gap-3 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={martingaleEnabled}
            onChange={(e) => onMartingaleToggle(e.target.checked)}
            className="w-4 h-4 accent-[rgb(255,193,7)]"
          />
          <p className="text-[rgb(255,193,7)] text-sm font-bold">MARTINGALE</p>
        </label>
        {martingaleEnabled && (
          <div className="space-y-3 ml-7">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm min-w-fit">Multiplier:</span>
              <input
                type="number"
                value={multiplierInput}
                onChange={(e) => {
                  setMultiplierInput(e.target.value);
                  onMultiplierChange(parseFloat(e.target.value) || 1);
                }}
                step="0.1"
                className="flex-1 bg-[rgb(40,46,57)] text-white px-3 py-2 rounded border border-[rgb(255,193,7,0.2)] focus:border-[rgb(255,193,7)] focus:outline-none transition-colors"
                placeholder="e.g., 2.0"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm min-w-fit">Loss Digit (0-9):</span>
              <select
                value={digitInput}
                onChange={(e) => {
                  setDigitInput(e.target.value);
                  onMartingaleDigitChange?.(parseInt(e.target.value));
                }}
                className="flex-1 bg-[rgb(40,46,57)] text-white px-3 py-2 rounded border border-[rgb(255,193,7,0.2)] focus:border-[rgb(255,193,7)] focus:outline-none transition-colors"
              >
                {Array.from({ length: 10 }, (_, i) => i).map((digit) => (
                  <option key={digit} value={digit}>
                    {digit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {martingaleEnabled && (
          <p className="text-gray-500 text-xs mt-3 ml-7">
            On loss digit {digitInput}, next stake = ${baseStake.toFixed(2)} × {martingaleMultiplier.toFixed(1)}
          </p>
        )}
      </div>

      {/* AUTO TRADE Button */}
      <div className="mb-6">
        <button
          onClick={() => onAutoTradeToggle(!autoTradeEnabled)}
          className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
            autoTradeEnabled
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/50 ring-2 ring-red-500'
              : 'bg-[rgb(255,193,7)] hover:bg-yellow-400 text-black shadow-lg'
          }`}
        >
          {autoTradeEnabled ? (
            <>
              <Square className="w-5 h-5" />
              STOP AUTO TRADE
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              RUN AUTO TRADE
            </>
          )}
        </button>
        {autoTradeEnabled && (
          <p className="text-red-400 text-xs mt-2 text-center">
            Auto trading is ACTIVE - buying on every tick
          </p>
        )}
      </div>

      {/* Manual BUY Button */}
      <button
        onClick={onBuyClick}
        disabled={autoTradeEnabled}
        className={`w-full py-4 px-4 rounded-lg font-bold text-lg transition-all ${
          autoTradeEnabled
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
            : 'bg-[rgb(0,200,136)] hover:bg-[rgb(0,220,156)] text-white shadow-lg hover:shadow-xl hover:scale-105'
        }`}
      >
        BUY
      </button>
    </div>
  );
}
