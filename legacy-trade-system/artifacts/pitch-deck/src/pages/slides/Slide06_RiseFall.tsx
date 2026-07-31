export default function Slide06_RiseFall() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 10% 50%, rgba(0,195,144,0.07) 0%, transparent 55%), radial-gradient(ellipse 40% 50% at 90% 60%, rgba(222,0,64,0.05) 0%, transparent 50%), linear-gradient(135deg, #080c15 0%, #0d1521 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-center px-[8vw]">
        <div className="mb-[2vh]">
          <span
            className="font-body uppercase tracking-widest"
            style={{ fontSize: "1.2vw", color: "var(--slide-muted)" }}
          >
            Core Feature
          </span>
        </div>

        <h2
          className="font-display font-bold tracking-tight text-text leading-tight mb-[1.5vh]"
          style={{ fontSize: "5vw" }}
        >
          Rise / Fall Trading
        </h2>

        <div
          className="mb-[4vh]"
          style={{
            height: "2px",
            width: "6vw",
            background: "linear-gradient(90deg, var(--slide-primary), transparent)",
          }}
        />

        <div className="grid grid-cols-2 gap-[3vw] mb-[3vh]">
          <div
            className="p-[2.5vw] rounded-[0.8vw]"
            style={{
              background: "rgba(0,195,144,0.07)",
              border: "1px solid rgba(0,195,144,0.2)",
            }}
          >
            <div
              className="font-display font-extrabold"
              style={{ fontSize: "5vw", color: "var(--slide-primary)" }}
            >
              RISE
            </div>
            <div
              className="font-body text-muted mt-[1vh]"
              style={{ fontSize: "2.2vw" }}
            >
              Exit price higher than entry price at contract expiry.
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
              className="font-display font-extrabold"
              style={{ fontSize: "5vw", color: "var(--slide-accent)" }}
            >
              FALL
            </div>
            <div
              className="font-body text-muted mt-[1vh]"
              style={{ fontSize: "2.2vw" }}
            >
              Exit price lower than entry price at contract expiry.
            </div>
          </div>
        </div>

        <div
          className="p-[2vw] rounded-[0.8vw]"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-[4vw]">
            <div>
              <div
                className="font-body text-muted"
                style={{ fontSize: "1.8vw" }}
              >
                Real-time trend indicator
              </div>
              <div className="flex items-baseline gap-[1vw] mt-[0.5vh]">
                <span
                  className="font-display font-bold"
                  style={{ fontSize: "3.5vw", color: "var(--slide-primary)" }}
                >
                  64%
                </span>
                <span
                  className="font-body"
                  style={{ fontSize: "2.2vw", color: "var(--slide-primary)" }}
                >
                  RISE
                </span>
              </div>
            </div>
            <div
              style={{
                width: "1px",
                height: "6vh",
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <div>
              <div
                className="font-body text-muted"
                style={{ fontSize: "1.8vw" }}
              >
                Current streak
              </div>
              <div className="flex items-baseline gap-[0.8vw] mt-[0.5vh]">
                <span
                  className="font-display font-bold"
                  style={{ fontSize: "3.5vw", color: "var(--slide-primary)" }}
                >
                  3×
                </span>
                <span
                  className="font-body"
                  style={{ fontSize: "2.2vw", color: "var(--slide-primary)" }}
                >
                  UP
                </span>
              </div>
            </div>
            <div
              style={{
                width: "1px",
                height: "6vh",
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <div>
              <div
                className="font-body text-muted"
                style={{ fontSize: "1.8vw" }}
              >
                Duration options
              </div>
              <div className="flex items-baseline gap-[0.8vw] mt-[0.5vh]">
                <span
                  className="font-display font-bold"
                  style={{ fontSize: "3.5vw", color: "var(--slide-text)" }}
                >
                  1–10
                </span>
                <span
                  className="font-body"
                  style={{ fontSize: "2.2vw", color: "var(--slide-muted)" }}
                >
                  ticks
                </span>
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
            "linear-gradient(90deg, transparent, rgba(0,195,144,0.3), rgba(222,0,64,0.3), transparent)",
        }}
      />
    </div>
  );
}
