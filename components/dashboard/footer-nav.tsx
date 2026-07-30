const navItems = [
  { icon: '🎯', label: 'FOCUS' },
  { icon: '📋', label: 'PLAN' },
  { icon: '▶️', label: 'EXECUTE' },
  { icon: '🧠', label: 'PREDICT' },
  { icon: '📊', label: 'TRADE' },
  { icon: '💰', label: 'PROFIT' },
  { icon: '🛡️', label: 'DISCIPLINE' },
  { icon: '💚', label: 'PATIENCE' },
  { icon: '👑', label: 'SUCCESS' },
];

export function FooterNav() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[rgb(10,14,39)] border-t border-[rgb(212,175,55)] border-opacity-30 px-8 py-4">
      <div className="flex items-center justify-center gap-8">
        {navItems.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <button className="flex flex-col items-center gap-1 px-3 py-2 rounded hover:bg-[rgb(212,175,55)] hover:bg-opacity-10 transition">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-bold text-[rgb(212,175,55)] tracking-wider">{item.label}</span>
            </button>
            {index < navItems.length - 1 && <span className="text-[rgb(212,175,55)] text-opacity-30">|</span>}
          </div>
        ))}
      </div>
    </footer>
  );
}
