import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth Callback Handler
 * 
 * This API route handles OAuth callbacks from Deriv.
 * It receives the authorization code and redirects to the main page
 * where useAuth hook processes the OAuth flow.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  console.log('[v0] Auth callback API route received:', { code, state, error });

  try {
    // Handle OAuth errors
    if (error) {
      const errorMsg = `OAuth Error: ${error_description || error}`;
      console.error('[v0] OAuth error:', errorMsg);

      // Redirect back to home with error
      return NextResponse.redirect(
        new URL(`/?auth_error=${encodeURIComponent(errorMsg)}`, request.url),
        { status: 302 }
      );
    }

    // Handle missing code
    if (!code) {
      console.error('[v0] No authorization code provided');
      return NextResponse.redirect(
        new URL('/?auth_error=No authorization code', request.url),
        { status: 302 }
      );
    }

    // Redirect to home page with code and state parameters
    // The useAuth hook will detect the code parameter and process the OAuth flow
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('code', code);
    if (state) redirectUrl.searchParams.set('state', state);

    console.log('[v0] Redirecting to home with OAuth code');
    return NextResponse.redirect(redirectUrl, { status: 302 });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[v0] Callback handler error:', errorMsg);

    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent(errorMsg)}`, request.url),
      { status: 302 }
    );
  }
}
