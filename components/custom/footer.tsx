export function Footer() {
  const navigationItems = [
    { icon: '🎯', label: 'FOCUS' },
    { icon: '📋', label: 'PLAN' },
    { icon: '▶️', label: 'EXECUTE' },
    { icon: '🔮', label: 'PREDICT' },
    { icon: '💱', label: 'TRADE' },
    { icon: '💰', label: 'PROFIT' },
    { icon: '🛡️', label: 'DISCIPLINE' },
    { icon: '⏳', label: 'PATIENCE' },
    { icon: '👑', label: 'SUCCESS' },
  ];

  return (
    <footer style={{
      width: '100%',
      paddingTop: '12px',
      paddingBottom: '12px',
      textAlign: 'center',
      borderTop: '2px solid rgb(255, 215, 0)',
      backgroundColor: 'rgba(10, 10, 10, 0.8)',
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
      backdropFilter: 'blur(10px)',
    }} className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 sm:gap-3 text-xs overflow-x-auto px-2 pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {navigationItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1 whitespace-nowrap">
            <span style={{ fontSize: '14px' }}>{item.icon}</span>
            <span style={{ color: 'rgb(255, 215, 0)', fontWeight: '600', fontSize: '11px', letterSpacing: '0.5px' }}>
              {item.label}
            </span>
            {idx < navigationItems.length - 1 && (
              <span style={{ color: 'rgb(51, 51, 51)', margin: '0 4px' }}>|</span>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: '10px', letterSpacing: '1px', color: 'rgb(180, 180, 180)' }}>
        Powered by <span style={{ fontWeight: 'bold', color: 'rgb(255, 215, 0)' }}>DERIV</span>
      </p>
    </footer>
  );
}
