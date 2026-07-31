export default function Slide02_Opportunity() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #0d1521 0%, #080c15 60%, #0d1117 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-center pl-[8vw] pr-[8vw]">
        <div className="mb-[3vh]">
          <span
            className="font-body uppercase tracking-widest"
            style={{ fontSize: "1.2vw", color: "var(--slide-gold)" }}
          >
            The Opportunity
          </span>
        </div>

        <h2
          className="font-display font-bold tracking-tight text-text leading-tight"
          style={{ fontSize: "5vw", textWrap: "balance" }}
        >
          Binary options are high-frequency,
          <span style={{ color: "var(--slide-primary)" }}> high-stakes</span>,
          and underserved by modern tooling.
        </h2>

        <div
          className="mt-[2.5vh] mb-[4vh]"
          style={{
            height: "2px",
            width: "8vw",
            background: "linear-gradient(90deg, var(--slide-primary), transparent)",
          }}
        />

        <div className="grid grid-cols-3 gap-[3vw]">
          <div
            className="p-[2.5vw] rounded-[0.8vw]"
            style={{
              background: "rgba(0,195,144,0.06)",
              border: "1px solid rgba(0,195,144,0.15)",
            }}
          >
            <div
              className="font-display font-extrabold leading-none"
              style={{ fontSize: "9vw", color: "var(--slide-primary)" }}
            >
              2.2s
            </div>
            <div
              className="font-body text-muted mt-[1.5vh] leading-snug"
              style={{ fontSize: "2.2vw" }}
            >
              Average tick interval on Deriv volatility indices
            </div>
          </div>

          <div
            className="p-[2.5vw] rounded-[0.8vw]"
            style={{
              background: "rgba(240,136,62,0.06)",
              border: "1px solid rgba(240,136,62,0.15)",
            }}
          >
            <div
              className="font-display font-extrabold leading-none"
              style={{ fontSize: "9vw", color: "var(--slide-gold)" }}
            >
              150+
            </div>
            <div
              className="font-body text-muted mt-[1.5vh] leading-snug"
              style={{ fontSize: "2.2vw" }}
            >
              Ticks tracked in real-time for pattern analysis
            </div>
          </div>

          <div
            className="p-[2.5vw] rounded-[0.8vw]"
            style={{
              background: "rgba(222,0,64,0.06)",
              border: "1px solid rgba(222,0,64,0.15)",
            }}
          >
            <div
              className="font-display font-extrabold leading-none"
              style={{ fontSize: "9vw", color: "var(--slide-accent)" }}
            >
              6
            </div>
            <div
              className="font-body text-muted mt-[1.5vh] leading-snug"
              style={{ fontSize: "2.2vw" }}
            >
              Digit contract types in a single interface
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
