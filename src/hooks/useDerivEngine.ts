import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { derivWsService } from '../services/derivWsService';
import {
  ConnectionMode,
  ConnectionStatus,
  DERIV_SYMBOLS,
  DerivSymbol,
  DigitStats,
  TickData,
  TradeExecutionEvent,
} from '../types';
import { calculateDigitStats } from '../utils/digitAnalysis';
import { soundFx } from '../utils/sound';

export function useDerivEngine() {
  const [selectedSymbol, setSelectedSymbol] = useState<DerivSymbol>(DERIV_SYMBOLS[0]);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('DIRECT');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [pingMs, setPingMs] = useState<number>(0);
  const [sampleWindow, setSampleWindow] = useState<number>(1000);
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [executions, setExecutions] = useState<TradeExecutionEvent[]>([]);

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

  // Handle incoming live tick
  const handleTick = useCallback((newTick: TickData) => {
    setTicks((prev) => {
      const next = [...prev, newTick];
      // Keep at most 500 ticks in buffer for faster processing
      if (next.length > 500) {
        return next.slice(next.length - 500);
      }
      return next;
    });

    soundFx.playTick();

    // Check if current tick triggers an AI Execution Step!
    if (statsRef.current) {
      const { confirmDigits, direction, confidence, underTarget, overTarget } = statsRef.current;
      const targetDigit = direction === 'UNDER' ? underTarget : overTarget;

      if (confirmDigits.includes(newTick.digit)) {
        // Trigger execution pop!
        setIsExecuting(true);
        setIsExecutedPop(true);
        setLastExecutedDirection(direction);
        setLastExecutedConfidence(confidence);
        soundFx.playExecution();

        const newExec: TradeExecutionEvent = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: newTick.epoch,
          digit: newTick.digit,
          direction,
          confidence,
          targetDigit,
          quote: newTick.quote,
        };

        setExecutions((prev) => [newExec, ...prev.slice(0, 49)]);

        setTimeout(() => {
          setIsExecuting(false);
          setIsExecutedPop(false);
        }, 400);
      } else if (newTick.digit === targetDigit) {
        soundFx.playTargetHit();
      }
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
    appId,
    serverUrl,
    saveConfig,
    subscribeToLiveTicks,
  };
}
