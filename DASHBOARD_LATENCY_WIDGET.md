# LatencyMonitor Dashboard Widget Guide

## Location

The LatencyMonitor widget appears in the **left sidebar** of the main dashboard, positioned between **TickFlowMetrics** and **CursorTracker** components.

## Visual Layout

```
┌─────────────────────────────────┐
│ 📡 LATENCY MONITOR      REALTIME │
├─────────────────────────────────┤
│                                 │
│          45 ms                  │
│      Current Latency            │
│                                 │
├─────────────────────────────────┤
│ Average      │    P95           │
│   38 ms      │   52 ms          │
├─────────────────────────────────┤
│ Tick Flow Rate                  │
│   8 ticks/sec                   │
├─────────────────────────────────┤
│ ✓ Connected & Receiving Ticks   │
└─────────────────────────────────┘
```

## Visual States

### Green State (Excellent: < 50ms)
```
        45 ms              ← Green text
   Current Latency
   Average: 38ms
   P95: 45ms
   ✓ Connected & Receiving Ticks
```
Status: All systems optimal, ticks flowing perfectly

### Yellow State (Good: 50-100ms)
```
        68 ms              ← Yellow text
   Current Latency
   Average: 62ms
   P95: 78ms
   ✓ Connected & Receiving Ticks
```
Status: Normal operation, slight latency but acceptable

### Orange State (Acceptable: 100-200ms)
```
        145 ms             ← Orange text
   Current Latency
   Average: 128ms
   P95: 162ms
   ✓ Connected & Receiving Ticks
```
Status: Noticeable latency, investigate network conditions

### Red State (Degraded: > 200ms)
```
        287 ms             ← Red text
   Current Latency
   Average: 256ms
   P95: 312ms
   ✓ Connected & Receiving Ticks

   ⚠️ High latency detected.
      Network conditions may be degraded.
```
Status: Serious latency issue, action recommended

## Trend Indicators

The widget shows the direction of latency changes:

### 📈 Increasing Trend
- Latency is rising
- Indicates network degradation
- Watch for threshold crossing

### 📉 Decreasing Trend
- Latency is falling
- Indicates network recovery
- Network improving

### ➡️ Stable Trend
- Latency holding steady
- No significant changes
- Normal operation

## Metrics Explained

### Current Latency
**What:** The latency of the most recently received tick
**Why:** Shows real-time network performance
**Target:** < 50ms
**Formula:** Local time received - Server epoch time

```
Example:
Server tick timestamp: 1719871234.000 (seconds)
Server timestamp ms:   1719871234000 (milliseconds)
Local time received:   1719871234045 (milliseconds)
Current latency:       45 ms
```

### Average Latency
**What:** Mean latency of the last 100 ticks
**Why:** Shows sustained network performance
**Target:** < 50ms
**Use:** Better for trend analysis than current

```
Last 100 tick latencies: [45, 52, 48, 55, 61, 49, 53, 47, 50, 58, ...]
Average = Sum / Count = 5,147 / 100 = 51.47ms ≈ 51ms
```

### P95 Latency (95th Percentile)
**What:** The latency value where 95% of ticks are faster
**Why:** SLA metric - captures worst-case performance
**Target:** < 150ms
**Use:** For performance SLAs and capacity planning

```
100 latencies sorted: [42, 43, 44, ..., 58, 59, 60]
95th percentile (position 95): 58ms

Meaning: 95% of ticks had latency ≤ 58ms
         5% of ticks had latency > 58ms
```

### Tick Flow Rate
**What:** Real-time number of ticks received per second
**Why:** Verifies continuous tick stream
**Target:** 5-10 ticks/sec typical
**Formula:** Count of tick timestamps from last 1000ms

```
Tick timestamps in last second: [t1, t2, t3, t4, t5, t6, t7, t8]
Tick flow rate: 8 ticks/sec
```

## Color Coding Reference

| Color | Latency Range | Indicator | Action |
|-------|---|---|---|
| 🟢 Green | < 50ms | ✓ Excellent | Continue monitoring |
| 🟡 Yellow | 50-100ms | ⚠ Good | Monitor trend |
| 🟠 Orange | 100-200ms | ⚠ Acceptable | Check network |
| 🔴 Red | > 200ms | 🔴 Degraded | Investigate/Alert |

## Status Indicators

### Connection Status
Shows whether WebSocket is connected and receiving ticks:

```
✓ Connected & Receiving Ticks   ← Green dot: All good
⚠ Connection Lost              ← Red dot: Problem
```

### High Latency Warning
Appears when latency exceeds 200ms:

```
⚠️ High latency detected.
   Network conditions may be degraded.
```

## Interactive Behavior

### Auto-Updates
- Updates every **100ms** with new tick data
- No manual refresh needed
- Smooth real-time display

### Smooth Transitions
- Color changes animate smoothly
- Trend changes appear instantly
- No jarring UI updates

### Responsive Design
- Compact on mobile (⅓ width)
- Full width on desktop
- Always visible in left sidebar

## Console Logs (Browser DevTools)

Open DevTools (F12) and check Console tab for health logs:

### Normal Operation
```
✓ Tick Flow Healthy | Latency: 45ms (avg: 38ms) | Rate: 8 ticks/sec
✓ Tick Flow Healthy | Latency: 52ms (avg: 41ms) | Rate: 9 ticks/sec
✓ Tick Flow Healthy | Latency: 48ms (avg: 42ms) | Rate: 8 ticks/sec
```
Logs appear every 5 seconds when connected

### High Latency Alert
```
⏱️ High latency detected: 520ms average (p95: 680ms)
```
Appears when average latency exceeds 500ms

### Stall Warning
```
⏰ Tick flow warning: 15200ms since last tick. Watchdog monitoring...
```
Appears when no ticks for 15+ seconds

### Failover Triggered
```
⚠️ Tick flow stalled for 20120ms. Initiating failover reconnection...
```
Appears when no ticks for 20+ seconds (automatic recovery starts)

## Performance Impact

The LatencyMonitor widget:
- ✓ Uses < 1% CPU
- ✓ Updates at 10 Hz (not 60 fps for efficiency)
- ✓ Requires ~2KB memory
- ✓ No network overhead (uses existing ticks)
- ✓ Batches all rendering with main tick updates

## Troubleshooting

### Widget Not Updating
**Check:**
1. Is dashboard showing ticks? (Check ContinuousTickFeed tab)
2. Are console logs appearing every 5 seconds?
3. Is latencyMetrics prop being passed correctly?

**Fix:**
```tsx
// Ensure App.tsx has latencyMetrics
const { latencyMetrics } = useDerivEngine();

// Ensure LatencyMonitor is imported
import { LatencyMonitor } from './components/LatencyMonitor';

// Ensure props are passed
<LatencyMonitor
  latencyMs={latencyMetrics.current}
  averageLatency={latencyMetrics.average}
  p95Latency={latencyMetrics.p95}
  ticksPerSecond={latencyMetrics.ticksPerSecond}
  isConnected={connectionStatus === 'connected'}
/>
```

### Always Red/High Latency
**Possible Causes:**
1. Network congestion - check your internet
2. Server load - try different server
3. Geographic distance - ticks take time to travel
4. Browser background tab - activate tab

**Check:**
- Is P95 also high? (Yes = real network issue)
- Are other ticks arriving? (Yes = temporary spike)
- What's the tick rate? (> 5 = stream OK)

### Widget Shows Disconnected
**Check:**
1. Connection status in Header
2. Console for error messages
3. WebSocket network tab (F12 → Network)
4. Try reconnecting with Settings

## Testing Latency

### Manual Monitoring
1. Open app and go to Dashboard tab
2. Look at LatencyMonitor in left sidebar
3. Open DevTools (F12) to see console logs
4. Watch for changes as ticks arrive

### Simulate High Latency
In browser console:
```javascript
// Temporarily throttle to 4G (adds ~100ms latency)
// DevTools → Network tab → Select "4G" speed
```

### Test Failover
In browser console:
```javascript
// Force disconnect (triggers watchdog at 20s)
derivWsService.disconnect();
// Watch as it reconnects automatically
```

## Real-World Examples

### Example 1: Perfect Connection
```
Current Latency: 45 ms (Green)
Average: 38 ms
P95: 52 ms
Rate: 9 ticks/sec
Status: ✓ Connected

→ All systems optimal
```

### Example 2: Network Congestion
```
Current Latency: 156 ms (Orange)
Average: 142 ms
P95: 189 ms
Rate: 7 ticks/sec
Status: ✓ Connected

⚠️ High latency detected.

→ Network degradation detected, still receiving ticks
```

### Example 3: Connection Issue
```
Current Latency: 0 ms
Average: 0 ms
P95: 0 ms
Rate: 0 ticks/sec
Status: ⚠ Connection Lost

→ Watchdog will trigger failover in 20 seconds
```

## Dashboard Integration

The LatencyMonitor sits in the left sidebar with:
- **Above:** TickFlowMetrics (batching performance)
- **Below:** CursorTracker (target tracking)

This positioning gives you:
1. **Connection Health** (Header: Connection Status, Ping)
2. **Tick Flow** (TickFlowMetrics: Health score)
3. **Latency** (LatencyMonitor: ← YOU ARE HERE)
4. **Tick Status** (CursorTracker: Where we are now)

Together they provide complete visibility into:
✓ Network connection quality
✓ Tick batching performance
✓ Network latency and jitter
✓ Live price position

## Summary

The LatencyMonitor widget provides **real-time visibility** into tick delivery performance with:
- **Current latency** (green/yellow/orange/red)
- **Average performance** (sustained trend)
- **95th percentile** (SLA monitoring)
- **Tick flow rate** (continuous delivery)
- **Trend indicators** (direction of change)
- **Auto-alerts** (high latency warnings)

**Result:** You always know if ticks are arriving on time and can spot network issues immediately.
