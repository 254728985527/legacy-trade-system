export default function Slide04_DigitTrading() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 20% 80%, rgba(0,195,144,0.07) 0%, transparent 60%), linear-gradient(135deg, #0d1521 0%, #080c15 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-center px-[8vw]">
        <div className="mb-[2vh]">
          <span
            className="font-body uppercase tracking-widest"
            style={{ fontSize: "1.2vw", color: "var(--slide-primary)" }}
          >
            Core Feature
          </span>
        </div>

        <h2
          className="font-display font-bold tracking-tight text-text leading-tight mb-[1.5vh]"
          style={{ fontSize: "5vw" }}
        >
          Digit Trading
        </h2>

        <div
          className="mb-[4vh]"
          style={{
            height: "2px",
            width: "6vw",
            background: "linear-gradient(90deg, var(--slide-primary), transparent)",
          }}
        />

        <div className="grid grid-cols-3 gap-[2.5vw]">
          <div
            className="p-[2.5vw] rounded-[0.8vw]"
            style={{
              background: "rgba(0,195,144,0.07)",
              border: "1px solid rgba(0,195,144,0.2)",
            }}
          >
            <div
              className="font-display font-bold mb-[1.5vh]"
              style={{ fontSize: "2.6vw", color: "var(--slide-primary)" }}
            >
              Over / Under
            </div>
            <div
              className="font-body text-muted leading-relaxed"
              style={{ fontSize: "2.1vw" }}
            >
              Predict whether the last digit will be above or below a chosen barrier (0–9).
            </div>
            <div className="flex gap-[0.8vw] mt-[2vh]">
              <div
                className="px-[1.2vw] py-[0.4vh] rounded-full font-body"
                style={{
                  fontSize: "1.8vw",
                  background: "rgba(0,195,144,0.12)",
                  color: "var(--slide-primary)",
                }}
              >
                O/U
              </div>
            </div>
          </div>

          <div
            className="p-[2.5vw] rounded-[0.8vw]"
            style={{
              background: "rgba(240,136,62,0.07)",
              border: "1px solid rgba(240,136,62,0.2)",
            }}
          >
            <div
              className="font-display font-bold mb-[1.5vh]"
              style={{ fontSize: "2.6vw", color: "var(--slide-gold)" }}
            >
              Even / Odd
            </div>
            <div
              className="font-body text-muted leading-relaxed"
              style={{ fontSize: "2.1vw" }}
            >
              Predict whether the final digit of the closing price is even or odd.
            </div>
            <div className="flex gap-[0.8vw] mt-[2vh]">
              <div
                className="px-[1.2vw] py-[0.4vh] rounded-full font-body"
                style={{
                  fontSize: "1.8vw",
                  background: "rgba(240,136,62,0.12)",
                  color: "var(--slide-gold)",
                }}
              >
                E/O
              </div>
            </div>
          </div>

          <div
            className="p-[2.5vw] rounded-[0.8vw]"
            style={{
              background: "rgba(222,0,64,0.07)",
              border: "1px solid rgba(222,0,64,0.2)",
            }}
          >
            <div
              className="font-display font-bold mb-[1.5vh]"
              style={{ fontSize: "2.6vw", color: "var(--slide-accent)" }}
            >
              Matches / Differs
            </div>
            <div
              className="font-body text-muted leading-relaxed"
              style={{ fontSize: "2.1vw" }}
            >
              Predict exact digit match or predict it will differ from a chosen number.
            </div>
            <div className="flex gap-[0.8vw] mt-[2vh]">
              <div
                className="px-[1.2vw] py-[0.4vh] rounded-full font-body"
                style={{
                  fontSize: "1.8vw",
                  background: "rgba(222,0,64,0.12)",
                  color: "var(--slide-accent)",
                }}
              >
                M/D
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[3.5vh]">
          <div
            className="p-[2vw] rounded-[0.8vw]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-[1vw]">
              <span
                className="font-body text-muted"
                style={{ fontSize: "2vw" }}
              >
                Live digit history:
              </span>
              <div className="flex gap-[0.8vw]">
                <span className="font-display font-bold" style={{ fontSize: "2.6vw", color: "var(--slide-primary)" }}>7</span>
                <span className="font-display font-bold" style={{ fontSize: "2.6vw", color: "var(--slide-muted)" }}>2</span>
                <span className="font-display font-bold" style={{ fontSize: "2.6vw", color: "var(--slide-accent)" }}>9</span>
                <span className="font-display font-bold" style={{ fontSize: "2.6vw", color: "var(--slide-muted)" }}>4</span>
                <span className="font-display font-bold" style={{ fontSize: "2.6vw", color: "var(--slide-primary)" }}>7</span>
                <span className="font-display font-bold" style={{ fontSize: "2.6vw", color: "var(--slide-muted)" }}>1</span>
                <span className="font-display font-bold" style={{ fontSize: "2.6vw", color: "var(--slide-gold)" }}>5</span>
                <span className="font-display font-bold" style={{ fontSize: "2.6vw", color: "var(--slide-muted)" }}>3</span>
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
