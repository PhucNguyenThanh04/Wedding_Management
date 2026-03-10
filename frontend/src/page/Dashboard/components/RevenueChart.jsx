import { Card, Space, Typography } from "antd";
import { useTheme } from "../../../context/themeContext";

function RevenueChart() {
  const { t } = useTheme();
  const { Text } = Typography;
  const months = [
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
    "T1",
    "T2",
  ];
  const xPos = months.map((_, i) => Math.round(i * (600 / 11)));
  const textAlpha =
    t.key === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)";
  const gridAlpha =
    t.key === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";

  return (
    <Card
      bordered={false}
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        transition: "background .3s",
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>
            Tổng quan doanh thu
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
            Biến động 12 tháng gần nhất
          </div>
        </div>
        <Space size={16}>
          <Text style={{ fontSize: 16, fontWeight: 600, color: "#4f8ef7" }}>
            ● Doanh thu
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 600, color: "#22d3a5" }}>
            ● Lợi nhuận
          </Text>
        </Space>
      </div>
      <svg
        viewBox="0 0 600 180"
        height={280}
        style={{ width: "100%", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f8ef7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3a5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22d3a5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[36, 72, 108, 144].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="600"
            y2={y}
            stroke={gridAlpha}
            strokeWidth="1"
          />
        ))}
        <path
          d="M0,120 C30,110 60,90 100,80 C140,70 160,55 200,45 C240,35 260,50 300,40 C340,30 360,20 400,28 C440,36 460,15 500,10 C530,7 560,12 600,8 L600,180 L0,180Z"
          fill="url(#g1)"
        />
        <path
          d="M0,150 C30,145 60,138 100,130 C140,122 160,115 200,108 C240,101 260,110 300,100 C340,90 360,75 400,78 C440,81 460,65 500,60 C530,56 560,60 600,55 L600,180 L0,180Z"
          fill="url(#g2)"
        />
        <path
          d="M0,120 C30,110 60,90 100,80 C140,70 160,55 200,45 C240,35 260,50 300,40 C340,30 360,20 400,28 C440,36 460,15 500,10 C530,7 560,12 600,8"
          fill="none"
          stroke="#4f8ef7"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0,150 C30,145 60,138 100,130 C140,122 160,115 200,108 C240,101 260,110 300,100 C340,90 360,75 400,78 C440,81 460,65 500,60 C530,56 560,60 600,55"
          fill="none"
          stroke="#22d3a5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="500" cy="10" r="4" fill="#4f8ef7" />
        <circle cx="500" cy="60" r="4" fill="#22d3a5" />
        {months.map((m, i) => (
          <text
            key={m}
            x={xPos[i]}
            y="175"
            fill={textAlpha}
            fontSize="9"
            fontFamily="sans-serif"
          >
            {m}
          </text>
        ))}
      </svg>
    </Card>
  );
}

export default RevenueChart;
