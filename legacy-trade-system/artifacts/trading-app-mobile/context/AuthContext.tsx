import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

const APP_ID = process.env.EXPO_PUBLIC_DERIV_APP_ID ?? "1089";
const AUTH_BASE = "https://auth.deriv.com/oauth2";
const API_BASE = "https://api.derivws.com/trading/v1/options";

const KEYS = {
  verifier: "oauth_code_verifier",
  csrf: "oauth_csrf_token",
  redirectUri: "oauth_redirect_uri",
  authInfo: "auth_info",
  accounts: "deriv_accounts",
  activeId: "active_loginid",
};

export interface DerivAccount {
  account_id: string;
  account_type: "real" | "demo";
  currency: string;
  balance?: number;
}

export interface AuthInfo {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
}

export type AuthState = "unauthenticated" | "authenticating" | "authenticated" | "error";

interface AuthContextValue {
  authState: AuthState;
  accounts: DerivAccount[];
  activeAccount: DerivAccount | null;
  activeAccountId: string | null;
  wsUrl: string | undefined;
  login: () => Promise<void>;
  logout: () => void;
  switchAccount: (accountId: string) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function base64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function generateRandomBase64url(len = 32): string {
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = Math.floor(Math.random() * 256);
  return base64urlEncode(bytes);
}

async function sha256Base64url(input: string): Promise<string> {
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, input, {
    encoding: Crypto.CryptoEncoding.BASE64,
  });
  return hash.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function exchangeCode(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<AuthInfo> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: APP_ID,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });
  const res = await fetch(`${AUTH_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Token exchange failed (${res.status})`);
  const data = await res.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600),
    token_type: data.token_type,
    scope: data.scope,
  };
}

async function fetchAccounts(authInfo: AuthInfo): Promise<DerivAccount[]> {
  const res = await fetch(`${API_BASE}/accounts`, {
    headers: {
      Authorization: `Bearer ${authInfo.access_token}`,
      "Deriv-App-ID": APP_ID,
    },
  });
  if (!res.ok) throw new Error(`Accounts fetch failed (${res.status})`);
  const data = await res.json();
  return (data.data ?? []) as DerivAccount[];
}

async function fetchOTPUrl(accountId: string, authInfo: AuthInfo): Promise<string> {
  const res = await fetch(`${API_BASE}/accounts/${accountId}/otp`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authInfo.access_token}`,
      "Deriv-App-ID": APP_ID,
    },
  });
  if (!res.ok) throw new Error(`OTP fetch failed (${res.status})`);
  const data = await res.json();
  return data.data.url as string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>("unauthenticated");
  const [accounts, setAccounts] = useState<DerivAccount[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  const completeAuth = useCallback(async (authInfo: AuthInfo) => {
    const accts = await fetchAccounts(authInfo);
    setAccounts(accts);
    await AsyncStorage.setItem(KEYS.accounts, JSON.stringify(accts));

    if (accts.length > 0) {
      const firstId = accts[0].account_id;
      setActiveAccountId(firstId);
      await AsyncStorage.setItem(KEYS.activeId, firstId);

      const url = await fetchOTPUrl(firstId, authInfo);
      setWsUrl(url);
    }

    await AsyncStorage.setItem(KEYS.authInfo, JSON.stringify(authInfo));
    setAuthState("authenticated");
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      const stored = await AsyncStorage.getItem(KEYS.authInfo);
      if (stored) {
        try {
          const authInfo: AuthInfo = JSON.parse(stored);
          if (Date.now() / 1000 < authInfo.expires_at - 60) {
            const storedAccts = await AsyncStorage.getItem(KEYS.accounts);
            const storedId = await AsyncStorage.getItem(KEYS.activeId);
            if (storedAccts) setAccounts(JSON.parse(storedAccts));
            if (storedId) {
              setActiveAccountId(storedId);
              const url = await fetchOTPUrl(storedId, authInfo);
              setWsUrl(url);
              setAuthState("authenticated");
            }
          } else {
            await AsyncStorage.multiRemove(Object.values(KEYS));
          }
        } catch {
          await AsyncStorage.multiRemove(Object.values(KEYS));
        }
      }
    };

    init();
  }, []);

  // Handle deep link callback from OAuth
  useEffect(() => {
    const handleUrl = async (url: string) => {
      const parsed = new URL(url);
      const code = parsed.searchParams.get("code");
      const state = parsed.searchParams.get("state");

      if (!code) return;

      const storedCsrf = await AsyncStorage.getItem(KEYS.csrf);
      const storedVerifier = await AsyncStorage.getItem(KEYS.verifier);
      const storedRedirect = await AsyncStorage.getItem(KEYS.redirectUri);

      if (state !== storedCsrf || !storedVerifier || !storedRedirect) {
        setError("OAuth state mismatch — possible CSRF");
        setAuthState("error");
        return;
      }

      setAuthState("authenticating");
      try {
        const authInfo = await exchangeCode(code, storedVerifier, storedRedirect);
        await completeAuth(authInfo);
        await AsyncStorage.multiRemove([KEYS.verifier, KEYS.csrf, KEYS.redirectUri]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Authentication failed");
        setAuthState("error");
      }
    };

    const sub = Linking.addEventListener("url", (event) => {
      handleUrl(event.url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    return () => sub.remove();
  }, [completeAuth]);

  const login = useCallback(async () => {
    const redirectUri = Linking.createURL("/");
    const csrf = generateRandomBase64url(32);
    const verifier = generateRandomBase64url(48);
    const challenge = await sha256Base64url(verifier);

    await AsyncStorage.setItem(KEYS.csrf, csrf);
    await AsyncStorage.setItem(KEYS.verifier, verifier);
    await AsyncStorage.setItem(KEYS.redirectUri, redirectUri);

    const params = new URLSearchParams({
      scope: "trade account_manage",
      response_type: "code",
      client_id: APP_ID,
      redirect_uri: redirectUri,
      state: csrf,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });

    await WebBrowser.openAuthSessionAsync(
      `${AUTH_BASE}/auth?${params.toString()}`,
      redirectUri
    );
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    setAccounts([]);
    setActiveAccountId(null);
    setWsUrl(undefined);
    setAuthState("unauthenticated");
    setError(null);
  }, []);

  const switchAccount = useCallback(
    async (accountId: string) => {
      const stored = await AsyncStorage.getItem(KEYS.authInfo);
      if (!stored) return;
      const authInfo: AuthInfo = JSON.parse(stored);
      setActiveAccountId(accountId);
      await AsyncStorage.setItem(KEYS.activeId, accountId);
      const url = await fetchOTPUrl(accountId, authInfo);
      setWsUrl(url);
    },
    []
  );

  const activeAccount = accounts.find((a) => a.account_id === activeAccountId) ?? accounts[0] ?? null;

  return (
    <AuthContext.Provider
      value={{ authState, accounts, activeAccount, activeAccountId, wsUrl, login, logout, switchAccount, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be within AuthProvider");
  return ctx;
}
