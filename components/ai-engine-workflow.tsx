'use client';

interface AIEngineWorkflowProps {
  currentStep?: number;
  entryPoint?: number;
  liveCursor?: number;
  confirmationDigit?: number;
  tradeStatus?: 'IDLE' | 'EXECUTING' | 'VALID' | 'INVALID' | 'EXECUTED';
  confidence?: number;
}

export function AIEngineWorkflow({
  currentStep = 0,
  entryPoint = 4,
  liveCursor = 0,
  confirmationDigit = 3,
  tradeStatus = 'IDLE',
  confidence = 84.4,
}: AIEngineWorkflowProps) {
  const steps = [
    { num: 1, label: 'AI ENDPOINT', desc: 'AI recommends take UNDER', value: entryPoint },
    { num: 2, label: 'CURSOR TOUCHING', desc: 'Live cursor reaches the entry digit', value: liveCursor },
    { num: 3, label: 'CONFIRMATION DIGIT CHECK', desc: 'Engine checks next tick for confirmation (0-4)', value: confirmationDigit },
    { num: 4, label: 'EXECUTION POINT', desc: 'All conditions met Executing trade...', value: '' },
    { num: 5, label: 'TRADE EXECUTED', desc: 'UNDER trade placed successfully', value: '' },
  ];

  const getStepStatus = (stepNum: number) => {
    if (stepNum < currentStep) return 'completed';
    if (stepNum === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full px-4 py-4 rounded-lg border-2" style={{
      borderColor: 'rgb(0, 255, 0)',
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.05)',
    }}>
      <div className="text-xs font-semibold tracking-wider mb-4 flex items-center gap-2" style={{ color: 'rgb(0, 255, 0)' }}>
        🧠 AI ENGINE UNDER (0 - 4)
      </div>

      {/* Mobile: Vertical layout */}
      <div className="md:hidden flex flex-col gap-3">
        {steps.map((step, idx) => (
          <div key={step.num} className="flex items-start gap-2">
            <div
              style={{
                width: '40px',
                height: '40px',
                minWidth: '40px',
                borderRadius: '50%',
                border: `2px solid ${getStepStatus(step.num) === 'completed' ? 'rgb(0, 255, 0)' : 'rgb(0, 255, 0)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: getStepStatus(step.num) === 'active' ? 'rgba(0, 255, 0, 0.2)' : 'transparent',
                color: 'rgb(0, 255, 0)',
              }}
            >
              {step.num}
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgb(0, 255, 0)' }}>
                {step.label}
              </div>
              <div style={{ fontSize: '11px', color: 'rgb(180, 180, 180)', marginTop: '2px' }}>
                {step.desc}
              </div>
              {step.value !== '' && (
                <div style={{ fontSize: '12px', color: 'rgb(150, 255, 0)', marginTop: '2px', fontFamily: "'Courier New', monospace" }}>
                  {step.value}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Horizontal flow */}
      <div className="hidden md:flex items-start gap-2 overflow-x-auto pb-2">
        {steps.map((step, idx) => (
          <div key={step.num} className="flex items-center gap-1 min-w-max">
            <div
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                border: '2px solid rgb(0, 255, 0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: getStepStatus(step.num) === 'active' ? 'rgba(0, 255, 0, 0.2)' : 'transparent',
                color: 'rgb(0, 255, 0)',
              }}
            >
              {step.num}
            </div>
            {idx < steps.length - 1 && (
              <div style={{ fontSize: '18px', color: 'rgb(0, 255, 0)', paddingBottom: '8px' }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* Status indicators */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(0, 255, 0, 0.1)', border: '1px solid rgb(0, 255, 0)' }}>
          <div style={{ fontSize: '10px', color: 'rgb(180, 180, 180)' }}>CONFIDENCE</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'rgb(0, 255, 0)', fontFamily: "'Courier New', monospace" }}>
            {confidence}%
          </div>
        </div>
        <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(0, 255, 0, 0.1)', border: '1px solid rgb(0, 255, 0)' }}>
          <div style={{ fontSize: '10px', color: 'rgb(180, 180, 180)' }}>STATUS</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'rgb(0, 255, 0)' }}>
            {tradeStatus}
          </div>
        </div>
      </div>
    </div>
  );
}
