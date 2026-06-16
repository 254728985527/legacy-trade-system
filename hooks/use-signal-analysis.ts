'use client';

import { useCallback } from 'react';
import type { DigitData } from './use-digit-history';

export interface SectionAnalysis {
  digits: number[];
  highCount: number;
  percentage: number;
  weight: number;
  weighted: number;
  passed: boolean;
}

export interface OverAnalysisResult {
  section1: SectionAnalysis;
  section2: SectionAnalysis;
  section3: SectionAnalysis;
  allPassed: boolean;
  recommendation: string; // 'TRADE OVER 7', 'TRADE OVER 4', etc.
  confidence: number; // 0-100
}

export function useSignalAnalysis() {
  // Analyze 3-section OVER: split 10 digits into [3, 3, 4], check [≥7, ≥4, ≥3], weight [1, 2, 3]
  const analyzeOver = useCallback(
    (digitHistory: DigitData[]): OverAnalysisResult | null => {
      if (digitHistory.length < 10) {
        return null;
      }

      const digits = digitHistory.slice(-10).map((d) => d.digit);

      // Split into 3 sections
      const section1Digits = digits.slice(0, 3); // [0, 1, 2]
      const section2Digits = digits.slice(3, 6); // [3, 4, 5]
      const section3Digits = digits.slice(6, 10); // [6, 7, 8, 9]

      // Helper to count digits >= threshold
      const countAboveThreshold = (arr: number[], threshold: number) => {
        return arr.filter((d) => d >= threshold).length;
      };

      // Section 1: check if 3/3 digits >= 7
      const section1High = countAboveThreshold(section1Digits, 7);
      const section1Passed = section1High >= 3;
      const section1Data: SectionAnalysis = {
        digits: section1Digits,
        highCount: section1High,
        percentage: (section1High / 3) * 100,
        weight: 1,
        weighted: section1Passed ? 1 : 0,
        passed: section1Passed,
      };

      // Section 2: check if 3/3 digits >= 4
      const section2High = countAboveThreshold(section2Digits, 4);
      const section2Passed = section2High >= 3;
      const section2Data: SectionAnalysis = {
        digits: section2Digits,
        highCount: section2High,
        percentage: (section2High / 3) * 100,
        weight: 2,
        weighted: section2Passed ? 2 : 0,
        passed: section2Passed,
      };

      // Section 3: check if 3/4 digits >= 3
      const section3High = countAboveThreshold(section3Digits, 3);
      const section3Passed = section3High >= 3;
      const section3Data: SectionAnalysis = {
        digits: section3Digits,
        highCount: section3High,
        percentage: (section3High / 4) * 100,
        weight: 3,
        weighted: section3Passed ? 3 : 0,
        passed: section3Passed,
      };

      const allPassed =
        section1Passed && section2Passed && section3Passed;

      // Determine recommendation based on which sections passed
      let recommendation = '';
      let confidence = 0;

      if (allPassed) {
        // All sections agree on OVER
        confidence = 100;
        // Determine which OVER level based on strongest section
        if (section3High >= 3) recommendation = 'TRADE OVER 3';
        if (section2High === 3) recommendation = 'TRADE OVER 4';
        if (section1High === 3) recommendation = 'TRADE OVER 7';
      }

      return {
        section1: section1Data,
        section2: section2Data,
        section3: section3Data,
        allPassed,
        recommendation,
        confidence,
      };
    },
    []
  );

  // Analyze UNDER: check for low digits (0-3)
  const analyzeUnder = useCallback(
    (digitHistory: DigitData[]): OverAnalysisResult | null => {
      if (digitHistory.length < 10) {
        return null;
      }

      const digits = digitHistory.slice(-10).map((d) => d.digit);

      const section1Digits = digits.slice(0, 3);
      const section2Digits = digits.slice(3, 6);
      const section3Digits = digits.slice(6, 10);

      // Helper to count digits <= threshold
      const countBelowThreshold = (arr: number[], threshold: number) => {
        return arr.filter((d) => d <= threshold).length;
      };

      // Section 1: check if 3/3 digits <= 3
      const section1Low = countBelowThreshold(section1Digits, 3);
      const section1Passed = section1Low >= 3;

      // Section 2: check if 3/3 digits <= 6
      const section2Low = countBelowThreshold(section2Digits, 6);
      const section2Passed = section2Low >= 3;

      // Section 3: check if 3/4 digits <= 7
      const section3Low = countBelowThreshold(section3Digits, 7);
      const section3Passed = section3Low >= 3;

      const section1Data: SectionAnalysis = {
        digits: section1Digits,
        highCount: section1Low,
        percentage: (section1Low / 3) * 100,
        weight: 1,
        weighted: section1Passed ? 1 : 0,
        passed: section1Passed,
      };

      const section2Data: SectionAnalysis = {
        digits: section2Digits,
        highCount: section2Low,
        percentage: (section2Low / 3) * 100,
        weight: 2,
        weighted: section2Passed ? 2 : 0,
        passed: section2Passed,
      };

      const section3Data: SectionAnalysis = {
        digits: section3Digits,
        highCount: section3Low,
        percentage: (section3Low / 4) * 100,
        weight: 3,
        weighted: section3Passed ? 3 : 0,
        passed: section3Passed,
      };

      const allPassed =
        section1Passed && section2Passed && section3Passed;

      let recommendation = '';
      let confidence = 0;

      if (allPassed) {
        confidence = 100;
        if (section3Low >= 3) recommendation = 'TRADE UNDER 7';
        if (section2Low === 3) recommendation = 'TRADE UNDER 6';
        if (section1Low === 3) recommendation = 'TRADE UNDER 3';
      }

      return {
        section1: section1Data,
        section2: section2Data,
        section3: section3Data,
        allPassed,
        recommendation,
        confidence,
      };
    },
    []
  );

  return { analyzeOver, analyzeUnder };
}
