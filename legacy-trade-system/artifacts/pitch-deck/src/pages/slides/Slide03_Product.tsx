export default function Slide03_Product() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(0,195,144,0.05) 0%, transparent 60%), linear-gradient(135deg, #080c15 0%, #0d1521 100%)",
        }}
      />

      <div className="absolute inset-0 flex">
        <div className="flex flex-col justify-center pl-[8vw] w-[46vw]">
          <span
            className="font-body uppercase tracking-widest mb-[2vh]"
            style={{ fontSize: "1.2vw", color: "var(--slide-muted)" }}
          >
            The Product
          </span>
          <h2
            className="font-display font-bold tracking-tight text-text leading-tight"
            style={{ fontSize: "4.8vw", textWrap: "balance" }}
          >
            One app.
            <span style={{ color: "var(--slide-primary)" }}> Every edge.</span>
          </h2>

          <div
            className="mt-[2vh] mb-[3.5vh]"
            style={{
              height: "2px",
              width: "8vw",
              background: "linear-gradient(90deg, var(--slide-primary), transparent)",
            }}
          />

          <p
            className="font-body leading-relaxed"
            style={{
              fontSize: "2.4vw",
              color: "var(--slide-muted)",
              textWrap: "pretty",
            }}
          >
            Deriv Digits Trading combines real-time market analysis, digit
            frequency signals, and automated execution in a single focused
            interface — built for both web and native mobile.
          </p>
        </div>

        <div className="flex flex-col justify-center pl-[4vw] pr-[6vw] w-[54vw] gap-[2.5vh]">
          <div
            className="flex items-start gap-[2vw] p-[2.2vw] rounded-[0.8vw]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-[4vw] h-[4vw] rounded-[0.6vw] flex items-center justify-center font-display font-bold shrink-0"
              style={{
                background: "rgba(0,195,144,0.15)",
                color: "var(--slide-primary)",
                fontSize: "1.8vw",
              }}
            >
              #
            </div>
            <div>
              <div
                className="font-display font-bold text-text"
                style={{ fontSize: "2.4vw" }}
              >
                Digit Prediction
              </div>
              <div
                className="font-body text-muted mt-[0.5vh]"
                style={{ fontSize: "2vw" }}
              >
                Matches/Differs, Over/Under, Even/Odd — with hot/cold frequency signals
              </div>
            </div>
          </div>

          <div
            className="flex items-start gap-[2vw] p-[2.2vw] rounded-[0.8vw]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-[4vw] h-[4vw] rounded-[0.6vw] flex items-center justify-center font-display font-bold shrink-0"
              style={{
                background: "rgba(240,136,62,0.15)",
                color: "var(--slide-gold)",
                fontSize: "1.8vw",
              }}
            >
              ~
            </div>
            <div>
              <div
                className="font-display font-bold text-text"
                style={{ fontSize: "2.4vw" }}
              >
                LDP Analysis
              </div>
              <div
                className="font-body text-muted mt-[0.5vh]"
                style={{ fontSize: "2vw" }}
              >
                Real-time digit frequency with confidence scoring across 150+ ticks
              </div>
            </div>
          </div>

          <div
            className="flex items-start gap-[2vw] p-[2.2vw] rounded-[0.8vw]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-[4vw] h-[4vw] rounded-[0.6vw] flex items-center justify-center font-display font-bold shrink-0"
              style={{
                background: "rgba(222,0,64,0.15)",
                color: "var(--slide-accent)",
                fontSize: "1.8vw",
              }}
            >
              A
            </div>
            <div>
              <div
                className="font-display font-bold text-text"
                style={{ fontSize: "2.4vw" }}
              >
                Auto-Trading
              </div>
              <div
                className="font-body text-muted mt-[0.5vh]"
                style={{ fontSize: "2vw" }}
              >
                Automated execution every 2.2s with configurable stake and martingale
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
            "linear-gradient(90deg, transparent, rgba(0,195,144,0.3), transparent)",
        }}
      />
    </div>
  );
}
