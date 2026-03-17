import { Card, Space, Segmented } from "antd";
import { useTheme } from "../../../context/themeContext";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getRevenue } from "../../../apis/revenue.api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function formatVND(num) {
  return Number(num).toLocaleString("vi-VN") + "đ";
}

function formatShort(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return num.toString();
}

function RevenueChart() {
  const { t } = useTheme();
  const periodType = "month";
  const currentYear = new Date().getFullYear();

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["revenue", periodType, currentYear],
    queryFn: () => getRevenue({ period_type: periodType, year: currentYear }),
  });

  const items = apiData?.data?.items ?? [];
  const grandTotal = apiData?.data?.grand_total
    ? Number(apiData.data.grand_total)
    : null;

  const chartData = useMemo(
    () => ({
      labels: items.map((i) => i.period),
      datasets: [
        {
          label: "Doanh thu",
          data: items.map((i) => Number(i.total_revenue)),
          borderColor: "#4f8ef7",
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: canvas, chartArea } = chart;
            if (!chartArea) return "rgba(79,142,247,0.15)";
            const gradient = canvas.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            gradient.addColorStop(0, "rgba(79,142,247,0.25)");
            gradient.addColorStop(1, "rgba(79,142,247,0)");
            return gradient;
          },
          borderWidth: 1,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#4f8ef7",
          pointBorderWidth: 2,
        },
      ],
    }),
    [items],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
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
              `${formatVND(ctx.raw)}  ·  ${items[ctx.dataIndex]?.total_orders ?? 0} đơn`,
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
          },
        },
        y: {
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
      },
    }),
    [t, items],
  );

  return (
    <Card
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        transition: "background .3s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>
            Tổng quan doanh thu
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
            {periodType === "month" ? "Theo tháng" : "Theo quý"} — {currentYear}
            {grandTotal !== null && (
              <span
                style={{ marginLeft: 8, color: "#4f8ef7", fontWeight: 600 }}
              >
                Tổng: {formatVND(grandTotal)}
              </span>
            )}
          </div>
        </div>

        <Space size={12} wrap>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#4f8ef7" }}>
            ● Doanh thu
          </span>
        </Space>
      </div>

      {isLoading ? (
        <div
          style={{
            height: 280,
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
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: t.textMuted,
          }}
        >
          Không có dữ liệu
        </div>
      ) : (
        <div style={{ height: 280 }}>
          <Line data={chartData} options={options} />
        </div>
      )}
    </Card>
  );
}

export default RevenueChart;
