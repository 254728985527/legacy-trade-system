export default function Slide08_Platforms() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #080c15 0%, #0d1521 50%, #080c15 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-center px-[8vw]">
        <div className="text-center mb-[2vh]">
          <span
            className="font-body uppercase tracking-widest"
            style={{ fontSize: "1.2vw", color: "var(--slide-muted)" }}
          >
            Platform Parity
          </span>
        </div>

        <h2
          className="font-display font-bold tracking-tight text-text leading-tight text-center mb-[1.5vh]"
          style={{ fontSize: "5vw" }}
        >
          Web + Mobile
        </h2>

        <div
          className="mb-[4vh] mx-auto"
          style={{
            height: "2px",
            width: "6vw",
            background: "linear-gradient(90deg, transparent, var(--slide-primary), transparent)",
          }}
        />

        <div className="grid grid-cols-2 gap-[4vw]">
          <div
            className="p-[3vw] rounded-[1vw]"
            style={{
              background: "rgba(0,195,144,0.05)",
              border: "1px solid rgba(0,195,144,0.18)",
            }}
          >
            <div
              className="font-display font-bold mb-[2vh]"
              style={{ fontSize: "3.2vw", color: "var(--slide-primary)" }}
            >
              Web App
            </div>

            <div className="flex flex-col gap-[1.5vh]">
              <div className="flex items-center gap-[1.2vw]">
                <div
                  className="w-[0.5vw] h-[0.5vw] rounded-full shrink-0"
                  style={{ background: "var(--slide-primary)" }}
                />
                <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-muted)" }}>
                  React + Tailwind, mobile-first layout
                </span>
              </div>
              <div className="flex items-center gap-[1.2vw]">
                <div
                  className="w-[0.5vw] h-[0.5vw] rounded-full shrink-0"
                  style={{ background: "var(--slide-primary)" }}
                />
                <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-muted)" }}>
                  Live price chart with 150-tick sparkline
                </span>
              </div>
              <div className="flex items-center gap-[1.2vw]">
                <div
                  className="w-[0.5vw] h-[0.5vw] rounded-full shrink-0"
                  style={{ background: "var(--slide-primary)" }}
                />
                <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-muted)" }}>
                  Tab-based trade type selector
                </span>
              </div>
              <div className="flex items-center gap-[1.2vw]">
                <div
                  className="w-[0.5vw] h-[0.5vw] rounded-full shrink-0"
                  style={{ background: "var(--slide-primary)" }}
                />
                <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-muted)" }}>
                  Multi-account switcher (Demo / Real)
                </span>
              </div>
            </div>
          </div>

          <div
            className="p-[3vw] rounded-[1vw]"
            style={{
              background: "rgba(240,136,62,0.05)",
              border: "1px solid rgba(240,136,62,0.18)",
            }}
          >
            <div
              className="font-display font-bold mb-[2vh]"
              style={{ fontSize: "3.2vw", color: "var(--slide-gold)" }}
            >
              Mobile App
            </div>

            <div className="flex flex-col gap-[1.5vh]">
              <div className="flex items-center gap-[1.2vw]">
                <div
                  className="w-[0.5vw] h-[0.5vw] rounded-full shrink-0"
                  style={{ background: "var(--slide-gold)" }}
                />
                <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-muted)" }}>
                  React Native (Expo), iOS + Android
                </span>
              </div>
              <div className="flex items-center gap-[1.2vw]">
                <div
                  className="w-[0.5vw] h-[0.5vw] rounded-full shrink-0"
                  style={{ background: "var(--slide-gold)" }}
                />
                <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-muted)" }}>
                  Haptic feedback on every trade action
                </span>
              </div>
              <div className="flex items-center gap-[1.2vw]">
                <div
                  className="w-[0.5vw] h-[0.5vw] rounded-full shrink-0"
                  style={{ background: "var(--slide-gold)" }}
                />
                <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-muted)" }}>
                  SF Symbols + Feather icons, native feel
                </span>
              </div>
              <div className="flex items-center gap-[1.2vw]">
                <div
                  className="w-[0.5vw] h-[0.5vw] rounded-full shrink-0"
                  style={{ background: "var(--slide-gold)" }}
                />
                <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-muted)" }}>
                  Bottom tab navigation, BlurView iOS
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-[3.5vh] p-[2vw] rounded-[0.8vw] text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            className="font-body"
            style={{ fontSize: "2.2vw", color: "var(--slide-muted)" }}
          >
            Identical features, shared design system, consistent dark fintech aesthetic on both platforms
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,195,144,0.3), rgba(240,136,62,0.3), transparent)",
        }}
      />
    </div>
  );
}
