'use client';

import type { DigitData } from '@/hooks/use-digit-history';

interface LDPDisplayProps {
  digitHistory: DigitData[];
}

export function LDPDisplay({ digitHistory }: LDPDisplayProps) {
  return (
    <div className="w-full bg-gradient-to-b from-[rgb(30,36,47)] to-[rgb(20,24,31)] rounded-lg p-5 mb-6">
      <p className="text-[rgb(255,193,7)] text-sm font-bold mb-4">LDP - Last 10 Digits</p>
      
      <div className="flex flex-wrap gap-2">
        {digitHistory.slice(-10).map((data, index) => {
          // Color code: high digits (7-9) in green, low digits (0-3) in red, mid (4-6) in gray
          let bgColor = 'bg-gray-600';
          if (data.digit >= 7) {
            bgColor = 'bg-emerald-500';
          } else if (data.digit <= 3) {
            bgColor = 'bg-red-500';
          }

          return (
            <div
              key={`${data.timestamp}-${index}`}
              className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg`}
              title={new Date(data.timestamp).toLocaleTimeString()}
            >
              {data.digit}
            </div>
          );
        })}
      </div>

      {digitHistory.length === 0 && (
        <p className="text-gray-400 text-sm">Waiting for live digits...</p>
      )}
    </div>
  );
}
