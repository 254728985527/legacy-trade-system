'use client';

import { useState, useCallback } from 'react';

export interface DigitData {
  digit: number;
  timestamp: number;
  isHigh: boolean; // True if digit >= 5 (7-9), False if digit <= 4 (0-4)
}

export function useDigitHistory() {
  const [digitHistory, setDigitHistory] = useState<DigitData[]>([]);

  const addDigit = useCallback((digit: number) => {
    const newDigit: DigitData = {
      digit,
      timestamp: Date.now(),
      isHigh: digit >= 5,
    };

    setDigitHistory((prev) => {
      const updated = [...prev, newDigit];
      // Keep only last 10 digits
      return updated.slice(-10);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setDigitHistory([]);
  }, []);

  // Get digits for analysis (oldest to newest)
  const getLastNDigits = useCallback(
    (n: number = 10) => {
      return digitHistory.slice(-n);
    },
    [digitHistory]
  );

  // Count high digits (7-9) in last N digits
  const countHighDigits = useCallback(
    (digits: DigitData[]) => {
      return digits.filter((d) => d.digit >= 7).length;
    },
    []
  );

  // Count low digits (0-3) in last N digits
  const countLowDigits = useCallback(
    (digits: DigitData[]) => {
      return digits.filter((d) => d.digit <= 3).length;
    },
    []
  );

  return {
    digitHistory,
    addDigit,
    clearHistory,
    getLastNDigits,
    countHighDigits,
    countLowDigits,
  };
}
