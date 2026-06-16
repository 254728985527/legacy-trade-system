'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { OverAnalysisResult } from '@/hooks/use-signal-analysis';

interface SignalPopupProps {
  signal: OverAnalysisResult | null;
  onClose: () => void;
  autoClose?: number; // auto-close after ms
}

export function SignalPopup({ signal, onClose, autoClose = 8000 }: SignalPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (signal) {
      setVisible(true);
      if (autoClose > 0) {
        const timer = setTimeout(() => {
          setVisible(false);
          onClose();
        }, autoClose);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [signal, autoClose, onClose]);

  if (!signal || !visible || !signal.allPassed) {
    return null;
  }

  const isOver = signal.recommendation.includes('OVER');
  const signalColor = isOver
    ? 'border-emerald-500 bg-emerald-500/10'
    : 'border-red-500 bg-red-500/10';
  const textColor = isOver ? 'text-emerald-400' : 'text-red-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => {
          setVisible(false);
          onClose();
        }}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md mx-4 rounded-2xl border-2 ${signalColor} p-8 shadow-2xl animate-bounce`}
      >
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <h2 className={`text-3xl font-black mb-6 ${textColor}`}>
          {signal.recommendation}
        </h2>

        <div className="space-y-4">
          {/* Section 1 */}
          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white font-semibold">Section 1 (Oldest 3)</p>
              <p className={`font-bold ${signal.section1.passed ? 'text-emerald-400' : 'text-gray-400'}`}>
                {signal.section1.percentage.toFixed(0)}%
              </p>
            </div>
            <p className="text-gray-300 text-sm">{signal.section1.digits.join(', ')}</p>
            <p className="text-gray-400 text-xs mt-1">Threshold: {isOver ? '≥7' : '≤3'}</p>
          </div>

          {/* Section 2 */}
          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white font-semibold">Section 2 (Middle 3)</p>
              <p className={`font-bold ${signal.section2.passed ? 'text-emerald-400' : 'text-gray-400'}`}>
                {signal.section2.percentage.toFixed(0)}%
              </p>
            </div>
            <p className="text-gray-300 text-sm">{signal.section2.digits.join(', ')}</p>
            <p className="text-gray-400 text-xs mt-1">Threshold: {isOver ? '≥4' : '≤6'}</p>
          </div>

          {/* Section 3 */}
          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white font-semibold">Section 3 (Newest 4)</p>
              <p className={`font-bold ${signal.section3.passed ? 'text-emerald-400' : 'text-gray-400'}`}>
                {signal.section3.percentage.toFixed(0)}%
              </p>
            </div>
            <p className="text-gray-300 text-sm">{signal.section3.digits.join(', ')}</p>
            <p className="text-gray-400 text-xs mt-1">Threshold: {isOver ? '≥3' : '≤7'}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
            onClick={() => {
              console.log('[v0] User clicked Buy on signal:', signal.recommendation);
              setVisible(false);
              onClose();
            }}
          >
            TAKE TRADE
          </button>
          <button
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
            onClick={() => {
              setVisible(false);
              onClose();
            }}
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
