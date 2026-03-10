import { Col, Row } from "antd";
import KpiCard from "../components/KpiData";
import RevenueChart from "../components/RevenueChart";
import RecentlyOrder from "../components/RecentlyOrders";

const KPI_DATA = [
  {
    label: "Doanh thu",
    icon: "💰",
    value: "2000000000",
    change: 18.2,
    up: true,
    bars: [28, 35, 32, 45, 42, 38, 50, 48, 55, 52, 60, 72],
    color: "#4f8ef7",
  },
  {
    label: "Đặt tiệc",
    icon: "📦",
    value: "3847",
    change: 7.4,
    up: true,
    bars: [120, 135, 110, 145, 160, 140, 175, 168, 180, 172, 190, 210],
    color: "#22d3a5",
  },
  {
    label: "Người dùng mới",
    icon: "👤",
    value: "1204",
    change: 3.1,
    up: false,
    bars: [80, 90, 75, 95, 88, 82, 78, 85, 70, 74, 68, 65],
    color: "#f97316",
  },
  {
    label: "Tỷ lệ chuyển đổi",
    icon: "🎯",
    value: "5.67%",
    change: 0.8,
    up: true,
    bars: [4.2, 4.5, 4.1, 4.8, 5.0, 4.7, 5.1, 5.3, 5.5, 5.4, 5.6, 5.7],
    color: "#a855f7",
  },
];
function DashboardPage() {
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

      <Row gutter={16}>
        <Col span={24}>
          <RecentlyOrder />
        </Col>
      </Row>
    </>
  );
}

export default DashboardPage;
