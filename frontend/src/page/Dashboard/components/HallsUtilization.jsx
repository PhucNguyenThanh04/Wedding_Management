import { Card } from "antd";
import { useTheme } from "../../../context/themeContext";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getHallsUtilization } from "../../../apis/revenue.api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function HallsUtilization() {
  const { t } = useTheme();

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["halls-utilization"],
    queryFn: getHallsUtilization,
  });

  const items = apiData?.data?.items ?? [];

  const chartData = {
    labels: items.map((i) => i.hall_name),
    datasets: [
      {
        label: "Tỷ lệ sử dụng (%)",
        data: items.map((i) => Number(i.utilization_rate).toFixed(1)),
        backgroundColor: "rgba(34,211,165,0.75)",
        borderColor: "#22d3a5",
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: t.key === "light" ? "#1e293b" : "#f1f5f9",
        titleColor: t.key === "light" ? "#fff" : "#1e293b",
        bodyColor: "#22d3a5",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) =>
            `${ctx.raw}%  ·  ${items[ctx.dataIndex]?.total_bookings ?? 0} lượt đặt`,
        },
      },
    },
    scales: {
      x: {
        max: 100,
        grid: {
          color:
            t.key === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)",
        },
        ticks: {
          color:
            t.key === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)",
          font: { size: 11 },
          callback: (v) => `${v}%`,
        },
      },
      y: {
        grid: { display: false },
        ticks: {
          color:
            t.key === "light" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)",
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <Card
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        transition: "background .3s",
        height: "100%",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>
          Tỷ lệ sử dụng sảnh
        </div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
          Mức độ đặt sảnh theo từng khu vực
        </div>
      </div>

      {isLoading ? (
        <div
          style={{
            height: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: t.textMuted,
          }}
        >
          Đang tải...
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            height: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: t.textMuted,
          }}
        >
          Không có dữ liệu
        </div>
      ) : (
        <div style={{ height: 260 }}>
          <Bar data={chartData} options={options} />
        </div>
      )}
    </Card>
  );
}

export default HallsUtilization;
