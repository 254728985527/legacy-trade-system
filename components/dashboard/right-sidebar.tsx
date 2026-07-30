export function RightSidebar() {
  return (
    <aside className="fixed right-0 top-20 bottom-20 w-72 bg-[rgb(10,14,39)] border-l border-[rgb(212,175,55)] border-opacity-30 p-6 overflow-y-auto space-y-6">
      {/* Key Digits Box */}
      <div className="p-4 border border-[rgb(212,175,55)] border-opacity-40 rounded-lg bg-[rgb(15,20,45)]">
        <div className="flex items-center gap-2 text-[rgb(212,175,55)] text-xs font-bold tracking-wider mb-4">
          <span>🎯</span>
          KEY DIGITS
        </div>

        <div className="space-y-3">
          {/* Highest */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[rgb(34,197,94)] flex items-center justify-center font-bold text-[rgb(34,197,94)]">
                4
              </div>
              <div>
                <div className="text-xs text-gray-400">HIGHEST</div>
                <div className="text-sm font-bold text-white">18.8%</div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-[rgb(212,175,55)] bg-opacity-20 text-[rgb(212,175,55)] rounded font-bold">
              TOP
            </span>
          </div>

          {/* 2nd Highest */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-yellow-400 flex items-center justify-center font-bold text-yellow-400">
                1
              </div>
              <div>
                <div className="text-xs text-gray-400">2ND HIGHEST</div>
                <div className="text-sm font-bold text-white">15.6%</div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-[rgb(212,175,55)] bg-opacity-20 text-[rgb(212,175,55)] rounded font-bold">
              TOP
            </span>
          </div>

          {/* Lowest */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[rgb(239,68,68)] flex items-center justify-center font-bold text-[rgb(239,68,68)]">
                2
              </div>
              <div>
                <div className="text-xs text-gray-400">LOWEST</div>
                <div className="text-sm font-bold text-white">3.1%</div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-[rgb(212,175,55)] bg-opacity-20 text-[rgb(212,175,55)] rounded font-bold">
              TOP
            </span>
          </div>
        </div>
      </div>

      {/* Signal Box */}
      <div className="p-4 border border-[rgb(212,175,55)] border-opacity-40 rounded-lg bg-[rgb(15,20,45)]">
        <div className="flex items-center gap-2 text-[rgb(212,175,55)] text-xs font-bold tracking-wider mb-4">
          <span>⚡</span>
          SIGNAL (TOP 3 DIGITS)
        </div>
        <div className="flex justify-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-[rgb(34,197,94)] flex items-center justify-center font-bold text-lg text-[rgb(34,197,94)] bg-[rgb(34,197,94)] bg-opacity-10">
            4
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center font-bold text-lg text-yellow-400 bg-yellow-400 bg-opacity-10">
            1
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-[rgb(239,68,68)] flex items-center justify-center font-bold text-lg text-[rgb(239,68,68)] bg-[rgb(239,68,68)] bg-opacity-10">
            2
          </div>
        </div>
      </div>

      {/* Total % Box */}
      <div className="p-4 border border-[rgb(212,175,55)] border-opacity-40 rounded-lg bg-[rgb(15,20,45)]">
        <div className="flex items-center gap-2 text-[rgb(212,175,55)] text-xs font-bold tracking-wider mb-4">
          <span>📊</span>
          TOTAL % ON OVER AND UNDER
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-xs text-[rgb(34,197,94)] font-bold mb-1">UNDER (0 - 4)</div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>0 • 1 • 2 • 3 • 4</div>
            </div>
            <div className="text-lg font-bold text-[rgb(34,197,94)] mt-2">59.4%</div>
          </div>
          <div>
            <div className="text-xs text-[rgb(212,175,55)] font-bold mb-1">OVER (5 - 9)</div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>5 • 6 • 7 • 8 • 9</div>
            </div>
            <div className="text-lg font-bold text-[rgb(212,175,55)] mt-2">40.6%</div>
          </div>
        </div>

        <div className="flex gap-2 h-6 rounded overflow-hidden">
          <div className="flex-1 bg-[rgb(34,197,94)] flex items-center justify-center text-xs font-bold text-white">
            UNDER 59.4%
          </div>
          <div className="flex-1 bg-[rgb(212,175,55)] flex items-center justify-center text-xs font-bold text-[rgb(10,14,39)]">
            OVER 40.6%
          </div>
        </div>
      </div>

      {/* AI Endpoint Box */}
      <div className="p-4 border border-[rgb(34,197,94)] border-opacity-60 rounded-lg bg-[rgb(15,20,45)]">
        <div className="flex items-center gap-2 text-[rgb(34,197,94)] text-xs font-bold tracking-wider mb-4">
          <span>🚀</span>
          AI ENDPOINT (TRADE SIGNAL)
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Under Side */}
          <div className="p-3 border border-[rgb(34,197,94)] border-opacity-40 rounded bg-[rgb(34,197,94)] bg-opacity-5">
            <div className="text-xs text-gray-400 font-bold mb-2">UNDER SIDE (0 - 4)</div>
            <div className="text-2xl font-bold text-[rgb(34,197,94)] mb-2">4</div>
            <div className="text-xs text-gray-500">AI ENDPOINT: 4</div>
            <div className="text-xs text-gray-400 mt-2 space-y-1">
              <div className="text-[rgb(34,197,94)]">STRONGEST: <span className="font-bold">4 (18.8%)</span></div>
              <div className="text-[rgb(239,68,68)]">WEAKEST: <span className="font-bold">2 (3.1%)</span></div>
            </div>
          </div>

          {/* Over Side */}
          <div className="p-3 border border-[rgb(212,175,55)] border-opacity-40 rounded bg-[rgb(212,175,55)] bg-opacity-5">
            <div className="text-xs text-gray-400 font-bold mb-2">OVER SIDE (5 - 9)</div>
            <div className="text-2xl font-bold text-[rgb(212,175,55)] mb-2">6</div>
            <div className="text-xs text-gray-500">AI ENDPOINT: 6</div>
            <div className="text-xs text-gray-400 mt-2 space-y-1">
              <div className="text-[rgb(34,197,94)]">STRONGEST: <span className="font-bold">6 (15.6%)</span></div>
              <div className="text-[rgb(239,68,68)]">WEAKEST: <span className="font-bold">8 (3.1%)</span></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div>
            <div className="text-xs text-gray-400 font-bold">DIRECTION</div>
            <div className="text-sm font-bold text-[rgb(34,197,94)]">↓ UNDER</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-bold">AI CONFIDENCE</div>
            <div className="text-sm font-bold text-[rgb(212,175,55)]">84.4%</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 font-bold">RECOMMENDATION</div>
            <div className="text-xs font-bold text-[rgb(34,197,94)] flex items-center gap-1">
              TAKE TRADE <span>✓</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
