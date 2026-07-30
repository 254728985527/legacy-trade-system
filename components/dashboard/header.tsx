export function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgb(10,14,39)] border-b border-[rgb(212,175,55)] border-opacity-30 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: DIRECT Button */}
        <button className="px-4 py-2 bg-[rgb(212,175,55)] text-[rgb(10,14,39)] font-bold rounded hover:bg-opacity-90 transition">
          DIRECT
        </button>

        {/* Center: Title */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-4 text-[rgb(212,175,55)]">
            <span className="text-2xl">👑</span>
            <h1 className="text-3xl font-bold tracking-wider">LAST DIGIT PREDICTION</h1>
            <span className="text-2xl">👑</span>
          </div>
          <p className="text-sm text-[rgb(212,175,55)] opacity-75 tracking-widest">REAL-TIME AI ANALYSIS</p>
        </div>

        {/* Right: Status Indicators */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 border border-[rgb(212,175,55)] border-opacity-30 rounded text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-gray-300">LIVE / CURRENT DIGIT</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 border border-[rgb(212,175,55)] border-opacity-30 rounded text-sm">
            <span className="w-2 h-2 bg-[rgb(34,197,94)] rounded-full"></span>
            <span className="text-gray-300">HIGHEST %</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 border border-[rgb(212,175,55)] border-opacity-30 rounded text-sm">
            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
            <span className="text-gray-300">2ND HIGHEST %</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 border border-[rgb(212,175,55)] border-opacity-30 rounded text-sm">
            <span className="w-2 h-2 bg-[rgb(239,68,68)] rounded-full"></span>
            <span className="text-gray-300">LOWEST %</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-[rgb(34,197,94)] rounded text-sm bg-[rgb(34,197,94)] bg-opacity-10">
            <span className="w-2 h-2 bg-[rgb(34,197,94)] rounded-full animate-pulse"></span>
            <span className="text-[rgb(34,197,94)] font-bold">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
