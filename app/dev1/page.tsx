'use client';

import React, { useState } from 'react';
import { useDerivEngine } from '@/hooks/useDerivEngine';
import { Header } from '@/components/Header';
import { IncomingTickRing } from '@/components/IncomingTickRing';
import { TickVisualization } from '@/components/TickVisualization';
import { LiveDataStream } from '@/components/LiveDataStream';
import { TickStreamTable } from '@/components/TickStreamTable';
import { DigitRangeCards } from '@/components/DigitRangeCards';
import { KeyDigitsCard } from '@/components/KeyDigitsCard';
import { SignalCard } from '@/components/SignalCard';
import { AiWorkflowSteps } from '@/components/AiWorkflowSteps';
import { SettingsModal } from '@/components/SettingsModal';
import { FooterNav } from '@/components/FooterNav';
import { VolatilityCard } from '@/components/VolatilityCard';
import { LivePriceCard } from '@/components/LivePriceCard';
import { ContinuousTickFeed } from '@/components/ContinuousTickFeed';
import { Zap, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Dev1Page() {
  const {
    selectedSymbol,
    changeSymbol,
    connectionStatus,
    sampleWindow,
    changeSampleWindow,
    ticks,
    latestTick,
    digitStats,
    soundEnabled,
    setSoundEnabled,
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
  } = useDerivEngine();

  const [showSettings, setShowSettings] = useState(false);
  const [focusMode, setFocusMode] = useState<'overview' | 'ticks' | 'stream'>('ticks');

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header
        selectedSymbol={selectedSymbol}
        onSymbolChange={changeSymbol}
        connectionStatus={connectionStatus}
        soundEnabled={soundEnabled}
        onSoundToggle={setSoundEnabled}
        onSettingsClick={() => setShowSettings(true)}
      />

      {/* Navigation and Header */}
      <div className="sticky top-16 z-40 bg-[#0a0a0a] border-b border-[rgba(212,175,55,0.1)]">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#F4CB4B] hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Back to Main Dashboard
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-[#22c55e]' : 'bg-red-500'
                  }`}
                />
                {connectionStatus === 'connected' ? 'LIVE' : 'OFFLINE'}
              </div>
              
              <div className="text-xs text-gray-400">
                Symbol: <span className="text-[#F4CB4B]">{selectedSymbol.symbol}</span>
              </div>

              <div className="text-xs text-gray-400">
                Total Ticks: <span className="text-[#F4CB4B]">{ticks.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 py-6 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-3 border-b border-[rgba(212,175,55,0.1)] pb-4">
          <button
            onClick={() => setFocusMode('ticks')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              focusMode === 'ticks'
                ? 'bg-[#F4CB4B] text-[#050505]'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[rgba(212,175,55,0.2)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap size={16} />
              INCOMING TICKS (Main)
            </div>
          </button>

          <button
            onClick={() => setFocusMode('stream')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              focusMode === 'stream'
                ? 'bg-[#F4CB4B] text-[#050505]'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[rgba(212,175,55,0.2)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Eye size={16} />
              LIVE STREAM
            </div>
          </button>

          <button
            onClick={() => setFocusMode('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              focusMode === 'overview'
                ? 'bg-[#F4CB4B] text-[#050505]'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[rgba(212,175,55,0.2)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Eye size={16} />
              ANALYSIS
            </div>
          </button>
        </div>

        {/* INCOMING TICKS - MAIN FOCUS */}
        {focusMode === 'ticks' && (
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#F4CB4B]">Continuous Live Tick Flow</h2>
              <p className="text-sm text-gray-400">
                Real-time incoming ticks with zero lag - animated grid showing last 50 ticks
              </p>
            </div>

            {/* Tick Visualization - Full Width */}
            <div className="bg-[#0a0a0a] rounded-xl border border-[rgba(212,175,55,0.2)] p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#F4CB4B]">Last 50 Incoming Ticks</h3>
                <p className="text-xs text-gray-500 mt-1">Grid updates instantly with each new tick - hover to see full details</p>
              </div>
              <TickVisualization ticks={ticks} isConnected={connectionStatus === 'connected'} />
            </div>

            {/* Live Monitor & Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT: Live Tick Monitor */}
              <div className="space-y-4">
                <div className="bg-[#0a0a0a] border-2 border-[#F4CB4B] rounded-xl p-6 shadow-[0_0_30px_rgba(244,203,75,0.2)]">
                  <div className="text-[#F4CB4B] text-lg font-bold mb-4 uppercase tracking-widest">
                    LIVE TICK MONITOR
                  </div>
                  <IncomingTickRing
                    latestTick={latestTick}
                    totalCollected={digitStats.totalTicks}
                    sampleWindow={sampleWindow}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <VolatilityCard
                    selectedSymbol={selectedSymbol}
                    onSymbolChange={changeSymbol}
                    latestTick={latestTick}
                  />
                  <LivePriceCard
                    selectedSymbol={selectedSymbol}
                    latestTick={latestTick}
                    onSubscribeLiveTicks={() => {}}
                  />
                </div>
              </div>

              {/* CENTER: Digit Distribution */}
              <div className="space-y-4">
                <div className="bg-[#0a0a0a] rounded-xl border border-[rgba(212,175,55,0.2)] p-6">
                  <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wide">
                    Digit Distribution (0-9)
                  </h3>
                  <DigitRangeCards digitStats={digitStats} currentDigit={currentDigit} />
                </div>
              </div>

              {/* RIGHT: Signals & Recommendations */}
              <div className="space-y-4">
                <div className="bg-[#0a0a0a] rounded-xl border border-[rgba(212,175,55,0.2)] p-6">
                  <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wide">
                    AI Trade Signals
                  </h3>
                  <div className="space-y-3">
                    <KeyDigitsCard digitStats={digitStats} />
                    <SignalCard digitStats={digitStats} />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Workflow */}
            <div className="bg-[#0a0a0a] rounded-xl border border-[rgba(212,175,55,0.2)] p-6">
              <AiWorkflowSteps
                digitStats={digitStats}
                currentDigit={currentDigit}
                isExecuting={isExecuting}
                isExecutedPop={isExecutedPop}
                lastExecutedDirection={lastExecutedDirection}
                lastExecutedConfidence={lastExecutedConfidence}
              />
            </div>
          </div>
        )}

        {/* LIVE STREAM */}
        {focusMode === 'stream' && (
          <div className="space-y-6">
            <div className="space-y-2 mb-4">
              <h2 className="text-2xl font-bold text-[#F4CB4B]">Live Data Stream</h2>
              <p className="text-sm text-gray-400">Real-time price and tick rate monitoring</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LiveDataStream ticks={ticks} isConnected={connectionStatus === 'connected'} />
              <ContinuousTickFeed ticks={ticks} isConnected={connectionStatus === 'connected'} />
            </div>

            <div className="bg-[#0a0a0a] rounded-xl border border-[rgba(212,175,55,0.2)] p-6">
              <h3 className="text-lg font-bold text-[#F4CB4B] mb-4">Tick Stream Table</h3>
              <TickStreamTable ticks={ticks} />
            </div>
          </div>
        )}

        {/* ANALYSIS */}
        {focusMode === 'overview' && (
          <div className="space-y-6">
            <div className="space-y-2 mb-4">
              <h2 className="text-2xl font-bold text-[#F4CB4B]">Complete Analysis</h2>
              <p className="text-sm text-gray-400">Full digit distribution, trends, and AI recommendations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0a0a0a] rounded-xl border border-[rgba(212,175,55,0.2)] p-6">
                <DigitRangeCards digitStats={digitStats} currentDigit={currentDigit} />
              </div>

              <div className="bg-[#0a0a0a] rounded-xl border border-[rgba(212,175,55,0.2)] p-6">
                <SignalCard digitStats={digitStats} />
              </div>
            </div>

            <div className="bg-[#0a0a0a] rounded-xl border border-[rgba(212,175,55,0.2)] p-6">
              <AiWorkflowSteps
                digitStats={digitStats}
                currentDigit={currentDigit}
                isExecuting={isExecuting}
                isExecutedPop={isExecutedPop}
                lastExecutedDirection={lastExecutedDirection}
                lastExecutedConfidence={lastExecutedConfidence}
              />
            </div>
          </div>
        )}
      </main>

      <FooterNav />

      {showSettings && (
        <SettingsModal
          appId={appId}
          serverUrl={serverUrl}
          sampleWindow={sampleWindow}
          onSave={(newAppId, newServerUrl, newSampleWindow) => {
            saveConfig(newAppId, newServerUrl);
            changeSampleWindow(newSampleWindow);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
