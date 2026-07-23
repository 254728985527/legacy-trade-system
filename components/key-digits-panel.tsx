'use client';

interface KeyDigit {
  digit: number;
  percentage: number;
  rank: 'HIGHEST' | '2ND HIGHEST' | 'LOWEST';
}

interface KeyDigitsPanelProps {
  digits: KeyDigit[];
}

export function KeyDigitsPanel({ digits }: KeyDigitsPanelProps) {
  const getRankLabel = (rank: string) => {
    switch (rank) {
      case 'HIGHEST':
        return '🏆 HIGHEST';
      case '2ND HIGHEST':
        return '🥈 2ND HIGHEST';
      case 'LOWEST':
        return '🔴 LOWEST';
      default:
        return rank;
    }
  };

  const getDigitColor = (rank: string) => {
    switch (rank) {
      case 'HIGHEST':
        return 'rgb(0, 255, 0)';
      case '2ND HIGHEST':
        return 'rgb(255, 215, 0)';
      case 'LOWEST':
        return 'rgb(255, 51, 51)';
      default:
        return 'rgb(200, 200, 200)';
    }
  };

  const getRankBg = (rank: string) => {
    switch (rank) {
      case 'HIGHEST':
        return 'rgba(0, 255, 0, 0.1)';
      case '2ND HIGHEST':
        return 'rgba(255, 215, 0, 0.1)';
      case 'LOWEST':
        return 'rgba(255, 51, 51, 0.1)';
      default:
        return 'rgba(51, 51, 51, 0.1)';
    }
  };

  return (
    <div className="flex flex-col gap-3 px-4 py-4 rounded-lg border-2" style={{
      borderColor: 'rgb(0, 255, 0)',
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.05)',
    }}>
      <div className="text-xs font-semibold tracking-wider" style={{ color: 'rgb(0, 255, 0)' }}>
        🏅 KEY DIGITS
      </div>

      <div className="space-y-2">
        {digits.map((item, idx) => {
          const color = getDigitColor(item.rank);
          const bg = getRankBg(item.rank);
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded"
              style={{
                backgroundColor: bg,
                border: `1px solid ${color}`,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `2px solid ${color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontFamily: "'Courier New', monospace",
                    color: color,
                  }}
                >
                  {item.digit}
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgb(180, 180, 180)' }}>
                    {getRankLabel(item.rank)}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: color, fontFamily: "'Courier New', monospace" }}>
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'rgb(255, 215, 0)' }}>
                TOP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
