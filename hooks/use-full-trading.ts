'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useDigitHistory } from './use-digit-history';
import { useCandleData } from './use-candle-data';
import { useSignalAnalysis } from './use-signal-analysis';
import type { OverAnalysisResult } from './use-signal-analysis';
import type { AccountType } from '@/components/trading-dashboard/account-switcher';

export interface FullTradingState {
  // Account
  accountType: AccountType;
  accountBalance: number;
  setAccountType: (type: AccountType) => void;

  // Trading Data
  digitHistory: any[];
  candles: any[];
  currentPrice: number;

  // Controls
  selectedContract: string;
  setSelectedContract: (contract: string) => void;
  selectedBarrier: number;
  setSelectedBarrier: (barrier: number) => void;

  // Stake & Martingale
  baseStake: number;
  setBaseStake: (stake: number) => void;
  martingaleEnabled: boolean;
  setMartingaleEnabled: (enabled: boolean) => void;
  martingaleMultiplier: number;
  setMartingaleMultiplier: (multiplier: number) => void;
  calculateNextStake: (lastWasLoss: boolean) => number;

  // Auto Trade
  autoTradeEnabled: boolean;
  setAutoTradeEnabled: (enabled: boolean) => void;

  // Signals
  lastOverSignal: OverAnalysisResult | null;
  lastUnderSignal: OverAnalysisResult | null;
  isStrongSignal: boolean;
  isGlowingSignal: boolean;

  // Trades
  trades: any[];
  addTrade: (trade: any) => void;
  clearTrades: () => void;

  // WebSocket
  isConnected: boolean;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}

export function useFullTrading(): FullTradingState {
  // Account state
  const [accountType, setAccountType] = useState<AccountType>('demo');
  const [accountBalance, setAccountBalance] = useState(10958.18);

  // Trading controls
  const [selectedContract, setSelectedContract] = useState('over-under');
  const [selectedBarrier, setSelectedBarrier] = useState(5);

  // Stake & Martingale
  const [baseStake, setBaseStake] = useState(1);
  const [martingaleEnabled, setMartingaleEnabled] = useState(false);
  const [martingaleMultiplier, setMartingaleMultiplier] = useState(2);
  const lastWasLossRef = useRef(false);

  // Auto trade
  const [autoTradeEnabled, setAutoTradeEnabled] = useState(false);

  // Signals
  const [lastOverSignal, setLastOverSignal] = useState<OverAnalysisResult | null>(null);
  const [lastUnderSignal, setLastUnderSignal] = useState<OverAnalysisResult | null>(null);
  const [isStrongSignal, setIsStrongSignal] = useState(false);
  const [isGlowingSignal, setIsGlowingSignal] = useState(false);

  // Trades
  const [trades, setTrades] = useState<any[]>([]);

  // WebSocket
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Use our data hooks
  const digitHistory = useDigitHistory();
  const candleData = useCandleData();
  const { analyzeOver, analyzeUnder } = useSignalAnalysis();

  // Calculate next stake with martingale
  const calculateNextStake = useCallback(
    (lastWasLoss: boolean) => {
      if (!martingaleEnabled) return baseStake;
      if (lastWasLoss) {
        return baseStake * martingaleMultiplier;
      } else {
        return baseStake; // Reset on win
      }
    },
    [baseStake, martingaleEnabled, martingaleMultiplier]
  );

  // Connect to Deriv WebSocket
  const connectWebSocket = useCallback(() => {
    // This would connect to: wss://ws.derivws.com/websockets/v3
    // For now, mock implementation
    console.log('[v0] WebSocket connecting...');
    setIsConnected(true);

    // Simulate incoming ticks
    const tickInterval = setInterval(() => {
      const mockPrice = 94500 + Math.random() * 100;
      const lastDigit = Math.floor(mockPrice * 100) % 10;

      candleData.addTick(mockPrice);
      digitHistory.addDigit(lastDigit);

      // Analyze signals every 10 ticks
      if (digitHistory.digitHistory.length >= 10) {
        const overResult = analyzeOver(digitHistory.digitHistory);
        const underResult = analyzeUnder(digitHistory.digitHistory);

        if (overResult?.allPassed) {
          setLastOverSignal(overResult);
          setIsStrongSignal(true);
          setIsGlowingSignal(true);
        }
        if (underResult?.allPassed) {
          setLastUnderSignal(underResult);
          setIsStrongSignal(true);
          setIsGlowingSignal(true);
        }
      }
    }, 1000);

    return () => clearInterval(tickInterval);
  }, [candleData, digitHistory, analyzeOver, analyzeUnder]);

  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnected(false);
  }, []);

  // Add trade record
  const addTrade = useCallback((trade: any) => {
    setTrades((prev) => [...prev, trade]);
    // Update balance
    setAccountBalance((prev) => prev + trade.pnl);
  }, []);

  // Clear trades
  const clearTrades = useCallback(() => {
    setTrades([]);
  }, []);

  return {
    // Account
    accountType,
    accountBalance,
    setAccountType,

    // Trading Data
    digitHistory: digitHistory.digitHistory,
    candles: candleData.candles,
    currentPrice: candleData.currentPrice,

    // Controls
    selectedContract,
    setSelectedContract,
    selectedBarrier,
    setSelectedBarrier,

    // Stake & Martingale
    baseStake,
    setBaseStake,
    martingaleEnabled,
    setMartingaleEnabled,
    martingaleMultiplier,
    setMartingaleMultiplier,
    calculateNextStake,

    // Auto Trade
    autoTradeEnabled,
    setAutoTradeEnabled,

    // Signals
    lastOverSignal,
    lastUnderSignal,
    isStrongSignal,
    isGlowingSignal,

    // Trades
    trades,
    addTrade,
    clearTrades,

    // WebSocket
    isConnected,
    connectWebSocket,
    disconnectWebSocket,
  };
}
