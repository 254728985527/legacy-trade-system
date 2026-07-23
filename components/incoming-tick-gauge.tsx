'use client';

interface IncomingTickGaugeProps {
  currentTick: number;
  totalTicks: number;
}

export function IncomingTickGauge({ currentTick, totalTicks }: IncomingTickGaugeProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-4 rounded-lg border-2" style={{
      borderColor: 'rgb(255, 215, 0)',
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.05)',
    }}>
      <div className="text-xs font-semibold tracking-wider flex items-center gap-2" style={{ color: 'rgb(255, 215, 0)' }}>
        <span>📡 INCOMING TICK</span>
      </div>
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ color: 'rgb(255, 215, 0)' }}>★</span>
        ))}
      </div>
      <div
        style={{
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          border: '3px solid rgb(255, 215, 0)',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 15px rgba(255, 215, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          fontWeight: 'bold',
          fontFamily: "'Courier New', monospace",
          color: 'rgb(255, 215, 0)',
        }}
      >
        {currentTick}
      </div>
      <div className="text-xs text-center" style={{ color: 'rgb(180, 180, 180)' }}>
        TICKS: {currentTick}/{totalTicks}
      </div>
    </div>
  );
}
