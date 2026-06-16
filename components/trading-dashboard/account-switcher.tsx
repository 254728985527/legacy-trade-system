'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type AccountType = 'demo' | 'real';

interface AccountSwitcherProps {
  accountType: AccountType;
  accountBalance: number;
  onAccountTypeChange: (type: AccountType) => void;
}

export function AccountSwitcher({
  accountType,
  accountBalance,
  onAccountTypeChange,
}: AccountSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isDemoAccount = accountType === 'demo';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
          isDemoAccount
            ? 'border-[rgb(255,193,7)] bg-[rgb(255,193,7)]/10'
            : 'border-emerald-500 bg-emerald-500/10'
        }`}
      >
        {/* Logo */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
            isDemoAccount ? 'bg-[rgb(255,193,7)]' : 'bg-emerald-500'
          }`}
        >
          DT
        </div>

        {/* Account Info */}
        <div className="text-left">
          <p className={`text-xs font-semibold ${isDemoAccount ? 'text-[rgb(255,193,7)]' : 'text-emerald-400'}`}>
            {isDemoAccount ? 'DEMO' : 'REAL'} Account
          </p>
          <p className="text-white font-bold text-sm">
            ${accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: isDemoAccount ? 'rgb(255,193,7)' : '#10b981' }}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[rgb(25,30,40)] border border-[rgb(255,255,255,0.1)] rounded-lg overflow-hidden z-50 shadow-lg">
          {['demo', 'real'].map((type) => {
            const isSelected = accountType === type;
            const isDemoType = type === 'demo';
            return (
              <button
                key={type}
                onClick={() => {
                  onAccountTypeChange(type as AccountType);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? isDemoType
                      ? 'bg-[rgb(255,193,7)] text-black'
                      : 'bg-emerald-500 text-white'
                    : 'hover:bg-[rgb(40,46,57)] text-white'
                }`}
              >
                <p className="font-semibold">{isDemoType ? 'DEMO' : 'REAL'} Account</p>
                <p className="text-xs opacity-75">
                  {isDemoType ? 'Practice with virtual funds' : 'Trade with real money'}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
