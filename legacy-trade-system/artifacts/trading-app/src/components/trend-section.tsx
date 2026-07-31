import { useMemo } from 'react';

interface TrendSectionProps {
  prices: number[];
}

export function TrendSection({ prices }: TrendSectionProps) {
  const { risePct, fallPct, streak, streakDir } = useMemo(() => {
    const slice = prices.slice(-20);
    if (slice.length < 2) return { risePct: 50, fallPct: 50, streak: 0, streakDir: 'none' as const };

    let rises = 0;
    let streak = 0;
    let streakDir: 'rise' | 'fall' | 'none' = 'none';

    for (let i = 1; i < slice.length; i++) {
      if (slice[i] > slice[i - 1]) rises++;
    }

    // Current streak
    const last = slice[slice.length - 1];
    const prev = slice[slice.length - 2];
    streakDir = last >= prev ? 'rise' : 'fall';
    streak = 1;
    for (let i = slice.length - 2; i > 0; i--) {
      const goingUp = slice[i] >= slice[i - 1];
      if ((streakDir === 'rise' && goingUp) || (streakDir === 'fall' && !goingUp)) {
        streak++;
      } else {
        break;
      }
    }

    const total = slice.length - 1;
    return {
      risePct: Math.round((rises / total) * 100),
      fallPct: Math.round(((total - rises) / total) * 100),
      streak,
      streakDir,
    };
  }, [prices]);

  const isRising = streakDir === 'rise';

  return (
    <div
      className="flex items-center justify-center gap-8 px-3.5 py-2.5"
      style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-col)' }}
    >
      {/* Rise */}
      <div className="text-center">
        <div
          className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-xl mb-1 transition-all"
          style={{
            background: isRising ? 'var(--green)' : 'var(--bg-card)',
            border: `2px solid ${isRising ? 'var(--green)' : 'var(--border-col)'}`,
            boxShadow: isRising ? '0 0 14px var(--green-dim)' : 'none',
          }}
        >
          📈
        </div>
        <div
          className="text-xs font-bold"
          style={{ color: isRising ? 'var(--green)' : 'var(--text-secondary)' }}
        >
          {risePct}%
        </div>
        <div className="text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Rise</div>
      </div>

      {/* Streak indicator */}
      {streak > 1 && (
        <div className="text-center">
          <div
            className="text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              background: isRising ? 'var(--green-dim)' : 'var(--red-dim)',
              color: isRising ? 'var(--green)' : 'var(--red)',
            }}
          >
            {streak}× {isRising ? 'Up' : 'Down'}
          </div>
        </div>
      )}

      {/* Fall */}
      <div className="text-center">
        <div
          className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-xl mb-1 transition-all"
          style={{
            background: !isRising ? 'var(--red)' : 'var(--bg-card)',
            border: `2px solid ${!isRising ? 'var(--red)' : 'var(--border-col)'}`,
            boxShadow: !isRising ? '0 0 14px var(--red-dim)' : 'none',
          }}
        >
          📉
        </div>
        <div
          className="text-xs font-bold"
          style={{ color: !isRising ? 'var(--red)' : 'var(--text-secondary)' }}
        >
          {fallPct}%
        </div>
        <div className="text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Fall</div>
      </div>
    </div>
  );
}
