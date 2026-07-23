'use client';

interface DigitStrengthChartProps {
  percentages: number[];
}

export function DigitStrengthChart({ percentages }: DigitStrengthChartProps) {
  const maxPct = Math.max(...percentages);
  const getColor = (pct: number) => {
    if (pct > 6.4) return 'rgb(0, 255, 0)'; // Strong (green)
    if (pct === 6.4) return 'rgb(255, 215, 0)'; // Neutral (gold)
    return 'rgb(255, 51, 51)'; // Weak (red)
  };

  const getLabel = (pct: number) => {
    if (pct > 6.4) return 'STRONG (>6.4%)';
    if (pct === 6.4) return 'NEUTRAL (=6.4%)';
    return 'WEAK (<6.4%)';
  };

  return (
    <div className="w-full px-4 py-4 rounded-lg border-2" style={{
      borderColor: 'rgb(255, 215, 0)',
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.05)',
    }}>
      <div className="text-xs font-semibold tracking-wider mb-4" style={{ color: 'rgb(255, 215, 0)' }}>
        📊 DIGIT STRENGTH RANKING
      </div>

      <div className="flex items-end gap-1 h-32 justify-center">
        {percentages.map((pct, idx) => {
          const color = getColor(pct);
          const barHeight = (pct / maxPct) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div style={{ fontSize: '10px', color: 'rgb(180, 180, 180)' }}>
                {pct.toFixed(1)}%
              </div>
              <div
                style={{
                  width: '100%',
                  height: `${barHeight}%`,
                  minHeight: '8px',
                  backgroundColor: color,
                  borderRadius: '2px 2px 0 0',
                  boxShadow: `0 0 10px ${color.replace('rgb', 'rgba').replace(')', ', 0.6)')}`,
                }}
              />
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgb(200, 200, 200)', fontFamily: "'Courier New', monospace" }}>
                {idx}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div style={{ width: '12px', height: '12px', backgroundColor: 'rgb(0, 255, 0)', borderRadius: '2px' }} />
          <span style={{ color: 'rgb(0, 255, 0)' }}>STRONG (&gt;6.4%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: '12px', height: '12px', backgroundColor: 'rgb(255, 215, 0)', borderRadius: '2px' }} />
          <span style={{ color: 'rgb(255, 215, 0)' }}>NEUTRAL (=6.4%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: '12px', height: '12px', backgroundColor: 'rgb(255, 51, 51)', borderRadius: '2px' }} />
          <span style={{ color: 'rgb(255, 51, 51)' }}>WEAK (&lt;6.4%)</span>
        </div>
      </div>
    </div>
  );
}
