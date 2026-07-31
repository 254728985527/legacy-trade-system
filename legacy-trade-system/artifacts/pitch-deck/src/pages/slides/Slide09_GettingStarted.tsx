export default function Slide09_GettingStarted() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,195,144,0.06) 0%, transparent 60%), linear-gradient(160deg, #080c15 0%, #0d1521 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-center px-[8vw]">
        <div className="mb-[2vh]">
          <span
            className="font-body uppercase tracking-widest"
            style={{ fontSize: "1.2vw", color: "var(--slide-muted)" }}
          >
            Getting Started
          </span>
        </div>

        <h2
          className="font-display font-bold tracking-tight text-text leading-tight mb-[1.5vh]"
          style={{ fontSize: "5vw" }}
        >
          Three steps to your first trade
        </h2>

        <div
          className="mb-[5vh]"
          style={{
            height: "2px",
            width: "6vw",
            background: "linear-gradient(90deg, var(--slide-primary), transparent)",
          }}
        />

        <div className="flex gap-[3vw] items-stretch">
          <div
            className="flex-1 p-[3vw] rounded-[1vw] relative"
            style={{
              background: "rgba(0,195,144,0.06)",
              border: "1px solid rgba(0,195,144,0.2)",
            }}
          >
            <div
              className="font-display font-extrabold leading-none mb-[2vh]"
              style={{ fontSize: "8vw", color: "rgba(0,195,144,0.15)" }}
            >
              1
            </div>
            <div
              className="font-display font-bold text-text mb-[1vh]"
              style={{ fontSize: "2.8vw" }}
            >
              Connect
            </div>
            <div
              className="font-body text-muted leading-relaxed"
              style={{ fontSize: "2.1vw" }}
            >
              Log in with your Deriv account. Switch between Demo and Real balance instantly.
            </div>
          </div>

          <div
            className="flex items-center"
            style={{ color: "var(--slide-muted)", fontSize: "3vw" }}
          >
            →
          </div>

          <div
            className="flex-1 p-[3vw] rounded-[1vw] relative"
            style={{
              background: "rgba(240,136,62,0.06)",
              border: "1px solid rgba(240,136,62,0.2)",
            }}
          >
            <div
              className="font-display font-extrabold leading-none mb-[2vh]"
              style={{ fontSize: "8vw", color: "rgba(240,136,62,0.15)" }}
            >
              2
            </div>
            <div
              className="font-display font-bold text-text mb-[1vh]"
              style={{ fontSize: "2.8vw" }}
            >
              Analyze
            </div>
            <div
              className="font-body text-muted leading-relaxed"
              style={{ fontSize: "2.1vw" }}
            >
              Read the live digit stats and LDP signal. Spot hot and cold digits before placing a contract.
            </div>
          </div>

          <div
            className="flex items-center"
            style={{ color: "var(--slide-muted)", fontSize: "3vw" }}
          >
            →
          </div>

          <div
            className="flex-1 p-[3vw] rounded-[1vw] relative"
            style={{
              background: "rgba(222,0,64,0.06)",
              border: "1px solid rgba(222,0,64,0.2)",
            }}
          >
            <div
              className="font-display font-extrabold leading-none mb-[2vh]"
              style={{ fontSize: "8vw", color: "rgba(222,0,64,0.15)" }}
            >
              3
            </div>
            <div
              className="font-display font-bold text-text mb-[1vh]"
              style={{ fontSize: "2.8vw" }}
            >
              Trade
            </div>
            <div
              className="font-body text-muted leading-relaxed"
              style={{ fontSize: "2.1vw" }}
            >
              Place a manual contract or activate Auto-Trading. Results appear in real time.
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
