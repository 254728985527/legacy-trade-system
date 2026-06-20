'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20 px-4">
      <div className="text-center space-y-6">
        <div className="text-7xl font-bold text-primary">404</div>
        <h1 className="text-4xl font-bold text-foreground">Page Not Found</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or may not be available in your country.
        </p>
        
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/">
            <Button size="lg" className="px-8">
              Return to Trading
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="px-8">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
