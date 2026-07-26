export function LastDigitPredictionPanel() {
  return (
    <div className="w-full bg-black text-white font-sans">
      <style>{`
        :root{
          --bg:#000000;
          --panel:#0a0a0a;
          --panel-2:#0d0d0d;
          --gold:#D4AF37;
          --gold-bright:#F4CB4B;
          --gold-dim:rgba(212,175,55,.35);
          --green:#22c55e;
          --green-dim:rgba(34,197,94,.15);
          --red:#ef4444;
          --red-dim:rgba(239,68,68,.15);
          --amber:#eab308;
          --amber-dim:rgba(234,179,8,.15);
          --blue:#3b82f6;
          --blue-dim:rgba(59,130,246,.15);
          --text:#eaeaea;
          --muted:#8b8b8b;
          --mono:'JetBrains Mono', monospace;
          --sans:'Inter', sans-serif;
          --serif:'Cinzel', serif;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .ldp-body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          padding: 16px;
          background-image: radial-gradient(circle at 50% 0%, rgba(212,175,55,.06), transparent 45%);
        }
        .ldp-wrap {
          max-width: 1520px;
          margin: 0 auto;
        }
        .ldp-panel {
          background: var(--panel);
          border: 1px solid var(--gold-dim);
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,.6), inset 0 0 30px rgba(212,175,55,.02);
        }
        .ldp-panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--sans);
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
        }
        .toggle-row {
          display: flex;
          gap: 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--gold-dim);
        }
        .toggle-row button {
          font-family: var(--sans);
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.5px;
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
          font-family: var(--serif);
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
          font-family: var(--mono);
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
          font-family: var(--mono);
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
          font-family: var(--mono);
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
          .dashboard {
            grid-template-columns: 1fr;
          }
        }
        .col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        select.vol-select {
          width: 100%;
          background: #111;
          border: 1px solid var(--gold-dim);
          color: var(--text);
          padding: 10px;
          border-radius: 8px;
          font-family: var(--mono);
          font-size: 13px;
        }
      `}</style>

      <div className="ldp-body">
        <div className="ldp-wrap">
          <header>
            <div className="toggle-row">
              <button className="active" id="btnDirect">DIRECT</button>
              <button id="btnProxy">PROXY</button>
            </div>
            <div className="title-block">
              <h1>♛ LAST DIGIT PREDICTION ♛</h1>
              <div className="sub">REAL-TIME AI ANALYSIS</div>
              <div className="legend">
                <span><i style={{background: 'var(--blue)'}}></i>LIVE / CURRENT DIGIT</span>
                <span><i style={{background: 'var(--green)'}}></i>HIGHEST %</span>
                <span><i style={{background: 'var(--amber)'}}></i>2ND HIGHEST %</span>
                <span><i style={{background: 'var(--red)'}}></i>LOWEST %</span>
              </div>
            </div>
            <div className="live-badge"><span className="live-dot"></span>LIVE</div>
          </header>

          <div className="dashboard">
            <div className="col">
              <div className="ldp-panel">
                <div className="ldp-panel-title">〰 VOLATILITY INDEX</div>
                <select className="vol-select" id="volSelect">
                  <option>Vol 75 (1s) Index</option>
                  <option>Vol 100 (1s) Index</option>
                  <option>Vol 25 (1s) Index</option>
                </select>
              </div>
              <div className="ldp-panel">
                <div className="ldp-panel-title">💰 CURRENT PRICE</div>
                <div style={{fontFamily: 'var(--mono)', fontWeight: '800', fontSize: '34px', color: '#fff'}}>
                  3,245<span style={{color: 'var(--gold-bright)'}}>45</span>
                </div>
                <div style={{fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', marginTop: '4px'}}>
                  Last Updated 2s ago
                </div>
              </div>
            </div>

            <div className="col">
              <div className="ldp-panel">
                <div className="ldp-panel-title">📊 TOP PREDICTED DIGITS</div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px'}}>
                  {[7, 3, 2, 5, 8].map((digit, idx) => (
                    <div key={idx} style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px'}}>
                      <div style={{
                        width: '58px',
                        height: '58px',
                        borderRadius: '50%',
                        border: '2.5px solid #333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--mono)',
                        fontWeight: '800',
                        fontSize: '22px',
                        color: '#fff',
                        background: '#0d0d0d',
                        margin: '0 auto',
                        borderColor: idx === 0 ? 'var(--green)' : '#333',
                        color: idx === 0 ? 'var(--green)' : '#fff',
                        boxShadow: idx === 0 ? '0 0 12px rgba(34,197,94,.35)' : 'none'
                      }}>
                        {digit}
                      </div>
                      <div style={{fontFamily: 'var(--mono)', fontSize: '11.5px', fontWeight: '700', color: 'var(--muted)', border: '1.5px solid #2c2c2c', padding: '3px 9px', borderRadius: '6px', background: '#0d0d0d'}}>
                        {23 + idx * 2}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col">
              <div className="ldp-panel">
                <div className="ldp-panel-title">🎯 CONFIDENCE METRICS</div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #1a1a1a'}}>
                    <span style={{fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)'}}>AI Confidence</span>
                    <span style={{fontFamily: 'var(--mono)', fontWeight: '800', fontSize: '16px', color: 'var(--gold-bright)'}}>87%</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #1a1a1a'}}>
                    <span style={{fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)'}}>Pattern Match</span>
                    <span style={{fontFamily: 'var(--mono)', fontWeight: '800', fontSize: '16px', color: 'var(--green)'}}>94%</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)'}}>Signal Strength</span>
                    <span style={{fontFamily: 'var(--mono)', fontWeight: '800', fontSize: '16px', color: 'var(--amber)'}}>76%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
