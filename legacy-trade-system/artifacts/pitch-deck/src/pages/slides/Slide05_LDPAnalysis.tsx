export default function Slide05_LDPAnalysis() {
  const digits = [
    { d: "0", pct: 8, hot: false },
    { d: "1", pct: 12, hot: true },
    { d: "2", pct: 6, hot: false },
    { d: "3", pct: 14, hot: true },
    { d: "4", pct: 9, hot: false },
    { d: "5", pct: 11, hot: false },
    { d: "6", pct: 4, hot: false },
    { d: "7", pct: 16, hot: true },
    { d: "8", pct: 10, hot: false },
    { d: "9", pct: 10, hot: false },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 85% 30%, rgba(240,136,62,0.06) 0%, transparent 60%), linear-gradient(160deg, #080c15 0%, #0d1521 100%)",
        }}
      />

      <div className="absolute inset-0 flex">
        <div className="flex flex-col justify-center pl-[8vw] w-[44vw]">
          <span
            className="font-body uppercase tracking-widest mb-[2vh]"
            style={{ fontSize: "1.2vw", color: "var(--slide-gold)" }}
          >
            Analysis Engine
          </span>
          <h2
            className="font-display font-bold tracking-tight text-text leading-tight"
            style={{ fontSize: "4.8vw", textWrap: "balance" }}
          >
            LDP Signal
          </h2>

          <div
            className="mt-[2vh] mb-[3vh]"
            style={{
              height: "2px",
              width: "7vw",
              background: "linear-gradient(90deg, var(--slide-gold), transparent)",
            }}
          />

          <p
            className="font-body leading-relaxed"
            style={{
              fontSize: "2.3vw",
              color: "var(--slide-muted)",
              textWrap: "pretty",
            }}
          >
            Last Digit Prediction analysis tracks the frequency of each digit
            0–9 across the last 150+ ticks, surfacing hot (over-represented) and
            cold (under-represented) digits in real time.
          </p>

          <div className="mt-[3.5vh] flex gap-[2vw]">
            <div
              className="px-[1.6vw] py-[1vh] rounded-[0.5vw]"
              style={{
                background: "rgba(222,0,64,0.1)",
                border: "1px solid rgba(222,0,64,0.25)",
              }}
            >
              <div
                className="font-body font-medium"
                style={{ fontSize: "1.8vw", color: "var(--slide-accent)" }}
              >
                HOT
              </div>
              <div
                className="font-display font-bold"
                style={{ fontSize: "2.8vw", color: "var(--slide-accent)" }}
              >
                1, 3, 7
              </div>
            </div>
            <div
              className="px-[1.6vw] py-[1vh] rounded-[0.5vw]"
              style={{
                background: "rgba(139,148,158,0.08)",
                border: "1px solid rgba(139,148,158,0.15)",
              }}
            >
              <div
                className="font-body font-medium"
                style={{ fontSize: "1.8vw", color: "var(--slide-muted)" }}
              >
                COLD
              </div>
              <div
                className="font-display font-bold"
                style={{ fontSize: "2.8vw", color: "var(--slide-muted)" }}
              >
                2, 6
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center pl-[4vw] pr-[6vw] w-[56vw]">
          <div
            className="p-[2.5vw] rounded-[1vw]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="font-body uppercase tracking-widest mb-[2vh]"
              style={{ fontSize: "1.1vw", color: "var(--slide-muted)" }}
            >
              Digit Frequency — Last 150 Ticks
            </div>
            <div className="flex items-end gap-[1.2vw]" style={{ height: "28vh" }}>
              <div className="flex flex-col items-center gap-[1vh]" style={{ width: "6.5vw" }}>
                <span className="font-display font-bold" style={{ fontSize: "2.2vw", color: "rgba(139,148,158,0.6)" }}>8%</span>
                <div className="w-full rounded-t-[0.3vw]" style={{ height: "22%", background: "rgba(139,148,158,0.3)" }} />
                <span className="font-display font-bold" style={{ fontSize: "2.4vw", color: "var(--slide-muted)" }}>0</span>
              </div>
              <div className="flex flex-col items-center gap-[1vh]" style={{ width: "6.5vw" }}>
                <span className="font-display font-bold" style={{ fontSize: "2.2vw", color: "var(--slide-accent)" }}>12%</span>
                <div className="w-full rounded-t-[0.3vw]" style={{ height: "33%", background: "linear-gradient(180deg, #de0040, #9b0028)" }} />
                <span className="font-display font-bold" style={{ fontSize: "2.4vw", color: "var(--slide-accent)" }}>1</span>
              </div>
              <div className="flex flex-col items-center gap-[1vh]" style={{ width: "6.5vw" }}>
                <span className="font-display font-bold" style={{ fontSize: "2.2vw", color: "rgba(139,148,158,0.6)" }}>6%</span>
                <div className="w-full rounded-t-[0.3vw]" style={{ height: "17%", background: "rgba(139,148,158,0.3)" }} />
                <span className="font-display font-bold" style={{ fontSize: "2.4vw", color: "var(--slide-muted)" }}>2</span>
              </div>
              <div className="flex flex-col items-center gap-[1vh]" style={{ width: "6.5vw" }}>
                <span className="font-display font-bold" style={{ fontSize: "2.2vw", color: "var(--slide-accent)" }}>14%</span>
                <div className="w-full rounded-t-[0.3vw]" style={{ height: "39%", background: "linear-gradient(180deg, #de0040, #9b0028)" }} />
                <span className="font-display font-bold" style={{ fontSize: "2.4vw", color: "var(--slide-accent)" }}>3</span>
              </div>
              <div className="flex flex-col items-center gap-[1vh]" style={{ width: "6.5vw" }}>
                <span className="font-display font-bold" style={{ fontSize: "2.2vw", color: "rgba(139,148,158,0.6)" }}>9%</span>
                <div className="w-full rounded-t-[0.3vw]" style={{ height: "25%", background: "rgba(139,148,158,0.3)" }} />
                <span className="font-display font-bold" style={{ fontSize: "2.4vw", color: "var(--slide-muted)" }}>4</span>
              </div>
              <div className="flex flex-col items-center gap-[1vh]" style={{ width: "6.5vw" }}>
                <span className="font-display font-bold" style={{ fontSize: "2.2vw", color: "rgba(139,148,158,0.6)" }}>11%</span>
                <div className="w-full rounded-t-[0.3vw]" style={{ height: "30%", background: "rgba(139,148,158,0.3)" }} />
                <span className="font-display font-bold" style={{ fontSize: "2.4vw", color: "var(--slide-muted)" }}>5</span>
              </div>
              <div className="flex flex-col items-center gap-[1vh]" style={{ width: "6.5vw" }}>
                <span className="font-display font-bold" style={{ fontSize: "2.2vw", color: "rgba(139,148,158,0.6)" }}>4%</span>
                <div className="w-full rounded-t-[0.3vw]" style={{ height: "11%", background: "rgba(139,148,158,0.3)" }} />
                <span className="font-display font-bold" style={{ fontSize: "2.4vw", color: "var(--slide-muted)" }}>6</span>
              </div>
              <div className="flex flex-col items-center gap-[1vh]" style={{ width: "6.5vw" }}>
                <span className="font-display font-bold" style={{ fontSize: "2.2vw", color: "var(--slide-accent)" }}>16%</span>
                <div className="w-full rounded-t-[0.3vw]" style={{ height: "44%", background: "linear-gradient(180deg, #de0040, #9b0028)" }} />
                <span className="font-display font-bold" style={{ fontSize: "2.4vw", color: "var(--slide-accent)" }}>7</span>
              </div>
              <div className="flex flex-col items-center gap-[1vh]" style={{ width: "6.5vw" }}>
                <span className="font-display font-bold" style={{ fontSize: "2.2vw", color: "rgba(139,148,158,0.6)" }}>10%</span>
                <div className="w-full rounded-t-[0.3vw]" style={{ height: "28%", background: "rgba(139,148,158,0.3)" }} />
                <span className="font-display font-bold" style={{ fontSize: "2.4vw", color: "var(--slide-muted)" }}>8</span>
              </div>
              <div className="flex flex-col items-center gap-[1vh]" style={{ width: "6.5vw" }}>
                <span className="font-display font-bold" style={{ fontSize: "2.2vw", color: "rgba(139,148,158,0.6)" }}>10%</span>
                <div className="w-full rounded-t-[0.3vw]" style={{ height: "28%", background: "rgba(139,148,158,0.3)" }} />
                <span className="font-display font-bold" style={{ fontSize: "2.4vw", color: "var(--slide-muted)" }}>9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(240,136,62,0.4), transparent)",
        }}
      />
    </div>
  );
}
