export default function Slide01_Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(0,195,144,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 20%, rgba(240,136,62,0.06) 0%, transparent 60%), linear-gradient(135deg, #080c15 0%, #0d1521 100%)",
        }}
      />

      <div className="absolute top-0 right-0 w-[40vw] h-full overflow-hidden opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(0,195,144,0.3) 0px, rgba(0,195,144,0.3) 1px, transparent 1px, transparent 6vw), repeating-linear-gradient(0deg, rgba(0,195,144,0.3) 0px, rgba(0,195,144,0.3) 1px, transparent 1px, transparent 6vw)",
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="pl-[8vw] pr-[4vw] max-w-[58vw]">
          <div className="flex items-center gap-[1.5vw] mb-[3vh]">
            <div
              className="w-[3.5vw] h-[3.5vw] rounded-[0.6vw] flex items-center justify-center font-display font-bold"
              style={{
                background: "linear-gradient(135deg, #de0040, #9b0028)",
                fontSize: "1.4vw",
                color: "#fff",
              }}
            >
              DT
            </div>
            <span
              className="font-body tracking-widest uppercase"
              style={{ fontSize: "1.1vw", color: "var(--slide-muted)" }}
            >
              Deriv Digits Trading
            </span>
          </div>

          <h1
            className="font-display font-extrabold tracking-tight leading-none text-text"
            style={{ fontSize: "7.5vw", textWrap: "balance" }}
          >
            Trade smarter.
          </h1>
          <h1
            className="font-display font-extrabold tracking-tight leading-none"
            style={{ fontSize: "7.5vw", color: "var(--slide-primary)" }}
          >
            React faster.
          </h1>

          <div
            className="mt-[3vh] mb-[4vh]"
            style={{
              height: "2px",
              width: "12vw",
              background:
                "linear-gradient(90deg, var(--slide-primary), transparent)",
            }}
          />

          <p
            className="font-body text-muted leading-relaxed"
            style={{ fontSize: "2.2vw", maxWidth: "42vw", textWrap: "pretty" }}
          >
            Real-time digit prediction, Rise/Fall contracts, and automated
            execution — on web and mobile.
          </p>

          <div className="flex gap-[2vw] mt-[5vh]">
            <div
              className="px-[1.6vw] py-[0.8vh] rounded-full font-body font-medium"
              style={{
                fontSize: "1.8vw",
                background: "rgba(0,195,144,0.12)",
                color: "var(--slide-primary)",
                border: "1px solid rgba(0,195,144,0.3)",
              }}
            >
              Web
            </div>
            <div
              className="px-[1.6vw] py-[0.8vh] rounded-full font-body font-medium"
              style={{
                fontSize: "1.8vw",
                background: "rgba(0,195,144,0.12)",
                color: "var(--slide-primary)",
                border: "1px solid rgba(0,195,144,0.3)",
              }}
            >
              Mobile
            </div>
            <div
              className="px-[1.6vw] py-[0.8vh] rounded-full font-body font-medium"
              style={{
                fontSize: "1.8vw",
                background: "rgba(240,136,62,0.12)",
                color: "var(--slide-gold)",
                border: "1px solid rgba(240,136,62,0.3)",
              }}
            >
              Real-time
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[4vh] right-[4vw] flex gap-[1.5vw] items-end">
        <div className="text-right">
          <div
            className="font-display font-bold"
            style={{ fontSize: "8vw", color: "rgba(0,195,144,0.08)", lineHeight: 1 }}
          >
            0–9
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,195,144,0.4), rgba(240,136,62,0.3), transparent)",
        }}
      />
    </div>
  );
}
