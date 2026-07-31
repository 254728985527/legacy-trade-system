# Deriv Last Digit Prediction & Live Tick Analysis

A real-time trading analysis dashboard for Deriv Volatility Indices featuring **live WebSocket tick streaming**, AI-powered digit distribution analysis, and automated trade signals.

## 🎯 Key Features

### ⚡ Real-Time Tick Monitoring (Primary Focus)
- **Live Incoming Ticks Display** - Prominently showcased with animated grid visualization of the last 50 ticks
- **Tick Ring Gauge** - Live rotating indicator showing the latest digit with price change tracking
- **Connection Status** - Real-time connection monitoring with ping latency display
- **Digit Frequency Heatmap** - Visual distribution analysis of digits in recent ticks
- **Auto-Refreshing Updates** - New ticks appear instantly with animation

### 📊 Advanced Analytics
- **Digit Range Analysis** - Breakdown of 0-4 (UNDER) vs 5-9 (OVER) distribution
- **Strength Ranking** - Top and bottom performing digits based on recent data
- **AI Workflow Steps** - Multi-step analysis pipeline for trade signal generation
- **Cursor Tracker** - Distance calculation between current and target digits

### 🎲 Trading Signals
- **Smart Recommendations** - Automated "TAKE TRADE" or "WAIT" signals with confidence levels
- **Direction Prediction** - OVER/UNDER predictions with percentage confidence scores
- **Key Digits Card** - Highest, second-highest, and lowest performing digits
- **Execution Events** - Real-time trade execution tracking

### 📈 Multiple Visualizations
- **Incoming Ticks Tab** - Full-screen focus on live tick visualization
- **Tick Stream Table** - Detailed log of all ticks with timestamps and changes
- **Live Data Stream** - Real-time price feed with streaming updates
- **Sparkline Chart** - Historical price movement visualization
- **Continuous Tick Feed** - Fast-scrolling ticker updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation & Running

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open `http://localhost:3000` in your browser.

## 📊 Dashboard Navigation

1. **DASHBOARD** - Overview of all metrics and analysis
2. **INCOMING TICKS** ⭐ - **Focused view on live tick visualization** (primary feature)
3. **TICK STREAM** - Detailed table of all incoming ticks
4. **SPARKLINE** - Price chart visualization
5. **LIVE DATA** - Streaming price updates
6. **CONTINUOUS TICKS** - Fast-scrolling ticker

## ⚙️ Configuration

### Settings Modal
Click the settings icon in the header to configure:
- **App ID**: Deriv API application ID (default: 1089)
- **Server URL**: WebSocket server (default: ws.derivws.com)

### Sample Window
Adjust data window size to balance responsiveness vs stability:
- Small (100-500): Recent data, quick response
- Large (1000-5000): More stable, trend analysis

## 🔊 Audio Notifications

- **Toggle Sound**: Click speaker icon in header
- **Tick Sound**: Plays on every incoming tick
- **Execution Sound**: Plays when trade signal triggers
- **Target Hit Sound**: Plays when target digit reached

## 📡 Supported Symbols

### Continuous Indices
1HZ100V, 1HZ10V, 1HZ25V, 1HZ50V, 1HZ75V, R_10, R_25, R_50, R_75, R_100

### Jump Indices
JD10, JD25, JD50, JD75, JD100

### Daily Land Indices
RDBULL, RDBEAR

## 🎨 Design

- Built with Next.js 16 & React 19
- Tailwind CSS v4 with custom gold theme
- Real-time animations for tick visualization
- Fully responsive (mobile, tablet, desktop)
- Dark mode optimized UI

## 📝 Usage Tips

1. **Start with "INCOMING TICKS" tab** to monitor live tick flow
2. **Watch the animated grid** for digit patterns
3. **Check Signal Card** for AI predictions
4. **Monitor Connection Status** in header
5. **Adjust Sample Window** for your analysis needs

## 🔧 Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- lucide-react (icons)
- shadcn/ui (components)
- WebSocket API

## 📄 License

Created with v0 by Vercel.
