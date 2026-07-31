export type DerivSymbol = {
  symbol: string;
  display_name: string;
  category: string;
  pip_size: number;
  default_price: number;
};

export const DERIV_SYMBOLS: DerivSymbol[] = [
  { symbol: 'R_100', display_name: 'Volatility 100 Index', category: 'Continuous Indices', pip_size: 2, default_price: 2980.40 },
  { symbol: 'R_50', display_name: 'Volatility 50 Index', category: 'Continuous Indices', pip_size: 4, default_price: 345.6800 },
  { symbol: 'R_25', display_name: 'Volatility 25 Index', category: 'Continuous Indices', pip_size: 2, default_price: 3840.15 },
  { symbol: 'R_10', display_name: 'Volatility 10 Index', category: 'Continuous Indices', pip_size: 3, default_price: 8120.450 },
  { symbol: 'R_75', display_name: 'Volatility 75 Index', category: 'Continuous Indices', pip_size: 4, default_price: 742150.3200 },
  { symbol: 'FRXUSDJPY', display_name: 'USD/JPY Forex Pair', category: 'Forex', pip_size: 2, default_price: 110.50 },
  { symbol: 'FRXEURUSD', display_name: 'EUR/USD Forex Pair', category: 'Forex', pip_size: 4, default_price: 1.0850 },
  { symbol: 'FRXGBPUSD', display_name: 'GBP/USD Forex Pair', category: 'Forex', pip_size: 4, default_price: 1.2650 },
  { symbol: 'FRXUSDHKD', display_name: 'USD/HKD Forex Pair', category: 'Forex', pip_size: 2, default_price: 7.8500 },
  { symbol: 'FRXAUDUSD', display_name: 'AUD/USD Forex Pair', category: 'Forex', pip_size: 4, default_price: 0.7250 },
  { symbol: 'JD100', display_name: 'Jump 100 Index', category: 'Jump Indices', pip_size: 2, default_price: 99100.90 },
  { symbol: 'JD50', display_name: 'Jump 50 Index', category: 'Jump Indices', pip_size: 2, default_price: 49200.80 },
  { symbol: 'JD25', display_name: 'Jump 25 Index', category: 'Jump Indices', pip_size: 2, default_price: 24800.50 },
  { symbol: 'JD10', display_name: 'Jump 10 Index', category: 'Jump Indices', pip_size: 2, default_price: 9950.20 },
  { symbol: 'RDBULL', display_name: 'Bull Market Index', category: 'Daily Land Indices', pip_size: 4, default_price: 3120.4500 },
  { symbol: 'RDBEAR', display_name: 'Bear Market Index', category: 'Daily Land Indices', pip_size: 4, default_price: 2450.8800 },
];

export type ConnectionMode = 'DIRECT' | 'PROXY' | 'SIMULATION';

export type ConnectionStatus = 'connected' | 'connecting' | 'reconnecting' | 'disconnected' | 'error';

export type TickData = {
  epoch: number;
  quote: number;
  symbol: string;
  pip_size: number;
  digit: number;
  change?: number; // difference from previous quote
  timestampStr?: string;
  latencyMs?: number; // Deriv server to website latency in milliseconds
};

export type DigitStats = {
  counts: number[]; // length 10
  percentages: number[]; // length 10
  totalTicks: number;
  highestDigit: number;
  secondHighestDigit: number;
  lowestDigit: number;
  underTotalPct: number; // 0-4
  overTotalPct: number;  // 5-9
  avgPct: number;
  threshold0_4: number;
  threshold5_9: number;
  numerator0_4: number;
  numerator5_9: number;
  direction: 'UNDER' | 'OVER';
  confidence: number;
  underTarget: number;
  overTarget: number;
  recommendation: 'TAKE TRADE ✓' | 'WAIT ✕';
  confirmDigits: number[];
  confirmLabel: string;
  entryRangeArr: number[];
  confirmRangeArr: number[];
};

export type TradeExecutionEvent = {
  id: string;
  timestamp: number;
  digit: number;
  direction: 'UNDER' | 'OVER';
  confidence: number;
  targetDigit: number;
  quote: number;
};
