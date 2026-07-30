'use client';

import { DashboardHeader } from './header';
import { LeftSidebar } from './left-sidebar';
import { RightSidebar } from './right-sidebar';
import { DigitCard } from './digit-card';
import { AIEngineWorkflow } from './ai-engine-workflow';
import { DigitStrengthChart } from './digit-strength-chart';
import { FooterNav } from './footer-nav';

export function DashboardLayout() {
  const digits0to4 = [
    { number: 0, percentage: 9.4 },
    { number: 1, percentage: 15.6, isCurrent: true },
    { number: 2, percentage: 3.1 },
    { number: 3, percentage: 12.5 },
    { number: 4, percentage: 18.8, isHighlight: true },
  ];

  const digits5to9 = [
    { number: 5, percentage: 9.4 },
    { number: 6, percentage: 15.6, isHighlight: true },
    { number: 7, percentage: 6.3 },
    { number: 8, percentage: 3.1 },
    { number: 9, percentage: 6.3 },
  ];

  return (
    <div className="min-h-screen bg-[rgb(10,14,39)] text-white pt-20 pb-20">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Center Content */}
        <main className="ml-64 mr-72 px-8 py-6 overflow-y-auto">
          {/* Digit Cards Row */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <DigitCard
              title="DIGIT 0 TO 4"
              digits={digits0to4}
              overPercentage={56.3}
              underPercentage={15.7}
              threshold={6.4}
              overDigitCount={4}
              underDigitCount={1}
            />
            <DigitCard
              title="DIGIT 5 TO 9"
              digits={digits5to9}
              overPercentage={25.0}
              underPercentage={15.7}
              threshold={6.4}
              overDigitCount={2}
              underDigitCount={3}
            />
          </div>

          {/* AI Engine Workflow */}
          <AIEngineWorkflow />

          {/* Digit Strength Chart */}
          <DigitStrengthChart />
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Footer Navigation */}
      <FooterNav />
    </div>
  );
}
