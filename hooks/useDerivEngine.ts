'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { derivWsService } from '@/services/derivWsService';
import {
  ConnectionMode,
  ConnectionStatus,
  DERIV_SYMBOLS,
  DerivSymbol,
  DigitStats,
  TickData,
  TradeExecutionEvent,
} from '@/types';
import { calculateDigitStats } from '@/utils/digitAnalysis';
import { soundFx } from '@/utils/sound';

export function useDerivEngine() {
  const [selectedSymbol, setSelectedSymbol] = useState<DerivSymbol>(DERIV_SYMBOLS[0]);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('DIRECT');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [pingMs, setPingMs] = useState<number>(0);
  const [sampleWindow, setSampleWindow] = useState<number>(1000);
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [executions, setExecutions] = useState<TradeExecutionEvent[]>([]);
  
  // Latency metrics
  const [latencyMetrics, setLatencyMetrics] = useState({
    current: 0,
    average: 0,
    min: 0,
    max: 0,
    p95: 0,
    ticksPerSecond: 0,
  });

  // Execution trigger animation state
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isExecutedPop, setIsExecutedPop] = useState<boolean>(false);
  const [lastExecutedDirection, setLastExecutedDirection] = useState<'UNDER' | 'OVER'>('UNDER');
  const [lastExecutedConfidence, setLastExecutedConfidence] = useState<number>(84.4);

  // App ID configuration
  const [appId, setAppId] = useState<string>('1089');
  const [serverUrl, setServerUrl] = useState<string>('ws.derivws.com');

  // Keep latest stats ref for tick event trigger checks
  const statsRef = useRef<DigitStats | null>(null);

  // Update soundFx state
  useEffect(() => {
    soundFx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Derived Digit Stats
  const digitStats = useMemo(() => {
    const stats = calculateDigitStats(ticks, sampleWindow);
    statsRef.current = stats;
    return stats;
  }, [ticks, sampleWindow]);

  // Latest tick
  const latestTick = ticks.length > 0 ? ticks[ticks.length - 1] : null;

  // Tick queue ref for batched processing
  const tickQueueRef = useRef<TickData[]>([]);
  const isProcessingRef = useRef(false);

  // Handle incoming live tick - optimized with batching and memory efficiency
  const handleTick = useCallback((newTick: TickData) => {
    // Add to batch queue instead of immediate state update
    tickQueueRef.current.push(newTick);

    // Process batches using requestAnimationFrame for smooth flow
    if (!isProcessingRef.current) {
      isProcessingRef.current = true;
      requestAnimationFrame(() => {
        if (tickQueueRef.current.length === 0) {
          isProcessingRef.current = false;
          return;
        }

        const batch = tickQueueRef.current;
        tickQueueRef.current = [];

        setTicks((prev) => {
          // Calculate new length after batch insertion
          let newTicks = prev;
          const batchLen = batch.length;
          const totalLen = newTicks.length + batchLen;

          // Maintain circular buffer with 1000 max capacity for performance
          if (totalLen > 1000) {
            const toRemove = totalLen - 1000;
            newTicks = newTicks.slice(toRemove);
          }

          return [...newTicks, ...batch];
        });

        // Process all ticks in batch for execution checks and sounds
        batch.forEach((tick) => {
          soundFx.playTick();

          // Check if tick triggers AI Execution
          if (statsRef.current) {
            const { confirmDigits, direction, confidence, underTarget, overTarget } = statsRef.current;
            const targetDigit = direction === 'UNDER' ? underTarget : overTarget;

            if (confirmDigits.includes(tick.digit)) {
              setIsExecuting(true);
              setIsExecutedPop(true);
              setLastExecutedDirection(direction);
              setLastExecutedConfidence(confidence);
              soundFx.playExecution();

              const newExec: TradeExecutionEvent = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                timestamp: tick.epoch,
                digit: tick.digit,
                direction,
                confidence,
                targetDigit,
                quote: tick.quote,
              };

              setExecutions((prev) => [newExec, ...prev.slice(0, 49)]);

              setTimeout(() => {
                setIsExecuting(false);
                setIsExecutedPop(false);
              }, 400);
            } else if (tick.digit === targetDigit) {
              soundFx.playTargetHit();
            }
          }
        });

        isProcessingRef.current = false;
      });
    }
  }, []);

  // Handle history reset
  const handleHistory = useCallback((historyList: TickData[]) => {
    setTicks(historyList);
  }, []);

  // Connect / Reconnect effect
  useEffect(() => {
    derivWsService.setCallbacks({
      onStatusChange: (status, mode) => {
        setConnectionStatus(status);
        setConnectionMode(mode);
      },
      onTick: handleTick,
      onHistory: handleHistory,
      onPingChange: (ms) => setPingMs(ms),
      onLatencyMetrics: (metrics) => {
        setLatencyMetrics(metrics);
      },
    });

    derivWsService.connect(selectedSymbol, sampleWindow);

    return () => {
      derivWsService.disconnect();
    };
  }, [selectedSymbol, sampleWindow, handleTick, handleHistory]);

  // Change Symbol Handler
  const changeSymbol = useCallback((sym: DerivSymbol) => {
    setSelectedSymbol(sym);
  }, []);

  // Change Mode Handler
  const changeMode = useCallback((mode: ConnectionMode) => {
    setConnectionMode(mode);
  }, []);

  // Change Sample Window
  const changeSampleWindow = useCallback((windowSize: number) => {
    setSampleWindow(windowSize);
  }, []);

  // Manual Live Ticks Subscription Trigger
  const subscribeToLiveTicks = useCallback(() => {
    derivWsService.subscribeToLiveTicks();
  }, []);

  // Save Config
  const saveConfig = useCallback(
    (newAppId: string, newServerUrl: string) => {
      setAppId(newAppId);
      setServerUrl(newServerUrl);
      derivWsService.setConfig(newAppId, newServerUrl);
      derivWsService.connect(selectedSymbol, sampleWindow);
    },
    [selectedSymbol, sampleWindow]
  );

  // Cursor Tracker computations
  const currentDigit = latestTick ? latestTick.digit : 0;
  const targetDigit = digitStats.direction === 'UNDER' ? digitStats.underTarget : digitStats.overTarget;
  const rawDiff = Math.abs(targetDigit - currentDigit);
  const remainingTicks = rawDiff === 0 ? 0 : rawDiff;

  return {
    selectedSymbol,
    changeSymbol,
    connectionMode,
    changeMode,
    connectionStatus,
    pingMs,
    sampleWindow,
    changeSampleWindow,
    ticks,
    latestTick,
    digitStats,
    soundEnabled,
    setSoundEnabled,
    executions,
    isExecuting,
    isExecutedPop,
    lastExecutedDirection,
    lastExecutedConfidence,
    currentDigit,
    targetDigit,
    remainingTicks,
    latencyMetrics,
    appId,
    serverUrl,
    saveConfig,
    subscribeToLiveTicks,
  };
}
