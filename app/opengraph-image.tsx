import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "56px",
        background:
          "radial-gradient(ellipse 80% 55% at 20% -10%, rgba(56,189,248,0.28), transparent 55%), radial-gradient(ellipse 60% 45% at 100% 0%, rgba(244,114,182,0.2), transparent 50%), linear-gradient(180deg, #050816 0%, #030406 50%, #020308 100%)",
        color: "#f4f4f5",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.4,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "-180px",
          top: "-160px",
          width: "520px",
          height: "520px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(56,189,248,0.32), rgba(56,189,248,0))",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "-180px",
          bottom: "-220px",
          width: "580px",
          height: "580px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(244,114,182,0.2), rgba(244,114,182,0))",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: "28px",
          padding: "40px 44px",
          background: "rgba(13, 17, 23, 0.7)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          backdropFilter: "blur(2px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 22,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(125, 211, 252, 0.95)",
            }}
          >
            Live telemetry
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: 82,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#f8fafc",
            }}
          >
            Cursor Dashboard
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: "880px",
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(228, 228, 231, 0.88)",
            }}
          >
            マウスカーソルのライブメトリクスとセッション可視化
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            {["Move trail", "Speed history", "Heatmap"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.06)",
                  padding: "10px 18px",
                  fontSize: 20,
                  color: "rgba(244,244,245,0.92)",
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 20,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(161,161,170,0.95)",
            }}
          >
            cursor-dashboard
          </p>
        </div>
      </div>
    </div>,
    size,
  );
}
