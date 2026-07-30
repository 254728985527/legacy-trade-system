const digitData = [
  { digit: 0, percentage: 9.4, strength: 'neutral' },
  { digit: 1, percentage: 15.6, strength: 'strong' },
  { digit: 2, percentage: 3.1, strength: 'weak' },
  { digit: 3, percentage: 12.5, strength: 'neutral' },
  { digit: 4, percentage: 18.8, strength: 'strong' },
  { digit: 5, percentage: 9.4, strength: 'neutral' },
  { digit: 6, percentage: 15.6, strength: 'strong' },
  { digit: 7, percentage: 6.3, strength: 'weak' },
  { digit: 8, percentage: 3.1, strength: 'weak' },
  { digit: 9, percentage: 6.3, strength: 'weak' },
];

function getBarColor(strength: string): string {
  switch (strength) {
    case 'strong':
      return 'bg-[rgb(34,197,94)]';
    case 'weak':
      return 'bg-[rgb(239,68,68)]';
    case 'neutral':
      return 'bg-[rgb(212,175,55)]';
    default:
      return 'bg-gray-600';
  }
}

export function DigitStrengthChart() {
  const maxPercentage = Math.max(...digitData.map((d) => d.percentage));

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
                  className={`w-full ${getBarColor(data.strength)} rounded-t transition hover:opacity-80`}
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
