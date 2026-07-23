'use client';

interface CursorTrackerProps {
  current: number;
  target: number;
  remaining: number;
  nextDigits: number[];
}

export function CursorTracker({ current, target, remaining, nextDigits }: CursorTrackerProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 rounded-lg border-2" style={{
      borderColor: 'rgb(51, 51, 51)',
      boxShadow: '0 0 8px rgba(51, 51, 51, 0.3)',
    }}>
      <div className="text-xs font-semibold tracking-wider" style={{ color: 'rgb(255, 215, 0)' }}>
        🎯 LIVE CURSOR TRACKER
      </div>
      
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid rgb(0, 150, 255)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              fontFamily: "'Courier New', monospace",
              color: 'rgb(0, 150, 255)',
            }}
          >
            {current}
          </div>
          <div style={{ fontSize: '20px', color: 'rgb(200, 200, 200)' }}>→</div>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid rgb(0, 255, 0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              fontFamily: "'Courier New', monospace",
              color: 'rgb(0, 255, 0)',
            }}
          >
            {target}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs" style={{ color: 'rgb(180, 180, 180)' }}>REMAINING</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'rgb(200, 200, 200)', fontFamily: "'Courier New', monospace" }}>
            {remaining}
          </div>
        </div>
      </div>

      <div className="text-xs font-semibold" style={{ color: 'rgb(200, 200, 200)' }}>Next Positions:</div>
      <div className="flex gap-2 justify-center">
        {nextDigits.map((digit, idx) => (
          <div
            key={idx}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid rgb(51, 51, 51)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: "'Courier New', monospace",
              color: 'rgb(180, 180, 180)',
              backgroundColor: 'rgba(51, 51, 51, 0.2)',
            }}
          >
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
}
