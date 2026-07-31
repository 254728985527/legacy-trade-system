'use client';
import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, TrendingDown, Activity } from 'lucide-react';

interface LatencyMonitorProps {
  latencyMs: number;
  averageLatency: number;
  p95Latency: number;
  ticksPerSecond: number;
  isConnected: boolean;
}

export const LatencyMonitor: React.FC<LatencyMonitorProps> = ({
  latencyMs,
  averageLatency,
  p95Latency,
  ticksPerSecond,
  isConnected,
}) => {
  const [latencyTrend, setLatencyTrend] = useState<'stable' | 'increasing' | 'decreasing'>('stable');
  const prevLatencyRef = useRef(latencyMs);

  useEffect(() => {
    if (latencyMs > prevLatencyRef.current + 10) {
      setLatencyTrend('increasing');
    } else if (latencyMs < prevLatencyRef.current - 10) {
      setLatencyTrend('decreasing');
    } else {
      setLatencyTrend('stable');
    }
    prevLatencyRef.current = latencyMs;
  }, [latencyMs]);

  const getLatencyColor = () => {
    if (latencyMs < 50) return 'text-green-500';
    if (latencyMs < 100) return 'text-yellow-500';
    if (latencyMs < 200) return 'text-orange-500';
    return 'text-red-500';
  };

  const getLatencyBgColor = () => {
    if (latencyMs < 50) return 'bg-green-500/10';
    if (latencyMs < 100) return 'bg-yellow-500/10';
    if (latencyMs < 200) return 'bg-orange-500/10';
    return 'bg-red-500/10';
  };

  const getTrendIcon = () => {
    if (latencyTrend === 'increasing') return '📈';
    if (latencyTrend === 'decreasing') return '📉';
    return '➡️';
  };

  return (
    <div className={`p-3 rounded-lg border transition-all duration-300 ${
      isConnected
        ? `${getLatencyBgColor()} border-[rgba(212,175,55,0.3)]`
        : 'bg-red-500/10 border-red-500/30'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity size={14} className={isConnected ? getLatencyColor() : 'text-red-500'} />
          <span className="text-xs font-bold text-gray-400 uppercase">Latency Monitor</span>
        </div>
        <span className="text-xs text-gray-500">{getTrendIcon()}</span>
      </div>

      {/* Current Latency (Large Display) */}
      <div className="mb-3">
        <div className="text-center">
          <div className={`text-2xl font-mono font-bold ${getLatencyColor()} transition-colors`}>
            {latencyMs}ms
          </div>
          <div className="text-xs text-gray-500 mt-1">Current Latency</div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-[#1a1a1a]/50 rounded p-2">
          <div className="text-xs text-gray-500">Average</div>
          <div className="text-sm font-mono font-bold text-gray-300">
            {averageLatency}ms
          </div>
        </div>
        <div className="bg-[#1a1a1a]/50 rounded p-2">
          <div className="text-xs text-gray-500">P95</div>
          <div className="text-sm font-mono font-bold text-gray-300">
            {p95Latency}ms
          </div>
        </div>
      </div>

      {/* Tick Rate */}
      <div className="bg-[#1a1a1a]/50 rounded p-2 mb-2">
        <div className="text-xs text-gray-500">Tick Flow Rate</div>
        <div className="text-sm font-mono font-bold text-[#22c55e]">
          {ticksPerSecond} ticks/sec
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 text-xs">
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-gray-400">
          {isConnected ? 'Connected & Receiving Ticks' : 'Connection Lost'}
        </span>
      </div>

      {/* Warning if high latency */}
      {latencyMs > 200 && isConnected && (
        <div className="mt-2 flex items-start gap-2 bg-red-500/20 rounded p-2">
          <AlertCircle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
          <span className="text-xs text-red-400">High latency detected. Network conditions may be degraded.</span>
        </div>
      )}
    </div>
  );
};
