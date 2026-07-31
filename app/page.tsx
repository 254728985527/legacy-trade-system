'use client';

import React, { useState } from 'react';
import { useDerivEngine } from '@/hooks/useDerivEngine';
import { Header } from '@/components/Header';
import { VolatilityCard } from '@/components/VolatilityCard';
import { LivePriceCard } from '@/components/LivePriceCard';
import { IncomingTickRing } from '@/components/IncomingTickRing';
import { CursorTracker } from '@/components/CursorTracker';
import { DigitRangeCards } from '@/components/DigitRangeCards';
import { AiWorkflowSteps } from '@/components/AiWorkflowSteps';
import { DigitStrengthRanking } from '@/components/DigitStrengthRanking';
import { KeyDigitsCard } from '@/components/KeyDigitsCard';
import { SignalCard } from '@/components/SignalCard';
import { TotalOverUnderCard } from '@/components/TotalOverUnderCard';
import { AiEndpointCard } from '@/components/AiEndpointCard';
import { TickStreamTable } from '@/components/TickStreamTable';
import { PriceChart } from '@/components/PriceChart';
import { LiveDataStream } from '@/components/LiveDataStream';
import { ContinuousTickFeed } from '@/components/ContinuousTickFeed';
import { SettingsModal } from '@/components/SettingsModal';
import { FooterNav } from '@/components/FooterNav';
import { TickVisualization } from '@/components/TickVisualization';
import { LayoutDashboard, Table, LineChart, Activity, Zap, Eye } from 'lucide-react';

export default function DashboardPage() {
  const {
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
  } = useDerivEngine();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'stream' | 'chart' | 'live' | 'continuous' | 'ticks'>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-black text-[#eaeaea] font-sans p-3 sm:p-4 md:p-6 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.06),transparent_45%)]">
      <div className="max-w-[1520px] mx-auto">
        {/* Header */}
        <Header
          connectionStatus={connectionStatus}
          pingMs={pingMs}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* View Tab Switcher */}
        <div className="flex items-center justify-between mb-4 border-b border-[#1f1f1f] pb-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 bg-[#0a0a0a] p-1 border border-[rgba(212,175,55,0.35)] rounded-lg flex-wrap">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-[#F4CB4B] text-black shadow-[0_0_10px_rgba(244,203,75,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutDashboard size={14} /> DASHBOARD
            </button>

            <button
              onClick={() => setActiveTab('ticks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ticks'
                  ? 'bg-[#F4CB4B] text-black shadow-[0_0_10px_rgba(244,203,75,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye size={14} /> INCOMING TICKS
            </button>

            <button
              onClick={() => setActiveTab('stream')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'stream'
                  ? 'bg-[#F4CB4B] text-black shadow-[0_0_10px_rgba(244,203,75,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Table size={14} /> TICK STREAM
            </button>

            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'chart'
                  ? 'bg-[#F4CB4B] text-black shadow-[0_0_10px_rgba(244,203,75,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LineChart size={14} /> SPARKLINE
            </button>

            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'live'
                  ? 'bg-[#F4CB4B] text-black shadow-[0_0_10px_rgba(244,203,75,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity size={14} /> LIVE DATA
            </button>

            <button
              onClick={() => setActiveTab('continuous')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'continuous'
                  ? 'bg-[#F4CB4B] text-black shadow-[0_0_10px_rgba(244,203,75,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap size={14} /> TICKS
            </button>
          </div>

          <div className="font-mono text-xs text-[#D4AF37] hidden sm:flex items-center gap-2 ml-4">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
            <span>SAMPLE: {digitStats.totalTicks} TICKS</span>
          </div>
        </div>

        {/* Tab 1: Main AI Analysis Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr_330px] gap-4 items-start">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4">
              <VolatilityCard
                selectedSymbol={selectedSymbol}
                onSymbolChange={changeSymbol}
                latestTick={latestTick}
              />

              <LivePriceCard
                selectedSymbol={selectedSymbol}
                latestTick={latestTick}
                onSubscribeLiveTicks={subscribeToLiveTicks}
              />

              <IncomingTickRing
                latestTick={latestTick}
                totalCollected={digitStats.totalTicks}
              />

              <CursorTracker
                currentDigit={currentDigit}
                targetDigit={targetDigit}
                remainingTicks={remainingTicks}
              />
            </div>

            {/* MIDDLE COLUMN */}
            <div className="flex flex-col gap-4">
              <DigitRangeCards digitStats={digitStats} currentDigit={currentDigit} />

              <AiWorkflowSteps
                digitStats={digitStats}
                currentDigit={currentDigit}
                isExecuting={isExecuting}
                isExecutedPop={isExecutedPop}
                lastExecutedDirection={lastExecutedDirection}
                lastExecutedConfidence={lastExecutedConfidence}
              />

              <DigitStrengthRanking digitStats={digitStats} />
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4">
              <KeyDigitsCard digitStats={digitStats} />

              <SignalCard digitStats={digitStats} />

              <TotalOverUnderCard digitStats={digitStats} />

              <AiEndpointCard digitStats={digitStats} />
            </div>
          </div>
        )}

        {/* Tab 2: Incoming Ticks Focus View - EMPHASIZED */}
        {activeTab === 'ticks' && (
          <div className="space-y-6">
            {/* TICK VISUALIZATION - FULL WIDTH */}
            <TickVisualization ticks={ticks} isConnected={connectionStatus === 'connected'} />

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
              {/* LEFT: LIVE TICK MONITOR */}
              <div className="flex flex-col gap-4">
                <div className="bg-[#0a0a0a] border-2 border-[#F4CB4B] rounded-xl p-6 shadow-[0_0_30px_rgba(244,203,75,0.2)]">
                  <div className="text-[#F4CB4B] text-lg font-bold mb-4 uppercase tracking-widest">🎯 LIVE TICK MONITOR</div>
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
                    onSubscribeLiveTicks={subscribeToLiveTicks}
                  />
                </div>

                <CursorTracker
                  currentDigit={currentDigit}
                  targetDigit={targetDigit}
                  remainingTicks={remainingTicks}
                />
              </div>

              {/* RIGHT: ANALYSIS CARDS */}
              <div className="flex flex-col gap-4">
                <DigitRangeCards digitStats={digitStats} currentDigit={currentDigit} />

                <AiWorkflowSteps
                  digitStats={digitStats}
                  currentDigit={currentDigit}
                  isExecuting={isExecuting}
                  isExecutedPop={isExecutedPop}
                  lastExecutedDirection={lastExecutedDirection}
                  lastExecutedConfidence={lastExecutedConfidence}
                />

                <div className="grid grid-cols-2 gap-4">
                  <KeyDigitsCard digitStats={digitStats} />
                  <SignalCard digitStats={digitStats} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Live Tick Stream Table */}
        {activeTab === 'stream' && <TickStreamTable ticks={ticks} />}

        {/* Tab 4: Sparkline Price Chart */}
        {activeTab === 'chart' && <PriceChart ticks={ticks} selectedSymbol={selectedSymbol} />}

        {/* Tab 5: Live Data Stream with Price Consistency */}
        {activeTab === 'live' && <LiveDataStream ticks={ticks} isConnected={connectionStatus === 'connected'} />}

        {/* Tab 6: Continuous Tick Feed (Instant Updates) */}
        {activeTab === 'continuous' && <ContinuousTickFeed ticks={ticks} isConnected={connectionStatus === 'connected'} />}

        {/* Footer Navigation */}
        <FooterNav />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          appId={appId}
          serverUrl={serverUrl}
          onSave={saveConfig}
          connectionStatus={connectionStatus}
          pingMs={pingMs}
        />
      </div>
    </div>
  );
}
