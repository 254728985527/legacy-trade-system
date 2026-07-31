'use client';

import React, { useMemo, memo } from 'react';
import { TickData } from '@/types';
import { Activity, Zap, TrendingUp } from 'lucide-react';

interface TickFlowMetricsProps {
  ticks: TickData[];
  isConnected: boolean;
}

export const TickFlowMetrics = memo(function TickFlowMetrics({ ticks, isConnected }: TickFlowMetricsProps) {
  // Calculate flow metrics efficiently
  const metrics = useMemo(() => {
    if (ticks.length < 2) {
      return {
        ticksPerSecond: 0,
        avgLatencyMs: 0,
        bufferHealth: 0,
        smoothness: 100,
      };
    }

    const oldestTick = ticks[0];
    const newestTick = ticks[ticks.length - 1];
    const timeSpanSecs = newestTick.epoch - oldestTick.epoch;
    
    // Calculate ticks per second
    const ticksPerSecond = timeSpanSecs > 0 
      ? Math.round((ticks.length / timeSpanSecs) * 100) / 100
      : 0;

    // Calculate average latency
    const avgLatencyMs = Math.round(
      ticks.reduce((sum, t) => sum + (t.latencyMs || 0), 0) / ticks.length
    );

    // Buffer health: % of max capacity (1000 ticks)
    const bufferHealth = Math.round((ticks.length / 1000) * 100);

    // Smoothness score based on consistency of tick intervals
    let smoothness = 100;
    if (ticks.length > 5) {
      const intervals: number[] = [];
      for (let i = ticks.length - 5; i < ticks.length - 1; i++) {
        if (i >= 0) {
          intervals.push(ticks[i + 1].epoch - ticks[i].epoch);
        }
      }
      
      if (intervals.length > 0) {
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, interval) => {
          return sum + Math.pow(interval - avgInterval, 2);
        }, 0) / intervals.length;
        
        const stdDev = Math.sqrt(variance);
        // Smoothness decreases with higher variance (max deviation 0.5s = 50% smoothness penalty)
        smoothness = Math.max(40, Math.round(100 - (stdDev * 100)));
      }
    }

    return {
      ticksPerSecond,
      avgLatencyMs,
      bufferHealth,
      smoothness,
    };
  }, [ticks.length]);

  const getHealthColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIndicator = () => {
    if (!isConnected) return { icon: '⭕', color: 'text-red-500', text: 'DISCONNECTED' };
    if (metrics.smoothness < 60) return { icon: '⚠️', color: 'text-yellow-500', text: 'UNSTABLE' };
    if (metrics.ticksPerSecond < 0.5) return { icon: '🐢', color: 'text-yellow-500', text: 'SLOW' };
    return { icon: '✅', color: 'text-green-500', text: 'HEALTHY' };
  };

  const status = getStatusIndicator();

  return (
    <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.2)] rounded-lg p-3 space-y-3">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-lg ${status.color}`}>{status.icon}</span>
          <span className="text-xs font-mono font-bold text-gray-300">TICK FLOW MONITOR</span>
        </div>
        <span className={`text-xs font-mono font-bold ${status.color}`}>{status.text}</span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Flow Rate */}
        <div className="bg-[#111] rounded border border-gray-800 p-2">
          <div className="flex items-center gap-1 mb-1">
            <Zap size={12} className="text-[#F4CB4B]" />
            <span className="text-[10px] text-gray-400">FLOW RATE</span>
          </div>
          <div className={`text-sm font-mono font-bold ${getHealthColor(metrics.ticksPerSecond * 20)}`}>
            {metrics.ticksPerSecond.toFixed(2)} Hz
          </div>
        </div>

        {/* Buffer Health */}
        <div className="bg-[#111] rounded border border-gray-800 p-2">
          <div className="flex items-center gap-1 mb-1">
            <Activity size={12} className="text-[#22c55e]" />
            <span className="text-[10px] text-gray-400">BUFFER</span>
          </div>
          <div className={`text-sm font-mono font-bold ${getHealthColor(metrics.bufferHealth)}`}>
            {metrics.bufferHealth}%
          </div>
        </div>

        {/* Latency */}
        <div className="bg-[#111] rounded border border-gray-800 p-2">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp size={12} className="text-blue-400" />
            <span className="text-[10px] text-gray-400">LATENCY</span>
          </div>
          <div className="text-sm font-mono font-bold text-blue-400">
            {metrics.avgLatencyMs}ms
          </div>
        </div>

        {/* Smoothness */}
        <div className="bg-[#111] rounded border border-gray-800 p-2">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] text-gray-400">SMOOTH</span>
          </div>
          <div className={`text-sm font-mono font-bold ${getHealthColor(metrics.smoothness)}`}>
            {metrics.smoothness}%
          </div>
        </div>
      </div>

      {/* Health Bar */}
      <div className="space-y-1">
        <div className="text-[10px] text-gray-400">OVERALL HEALTH</div>
        <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden border border-gray-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              metrics.smoothness >= 80 
                ? 'bg-green-500'
                : metrics.smoothness >= 60
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${metrics.smoothness}%` }}
          />
        </div>
      </div>
    </div>
  );
});
