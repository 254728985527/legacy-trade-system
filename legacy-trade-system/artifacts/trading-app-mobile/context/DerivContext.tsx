import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";

const APP_ID = process.env.EXPO_PUBLIC_DERIV_APP_ID ?? "1089";
const PUBLIC_WS_URL = `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`;
const MAX_PRICES = 120;
const MAX_DIGIT_HISTORY = 500;

export interface ActiveSymbol {
  symbol: string;
  display_name: string;
  pip: number;
  is_trading_suspended: number;
}

export interface DigitStats {
  counts: number[];
  percentages: number[];
  total: number;
}

export interface OpenPosition {
  contract_id: number;
  contract_type: string;
  buy_price: number;
  display_name: string;
  underlying_symbol: string;
  purchase_time: number;
}

export interface ClosedPosition {
  contract_id: number;
  contract_type: string;
  buy_price: number;
  sell_price: number;
  underlying_symbol: string;
  sell_time: number;
}

export interface ProposalInfo {
  id: string;
  ask_price: number;
  payout: number;
  longcode: string;
}

interface DerivContextValue {
  isConnected: boolean;
  isAuthenticated: boolean;
  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  selectSymbol: (symbol: string) => void;
  currentPrice: number | null;
  lastDigit: number | null;
  prices: number[];
  digitStats: DigitStats;
  pipSize: number;
  ldpDigit: number | null;
  ldpConfidence: number;
  riseCount: number;
  fallCount: number;
  streak: number;
  streakDir: "rise" | "fall";
  openPositions: OpenPosition[];
  closedPositions: ClosedPosition[];
  getProposal: (params: Record<string, unknown>) => Promise<ProposalInfo | null>;
  buyContract: (proposalId: string, price: number) => Promise<{ success: boolean; error?: string }>;
}

const DerivContext = createContext<DerivContextValue | null>(null);

function computeDigitStats(history: number[], pipSize: number) {
  const counts = Array(10).fill(0);
  for (const p of history) {
    const digit = Math.round(p * Math.pow(10, pipSize)) % 10;
    counts[digit]++;
  }
  const total = history.length;
  const percentages = counts.map((c) => (total > 0 ? (c / total) * 100 : 0));
  return { counts, percentages, total };
}

function getLastDigit(price: number, pipSize: number): number {
  return Math.round(price * Math.pow(10, pipSize)) % 10;
}

export function DerivProvider({ children }: { children: React.ReactNode }) {
  const { wsUrl, authState } = useAuthContext();
  const isAuthenticated = authState === "authenticated";

  const [isConnected, setIsConnected] = useState(false);
  const [symbols, setSymbols] = useState<ActiveSymbol[]>([]);
  const [activeSymbol, setActiveSymbol] = useState<ActiveSymbol | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [prices, setPrices] = useState<number[]>([]);
  const [digitHistory, setDigitHistory] = useState<number[]>([]);
  const [riseHistory, setRiseHistory] = useState<boolean[]>([]);
  const [openPositions, setOpenPositions] = useState<OpenPosition[]>([]);
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const subscriptionIdRef = useRef<string | null>(null);
  const activeSymbolRef = useRef<ActiveSymbol | null>(null);
  const prevPriceRef = useRef<number | null>(null);
  const pendingRequestsRef = useRef<Map<number, (data: Record<string, unknown>) => void>>(new Map());
  const reqCounterRef = useRef(0);

  const sendRequest = useCallback(
    (msg: Record<string, unknown>): Promise<Record<string, unknown>> => {
      return new Promise((resolve) => {
        const reqId = ++reqCounterRef.current;
        pendingRequestsRef.current.set(reqId, resolve);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ ...msg, req_id: reqId }));
        } else {
          pendingRequestsRef.current.delete(reqId);
          resolve({});
        }
      });
    },
    []
  );

  const send = useCallback((msg: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const subscribeToSymbol = useCallback(
    (sym: ActiveSymbol) => {
      if (subscriptionIdRef.current) {
        send({ forget: subscriptionIdRef.current });
        subscriptionIdRef.current = null;
      }
      send({ ticks: sym.symbol, subscribe: 1 });
      setPrices([]);
      setDigitHistory([]);
      setRiseHistory([]);
      setCurrentPrice(null);
      prevPriceRef.current = null;
    },
    [send]
  );

  const fetchPositions = useCallback(async () => {
    if (!isAuthenticated) return;
    // Open positions
    const portfolio = await sendRequest({ portfolio: 1 });
    if (portfolio.portfolio) {
      const contracts = (portfolio.portfolio as { contracts?: OpenPosition[] }).contracts ?? [];
      setOpenPositions(contracts);
    }
    // Closed positions
    const profitTable = await sendRequest({ profit_table: 1, description: 1, sort: "DESC", limit: 30 });
    if (profitTable.profit_table) {
      const txs = (profitTable.profit_table as { transactions?: ClosedPosition[] }).transactions ?? [];
      setClosedPositions(txs);
    }
  }, [isAuthenticated, sendRequest]);

  useEffect(() => {
    const targetUrl = isAuthenticated && wsUrl ? wsUrl : PUBLIC_WS_URL;
    const ws = new WebSocket(targetUrl);
    wsRef.current = ws;
    setIsConnected(false);
    setOpenPositions([]);
    setClosedPositions([]);

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ active_symbols: "brief", product_type: "basic" }));
    };

    ws.onclose = () => {
      setIsConnected(false);
      subscriptionIdRef.current = null;
    };

    ws.onerror = () => setIsConnected(false);

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data as string) as Record<string, unknown>;

        // Resolve pending requests
        if (msg.req_id && pendingRequestsRef.current.has(msg.req_id as number)) {
          const resolve = pendingRequestsRef.current.get(msg.req_id as number)!;
          pendingRequestsRef.current.delete(msg.req_id as number);
          resolve(msg);
          return;
        }

        if (msg.active_symbols) {
          const syms = (msg.active_symbols as ActiveSymbol[])
            .filter((s) => s.symbol.startsWith("1HZ") || s.symbol.startsWith("R_"))
            .sort((a, b) => a.display_name.localeCompare(b.display_name));
          setSymbols(syms);
          if (syms.length > 0 && !activeSymbolRef.current) {
            const preferred = syms.find((s) => s.symbol === "1HZ100V") ?? syms[0];
            activeSymbolRef.current = preferred;
            setActiveSymbol(preferred);
            ws.send(JSON.stringify({ ticks: preferred.symbol, subscribe: 1 }));
          }
        }

        if (msg.tick) {
          const tick = msg.tick as { quote: number; id: string };
          subscriptionIdRef.current = tick.id;
          const price = tick.quote;
          const pipSize = activeSymbolRef.current?.pip ?? 2;
          const digit = getLastDigit(price, pipSize);

          setCurrentPrice(price);
          setPrices((prev) => {
            const next = [...prev, price];
            return next.length > MAX_PRICES ? next.slice(-MAX_PRICES) : next;
          });
          setDigitHistory((prev) => {
            const next = [...prev, digit];
            return next.length > MAX_DIGIT_HISTORY ? next.slice(-MAX_DIGIT_HISTORY) : next;
          });
          setRiseHistory((prev) => {
            if (prevPriceRef.current !== null) {
              const isRise = price > prevPriceRef.current;
              const next = [...prev, isRise];
              prevPriceRef.current = price;
              return next.length > 100 ? next.slice(-100) : next;
            }
            prevPriceRef.current = price;
            return prev;
          });
        }
      } catch {}
    };

    return () => {
      ws.close();
    };
  }, [isAuthenticated, wsUrl]);

  // Fetch positions when authenticated
  useEffect(() => {
    if (isAuthenticated && isConnected) {
      const t = setTimeout(fetchPositions, 500);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated, isConnected, fetchPositions]);

  const selectSymbol = useCallback(
    (symbol: string) => {
      const sym = symbols.find((s) => s.symbol === symbol);
      if (!sym) return;
      activeSymbolRef.current = sym;
      setActiveSymbol(sym);
      if (wsRef.current?.readyState === WebSocket.OPEN) subscribeToSymbol(sym);
    },
    [symbols, subscribeToSymbol]
  );

  const getProposal = useCallback(
    async (params: Record<string, unknown>): Promise<ProposalInfo | null> => {
      const resp = await sendRequest({ proposal: 1, ...params });
      if (!resp.proposal) return null;
      const p = resp.proposal as { id: string; ask_price: number; payout: number; longcode: string };
      return { id: p.id, ask_price: p.ask_price, payout: p.payout, longcode: p.longcode };
    },
    [sendRequest]
  );

  const buyContract = useCallback(
    async (proposalId: string, price: number): Promise<{ success: boolean; error?: string }> => {
      const resp = await sendRequest({ buy: proposalId, price });
      if (resp.error) return { success: false, error: (resp.error as { message: string }).message };
      setTimeout(fetchPositions, 2000);
      return { success: true };
    },
    [sendRequest, fetchPositions]
  );

  const pipSize = activeSymbol?.pip ?? 2;
  const lastDigit = currentPrice !== null ? getLastDigit(currentPrice, pipSize) : null;
  const digitStats = computeDigitStats(digitHistory, pipSize);

  const ldpDigit =
    digitStats.total > 20
      ? digitStats.percentages.indexOf(Math.max(...digitStats.percentages))
      : null;
  const ldpConfidence = ldpDigit !== null ? digitStats.percentages[ldpDigit] : 0;

  const riseCount = riseHistory.filter(Boolean).length;
  const fallCount = riseHistory.length - riseCount;
  let streak = 0;
  let streakDir: "rise" | "fall" = "rise";
  if (riseHistory.length > 0) {
    const last = riseHistory[riseHistory.length - 1];
    streakDir = last ? "rise" : "fall";
    for (let i = riseHistory.length - 1; i >= 0; i--) {
      if (riseHistory[i] === last) streak++;
      else break;
    }
  }

  return (
    <DerivContext.Provider
      value={{
        isConnected,
        isAuthenticated,
        symbols,
        activeSymbol,
        selectSymbol,
        currentPrice,
        lastDigit,
        prices,
        digitStats,
        pipSize,
        ldpDigit,
        ldpConfidence,
        riseCount,
        fallCount,
        streak,
        streakDir,
        openPositions,
        closedPositions,
        getProposal,
        buyContract,
      }}
    >
      {children}
    </DerivContext.Provider>
  );
}

export function useDerivContext(): DerivContextValue {
  const ctx = useContext(DerivContext);
  if (!ctx) throw new Error("useDerivContext must be within DerivProvider");
  return ctx;
}
