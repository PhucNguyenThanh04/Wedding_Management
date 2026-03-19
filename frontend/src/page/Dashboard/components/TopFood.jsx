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
import { getTopMenus } from "../../../apis/revenue.api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function formatVND(num) {
  return Number(num).toLocaleString("vi-VN") + "đ";
}

function formatShort(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return num.toString();
}

function TopMenus() {
  const { t } = useTheme();

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["top-menus"],
    queryFn: getTopMenus,
  });

  const items = apiData?.data?.items ?? [];

  const chartData = {
    labels: items.map((i) => i.menu_name),
    datasets: [
      {
        label: "Số lượt gọi",
        data: items.map((i) => i.total_ordered),
        backgroundColor: "rgba(79,142,247,0.75)",
        borderColor: "#4f8ef7",
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
        bodyColor: "#4f8ef7",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) =>
            `${ctx.raw} lượt  ·  ${formatVND(items[ctx.dataIndex]?.total_revenue ?? 0)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color:
            t.key === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)",
        },
        ticks: {
          color:
            t.key === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)",
          font: { size: 11 },
          callback: (v) => formatShort(v),
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
          Top món ăn bán chạy
        </div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
          Những món được gọi nhiều nhất
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

export default TopMenus;
