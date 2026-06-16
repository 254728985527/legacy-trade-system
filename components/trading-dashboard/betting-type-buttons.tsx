'use client';

interface BettingTypeButtonsProps {
  selectedType?: string;
  onSelect?: (type: string) => void;
}

export function BettingTypeButtons({ selectedType, onSelect }: BettingTypeButtonsProps) {
  const buttons = ['OVER', 'UNDER', 'EVEN', 'ODD', 'DIFFERS'];

  return (
    <div className="w-full mb-6">
      <p className="text-[rgb(255,193,7)] text-sm font-bold mb-3">LDP</p>
      <div className="flex gap-3 flex-wrap">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => onSelect?.(btn)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
              selectedType === btn
                ? 'bg-white text-black shadow-lg scale-105'
                : 'bg-white text-black hover:shadow-md'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
