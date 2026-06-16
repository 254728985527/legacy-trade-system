'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type ContractType = 'over-under' | 'matches-differs' | 'even-odd' | 'rise-fall';

interface ContractControlsProps {
  selectedContract: ContractType;
  onContractChange: (type: ContractType) => void;
  selectedBarrier: number;
  onBarrierChange: (barrier: number) => void;
}

const CONTRACTS: Array<{
  type: ContractType;
  label: string;
  options: string[];
  color: string;
}> = [
  {
    type: 'over-under',
    label: 'OVER / UNDER',
    options: ['OVER', 'UNDER'],
    color: 'bg-blue-600',
  },
  {
    type: 'matches-differs',
    label: 'MATCHES / DIFFERS',
    options: ['MATCHES', 'DIFFERS'],
    color: 'bg-purple-600',
  },
  {
    type: 'even-odd',
    label: 'EVEN / ODD',
    options: ['EVEN', 'ODD'],
    color: 'bg-orange-600',
  },
  {
    type: 'rise-fall',
    label: 'RISE / FALL',
    options: ['RISE', 'FALL'],
    color: 'bg-teal-600',
  },
];

export function ContractControls({
  selectedContract,
  onContractChange,
  selectedBarrier,
  onBarrierChange,
}: ContractControlsProps) {
  const [expandedContract, setExpandedContract] = useState<ContractType | null>(
    selectedContract
  );
  const [showTypes, setShowTypes] = useState(true);

  const currentContract = CONTRACTS.find((c) => c.type === selectedContract);

  return (
    <div className="w-full bg-gradient-to-b from-[rgb(30,36,47)] to-[rgb(20,24,31)] rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[rgb(255,193,7)] text-sm font-bold">CONTRACT TYPE</p>
        <button
          onClick={() => setShowTypes(!showTypes)}
          className="text-xs font-semibold px-3 py-1 rounded bg-[rgb(40,46,57)] hover:bg-[rgb(50,56,67)] text-gray-300 transition-all"
        >
          {showTypes ? '▲ Hide' : '▼ Show'}
        </button>
      </div>

      {/* Selected Contract Display */}
      {currentContract && (
        <div className={`mb-4 p-3 bg-black/40 rounded-lg border-2 ${currentContract.color.replace('bg-', 'border-')} border-opacity-50`}>
          <p className="text-gray-400 text-xs mb-1">SELECTED TRADE:</p>
          <p className="text-white font-bold text-lg">
            {currentContract.label} @ Barrier {selectedBarrier}
          </p>
        </div>
      )}

      {/* Contract Types List */}
      {showTypes && (
      <div className="space-y-2">
        {CONTRACTS.map((contract) => (
          <div key={contract.type}>
            <button
              onClick={() =>
                setExpandedContract(
                  expandedContract === contract.type ? null : contract.type
                )
              }
              className={`w-full px-4 py-3 rounded-lg font-semibold flex items-center justify-between transition-all ${
                selectedContract === contract.type
                  ? `${contract.color} text-white shadow-lg scale-105`
                  : 'bg-[rgb(40,46,57)] text-gray-300 hover:bg-[rgb(50,56,67)]'
              }`}
            >
              <span>{contract.label}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  expandedContract === contract.type ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Barrier Panel - Separate for Each Contract Type */}
            {expandedContract === contract.type && (
              <div className={`rounded-lg p-4 mt-2 animate-in fade-in slide-in-from-top-2 border-l-4 ${
                contract.color.replace('bg-', 'border-')
              } bg-[rgb(25,30,40)]`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400 text-xs font-semibold uppercase">
                    Barrier for {contract.label}
                  </p>
                  <p className="text-[rgb(255,193,7)] text-xs font-bold">
                    Current: {selectedBarrier}
                  </p>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }, (_, i) => i).map((digit) => (
                    <button
                      key={digit}
                      onClick={() => onBarrierChange(digit)}
                      className={`py-2 rounded font-bold transition-all text-sm ${
                        selectedBarrier === digit
                          ? 'bg-[rgb(255,193,7)] text-black shadow-lg scale-110'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {digit}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
