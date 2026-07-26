'use client';

import React, { useState, useEffect } from 'react';

interface DashboardData {
  currentDigit: number;
  price: number;
  tickCount: number;
  digitPercentages: number[];
  trendDirection: 'up' | 'down';
  confidence: number;
  overUnderThreshold: number;
  entryPoint: number;
  cursorCurrent: number;
  cursorTarget: number;
}

// Digit Box Component
const DigitBox: React.FC<{ digit: number; percentage: number; isActive?: boolean }> = ({
  digit,
  percentage,
  isActive,
}) => {
  const getColor = () => {
    if (percentage > 6.4) return 'border-green-500 bg-opacity-10 bg-green-500';
    if (percentage < 6.4) return 'border-red-500 bg-opacity-10 bg-red-500';
    return 'border-amber-500 bg-opacity-10 bg-amber-500';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl ${getColor()} ${isActive ? 'ring-2 ring-blue-400' : ''}`}>
        {digit}
      </div>
      <span className="text-sm text-white font-semibold">{percentage.toFixed(1)}%</span>
    </div>
  );
};

// Digit Group Component (0-4 or 5-9)
const DigitGroup: React.FC<{ title: string; digits: number[]; percentages: number[] }> = ({
  title,
  digits,
  percentages,
}) => {
  const overUnderThreshold = 6.4;
  const overDigits = digits.filter((_, i) => percentages[i] > overUnderThreshold);
  const overPercentage = overDigits.reduce((sum, i) => sum + percentages[i], 0);
  const underDigits = digits.filter((_, i) => percentages[i] < overUnderThreshold);
  const underPercentage = underDigits.reduce((sum, i) => sum + percentages[i], 0);

  return (
    <div className="border-2 border-amber-600 rounded-lg p-6 bg-black bg-opacity-40">
      <h3 className="text-amber-400 text-lg font-bold mb-4 text-center">{title}</h3>
      <div className="flex justify-center gap-4 mb-6">
        {digits.map((digit) => (
          <DigitBox key={digit} digit={digit} percentage={percentages[digit]} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border-l-4 border-green-500 pl-3">
          <div className="text-green-400 text-xs uppercase font-bold mb-2">{"Over (Above 6.4%)"}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-green-400 font-bold">{overDigits.join(', ')}</span>
            <span className="text-green-400 text-xs">{overDigits.length} Digits</span>
          </div>
          <div className="text-green-400 font-bold text-2xl mt-1">{overPercentage.toFixed(1)}%</div>
        </div>

        <div className="border-2 border-amber-600 rounded p-3 flex flex-col items-center justify-center">
          <span className="text-amber-400 text-xs font-bold">THRESHOLD</span>
          <span className="text-amber-400 text-xl font-bold">{overUnderThreshold}%</span>
        </div>

        <div className="border-l-4 border-red-500 pl-3">
          <div className="text-red-400 text-xs uppercase font-bold mb-2">{"Under (Below 6.4%)"}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-red-400 font-bold">{underDigits.join(', ')}</span>
            <span className="text-red-400 text-xs">1 Digit</span>
          </div>
          <div className="text-red-400 font-bold text-2xl mt-1">{underPercentage.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};

// AI Engine Workflow Component
const AIEngineWorkflow: React.FC<{ data: DashboardData }> = ({ data }) => {
  const steps = [
    {
      number: 1,
      title: 'AI ENDPOINT',
      description: 'AI recommends Trade UNDER (0 - 4)',
      sublabel: 'ENTRY POINT',
      subvalue: data.entryPoint,
      status: 'Active',
    },
    {
      number: 2,
      title: 'CURSOR TOUCHING',
      description: 'Live cursor reaches the entry digit',
      sublabel: 'LIVE CURSOR',
      status: 'TOUCHED',
      statusColor: 'text-green-400',
    },
    {
      number: 3,
      title: 'CONFIRMATION DIGIT CHECK',
      description: 'Engine checks next tick for confirmation (0 - 4)',
      sublabel: 'NEXT TICK (CONFIRMATION)',
      status: 'VALID',
      statusColor: 'text-green-400',
    },
    {
      number: 4,
      title: 'EXECUTION POINT',
      description: 'All conditions met Execute trade...',
      status: 'EXECUTING',
      statusColor: 'text-green-400',
    },
    {
      number: 5,
      title: 'TRADE EXECUTED',
      description: 'UNDER trade placed successfully',
      status: '',
    },
  ];

  return (
    <div className="border-2 border-green-600 rounded-lg p-6 bg-black bg-opacity-40">
      <h3 className="text-green-400 text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-2xl">🧠</span>
        AI ENGINE UNDER (0 - 4)
      </h3>
      <p className="text-green-400 text-xs mb-4">AI ENDPOINT TO EXECUTION WORKFLOW</p>

      <div className="flex items-center justify-between gap-2 mb-6">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center bg-black mb-2 text-green-400 font-bold">
              {step.number}
            </div>
            <span className="text-green-400 text-xs font-bold text-center">{step.title}</span>
            {idx < steps.length - 1 && (
              <div className="text-green-400 text-xl mt-2">→</div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {steps.map((step) => (
          <div key={step.number} className="border-2 border-green-600 rounded p-2 text-center">
            <div className="text-green-400 text-xs font-bold mb-1">{step.title}</div>
            {step.sublabel && (
              <div className="text-green-400 text-xs mb-1">{step.sublabel}</div>
            )}
            {step.subvalue !== undefined && (
              <div className="text-green-400 font-bold text-lg">{step.subvalue}</div>
            )}
            {step.status && (
              <div className={`${step.statusColor || 'text-green-400'} text-xs font-bold mt-1`}>
                {step.status} ✓
              </div>
            )}
            {(step.statusColor === 'text-green-400' || step.number === 1) && (
              <div className="text-green-400 text-xs mt-1">84.4%</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Key Digits Component
const KeyDigits: React.FC<{ percentages: number[] }> = ({ percentages }) => {
  const sorted = percentages
    .map((p, i) => ({ digit: i, percentage: p }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="border-2 border-amber-600 rounded-lg p-4 bg-black bg-opacity-40">
      <h3 className="text-amber-400 text-sm font-bold mb-4 flex items-center gap-2">
        👑 KEY DIGITS
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
              {sorted[0].digit}
            </div>
            <span className="text-white text-xs">HIGHEST</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold">{sorted[0].percentage.toFixed(1)}%</span>
            <span className="text-amber-400 text-xs font-bold">TOP</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
              {sorted[1].digit}
            </div>
            <span className="text-white text-xs">2ND HIGHEST</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">{sorted[1].percentage.toFixed(1)}%</span>
            <span className="text-amber-400 text-xs font-bold">TOP</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm">
              {sorted[9].digit}
            </div>
            <span className="text-white text-xs">LOWEST</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold">{sorted[9].percentage.toFixed(1)}%</span>
            <span className="text-amber-400 text-xs font-bold">TOP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Signal Component
const SignalPanel: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className="border-2 border-green-600 rounded-lg p-4 bg-black bg-opacity-40">
      <h3 className="text-amber-400 text-sm font-bold mb-4 flex items-center gap-2">
        🧭 SIGNAL (TOP 3 DIGITS)
      </h3>
      <div className="flex justify-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center text-green-400 font-bold text-lg">
          4
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-400 font-bold text-lg">
          1
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center text-red-400 font-bold text-lg">
          2
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <span className="text-green-400 text-xs font-bold">TOP</span>
        <span className="text-amber-400 text-xs font-bold">TOP</span>
        <span className="text-red-400 text-xs font-bold">TOP</span>
      </div>
    </div>
  );
};

// Over/Under Summary
const OverUnderSummary: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className="border-2 border-green-600 rounded-lg p-4 bg-black bg-opacity-40">
      <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
        ⏱️ TOTAL % ON OVER AND UNDER
      </h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <div className="text-green-400 text-xs font-bold mb-1">UNDER (0 - 4)</div>
          <div className="text-green-400 font-bold text-lg">59.4%</div>
          <div className="text-green-400 text-xs">0 + 1 + 2 + 3 + 4</div>
        </div>
        <div>
          <div className="text-amber-400 text-xs font-bold mb-1">OVER (5 - 9)</div>
          <div className="text-amber-400 font-bold text-lg">40.6%</div>
          <div className="text-amber-400 text-xs">5 + 6 + 7 + 8 + 9</div>
        </div>
      </div>
      <div className="flex h-6 rounded overflow-hidden">
        <div className="flex-1 bg-green-500 flex items-center justify-center">
          <span className="text-black text-xs font-bold">UNDER 59.4%</span>
        </div>
        <div className="flex-1 bg-amber-500 flex items-center justify-center">
          <span className="text-black text-xs font-bold">OVER 40.6%</span>
        </div>
      </div>
    </div>
  );
};

// AI Endpoint Signal
const AIEndpointSignal: React.FC<{ data: DashboardData }> = ({ data }) => {
  return (
    <div className="border-2 border-green-600 rounded-lg p-4 bg-black bg-opacity-40">
      <h3 className="text-amber-400 text-sm font-bold mb-3 flex items-center gap-2">
        🚀 AI ENDPOINT (TRADE SIGNAL)
      </h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <div className="text-green-400 text-xs font-bold mb-1">UNDER SIDE (0 - 4)</div>
          <div className="text-green-400 font-bold text-lg">AI ENDPOINT: 4</div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-green-400 text-xs">STRONGEST</span>
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                4
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-400 text-xs">WEAKEST</span>
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-amber-400 text-xs font-bold mb-1">OVER SIDE (5 - 9)</div>
          <div className="text-amber-400 font-bold text-lg">AI ENDPOINT: 6</div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-green-400 text-xs">STRONGEST</span>
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                6
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-400 text-xs">WEAKEST</span>
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                8
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-black bg-opacity-50 rounded p-2">
        <div>
          <div className="text-green-400 text-xs font-bold">DIRECTION</div>
          <div className="text-green-400 font-bold text-lg">📉 UNDER</div>
        </div>
        <div className="text-center">
          <div className="text-amber-400 text-xs font-bold">AI CONFIDENCE</div>
          <div className="text-amber-400 font-bold text-xl">84.4%</div>
          <div className="text-amber-400">★★★★☆</div>
        </div>
        <div>
          <div className="text-green-400 text-xs font-bold">RECOMMENDATION</div>
          <div className="text-green-400 font-bold">TAKE TRADE</div>
          <div className="text-green-400 text-xs">ON UNDER ✓</div>
        </div>
      </div>
    </div>
  );
};

// Digit Strength Ranking Chart
const DigitStrengthRanking: React.FC<{ percentages: number[] }> = ({ percentages }) => {
  return (
    <div className="border-2 border-amber-600 rounded-lg p-6 bg-black bg-opacity-40">
      <h3 className="text-amber-400 text-lg font-bold mb-6 flex items-center gap-2">
        📊 DIGIT STRENGTH RANKING
      </h3>
      
      <div className="grid grid-cols-10 gap-2 mb-6">
        {percentages.map((pct, digit) => {
          const getBarColor = () => {
            if (pct > 6.4) return 'bg-green-500';
            if (pct < 6.4) return 'bg-red-500';
            return 'bg-amber-500';
          };

          return (
            <div key={digit} className="flex flex-col items-center">
              <div
                className={`w-8 ${getBarColor()} rounded`}
                style={{ height: `${(pct / 20) * 100}px` }}
              ></div>
              <span className="text-white font-bold text-sm mt-2">{digit}</span>
              <span className="text-white text-xs">{pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-green-400 text-xs font-bold">{"STRONG (>6.4%)"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded"></div>
          <span className="text-amber-400 text-xs font-bold">{"NEUTRAL (=6.4%)"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-red-400 text-xs font-bold">{"WEAK (<6.4%)"}</span>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer: React.FC = () => {
  const footerItems = [
    { icon: '⭕', label: 'FOCUS' },
    { icon: '🎯', label: 'PLAN' },
    { icon: '▶️', label: 'EXECUTE' },
    { icon: '🧠', label: 'PREDICT' },
    { icon: '📈', label: 'TRADE' },
    { icon: '💰', label: 'PROFIT' },
    { icon: '🛡️', label: 'DISCIPLINE' },
    { icon: '❤️', label: 'PATIENCE' },
    { icon: '👑', label: 'SUCCESS' },
  ];

  return (
    <div className="border-t border-amber-600 mt-6 pt-4">
      <div className="flex justify-center gap-8">
        {footerItems.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-2xl">{item.icon}</span>
            <span className="text-amber-400 text-xs font-bold">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
export const LastDigitDashboardV2: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    currentDigit: 1,
    price: 6924.61,
    tickCount: 32,
    digitPercentages: [9.4, 15.6, 3.1, 12.5, 18.8, 9.4, 15.6, 6.3, 3.1, 6.3],
    trendDirection: 'down',
    confidence: 84.4,
    overUnderThreshold: 6.4,
    entryPoint: 4,
    cursorCurrent: 1,
    cursorTarget: 4,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newDigit = Math.floor(Math.random() * 10);
        const priceChange = (Math.random() - 0.5) * 50;
        const newPercentages = prev.digitPercentages.map(
          (p) => Math.max(1, p + (Math.random() - 0.5) * 2)
        );
        newPercentages[newDigit] = newPercentages[newDigit] * 1.1;

        return {
          ...prev,
          currentDigit: newDigit,
          price: Math.max(100, prev.price + priceChange),
          tickCount: prev.tickCount + 1,
          digitPercentages: newPercentages.map((p) => Math.round(p * 10) / 10),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const digits0to4 = [0, 1, 2, 3, 4];
  const digits5to9 = [5, 6, 7, 8, 9];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-amber-500 text-black font-bold rounded">DIRECT</button>
          <button className="px-4 py-2 border border-white text-white font-bold rounded">PROXY</button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-400">👑 LAST DIGIT PREDICTION 👑</h1>
          <p className="text-amber-600 text-sm">REAL-TIME AI ANALYSIS</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-400 font-bold">LIVE</span>
        </div>
      </div>

      {/* Info Row */}
      <div className="flex justify-center gap-6 mb-6 text-xs font-bold">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>LIVE / CURRENT DIGIT</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>HIGHEST %</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span>2ND HIGHEST %</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>LOWEST %</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        {/* Left Sidebar */}
        <div className="col-span-2 space-y-4">
          {/* Volatility Index */}
          <div className="border-2 border-amber-600 rounded-lg p-4 bg-black bg-opacity-40">
            <div className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-2">
              📈 VOLATILITY INDEX
            </div>
            <div className="bg-black rounded p-2 border border-amber-600">
              <div className="text-white font-bold">Vol 75 (1s) Index</div>
              <div className="text-amber-400 text-xs mt-1">▼</div>
            </div>
          </div>

          {/* Live Price */}
          <div className="border-2 border-amber-600 rounded-lg p-4 bg-black bg-opacity-40">
            <div className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-2">
              📊 LIVE PRICE
            </div>
            <div className="text-white font-bold text-3xl">{data.price.toFixed(2)}</div>
            <div className="text-amber-600 text-xs">VOL 75 (1S) INDEX</div>
          </div>

          {/* Incoming Tick */}
          <div className="border-2 border-amber-600 rounded-lg p-4 bg-black bg-opacity-40">
            <div className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2">
              🔊 INCOMING TICK
            </div>
            <div className="flex justify-center mb-3">
              <div className="text-2xl">⭐⭐⭐⭐⭐</div>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-amber-500 mx-auto flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-amber-400 font-bold text-4xl">{data.currentDigit}</span>
            </div>
            <div className="text-white text-xs text-center mt-3 font-bold">
              TICKS: {data.tickCount}/1000
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all"
                style={{ width: `${(data.tickCount / 1000) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Cursor Tracker */}
          <div className="border-2 border-green-600 rounded-lg p-4 bg-black bg-opacity-40">
            <div className="text-green-400 font-bold text-sm mb-3">🎯 LIVE CURSOR TRACKER</div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <div className="text-green-400 text-xs font-bold">CURRENT</div>
                <div className="w-8 h-8 rounded-full border-2 border-blue-400 flex items-center justify-center mx-auto text-blue-400 font-bold">
                  {data.cursorCurrent}
                </div>
              </div>
              <div className="flex items-center justify-center text-green-400 font-bold">→</div>
              <div className="text-center">
                <div className="text-green-400 text-xs font-bold">TARGET</div>
                <div className="w-8 h-8 rounded-full border-2 border-green-400 flex items-center justify-center mx-auto text-green-400 font-bold">
                  {data.cursorTarget}
                </div>
              </div>
            </div>
            <div className="text-center text-green-400 font-bold text-sm mb-3">
              {data.cursorTarget - data.cursorCurrent} TICKS
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    i === 1 ? 'border-blue-400 text-blue-400' : 'border-gray-600 text-gray-400'
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center-Left: Digits 0-4 */}
        <div className="col-span-3">
          <DigitGroup title="DIGIT 0 TO 4" digits={digits0to4} percentages={data.digitPercentages} />
        </div>

        {/* Center-Right: Digits 5-9 */}
        <div className="col-span-3">
          <DigitGroup title="DIGIT 5 TO 9" digits={digits5to9} percentages={data.digitPercentages} />
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 space-y-4">
          <KeyDigits percentages={data.digitPercentages} />
          <SignalPanel data={data} />
          <OverUnderSummary data={data} />
          <AIEndpointSignal data={data} />
        </div>
      </div>

      {/* AI Engine Workflow */}
      <div className="mb-6">
        <AIEngineWorkflow data={data} />
      </div>

      {/* Digit Strength Ranking */}
      <div className="mb-6">
        <DigitStrengthRanking percentages={data.digitPercentages} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
