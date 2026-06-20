'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error_code = url.searchParams.get('error_code');
        const error_description = url.searchParams.get('error_description');

        console.log('[v0] OAuth callback received:', { code, state, error_code });

        // Handle OAuth errors
        if (error_code || error_description) {
          const errorMsg = `Authentication failed: ${error_description || error_code || 'Unknown error'}`;
          console.error('[v0] OAuth error:', errorMsg);
          setError(errorMsg);
          setStatus('');
          
          // Redirect to home after 3 seconds
          setTimeout(() => {
            router.push('/');
          }, 3000);
          return;
        }

        // Handle missing code
        if (!code) {
          setError('Authorization code not found. Please try logging in again.');
          setStatus('');
          
          setTimeout(() => {
            router.push('/');
          }, 3000);
          return;
        }

        // OAuth callback is handled by useAuth hook which detects the 'code' parameter
        // We just need to redirect back to home where useAuth will process it
        setStatus('Authentication successful! Redirecting...');
        
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Authentication failed';
        console.error('[v0] Callback error:', errorMsg);
        setError(errorMsg);
        setStatus('');
        
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 space-y-4">
          {error ? (
            <>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-red-500 mb-2">Authentication Failed</h2>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Redirecting to home page in 3 seconds...
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-primary rounded-full animate-pulse opacity-75" />
                  <div className="absolute inset-0 bg-primary rounded-full animate-spin opacity-50" 
                       style={{ animationDuration: '2s' }} />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground mb-2">Authenticating</h2>
                <p className="text-sm text-muted-foreground">{status}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
