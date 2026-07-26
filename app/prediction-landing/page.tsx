'use client';

import { LastDigitPredictionPanel } from '@/components/last-digit-prediction-panel';
import { LandingSection } from '@/components/landing-section';

export default function PredictionLandingPage() {
  return (
    <div className="w-full">
      <LastDigitPredictionPanel />
      <LandingSection />
    </div>
  );
}
