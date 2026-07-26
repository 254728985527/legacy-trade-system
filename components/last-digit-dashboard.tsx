'use client';

import { useState, useEffect, useCallback } from 'react';

interface State {
  ticks: number;
  price: number;
  current: number;
  ctTarget: number;
  pcts: number[];
  marks: { highest: number; second: number; lowest: number };
  direction: 'UNDER' | 'OVER';
  confidence: number;
  confirmDigits: number[];
  underTotal: number;
  overTotal: number;
  underTarget: number;
  overTarget: number;
  avg: number;
  threshold: number;
  numerator: number;
  isExecuting: boolean;
  executedDirection: string;
}

export function LastDigitDashboard() {
  const [mode, setMode] = useState<'DIRECT' | 'PROXY'>('DIRECT');
  const [state, setState] = useState<State>({
    ticks: 0,
    price: 6924.61,
    current: 1,
    ctTarget: 4,
    pcts: Array(10).fill(10),
    marks: { highest: 0, second: 1, lowest: 9 },
    direction: 'UNDER',
    confidence: 75,
    confirmDigits: [5, 6],
    underTotal: 50,
    overTotal: 50,
    underTarget: 2,
    overTarget: 7,
    avg: 10,
    threshold: 10,
    numerator: 50,
    isExecuting: false,
    executedDirection: '',
  });

  const randomWeights = useCallback(() => {
    let raw = Array.from({ length: 10 }, () => Math.random() + 0.3);
    const sum = raw.reduce((a, b) => a + b, 0);
    let pct = raw.map((v) => (v / sum) * 100);
    return pct.map((v) => Math.round(v * 10) / 10);
  }, []);

  const classify = useCallback((pcts: number[]) => {
    const withIdx = pcts.map((p, i) => ({ p, i }));
    const sorted = [...withIdx].sort((a, b) => b.p - a.p);
    return {
      highest: sorted[0].i,
      second: sorted[1].i,
      lowest: sorted[sorted.length - 1].i,
    };
  }, []);

  const renderTick = useCallback(() => {
    setState((prev) => {
      const newTicks = (prev.ticks + 1) % 1001;
      const newCurrent = Math.floor(Math.random() * 10);
      const newPrice = prev.price + (Math.random() - 0.5) * 4;

      // Re-render weights every 3 ticks
      let newPcts = prev.pcts;
      let newMarks = prev.marks;
      let newAvg = prev.avg;
      let newUnderTotal = prev.underTotal;
      let newOverTotal = prev.overTotal;
      let newDirection = prev.direction;
      let newConfidence = prev.confidence;
      let newConfirmDigits = prev.confirmDigits;
      let newUnderTarget = prev.underTarget;
      let newOverTarget = prev.overTarget;
      let newThreshold = prev.threshold;
      let newNumerator = prev.numerator;

      if (newTicks % 3 === 0) {
        newPcts = randomWeights();
        newMarks = classify(newPcts);
        newAvg = newPcts.reduce((a, b) => a + b, 0) / 10;
        newUnderTotal = [0, 1, 2, 3, 4].reduce((s, i) => s + newPcts[i], 0);
        newOverTotal = [5, 6, 7, 8, 9].reduce((s, i) => s + newPcts[i], 0);

        newNumerator = Math.round(20 + Math.random() * 20);
        newThreshold = newNumerator / 5;

        newUnderTarget =
          newMarks.highest <= 4
            ? newMarks.highest
            : [0, 1, 2, 3, 4].reduce((a, b) =>
                newPcts[a] > newPcts[b] ? a : b
              );
        newOverTarget =
          newMarks.highest >= 5
            ? newMarks.highest
            : [5, 6, 7, 8, 9].reduce((a, b) =>
                newPcts[a] > newPcts[b] ? a : b
              );

        newDirection = newMarks.highest <= 3 ? 'UNDER' : 'OVER';
        newConfidence = 60 + Math.random() * 35;

        if (newDirection === 'OVER') {
          newConfirmDigits = [3, 4];
        } else {
          newConfirmDigits = [5, 6];
        }
      }

      // Check for execution
      let isExecuting = false;
      let executedDirection = '';
      if (
        newConfirmDigits &&
        newConfirmDigits.includes(newCurrent) &&
        !prev.isExecuting
      ) {
        isExecuting = true;
        executedDirection = newDirection;
      }

      return {
        ...prev,
        ticks: newTicks,
        price: newPrice,
        current: newCurrent,
        pcts: newPcts,
        marks: newMarks,
        direction: newDirection,
        confidence: newConfidence,
        confirmDigits: newConfirmDigits,
        underTotal: newUnderTotal,
        overTotal: newOverTotal,
        underTarget: newUnderTarget,
        overTarget: newOverTarget,
        avg: newAvg,
        threshold: newThreshold,
        numerator: newNumerator,
        isExecuting,
        executedDirection,
      };
    });
  }, [randomWeights, classify]);

  useEffect(() => {
    // Initial render
    const pcts = randomWeights();
    const marks = classify(pcts);
    const avg = pcts.reduce((a, b) => a + b, 0) / 10;
    const underTotal = [0, 1, 2, 3, 4].reduce((s, i) => s + pcts[i], 0);
    const overTotal = [5, 6, 7, 8, 9].reduce((s, i) => s + pcts[i], 0);

    setState((prev) => ({
      ...prev,
      pcts,
      marks,
      avg,
      underTotal,
      overTotal,
    }));
  }, [randomWeights, classify]);

  useEffect(() => {
    const interval = setInterval(() => {
      renderTick();
    }, 1000);

    return () => clearInterval(interval);
  }, [renderTick]);

  const priceStr = state.price.toFixed(2);
  const [priceInt, priceDec] = priceStr.split('.');

  const renderDigitRow = (digits: number[]) => {
    return digits.map((i) => {
      let cls = 'default';
      if (i === state.current) cls = 'live';
      else if (i === state.marks.highest) cls = 'highest';
      else if (i === state.marks.second) cls = 'second';
      else if (i === state.marks.lowest) cls = 'lowest';

      return (
        <div key={i} className="digit-cell">
          <div className={`digit-circle ${cls}`}>{i}</div>
          <div className={`digit-pct ${cls}`}>{state.pcts[i].toFixed(1)}%</div>
        </div>
      );
    });
  };

  const underDigits = [0, 1, 2, 3, 4].filter(
    (i) => state.pcts[i] > state.threshold
  );
  const underDigitsDual = [0, 1, 2, 3, 4].filter(
    (i) => state.pcts[i] <= state.threshold
  );
  const overDigits = [5, 6, 7, 8, 9].filter((i) => state.pcts[i] > state.threshold);
  const overDigitsDual = [5, 6, 7, 8, 9].filter(
    (i) => state.pcts[i] <= state.threshold
  );
  const overTotalDual = overDigits.reduce((s, i) => s + state.pcts[i], 0);
  const underTotalDual = underDigitsDual.reduce((s, i) => s + state.pcts[i], 0);

  const entryRangeArr =
    state.direction === 'OVER' ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
  const confirmRangeArr =
    state.direction === 'OVER' ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9];
  const confirmLabel =
    state.direction === 'OVER' ? 'DIGIT 0 TO 4' : 'DIGIT 5 TO 9';
  const entryTarget =
    state.direction === 'OVER' ? state.overTarget : state.underTarget;
  const arrow = state.direction === 'UNDER' ? '⬇' : '⬆';

  return (
    <div className="last-digit-dashboard">
      <style>{`
        :root {
          --bg: #000000;
          --panel: #0a0a0a;
          --panel-2: #0d0d0d;
          --gold: #D4AF37;
          --gold-bright: #F4CB4B;
          --gold-dim: rgba(212,175,55,.35);
          --green: #22c55e;
          --green-dim: rgba(34,197,94,.15);
          --red: #ef4444;
          --red-dim: rgba(239,68,68,.15);
          --amber: #eab308;
          --amber-dim: rgba(234,179,8,.15);
          --blue: #3b82f6;
          --blue-dim: rgba(59,130,246,.15);
          --text: #eaeaea;
          --muted: #8b8b8b;
        }

        .last-digit-dashboard {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          padding: 16px;
          background-image: radial-gradient(circle at 50% 0%, rgba(212,175,55,.06), transparent 45%);
        }

        .last-digit-dashboard * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .wrap { max-width: 1520px; margin: 0 auto; }

        .panel {
          background: var(--panel);
          border: 1px solid var(--gold-dim);
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,.6), inset 0 0 30px rgba(212,175,55,.02);
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 12.5px;
          letter-spacing: 1.2px;
          color: var(--gold-bright);
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 16px;
        }

        .toggle-row {
          display: flex;
          gap: 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--gold-dim);
        }

        .toggle-row button {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: .5px;
          padding: 9px 16px;
          border: none;
          cursor: pointer;
          color: var(--text);
          background: #111;
        }

        .toggle-row button.active {
          background: var(--gold-bright);
          color: #000;
        }

        .title-block {
          text-align: center;
          flex: 1;
        }

        .title-block h1 {
          font-family: 'Cinzel', serif;
          font-weight: 800;
          font-size: 38px;
          letter-spacing: 2px;
          background: linear-gradient(180deg,#FFE9A8,#D4AF37 55%,#8a6a1c);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }

        .title-block .sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 5px;
          color: var(--gold);
          margin-top: 2px;
        }

        .legend {
          display: flex;
          gap: 18px;
          justify-content: center;
          margin-top: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--muted);
        }

        .legend span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend i {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          display: inline-block;
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border: 1px solid var(--green);
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 13px;
          color: var(--green);
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--green);
          animation: pulse 1.4s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--green); }
          50% { opacity: 0.35; }
        }

        .dashboard {
          display: grid;
          grid-template-columns: 290px 1fr 330px;
          gap: 16px;
          align-items: start;
        }

        @media (max-width: 1200px) {
          .dashboard { grid-template-columns: 1fr; }
        }

        .col { display: flex; flex-direction: column; gap: 16px; }

        select.vol-select {
          width: 100%;
          background: #111;
          border: 1px solid var(--gold-dim);
          color: var(--text);
          padding: 10px;
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
        }

        .price-val {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 34px;
          color: #fff;
        }

        .price-val .dec {
          color: var(--gold-bright);
        }

        .price-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          margin-top: 4px;
        }

        .tick-ring-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stars {
          color: var(--gold);
          font-size: 13px;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }

        .tick-ring {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 5px solid var(--gold-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 0 24px rgba(212,175,55,.15) inset;
        }

        .tick-ring .ring-progress {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 5px solid transparent;
          border-top-color: var(--gold-bright);
          border-right-color: var(--gold-bright);
          transform: rotate(45deg);
        }

        .tick-ring .digit {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 56px;
          color: #fff;
        }

        .ticks-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          margin-top: 12px;
          letter-spacing: 1px;
        }

        .ticks-bar {
          width: 100%;
          height: 6px;
          background: #1a1a1a;
          border-radius: 4px;
          margin-top: 8px;
          overflow: hidden;
        }

        .ticks-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #8a6a1c, var(--gold-bright));
          border-radius: 4px;
          transition: width 0.1s;
        }

        .digit-row {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 10px;
        }

        .digit-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex: 1;
        }

        .digit-circle {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 22px;
          border: 2.5px solid #333;
          color: #fff;
          background: #0d0d0d;
        }

        .digit-circle.live {
          border-color: var(--blue);
          color: var(--blue);
          box-shadow: 0 0 12px rgba(59,130,246,.4);
        }

        .digit-circle.highest {
          border-color: var(--green);
          color: var(--green);
          box-shadow: 0 0 12px rgba(34,197,94,.35);
        }

        .digit-circle.second {
          border-color: var(--amber);
          color: var(--amber);
          box-shadow: 0 0 12px rgba(234,179,8,.3);
        }

        .digit-circle.lowest {
          border-color: var(--red);
          color: var(--red);
          box-shadow: 0 0 12px rgba(239,68,68,.3);
        }

        .digit-pct {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px;
          font-weight: 700;
          color: var(--muted);
          padding: 3px 9px;
          border-radius: 6px;
          border: 1.5px solid #2c2c2c;
          background: #0d0d0d;
        }

        .digit-pct.live {
          border-color: var(--blue);
          color: var(--blue);
        }

        .digit-pct.highest {
          border-color: var(--green);
          color: var(--green);
        }

        .digit-pct.second {
          border-color: var(--amber);
          color: var(--amber);
        }

        .digit-pct.lowest {
          border-color: var(--red);
          color: var(--red);
        }

        .range-card-wrap {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .range-card {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 300px;
        }

        .range-title {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 14px;
          color: var(--gold-bright);
          letter-spacing: 1.5px;
          margin-bottom: 14px;
          text-align: center;
        }

        .ou-dual {
          position: relative;
          display: flex;
          margin-top: 16px;
        }

        .ou-dual .side {
          flex: 1;
          padding: 16px 10px 14px;
          text-align: center;
          position: relative;
        }

        .ou-dual .side.over {
          background: linear-gradient(180deg, rgba(34,197,94,.14), rgba(34,197,94,.03));
          border: 1.5px solid rgba(34,197,94,.55);
          border-radius: 12px 4px 4px 12px;
        }

        .ou-dual .side.under {
          background: linear-gradient(180deg, rgba(239,68,68,.14), rgba(239,68,68,.03));
          border: 1.5px solid rgba(239,68,68,.55);
          border-left: none;
          border-radius: 4px 12px 12px 4px;
        }

        .ou-dual .side .h {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 10.5px;
          letter-spacing: .2px;
        }

        .ou-dual .side.over .h { color: var(--green); }
        .ou-dual .side.under .h { color: var(--red); }

        .ou-dual .side .digits {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          color: var(--text);
          margin: 12px 0 3px;
        }

        .ou-dual .side .count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          margin-bottom: 6px;
        }

        .ou-dual .side .pct {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 23px;
        }

        .ou-dual .side.over .pct { color: var(--green); }
        .ou-dual .side.under .pct { color: var(--red); }

        .ou-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 92px;
          height: 92px;
          border-radius: 50%;
          background: #050505;
          border: 3px solid var(--gold-bright);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 3;
          box-shadow: 0 0 18px rgba(212,175,55,.35), inset 0 0 12px rgba(212,175,55,.15);
        }

        .ou-center .pct {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 18px;
          color: #fff;
        }

        .ou-center .lbl {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7.5px;
          color: var(--gold-bright);
          letter-spacing: .5px;
          margin-top: 2px;
        }

        .ou-center .frac {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: var(--muted);
          margin-top: 3px;
        }

        .ai-title {
          text-align: center;
          margin-bottom: 16px;
        }

        .ai-title h2 {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 17px;
          color: var(--green);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .ai-title .s {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          color: var(--muted);
          letter-spacing: 2px;
          margin-top: 2px;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
          align-items: stretch;
        }

        @media (max-width: 980px) {
          .steps { grid-template-columns: 1fr 1fr; }
        }

        .step {
          background: var(--panel-2);
          border: 1px solid var(--gold-dim);
          border-radius: 10px;
          padding: 12px;
          position: relative;
        }

        .step .num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--gold-bright);
          color: #000;
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
        }

        .step .t {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 10.5px;
          color: var(--gold-bright);
          text-transform: uppercase;
          letter-spacing: .3px;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .step .desc {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          color: var(--muted);
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .step .box {
          background: #111;
          border: 1px solid #262626;
          border-radius: 7px;
          padding: 8px;
          text-align: center;
          margin-bottom: 8px;
        }

        .step .box .big {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 22px;
          color: #fff;
        }

        .step .box .mini-digits {
          display: flex;
          justify-content: center;
          gap: 3px;
          margin-top: 4px;
        }

        .mini-d {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1.5px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: var(--muted);
        }

        .mini-d.hit {
          border-color: var(--green);
          color: var(--green);
        }

        .step .status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: var(--muted);
          text-transform: uppercase;
        }

        .step .status .v {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 13px;
          color: var(--green);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .step .rocket {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid var(--green);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 8px auto;
          font-size: 16px;
        }

        .rank-bars {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          height: 120px;
          margin-top: 8px;
        }

        .rank-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 100%;
        }

        .rank-col .val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .rank-bar {
          width: 70%;
          border-radius: 4px 4px 0 0;
          transition: height 0.4s;
        }

        .rank-col .d {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--muted);
          margin-top: 6px;
        }

        .rank-legend {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          color: var(--muted);
        }

        .rank-legend span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .rank-legend i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .kd-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #1a1a1a;
        }

        .kd-row:last-child { border-bottom: none; }

        .kd-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 13px;
          flex-shrink: 0;
        }

        .kd-info { flex: 1; }

        .kd-info .l {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          color: var(--muted);
          letter-spacing: .5px;
        }

        .kd-info .p {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 14px;
        }

        .kd-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 800;
          color: var(--gold-bright);
          border: 1px solid var(--gold-dim);
          padding: 3px 7px;
          border-radius: 5px;
        }

        .signal-row {
          display: flex;
          justify-content: space-around;
          margin-bottom: 12px;
        }

        .signal-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .signal-item .lbl {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          color: var(--muted);
          letter-spacing: 1px;
        }

        .signal-direction {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 10.5px;
          letter-spacing: .5px;
          text-align: center;
          padding: 10px;
          border-top: 1px solid #1a1a1a;
        }

        .signal-direction.und { color: var(--green); }
        .signal-direction.ovr { color: var(--amber); }

        .tou-box {
          padding: 12px;
          border-radius: 10px;
          text-align: center;
          flex: 1;
          transition: box-shadow 0.2s;
        }

        .tou-box.und {
          background: var(--green-dim);
          border: 1px solid rgba(34,197,94,.4);
        }

        .tou-box.ovr {
          background: var(--amber-dim);
          border: 1px solid rgba(234,179,8,.4);
        }

        .tou-box.confirmed {
          box-shadow: 0 0 0 2px var(--gold-bright), 0 0 16px rgba(212,175,55,.45);
        }

        .tou-box .l {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .5px;
        }

        .tou-box.und .l { color: var(--green); }
        .tou-box.ovr .l { color: var(--amber); }

        .tou-box .sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          color: var(--muted);
          margin: 2px 0;
        }

        .tou-box .p {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 22px;
        }

        .tou-box.und .p { color: var(--green); }
        .tou-box.ovr .p { color: var(--amber); }

        .tou-bar {
          display: flex;
          height: 22px;
          border-radius: 6px;
          overflow: hidden;
          margin-top: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 800;
        }

        .tou-bar .u {
          background: var(--green);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tou-bar .o {
          background: var(--amber);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .endpoint-cols {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ep-col {
          flex: 1;
          background: var(--panel-2);
          border-radius: 10px;
          padding: 10px;
          text-align: center;
        }

        .ep-col .h {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: .5px;
          margin-bottom: 6px;
        }

        .ep-col.und .h { color: var(--green); }
        .ep-col.ovr .h { color: var(--amber); }

        .ep-col .endpoint {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: var(--muted);
          margin-bottom: 6px;
        }

        .ep-col .endpoint b {
          font-family: 'JetBrains Mono', monospace;
          font-size: 18px;
          color: #fff;
        }

        .ep-mini {
          display: flex;
          gap: 6px;
          justify-content: center;
        }

        .ep-mini div {
          flex: 1;
          border-radius: 6px;
          padding: 6px 4px;
          font-family: 'JetBrains Mono', monospace;
        }

        .ep-mini .strong {
          background: var(--green-dim);
          color: var(--green);
        }

        .ep-mini .weak {
          background: var(--red-dim);
          color: var(--red);
        }

        .ep-mini .lbl { font-size: 8px; display: block; }
        .ep-mini .v { font-size: 12px; font-weight: 800; display: block; }

        .vs-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #111;
          border: 2px solid var(--gold-bright);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cinzel', serif;
          font-weight: 800;
          font-size: 12px;
          color: var(--gold-bright);
          flex-shrink: 0;
        }

        .dcr-row {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .dcr-item {
          flex: 1;
          background: var(--panel-2);
          border-radius: 10px;
          padding: 10px;
          text-align: center;
        }

        .dcr-item .l {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: var(--muted);
          letter-spacing: .5px;
          margin-bottom: 6px;
        }

        .dcr-item .v {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 15px;
        }

        .dcr-item.dir .v { color: var(--green); }
        .dcr-item.conf .v { color: var(--gold-bright); }
        .dcr-item.rec .v { color: var(--green); font-size: 11px; }

        .dcr-item .stars {
          font-size: 11px;
          margin-top: 4px;
          color: var(--gold-bright);
        }

        nav.bottom {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
          padding: 14px 6px 6px;
          border-top: 1px solid var(--gold-dim);
        }

        nav.bottom .item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: .5px;
          color: var(--muted);
          text-transform: uppercase;
        }

        .disclaimer {
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          margin-top: 10px;
          line-height: 1.6;
        }

        .ou-row {
          display: flex;
          gap: 16px;
          margin-top: 16px;
        }

        .ticks-bar {
          width: 100%;
          height: 6px;
          background: #1a1a1a;
          border-radius: 4px;
          margin-top: 8px;
          overflow: hidden;
        }

        .cursor-tracker {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ct-row {
          display: flex;
          justify-content: space-between;
          text-align: center;
          gap: 8px;
        }

        .ct-item {
          flex: 1;
        }

        .ct-item .lbl {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 1px;
        }

        .ct-item .val {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 22px;
          margin-top: 4px;
        }
      `}</style>

      <div className="wrap">
        <header>
          <div className="toggle-row">
            <button
              className={mode === 'DIRECT' ? 'active' : ''}
              onClick={() => setMode('DIRECT')}
            >
              DIRECT
            </button>
            <button
              className={mode === 'PROXY' ? 'active' : ''}
              onClick={() => setMode('PROXY')}
            >
              PROXY
            </button>
          </div>
          <div className="title-block">
            <h1>♛ LAST DIGIT PREDICTION ♛</h1>
            <div className="sub">REAL-TIME AI ANALYSIS</div>
            <div className="legend">
              <span>
                <i style={{ background: 'var(--blue)' }}></i>LIVE / CURRENT DIGIT
              </span>
              <span>
                <i style={{ background: 'var(--green)' }}></i>HIGHEST %
              </span>
              <span>
                <i style={{ background: 'var(--amber)' }}></i>2ND HIGHEST %
              </span>
              <span>
                <i style={{ background: 'var(--red)' }}></i>LOWEST %
              </span>
            </div>
          </div>
          <div className="live-badge">
            <span className="live-dot"></span>
            LIVE
          </div>
        </header>

        <div className="dashboard">
          {/* LEFT COLUMN */}
          <div className="col">
            <div className="panel">
              <div className="panel-title">〰 VOLATILITY INDEX</div>
              <select className="vol-select">
                <option>Vol 75 (1s) Index</option>
                <option>Vol 100 (1s) Index</option>
                <option>Vol 25 (1s) Index</option>
                <option>Vol 50 (1s) Index</option>
              </select>
            </div>

            <div className="panel">
              <div className="panel-title">📶 LIVE PRICE</div>
              <div className="price-val">
                {priceInt}
                <span className="dec">.{priceDec}</span>
              </div>
              <div className="price-sub">VOL 75 (1S) INDEX</div>
            </div>

            <div className="panel tick-ring-wrap">
              <div className="panel-title" style={{ alignSelf: 'flex-start' }}>
                📡 INCOMING TICK
              </div>
              <div className="stars">★★★★★</div>
              <div className="tick-ring">
                <div className="ring-progress"></div>
                <div className="digit">{state.current}</div>
              </div>
              <div className="ticks-label">TICKS: {state.ticks}/1000</div>
              <div className="ticks-bar">
                <div
                  className="ticks-bar-fill"
                  style={{ width: `${(state.ticks / 1000) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">🎯 LIVE CURSOR TRACKER</div>
              <div className="cursor-tracker">
                <div className="ct-row">
                  <div className="ct-item">
                    <div className="lbl">CURRENT</div>
                    <div className="val" style={{ color: 'var(--blue)' }}>
                      {state.current}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: 'var(--muted)' }}>
                    →
                  </div>
                  <div className="ct-item">
                    <div className="lbl">TARGET</div>
                    <div className="val" style={{ color: 'var(--green)' }}>
                      {state.ctTarget}
                    </div>
                  </div>
                  <div className="ct-item">
                    <div className="lbl">REMAINING</div>
                    <div className="val">{Math.max(0, state.ctTarget - state.current)}</div>
                    <div className="lbl">TICKS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN */}
          <div className="col">
            <div className="range-card-wrap">
              <div className="panel range-card">
                <div className="range-title">DIGIT 0 TO 4</div>
                <div className="digit-row">{renderDigitRow([0, 1, 2, 3, 4])}</div>
                <div className="ou-dual">
                  <div className="side over">
                    <div className="h">OVER (Above {state.threshold.toFixed(1)}%)</div>
                    <div className="digits">
                      {underDigits.length ? underDigits.join(' · ') : '—'}
                    </div>
                    <div className="count">
                      {underDigits.length} Digit{underDigits.length !== 1 ? 's' : ''}
                    </div>
                    <div className="pct">{underDigitsDual.reduce((s, i) => s + state.pcts[i], 0).toFixed(1)}%</div>
                  </div>
                  <div className="ou-center">
                    <div className="pct">{state.threshold.toFixed(1)}%</div>
                    <div className="lbl">THRESHOLD</div>
                    <div className="frac">{state.numerator} ÷ 5</div>
                  </div>
                  <div className="side under">
                    <div className="h">UNDER (Below {state.threshold.toFixed(1)}%) ↓</div>
                    <div className="digits">
                      {underDigitsDual.length ? underDigitsDual.join(' · ') : '—'}
                    </div>
                    <div className="count">
                      {underDigitsDual.length} Digit{underDigitsDual.length !== 1 ? 's' : ''}
                    </div>
                    <div className="pct">{underTotalDual.toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              <div className="panel range-card">
                <div className="range-title">DIGIT 5 TO 9</div>
                <div className="digit-row">{renderDigitRow([5, 6, 7, 8, 9])}</div>
                <div className="ou-dual">
                  <div className="side over">
                    <div className="h">OVER (Above {state.threshold.toFixed(1)}%)</div>
                    <div className="digits">
                      {overDigits.length ? overDigits.join(' · ') : '—'}
                    </div>
                    <div className="count">
                      {overDigits.length} Digit{overDigits.length !== 1 ? 's' : ''}
                    </div>
                    <div className="pct">{overTotalDual.toFixed(1)}%</div>
                  </div>
                  <div className="ou-center">
                    <div className="pct">{state.threshold.toFixed(1)}%</div>
                    <div className="lbl">THRESHOLD</div>
                    <div className="frac">{state.numerator} ÷ 5</div>
                  </div>
                  <div className="side under">
                    <div className="h">UNDER (Below {state.threshold.toFixed(1)}%) ↓</div>
                    <div className="digits">
                      {overDigitsDual.length ? overDigitsDual.join(' · ') : '—'}
                    </div>
                    <div className="count">
                      {overDigitsDual.length} Digit{overDigitsDual.length !== 1 ? 's' : ''}
                    </div>
                    <div className="pct">
                      {[5, 6, 7, 8, 9]
                        .filter((i) => state.pcts[i] <= state.threshold)
                        .reduce((s, i) => s + state.pcts[i], 0)
                        .toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="ai-title">
                <h2>
                  🧠 AI ENGINE{' '}
                  <span>{state.direction === 'UNDER' ? 'UNDER (0 - 4)' : 'OVER (5 - 9)'}</span>
                </h2>
                <div className="s">AI ENDPOINT TO EXECUTION WORKFLOW</div>
              </div>
              <div className="steps">
                <div className="step">
                  <div className="num">1</div>
                  <div className="t">AI Endpoint</div>
                  <div className="desc">
                    AI recommends trade {state.direction} ({entryRangeArr[0]}-
                    {entryRangeArr[entryRangeArr.length - 1]})
                  </div>
                  <div className="box">
                    <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '4px' }}>
                      ENTRY POINT
                    </div>
                    <div className="big">{entryTarget}</div>
                  </div>
                  <div className="status">
                    CONFIDENCE
                    <div className="v">{state.confidence.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="step">
                  <div className="num">2</div>
                  <div className="t">Cursor Touching</div>
                  <div className="desc">Live cursor reaches the entry digit</div>
                  <div className="box">
                    <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '4px' }}>
                      LIVE CURSOR
                    </div>
                    <div className="box mini-digits">
                      {entryRangeArr.map((d) => (
                        <div
                          key={d}
                          className={`mini-d ${d === entryTarget ? 'hit' : ''}`}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="status">
                    STATUS
                    <div className="v">TOUCHED ✓</div>
                  </div>
                </div>

                <div className="step">
                  <div className="num">3</div>
                  <div className="t">Confirmation Digit Check</div>
                  <div className="desc">Engine checks {confirmLabel} for confirmation</div>
                  <div className="box">
                    <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '4px' }}>
                      NEXT TICK
                    </div>
                    <div className="box mini-digits">
                      {confirmRangeArr.map((d) => (
                        <div
                          key={d}
                          className={`mini-d ${state.confirmDigits.includes(d) ? 'hit' : ''}`}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="status">
                    RESULT
                    <div className="v">WATCHING {state.confirmDigits.join(' / ')}</div>
                  </div>
                </div>

                <div className="step">
                  <div className="num">4</div>
                  <div className="t">Execution Point</div>
                  <div className="desc">
                    Fires when cursor lands on {state.confirmDigits.join(' or ')}
                  </div>
                  <div className="rocket">🚀</div>
                  <div className="status">
                    TRADE STATUS
                    <div className="v">ARMED</div>
                  </div>
                </div>

                <div className="step">
                  <div className="num">5</div>
                  <div className="t">Trade Executed</div>
                  <div className="desc">{state.direction} trade placed successfully</div>
                  <div style={{ textAlign: 'center', fontSize: '24px', color: 'var(--green)', margin: '6px 0' }}>
                    {arrow}
                  </div>
                  <div className="status">
                    DIRECTION / CONFIDENCE
                    <div className="v">{state.direction} · {state.confidence.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">📶 DIGIT STRENGTH RANKING</div>
              <div className="rank-bars">
                {state.pcts.map((p, i) => {
                  const max = Math.max(...state.pcts);
                  const color =
                    p > state.avg * 1.1
                      ? 'var(--green)'
                      : p < state.avg * 0.9
                        ? 'var(--red)'
                        : 'var(--amber)';
                  return (
                    <div key={i} className="rank-col">
                      <div className="val" style={{ color }}>
                        {p.toFixed(1)}%
                      </div>
                      <div
                        className="rank-bar"
                        style={{
                          height: `${Math.max(6, (p / max) * 100)}px`,
                          background: color,
                        }}
                      ></div>
                      <div className="d">{i}</div>
                    </div>
                  );
                })}
              </div>
              <div className="rank-legend">
                <span>
                  <i style={{ background: 'var(--green)' }}></i>STRONG (&gt;avg)
                </span>
                <span>
                  <i style={{ background: 'var(--amber)' }}></i>NEUTRAL (≈avg)
                </span>
                <span>
                  <i style={{ background: 'var(--red)' }}></i>WEAK (&lt;avg)
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col">
            <div className="panel">
              <div className="panel-title">🏆 KEY DIGITS</div>
              <div>
                <div className="kd-row">
                  <div
                    className="kd-circle"
                    style={{
                      background: 'var(--green-dim)',
                      color: 'var(--green)',
                      border: '2px solid var(--green)',
                    }}
                  >
                    {state.marks.highest}
                  </div>
                  <div className="kd-info">
                    <div className="l">HIGHEST</div>
                    <div className="p" style={{ color: 'var(--green)' }}>
                      {state.pcts[state.marks.highest].toFixed(1)}%
                    </div>
                  </div>
                  <div className="kd-tag">TOP</div>
                </div>
                <div
                  style={{
                    color: state.direction === 'OVER' ? 'var(--amber)' : 'var(--green)',
                    fontSize: '10.5px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 800,
                    padding: '8px 0',
                    marginLeft: '44px',
                  }}
                >
                  → Drives direction: {state.direction}
                </div>
                <div className="kd-row">
                  <div
                    className="kd-circle"
                    style={{
                      background: 'var(--amber-dim)',
                      color: 'var(--amber)',
                      border: '2px solid var(--amber)',
                    }}
                  >
                    {state.marks.second}
                  </div>
                  <div className="kd-info">
                    <div className="l">2ND HIGHEST</div>
                    <div className="p" style={{ color: 'var(--amber)' }}>
                      {state.pcts[state.marks.second].toFixed(1)}%
                    </div>
                  </div>
                  <div className="kd-tag">TOP</div>
                </div>
                <div className="kd-row">
                  <div
                    className="kd-circle"
                    style={{
                      background: 'var(--red-dim)',
                      color: 'var(--red)',
                      border: '2px solid var(--red)',
                    }}
                  >
                    {state.marks.lowest}
                  </div>
                  <div className="kd-info">
                    <div className="l">LOWEST</div>
                    <div className="p" style={{ color: 'var(--red)' }}>
                      {state.pcts[state.marks.lowest].toFixed(1)}%
                    </div>
                  </div>
                  <div className="kd-tag">TOP</div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">⚙ SIGNAL (TOP 3 DIGITS)</div>
              <div className="signal-row">
                <div className="signal-item">
                  <div
                    className="digit-circle"
                    style={{
                      borderColor: 'var(--green)',
                      color: 'var(--green)',
                      width: '52px',
                      height: '52px',
                      fontSize: '19px',
                    }}
                  >
                    {state.marks.highest}
                  </div>
                  <div className="signal-item lbl">TOP</div>
                </div>
                <div className="signal-item">
                  <div
                    className="digit-circle"
                    style={{
                      borderColor: 'var(--amber)',
                      color: 'var(--amber)',
                      width: '52px',
                      height: '52px',
                      fontSize: '19px',
                    }}
                  >
                    {state.marks.second}
                  </div>
                  <div className="signal-item lbl">TOP</div>
                </div>
                <div className="signal-item">
                  <div
                    className="digit-circle"
                    style={{
                      borderColor: 'var(--red)',
                      color: 'var(--red)',
                      width: '52px',
                      height: '52px',
                      fontSize: '19px',
                    }}
                  >
                    {state.marks.lowest}
                  </div>
                  <div className="signal-item lbl">TOP</div>
                </div>
              </div>
              <div
                className="signal-direction"
                style={{
                  color: state.direction === 'OVER' ? 'var(--amber)' : 'var(--green)',
                }}
              >
                ✓ CONFIRMED DIRECTION: {state.direction}
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">🕐 TOTAL % ON OVER AND UNDER</div>
              <div className="ou-row">
                <div className={`tou-box und ${state.direction === 'UNDER' ? 'confirmed' : ''}`}>
                  <div className="l">UNDER (0-4)</div>
                  <div className="sub">0+1+2+3+4</div>
                  <div className="p">{state.underTotal.toFixed(1)}%</div>
                </div>
                <div className={`tou-box ovr ${state.direction === 'OVER' ? 'confirmed' : ''}`}>
                  <div className="l">OVER (5-9)</div>
                  <div className="sub">5+6+7+8+9</div>
                  <div className="p">{state.overTotal.toFixed(1)}%</div>
                </div>
              </div>
              <div className="tou-bar">
                <div className="u" style={{ width: `${state.underTotal}%` }}>
                  UNDER {state.underTotal.toFixed(1)}%
                </div>
                <div className="o" style={{ width: `${state.overTotal}%` }}>
                  OVER {state.overTotal.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">🧠 AI ENDPOINT (TRADE SIGNAL)</div>
              <div className="endpoint-cols">
                <div className="ep-col und">
                  <div className="h">UNDER SIDE (0-4)</div>
                  <div className="endpoint">
                    AI ENDPOINT: <b>{state.underTarget}</b>
                  </div>
                  <div className="ep-mini">
                    <div className="strong">
                      <span className="lbl">STRONGEST</span>
                      <span className="v">
                        {Math.max(...[0, 1, 2, 3, 4].map((i) => state.pcts[i])).toFixed(1)}%
                      </span>
                    </div>
                    <div className="weak">
                      <span className="lbl">WEAKEST</span>
                      <span className="v">
                        {Math.min(...[0, 1, 2, 3, 4].map((i) => state.pcts[i])).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="vs-badge">VS</div>
                <div className="ep-col ovr">
                  <div className="h">OVER SIDE (5-9)</div>
                  <div className="endpoint">
                    AI ENDPOINT: <b>{state.overTarget}</b>
                  </div>
                  <div className="ep-mini">
                    <div className="strong">
                      <span className="lbl">STRONGEST</span>
                      <span className="v">
                        {Math.max(...[5, 6, 7, 8, 9].map((i) => state.pcts[i])).toFixed(1)}%
                      </span>
                    </div>
                    <div className="weak">
                      <span className="lbl">WEAKEST</span>
                      <span className="v">
                        {Math.min(...[5, 6, 7, 8, 9].map((i) => state.pcts[i])).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dcr-row">
                <div className="dcr-item dir">
                  <div className="l">DIRECTION</div>
                  <div className="v">{state.direction === 'UNDER' ? '↓ UNDER' : '↑ OVER'}</div>
                </div>
                <div className="dcr-item conf">
                  <div className="l">AI CONFIDENCE</div>
                  <div className="v">{state.confidence.toFixed(1)}%</div>
                  <div className="stars">★★★★☆</div>
                </div>
                <div className="dcr-item rec">
                  <div className="l">RECOMMENDATION</div>
                  <div className="v">{state.confidence > 70 ? 'TAKE TRADE ✓' : 'WAIT ✕'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="bottom">
          <div className="item">🎯 FOCUS</div>
          <div className="item">🧭 PLAN</div>
          <div className="item">▶ EXECUTE</div>
          <div className="item">🧠 PREDICT</div>
          <div className="item">📈 TRADE</div>
          <div className="item">🪙 PROFIT</div>
          <div className="item">🛡 DISCIPLINE</div>
          <div className="item">♥ PATIENCE</div>
          <div className="item">♛ SUCCESS</div>
        </nav>
        <div className="disclaimer">
          Digit percentages are generated by a client-side simulation for demonstration only — there is no real predictive edge behind these figures. Digit trading is a game of chance; trade only what you can afford to lose.
        </div>
      </div>
    </div>
  );
}
