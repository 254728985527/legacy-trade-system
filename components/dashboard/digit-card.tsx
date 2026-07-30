interface DigitCardProps {
  title: string;
  digits: Array<{
    number: number;
    percentage: number;
    isHighlight?: boolean;
    isCurrent?: boolean;
  }>;
  overPercentage: number;
  underPercentage: number;
  threshold: number;
  overDigitCount: number;
  underDigitCount: number;
}

export function DigitCard({
  title,
  digits,
  overPercentage,
  underPercentage,
  threshold,
  overDigitCount,
  underDigitCount,
}: DigitCardProps) {
  return (
    <div className="p-6 border border-[rgb(212,175,55)] border-opacity-40 rounded-lg bg-[rgb(15,20,45)]">
      <div className="text-[rgb(212,175,55)] text-lg font-bold tracking-wider mb-6 text-center">{title}</div>

      {/* Digit Circles */}
      <div className="flex justify-center gap-4 mb-8">
        {digits.map((digit) => (
          <div key={digit.number} className="flex flex-col items-center gap-2">
            <div
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-2xl transition ${
                digit.isHighlight
                  ? 'border-[rgb(34,197,94)] text-[rgb(34,197,94)] bg-[rgb(34,197,94)] bg-opacity-10'
                  : digit.isCurrent
                    ? 'border-blue-500 text-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-gray-500 text-gray-400'
              }`}
            >
              {digit.number}
            </div>
            <span className="text-sm font-semibold text-gray-300">{digit.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {/* Stats Bars */}
      <div className="flex gap-4 mb-6">
        {/* Over/Above Bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[rgb(34,197,94)] tracking-wider">OVER (Above {threshold}%)</span>
            <span className="text-xs text-gray-400">0 • 1 • 3 • 4</span>
          </div>
          <div className="h-8 bg-gray-700 rounded flex items-center">
            <div
              className="h-full bg-[rgb(34,197,94)] rounded flex items-center justify-center font-bold text-sm text-white"
              style={{ width: '56.3%' }}
            >
              56.3%
            </div>
          </div>
          <span className="text-xs text-gray-400 mt-1 block">{overDigitCount} Digits</span>
        </div>

        {/* Threshold Circle */}
        <div className="flex flex-col items-center justify-center min-w-32">
          <div className="w-20 h-20 rounded-full border-4 border-[rgb(212,175,55)] border-opacity-60 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-[rgb(212,175,55)]">{threshold}%</span>
            <span className="text-xs text-gray-400">THRESHOLD</span>
          </div>
          <span className="text-xs text-gray-400 mt-2">32 ÷ 5</span>
        </div>

        {/* Under/Below Bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[rgb(239,68,68)] tracking-wider">UNDER (Below {threshold}%)</span>
            <span className="text-xs text-gray-400">2 • 5 • 8 • 9</span>
          </div>
          <div className="h-8 bg-gray-700 rounded flex items-center justify-end">
            <div
              className="h-full bg-[rgb(239,68,68)] rounded flex items-center justify-center font-bold text-sm text-white"
              style={{ width: '15.7%' }}
            >
              15.7%
            </div>
          </div>
          <span className="text-xs text-gray-400 mt-1 block">{underDigitCount} Digit</span>
        </div>
      </div>
    </div>
  );
}
