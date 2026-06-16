'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
}

export function useCandleData() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const candleStartTime = useRef<number>(0);
  const candleData = useRef<{ open: number; high: number; low: number }>({
    open: 0,
    high: 0,
    low: 0,
  });

  // Add a tick and update current candle (60-second granularity)
  const addTick = useCallback((price: number) => {
    setCurrentPrice(price);
    const now = Date.now();
    const currentCandleStart = candleStartTime.current;

    // Initialize first candle
    if (currentCandleStart === 0) {
      candleStartTime.current = Math.floor(now / 60000) * 60000;
      candleData.current = { open: price, high: price, low: price };
      return;
    }

    // Check if we need to start a new candle (60 seconds = 60000ms)
    const candleElapsed = now - currentCandleStart;
    if (candleElapsed >= 60000) {
      // Close current candle
      const closedCandle: Candle = {
        open: candleData.current.open,
        high: candleData.current.high,
        low: candleData.current.low,
        close: price,
        timestamp: currentCandleStart,
      };

      setCandles((prev) => {
        const updated = [...prev, closedCandle];
        // Keep last 50 candles
        return updated.slice(-50);
      });

      // Start new candle
      candleStartTime.current = Math.floor(now / 60000) * 60000;
      candleData.current = { open: price, high: price, low: price };
    } else {
      // Update current candle
      candleData.current.high = Math.max(candleData.current.high, price);
      candleData.current.low = Math.min(candleData.current.low, price);
    }
  }, []);

  const getCurrentCandle = useCallback(() => {
    return {
      ...candleData.current,
      timestamp: candleStartTime.current,
    };
  }, []);

  const getLastNCandles = useCallback(
    (n: number = 3) => {
      return candles.slice(-n);
    },
    [candles]
  );

  // Check if last 3 candles are all rising (each close > previous close)
  const isLastThreeRising = useCallback(() => {
    const last3 = getLastNCandles(3);
    if (last3.length < 3) return false;
    return (
      last3[1].close > last3[0].close &&
      last3[2].close > last3[1].close
    );
  }, [getLastNCandles]);

  // Check if last 3 candles are all falling (each close < previous close)
  const isLastThreeFalling = useCallback(() => {
    const last3 = getLastNCandles(3);
    if (last3.length < 3) return false;
    return (
      last3[1].close < last3[0].close &&
      last3[2].close < last3[1].close
    );
  }, [getLastNCandles]);

  const clearCandles = useCallback(() => {
    setCandles([]);
    candleStartTime.current = 0;
    candleData.current = { open: 0, high: 0, low: 0 };
  }, []);

  return {
    candles,
    currentPrice,
    addTick,
    getCurrentCandle,
    getLastNCandles,
    isLastThreeRising,
    isLastThreeFalling,
    clearCandles,
  };
}
