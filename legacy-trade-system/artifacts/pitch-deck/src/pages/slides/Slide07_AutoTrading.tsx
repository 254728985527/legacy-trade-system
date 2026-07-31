export default function Slide07_AutoTrading() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(240,136,62,0.05) 0%, transparent 65%), linear-gradient(160deg, #0d1521 0%, #080c15 100%)",
        }}
      />

      <div className="absolute inset-0 flex items-center px-[8vw]">
        <div className="w-[40vw] pr-[4vw]">
          <span
            className="font-body uppercase tracking-widest"
            style={{ fontSize: "1.2vw", color: "var(--slide-gold)" }}
          >
            Automation
          </span>
          <h2
            className="font-display font-bold tracking-tight text-text leading-tight mt-[1.5vh]"
            style={{ fontSize: "4.8vw", textWrap: "balance" }}
          >
            Auto-Trading
          </h2>

          <div
            className="mt-[2vh] mb-[3vh]"
            style={{
              height: "2px",
              width: "7vw",
              background: "linear-gradient(90deg, var(--slide-gold), transparent)",
            }}
          />

          <div className="flex flex-col gap-[2vh]">
            <div className="flex items-start gap-[1.5vw]">
              <div
                className="w-[2.5vw] h-[2.5vw] rounded-full shrink-0 flex items-center justify-center font-display font-bold"
                style={{
                  background: "rgba(240,136,62,0.15)",
                  color: "var(--slide-gold)",
                  fontSize: "1.4vw",
                  marginTop: "0.3vh",
                }}
              >
                1
              </div>
              <p
                className="font-body leading-snug"
                style={{ fontSize: "2.3vw", color: "var(--slide-muted)", textWrap: "pretty" }}
              >
                Set your stake amount and contract type
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div
                className="w-[2.5vw] h-[2.5vw] rounded-full shrink-0 flex items-center justify-center font-display font-bold"
                style={{
                  background: "rgba(240,136,62,0.15)",
                  color: "var(--slide-gold)",
                  fontSize: "1.4vw",
                  marginTop: "0.3vh",
                }}
              >
                2
              </div>
              <p
                className="font-body leading-snug"
                style={{ fontSize: "2.3vw", color: "var(--slide-muted)", textWrap: "pretty" }}
              >
                Configure martingale multiplier for loss recovery
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div
                className="w-[2.5vw] h-[2.5vw] rounded-full shrink-0 flex items-center justify-center font-display font-bold"
                style={{
                  background: "rgba(240,136,62,0.15)",
                  color: "var(--slide-gold)",
                  fontSize: "1.4vw",
                  marginTop: "0.3vh",
                }}
              >
                3
              </div>
              <p
                className="font-body leading-snug"
                style={{ fontSize: "2.3vw", color: "var(--slide-muted)", textWrap: "pretty" }}
              >
                Hit Run Auto — trades execute every 2.2 seconds
              </p>
            </div>
          </div>
        </div>

        <div className="w-[52vw] grid grid-cols-2 gap-[2vw]">
          <div
            className="p-[2.5vw] rounded-[0.8vw] flex flex-col items-center justify-center text-center"
            style={{
              background: "rgba(240,136,62,0.07)",
              border: "1px solid rgba(240,136,62,0.2)",
            }}
          >
            <div
              className="font-display font-extrabold leading-none"
              style={{ fontSize: "11vw", color: "var(--slide-gold)" }}
            >
              2.2
            </div>
            <div
              className="font-body font-medium mt-[1vh]"
              style={{ fontSize: "2.2vw", color: "var(--slide-gold)" }}
            >
              seconds per trade
            </div>
          </div>

          <div className="flex flex-col gap-[2vw]">
            <div
              className="p-[2vw] rounded-[0.8vw] flex-1"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="font-display font-bold"
                style={{ fontSize: "2.8vw", color: "var(--slide-text)" }}
              >
                Martingale
              </div>
              <div
                className="font-body text-muted mt-[0.5vh]"
                style={{ fontSize: "2vw" }}
              >
                Auto-multiplies stake after a loss to recover
              </div>
            </div>

            <div
              className="p-[2vw] rounded-[0.8vw] flex-1"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="font-display font-bold"
                style={{ fontSize: "2.8vw", color: "var(--slide-text)" }}
              >
                Demo Mode
              </div>
              <div
                className="font-body text-muted mt-[0.5vh]"
                style={{ fontSize: "2vw" }}
              >
                Test strategies with virtual balance before going live
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
