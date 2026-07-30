export function LeftSidebar() {
  return (
    <aside className="fixed left-0 top-20 bottom-20 w-64 bg-[rgb(10,14,39)] border-r border-[rgb(212,175,55)] border-opacity-30 p-6 overflow-y-auto">
      {/* Volatility Index */}
      <div className="mb-6 p-4 border border-[rgb(212,175,55)] border-opacity-40 rounded-lg bg-[rgb(15,20,45)]">
        <div className="flex items-center gap-2 text-[rgb(212,175,55)] text-xs font-bold tracking-wider mb-3">
          <span className="text-lg">📊</span>
          VOLATILITY INDEX
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-white font-bold text-sm">Vol 75 (1s) Index</span>
          <button className="text-[rgb(212,175,55)] text-xs hover:opacity-75">▼</button>
        </div>
      </div>

      {/* Live Price */}
      <div className="mb-6 p-4 border border-[rgb(212,175,55)] border-opacity-40 rounded-lg bg-[rgb(15,20,45)]">
        <div className="text-[rgb(212,175,55)] text-xs font-bold tracking-wider mb-2">LIVE PRICE</div>
        <div className="text-5xl font-bold text-white tracking-tight">6924.61</div>
        <div className="text-xs text-gray-400 mt-2 uppercase tracking-wide">VOL 75 (1S) INDEX</div>
      </div>

      {/* Incoming Tick */}
      <div className="mb-6 p-4 border border-[rgb(212,175,55)] border-opacity-40 rounded-lg bg-[rgb(15,20,45)]">
        <div className="flex items-center gap-2 text-[rgb(212,175,55)] text-xs font-bold tracking-wider mb-4">
          <span>📡</span>
          INCOMING TICK
        </div>
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-[rgb(212,175,55)] flex items-center justify-center">
            <div className="text-5xl font-bold text-[rgb(212,175,55)]">1</div>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <span className="text-[rgb(212,175,55)]">⭐</span>
          <span className="text-[rgb(212,175,55)]">⭐</span>
          <span className="text-[rgb(212,175,55)]">⭐</span>
          <span className="text-[rgb(212,175,55)]">⭐</span>
          <span className="text-gray-600">⭐</span>
        </div>
      </div>

      {/* Tick Counter */}
      <div className="mb-6 p-4 border border-[rgb(212,175,55)] border-opacity-40 rounded-lg bg-[rgb(15,20,45)]">
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">TICKS: 32/1000</div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-[rgb(212,175,55)] rounded-full" style={{ width: '3.2%' }}></div>
        </div>
      </div>

      {/* Live Cursor Tracker */}
      <div className="p-4 border border-[rgb(212,175,55)] border-opacity-40 rounded-lg bg-[rgb(15,20,45)]">
        <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-4">LIVE CURSOR TRACKER</div>
        
        <div className="flex items-center justify-between mb-6 px-2">
          <span className="text-xs text-gray-400 uppercase">CURRENT</span>
          <span className="text-xs text-gray-400 uppercase">TARGET</span>
          <span className="text-xs text-gray-400 uppercase">REMAINING</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-sm">
            1
          </div>
          <div className="flex-1 h-1 bg-gray-600 mx-2"></div>
          <div className="w-10 h-10 rounded-full border-2 border-[rgb(34,197,94)] flex items-center justify-center text-[rgb(34,197,94)] font-bold text-sm">
            4
          </div>
          <div className="ml-auto text-center">
            <div className="text-2xl font-bold text-gray-300">3</div>
            <div className="text-xs text-gray-500">TICKS</div>
          </div>
        </div>

        {/* Cursor Progression */}
        <div className="flex justify-between gap-1">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-xs">
            1
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-400 font-bold text-xs">
            2
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-400 font-bold text-xs">
            3
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-400 font-bold text-xs">
            4
          </div>
        </div>
      </div>
    </aside>
  );
}
