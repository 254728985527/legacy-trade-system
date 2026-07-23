'use client';

interface VolatilityGaugeProps {
  volatility: number;
  label: string;
}

export function VolatilityGauge({ volatility, label }: VolatilityGaugeProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-4 rounded-lg border-2 border-yellow-500/60" style={{
      borderColor: 'rgb(255, 215, 0)',
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.05)',
    }}>
      <div className="text-xs font-semibold tracking-wider" style={{ color: 'rgb(255, 215, 0)' }}>
        📶 {label}
      </div>
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '3px solid rgb(255, 215, 0)',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 15px rgba(255, 215, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          fontWeight: 'bold',
          fontFamily: "'Courier New', monospace",
          color: 'rgb(255, 215, 0)',
        }}
      >
        {volatility}
      </div>
      <div className="text-xs text-center" style={{ color: 'rgb(180, 180, 180)' }}>
        Vol 75 (1s) Index
      </div>
    </div>
  );
}
