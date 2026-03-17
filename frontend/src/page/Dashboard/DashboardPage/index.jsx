import { Col, Row } from "antd";
import KpiCard from "../components/KpiData";
import RevenueChart from "../components/RevenueChart";
import { useQuery } from "@tanstack/react-query";
import { getOrdersSummary, getRevenue } from "../../../apis/revenue.api";
import TopMenus from "../components/TopFood";
import HallsUtilization from "../components/HallsUtilization";
import StaffPerformance from "../components/StaffPerformance";

function DashboardPage() {
  const currentYear = new Date().getFullYear();

  const { data: revenueData } = useQuery({
    queryKey: ["revenue", "month", currentYear],
    queryFn: () => getRevenue({ period_type: "month", year: currentYear }),
  });
  const revenue = revenueData?.data ?? null;

  const { data: summaryData } = useQuery({
    queryKey: ["orders-summary"],
    queryFn: () => getOrdersSummary(),
  });
  const summary = summaryData?.data ?? null;

  const grandTotal = Number(revenue?.grand_total ?? 0);
  const totalOrders = summary?.total_orders ?? 0;
  const completed = summary?.completed ?? 0;

  const conversionRate =
    totalOrders > 0 ? ((completed / totalOrders) * 100).toFixed(1) : "0.0";

  const KPI_DATA = [
    {
      label: "Doanh thu",
      icon: "💰",
      value:
        grandTotal >= 1_000_000
          ? (grandTotal / 1_000_000).toFixed(1) + "M"
          : grandTotal.toLocaleString("vi-VN"),
      change: 0,
      up: true,
      bars: revenue?.items?.map((i) => Number(i.total_revenue)) ?? [],
      color: "#4f8ef7",
    },
    {
      label: "Tổng đơn",
      icon: "📦",
      value: totalOrders.toLocaleString("vi-VN"),
      change: 0,
      up: true,
      bars: [
        summary?.booking_pending ?? 0,
        summary?.confirmed ?? 0,
        summary?.in_progress ?? 0,
        summary?.completed ?? 0,
        summary?.cancelled ?? 0,
        summary?.invoiced ?? 0,
      ],
      color: "#22d3a5",
    },
    {
      label: "Hoàn thành",
      icon: "✅",
      value: completed.toLocaleString("vi-VN"),
      change: 0,
      up: true,
      bars: [],
      color: "#f97316",
    },
    {
      label: "Tỷ lệ hoàn thành",
      icon: "🎯",
      value: `${conversionRate}%`,
      change: 0,
      up: Number(conversionRate) >= 50,
      bars: [],
      color: "#a855f7",
    },
  ];

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {KPI_DATA.map((d, i) => (
          <Col key={d.label} span={6}>
            <KpiCard data={d} index={i} />
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <RevenueChart />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <TopMenus />
        </Col>
        <Col span={12}>
          <HallsUtilization />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <StaffPerformance />
        </Col>
      </Row>
    </>
  );
}

export default DashboardPage;
