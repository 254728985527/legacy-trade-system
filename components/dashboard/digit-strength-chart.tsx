import type { DigitStats } from '@/lib/types';

interface DigitStrengthChartProps {
  digitStats: DigitStats;
}

function getBarColor(percentage: number): string {
  if (percentage > 6.4) return 'bg-[rgb(34,197,94)]'; // Strong - Green
  if (Math.abs(percentage - 6.4) < 0.01) return 'bg-[rgb(212,175,55)]'; // Neutral - Gold
  return 'bg-[rgb(239,68,68)]'; // Weak - Red
}

export function DigitStrengthChart({ digitStats }: DigitStrengthChartProps) {
  const digitData = Array.from({ length: 10 }, (_, i) => ({
    digit: i,
    percentage: Math.round((digitStats.percentages[i] ?? 0) * 10) / 10,
  }));

  const maxPercentage = Math.max(...digitData.map((d) => d.percentage), 1);

  return (
    <div className="p-6 border border-[rgb(212,175,55)] border-opacity-40 rounded-lg bg-[rgb(15,20,45)]">
      <div className="text-[rgb(212,175,55)] text-lg font-bold tracking-wider mb-8 text-center">
        DIGIT STRENGTH RANKING
      </div>

      {/* Chart Bars */}
      <div className="flex items-end justify-between gap-3 h-64 mb-8 px-4">
        {digitData.map((data) => {
          const heightPercent = (data.percentage / maxPercentage) * 100;
          return (
            <div key={data.digit} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-full">
                <div
                  className={`w-full ${getBarColor(data.percentage)} rounded-t transition hover:opacity-80`}
                  style={{ height: `${heightPercent}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-300">{data.digit}</span>
              <span className="text-xs text-gray-400">{data.percentage.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 pt-6 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[rgb(34,197,94)]"></div>
          <span className="text-xs text-gray-400 font-bold">{`STRONG (>6.4%)`}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[rgb(212,175,55)]"></div>
          <span className="text-xs text-gray-400 font-bold">{`NEUTRAL (=6.4%)`}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[rgb(239,68,68)]"></div>
          <span className="text-xs text-gray-400 font-bold">{`WEAK (<6.4%)`}</span>
        </div>
      </div>
    </div>
  );
}
