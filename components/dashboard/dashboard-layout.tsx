'use client';

import { useDigitsTrading } from '@/hooks/use-digits-trading';
import { useDerivWSContext } from '@/components/custom/deriv-ws-provider';
import { DashboardHeader } from './header';
import { LeftSidebar } from './left-sidebar';
import { RightSidebar } from './right-sidebar';
import { DigitCard } from './digit-card';
import { AIEngineWorkflow } from './ai-engine-workflow';
import { DigitStrengthChart } from './digit-strength-chart';
import { FooterNav } from './footer-nav';

export function DashboardLayout() {
  const { ws, isConnected } = useDerivWSContext();
  const { auth } = useDerivWSContext();
  
  const trading = useDigitsTrading({
    ws,
    isConnected,
    isExhausted: false,
    isAuthenticated: !!auth.wsUrl,
    onAuthWSFailed: () => {},
  });

  // Build digits arrays with real data
  const digits0to4 = Array.from({ length: 5 }, (_, i) => ({
    number: i,
    percentage: trading.digitStats.percentages[i] || 0,
    isCurrent: trading.lastDigit === i,
    isHighlight: false,
  }));

  const digits5to9 = Array.from({ length: 5 }, (_, i) => ({
    number: i + 5,
    percentage: trading.digitStats.percentages[i + 5] || 0,
    isCurrent: trading.lastDigit === i + 5,
    isHighlight: false,
  }));

  // Calculate over/under percentages for 0-4
  const over0to4Threshold = 6.4;
  const overPercentage0to4 = trading.digitStats.percentages
    .slice(0, 5)
    .reduce((sum, pct) => sum + (pct > over0to4Threshold ? pct : 0), 0);
  const underPercentage0to4 = trading.digitStats.percentages
    .slice(0, 5)
    .reduce((sum, pct) => sum + (pct < over0to4Threshold ? pct : 0), 0);

  // Calculate over/under percentages for 5-9
  const over5to9Threshold = 6.4;
  const overPercentage5to9 = trading.digitStats.percentages
    .slice(5, 10)
    .reduce((sum, pct) => sum + (pct > over5to9Threshold ? pct : 0), 0);
  const underPercentage5to9 = trading.digitStats.percentages
    .slice(5, 10)
    .reduce((sum, pct) => sum + (pct < over5to9Threshold ? pct : 0), 0);

  const overDigitCount0to4 = digits0to4.filter(d => d.percentage > 6.4).length;
  const underDigitCount0to4 = digits0to4.filter(d => d.percentage < 6.4).length;
  
  const overDigitCount5to9 = digits5to9.filter(d => d.percentage > 6.4).length;
  const underDigitCount5to9 = digits5to9.filter(d => d.percentage < 6.4).length;

  return (
    <div className="min-h-screen bg-[rgb(10,14,39)] text-white pt-20 pb-20">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <LeftSidebar trading={trading} />

        {/* Center Content */}
        <main className="ml-64 mr-72 px-8 py-6 overflow-y-auto">
          {/* Digit Cards Row */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <DigitCard
              title="DIGIT 0 TO 4"
              digits={digits0to4}
              overPercentage={overPercentage0to4}
              underPercentage={underPercentage0to4}
              threshold={6.4}
              overDigitCount={overDigitCount0to4}
              underDigitCount={underDigitCount0to4}
            />
            <DigitCard
              title="DIGIT 5 TO 9"
              digits={digits5to9}
              overPercentage={overPercentage5to9}
              underPercentage={underPercentage5to9}
              threshold={6.4}
              overDigitCount={overDigitCount5to9}
              underDigitCount={underDigitCount5to9}
            />
          </div>

          {/* AI Engine Workflow */}
          <AIEngineWorkflow />

          {/* Digit Strength Chart */}
          <DigitStrengthChart digitStats={trading.digitStats} />
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Footer Navigation */}
      <FooterNav />
    </div>
  );
}
