import { useTheme } from "../../../context/themeContext";
import MiniSparkBars from "./MiniSparkBars";

function KpiCard({ data, index }) {
  const { t } = useTheme();
  const topGradients = ["#4f8ef7", "#22d3a5", "#f97316", "#f43f5e"];

  return (
    <div
      style={{
        position: "relative",
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        padding: 20,
        overflow: "hidden",
        cursor: "default",
        transition: "border-color .2s, transform .2s, background .3s",
        animation: "fadeUp .4s ease both",
        animationDelay: `${0.05 * (index + 1)}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: topGradients[index],
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: ".5px",
            textTransform: "uppercase",
            color: t.textMuted,
          }}
        >
          {data.label}
        </span>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            background: data.color + "22",
          }}
        >
          {data.icon}
        </div>
      </div>

      <div
        style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: "-1px",
          lineHeight: 1,
          marginBottom: 4,
          color: t.color,
        }}
      >
        {data.value}
      </div>

      <MiniSparkBars values={data.bars} color={data.color} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 8,
          fontSize: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            padding: "2px 6px",
            borderRadius: 4,
          }}
          className={`${data.up ? "text-green-700" : "text-red-700"} ${
            data.up ? "bg-green-50" : "bg-red-50"
          }`}
        >
          {data.up ? "↑" : "↓"} {data.change}%
        </span>
        <span style={{ color: t.textMuted }}>so với tháng trước</span>
      </div>
    </div>
  );
}

export default KpiCard;
