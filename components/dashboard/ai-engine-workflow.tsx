export function AIEngineWorkflow() {
  return (
    <div className="p-6 border border-[rgb(212,175,55)] border-opacity-40 rounded-lg bg-[rgb(15,20,45)] mb-6">
      <div className="flex items-center gap-2 text-[rgb(34,197,94)] text-lg font-bold tracking-wider mb-6">
        <span>🧠</span>
        AI ENGINE UNDER (0 - 4)
      </div>
      <p className="text-xs text-gray-400 mb-6">AI ENDPOINT TO EXECUTION WORKFLOW</p>

      {/* Workflow Steps */}
      <div className="flex items-stretch gap-2 mb-8">
        {/* Step 1 */}
        <div className="flex-1 p-4 border border-[rgb(34,197,94)] border-opacity-40 rounded bg-[rgb(34,197,94)] bg-opacity-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[rgb(34,197,94)] flex items-center justify-center font-bold text-white text-sm">
              1
            </div>
            <span className="text-xs font-bold text-[rgb(34,197,94)] uppercase">AI ENDPOINT</span>
          </div>
          <p className="text-xs text-gray-300">AI recommends TRADE UNDER (0 - 4)</p>
          <div className="text-xs text-gray-400 mt-3 font-bold">ENTRY POINT: 4</div>
        </div>

        <div className="flex items-center justify-center text-[rgb(34,197,94)] font-bold text-xl">→</div>

        {/* Step 2 */}
        <div className="flex-1 p-4 border border-[rgb(34,197,94)] border-opacity-40 rounded bg-[rgb(34,197,94)] bg-opacity-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[rgb(34,197,94)] flex items-center justify-center font-bold text-white text-sm">
              2
            </div>
            <span className="text-xs font-bold text-[rgb(34,197,94)] uppercase">CURSOR TOUCHING</span>
          </div>
          <p className="text-xs text-gray-300">Live cursor reaches the entry digit</p>
          <div className="flex gap-2 mt-3">
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">0</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">1</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">2</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">3</span>
            <span className="text-xs bg-[rgb(34,197,94)] bg-opacity-50 px-2 py-1 rounded font-bold text-[rgb(34,197,94)]">4</span>
          </div>
          <div className="text-xs text-gray-400 mt-2 font-bold uppercase">Live Cursor</div>
        </div>

        <div className="flex items-center justify-center text-[rgb(34,197,94)] font-bold text-xl">→</div>

        {/* Step 3 */}
        <div className="flex-1 p-4 border border-[rgb(34,197,94)] border-opacity-40 rounded bg-[rgb(34,197,94)] bg-opacity-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[rgb(34,197,94)] flex items-center justify-center font-bold text-white text-sm">
              3
            </div>
            <span className="text-xs font-bold text-[rgb(34,197,94)] uppercase">CONFIRMATION DIGIT CHECK</span>
          </div>
          <p className="text-xs text-gray-300">Engine checks next tick for confirmation (0 - 4)</p>
          <div className="flex gap-2 mt-3">
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">0</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">1</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">2</span>
            <span className="text-xs bg-[rgb(34,197,94)] bg-opacity-50 px-2 py-1 rounded font-bold text-[rgb(34,197,94)]">3</span>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">4</span>
          </div>
          <div className="text-xs text-gray-400 mt-2 font-bold uppercase">Next Tick (Confirmation)</div>
        </div>

        <div className="flex items-center justify-center text-[rgb(34,197,94)] font-bold text-xl">→</div>

        {/* Step 4 */}
        <div className="flex-1 p-4 border border-[rgb(34,197,94)] border-opacity-40 rounded bg-[rgb(34,197,94)] bg-opacity-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[rgb(34,197,94)] flex items-center justify-center font-bold text-white text-sm">
              4
            </div>
            <span className="text-xs font-bold text-[rgb(34,197,94)] uppercase">EXECUTION POINT</span>
          </div>
          <p className="text-xs text-gray-300">All conditions met. Execute trade...</p>
        </div>

        <div className="flex items-center justify-center text-[rgb(34,197,94)] font-bold text-xl">→</div>

        {/* Step 5 */}
        <div className="flex-1 p-4 border border-[rgb(34,197,94)] border-opacity-40 rounded bg-[rgb(34,197,94)] bg-opacity-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[rgb(34,197,94)] flex items-center justify-center font-bold text-white text-sm">
              5
            </div>
            <span className="text-xs font-bold text-[rgb(34,197,94)] uppercase">TRADE EXECUTED</span>
          </div>
          <p className="text-xs text-gray-300">UNDER trade placed successfully</p>
        </div>
      </div>

      {/* Status Footer */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📊</div>
          <div>
            <div className="text-xs text-gray-400 font-bold">STATUS</div>
            <div className="flex items-center gap-1 text-[rgb(34,197,94)] font-bold text-sm">
              TOUCHED <span>✓</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎯</div>
          <div>
            <div className="text-xs text-gray-400 font-bold">CONFIDENCE</div>
            <div className="text-[rgb(212,175,55)] font-bold text-sm">84.4%</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-2xl">✓</div>
          <div>
            <div className="text-xs text-gray-400 font-bold">CONFIRMATION RESULT</div>
            <div className="flex items-center gap-1 text-[rgb(34,197,94)] font-bold text-sm">
              VALID <span>✓</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div>
          <div className="text-xs text-gray-400 font-bold">TRADE STATUS</div>
          <div className="text-[rgb(212,175,55)] font-bold text-sm">EXECUTING</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 font-bold">DIRECTION</div>
          <div className="text-[rgb(34,197,94)] font-bold text-sm">↓ UNDER</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 font-bold">RECOMMENDATION</div>
          <div className="flex items-center gap-1 text-[rgb(34,197,94)] font-bold text-sm">
            TAKE TRADE <span>✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
