'use client';

interface OverUnderGaugeProps {
  underPercentage: number;
  overPercentage: number;
}

export function OverUnderGauge({ underPercentage, overPercentage }: OverUnderGaugeProps) {
  const total = underPercentage + overPercentage;
  const underWidth = (underPercentage / total) * 100;
  const overWidth = (overPercentage / total) * 100;

  return (
    <div className="flex flex-col gap-3 px-4 py-4 rounded-lg border-2" style={{
      borderColor: 'rgb(0, 255, 0)',
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.05)',
    }}>
      <div className="text-xs font-semibold tracking-wider" style={{ color: 'rgb(0, 255, 0)' }}>
        ⏱️ TOTAL % ON OVER AND UNDER
      </div>

      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <div style={{ fontSize: '11px', color: 'rgb(0, 255, 0)', marginBottom: '4px' }}>
            UNDER (0 - 4)
          </div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'rgb(0, 255, 0)', fontFamily: "'Courier New', monospace" }}>
            0 + 1 + 2 + 3 + 4
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'rgb(0, 255, 0)', fontFamily: "'Courier New', monospace", marginTop: '4px' }}>
            {underPercentage.toFixed(1)}%
          </div>
        </div>
        <div className="flex-1">
          <div style={{ fontSize: '11px', color: 'rgb(255, 215, 0)', marginBottom: '4px' }}>
            OVER (5 - 9)
          </div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'rgb(255, 215, 0)', fontFamily: "'Courier New', monospace" }}>
            5 + 6 + 7 + 8 + 9
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'rgb(255, 215, 0)', fontFamily: "'Courier New', monospace", marginTop: '4px' }}>
            {overPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', height: '24px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgb(51, 51, 51)' }}>
        <div
          style={{
            width: `${underWidth}%`,
            backgroundColor: 'rgb(0, 255, 0)',
            boxShadow: 'inset 0 0 8px rgba(0, 255, 0, 0.3)',
          }}
        />
        <div
          style={{
            width: `${overWidth}%`,
            backgroundColor: 'rgb(255, 215, 0)',
            boxShadow: 'inset 0 0 8px rgba(255, 215, 0, 0.3)',
          }}
        />
      </div>

      <div className="flex gap-2 text-xs font-semibold mt-2">
        <div style={{ flex: 1, textAlign: 'center', color: 'rgb(0, 255, 0)', padding: '4px', backgroundColor: 'rgba(0, 255, 0, 0.1)', borderRadius: '4px' }}>
          UNDER {underPercentage.toFixed(1)}%
        </div>
        <div style={{ flex: 1, textAlign: 'center', color: 'rgb(255, 215, 0)', padding: '4px', backgroundColor: 'rgba(255, 215, 0, 0.1)', borderRadius: '4px' }}>
          OVER {overPercentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
