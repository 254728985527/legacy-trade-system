import { useEffect } from 'react';

interface SignalOverlayProps {
  visible: boolean;
  digit?: number | null;
  onDismiss: () => void;
  signalType?: 'digit' | 'even-odd';
  evenOddSignal?: 'even' | 'odd' | null;
}

export function SignalOverlay({ visible, digit, onDismiss, signalType = 'digit', evenOddSignal }: SignalOverlayProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [visible, onDismiss]);

  if (!visible) return null;

  if (signalType === 'even-odd' && evenOddSignal) {
    const isEven = evenOddSignal === 'even';
    const col = isEven ? 'var(--green)' : 'var(--red)';
    const dimCol = isEven ? 'var(--green-dim)' : 'var(--red-dim)';
    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-50 animate-fade-in"
        style={{ background: 'rgba(7,11,20,0.92)', backdropFilter: 'blur(6px)' }}
      >
        <div
          className="px-8 py-5 rounded-2xl flex flex-col items-center gap-2 animate-signal-pop"
          style={{ background: dimCol, border: `2px solid ${col}`, boxShadow: `0 0 40px ${col}44` }}
        >
          <div className="text-3xl font-black" style={{ color: col }}>
            {isEven ? '⚡ EVEN' : '⚡ ODD'}
          </div>
          <div className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: col }}>
            3× {isEven ? 'Bullish' : 'Bearish'} Candles
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Pattern suggests: Trade <strong style={{ color: col }}>{isEven ? 'Even' : 'Odd'}</strong>
          </div>
        </div>
        <button
          className="mt-3 text-xs px-4 py-1.5 rounded"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-col)', color: 'var(--text-secondary)' }}
          onClick={onDismiss}
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-50 animate-fade-in"
      style={{ background: 'rgba(7,11,20,0.93)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-3 animate-signal-pop"
        style={{
          background: 'var(--green-dim)',
          border: '2px solid var(--green)',
          boxShadow: '0 0 40px var(--green-dim)',
        }}
      >
        {digit !== null && digit !== undefined ? digit : '🎯'}
      </div>
      <div className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--green)' }}>
        STRONG SIGNAL
      </div>
      {digit !== null && digit !== undefined && (
        <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          Digit {digit} is statistically overdue
        </div>
      )}
      <button
        className="text-xs px-4 py-1.5 rounded"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-col)', color: 'var(--text-secondary)' }}
        onClick={onDismiss}
      >
        Dismiss
      </button>
    </div>
  );
}
