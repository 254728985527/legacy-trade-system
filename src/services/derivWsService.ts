import { ConnectionMode, ConnectionStatus, DERIV_SYMBOLS, DerivSymbol, TickData } from '../types';
import { extractLastDigit } from '../utils/digitAnalysis';

export type DerivWsCallbacks = {
  onStatusChange: (status: ConnectionStatus, mode: ConnectionMode) => void;
  onTick: (tick: TickData) => void;
  onHistory: (history: TickData[]) => void;
  onPingChange: (pingMs: number) => void;
};

const DEFAULT_SERVERS = ['ws.derivws.com', 'ws.binaryws.com'];

export class DerivWsService {
  private ws: WebSocket | null = null;
  private appId: string = '1089';
  private serverUrl: string = 'ws.derivws.com';
  private serverIndex: number = 0;
  private currentSymbol: DerivSymbol = DERIV_SYMBOLS[0];
  private status: ConnectionStatus = 'disconnected';
  private pingInterval: number | null = null;
  private pingStartTime: number = 0;
  private lastQuote: number | null = null;
  private callbacks: Partial<DerivWsCallbacks> = {};
  private reconnectTimer: number | null = null;
  private historyCount: number = 1000;
  private activeWsId: number = 0;

  private lastTickTime: number = Date.now();
  private watchdogInterval: number | null = null;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const savedAppId = localStorage.getItem('deriv_app_id');
      if (savedAppId) this.appId = savedAppId;
    }
  }

  public setCallbacks(callbacks: DerivWsCallbacks) {
    this.callbacks = callbacks;
  }

  public setConfig(appId: string, serverUrl: string) {
    this.appId = appId || '1089';
    this.serverUrl = serverUrl || 'ws.derivws.com';
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('deriv_app_id', this.appId);
    }
  }

  public getConfig() {
    return { appId: this.appId, serverUrl: this.serverUrl };
  }

  public connect(symbol: DerivSymbol, historyCount: number = 1000) {
    this.currentSymbol = symbol;
    this.historyCount = historyCount;
    this.cleanup();

    this.setStatus('connecting');
    const wsId = ++this.activeWsId;

    const host = this.serverUrl || DEFAULT_SERVERS[this.serverIndex % DEFAULT_SERVERS.length];
    const wsUrl = `wss://${host}/websockets/v3?app_id=${this.appId}`;

    try {
      const wsInstance = new WebSocket(wsUrl);
      this.ws = wsInstance;

      wsInstance.onopen = () => {
        if (this.activeWsId !== wsId) return;
        console.log(`Deriv WebSocket Connected (${host})`);
        this.setStatus('connected');
        this.sendSubscriptions();
        this.startPingLoop();
      };

      wsInstance.onmessage = (evt) => {
        if (this.activeWsId !== wsId) return;
        try {
          const data = JSON.parse(evt.data);
          this.handleMessage(data);
        } catch (err) {
          console.error('Deriv WS parse error:', err);
        }
      };

      wsInstance.onerror = (error) => {
        if (this.activeWsId !== wsId) return;
        console.log('Deriv WebSocket Error:', error);
        this.setStatus('error');
      };

      wsInstance.onclose = () => {
        if (this.activeWsId !== wsId) return;
        console.log('Deriv WebSocket Closed');
        if (this.status !== 'disconnected') {
          this.setStatus('reconnecting');
          this.serverIndex = (this.serverIndex + 1) % DEFAULT_SERVERS.length;
          this.reconnectTimer = window.setTimeout(() => {
            this.connect(this.currentSymbol, this.historyCount);
          }, 2000);
        }
      };
    } catch (err) {
      console.error('Failed to instantiate Deriv WebSocket:', err);
      this.setStatus('error');
      this.reconnectTimer = window.setTimeout(() => {
        this.connect(this.currentSymbol, this.historyCount);
      }, 3000);
    }
  }

  private setStatus(status: ConnectionStatus) {
    this.status = status;
    if (this.callbacks.onStatusChange) {
      this.callbacks.onStatusChange(status, 'DIRECT');
    }
  }

  private sendSubscriptions() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    try {
      this.ws.send(JSON.stringify({ forget_all: 'ticks' }));
    } catch {
      // ignore
    }

    // 1. Fetch historical ticks (without subscribe flag to prevent AlreadySubscribed error)
    this.ws.send(
      JSON.stringify({
        ticks_history: this.currentSymbol.symbol,
        count: this.historyCount,
        end: 'latest',
        style: 'ticks',
      })
    );

    // 2. Subscribe to real-time live tick stream
    this.ws.send(
      JSON.stringify({
        ticks: this.currentSymbol.symbol,
        subscribe: 1,
      })
    );
  }

  private handleMessage(data: Record<string, unknown>) {
    if (data.msg_type === 'pong') {
      const pingMs = Math.round(performance.now() - this.pingStartTime);
      if (this.callbacks.onPingChange) {
        this.callbacks.onPingChange(pingMs);
      }
      return;
    }

    if (data.error) {
      console.warn('Deriv WS API Response Error:', data.error);
      return;
    }

    // Handle historical tick data response
    if (data.msg_type === 'history' && data.history) {
      if (data.echo_req && typeof data.echo_req === 'object') {
        const reqSymbol = (data.echo_req as { ticks_history?: string }).ticks_history;
        if (reqSymbol && reqSymbol !== this.currentSymbol.symbol) {
          return; // Ignore history response for previous symbol
        }
      }

      const history = data.history as { prices?: number[]; times?: number[] };
      if (history.prices && history.times) {
        const tickList: TickData[] = [];
        let prevPrice = history.prices[0] || 0;

        for (let i = 0; i < history.prices.length; i++) {
          const quote = history.prices[i];
          const epoch = history.times[i];
          const digit = extractLastDigit(quote, this.currentSymbol.pip_size);
          const change = i === 0 ? 0 : quote - prevPrice;
          prevPrice = quote;

          const dateObj = new Date(epoch * 1000);
          const hh = String(dateObj.getHours()).padStart(2, '0');
          const mm = String(dateObj.getMinutes()).padStart(2, '0');
          const ss = String(dateObj.getSeconds()).padStart(2, '0');
          const ms = String(dateObj.getMilliseconds()).padStart(3, '0');
          const timestampStr = `${hh}:${mm}:${ss}.${ms}`;

          tickList.push({
            epoch,
            quote,
            symbol: this.currentSymbol.symbol,
            pip_size: this.currentSymbol.pip_size,
            digit,
            change,
            timestampStr,
          });
        }

        if (tickList.length > 0) {
          this.lastQuote = tickList[tickList.length - 1].quote;
        }
        this.lastTickTime = Date.now();

        if (this.callbacks.onHistory) {
          this.callbacks.onHistory(tickList);
        }
      }
      return;
    }

    // Handle single live tick update instantly in milliseconds
    if (data.tick) {
      const nowMs = Date.now();
      this.lastTickTime = nowMs;
      const tickObj = data.tick as { quote: number; epoch: number; symbol: string; pip_size?: number; id?: string };
      if (tickObj.symbol && tickObj.symbol !== this.currentSymbol.symbol) {
        return; // Ignore tick for previous symbol subscription
      }

      const pipSize = tickObj.pip_size || this.currentSymbol.pip_size;
      const quote = tickObj.quote;
      const epoch = tickObj.epoch || Math.floor(nowMs / 1000);
      const digit = extractLastDigit(quote, pipSize);
      const change = this.lastQuote !== null ? quote - this.lastQuote : 0;
      this.lastQuote = quote;

      // Calculate millisecond latency & exact millisecond timestamp
      const serverMs = epoch * 1000;
      const latencyMs = Math.max(1, Math.min(999, Math.round(nowMs - serverMs)));
      
      const dateObj = new Date(nowMs);
      const hh = String(dateObj.getHours()).padStart(2, '0');
      const mm = String(dateObj.getMinutes()).padStart(2, '0');
      const ss = String(dateObj.getSeconds()).padStart(2, '0');
      const ms = String(dateObj.getMilliseconds()).padStart(3, '0');
      const timestampStr = `${hh}:${mm}:${ss}.${ms}`;

      const tickData: TickData = {
        epoch,
        quote,
        symbol: tickObj.symbol || this.currentSymbol.symbol,
        pip_size: pipSize,
        digit,
        change,
        timestampStr,
        latencyMs,
      };

      if (this.callbacks.onTick) {
        this.callbacks.onTick(tickData);
      }
    }
  }

  private startPingLoop() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.watchdogInterval) clearInterval(this.watchdogInterval);

    this.lastTickTime = Date.now();

    // Deriv 12-second Heartbeat
    this.pingInterval = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.pingStartTime = performance.now();
        this.ws.send(JSON.stringify({ ping: 1 }));
      }
    }, 12000);

    // Anti-Freeze Watchdog: Detect silent stall/freeze if no tick received for 15s while connected
    this.watchdogInterval = window.setInterval(() => {
      if (this.status === 'connected' && Date.now() - this.lastTickTime > 15000) {
        console.warn('Deriv WebSocket frozen (no ticks for 15s). Triggering failover reconnection...');
        this.serverIndex = (this.serverIndex + 1) % DEFAULT_SERVERS.length;
        this.connect(this.currentSymbol, this.historyCount);
      }
    }, 3000);
  }

  public changeSymbol(symbol: DerivSymbol, historyCount: number = 1000) {
    this.currentSymbol = symbol;
    this.historyCount = historyCount;
    this.lastQuote = null;
    this.sendSubscriptions();
  }

  public changeHistoryCount(historyCount: number) {
    this.historyCount = historyCount;
    this.sendSubscriptions();
  }

  public subscribeToLiveTicks() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect(this.currentSymbol, this.historyCount);
      return;
    }
    this.sendSubscriptions();
  }

  public disconnect() {
    this.cleanup();
    this.setStatus('disconnected');
  }

  private cleanup() {
    this.activeWsId++;
    if (this.ws) {
      const oldWs = this.ws;
      this.ws = null;
      oldWs.onopen = null;
      oldWs.onmessage = null;
      oldWs.onerror = null;
      oldWs.onclose = null;
      try {
        if (oldWs.readyState === WebSocket.OPEN || oldWs.readyState === WebSocket.CONNECTING) {
          oldWs.send(JSON.stringify({ forget_all: 'ticks' }));
          oldWs.close();
        }
      } catch {
        // ignore
      }
    }

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.watchdogInterval) {
      clearInterval(this.watchdogInterval);
      this.watchdogInterval = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

export const derivWsService = new DerivWsService();
