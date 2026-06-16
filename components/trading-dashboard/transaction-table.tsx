'use client';

export function TransactionHistoryTable() {
  const rows = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="w-full mb-6">
      <p className="text-[rgb(255,193,7)] text-sm font-bold mb-4">TRANSACTION HISTORY</p>
      <div className="bg-[rgb(20,24,31)] rounded border border-[rgb(255,255,255,0.08)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgb(255,152,0)]">
              <th className="px-4 py-3 text-left text-[rgb(255,152,0)] font-semibold">CONT TYPE</th>
              <th className="px-4 py-3 text-left text-[rgb(255,152,0)] font-semibold">VOLAT</th>
              <th className="px-4 py-3 text-left text-[rgb(255,152,0)] font-semibold">ENTRY</th>
              <th className="px-4 py-3 text-left text-[rgb(255,152,0)] font-semibold">EXIT</th>
              <th className="px-4 py-3 text-left text-[rgb(255,152,0)] font-semibold">STAKE</th>
              <th className="px-4 py-3 text-left text-[rgb(255,152,0)] font-semibold">P / L</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="border-b border-[rgb(255,255,255,0.05)] hover:bg-[rgb(30,36,47)] transition-colors">
                <td className="px-4 py-3 text-gray-400">{row}</td>
                <td className="px-4 py-3 text-gray-400">-</td>
                <td className="px-4 py-3 text-gray-400">-</td>
                <td className="px-4 py-3 text-gray-400">-</td>
                <td className="px-4 py-3 text-gray-400">-</td>
                <td className="px-4 py-3 text-gray-400">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
