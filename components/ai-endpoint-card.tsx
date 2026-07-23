'use client';

interface AIEndpointCardProps {
  underEndpoint: number;
  underConfidence: number;
  underStrongest: number;
  underWeakest: number;
  overEndpoint: number;
  overConfidence: number;
  overStrongest: number;
  overWeakest: number;
  activeDirection?: 'UNDER' | 'OVER';
  recommendation?: 'TAKE TRADE' | 'AVOID';
}

export function AIEndpointCard({
  underEndpoint,
  underConfidence,
  underStrongest,
  underWeakest,
  overEndpoint,
  overConfidence,
  overStrongest,
  overWeakest,
  activeDirection = 'UNDER',
  recommendation = 'TAKE TRADE',
}: AIEndpointCardProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 rounded-lg border-2" style={{
      borderColor: 'rgb(0, 255, 0)',
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.05)',
    }}>
      <div className="text-xs font-semibold tracking-wider" style={{ color: 'rgb(0, 255, 0)' }}>
        🚀 AI ENDPOINT (TRADE SIGNAL)
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* UNDER section */}
        <div style={{ padding: '12px', borderRadius: '6px', border: '1px solid rgb(0, 255, 0)', backgroundColor: 'rgba(0, 255, 0, 0.05)' }}>
          <div style={{ fontSize: '10px', color: 'rgb(0, 255, 0)', marginBottom: '4px', fontWeight: '600' }}>
            UNDER SIDE (0 - 4)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'rgb(0, 255, 0)', fontFamily: "'Courier New', monospace", marginBottom: '6px' }}>
            AI ENDPOINT: {underEndpoint}
          </div>
          <div className="space-y-1 text-xs">
            <div>
              <span style={{ color: 'rgb(180, 180, 180)' }}>STRONGEST</span>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgb(0, 255, 0)', fontFamily: "'Courier New', monospace" }}>
                {underStrongest} (18.8%)
              </div>
            </div>
            <div>
              <span style={{ color: 'rgb(180, 180, 180)' }}>WEAKEST</span>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgb(255, 51, 51)', fontFamily: "'Courier New', monospace" }}>
                {underWeakest} (3.1%)
              </div>
            </div>
          </div>
        </div>

        {/* OVER section */}
        <div style={{ padding: '12px', borderRadius: '6px', border: '1px solid rgb(255, 215, 0)', backgroundColor: 'rgba(255, 215, 0, 0.05)' }}>
          <div style={{ fontSize: '10px', color: 'rgb(255, 215, 0)', marginBottom: '4px', fontWeight: '600' }}>
            OVER SIDE (5 - 9)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'rgb(255, 215, 0)', fontFamily: "'Courier New', monospace", marginBottom: '6px' }}>
            AI ENDPOINT: {overEndpoint}
          </div>
          <div className="space-y-1 text-xs">
            <div>
              <span style={{ color: 'rgb(180, 180, 180)' }}>STRONGEST</span>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgb(0, 255, 0)', fontFamily: "'Courier New', monospace" }}>
                {overStrongest} (15.6%)
              </div>
            </div>
            <div>
              <span style={{ color: 'rgb(180, 180, 180)' }}>WEAKEST</span>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgb(255, 51, 51)', fontFamily: "'Courier New', monospace" }}>
                {overWeakest} (3.1%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VS indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'rgba(51, 51, 51, 0.5)', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>
        <div style={{ color: 'rgb(0, 255, 0)', textAlign: 'center', flex: 1 }}>
          {underEndpoint}
        </div>
        <div style={{ color: 'rgb(255, 215, 0)', fontSize: '16px' }}>VS</div>
        <div style={{ color: 'rgb(255, 215, 0)', textAlign: 'center', flex: 1 }}>
          {overEndpoint}
        </div>
      </div>

      {/* Direction and recommendation */}
      <div className="grid grid-cols-2 gap-2">
        <div style={{ padding: '8px', textAlign: 'center', borderRadius: '4px', backgroundColor: 'rgba(0, 255, 0, 0.1)', border: '1px solid rgb(0, 255, 0)' }}>
          <div style={{ fontSize: '10px', color: 'rgb(180, 180, 180)' }}>DIRECTION</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'rgb(0, 255, 0)' }}>
            ↓ {activeDirection}
          </div>
        </div>
        <div style={{ padding: '8px', textAlign: 'center', borderRadius: '4px', backgroundColor: 'rgba(0, 255, 0, 0.1)', border: '1px solid rgb(0, 255, 0)' }}>
          <div style={{ fontSize: '10px', color: 'rgb(180, 180, 180)' }}>AI CONFIDENCE</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'rgb(255, 215, 0)', fontFamily: "'Courier New', monospace" }}>
            {underConfidence}%
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div style={{ padding: '10px', textAlign: 'center', borderRadius: '6px', backgroundColor: 'rgba(0, 255, 0, 0.1)', border: '1px solid rgb(0, 255, 0)' }}>
        <div style={{ fontSize: '10px', color: 'rgb(180, 180, 180)' }}>RECOMMENDATION</div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'rgb(0, 255, 0)', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          {recommendation} <span>✓</span>
        </div>
      </div>
    </div>
  );
}
