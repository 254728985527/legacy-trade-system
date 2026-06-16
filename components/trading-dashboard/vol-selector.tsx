'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface VolatilityIndex {
  id: string;
  label: string;
  category: 'volatility' | '1s' | 'jump';
  price?: number;
}

const INDICES: VolatilityIndex[] = [
  // Volatility Indices
  { id: 'volatility-10', label: 'Volatility 10', category: 'volatility' },
  { id: 'volatility-25', label: 'Volatility 25', category: 'volatility' },
  { id: 'volatility-50', label: 'Volatility 50', category: 'volatility' },
  { id: 'volatility-75', label: 'Volatility 75', category: 'volatility' },
  { id: 'volatility-100', label: 'Volatility 100', category: 'volatility' },
  // 1s Indices
  { id: '1s-10', label: '1s 10 Index', category: '1s' },
  { id: '1s-25', label: '1s 25 Index', category: '1s' },
  { id: '1s-50', label: '1s 50 Index', category: '1s' },
  { id: '1s-75', label: '1s 75 Index', category: '1s' },
  { id: '1s-100', label: '1s 100 Index', category: '1s' },
  // Jump Indices
  { id: 'jump-10', label: 'Jump 10 Index', category: 'jump' },
  { id: 'jump-25', label: 'Jump 25 Index', category: 'jump' },
  { id: 'jump-50', label: 'Jump 50 Index', category: 'jump' },
  { id: 'jump-75', label: 'Jump 75 Index', category: 'jump' },
  { id: 'jump-100', label: 'Jump 100 Index', category: 'jump' },
];

interface VolSelectorProps {
  selectedId: string;
  selectedPrice: number;
  onSelectionChange: (id: string, label: string) => void;
}

export function VolSelector({ selectedId, selectedPrice, onSelectionChange }: VolSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = INDICES.find((idx) => idx.id === selectedId);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'volatility':
        return 'Volatility Indices';
      case '1s':
        return '1s Indices';
      case 'jump':
        return 'Jump Indices';
      default:
        return category;
    }
  };

  const groupedIndices = INDICES.reduce(
    (acc, idx) => {
      const category = idx.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(idx);
      return acc;
    },
    {} as Record<string, VolatilityIndex[]>
  );

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-[rgb(40,46,57)] rounded-lg border border-[rgb(255,255,255,0.08)] hover:border-[rgb(255,193,7,0.3)] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[rgb(0,255,136)] rounded-full flex items-center justify-center text-[rgb(20,24,31)] text-xs font-bold">10</div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">{selectedIndex?.label || 'Select Index'}</p>
            <p className="text-gray-400 text-xs">Live Price</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-white font-bold text-lg">{selectedPrice.toFixed(2)}</p>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-[rgb(25,30,40)] rounded-lg border border-[rgb(255,193,7,0.2)] shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedIndices).map(([category, indices]) => (
              <div key={category}>
                <div className="px-4 py-2 bg-[rgb(30,36,47)] border-b border-[rgb(255,255,255,0.08)] sticky top-0">
                  <p className="text-[rgb(255,193,7)] text-xs font-bold uppercase">{getCategoryLabel(category)}</p>
                </div>
                {indices.map((idx) => (
                  <button
                    key={idx.id}
                    onClick={() => {
                      onSelectionChange(idx.id, idx.label);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[rgb(40,46,57)] transition-colors ${
                      selectedId === idx.id ? 'bg-[rgb(255,193,7,0.1)] border-l-2 border-[rgb(255,193,7)]' : 'border-l-2 border-transparent'
                    }`}
                  >
                    <p className={`font-semibold ${selectedId === idx.id ? 'text-[rgb(255,193,7)]' : 'text-white'}`}>
                      {idx.label}
                    </p>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
