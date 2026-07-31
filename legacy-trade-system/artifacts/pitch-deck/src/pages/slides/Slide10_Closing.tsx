export default function Slide10_Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,195,144,0.09) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(240,136,62,0.06) 0%, transparent 50%), linear-gradient(160deg, #0d1521 0%, #080c15 100%)",
        }}
      />

      <div className="absolute top-0 left-0 w-[35vw] h-full overflow-hidden opacity-8">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(0,195,144,0.15) 0px, rgba(0,195,144,0.15) 1px, transparent 1px, transparent 6vw), repeating-linear-gradient(0deg, rgba(0,195,144,0.15) 0px, rgba(0,195,144,0.15) 1px, transparent 1px, transparent 6vw)",
          }}
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="w-[5vw] h-[5vw] rounded-[0.8vw] flex items-center justify-center font-display font-bold mb-[3vh]"
          style={{
            background: "linear-gradient(135deg, #de0040, #9b0028)",
            fontSize: "2vw",
            color: "#fff",
          }}
        >
          DT
        </div>

        <h1
          className="font-display font-extrabold tracking-tight leading-none text-text text-center"
          style={{ fontSize: "7vw" }}
        >
          Deriv Digits
        </h1>
        <h1
          className="font-display font-extrabold tracking-tight leading-none text-center"
          style={{ fontSize: "7vw", color: "var(--slide-primary)" }}
        >
          Trading
        </h1>

        <div
          className="mt-[3vh] mb-[3vh]"
          style={{
            height: "2px",
            width: "10vw",
            background:
              "linear-gradient(90deg, transparent, var(--slide-primary), transparent)",
          }}
        />

        <p
          className="font-body text-center"
          style={{
            fontSize: "2.4vw",
            color: "var(--slide-muted)",
            maxWidth: "40vw",
            textWrap: "balance",
          }}
        >
          Precision tools for high-frequency binary options — web and mobile, built for traders who act fast.
        </p>

        <div className="flex gap-[3vw] mt-[5vh]">
          <div className="text-center">
            <div
              className="font-body uppercase tracking-widest mb-[0.8vh]"
              style={{ fontSize: "1.2vw", color: "var(--slide-muted)" }}
            >
              Web
            </div>
            <div
              className="font-body"
              style={{ fontSize: "2vw", color: "var(--slide-primary)" }}
            >
              Available now
            </div>
          </div>
          <div
            style={{
              width: "1px",
              height: "6vh",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <div className="text-center">
            <div
              className="font-body uppercase tracking-widest mb-[0.8vh]"
              style={{ fontSize: "1.2vw", color: "var(--slide-muted)" }}
            >
              iOS + Android
            </div>
            <div
              className="font-body"
              style={{ fontSize: "2vw", color: "var(--slide-gold)" }}
            >
              Available now
            </div>
          </div>
          <div
            style={{
              width: "1px",
              height: "6vh",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <div className="text-center">
            <div
              className="font-body uppercase tracking-widest mb-[0.8vh]"
              style={{ fontSize: "1.2vw", color: "var(--slide-muted)" }}
            >
              Powered by
            </div>
            <div
              className="font-body"
              style={{ fontSize: "2vw", color: "var(--slide-text)" }}
            >
              Deriv API
            </div>
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
